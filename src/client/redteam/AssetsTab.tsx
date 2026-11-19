/**
 * 资产测绘页签：C 段侧栏 + 筛选工具条 + 结论条 + 列表 / 域名 / Web / 发现时间四视图。
 * 自旧 client.js AssetsTab / DiscoveryView 迁移；新增深链消费：jump('assets', { ip | cidr })。
 */
import { useEffect, useRef, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import {
  Clip, clickable, fmt, fmtShort, PriTag, ProvTag, TestTag, useCollapse,
  type RtTabProps, type Translate,
} from './bits.tsx'

type AnyRec = Record<string, any>

export interface AssetsTabProps extends RtTabProps {
  snapshot: AnyRec | null
  onRefresh: () => void
  onData: () => void
}

export function AssetsTab(props: AssetsTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [view, setView] = useState<'list' | 'timeline' | 'domain' | 'web'>('list')
  const [cidr, setCidr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [qApplied, setQApplied] = useState('')
  const [service, setService] = useState('')
  const [port, setPort] = useState('')
  const [prov, setProv] = useState('')
  const [testStatus, setTestStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [scope, setScope] = useState('')
  const [assetState, setAssetState] = useState('')
  const [sort, setSort] = useState('priority')
  const [showAll, setShowAll] = useState<string | null>(null)
  const [state, setState] = useState<{ loading: boolean; error: string | null; total: number; items: AnyRec[] }>({ loading: false, error: null, total: 0, items: [] })
  const [domains, setDomains] = useState<AnyRec[] | null>(null)
  const [web, setWeb] = useState<AnyRec[] | null>(null)
  const [openId, setOpenId] = useState<string | number | null>(null)
  const [detail, setDetail] = useState<AnyRec | null>(null)
  /** 展开资产时命中的已知漏洞（版本 → CVE）。 */
  const [cves, setCves] = useState<AnyRec[]>([])
  const sideCollapse = useCollapse('assets-side:' + String(eng))
  const seq = useRef(0)

  // 深链：jump('assets', { ip }) 搜资产；jump('assets', { cidr }) 选定 C 段
  useEffect(() => {
    const p = props.params
    if (p === null || p === undefined) return
    setView('list')
    if (typeof p.ip === 'string' && p.ip !== '') { setQ(p.ip); setQApplied(p.ip) }
    if (typeof p.cidr === 'string' && p.cidr !== '') { setCidr(p.cidr); setView('list') }
  }, [props.params])

  useEffect(() => {
    if (eng === null || eng === '') return
    const my = ++seq.current
    setState(s => ({ ...s, loading: true, error: null }))
    void rtOp<AnyRec>('assets', {
      engagement: eng,
      cidr: cidr ?? undefined, q: qApplied || undefined,
      service: service || undefined, port: port || undefined,
      provenance: prov || undefined, test_status: testStatus || undefined,
      priority: priority || undefined, scope: scope || undefined,
      state: assetState || undefined, sort, limit: 400,
    }).then((r) => {
      if (my !== seq.current) return
      if (!r.ok) {
        setState({ loading: false, error: r.error, total: 0, items: [] })
        return
      }
      const d = r.data
      setState({ loading: false, error: null, total: d.total ?? 0, items: d.items ?? [] })
      // C 段/统计可能因本轮采集新增：让外层重拉快照，左侧分类立即更新
      props.onData()
    })
  }, [eng, cidr, qApplied, service, port, prov, testStatus, priority, scope, assetState, sort, props.refreshKey])

  useEffect(() => {
    if (eng === null || eng === '' || view !== 'domain') return
    setDomains(null)
    void rtOp<AnyRec>('domains', { engagement: eng, cidr: cidr ?? undefined }).then((r) => {
      setDomains(r.ok ? (r.data.items ?? []) : [])
    })
  }, [eng, view, cidr, props.refreshKey])

  useEffect(() => {
    if (eng === null || eng === '' || view !== 'web') return
    setWeb(null)
    void rtOp<AnyRec>('web', { engagement: eng, cidr: cidr ?? undefined }).then((r) => {
      setWeb(r.ok ? (r.data.items ?? []) : [])
    })
  }, [eng, view, cidr, props.refreshKey])

  const toggleRow = (id: string | number): void => {
    if (openId === id) { setOpenId(null); setDetail(null); setCves([]); return }
    setOpenId(id)
    setDetail(null)
    setCves([])
    if (eng === null) return
    void rtOp<AnyRec>('asset', { engagement: eng, id }).then((r) => {
      if (r.ok && r.data.asset !== undefined) setDetail(r.data.asset as AnyRec)
    })
    /* 版本 → CVE：展开即查，不用再点一次 */
    void rtOp<AnyRec>('cveMatch', { assetId: id, engagement: eng, limit: 12 }).then((r) => {
      setCves(r.ok && Array.isArray(r.data.items) ? (r.data.items as AnyRec[]) : [])
    })
  }

  const segs: AnyRec[] = (props.snapshot !== null && props.snapshot.segments) as AnyRec[] || []

  const sideChildren: Array<ReturnType<typeof h>> = []
  sideChildren.push(h('div', {
    ...clickable(() => { setView('list'); setCidr(null) }, { label: t('rt.a.allCidr'), expanded: cidr === null }),
    key: 'all', class: 'dshp-rt-seg' + (cidr === null ? ' on' : ''),
  },
    h('div', { class: 'dshp-rt-seg-cidr' }, t('rt.a.allCidr')),
    h('div', { class: 'dshp-rt-seg-meta' }, t('rt.a.nSegs', { n: segs.length }))))

  // 「当前测试」升格进总览页；侧栏保留入口（深链）
  sideChildren.push(h('div', {
    ...clickable(() => { props.jump('overview') }, { label: t('rt.a.testingEntry'), expanded: false }),
    key: 'testing', class: 'dshp-rt-seg', title: t('rt.a.testingTitle'),
  },
    h('div', { class: 'dshp-rt-seg-cidr', style: { display: 'flex', alignItems: 'baseline', gap: 5 } },
      h('span', { class: 'dshp-rt-scope dshp-rt-scope-testing', title: t('rt.a.testingTitle') }, t('rt.a.testingShort')),
      h('span', { style: { flex: 1 } }, t('rt.a.testingEntry')),
      h('span', { class: 'dshp-rt-seg-meta', style: { margin: 0, whiteSpace: 'nowrap' } }, t('rt.a.testingGo')))))

  // C 段按内外网分组：先外网（入口）再内网
  const segBlock = (titleKey: string, list: AnyRec[], kind: 'internal' | 'external'): Array<ReturnType<typeof h>> => {
    const open = sideCollapse.isOpen('scope:' + kind, true)
    const toggle = sideCollapse.toggle('scope:' + kind, true)
    const out = [h('div', {
      key: 'h' + kind, class: 'dshp-rt-sidehead dshp-rt-sidehead-btn',
      role: 'button', tabIndex: 0, 'aria-expanded': open ? 'true' : 'false',
      title: (open ? t('rt.a.collapseGroup') : t('rt.a.expandGroup')),
      onClick: () => { setView('list'); toggle() },
      onKeyDown: (e: { key: string; preventDefault: () => void }) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView('list'); toggle() }
      },
    },
      h('span', { class: 'dshp-rt-sec-caret' }, open ? '▾' : '▸'),
      h('span', { class: 'dshp-rt-scope dshp-rt-scope-' + kind }, kind === 'internal' ? t('rt.scope.internal') : t('rt.scope.external')),
      h('span', null, t(titleKey) + ' · ' + t('rt.a.nCidr', { n: list.length })),
      h('span', { class: 'dshp-rt-spacer' }),
      h('span', { style: { fontWeight: 400 } }, t('rt.a.nAssetsUnit', { n: list.reduce((n: number, x: AnyRec) => n + (x.assets ?? 0), 0) })))]
    if (!open) return out
    for (const s of list) {
      out.push(h('div', {
        ...clickable(() => { setView('list'); setCidr(s.cidr) }, { label: t('rt.a.filterCidr', { cidr: s.cidr }), expanded: cidr === s.cidr }),
        key: s.cidr, class: 'dshp-rt-seg' + (cidr === s.cidr ? ' on' : ''),
        title: (s.org || t('rt.a.unknownOrg')) + ' · ' + t('rt.a.liveOf', { live: s.live ?? 0, total: s.assets ?? 0 }),
      },
        h('div', { class: 'dshp-rt-seg-cidr', style: { display: 'flex', alignItems: 'baseline', gap: 5 } },
          h('span', { class: 'dshp-rt-scope dshp-rt-scope-' + kind }, kind === 'internal' ? t('rt.scope.inShort') : t('rt.scope.outShort')),
          h('span', { style: { flex: 1 } }, s.cidr),
          h('span', { class: 'dshp-rt-seg-meta', style: { margin: 0, whiteSpace: 'nowrap' } },
            t('rt.a.nHosts', { n: s.assets ?? 0 })))))
    }
    return out
  }
  const segExternal = segs.filter((x) => x.scope !== 'internal')
  const segInternal = segs.filter((x) => x.scope === 'internal')
  if (segExternal.length > 0) sideChildren.push(...segBlock('rt.a.extAssets', segExternal, 'external'))
  if (segInternal.length > 0) sideChildren.push(...segBlock('rt.a.intAssets', segInternal, 'internal'))
  const side = h('div', { class: 'dshp-rt-side' }, sideChildren)

  const toolbar = h('div', { class: 'dshp-rt-toolbar' },
    h('input', {
      class: 'dshp-rt-input', style: { flex: '1 1 150px' }, placeholder: t('rt.a.searchPh'),
      value: q, onChange: (e: { target: { value: string } }) => { setQ(e.target.value) },
      onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') setQApplied(q) },
    }),
    h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { setQApplied(q) } }, t('rt.a.search')),
    h('input', {
      class: 'dshp-rt-input', style: { width: '78px' }, placeholder: t('rt.a.service'),
      value: service, onChange: (e: { target: { value: string } }) => { setService(e.target.value) },
    }),
    h('input', {
      class: 'dshp-rt-input', style: { width: '60px' }, placeholder: t('rt.a.port'),
      value: port, onChange: (e: { target: { value: string } }) => { setPort(e.target.value) },
    }),
    h('select', {
      class: 'dshp-rt-input', value: scope,
      onChange: (e: { target: { value: string } }) => { setScope(e.target.value) },
    },
      h('option', { value: '' }, t('rt.a.scopeAny')),
      h('option', { value: 'external' }, t('rt.a.scopeExt')),
      h('option', { value: 'internal' }, t('rt.a.scopeInt'))),
    h('select', {
      class: 'dshp-rt-input', value: prov, title: t('rt.a.provTitle'),
      onChange: (e: { target: { value: string } }) => { setProv(e.target.value) },
    },
      h('option', { value: '' }, t('rt.a.provAny')),
      h('option', { value: 'passive' }, t('rt.a.provPassive')),
      h('option', { value: 'active' }, t('rt.a.provActive'))),
    h('select', {
      class: 'dshp-rt-input', value: priority,
      onChange: (e: { target: { value: string } }) => { setPriority(e.target.value) },
    },
      h('option', { value: '' }, t('rt.a.priAny')),
      h('option', { value: 'high' }, t('rt.pri.high')),
      h('option', { value: 'medium' }, t('rt.pri.medium')),
      h('option', { value: 'low' }, t('rt.pri.low'))),
    h('select', {
      class: 'dshp-rt-input', value: testStatus,
      onChange: (e: { target: { value: string } }) => { setTestStatus(e.target.value) },
    },
      h('option', { value: '' }, t('rt.a.testAny')),
      h('option', { value: 'untested' }, t('rt.test.untested')),
      h('option', { value: 'testing' }, t('rt.test.testing')),
      h('option', { value: 'tested' }, t('rt.test.tested')),
      h('option', { value: 'blocked' }, t('rt.test.blocked')),
      h('option', { value: 'abandoned' }, t('rt.test.abandoned')),
      h('option', { value: 'no_surface' }, t('rt.test.no_surface'))),
    h('div', { class: 'dshp-rt-spacer' }),
    h('button', { class: 'dshp-rt-btn', type: 'button', title: t('rt.a.refreshTitle'), onClick: () => { props.onRefresh() } }, t('rt.refresh')),
    h('button', { class: 'dshp-rt-btn' + (view === 'list' ? ' dshp-rt-btn-primary' : ''), type: 'button', onClick: () => { setView('list') } }, t('rt.a.viewList')),
    h('button', { class: 'dshp-rt-btn' + (view === 'timeline' ? ' dshp-rt-btn-primary' : ''), type: 'button', title: t('rt.a.viewTimelineTitle'), onClick: () => { setView('timeline') } }, t('rt.a.viewTimeline')),
    h('button', { class: 'dshp-rt-btn' + (view === 'domain' ? ' dshp-rt-btn-primary' : ''), type: 'button', onClick: () => { setView('domain') } }, t('rt.a.viewDomain')),
    h('button', { class: 'dshp-rt-btn' + (view === 'web' ? ' dshp-rt-btn-primary' : ''), type: 'button', onClick: () => { setView('web') } }, t('rt.a.viewWeb')))

  // 结论行：数字点一下就是筛选
  const tests: AnyRec = (props.snapshot !== null && props.snapshot.tests) || {}
  const snapStats: AnyRec = (props.snapshot !== null && props.snapshot.stats) || {}
  const noFilter = testStatus === '' && priority === '' && scope === '' && prov === '' && assetState === '' && cidr === null
  const conclItem = (key: string, label: string, value: number, active: boolean, onClick: () => void): ReturnType<typeof h> =>
    h('span', {
      ...clickable(onClick, { label: t('rt.a.filterBy', { label, n: value || 0 }), expanded: active }),
      key, class: 'dshp-rt-concl-i' + (active ? ' on' : ''), title: t('rt.a.filterHint'),
    }, h('b', null, String(value || 0)), h('span', null, label))
  const toggleTest = (v: string): void => { setTestStatus(cur => (cur === v ? '' : v)); setAssetState('') }
  const conclusion = h('div', { class: 'dshp-rt-concl' },
    conclItem('all', t('rt.a.nAssets'), snapStats.assets ?? 0, noFilter, () => {
      setTestStatus(''); setPriority(''); setScope(''); setProv(''); setAssetState(''); setCidr(null)
    }),
    conclItem('live', t('rt.a.nLive'), snapStats.liveAssets ?? 0, assetState === 'live', () => { setAssetState(v => (v === 'live' ? '' : 'live')); setTestStatus('') }),
    conclItem('untested', t('rt.a.nUntested'), tests.untested ?? 0, testStatus === 'untested', () => { toggleTest('untested') }),
    conclItem('testing', t('rt.test.testing'), tests.testing ?? 0, testStatus === 'testing', () => { toggleTest('testing') }),
    conclItem('tested', t('rt.test.tested'), tests.tested ?? 0, testStatus === 'tested', () => { toggleTest('tested') }),
    conclItem('giveup', t('rt.a.nGiveup'), (tests.abandoned ?? 0) + (tests.blocked ?? 0), testStatus === 'abandoned,blocked', () => { toggleTest('abandoned,blocked') }),
    h('div', { class: 'dshp-rt-spacer' }),
    h('select', {
      class: 'dshp-rt-input', value: sort, title: t('rt.a.sortTitle'),
      onChange: (e: { target: { value: string } }) => { setSort(e.target.value) },
    },
      h('option', { value: 'priority' }, t('rt.a.sortPriority')),
      h('option', { value: 'todo' }, t('rt.a.sortTodo')),
      h('option', { value: 'discovered' }, t('rt.a.sortDiscovered')),
      h('option', { value: 'ports' }, t('rt.a.sortPorts')),
      h('option', { value: 'ip' }, t('rt.a.sortIp'))))

  const head = h('div', { class: 'dshp-rt-row head' },
    h('span', null, t('rt.a.hIp')), h('span', null, t('rt.pri.title')), h('span', null, t('rt.a.hTest')),
    h('span', null, t('rt.a.hPorts')), h('span', null, t('rt.a.hFp')))

  const rowNodes: Array<ReturnType<typeof h>> = []
  for (const it of state.items) {
    const openPorts: AnyRec[] = (it.ports ?? []).filter((p: AnyRec) => p.state === 'open')
    const portText = openPorts.map((p) => p.port + (p.service ? '/' + p.service : '')).join(', ') || '—'
    const fpText = (it.fingerprints ?? []).map((f: AnyRec) => [f.vendor, f.product, f.version].filter(Boolean).join(' ')).join(' / ') || '—'
    const shownPorts = openPorts.slice(0, 3).map((p) => p.port + (p.service ? '/' + p.service : '')).join(', ')
    const morePorts = openPorts.length > 3 ? ' +' + (openPorts.length - 3) : ''
    rowNodes.push(h('div', {
      ...clickable(() => { toggleRow(it.id) }, { label: t('rt.a.expandAsset', { ip: it.ip }), expanded: openId === it.id }),
      key: 'r' + it.id, class: 'dshp-rt-row',
    },
      h('span', { class: 'dshp-rt-mono', style: { display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' } },
        h('span', { class: 'dshp-rt-scope dshp-rt-scope-' + (it.scope === 'internal' ? 'internal' : 'external') },
          it.scope === 'internal' ? t('rt.scope.inShort') : t('rt.scope.outShort')),
        h('span', {
          title: it.state === 'live' ? t('rt.a.stateLive') : String(it.state),
          style: {
            width: 7, height: 7, borderRadius: '50%', flex: 'none', marginTop: 4,
            background: it.state === 'live' ? '#10b981' : '#94a3b8',
          },
        }),
        h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, it.ip),
        h('span', {
          style: { fontSize: 10.5, color: 'var(--dsw-alias-label-secondary)', whiteSpace: 'nowrap' },
          title: t('rt.a.discoveredAt') + ':' + (it.discovered_at ? fmt(it.discovered_at) : t('rt.a.discoverUnknown'))
            + (it.last_seen ? '\n' + t('rt.a.lastSeen') + ':' + fmt(it.last_seen) : ''),
        }, it.discovered_at ? fmtShort(it.discovered_at) : t('rt.a.discoverUnknown'))),
      h('span', null, h(PriTag, { t, p: it.priority, title: it.potential || '' })),
      h('span', null, h(TestTag, { t, s: it.test_status }),
        it.blocked_count
          ? h('span', { class: 'dshp-rt-tag', style: { color: '#ef4444', borderColor: '#ef444455', marginLeft: 4 } }, t('rt.a.blockedShort', { n: it.blocked_count }))
          : null),
      h('span', { title: portText }, (shownPorts || '—') + morePorts),
      h('span', { title: fpText }, fpText.length > 30 ? fpText.slice(0, 30) + '…' : fpText)))

    if (openId !== it.id) continue
    const d = detail !== null && detail.id === it.id ? detail : null
    const portRows: Array<ReturnType<typeof h>> = []
    const fpRows: Array<ReturnType<typeof h>> = []
    const obsRows: Array<ReturnType<typeof h>> = []
    if (d !== null) {
      for (const p of (d.ports ?? []) as AnyRec[]) {
        if (p.state !== 'open') continue
        portRows.push(h('div', { key: 'p' + p.port, class: 'dshp-rt-kv' },
          h('b', { class: 'dshp-rt-mono' }, p.port + '/' + p.proto),
          h('span', null, [p.service, p.product, p.version].filter(Boolean).join(' ') || t('rt.a.unknownService')),
          p.url
            ? h('a', { class: 'dshp-rt-link', href: p.url, target: '_blank', rel: 'noreferrer', title: p.url }, p.title !== undefined && p.title !== '' ? p.title : p.url)
            : null,
          h(ProvTag, { t, p: p.provenance })))
      }
      for (const f of (d.fingerprints ?? []) as AnyRec[]) {
        fpRows.push(h('div', { key: 'f' + (f.product || '') + (f.version || '') + (f.evidence || ''), class: 'dshp-rt-kv' },
          h('b', null, f.category || '—'),
          h('span', null, [f.vendor, f.product, f.version].filter(Boolean).join(' ') + (f.evidence ? '（' + f.evidence + '）' : '')),
          h(ProvTag, { t, p: f.provenance })))
      }
      /* 已知漏洞：探到版本就直接列出来，点 CVE 编号可搜详情 */
      if (cves.length > 0) {
        for (const c of cves) {
          fpRows.push(h('div', { key: 'cve' + (c.cve || c.title), class: 'dshp-rt-kv' },
            h('b', { class: 'dshp-rt-mono', style: { color: c.severity === 'critical' ? 'var(--dsw-alias-state-error-primary)' : undefined } },
              (c.cve || t('rt.a.cveNoId')) + (c.exploit ? ' ⚡' : '')),
            h('span', { title: String(c.title || '') }, String(c.title || '') + (c.matched_version ? '（' + c.matched_product + ' ' + c.matched_version + '）' : '')),
            h('span', { class: 'dshp-rt-tag' }, String(c.severity || ''))))
        }
      }
      for (const o of ((d.observations ?? []) as AnyRec[]).slice(0, 8)) {
        obsRows.push(h('div', { key: 'o' + (o.attr || '') + (o.value || '') + (o.collected_at || ''), class: 'dshp-rt-kv' },
          h('b', null, o.attr || '—'),
          h('span', null, (o.value || '') + ' · ' + (o.tool || t('rt.a.unknownTool')) + ' · ' + fmt(o.collected_at)),
          h(ProvTag, { t, p: o.provenance })))
      }
    }
    // 详情分三层：3 行必读 → 「展开全部」后是溯源、原始记录与备注全文
    const all = showAll === it.id
    const noteLines: string[] = d !== null && d.test_notes ? String(d.test_notes).split('\n').filter(Boolean) : []
    const inner = d !== null
      ? h('div', null,
          h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.a.dTest')), h('span', null,
            h(TestTag, { t, s: d.test_status }),
            d.blocked_count
              ? h('span', { class: 'dshp-rt-tag', style: { marginLeft: 6, color: '#ef4444', borderColor: '#ef444455' } }, t('rt.a.blockedN', { n: d.blocked_count }))
              : null,
            h('span', { style: { marginLeft: 8, color: 'var(--dsw-alias-label-secondary)' } },
              (d.test_updated_at ? fmt(d.test_updated_at) : t('rt.a.notTested')) + (d.test_updated_by ? ' · ' + d.test_updated_by : '')))),
          h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.pri.title')), h('span', null,
            h(PriTag, { t, p: d.priority }),
            h('span', { style: { marginLeft: 8 } }, d.potential || t('rt.a.priNone')),
            d.assess_reason ? h('span', { style: { marginLeft: 8, color: 'var(--dsw-alias-label-secondary)' } }, d.assess_reason) : null)),
          h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.a.dSurface')), h('span', null,
            d.test_surface || (portRows.length > 0 ? t('rt.a.surfaceUnrecorded') : t('rt.a.noPorts')),
            d.scope
              ? h('span', {
                  class: 'dshp-rt-scope dshp-rt-scope-' + (d.scope === 'internal' ? 'internal' : 'external'),
                  style: { marginLeft: 8 },
                }, d.scope === 'internal' ? t('rt.scope.internalAsset') : t('rt.scope.externalAsset'))
              : null)),
          h('span', {
            ...clickable(() => { setShowAll(all ? null : it.id) }, { label: all ? t('rt.a.less') : t('rt.a.more'), expanded: all }),
            class: 'dshp-rt-more',
          }, all ? t('rt.a.less') : t('rt.a.more')),
          all
            ? h('div', null,
                h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.a.hostnames')), h('span', null, (d.names ?? []).map((n: AnyRec) => n.name).join(', ') || '—')),
                h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.a.discoveredAt')),
                  h('span', { title: t('rt.a.discoveredTip') }, fmt(d.discovered_at)),
                  h('b', { style: { minWidth: 0, marginLeft: 8 } }, t('rt.a.lastSeen')), h('span', null, fmt(d.last_seen)),
                  h('b', { style: { minWidth: 0, marginLeft: 8 } }, t('rt.a.firstSeen')), h('span', null, fmt(d.first_seen))),
                h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.a.dCidr')), h('span', null, d.segment_cidr)),
                h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.pri.title')), h('span', null,
                  (d.priority || t('rt.a.priNone')) + (d.potential ? ' · ' + t('rt.a.priExpect') + d.potential : '')
                  + (d.assess_reason ? ' · ' + t('rt.a.priReason') + d.assess_reason : '')
                  + (d.assessed_at ? '（' + fmt(d.assessed_at) + '）' : ''))),
                h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.a.dSource')), h('span', null,
                  t('rt.a.passivePorts', { n: d.passive ?? 0 }) + ' · ' + t('rt.a.activePorts', { n: d.active ?? 0 }))),
                h('div', { style: { margin: '6px 0 3px', fontWeight: 600 } }, t('rt.a.openPorts')),
                h('div', null, portRows.length > 0 ? portRows : '—'),
                h('div', { style: { margin: '6px 0 3px', fontWeight: 600 } }, t('rt.a.hFp')),
                h('div', null, fpRows.length > 0 ? fpRows : '—'),
                noteLines.length > 0
                  ? h(Clip, { key: 'notes', t, label: t('rt.a.notes', { n: noteLines.length }), text: noteLines.join('\n') })
                  : null,
                h('div', { style: { margin: '6px 0 3px', fontWeight: 600 } }, t('rt.a.observations')),
                h('div', null, obsRows.length > 0 ? obsRows : '—'))
            : null)
      : h('div', null, t('rt.loading'))
    rowNodes.push(h('div', {
      key: 'd' + it.id, class: 'dshp-rt-row',
      style: { cursor: 'default', gridTemplateColumns: '1fr' },
    }, h('div', { class: 'dshp-rt-expand' }, inner)))
  }

  const listPane = h('div', { class: 'dshp-rt-table' }, head, rowNodes,
    !state.loading && state.items.length === 0 ? h('div', { class: 'dshp-rt-empty' }, t('rt.a.noMatch')) : null)

  // 域名维度：域名 → 关联资产
  const domainPane = h('div', { class: 'dshp-rt-table' },
    domains === null
      ? h('div', { class: 'dshp-rt-empty' }, t('rt.loading'))
      : domains.length === 0
        ? h('div', { class: 'dshp-rt-empty' }, cidr !== null ? t('rt.a.domainEmptyCidr') : t('rt.a.domainEmpty'))
        : domains.map((g) => h('div', { key: g.domain },
            h('div', { class: 'dshp-rt-section', style: { padding: '8px 10px 4px' } },
              h('a', { class: 'dshp-rt-link', href: 'http://' + g.domain, target: '_blank', rel: 'noreferrer' }, g.domain),
              h('span', { class: 'dshp-rt-tag', style: { marginLeft: 8 } }, t('rt.a.nAssetsTag', { n: g.count }))),
            (g.assets ?? []).map((a: AnyRec) => h('div', {
              key: String(g.domain) + '\0' + a.id + '\0' + a.ip, class: 'dshp-rt-row',
              style: { gridTemplateColumns: '150px 130px 70px 1fr', cursor: 'pointer' },
              onClick: () => { setView('list'); setQ(''); setQApplied(a.ip) },
            },
              h('span', { class: 'dshp-rt-mono' }, a.ip),
              h('span', { class: 'dshp-rt-mono' }, a.segment),
              h('span', null, h('span', { class: 'dshp-rt-tag dshp-rt-tag-' + (a.state === 'live' ? 'live' : 'dead') }, a.state === 'live' ? t('rt.a.stateLive') : a.state)),
              h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } }, (a.names ?? []).join(', ')))))))

  // Web 资产：标题 + 可直接点击的 URL
  const webPane = h('div', { class: 'dshp-rt-table' },
    h('div', { class: 'dshp-rt-row head', style: { gridTemplateColumns: '1.6fr 1.2fr 130px 110px' } },
      h('span', null, t('rt.a.webUrl')), h('span', null, t('rt.a.webTitle')), h('span', null, t('rt.a.webAsset')), h('span', null, t('rt.a.webService'))),
    (web ?? []).map((w) => {
      const url = w.url || ('http' + (w.port === 443 || w.port === 8443 || w.port === 9443 ? 's' : '') + '://' + w.ip + (w.port === 80 || w.port === 443 ? '' : ':' + w.port))
      return h('div', {
        key: 'w' + w.port_id, class: 'dshp-rt-row',
        style: { gridTemplateColumns: '1.6fr 1.2fr 130px 110px', cursor: 'default' },
      },
        h('a', { class: 'dshp-rt-link dshp-rt-mono', href: url, target: '_blank', rel: 'noreferrer', title: url }, url),
        h('span', { title: w.title || '' }, w.title || '—'),
        h('span', { class: 'dshp-rt-mono' }, w.ip + ' · ' + w.segment_cidr),
        h('span', { style: { fontSize: 11 } }, [w.service, w.product, w.version].filter(Boolean).join(' ')))
    }),
    web === null
      ? h('div', { class: 'dshp-rt-empty' }, t('rt.loading'))
      : (web.length === 0 ? h('div', { class: 'dshp-rt-empty' }, cidr !== null ? t('rt.a.webEmptyCidr') : t('rt.a.webEmpty')) : null))

  let pane = listPane
  if (view === 'domain') pane = domainPane
  else if (view === 'web') pane = webPane
  else if (view === 'timeline') pane = h(DiscoveryView, { t, eng, refreshKey: props.refreshKey })

  return h('div', { class: 'dshp-rt-split' }, side,
    h('div', { class: 'dshp-rt-main' }, toolbar,
      conclusion,
      state.error !== null ? h('div', { class: 'dshp-rt-err' }, state.error) : null,
      pane))
}

