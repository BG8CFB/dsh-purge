/**
 * dsh-purge 客户端入口（ModuleLoader 工厂产物）。
 *
 * 官方形态：export const inject 声明所需服务，apply(ctx) 里
 * locale.register 注册词典、sidebarRightTabs 注册页签类型、
 * slots.inject 把组件接进五个官方槽位：
 *   - settings.section                     设置页（人格 / 规则集 / 技能 / 更新）
 *   - sidebar.right.pane.tab               右侧栏页签（key: dsh-purge；红队演练台 key: redteam）
 *   - conversation.input.right             输入框右侧「安全回退」按钮
 *   - conversation.session.header.utilities 会话头「dsh-purge」按钮
 *   - shell.overlay                        全局操作反馈 Toast
 *
 * 类型说明：@deepseek-ai/* 仅存在于宿主，不进本包依赖；
 * 这里用结构化最小类型描述用到的 ctx 表面（类型在构建时被擦除，
 * 打包后除 react 外无任何 require，见 scripts/verify-client-externals.mjs）。
 */

// —— 结构化最小 ctx 类型（只描述本插件真正触碰的表面） ——

/** 翻译函数：t(key, params?)，{name} 占位由宿主替换。 */
export type Translate = (key: string, params?: Record<string, string | number>) => string

/** 可释放句柄（cordis 各类注册的返回值）。 */
interface Disposable {
  (): void
}

/** 槽位登记选项（116 槽契约中本插件用到的字段）。 */
interface SlotOptions {
  name: string
  id?: string
  key?: string
  order?: number
  label?: string | (() => string)
  /** 槽位注入面：seat 调用时按位置传参（session 槽位首参为 sessionId）。 */
  inject?: (...args: unknown[]) => Record<string, unknown>
}

/** slots 服务：inject 把注册挂到某个槽位，register 产出登记句柄。 */
interface SlotsService {
  inject: (name: string, register: () => Disposable) => Disposable
  register: (options: SlotOptions, component: unknown) => Disposable
  entries: (name: string) => Iterable<{ store?: { create?: () => unknown } }>
}

/** locale 服务：register 注册词典（返回反注册），bind 取绑定翻译函数。 */
interface LocaleService {
  register: (ns: string, dicts: Record<string, Record<string, string>>) => Disposable
  bind: (ns: string) => Translate
}

/** sidebarRightTabs 服务：声明一种页签类型（id 全局唯一，kind 是 openTab 的名字）。 */
interface SidebarRightTabsService {
  register: (definition: { id: string; kind: string; title: (address: string) => string }) => Disposable
}

/** sidebarRight 服务：右侧栏导航控制器。 */
interface SidebarRightService {
  openTab: (kind: string) => void
}

/** 客户端插件 ctx（结构化子集；右侧栏两服务在老宿主上可能不存在，软取）。 */
interface ClientContext {
  effect: (fn: () => unknown, label?: string) => unknown
  slots: SlotsService
  locale: LocaleService
  sidebarRightTabs?: SidebarRightTabsService
  sidebarRight?: SidebarRightService
}

import { NS, zh, en } from './locale.ts'
import { createNotices, installStyles, Toast, type NoticeSource } from './shared/ui.ts'
import { PurgeSettings } from './settings/PurgeSettings.tsx'
import { PurgePanel } from './panel/PurgePanel.tsx'
import { RewindSafe } from './panel/RewindSafe.tsx'
import { HeaderButton } from './panel/HeaderButton.tsx'
import { RT_NS, zh as rtZh, en as rtEn } from './redteam/locale.ts'
import { RedteamTab } from './redteam/RedteamTab.tsx'
import { installRtStyles } from './redteam/styles.ts'

/** 右侧栏页签 kind（openTab 与页签登记共用；与 key 同名）。 */
const TAB_KIND = 'dsh-purge'

/** 红队演练台页签 kind（openTab 目标；槽位 key 固定为 redteam）。 */
const REDTEAM_TAB_KIND = 'dsh-purge-redteam'

