/**
 * 蓝队值守台根组件（main 面板第三个页签）。
 *
 * **与红队演练台同构**：项目头（名称/侧别/模式/SLA/范围/本会话绑定）→ 项目下拉 + 实时角标 +
 * 版本 + 刷新 → 分组页签（项目组：项目中心 / 总览 / 资产测绘 / 智能体 / 告警研判 / 漏洞 /
 * 事件处置 / 检测覆盖 / 报告；全局组：技能库 / 环境适配）→ 分页签错误边界 → 底部统计。
 *
 * 业务模型：一个防守项目 = 一个责任区工作区，各自的 SQLite 库；会话通过 session-bindings.json
 * 绑到项目。项目中心是"有哪些项目"的入口，其余页签都在"当前项目"上下文里取值。
 */
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { h, Loading, type NoticeSource } from '../shared/ui.ts'
import { blueOp, BLUE_EVENTS_PATH } from './api.ts'
import { zhBlue } from './locale.ts'
import { createLive } from '../redteam/live.ts'
import { installRtStyles } from '../redteam/styles.ts'
import type { Translate } from '../redteam/bits.tsx'
import { fmt } from '../redteam/bits.tsx'
import { OverviewPane } from './OverviewPane.tsx'
import { AlertsPane } from './AlertsPane.tsx'
import { IncidentsPane } from './IncidentsPane.tsx'
import { AssetsPane } from './AssetsPane.tsx'
import { VulnsPane } from './VulnsPane.tsx'
import { DetectionPane } from './DetectionPane.tsx'
import { AgentsPane } from './AgentsPane.tsx'
import { ReportPane } from './ReportPane.tsx'
import { SkillsPane } from './SkillsPane.tsx'
import { EnvPane } from './EnvPane.tsx'
import { Field, Tag } from './kit.tsx'

type AnyRec = Record<string, any>

/** 项目组页签（都带当前项目上下文）。 */
export const PROJECT_TABS = [
  'projects', 'overview', 'assets', 'agents', 'alerts', 'vulns', 'incidents', 'detection', 'report',
] as const
/** 全局组页签（跨项目共享）。 */
export const GLOBAL_TABS = ['skills', 'env'] as const
const TAB_KEYS = [...PROJECT_TABS, ...GLOBAL_TABS] as const
export type BlueTabKey = typeof TAB_KEYS[number]

export interface BluePaneProps {
  t: Translate
  eng: string
  refreshKey: number
  notices: NoticeSource
  jump: (tab: string, params?: Record<string, unknown>) => void
  params: Record<string, unknown> | null
  go: (tab: string) => void
  snapshot?: AnyRec | null
}

export interface BlueTabProps {
  t: Translate
  sessionId?: string
  notices: NoticeSource
  initialTab?: string
  initialEngagement?: string
  enterShift?: (id: string) => Promise<boolean>
  newShiftSession?: (id: string) => Promise<boolean>
  deleteProject?: (id: string) => Promise<boolean>
}

