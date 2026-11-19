/**
 * 红队演练台根组件（sidebar.right.pane.tab / main 面板共用，key: dsh-purge-redteam）。
 *
 * 结构：项目头（当前项目 / 状态 / 范围 / 本会话绑定）+ 靶标选择 + SSE 角标 +
 * 分组子页签（项目组：项目中心 / 总览 / 资产测绘 / 智能体 / 会话隧道 / 漏洞战果 /
 * 攻击链 / 得分目标 / 报告；全局组：知识库 / 技能库 / 环境适配）+
 * 分页签错误边界 + 底部统计。
 *
 * 业务模型：一个项目（engagement）= 一个靶标工作区，各自的 SQLite 库；
 * 会话通过 session-bindings.json 绑到项目。项目中心是"有哪些项目"的入口，
 * 其余项目页签都在"当前项目"的上下文里取值。
 */
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { h, type NoticeSource } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import type { Translate } from './bits.tsx'
import { createLive } from './live.ts'
import { useSessionBinding } from '../shared/data.ts'
import { AssetsTab } from './AssetsTab.tsx'
import { AgentsTab } from './AgentsTab.tsx'
import { ChainTab } from './ChainTab.tsx'
import { EnvTab } from './EnvTab.tsx'
import { FindingsTab } from './FindingsTab.tsx'
import { KnowledgeTab } from './KnowledgeTab.tsx'
import { OverviewTab } from './OverviewTab.tsx'
import { ProjectsTab } from './ProjectsTab.tsx'
import { ReportTab } from './ReportTab.tsx'
import { ScoresTab } from './ScoresTab.tsx'
import { SessionsTab } from './SessionsTab.tsx'
import { SkillsTab } from './SkillsTab.tsx'
import { fmt } from './bits.tsx'

type AnyRec = Record<string, any>

/** 项目组页签（都带当前项目上下文）。 */
const PROJECT_TABS = [
  'projects', 'overview', 'assets', 'agents', 'sessions', 'findings',
  'chain', 'scores', 'report',
] as const

/** 全局组页签（跨项目共享）。 */
const GLOBAL_TABS = ['knowledge', 'skills', 'env'] as const

const TAB_KEYS = [...PROJECT_TABS, ...GLOBAL_TABS] as const
type TabKey = typeof TAB_KEYS[number]

export interface RedteamTabProps {
  t: Translate
  /** 会话作用域槽位给的 sessionId；主面板打开时为 undefined。 */
  sessionId?: string
  notices: NoticeSource
  /** 仅供冒烟测试指定初始子页签；正常路径缺省为总览/项目中心。 */
  initialTab?: string
  /** 同上：指定初始靶标 id（无则走 bootstrap 选择）。 */
  initialEngagement?: string
  /** 进入演练：切到项目工作区并打开红队会话。 */
  enterDrill?: (id: string) => Promise<boolean>
  /** 在同一工作区再开一个红队会话。 */
  newDrillSession?: (id: string) => Promise<boolean>
  /** 删除项目。 */
  deleteProject?: (id: string, workspaceId?: string | null) => Promise<boolean>
  /** 深链到「设置 → 破甲」（版本条与更新入口用；没有设置外壳时缺省）。 */
  openSettings?: () => void
}

