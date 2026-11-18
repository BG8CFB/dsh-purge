/**
 * 作战总览首页（C-3.2）：一屏看清「打到哪了、谁在跑、最近拿了什么、缺什么证据」。
 *   - 阶段进度条 + 总分/满分（op: scoreChain 的 stages 与 summary）；
 *   - 在跑智能体卡（op: agentsStatus）；
 *   - 最近命中 5 条（op: scores 展平 hits，点击深链到得分点的命中列表）；
 *   - 缺证据警告（op: scoreReport 的 summary.missingRequests）；
 *   - 常驻「当前测试」卡（旧 TestingTab 升格迁入，5s 轮询保留）。
 */
import { useEffect, useRef, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import { Clip, clickable, fmt, Section, TestTag, useCollapse, type RtTabProps, type Translate } from './bits.tsx'

type AnyRec = Record<string, any>

export function OverviewTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng

  const [chain, setChain] = useState<AnyRec | null>(null)
  const [chainErr, setChainErr] = useState<string | null>(null)
  const [agents, setAgents] = useState<AnyRec | null>(null)
  const [scores, setScores] = useState<AnyRec | null>(null)
  const [reportSummary, setReportSummary] = useState<AnyRec | null>(null)

  useEffect(() => {
    if (eng === null || eng === '') return
    setChain(null)
    setChainErr(null)
    void rtOp<AnyRec>('scoreChain', { engagement: eng }).then((r) => {
      if (r.ok) setChain(r.data)
      else setChainErr(r.error)
    })
    void rtOp<AnyRec>('agentsStatus').then((r) => {
      if (r.ok) setAgents(r.data)
    })
    void rtOp<AnyRec>('scores', { engagement: eng }).then((r) => {
      if (r.ok) setScores(r.data)
    })
    void rtOp<AnyRec>('scoreReport', { engagement: eng }).then((r) => {
      if (r.ok) setReportSummary(r.data.summary ?? null)
    })
  }, [eng, props.refreshKey])

  const stages: AnyRec[] = (chain !== null && chain.stages) || []
  const summary: AnyRec | null = chain !== null ? chain.summary : null
  const totalPoints = summary !== null ? (summary.totalPoints ?? 0) : 0
  const points = summary !== null ? (summary.points ?? 0) : 0
  const pct = totalPoints > 0 ? Math.min(100, Math.round((points / totalPoints) * 100)) : 0

  // 阶段进度条：每段显示该阶段得分与累计
  const stageBar = h('div', { class: 'dshp-rt-stages' },
    stages.length === 0 && chainErr === null
      ? h('div', { class: 'dshp-rt-ov-sub', style: { padding: '2px 0' } }, t('rt.ov.noStages'))
      : stages.map((st, i) => h('div', {
          key: 'st' + i,
          class: 'dshp-rt-stage-seg',
          style: { borderTopColor: st.color || '#64748b' },
          title: st.goal || '',
        },
          h('div', { class: 'dshp-rt-stage-nm' }, String(i + 1) + '. ' + st.name),
          h('div', null,
            h('span', {
              class: 'dshp-rt-ap-pts',
              style: st.points > 0 ? { background: (st.color || '#10b981') + '22', color: st.color || '#065f46', borderColor: (st.color || '#10b981') + '66' } : {},
            }, '+' + (st.points ?? 0))),
          h('div', { class: 'dshp-rt-stage-cum' }, t('rt.c.cumulative', { n: st.cumulative ?? 0 })))))

  // 总分 / 满分
  const scoreTile = h('div', { class: 'dshp-rt-ov-tile' },
    h('div', { class: 'dshp-rt-ov-title' }, t('rt.ov.scoreTitle')),
    h('div', null,
      h('span', { class: 'dshp-rt-ov-big' }, String(points)),
      h('span', { style: { fontSize: 13, color: 'var(--dsw-alias-label-secondary)' } }, ' / ' + String(totalPoints))),
    h('div', { class: 'dshp-rt-ov-bar' }, h('i', { style: { width: pct + '%' } })),
    h('div', { class: 'dshp-rt-ov-sub' }, t('rt.ov.scoreSub', { pct })),
    summary !== null
      ? h('div', { class: 'dshp-rt-ov-sub' },
          t('rt.ov.hitCount', {
            hits: summary.countedHits ?? 0,
            capped: summary.serviceCappedHits ? t('rt.ov.cappedExtra', { n: summary.serviceCappedHits }) : '',
          }))
      : null,
    chainErr !== null ? h('div', { class: 'dshp-rt-err' }, chainErr) : null)

  // 在跑智能体卡
  const agentsTile = h('div', { class: 'dshp-rt-ov-tile' },
    h('div', { class: 'dshp-rt-ov-title' }, t('rt.tab.agents')),
    agents === null
      ? h('div', { class: 'dshp-rt-ov-sub' }, t('rt.loading'))
      : h('div', null,
          h('div', null,
            h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, t('rt.ag.maxN', { n: agents.max ?? 3 })),
            h('span', {
              class: 'dshp-rt-tag' + ((agents.used ?? 0) >= (agents.max ?? 3) ? ' dshp-rt-tag-warn' : ' dshp-rt-tag-live'),
              style: { marginLeft: 4 },
            }, t('rt.ag.usedN', { used: agents.used ?? 0, free: Math.max((agents.max ?? 3) - (agents.used ?? 0), 0) }))),
          ((agents.running ?? []) as AnyRec[]).length > 0
            ? h('div', { style: { marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 } },
                ((agents.running ?? []) as AnyRec[]).slice(0, 6).map((r, i) =>
                  h('div', {
                    key: 'ag' + i,
                    class: 'dshp-rt-tag',
                    style: { display: 'block', whiteSpace: 'normal', overflowWrap: 'anywhere' },
                    title: r.parent || '',
                  }, h('span', { class: 'dshp-rt-live-dot', style: { display: 'inline-block', marginRight: 5 } }), r.label)))
            : h('div', { class: 'dshp-rt-ov-sub', style: { marginTop: 6 } }, t('rt.ov.noRunningAgents'))),
    h('div', { style: { marginTop: 'auto', paddingTop: 6 } },
      h('button', {
        class: 'dshp-rt-btn', type: 'button', style: { padding: '0 8px', fontSize: 11 },
        onClick: () => { props.jump('agents') },
      }, t('rt.ov.openAgents'))))

  // 最近命中 5 条（scoreHit 记录展平，点击深链到得分点）
  const allHits: Array<AnyRec> = []
  if (scores !== null) {
    for (const p of (scores.items ?? []) as AnyRec[]) {
      for (const hh of (p.hits ?? []) as AnyRec[]) {
        allHits.push({ ...hh, pointId: p.id, pointName: p.name })
      }
    }
    allHits.sort((a, b) => String(b.recorded_at || '').localeCompare(String(a.recorded_at || '')))
  }
  const recentHits = allHits.slice(0, 5)
  const hitsTile = h('div', { class: 'dshp-rt-ov-tile' },
    h('div', { class: 'dshp-rt-ov-title' }, t('rt.ov.recentHits')),
    scores === null
      ? h('div', { class: 'dshp-rt-ov-sub' }, t('rt.loading'))
      : recentHits.length === 0
        ? h('div', { class: 'dshp-rt-ov-sub' }, t('rt.ov.noHits'))
        : h('div', null, recentHits.map((hh, i) => h('div', {
            ...clickable(() => { props.jump('scores', { pointId: hh.pointId }) },
              { label: t('rt.ov.hitJump', { point: hh.pointName }) }),
            key: 'h' + i,
            class: 'dshp-rt-ov-hit',
            title: t('rt.ov.hitJumpTitle'),
          },
            h('div', { class: 'dshp-rt-ov-hit-head' },
              h('span', { class: 'dshp-rt-ov-hit-name' }, hh.pointName),
              hh.self_created ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.s.selfCreated')) : null,
              hh.capped ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.s.serviceCapped')) : null,
              h('span', { class: 'dshp-rt-hit-time' }, fmt(hh.recorded_at))),
            h('div', { class: 'dshp-rt-mono', style: { fontSize: 11.5, wordBreak: 'break-all' } },
              hh.asset_ip || hh.target || t('rt.s.noAsset')),
            hh.evidence
              ? h('div', {
                  class: 'dshp-rt-hit-txt',
                  style: { flex: 'none', maxHeight: 34, overflow: 'hidden' },
                  title: hh.evidence,
                }, String(hh.evidence).replace(/\n+/g, ' '))
              : h('div', { class: 'dshp-rt-hit-txt none' }, t('rt.s.noEvidence'))))))

  // 缺证据警告
  const missing = reportSummary !== null ? (reportSummary.missingRequests ?? 0) : 0
  const evidenceTile = h('div', { class: 'dshp-rt-ov-tile' },
    h('div', { class: 'dshp-rt-ov-title' }, t('rt.ov.evidenceTitle')),
    reportSummary === null
      ? h('div', { class: 'dshp-rt-ov-sub' }, t('rt.loading'))
      : missing > 0
        ? h('div', { class: 'dshp-rt-hint', style: { marginBottom: 0 } },
            h('b', null, t('rt.ov.missingEvidence', { n: missing })),
            h('div', { style: { marginTop: 3 } }, t('rt.ov.missingEvidenceHow')))
        : h('div', { class: 'dshp-rt-ov-sub' },
            (reportSummary.count ?? 0) > 0
              ? t('rt.ov.evidenceOk', { n: reportSummary.withRequests ?? 0, m: reportSummary.count ?? 0 })
              : t('rt.ov.evidenceNoItems')),
    h('div', { style: { marginTop: 'auto', paddingTop: 6 } },
      h('button', {
        class: 'dshp-rt-btn', type: 'button', style: { padding: '0 8px', fontSize: 11 },
        onClick: () => { props.jump('report') },
      }, t('rt.tab.report'))))

  return h('div', { class: 'dshp-rt-main', style: { overflow: 'auto' } },
    stageBar,
    h('div', { class: 'dshp-rt-ov-grid' }, scoreTile, agentsTile, hitsTile, evidenceTile),
    h(TestingCard, { t, eng, refreshKey: props.refreshKey }))
}