export function BlueTab(props: BlueTabProps): ReturnType<typeof h> {
  const t = props.t
  const tt: Translate = (key, params) => {
    const value = t(key, params)
    if (value !== key) return value
    const raw = zhBlue[key]
    if (raw === undefined) return key
    if (params === undefined) return raw
    return raw.replace(/\{(\w+)\}/g, (_m, k) => (params[k] === undefined ? '{' + k + '}' : String(params[k])))
  }
  const [tab, setTab] = useState<BlueTabKey>(() => (TAB_KEYS as readonly string[]).includes(String(props.initialTab)) ? props.initialTab as BlueTabKey : 'overview')
  const [params, setParams] = useState<Record<string, any> | null>(null)
  const [projects, setProjects] = useState<AnyRec[]>([])
  const [eng, setEng] = useState<string | null>(() => (typeof props.initialEngagement === 'string' && props.initialEngagement !== '' ? props.initialEngagement : null))
  const [snapshot, setSnapshot] = useState<AnyRec | null>(null)
  const [meta, setMeta] = useState<AnyRec | null>(null)
  const [boundEng, setBoundEng] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [version, setVersion] = useState<string>('')
  const [form, setForm] = useState({ name: '', scope: '', mode: 'drill', sla: 'standard', defender: '' })
  const [busy, setBusy] = useState('')
  const [filter, setFilter] = useState<string>('active')
  const [creating, setCreating] = useState(false)

  const liveRef = useRef<ReturnType<typeof createLive> | null>(null)
  if (liveRef.current === null) {
    liveRef.current = createLive((kind) => {
      if (kind === '__poll') return
      setRefreshKey((k) => k + 1)
    }, BLUE_EVENTS_PATH)
  }
  const live = liveRef.current
  const liveSnap = useSyncExternalStore(live.subscribe, live.hooks.snapshot)

  const loadSnapshot = useCallback((id: string | null): void => {
    if (id === null || id === '') { setSnapshot(null); setMeta(null); return }
    void blueOp<AnyRec>('snapshot', { engagement: id }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setSnapshot(r.data.snapshot ?? null)
      setMeta(r.data.meta ?? null)
    })
  }, [])

  const loadBindings = useCallback((): void => {
    if (props.sessionId === undefined || props.sessionId === '') { setBoundEng(null); return }
    void blueOp<AnyRec>('bindings').then((r) => {
      if (!r.ok) return
      const hit = ((r.data.items ?? []) as AnyRec[]).find((x) => x.session === props.sessionId)
      setBoundEng(hit !== undefined ? String(hit.engagement) : null)
    })
  }, [props.sessionId])

  const refreshList = useCallback((selectId?: string): void => {
    void blueOp<AnyRec>('bootstrap').then((b) => {
      if (!b.ok) return
      setProjects(Array.isArray(b.data.engagements) ? b.data.engagements : [])
      if (typeof b.data.version === 'string') setVersion(b.data.version)
      if (selectId !== undefined) { setEng(selectId); loadSnapshot(selectId) }
    })
  }, [loadSnapshot])

  useEffect(() => { installRtStyles() }, [])

  useEffect(() => {
    void blueOp<AnyRec>('bootstrap').then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setProjects(Array.isArray(r.data.engagements) ? r.data.engagements : [])
      if (typeof r.data.version === 'string') setVersion(r.data.version)
      const id = typeof r.data.current === 'string' && r.data.current !== '' ? r.data.current : null
      if (eng === null && id !== null) { setEng(id); loadSnapshot(id) }
      else if (eng === null) setTab('projects')
    })
    loadBindings()
  }, [loadSnapshot, loadBindings])

  useEffect(() => {
    live.start(eng)
    return () => { live.stop() }
  }, [eng, live])

  const pick = (id: string): void => {
    setEng(id)
    loadSnapshot(id)
    void blueOp('activateEngagement', { engagement: id })
    setRefreshKey((k) => k + 1)
  }

  const create = (): void => {
    if (form.name.trim() === '') { props.notices.report(tt('b.namePh'), 'failure'); return }
    setBusy('create')
    void blueOp<AnyRec>('openEngagement', {
      name: form.name.trim(),
      scope: form.scope.split(/[\n,，\s]+/).map((x) => x.trim()).filter(Boolean),
      mode: form.mode, slaProfile: form.sla, defender: form.defender.trim(),
    }).then((r) => {
      setBusy('')
      if (!r.ok) { props.notices.report(r.error, 'failure'); return }
      const id = r.data.engagement !== undefined ? String(r.data.engagement.id) : ''
      setForm({ name: '', scope: '', mode: 'drill', sla: 'standard', defender: '' })
      refreshList(id)
      if (id !== '') setTab('overview')
      props.notices.report(tt('b.create') + ' ✓', 'success')
    })
  }

  const bindHere = (id: string): void => {
    if (props.sessionId === undefined || props.sessionId === '') return
    void blueOp<AnyRec>('bindSession', { sessionId: props.sessionId, engagement: id }).then((r) => {
      if (!r.ok) { props.notices.report(r.error, 'failure'); return }
      setBoundEng(id)
      props.notices.report(tt('b.boundHere'), 'success')
    })
  }

  const unbindHere = (): void => {
    if (props.sessionId === undefined || props.sessionId === '') return
    void blueOp<AnyRec>('bindSession', { sessionId: props.sessionId, engagement: '' }).then((r) => {
      if (!r.ok) { props.notices.report(r.error, 'failure'); return }
      setBoundEng(null)
      props.notices.report(tt('b.unbound'), 'success')
    })
  }

  const refreshAll = useCallback((): void => {
    setRefreshKey((k) => k + 1)
    refreshList()
    if (eng !== null) loadSnapshot(eng)
    loadBindings()
  }, [eng, loadSnapshot, loadBindings, refreshList])

  const jump = useCallback((next: string, nextParams?: Record<string, unknown>): void => {
    if ((TAB_KEYS as readonly string[]).includes(next)) setTab(next as BlueTabKey)
    setParams(nextParams ?? null)
    setRefreshKey((k) => k + 1)
  }, [])
  const go = useCallback((next: string): void => { jump(next) }, [jump])

  const paneProps: BluePaneProps = { t: tt, eng: eng ?? '', refreshKey, notices: props.notices, jump, params, go, snapshot }

  let body: ReactNode
  if (tab === 'projects') {
    const visible = projects.filter((p) => filter === 'all' ? true : (p.status !== 'archived' && p.status !== 'closed'))

    const statusTag = (status: string) => status === 'archived' || status === 'closed'
      ? Tag({ tone: 'passive', children: status === 'closed' ? '已关闭' : '已归档' })
      : Tag({ tone: 'live', children: '进行中' })

    const projectCard = (p: AnyRec) => {
      const stats = p.stats || {}
      const vulnTotal = Number(stats.vulns || 0)
      const vulnFixed = Number(p.vulnFixed || 0)
      const pct = vulnTotal > 0 ? Math.round((vulnFixed / vulnTotal) * 100) : 0
      return h('div', { key: String(p.id), class: 'dshp-pj-card' + (eng === p.id ? ' is-current' : '') },
        h('div', { class: 'dshp-pj-card-head' },
          h('div', { class: 'dshp-pj-card-name', title: String(p.id) }, String(p.name || p.id)),
          statusTag(String(p.status || 'active')),
          Tag({ tone: 'live', children: tt('b.side') }),
          Tag({ children: p.mode === 'live' ? tt('b.mode.live') : tt('b.mode.drill') }),
          eng === p.id ? Tag({ tone: 'active', children: '当前' }) : null),
        h('div', { class: 'dshp-pj-meta' },
          h('span', { class: 'dshp-rt-mono' }, String(p.id)),
          h('span', { class: 'dshp-pj-dot' }, '·'),
          h('span', null, 'SLA ' + String(p.sla_profile || 'standard')),
          h('span', { class: 'dshp-pj-dot' }, '·'),
          h('span', null, tt('b.created') + '：' + (p.created_at ? fmt(p.created_at) : '—'))),
        (p.scope || []).length > 0
          ? h('div', { class: 'dshp-pj-chips' }, (p.scope || []).map((c: string, i: number) => Tag({ key: 'c' + i, mono: true, children: c })))
          : h('div', { class: 'dshp-pj-chips' }, Tag({ tone: 'passive', children: '未填责任范围' })),
        h('div', { class: 'dshp-pj-stats' },
          h('span', null, '资产 ' + Number(stats.assets || 0)),
          h('span', null, '漏洞 ' + vulnTotal),
          h('span', null, '告警 ' + Number(stats.alerts || 0)),
          h('span', null, '事件 ' + Number(stats.incidents || 0))),
        h('div', { class: 'dshp-pj-actions' },
          props.enterShift !== undefined
            ? h('button', {
                class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
                onClick: () => {
                  void props.enterShift?.(String(p.id)).then((ok) => { if (!ok) props.notices.report('会话创建失败', 'failure') })
                },
              }, tt('b.enter'))
            : null,
          props.newShiftSession !== undefined
            ? h('button', {
                class: 'dshp-rt-btn', type: 'button',
                onClick: () => {
                  void props.newShiftSession?.(String(p.id)).then((ok) => { if (!ok) props.notices.report('会话创建失败', 'failure') })
                },
              }, tt('b.newSession'))
            : null,
          h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { pick(String(p.id)); setTab('overview') } }, tt('b.open')),
          props.deleteProject !== undefined
            ? h('button', {
                class: 'dshp-rt-btn dshp-rt-btn-danger', type: 'button',
                onClick: () => {
                  if (typeof window !== 'undefined' && !window.confirm(tt('b.deleteConfirm', { name: String(p.name || p.id) }))) return
                  void props.deleteProject?.(String(p.id)).then((ok) => {
                    props.notices.report(ok ? '✓' : '删除失败', ok ? 'success' : 'failure')
                    refreshList()
                  })
                },
              }, tt('b.delete'))
            : null))
    }

    const head = h('div', { class: 'dshp-pj-head' },
      h('div', { class: 'dshp-pj-titlebox' },
        h('div', { class: 'dshp-pj-title' }, tt('b.tab.projects')),
        h('div', { class: 'dshp-pj-sub' }, tt('b.projectsSubtitle'))),
      h('div', { class: 'dshp-rt-spacer' }),
      h('div', { class: 'dshp-rt-subtabs', style: { borderBottom: 'none', padding: 0 } },
        (['active', 'all'] as string[]).map((f) => h('button', {
          key: f, type: 'button',
          class: 'dshp-rt-subtab' + (filter === f ? ' on' : ''),
          onClick: () => setFilter(f),
        }, f === 'active' ? '进行中 (' + visible.length + ')' : '全部 (' + projects.length + ')'))),
      h('button', {
        class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
        onClick: () => setCreating((v) => !v),
      }, creating ? tt('b.cancel') : tt('b.create')))

    const createCard = creating
      ? h('div', { class: 'dshp-rt-card dshp-pj-create' },
          h('div', { class: 'dshp-rt-ov-title' }, tt('b.create')),
          Field({ label: '名称 / 责任区', children: h('input', {
            class: 'dshp-rt-input', placeholder: tt('b.namePh'), value: form.name,
            onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, name: e.target.value })),
            onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') create() },
          }) }),
          Field({ label: '责任 CIDR', children: h('textarea', {
            class: 'dshp-rt-textarea', style: { minHeight: 56, fontFamily: 'ui-monospace, Consolas, monospace' },
            placeholder: tt('b.scopePh'), value: form.scope,
            onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, scope: e.target.value })),
          }) }),
          Field({ label: '防守方 / 班组', children: h('input', {
            class: 'dshp-rt-input', placeholder: tt('b.defenderPh'), value: form.defender,
            onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, defender: e.target.value })),
          }) }),
          Field({ label: '模式 / SLA', children: h('div', { style: { display: 'flex', gap: 6 } },
            h('select', { class: 'dshp-rt-input', value: form.mode, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, mode: e.target.value })) },
              h('option', { value: 'drill' }, tt('b.mode.drill')),
              h('option', { value: 'live' }, tt('b.mode.live'))),
            h('select', { class: 'dshp-rt-input', value: form.sla, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, sla: e.target.value })) },
              h('option', { value: 'standard' }, 'SLA standard'),
              h('option', { value: 'strict' }, 'SLA strict'),
              h('option', { value: 'loose' }, 'SLA loose'))) }),
          h('div', { class: 'dshp-pj-actions' },
            h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => setCreating(false) }, tt('b.cancel')),
            h('button', {
              class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
              disabled: busy === 'create' || form.name.trim() === '', onClick: create,
            }, busy === 'create' ? tt('b.creating') : tt('b.create')))
        )
      : null

    body = h('div', { class: 'dshp-rt-main', style: { overflow: 'auto' } },
      head,
      createCard,
      projects.length === 0 ? h('div', { class: 'dshp-rt-empty' }, tt('b.noProjectHint')) : null,
      h('div', { class: 'dshp-pj-grid' }, visible.map(projectCard)),
      projects.length > 0 ? h('div', { class: 'dshp-rt-foot', style: { borderTop: 'none', paddingLeft: 0 } }, '共 ' + projects.length + ' 个项目') : null)
  } else if (err !== null) {
    body = h('div', { class: 'dshp-rt-err' }, err)
  } else if (tab === 'skills') body = h(SkillsPane, paneProps)
  else if (tab === 'env') body = h(EnvPane, paneProps)
  else if (eng === null) {
    body = h('div', { class: 'dshp-rt-pane' }, h('div', { class: 'dshp-rt-empty' }, tt('b.noProjectHint')))
  } else if (tab === 'overview') body = h(OverviewPane, paneProps)
  else if (tab === 'alerts') body = h(AlertsPane, paneProps)
  else if (tab === 'incidents') body = h(IncidentsPane, paneProps)
  else if (tab === 'assets') body = h(AssetsPane, paneProps)
  else if (tab === 'vulns') body = h(VulnsPane, paneProps)
  else if (tab === 'detection') body = h(DetectionPane, paneProps)
  else if (tab === 'agents') body = h(AgentsPane, paneProps)
  else if (tab === 'report') body = h(ReportPane, paneProps)
  else body = h('div', { class: 'dshp-rt-empty' }, tt('b.empty'))

  const isLive = liveSnap.status === 'live'
  const canBind = props.sessionId !== undefined && props.sessionId !== ''
  const isBoundHere = eng !== null && boundEng === eng
  const stats: AnyRec = (snapshot !== null && snapshot.stats) || {}

  return h('div', { class: 'dshp-rt-root' },
    tab === 'projects' ? null : h('div', { class: 'dshp-rt-projhead' },
      h('button', {
        class: 'dshp-rt-btn dshp-rt-btn-ghost', type: 'button',
        onClick: () => { setTab('projects'); setParams(null) },
      }, '‹ ' + tt('b.back')),
      h('span', { class: 'dshp-rt-projname' }, meta !== null && meta.name ? String(meta.name) : tt('b.noProject')),
      h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, tt('b.side')),
      meta !== null ? h('span', { class: 'dshp-rt-tag' }, meta.mode === 'live' ? tt('b.mode.live') : tt('b.mode.drill')) : null,
      meta !== null ? h('span', { class: 'dshp-rt-tag' }, 'SLA ' + String(meta.sla_profile || 'standard')) : null,
      meta !== null && meta.created_at ? h('span', { class: 'dshp-rt-projmeta' }, tt('b.created') + ' ' + fmt(meta.created_at)) : null,
      ((meta !== null && meta.scope) || []).slice(0, 3).map((cidr: string, i: number) =>
        h('span', { key: 'sc' + i, class: 'dshp-rt-tag dshp-rt-mono' }, cidr)),
      h('div', { class: 'dshp-rt-spacer' }),
      eng !== null && props.enterShift !== undefined
        ? h('button', {
            class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
            onClick: () => {
              void props.enterShift?.(eng).then((ok) => { if (!ok) props.notices.report('会话创建失败', 'failure') })
            },
          }, tt('b.enter'))
        : null,
      eng !== null && props.newShiftSession !== undefined
        ? h('button', {
            class: 'dshp-rt-btn', type: 'button',
            onClick: () => {
              void props.newShiftSession?.(eng).then((ok) => { if (!ok) props.notices.report('会话创建失败', 'failure') })
            },
          }, tt('b.newSession'))
        : null,
      canBind
        ? (isBoundHere
            ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' },
                tt('b.boundHere'),
                h('button', { class: 'dshp-rt-linkbtn', type: 'button', onClick: unbindHere }, '×'))
            : (eng !== null
                ? h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => bindHere(eng) }, tt('b.bindHere'))
                : null))
        : h('span', { class: 'dshp-rt-projmeta' }, tt('b.noSession'))),

    h('div', { class: 'dshp-rt-head' },
      h('select', {
        class: 'dshp-rt-input', style: { maxWidth: 190, flex: '1 1 150px' },
        value: eng ?? '',
        onChange: (e: { target: { value: string } }) => pick(e.target.value),
      },
        h('option', { value: '', disabled: true }, projects.length > 0 ? tt('b.pickProject') : tt('b.noProject')),
        projects.map((p) => h('option', { key: String(p.id), value: String(p.id) }, String(p.name || p.id)))),
      h('span', { class: 'dshp-rt-livebadge' + (isLive ? ' is-live' : '') },
        h('b', null), isLive ? tt('b.live') : tt('b.polling')),
      h('div', { class: 'dshp-rt-spacer' }),
      version !== '' ? h('span', { class: 'dshp-rt-tag' }, 'v' + version) : null,
      h('button', { class: 'dshp-rt-btn', type: 'button', onClick: refreshAll }, tt('b.refresh'))),

    h('div', { class: 'dshp-rt-tabs', role: 'tablist' },
      PROJECT_TABS.map((k) => h('div', {
        key: k,
        class: 'dshp-rt-tab' + (tab === k ? ' on' : ''),
        role: 'tab', tabIndex: 0, 'aria-selected': tab === k ? 'true' : 'false',
        onClick: () => { setTab(k); setParams(null); setRefreshKey((n) => n + 1) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(k); setParams(null); setRefreshKey((n) => n + 1) }
        },
      }, tt('b.tab.' + k))),
      h('span', { class: 'dshp-rt-tabsep' }, tt('b.group.global')),
      GLOBAL_TABS.map((k) => h('div', {
        key: k,
        class: 'dshp-rt-tab dshp-rt-tab-global' + (tab === k ? ' on' : ''),
        role: 'tab', tabIndex: 0, 'aria-selected': tab === k ? 'true' : 'false',
        onClick: () => { setTab(k); setParams(null); setRefreshKey((n) => n + 1) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(k); setParams(null); setRefreshKey((n) => n + 1) }
        },
      }, tt('b.tab.' + k)))),

    h('div', { class: 'dshp-rt-body', key: 'body-' + tab },
      h(BtBoundary, { key: tab, t: tt, onBack: () => { setTab('projects'); setRefreshKey((n) => n + 1) } }, body)),

    h('div', { class: 'dshp-rt-foot' },
      h('span', null, tt('b.foot.assets', { n: stats.assets ?? 0 })),
      h('span', null, tt('b.foot.ports', { n: stats.openPorts ?? 0 })),
      h('span', null, tt('b.foot.vulns', { n: stats.vulns ?? 0 })),
      h('span', null, tt('b.foot.alerts', { n: stats.unhandledAlerts ?? 0 })),
      h('span', null, tt('b.foot.incidents', { n: stats.openIncidents ?? 0 })),
      h('span', null, tt('b.foot.exposures', { n: stats.openExposures ?? 0 })),
      h('span', null, tt('b.foot.rules', { n: stats.rules ?? 0 })),
      h('div', { class: 'dshp-rt-spacer' }),
      h('span', null, 'SQLite · ' + (meta !== null && meta.name ? String(meta.name) : ''))))
}

/* ---------- 错误边界：单个子页签渲染出错只降级该页 ---------- */
class BtBoundary extends Component<{ t: Translate; onBack: () => void; children?: ReactNode }, { error: Error | null }> {
  constructor(props: { t: Translate; onBack: () => void; children?: ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error): { error: Error } { return { error } }
  componentDidCatch(error: Error): void {
    try { console.error('[dsh-purge blueteam] tab render error:', error) } catch { /* ignore */ }
  }
  render(): ReactNode {
    if (this.state.error !== null) {
      return h('div', { class: 'dshp-rt-pane' },
        h('div', { class: 'dshp-rt-err' }, '子页签渲染出错：' + (this.state.error.message || String(this.state.error))),
        h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { this.setState({ error: null }); this.props.onBack() } }, '返回项目中心'))
    }
    return this.props.children
  }
}