export function RedteamTab(props: RedteamTabProps): ReturnType<typeof h> {
  const t = props.t
  const [tab, setTab] = useState<TabKey>(() => (TAB_KEYS as readonly string[]).includes(String(props.initialTab)) ? props.initialTab as TabKey : 'overview')
  const [params, setParams] = useState<Record<string, any> | null>(null)
  const [engagements, setEngagements] = useState<AnyRec[]>([])
  const [eng, setEng] = useState<string | null>(() => (typeof props.initialEngagement === 'string' && props.initialEngagement !== '' ? props.initialEngagement : null))
  const [snapshot, setSnapshot] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // —— 实时化（C-3.1）：SSE → 失败退回 15s 轮询；得分事件弹 Toast ——
  // 单例放进 useState 初始化器：渲染体不再产生副作用，回调经 ref 读最新的 t / notices，
  // 切语言后 Toast 不会停留在旧文案。
  const noticesRef = useRef(props.notices)
  noticesRef.current = props.notices
  const tRef = useRef(t)
  tRef.current = t
  const [live] = useState(() => createLive((kind) => {
    if (kind === 'score') noticesRef.current.report(tRef.current('rt.toast.score'), 'success')
    // 心跳（__poll）只更新角标，不重取数据：否则 polling 模式下页面每轮抖动。
    if (kind === '__poll') return
    setRefreshKey(k => k + 1)
  }))
  const liveSnap = useSyncExternalStore(live.subscribe, live.hooks.snapshot)
  useEffect(() => {
    live.start(eng)
    return () => { live.stop() }
  }, [eng, live])

  // 本会话绑定：与右栏页签共用同一套动作与文案（shared/data.ts）
  const binding = useSessionBinding(props.sessionId, t, props.notices, () => { setRefreshKey(k => k + 1) })
  /** 本会话绑定的项目 id（无会话上下文时为 null）。 */
  const boundEng = binding.bound
  // 外部入口（右栏页签、输入框按钮）改了绑定、或 SSE 有新事件时，重读一次绑定表
  const reloadBindings = binding.reload
  useEffect(() => { reloadBindings() }, [reloadBindings, refreshKey])

  const loadSnapshot = useCallback((id: string | null): void => {
    if (id === null || id === '') { setSnapshot(null); return }
    void rtOp<AnyRec>('snapshot', { engagement: id }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setSnapshot(r.data)
    })
  }, [])

  const refreshList = useCallback((selectId?: string): void => {
    void rtOp<AnyRec>('bootstrap').then((b) => {
      setEngagements(b.ok ? (b.data.engagements ?? []) : [])
      if (selectId !== undefined) { setEng(selectId); loadSnapshot(selectId) }
    })
  }, [loadSnapshot])

  useEffect(() => {
    void rtOp<AnyRec>('bootstrap').then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setEngagements(r.data.engagements ?? [])
      const id = r.data.current ?? ((r.data.engagements ?? [])[0] ?? {}).id ?? null
      if (id !== null && id !== undefined) { setEng(id); loadSnapshot(id) }
      else setTab('projects')
    })
  }, [loadSnapshot])

  /** 切换当前项目（下拉）。 */
  const pick = (id: string): void => {
    setEng(id)
    loadSnapshot(id)
    void rtOp('activateEngagement', { engagement: id })
    setRefreshKey(k => k + 1)
  }

  const bindHere = (id: string, name?: string): void => { void binding.bind(id, name) }

  const unbindHere = (): void => { void binding.unbind() }

  /** 项目中心"进入工作台"：切当前 + 回到总览。 */
  const openProject = (id: string, name: string): void => {
    setEng(id)
    loadSnapshot(id)
    setTab('overview')
    setParams(null)
    void rtOp('activateEngagement', { engagement: id })
    // 从会话内打开时，进项目即绑定本会话：这是"项目级任务"的默认语义
    if (props.sessionId !== undefined && props.sessionId !== '') bindHere(id, name)
    setRefreshKey(k => k + 1)
  }

  const openEngagement = (): void => {
    const name = String(newName).trim()
    if (name === '') return
    setCreating(true)
    void rtOp<AnyRec>('openEngagement', { name }).then((r) => {
      setCreating(false)
      if (!r.ok) { setErr(r.error); return }
      setNewName('')
      refreshList(r.data.engagement !== undefined && r.data.engagement !== null ? r.data.engagement.id : undefined)
    })
  }

  /** 刷新：重拉名册/快照/绑定，并让当前子页签重新取数。 */
  const refreshAll = useCallback((): void => {
    setRefreshKey(k => k + 1)
    void rtOp<AnyRec>('bootstrap').then((b) => {
      if (b.ok) setEngagements(b.data.engagements ?? [])
      if (eng !== null) loadSnapshot(eng)
    })
    binding.reload()
  }, [eng, loadSnapshot, binding])

  /** 统一深链（C-3.3）：jump('assets', { ip }) 等；同时强制目标页重新取数。 */
  const jump = useCallback((nextTab: string, nextParams?: Record<string, unknown>): void => {
    if ((TAB_KEYS as readonly string[]).includes(nextTab)) setTab(nextTab as TabKey)
    setParams(nextParams ?? null)
    setRefreshKey(k => k + 1)
  }, [])

  const tabProps = { t, eng, refreshKey, jump, notices: props.notices, params }

  let body: ReactNode
  if (err !== null) {
    body = h('div', { class: 'dshp-rt-err' }, err)
  } else if (tab === 'projects') {
    body = h(ProjectsTab, {
      ...tabProps,
      onEnter: async (id: string) => {
        const ok = props.enterDrill === undefined ? false : await props.enterDrill(id)
        if (!ok) props.notices.report(t('main.sessionUnavailable'), 'failure')
        return ok
      },
      onNewSession: async (id: string) => {
        const ok = props.newDrillSession === undefined ? false : await props.newDrillSession(id)
        if (!ok) props.notices.report(t('main.sessionUnavailable'), 'failure')
        return ok
      },
      onDelete: async (id: string, workspaceId?: string | null) => {
        const ok = props.deleteProject === undefined ? false : await props.deleteProject(id, workspaceId)
        if (!ok) props.notices.report(t('rt.pj.updateFailed'), 'failure')
        return ok
      },
      onOpen: openProject,
      onSetCurrent: (id: string) => { setEng(id); loadSnapshot(id); setRefreshKey(k => k + 1) },
      onChanged: () => { refreshAll() },
    })
  } else if (tab === 'knowledge') body = h(KnowledgeTab, tabProps)
  else if (tab === 'env') body = h(EnvTab, tabProps)
  else if (tab === 'skills') body = h(SkillsTab, tabProps)
  else if (tab === 'agents') body = h(AgentsTab, tabProps)
  else if (eng === null) {
    body = h('div', { class: 'dshp-rt-pane' },
      h('div', { class: 'dshp-rt-card' },
        h('h4', null, t('rt.noEngTitle')),
        h('div', { style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)', marginBottom: 8 } }, t('rt.noEngHint')),
        h('div', { style: { display: 'flex', gap: 8 } },
          h('input', {
            class: 'dshp-rt-input', style: { flex: 1 }, placeholder: t('rt.noEngPh'),
            value: newName,
            onChange: (e: { target: { value: string } }) => { setNewName(e.target.value) },
            onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') openEngagement() },
          }),
          h('button', {
            class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: creating,
            onClick: openEngagement,
          }, creating ? t('rt.creating') : t('rt.create')))),
      h('div', { class: 'dshp-rt-empty' }, t('rt.noEngGlobalHint')))
  } else if (tab === 'overview') body = h(OverviewTab, tabProps)
  else if (tab === 'assets') body = h(AssetsTab, { ...tabProps, snapshot, onRefresh: refreshAll, onData: () => { loadSnapshot(eng) } })
  else if (tab === 'sessions') body = h(SessionsTab, tabProps)
  else if (tab === 'findings') body = h(FindingsTab, tabProps)
  else if (tab === 'chain') body = h(ChainTab, tabProps)
  else if (tab === 'report') body = h(ReportTab, tabProps)
  else if (tab === 'scores') body = h(ScoresTab, tabProps)
  else body = h('div', { class: 'dshp-rt-empty' }, t('rt.unknownTab'))

  const stats: AnyRec = (snapshot !== null && snapshot.stats) || {}
  const meta: AnyRec = (snapshot !== null && snapshot.engagement) || {}
  const isLive = liveSnap.status === 'live'
  const canBind = props.sessionId !== undefined && props.sessionId !== ''
  const isBoundHere = boundEng !== null && boundEng === eng

  return h('div', { class: 'dshp-rt-root' },
    // —— 项目头：当前项目身份 + 本会话绑定（项目中心页本身就是"选项目"，不重复显示） ——
    tab === 'projects' ? null : h('div', { class: 'dshp-rt-projhead' },
      h('button', {
        class: 'dshp-rt-btn dshp-rt-btn-ghost', type: 'button',
        title: t('rt.head.backToProjects'),
        onClick: () => { setTab('projects'); setParams(null); setRefreshKey(k => k + 1) },
      }, '‹ ' + t('rt.head.backToProjects')),
      h('span', { class: 'dshp-rt-projname' }, meta.name ? String(meta.name) : t('rt.head.noProject')),
      meta.status === 'archived' || meta.status === 'closed'
        ? h('span', { class: 'dshp-rt-tag' }, t('rt.pj.' + (meta.status === 'closed' ? 'closed' : 'archived')))
        : null,
      meta.created_at ? h('span', { class: 'dshp-rt-projmeta' }, t('rt.head.created') + ' ' + fmt(meta.created_at)) : null,
      ((meta.scope ?? []) as string[]).slice(0, 3).map((cidr, i) =>
        h('span', { key: 'sc' + i, class: 'dshp-rt-tag dshp-rt-mono' }, cidr)),
      h('div', { class: 'dshp-rt-spacer' }),
      eng !== null && props.enterDrill !== undefined
        ? h('button', {
            class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
            title: t('main.enterHint'),
            onClick: () => {
              void props.enterDrill?.(eng)
                .then((ok) => { if (!ok) props.notices.report(t('main.sessionUnavailable'), 'failure') })
            },
          }, t('main.enter'))
        : null,
      eng !== null && props.newDrillSession !== undefined
        ? h('button', {
            class: 'dshp-rt-btn', type: 'button',
            title: t('main.newSessionHint'),
            onClick: () => {
              void props.newDrillSession?.(eng)
                .then((ok) => { if (!ok) props.notices.report(t('main.sessionUnavailable'), 'failure') })
            },
          }, t('main.newSession'))
        : null,
      canBind
        ? (isBoundHere
            ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' },
                t('rt.head.boundHere'),
                h('button', {
                  class: 'dshp-rt-linkbtn', type: 'button', title: t('rt.head.unbind'), onClick: unbindHere,
                }, '×'))
            : (eng !== null
                ? h('button', {
                    class: 'dshp-rt-btn', type: 'button', title: t('rt.head.bindHint'),
                    onClick: () => { bindHere(eng, meta.name ? String(meta.name) : undefined) },
                  }, t('rt.head.bindHere'))
                : null))
        : h('span', { class: 'dshp-rt-projmeta' }, t('rt.head.noSession'))),

    h('div', { class: 'dshp-rt-head' },
      h('select', {
        class: 'dshp-rt-input', style: { maxWidth: 190, flex: '1 1 150px' },
        value: eng ?? '',
        onChange: (e: { target: { value: string } }) => { pick(e.target.value) },
      },
        h('option', { value: '', disabled: true }, engagements.length > 0 ? t('rt.pickEng') : t('rt.noEngYet')),
        engagements.map((x) => h('option', { key: x.id, value: x.id }, x.name || x.id || t('rt.unnamed')))),
      h('span', {
        class: 'dshp-rt-livebadge' + (isLive ? ' is-live' : ''),
        title: isLive ? t('rt.live.liveTip') : t('rt.live.pollingTip'),
      }, h('b', null), isLive ? t('rt.live.live') : t('rt.live.polling')),
      h('div', { class: 'dshp-rt-spacer' }),
      h(VersionBadge, { t, onOpenSettings: props.openSettings }),
      h('button', {
        class: 'dshp-rt-btn', type: 'button',
        title: t('rt.refreshAllTitle'), onClick: refreshAll,
      }, t('rt.refresh'))),

    h('div', { class: 'dshp-rt-tabs', role: 'tablist' },
      PROJECT_TABS.map((k) => h('div', {
        key: k,
        class: 'dshp-rt-tab' + (tab === k ? ' on' : ''),
        role: 'tab',
        tabIndex: 0,
        'aria-selected': tab === k ? 'true' : 'false',
        onClick: () => { setTab(k); setParams(null); setRefreshKey(n => n + 1) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(k); setParams(null); setRefreshKey(n => n + 1) }
        },
      }, t('rt.tab.' + k))),
      h('span', { class: 'dshp-rt-tabsep', title: t('rt.group.globalHint') }, t('rt.group.global')),
      GLOBAL_TABS.map((k) => h('div', {
        key: k,
        class: 'dshp-rt-tab dshp-rt-tab-global' + (tab === k ? ' on' : ''),
        role: 'tab',
        tabIndex: 0,
        'aria-selected': tab === k ? 'true' : 'false',
        onClick: () => { setTab(k); setParams(null); setRefreshKey(n => n + 1) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(k); setParams(null); setRefreshKey(n => n + 1) }
        },
      }, t('rt.tab.' + k)))),

    h('div', { class: 'dshp-rt-body', key: 'body-' + tab },
      h(RtBoundary, { key: tab, t, onBack: () => { setTab('projects'); setRefreshKey(n => n + 1) } }, body)),
    h('div', { class: 'dshp-rt-foot' },
      h('span', null, t('rt.foot.segments', { n: stats.segments ?? 0 })),
      h('span', null, t('rt.foot.assets', { n: stats.assets ?? 0, live: stats.liveAssets ?? 0 })),
      h('span', null, t('rt.foot.ports', { n: stats.openPorts ?? 0 })),
      h('span', null, t('rt.foot.fingerprints', { n: stats.fingerprints ?? 0 })),
      h('span', null, t('rt.foot.vulns', { n: stats.vulns ?? 0 })),
      h('span', null, t('rt.foot.signals', { p: stats.passiveSignals ?? 0, a: stats.activeSignals ?? 0 })),
      h('div', { class: 'dshp-rt-spacer' }),
      h('span', null, 'SQLite · ' + (meta.name ? String(meta.name) : ''))))

  // —— 错误边界、版本条（保持原实现） ——
}

