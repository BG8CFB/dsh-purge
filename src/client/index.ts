/**
 * dsh-purge 客户端入口（ModuleLoader 工厂产物）。
 *
 * 入口分三层，全部挂在官方扩展点上：
 *   1. 常驻主面板（main，root 作用域，key: dsh-purge）——左侧栏「破甲」图标进入；
 *      新会话没有会话上下文时同样可用，宽度归主列所有（总览 / 红队演练台）。
 *      全局配置（人格 / 规则集 / 技能 / 更新）只在设置分区，面板右上 ⚙ 深链过去。
 *   2. 会话内的轻量入口：
 *      - sidebar.right.pane.tab（key: dsh-purge）状态卡 + 回退 + 打开演练台；
 *      - sidebar.right.pane.tab（key: dsh-purge-redteam）红队页签本体（与类型 id 同名）；
 *      - conversation.session.header.utilities 会话头按钮；
 *      - conversation.input.right 输入框「安全回退」按钮。
 *   3. settings.section 设置分区 + shell.overlay（Toast + 全局确认框）。
 *
 * 关键契约（rc.3 实测）：
 *   - sidebar.right.pane.tab 是 keyed 槽位，分发键是页签类型定义的 **id**，
 *     不是 kind —— key 与 id 不同名时页签打开后为空（红队页签曾因此白屏）。
 *   - 右侧栏页签本体由宿主页签条打开；插件只声明页签类型，不再自己 openTab
 *     （openTab 是 session 级命令，无 on-screen 会话时会 throw）。
 *   - 组件样式只用宿主 design-platform.css 里真实存在的 --dsw-alias-* 语义变量；
 *     brand-primary 在暗色主题是近白色，不能当填充色用。
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

/** layout 服务（root 级全局主面板选择器；软取，宿主缺省时降级）。 */
interface LayoutService {
  selectPanel?: (id: string | null) => void
}

/** 客户端插件 ctx（结构化子集；用到的服务全部写进 inject 声明）。 */
interface ClientContext {
  effect: (fn: () => unknown, label?: string) => unknown
  slots: SlotsService
  locale: LocaleService
  /** 可选服务读取（兜底；主路径走 inject 注入的属性）。 */
  get?: (name: string) => unknown
  sidebarRightTabs?: SidebarRightTabsService
  /** 会话/工作区导航（新建红队会话、切工作区、关闭全局面板都要它）。 */
  uiWorkspace?: UiWorkspaceLike
  /** 工作区注册表（把项目目录登记成工作区）。 */
  workspaces?: WorkspacesLike
  /** 全局面板选择器（进入演练后关闭面板回对话）。 */
  layout?: LayoutService
}

/** ui-workspace 客户端服务的最小表面。 */
interface UiWorkspaceLike {
  startSession?: (workspaceId?: unknown, options?: Record<string, unknown>) => void
  openWorkspace?: (workspaceId: string, beforeOpen?: unknown, options?: Record<string, unknown>) => Promise<void>
  connectWorkspace?: (workspaceId: string, options?: Record<string, unknown>) => Promise<string>
  openSession?: (sessionId: string) => void
}

/** workspaces 服务的最小表面。 */
interface WorkspacesLike {
  create?: (input: { path: string }) => Promise<{ workspaceId?: string; path?: string; title?: string }>
  rename?: (workspaceId: string, title: string) => Promise<unknown>
  delete?: (workspaceId: string) => Promise<void>
  list?: { getSnapshot?: () => { items?: Array<{ workspaceId?: string; id?: string; path?: string; title?: string }> } }
}