/** 声明依赖的客户端服务（右侧栏两服务软取：老宿主没有时面板降级，不悬空整个 client）。 */
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  // 右侧栏服务软取（Cordis Proxy 未声明的服务点属性会抛）。
  const sidebarRightTabs: SidebarRightTabsService | undefined = (() => {
    try { return ctx.sidebarRightTabs } catch { return undefined }
  })()
  const sidebarRight: SidebarRightService | undefined = (() => {
    try { return ctx.sidebarRight } catch { return undefined }
  })()
  const hasRightRail = sidebarRightTabs !== undefined
  // 词典：注册进宿主 locale 服务，随插件卸载反注册（主面板 + 红队演练台两个命名空间）
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-purge: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(RT_NS, { zh: rtZh, en: rtEn }), 'dsh-purge: redteam dictionaries')
  const trt = ctx.locale.bind(RT_NS)

  // 样式：<style data-dshp-style> 一次安装，卸载时移除（演练台样式同理）
  ctx.effect(installStyles, 'dsh-purge: styles')
  ctx.effect(installRtStyles, 'dsh-purge: redteam styles')

  // 全局通知源：shell.overlay 的 Toast 与各面板共享
  const notices: NoticeSource = createNotices()

  // 打开红队演练台页签（PurgePanel 入口按钮用；无右侧栏服务时降级跳设置页）
  const openDrill = (): void => {
    if (sidebarRight !== undefined) {
      try {
        sidebarRight.openTab(REDTEAM_TAB_KIND)
        return
      } catch { /* 落到降级 */ }
    }
    openSettingsSection()
  }

  // 设置页（settings.section）：导航 label 走 thunk，随语言切换重读
  ctx.slots.inject('settings.section', () => ctx.slots.register(
    {
      name: 'settings.section', id: NS, order: 90,
      label: () => t('settings.title'),
      inject: () => ({ t, notices }),
    },
    PurgeSettings,
  ))

  // 右侧栏页签类型 + 页签主体（照 forge 范例：先声明类型，再挂 keyed 槽位）
  // 老宿主无右侧栏服务时整组跳过（设置页/输入框按钮/会话头按钮仍可用）。
  if (hasRightRail && sidebarRightTabs !== undefined) {
    ctx.effect(() => sidebarRightTabs.register({
      id: NS, kind: TAB_KIND, title: () => t('panel.title'),
    }), 'dsh-purge: sidebar tab type')
    ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
      {
        name: 'sidebar.right.pane.tab', key: NS,
        inject: (sessionId?: string) => ({ t, sessionId, notices, openDrill }),
      },
      PurgePanel,
    ))

    // 红队演练台页签（key: redteam，与 dsh-purge 页签并列；op 走 POST /redteam/api）
    ctx.effect(() => sidebarRightTabs.register({
      id: RT_NS, kind: REDTEAM_TAB_KIND, title: () => trt('rt.title'),
    }), 'dsh-purge: redteam tab type')
    ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
      {
        name: 'sidebar.right.pane.tab', key: 'redteam',
        inject: (sessionId?: string) => ({ t: trt, sessionId, notices }),
      },
      RedteamTab,
    ))
  }

  // 输入框右侧「安全回退」按钮（session 槽位首参为 sessionId）
  ctx.slots.inject('conversation.input.right', () => ctx.slots.register(
    {
      name: 'conversation.input.right', id: 'dsh-purge.rewind', order: 100,
      inject: (sessionId?: string) => ({ t, sessionId: sessionId ?? '', notices }),
    },
    RewindSafe,
  ))

  // 会话头「dsh-purge」按钮：打开右侧栏面板；打开服务不可达时降级跳设置页
  const openSettingsSection = (): void => {
    try {
      for (const entry of ctx.slots.entries('sidebar.settings')) {
        const store = entry.store
        if (typeof store?.create !== 'function') continue
        const shell = store.create() as { actions?: { openSection?: (id: string) => void } } | undefined
        const actions = shell?.actions
        // 两次 create 得同一实例才算设置外壳的句柄（照 dsh-tokens-anywhere 范例）
        if (typeof actions?.openSection !== 'function' || store.create() !== shell) continue
        actions.openSection(NS)
        return
      }
    } catch {
      // 设置外壳也不可达：放弃降级
    }
  }
  const openPanel = (): void => {
    if (sidebarRight !== undefined) {
      try {
        sidebarRight.openTab(TAB_KIND)
        return
      } catch { /* 落到降级 */ }
    }
    openSettingsSection()
  }
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register(
    {
      name: 'conversation.session.header.utilities', id: NS, order: -8,
      inject: () => ({ t, openPanel }),
    },
    HeaderButton,
  ))

  // 通知浮层（shell.overlay）：右下角 Toast，承载全插件操作反馈
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    {
      name: 'shell.overlay', id: 'dsh-purge.toast',
      inject: () => ({ source: notices }),
    },
    Toast,
  ))
}