/* ---------- 当前测试卡（旧 TestingTab 升格迁入；5s 轮询保留） ---------- */

export function TestingCard(props: { t: Translate; eng: string | null; refreshKey: number }): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [data, setData] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [at, setAt] = useState<Date | null>(null)
  const [auto, setAuto] = useState(true)
  const collapse = useCollapse('testing:' + String(eng))

  // 5 秒轮询要有在途守卫：慢网/后端卡住时旧响应不能覆盖新状态
  const inflight = useRef(false)
  const seq = useRef(0)
  const load = (): void => {
    if (eng === null || eng === '' || inflight.current) return
    inflight.current = true
    const my = ++seq.current
    void rtOp<AnyRec>('activeTests', { engagement: eng, limit: 20 }).then((r) => {
      if (my !== seq.current) return /* 过期响应：丢弃，不动在途标记 */
      inflight.current = false
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setData(r.data)
      setAt(new Date())
    })
  }
  useEffect(() => { seq.current += 1; load() }, [eng, props.refreshKey])
  useEffect(() => {
    if (eng === null || eng === '' || !auto) return undefined
    const timer = setInterval(load, 5000)
    return () => { clearInterval(timer) }
  }, [eng, auto, props.refreshKey])

  const testing: AnyRec[] = (data !== null && data.testing) || []
  const recent: AnyRec[] = (data !== null && data.recent) || []
  const queue: AnyRec[] = (data !== null && data.queue) || []
  const stats: AnyRec = (data !== null && data.stats) || {}

  // 一台资产一张卡：一眼看清「打的是谁、打到哪、拿到什么」
  const card = (a: AnyRec, past: boolean): ReturnType<typeof h> => {
    const chips: Array<ReturnType<typeof h>> = []
    chips.push(h('span', {
      key: 'sc',
      class: 'dshp-rt-scope dshp-rt-scope-' + (a.scope === 'internal' ? 'internal' : 'external'),
    }, a.scope === 'internal' ? t('rt.scope.internal') : t('rt.scope.external')))
    if (a.segment_cidr) chips.push(h('span', { key: 'seg', class: 'dshp-rt-tag' }, a.segment_cidr))
    if (a.open_ports) chips.push(h('span', { key: 'p', class: 'dshp-rt-tag dshp-rt-tag-active' }, t('rt.t.openPorts', { n: a.open_ports })))
    if (a.vulns) chips.push(h('span', { key: 'v', class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.c.nVulns', { n: a.vulns })))
    if (a.webshells) chips.push(h('span', { key: 'w', class: 'dshp-rt-tag dshp-rt-tag-passive' }, t('rt.t.webshells', { n: a.webshells })))
    if (a.tunnels) chips.push(h('span', { key: 't', class: 'dshp-rt-tag dshp-rt-tag-passive' }, t('rt.se.tunnelsTitle') + ' ' + a.tunnels))
    if (a.priority) chips.push(h('span', { key: 'pr', class: 'dshp-rt-tag' }, t('rt.c.easyN', { p: a.priority })))
    if (a.blocked_count) {
      chips.push(h('span', {
        key: 'b', class: 'dshp-rt-tag', style: { color: '#ef4444', borderColor: '#ef444455' },
      }, t('rt.a.blockedN', { n: a.blocked_count })))
    }
    const noteLines = a.test_notes !== undefined && a.test_notes !== null
      ? String(a.test_notes).split('\n').slice(-3).map((l: string) => (l.length > 240 ? l.slice(0, 240) + ' …' : l))
      : []
    return h('div', { key: 'at' + a.id, class: 'dshp-rt-atest' + (past ? ' past' : '') },
      h('div', { class: 'dshp-rt-atest-head' },
        past ? null : h('span', { class: 'dshp-rt-live-dot' }),
        h('span', { class: 'dshp-rt-atest-ip' }, a.ip),
        h('span', null, h(TestTag, { t, s: a.test_status })),
        h('div', { class: 'dshp-rt-spacer' }),
        h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } },
          fmt(a.test_updated_at) + (a.test_updated_by ? ' · ' + a.test_updated_by : ''))),
      chips.length > 0 ? h('div', null, chips) : null,
      a.test_surface ? h('div', { class: 'dshp-rt-atest-meta' }, t('rt.t.surface') + '：' + a.test_surface) : null,
      a.potential ? h('div', { class: 'dshp-rt-atest-meta' }, t('rt.t.potential') + '：' + a.potential) : null,
      noteLines.length > 0 ? h(Clip, { t, label: t('rt.a.notesShort'), text: noteLines.join('\n') }) : null)
  }

  const concl = (label: string, value: number): ReturnType<typeof h> =>
    h('span', { key: label, class: 'dshp-rt-concl-i', style: { cursor: 'default' } },
      h('b', null, String(value ?? 0)), h('span', null, label))
  const conclusion = h('div', { class: 'dshp-rt-concl' },
    concl(t('rt.test.testing'), stats.testing ?? 0),
    concl(t('rt.a.nUntested'), stats.untested ?? 0),
    concl(t('rt.test.tested'), stats.tested ?? 0),
    concl(t('rt.a.nGiveup'), (stats.abandoned ?? 0) + (stats.blocked ?? 0)),
    concl(t('rt.test.no_surface'), stats.no_surface ?? 0),
    h('div', { class: 'dshp-rt-spacer' }),
    at !== null
      ? h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } },
          t('rt.t.updatedAt', { time: at.toLocaleTimeString('zh-CN', { hour12: false }) }))
      : null,
    h('button', {
      class: 'dshp-rt-btn', type: 'button', style: { padding: '0 7px', fontSize: 11 },
      title: t('rt.t.expandAllTitle'),
      onClick: () => { collapse.setAll(['testing', 'recent', 'queue'], true) },
    }, t('rt.f.expandAll')),
    h('button', {
      class: 'dshp-rt-btn', type: 'button', style: { padding: '0 7px', fontSize: 11 },
      title: t('rt.t.collapseAllTitle'),
      onClick: () => { collapse.setAll(['testing', 'recent', 'queue'], false) },
    }, t('rt.f.collapseAll')),
    h('button', {
      class: 'dshp-rt-btn' + (auto ? ' dshp-rt-btn-primary' : ''), type: 'button',
      style: { padding: '0 7px', fontSize: 11 },
      title: t('rt.t.autoTitle'), onClick: () => { setAuto(x => !x) },
    }, auto ? t('rt.t.live5s') : t('rt.t.paused')),
    h('button', { class: 'dshp-rt-btn', type: 'button', style: { padding: '0 7px', fontSize: 11 }, onClick: load }, t('rt.refresh')))

  const body: Array<ReturnType<typeof h>> = []
  body.push(h(Section, {
    tone: 'test', title: t('rt.t.testingNow'),
    count: t('rt.t.nHosts', { n: testing.length }),
    sub: testing.length > 0 ? t('rt.t.testingSub') : t('rt.t.testingEmptySub'),
    open: collapse.isOpen('testing', true),
    onToggle: collapse.toggle('testing', true),
  }, testing.length > 0
    ? testing.map((a) => card(a, false))
    : h('div', { class: 'dshp-rt-atest-meta', style: { paddingBottom: 4 } }, t('rt.t.testingEmpty'))))
  body.push(h(Section, {
    tone: 'past', title: t('rt.t.recent'), count: t('rt.t.nHosts', { n: recent.length }),
    sub: t('rt.t.recentSub'),
    open: collapse.isOpen('recent', false),
    onToggle: collapse.toggle('recent', false),
  }, recent.length > 0 ? recent.map((a) => card(a, true)) : h('div', { class: 'dshp-rt-atest-meta' }, t('rt.empty'))))
  body.push(h(Section, {
    tone: 'queue', title: t('rt.t.queue'),
    count: t('rt.t.nHosts', { n: data !== null ? (data.untested ?? 0) : 0 }),
    sub: t('rt.t.queueSub'),
    open: collapse.isOpen('queue', false),
    onToggle: collapse.toggle('queue', false),
  }, queue.length > 0
    ? [...queue.map((a) => card(a, true)),
        h('div', { key: 'queueHint', class: 'dshp-rt-atest-meta', style: { paddingTop: 4 } }, t('rt.t.queueHint'))]
    : h('div', { class: 'dshp-rt-atest-meta' }, t('rt.t.queueEmpty'))))

  return h('div', { class: 'dshp-rt-main', style: { borderTop: '1px solid var(--dsw-alias-border-l1)', marginTop: 10 } },
    h('div', { style: { padding: '8px 12px 0', fontWeight: 600 } }, t('rt.t.cardTitle')),
    conclusion,
    err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
    data === null && err === null ? h('div', { class: 'dshp-rt-empty' }, t('rt.loading')) : null,
    h('div', { class: 'dshp-rt-body', style: { overflow: 'auto' } },
      h('div', { style: { padding: '6px 12px 14px' } }, body)))
}