import { NS, zh, en } from './locale.ts'
import { createNotices, installStyles, Toast, type NoticeSource } from './shared/ui.ts'
import { DialogHost } from './shared/dialogs.tsx'
import { PurgeSettings } from './settings/PurgeSettings.tsx'
import { PurgePanel } from './panel/PurgePanel.tsx'
import { RewindSafe } from './panel/RewindSafe.tsx'
import { DrillNewSession } from './panel/DrillNewSession.tsx'
import { DrillBadge } from './panel/DrillBadge.tsx'
import { PurgeMain } from './main/PurgeMain.tsx'
import { PurgeIcon } from './main/PurgeIcon.tsx'
import { createMainNav } from './main/nav.ts'
import { RT_NS, zh as rtZh, en as rtEn } from './redteam/locale.ts'
import { BLUE_NS, zhBlue, enBlue } from './blue/locale.ts'
import { rtOp } from './redteam/api.ts'
import { blueOp } from './blue/api.ts'
import { RedteamTab } from './redteam/RedteamTab.tsx'
import { installRtStyles } from './redteam/styles.ts'

/** 全局主面板 id（main 槽位 key 与 sidebar.panellist id 必须同名）。 */
const PANEL_ID = NS

/** 右侧栏页签 kind（openTab 与页签登记共用；与 id 同名）。 */
const TAB_KIND = NS

/** 红队演练台页签 kind（与类型 id 同名，keyed 槽位按 id 分发）。 */
const REDTEAM_TAB_KIND = RT_NS

/**
 * 声明依赖的客户端服务。sidebarRightTabs 必须显式声明：
 * cordis 对未 inject 的服务访问必抛（cannot get property without inject），
 * try/catch 软取只会拿到 undefined，右侧栏页签会静默不注册。
 * 宿主模块预载由 package.json 的 dsh.client.inject 保证（含 ui-sidebar-right）。
 */
export const inject = ['slots', 'locale', 'sidebarRightTabs']