/* ---------- 错误边界：单个子页签渲染出错只降级该页 ---------- */

class RtBoundary extends Component<{ t: Translate; onBack: () => void; children?: ReactNode }, { error: Error | null }> {
  constructor(props: { t: Translate; onBack: () => void; children?: ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error }
  }
  componentDidCatch(error: Error): void {
    try { console.error('[dsh-purge redteam] tab render error:', error) } catch { /* ignore */ }
  }
  render(): ReactNode {
    if (this.state.error !== null) {
      const t = this.props.t
      return h('div', { class: 'dshp-rt-pane' },
        h('div', { class: 'dshp-rt-err' }, t('rt.renderError') + (this.state.error.message !== undefined ? this.state.error.message : String(this.state.error))),
        h('button', {
          class: 'dshp-rt-btn', type: 'button',
          onClick: () => { this.setState({ error: null }); this.props.onBack() },
        }, t('rt.backToAssets')))
    }
    return this.props.children
  }
}

/* ---------- 版本徽章：只报版本；更新动作统一在「设置 → 破甲」 ---------- */

function VersionBadge(props: { t: Translate; onOpenSettings?: () => void }): ReturnType<typeof h> {
  const t = props.t
  const [version, setVersion] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    // version op 只读取包元信息与最新版本号；失败就显示 "v?"，不在演练台里弹错误
    void rtOp<AnyRec>('version').then((result) => {
      if (cancelled || !result.ok) return
      const current = result.data.current ?? (result.data.plugin !== undefined ? result.data.plugin.version : null)
      setVersion(current === null || current === undefined ? null : String(current))
    })
    return () => { cancelled = true }
  }, [])
  const label = 'v' + (version ?? '?')
  if (props.onOpenSettings === undefined) return h('span', { class: 'dshp-rt-tag' }, label)
  return h('button', {
    class: 'dshp-rt-btn', type: 'button',
    title: t('rt.v.badgeTip', { v: version ?? '?' }),
    onClick: props.onOpenSettings,
  }, label)
}
