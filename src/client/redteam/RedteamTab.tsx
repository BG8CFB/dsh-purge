/**
 * 红队演练台根组件（sidebar.right.pane.tab，key: redteam）。
 *
 * 结构：靶标选择/创建 + SSE 连接角标（live/polling，C-3.1）+ 子页签导航
 * （总览 + 十个迁移页签，C-3.3 的统一 jump 在此分发）+ 分页签错误边界 + 底部统计。
 * 旧浮动窗形态（拖拽/全屏窗 #redteam-full/未读红点轮询）不随迁移保留，见迁移对照清单。
 */
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { h, type NoticeSource } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import type { Translate } from './bits.tsx'
import { createLive } from './live.ts'
import { installRtStyles } from './styles.ts'
import { AssetsTab } from './AssetsTab.tsx'
import { AgentsTab } from './AgentsTab.tsx'
import { ChainTab } from './ChainTab.tsx'
import { EnvTab } from './EnvTab.tsx'
import { FindingsTab } from './FindingsTab.tsx'
import { KnowledgeTab } from './KnowledgeTab.tsx'
import { OverviewTab } from './OverviewTab.tsx'
import { ReportTab } from './ReportTab.tsx'
import { ScoresTab } from './ScoresTab.tsx'
import { SessionsTab } from './SessionsTab.tsx'
import { SkillsTab } from './SkillsTab.tsx'

type AnyRec = Record<string, any>

/** 子页签 key（tab 顺序即展示顺序）。knowledge/env/skills/agents 为无靶标也能看的全局页。 */
const TAB_KEYS = [
  'overview', 'assets', 'env', 'agents', 'sessions', 'findings',
  'chain', 'scores', 'report', 'knowledge', 'skills',
] as const
type TabKey = typeof TAB_KEYS[number]

export interface RedteamTabProps {
  t: Translate
  sessionId?: string
  notices: NoticeSource
  /** 仅供冒烟测试指定初始子页签；正常路径缺省为总览。 */
  initialTab?: string
  /** 同上：指定初始靶标 id（无则走 bootstrap 选择）。 */
  initialEngagement?: string
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

  // —— 实时化（C-3.1）：SSE → 失败退回 5s 轮询；得分事件弹 Toast ——
  const noticesRef = useRef(props.notices)
  noticesRef.current = props.notices
  const liveRef = useRef<ReturnType<typeof createLive> | null>(null)
  if (liveRef.current === null) {
    liveRef.current = createLive((kind) => {
      if (kind === 'score') noticesRef.current.report(t('rt.toast.score'), 'success')
      // 任何事件（含轮询心跳）都刷新当前页签的数据
      setRefreshKey(k => k + 1)
    })
  }
  const live = liveRef.current
  const liveSnap = useSyncExternalStore(live.subscribe, live.hooks.snapshot)
  useEffect(() => {
    installRtStyles()
    live.start(eng)
    return () => { live.stop() }
  }, [eng, live])

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
    })
  }, [loadSnapshot])

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

  /** 刷新：重拉名册/快照，并让当前子页签重新取数。 */
  const refreshAll = useCallback((): void => {
    setRefreshKey(k => k + 1)
    void rtOp<AnyRec>('bootstrap').then((b) => {
      if (b.ok) setEngagements(b.data.engagements ?? [])
      if (eng !== null) loadSnapshot(eng)
    })
  }, [eng, loadSnapshot])

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
  const isLive = liveSnap.status === 'live'

  return h('div', { class: 'dshp-rt-root' },
    h('div', { class: 'dshp-rt-head' },
      h('select', {
        class: 'dshp-rt-input', style: { maxWidth: 190, flex: '1 1 150px' },
        value: eng ?? '',
        onChange: (e: { target: { value: string } }) => {
          setEng(e.target.value)
          loadSnapshot(e.target.value)
          // 同步「当前靶标」：原生 skill 目录按它解析技能根
          void rtOp('activateEngagement', { engagement: e.target.value })
        },
      },
        h('option', { value: '', disabled: true }, engagements.length > 0 ? t('rt.pickEng') : t('rt.noEngYet')),
        engagements.map((x) => h('option', { key: x.id, value: x.id }, x.name || x.id || t('rt.unnamed')))),
      h('span', {
        class: 'dshp-rt-livebadge' + (isLive ? ' is-live' : ''),
        title: isLive ? t('rt.live.liveTip') : t('rt.live.pollingTip'),
      }, h('b', null), isLive ? t('rt.live.live') : t('rt.live.polling')),
      h('div', { class: 'dshp-rt-spacer' }),
      h(VersionBar, { t }),
      h('button', {
        class: 'dshp-rt-btn', type: 'button',
        title: t('rt.refreshAllTitle'), onClick: refreshAll,
      }, t('rt.refresh'))),
    h('div', { class: 'dshp-rt-tabs', role: 'tablist' },
      TAB_KEYS.map((k) => h('div', {
        key: k,
        class: 'dshp-rt-tab' + (tab === k ? ' on' : ''),
        role: 'tab',
        tabIndex: 0,
        'aria-selected': tab === k ? 'true' : 'false',
        onClick: () => { setTab(k); setParams(null); setRefreshKey(n => n + 1) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(k); setParams(null); setRefreshKey(n => n + 1) }
        },
      }, t('rt.tab.' + k)))),
    h('div', { class: 'dshp-rt-body', key: 'body-' + tab },
      h(RtBoundary, { key: tab, t, onBack: () => { setTab('assets'); setRefreshKey(n => n + 1) } }, body)),
    h('div', { class: 'dshp-rt-foot' },
      h('span', null, t('rt.foot.segments', { n: stats.segments ?? 0 })),
      h('span', null, t('rt.foot.assets', { n: stats.assets ?? 0, live: stats.liveAssets ?? 0 })),
      h('span', null, t('rt.foot.ports', { n: stats.openPorts ?? 0 })),
      h('span', null, t('rt.foot.fingerprints', { n: stats.fingerprints ?? 0 })),
      h('span', null, t('rt.foot.vulns', { n: stats.vulns ?? 0 })),
      h('span', null, t('rt.foot.signals', { p: stats.passiveSignals ?? 0, a: stats.activeSignals ?? 0 })),
      h('div', { class: 'dshp-rt-spacer' }),
      h('span', null, 'SQLite · ' + (snapshot !== null && snapshot.engagement !== undefined ? snapshot.engagement.name : ''))))
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