export function apply(ctx: ClientContext): void {
  // 右侧栏服务软取（Cordis Proxy 未声明的服务点属性会抛）。
  const sidebarRightTabs: SidebarRightTabsService | undefined = (() => {
    try { return ctx.sidebarRightTabs } catch { return undefined }
  })()
  const hasRightRail = sidebarRightTabs !== undefined
  // layout 是 root 级全局面板选择器；宿主缺省时主面板仍在侧栏可点，仅按钮无法直接跳转。
  const layout: LayoutService | undefined = (() => {
    try {
      const injected = ctx.layout
      if (injected !== undefined && injected !== null && typeof injected === 'object') return injected
    } catch { /* 落到 ctx.get */ }
    try {
      const value = typeof ctx.get === 'function' ? ctx.get('layout') : undefined
      return value !== undefined && value !== null && typeof value === 'object' ? value as LayoutService : undefined
    } catch { return undefined }
  })()

  // 词典：注册进宿主 locale 服务，随插件卸载反注册（主面板 + 红队演练台两个命名空间）
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-purge: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(RT_NS, { zh: rtZh, en: rtEn }), 'dsh-purge: redteam dictionaries')
  const trt = ctx.locale.bind(RT_NS)
  ctx.effect(() => ctx.locale.register(BLUE_NS, { zh: zhBlue, en: enBlue }), 'dsh-purge: blueteam dictionaries')
  const tb = ctx.locale.bind(BLUE_NS)

  // 样式：<style data-dshp-style> 一次安装，卸载时移除（演练台样式同理）
  ctx.effect(installStyles, 'dsh-purge: styles')
  ctx.effect(installRtStyles, 'dsh-purge: redteam styles')

  // 全局通知源：shell.overlay 的 Toast 与各面板共享
  const notices: NoticeSource = createNotices()
  // 主面板页签：任何入口都能把全局面板切到指定页
  const nav = createMainNav('overview')

  /**
   * 打开设置页（sidebar.settings 外壳），返回是否成功。
   * 宿主没有设置外壳时由调用方提示，不再降级渲染第二份设置页。
   */
  const openSettingsSection = (): boolean => {
    try {
      for (const entry of ctx.slots.entries('sidebar.settings')) {
        const store = entry.store
        if (typeof store?.create !== 'function') continue
        const shell = store.create() as { actions?: { openSection?: (id: string) => void } } | undefined
        const actions = shell?.actions
        // 两次 create 得同一实例才算设置外壳的句柄（照 dsh-tokens-anywhere 范例）
        if (typeof actions?.openSection !== 'function' || store.create() !== shell) continue
        actions.openSection(NS)
        return true
      }
    } catch {
      // 设置外壳不可达：交给调用方提示
    }
    return false
  }

  /** 破甲面板右上 ⚙：深链到「设置 → 破甲」（全局配置唯一的家）。 */
  const openSettings = (): void => {
    if (!openSettingsSection()) notices.report(t('main.settingsUnavailable'), 'failure')
  }

  // 打开全局面板（root 作用域：新会话同样可用）；sessionId 由会话内入口带入
  const openMainPanel = (tab: 'overview' | 'redteam' = 'overview', sessionId?: string | null): void => {
    nav.select(tab, sessionId === undefined ? null : sessionId)
    if (layout !== undefined && typeof layout.selectPanel === 'function') {
      try { layout.selectPanel(PANEL_ID); return } catch { /* 落到降级 */ }
    }
    // 没有全局面板控制器：退到设置页，至少让配置可达
    if (!openSettingsSection()) notices.report(t('main.panelUnavailable'), 'failure')
  }

  // 打开红队演练台：主面板全宽（不再挤右侧栏）
  const openDrill = (sessionId?: string): void => { openMainPanel('redteam', sessionId) }

  // workspaces：把项目目录注册成 DSH 工作区（一个项目 = 一个工作区 = 一个事实库目录）
  /** 同步读服务（属性优先，其次 ctx.get）；没有就返回 undefined。 */
  const readService = <T>(name: string): T | undefined => {
    try {
      const injected = (ctx as unknown as Record<string, unknown>)[name]
      if (injected !== undefined && injected !== null && typeof injected === 'object') return injected as T
    } catch { /* cordis 未声明属性会抛：落到 ctx.get */ }
    try {
      const value = typeof ctx.get === 'function' ? ctx.get(name) : undefined
      return value !== undefined && value !== null && typeof value === 'object' ? value as T : undefined
    } catch { return undefined }
  }

  /**
   * 惰性 + 短等待地取客户端服务。
   * 为什么不在 apply 时取一次：ui-workspace / workspace-controller 的服务由各自的插件
   * 在 apply 阶段 mint，加载顺序不保证；apply 时取不到就永远是 undefined（表现为"点了没反应"）。
   * 也不用把服务写进 inject：服务名一旦对不上，整个插件会 PENDING，破甲面板直接消失。
   */
  const requireService = async <T>(name: string, tries = 20): Promise<T | undefined> => {
    for (let i = 0; i < tries; i += 1) {
      const value = readService<T>(name)
      if (value !== undefined) return value
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return undefined
  }

  let workspaces: WorkspacesLike | undefined = readService<WorkspacesLike>('workspaces')

  /**
   * 当前会话是不是「红队模式」会话（客户端判定）。
   * 读 sessions 快照里的预设投影：byId[id].projectionValues.agentPreset，
   * 兜底读 projectionsBySession[id] 的两个可能形状。取不到就返回 false（宁可不显示）。
   */
  const isRedteamSessionClient = (sessionId: string): boolean => {
    if (sessionId === '') return false
    try {
      const snap = readService<{ list?: { getSnapshot?: () => any } }>('sessions')?.list?.getSnapshot?.()
      if (snap === undefined || snap === null) return false
      const row = snap.byId !== undefined ? snap.byId[sessionId] : undefined
      let preset = row !== undefined && row.projectionValues !== undefined ? row.projectionValues.agentPreset : undefined
      if (typeof preset !== 'string') {
        const proj = snap.projectionsBySession !== undefined ? snap.projectionsBySession[sessionId] : undefined
        const values = proj !== undefined && proj !== null ? (proj.values ?? proj.projectionValues) : undefined
        preset = values !== undefined && values !== null ? values.agentPreset : undefined
      }
      if (typeof preset === 'string') {
        const id = preset.toLowerCase()
        if (id === 'redteam' || id.endsWith('/redteam')) return true
      }
      /* 兜底：投影读不到时看 cwd——演练会话一定跑在 <home>/redteam/engagements/<id> 里。
         统一分隔符后再判路径段，避免普通目录名恰好含这两个词就被当成红队会话。 */
      const cwd = row !== undefined && typeof row.cwd === 'string' ? row.cwd : ''
      const normalized = cwd.split(String.fromCharCode(92)).join('/').toLowerCase()
      return normalized.includes('/redteam/engagements/')
    } catch { return false }
  }

  /** 面板用的服务自检：一眼看出"点按钮没反应"是不是宿主服务没就绪。 */
  const probeServices = (): { uiWorkspace: boolean; workspaces: boolean; layout: boolean } => ({
    uiWorkspace: readService<UiWorkspaceLike>('uiWorkspace') !== undefined,
    workspaces: readService<WorkspacesLike>('workspaces') !== undefined,
    layout: readService<LayoutService>('layout') !== undefined,
  })

  /**
   * 确保项目已绑定一个 DSH 工作区：目录就是项目的数据目录（资产库同目录）。
   * 幂等：已绑定且工作区还在就直接返回；否则按目录创建/采纳并回写 engagement.yaml。
   * @param id - 项目 id。
   * @returns 工作区 id 与目录；无法创建时返回 null。
   */
  const ensureWorkspace = async (
    id: string,
    api: typeof rtOp = rtOp,
  ): Promise<{ workspaceId: string; dir: string } | null> => {
    const listed = await api<Record<string, any>>('projects')
    if (!listed.ok) return null
    const items = Array.isArray(listed.data.items) ? listed.data.items as Array<Record<string, any>> : []
    const project = items.find((row) => row.id === id)
    if (project === undefined) return null
    const dir = typeof project.dir === 'string' ? project.dir : ''
    const bound = typeof project.workspace_id === 'string' && project.workspace_id !== '' ? project.workspace_id : ''
    const known = (() => {
      try {
        const snap = workspaces?.list?.getSnapshot?.()
        const rows = snap !== undefined && snap !== null && Array.isArray(snap.items) ? snap.items : []
        return rows
      } catch { return [] }
    })()
    const alive = bound !== '' && known.some((row) => row !== undefined && (row.workspaceId === bound || (row as { id?: string }).id === bound))
    if (bound !== '' && (known.length === 0 || alive)) return { workspaceId: bound, dir }
    /* 时序：ui-workspace 可能还没 mint 完服务，等一小会儿再取一次（最多 2s） */
    const live = (() => {
      if (workspaces !== undefined && typeof workspaces.create === 'function') return workspaces
      for (let i = 0; i < 10; i += 1) {
        try {
          const value = typeof ctx.get === 'function' ? ctx.get('workspaces') : undefined
          if (value !== undefined && value !== null && typeof (value as { create?: unknown }).create === 'function') {
            return value as typeof workspaces
          }
        } catch { /* 继续等 */ }
      }
      return undefined
    })()
    if (dir === '' || (live !== undefined && typeof live.create !== 'function')) return null
    const wsService = live !== undefined && typeof live.create === 'function' ? live : await requireService<WorkspacesLike>('workspaces')
    if (wsService === undefined || typeof wsService.create !== 'function') {
      try { notices.report('工作区服务不可用：宿主 ui-workspace 未就绪', 'failure') } catch { /* ignore */ }
      return null
    }
    try {
      const view = await wsService.create({ path: dir })
      const workspaceId = typeof view.workspaceId === 'string' ? view.workspaceId : ''
      if (workspaceId === '') return null
      const title = '攻防演练 · ' + String(project.name || id)
      try {
        if (typeof wsService.rename === 'function') await wsService.rename(workspaceId, title)
      } catch { /* 改名失败不影响绑定 */ }
      await api('linkWorkspace', { engagement: id, workspaceId, title })
      return { workspaceId, dir }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      try { console.warn('[dsh-purge] 创建工作区失败：', error) } catch { /* ignore */ }
      try { notices.report('工作区创建失败：' + msg, 'failure') } catch { /* ignore */ }
      return null
    }
  }

  // uiWorkspace：新建会话（可指定 redteam 预设）的唯一客户端入口；软取，缺失时按钮降级为提示
  let uiWorkspace: UiWorkspaceLike | undefined = readService<UiWorkspaceLike>('uiWorkspace')

  /**
   * 一键开始演练：把项目设为当前项目，再新建一个跑「红队模式」预设的会话，
   * 开场白把 preflight → 开靶 → 五角色派活写清楚（模型据此自动调用子智能体）。
   * 绑定由工具侧自动完成：全局当前指针刚被指到该项目，会话首个工具调用即绑定它。
   */
  /**
   * 进入演练：切到项目对应的 DSH 工作区并打开一个「红队模式」会话（复用空白或新建）。
   * 不写草稿、不要求回车——进去就是一个可用的对话，用户直接说第一句。
   */
  const enterDrill = async (id: string): Promise<boolean> => {
    try { await rtOp('activateEngagement', { engagement: id }) } catch { /* 指针失败不阻断 */ }
    const space = await ensureWorkspace(id)
    if (space === null) return false
    const wsApi = (uiWorkspace !== undefined && typeof uiWorkspace.openWorkspace === 'function')
      ? uiWorkspace
      : await requireService<UiWorkspaceLike>('uiWorkspace')
    if (wsApi === undefined || typeof wsApi.openWorkspace !== 'function') return false
    try {
      await wsApi.openWorkspace(space.workspaceId, undefined, { agentPreset: 'redteam' })
    } catch (error) {
      try { console.warn('[dsh-purge] openWorkspace failed:', error) } catch { /* ignore */ }
      return false
    }
    closeMain()
    return true
  }

  /**
   * 在同一项目工作区里再开一个新对话（红队模式）。
   * 走 openWorkspace + startSession 两次调用：openWorkspace 负责切工作区（这条路径已实测可用），
   * startSession 负责在该工作区建/复用空白会话并指定预设——比 connectWorkspace 单独一条稳。
   */
  const newDrillSession = async (id: string): Promise<boolean> => {
    try { await rtOp('activateEngagement', { engagement: id }) } catch { /* ignore */ }
    const space = await ensureWorkspace(id)
    if (space === null) return false
    const ws = (uiWorkspace !== undefined && typeof uiWorkspace.openWorkspace === 'function')
      ? uiWorkspace
      : await requireService<UiWorkspaceLike>('uiWorkspace')
    if (ws === undefined || typeof ws.openWorkspace !== 'function') return false
    if (typeof ws.startSession !== 'function') return false
    try {
      /* 只做两件事：切到该项目工作区、建/复用空白红队会话。
         不往输入框里塞任何开场白——用户要自己说第一句。 */
      ws.startSession(space.workspaceId, { agentPreset: 'redteam' })
    } catch (error) {
      try { console.warn('[dsh-purge] newDrillSession failed:', error) } catch { /* ignore */ }
      return false
    }
    closeMain()
    return true
  }

  /**
   * 把普通会话"转成"红队演练：宿主不支持运行时改预设，所以新建一个红队会话，
   * 并把当前会话最后一条用户消息作为交接语带过去（不用重新描述需求）。
   * @param sessionId - 当前（普通）会话 id。
   * @param projectId - 目标项目。
   */
  const convertToDrill = async (sessionId: string, projectId: string): Promise<boolean> => {
    const space = await ensureWorkspace(projectId)
    if (space === null) return false
    const wsApi = (uiWorkspace !== undefined && typeof uiWorkspace.startSession === 'function')
      ? uiWorkspace
      : await requireService<UiWorkspaceLike>('uiWorkspace')
    if (wsApi === undefined || typeof wsApi.startSession !== 'function') return false
    try {
      await rtOp('activateEngagement', { engagement: projectId })
      wsApi.startSession(space.workspaceId, { agentPreset: 'redteam' })
    } catch (error) {
      try { console.warn('[dsh-purge] convertToDrill failed:', error) } catch { /* ignore */ }
      return false
    }
    return true
  }

  /** 删除项目：删目录 + 删工作区 + 清绑定（不可恢复，前端二次确认）。 */
  const deleteProject = async (id: string, workspaceId?: string | null): Promise<boolean> => {
    const result = await rtOp<{ deleted?: { workspace_id?: string | null } }>('deleteEngagement', { engagement: id })
    if (!result.ok) return false
    const wsId = (workspaceId !== undefined && workspaceId !== null && workspaceId !== '')
      ? workspaceId
      : (result.data.deleted !== undefined && result.data.deleted !== null ? result.data.deleted.workspace_id : null)
    if (typeof wsId === 'string' && wsId !== '' && workspaces !== undefined && typeof workspaces.delete === 'function') {
      try { await workspaces.delete(wsId) } catch { /* 工作区删不掉不影响项目已删 */ }
    }
    return true
  }

  /**
   * 蓝队值守：切到项目工作区并打开一个「蓝队模式」会话。
   * 与 enterDrill 是两条平行线：工具集/库/面板页签都不同，preset 名也不同。
   */
  const enterShift = async (id: string): Promise<boolean> => {
    try { await blueOp('activateEngagement', { engagement: id }) } catch { /* 指针失败不阻断 */ }
    const space = await ensureWorkspace(id, blueOp)
    if (space === null) return false
    const wsApi = (uiWorkspace !== undefined && typeof uiWorkspace.openWorkspace === 'function')
      ? uiWorkspace
      : await requireService<UiWorkspaceLike>('uiWorkspace')
    if (wsApi === undefined || typeof wsApi.openWorkspace !== 'function') return false
    try {
      await wsApi.openWorkspace(space.workspaceId, undefined, { agentPreset: 'blueteam' })
    } catch { return false }
    closeMain()
    return true
  }

  /** 在同一蓝队项目里再开一个值守会话。 */
  const newShiftSession = async (id: string): Promise<boolean> => {
    try { await blueOp('activateEngagement', { engagement: id }) } catch { /* 忽略 */ }
    const space = await ensureWorkspace(id, blueOp)
    if (space === null) return false
    const ws = (uiWorkspace !== undefined && typeof uiWorkspace.openWorkspace === 'function')
      ? uiWorkspace
      : await requireService<UiWorkspaceLike>('uiWorkspace')
    if (ws === undefined || typeof ws.startSession !== 'function') return false
    try {
      ws.startSession(space.workspaceId, { agentPreset: 'blueteam' })
    } catch { return false }
    closeMain()
    return true
  }

  /** 删除蓝队项目：删目录 + 删工作区 + 清绑定。 */
  const deleteBlueProject = async (id: string): Promise<boolean> => {
    const result = await blueOp<{ deleted?: { workspace_id?: string | null } }>('deleteEngagement', { engagement: id })
    if (!result.ok) return false
    const wsId = result.data.deleted !== undefined && result.data.deleted !== null ? result.data.deleted.workspace_id : null
    if (typeof wsId === 'string' && wsId !== '' && workspaces !== undefined && typeof workspaces.delete === 'function') {
      try { await workspaces.delete(wsId) } catch { /* 忽略 */ }
    }
    return true
  }

  /** 关闭全局面板回到对话：演练发生在会话里，面板只是发射台。 */
  const closeMain = (): boolean => {
    if (layout !== undefined && typeof layout.selectPanel === 'function') {
      try { layout.selectPanel(null); return true } catch { /* 落到下面的提示 */ }
    }
    return false
  }

  // —— 1. 全局主面板（root 作用域，新会话可用） ——
  ctx.slots.inject('main', () => ctx.slots.register(
    {
      name: 'main', key: PANEL_ID,
      inject: () => ({
        t, trt, tb, notices, nav,
        openSettings,
        enterDrill, newDrillSession, deleteProject, closeMain,
        enterShift, newShiftSession, deleteBlueProject,
        probeServices,
      }),
    },
    PurgeMain,
  ))

  // 左侧栏导航图标（与 main 的 key 同名：宿主据此把图标指向该面板）
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register(
    { name: 'sidebar.panellist', id: PANEL_ID, order: 30, label: () => t('main.title') },
    PurgeIcon,
  ))

  // —— 2. 设置页（settings.section）：导航 label 走 thunk，随语言切换重读 ——
  ctx.slots.inject('settings.section', () => ctx.slots.register(
    {
      name: 'settings.section', id: NS, order: 90,
      label: () => t('settings.title'),
      inject: () => ({ t, notices }),
    },
    PurgeSettings,
  ))

  // —— 3. 右侧栏页签类型 + 页签主体（先声明类型，再挂 keyed 槽位） ——
  // 老宿主无右侧栏服务时整组跳过（设置页/主面板/输入框按钮仍可用）。
  if (hasRightRail && sidebarRightTabs !== undefined) {
    ctx.effect(() => sidebarRightTabs.register({
      id: TAB_KIND, kind: TAB_KIND, title: () => t('panel.title'),
    }), 'dsh-purge: sidebar tab type')
    ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
      {
        name: 'sidebar.right.pane.tab', key: TAB_KIND,
        inject: (sessionId?: string) => ({
          t, sessionId, notices,
          isRedteam: () => isRedteamSessionClient(sessionId ?? ''),
          openDrill: () => { openDrill(sessionId) },
        }),
      },
      PurgePanel,
    ))

    // 红队演练台页签：key 必须等于类型 id（RT_NS），否则打开后无 body 渲染
    ctx.effect(() => sidebarRightTabs.register({
      id: REDTEAM_TAB_KIND, kind: REDTEAM_TAB_KIND, title: () => trt('rt.title'),
    }), 'dsh-purge: redteam tab type')
    ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
      {
        name: 'sidebar.right.pane.tab', key: REDTEAM_TAB_KIND,
        inject: (sessionId?: string) => ({ t: trt, sessionId, notices, openSettings }),
      },
      RedteamTab,
    ))
  }

  // —— 4. 输入框右侧「安全回退」按钮（session 槽位首参为 sessionId） ——
  ctx.slots.inject('conversation.input.right', () => ctx.slots.register(
    {
      name: 'conversation.input.right', id: 'dsh-purge.rewind', order: 100,
      inject: (sessionId?: string) => ({ t, sessionId: sessionId ?? '', notices }),
    },
    RewindSafe,
  ))

  // —— 4b. 会话内「新建红队对话」：仅在该会话绑定了项目时出现 ——
  ctx.slots.inject('conversation.input.right', () => ctx.slots.register(
    {
      name: 'conversation.input.right', id: 'dsh-purge.new-drill', order: 90,
      inject: (sessionId?: string) => ({ t, sessionId: sessionId ?? '', newDrillSession, convertToDrill, notices }),
    },
    DrillNewSession,
  ))

  // —— 5. 会话头「dsh-purge」按钮：打开全局面板；无 layout 时降级跳设置页 ——
  /* 会话级入口：红队状态徽章（绑定项目 / 得分 / 在跑智能体），点开进全局面板。
     全局的东西（项目中心、知识库、技能库、环境、人格规则）留在面板里——级别不混。 */
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register(
    {
      name: 'conversation.session.header.utilities', id: NS, order: -8,
      inject: (sessionId?: string) => ({
        t,
        sessionId: sessionId ?? '',
        isRedteam: () => isRedteamSessionClient(sessionId ?? ''),
        openPanel: () => { openMainPanel('redteam', sessionId === undefined ? null : sessionId) },
      }),
    },
    DrillBadge,
  ))

  // —— 6. 通知浮层（shell.overlay）：右下角 Toast + 全局确认框 ——
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    {
      name: 'shell.overlay', id: 'dsh-purge.toast',
      inject: () => ({ source: notices }),
    },
    Toast,
  ))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    {
      name: 'shell.overlay', id: 'dsh-purge.dialog',
      inject: () => ({}),
    },
    DialogHost,
  ))
}