/* ---------- 资产发现时间线 ---------- */

function DiscoveryView(props: { t: Translate; eng: string | null; refreshKey: number }): ReturnType<typeof h> {
  const t = props.t
  const [data, setData] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [day, setDay] = useState('')
  useEffect(() => {
    if (props.eng === null || props.eng === '') return
    setData(null)
    void rtOp<AnyRec>('discoveryTimeline', { engagement: props.eng, limit: 200 }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setData(r.data)
    })
  }, [props.eng, props.refreshKey])
  if (err !== null) return h('div', { class: 'dshp-rt-pane' }, h('div', { class: 'dshp-rt-err' }, err))
  if (data === null) return h('div', { class: 'dshp-rt-empty' }, t('rt.loading'))
  const recent = ((data.recent ?? []) as AnyRec[]).filter((a) => day === '' || String(a.discovered_at || '').slice(0, 10) === day)
  const span: AnyRec = data.span ?? {}
  return h('div', { class: 'dshp-rt-pane', style: { flex: 1, minHeight: 0 } },
    h('div', { class: 'dshp-rt-card' },
      h('h4', null, t('rt.dt.title')),
      h('div', { style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } },
        t('rt.dt.span', {
          n: span.total ?? 0,
          first: span.first !== undefined && span.first !== null ? fmt(span.first) : '—',
          last: span.last !== undefined && span.last !== null ? fmt(span.last) : '—',
        }))),
    ((data.days ?? []) as AnyRec[]).length === 0 ? h('div', { class: 'dshp-rt-empty' }, t('rt.dt.noAssets')) : null,
    h('div', { class: 'dshp-rt-card' },
      h('h4', null, t('rt.dt.byDay'),
        day !== ''
          ? h('span', {
              ...clickable(() => { setDay('') }, { label: t('rt.dt.clearFilter', { day }) }),
              class: 'dshp-rt-tag', style: { marginLeft: 6, cursor: 'pointer' },
            }, t('rt.dt.clearFilterShort', { day }))
          : null),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
        ((data.days ?? []) as AnyRec[]).map((d) => h('div', {
          ...clickable(() => { setDay(day === d.day ? '' : d.day) }, { label: t('rt.dt.filterDay', { day: d.day }), expanded: day === d.day }),
          key: d.day, class: 'dshp-rt-seg' + (day === d.day ? ' on' : ''), style: { marginBottom: 0, cursor: 'pointer' },
          title: d.day + '：' + t('rt.dt.dayTitle', { n: d.assets, ni: d.internal, ne: d.external }),
        },
          h('div', { class: 'dshp-rt-seg-cidr' }, d.day),
          h('div', { class: 'dshp-rt-seg-meta' }, t('rt.dt.dayMeta', { n: d.assets, ni: d.internal, ne: d.external })))))),
    h('div', { class: 'dshp-rt-card' },
      h('h4', null, day !== ''
        ? t('rt.dt.recentOfDay', { day, n: recent.length })
        : t('rt.dt.recent', { n: recent.length })),
      recent.length === 0 ? h('div', { class: 'dshp-rt-empty' }, t('rt.dt.dayEmpty')) : null,
      recent.map((a) => h('div', { key: a.id, class: 'dshp-rt-kv' },
        h('b', { class: 'dshp-rt-mono', style: { minWidth: 110 } },
          h('span', {
            class: 'dshp-rt-scope dshp-rt-scope-' + (a.scope === 'internal' ? 'internal' : 'external'),
            style: { marginRight: 4 },
          }, a.scope === 'internal' ? t('rt.scope.inShort') : t('rt.scope.outShort')),
          a.ip),
        h('span', { style: { minWidth: 132, fontSize: 11.5, color: 'var(--dsw-alias-label-secondary)' } },
          a.discovered_at ? fmt(a.discovered_at) : t('rt.dt.timeUnknown')),
        h('span', { style: { flex: 1 } }, (a.primary_name || '—') + (a.open_ports ? ' · ' + t('rt.dt.ports', { n: a.open_ports }) : '')),
        h(PriTag, { t, p: a.priority })))))
}