/* ---------- 版本条：显示版本 + 检查更新（迁移时去掉更新后倒计时） ---------- */

function VersionBar(props: { t: Translate }): ReturnType<typeof h> {
  const t = props.t
  const [info, setInfo] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)

  const check = (silent: boolean): void => {
    if (!silent) setBusy(true)
    void rtOp<AnyRec>('updateCheck').then((r) => {
      setBusy(false)
      if (!r.ok) {
        // 开发态或查不到 registry：只显示当前版本，不报错打扰用户
        if (!silent) setErr(r.error)
        void rtOp<AnyRec>('version').then((v) => { if (v.ok) setInfo(v.data) })
        return
      }
      setErr(null)
      setInfo(r.data)
    })
  }
  useEffect(() => { check(true) }, [])

  const apply = (): void => {
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('updateApply', { target: (info !== null && info.latest) || undefined }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      // 宿主随后重启会断开本页面：提示手动刷新，不做倒计时
      setMsg({ ok: t('rt.v.applied', { v: r.data.installed ?? '' }) })
    })
  }

  const current = info !== null && info.current !== undefined ? info.current
    : (info !== null && info.plugin !== undefined ? info.plugin.version : null)
  const latest = info !== null ? info.latest : null
  const hasNew = Boolean(info !== null && info.updateAvailable)
  const blockers: string[] = (info !== null && info.blockers) || []
  const notes: string[] = (info !== null && info.notes) || []
  const mode = info !== null && info.install !== undefined ? info.install.mode : null

  return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
    h('span', {
      class: 'dshp-rt-tag' + (hasNew ? ' dshp-rt-tag-warn' : ''),
      title: t('rt.v.currentTip', {
        cur: current ?? t('rt.unknown'),
        latest: latest ?? '',
        mode: mode === 'dev' ? t('rt.v.modeDev') : mode === 'package' ? t('rt.v.modePackage') : '',
        err: info !== null && info.check_error !== undefined ? t('rt.v.checkErr', { msg: info.check_error }) : '',
      }),
    }, 'v' + (current ?? '?')),
    hasNew
      ? h('button', {
          class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy,
          onClick: () => { setOpen(true); setMsg(null) },
          title: t('rt.v.hasNewTip', { v: latest ?? '' }),
        }, busy ? t('rt.v.checking') : t('rt.v.hasNew', { v: latest ?? '' }))
      : h('button', {
          class: 'dshp-rt-btn', type: 'button', disabled: busy,
          onClick: () => { check(false) },
          title: t('rt.v.recheckTip'),
        }, busy ? t('rt.v.checking') : t('rt.v.check')),
    open
      ? h('div', { class: 'dshp-rt-modal', 'aria-hidden': 'true', onClick: () => { setOpen(false) } },
          h('div', { class: 'dshp-rt-modal-box', onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation() } },
            h('h4', { style: { marginTop: 0 } }, t('rt.v.modalTitle')),
            h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.v.current')), h('span', null, current ?? t('rt.unknown'))),
            h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.v.latest')), h('span', null, latest ?? t('rt.unknown'))),
            h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.v.mode')),
              h('span', null, mode === 'dev' ? t('rt.v.modeDev') : mode === 'package'
                ? t('rt.v.modePackageOf', { pm: (info !== null && info.install !== undefined ? info.install.packageManager : undefined) || 'npm' })
                : t('rt.unknown'))),
            info !== null && info.install !== undefined && info.install.dir !== undefined
              ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.v.dir')), h('span', { class: 'dshp-rt-mono' }, info.install.dir))
              : null,
            err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
            blockers.length > 0
              ? h('div', { class: 'dshp-rt-hint' },
                  h('div', { style: { fontWeight: 600, marginBottom: 4 } }, t('rt.v.blocked')),
                  blockers.map((b, i) => h('div', { key: 'b' + i }, '· ' + b)))
              : null,
            notes.length > 0
              ? h('div', { class: 'dshp-rt-foot', style: { padding: '4px 0' } }, notes.map((n, i) => h('div', { key: 'n' + i }, n)))
              : null,
            h('div', { style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)', margin: '8px 0' } }, t('rt.v.processNote')),
            msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
            h('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 } },
              h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { setOpen(false) } }, t('rt.close')),
              h('button', {
                class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
                disabled: busy || blockers.length > 0 || mode === 'dev',
                title: mode === 'dev' ? t('rt.v.devBlocked') : blockers.length > 0 ? t('rt.v.blockedTip') : t('rt.v.applyTip'),
                onClick: apply,
              }, busy ? t('rt.v.applying') : t('rt.v.apply')))))
      : null)
}
