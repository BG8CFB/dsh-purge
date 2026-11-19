/**
 * 检测覆盖：数据源台账 + 规则库 + ATT&CK 三色矩阵（covered / gap / blind）。
 */
import { useCallback, useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { fmt } from '../redteam/bits.tsx'
import { Block, Empty, KV, Tag } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>

export function DetectionPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [sources, setSources] = useState<AnyRec[]>([])
  const [rules, setRules] = useState<AnyRec[]>([])
  const [cov, setCov] = useState<AnyRec>({ items: [] })
  const [err, setErr] = useState<string | null>(null)
  const [src, setSrc] = useState({ kind: 'host', product: '', status: 'connected', retentionDays: '180' })
  const [rule, setRule] = useState({ code: '', name: '', ttp: 'T1059', sourceId: '', severity: 'high', logic: '' })

  const load = useCallback((): void => {
    void blueOp<AnyRec>('logSources', { engagement: props.eng }).then((r) => { if (r.ok) setSources(Array.isArray(r.data.items) ? r.data.items : []) })
    void blueOp<AnyRec>('detections', { engagement: props.eng }).then((r) => { if (r.ok) setRules(Array.isArray(r.data.items) ? r.data.items : []) })
    void blueOp<AnyRec>('coverage', { engagement: props.eng }).then((r) => { if (r.ok) setCov(r.data); else setErr(r.error) })
  }, [props.eng])

  useEffect(() => { load() }, [load, props.refreshKey])

  const call = (op: string, body: Record<string, unknown>, okText: string): void => {
    void blueOp<AnyRec>(op, { engagement: props.eng, ...body }).then((r) => {
      if (!r.ok) { props.notices.report(r.error, 'failure'); return }
      props.notices.report(okText, 'success')
      load()
    })
  }

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)
  const items = (cov.items ?? []) as AnyRec[]

  const sourceBlock = Block({
    title: t('b.dt.sources'), count: sources.length,
    children: h('div', null,
      h('div', { class: 'dshp-rt-actions' },
        h('select', { class: 'dshp-rt-input', value: src.kind, onChange: (e: { target: { value: string } }) => setSrc((s) => ({ ...s, kind: e.target.value })) },
          ['network', 'host', 'app', 'account', 'honeypot'].map((k) => h('option', { key: k, value: k }, k))),
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 120px' }, placeholder: t('b.dt.product'), value: src.product, onChange: (e: { target: { value: string } }) => setSrc((s) => ({ ...s, product: e.target.value })) }),
        h('select', { class: 'dshp-rt-input', value: src.status, onChange: (e: { target: { value: string } }) => setSrc((s) => ({ ...s, status: e.target.value })) },
          ['connected', 'degraded', 'planned', 'offline'].map((k) => h('option', { key: k, value: k }, k))),
        h('input', { class: 'dshp-rt-input', style: { width: 90 }, placeholder: t('b.dt.retention'), value: src.retentionDays, onChange: (e: { target: { value: string } }) => setSrc((s) => ({ ...s, retentionDays: e.target.value })) }),
        h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', onClick: () => call('logSourceAdd', { ...src, retention_days: Number(src.retentionDays) }, t('b.saved')) }, t('b.dt.addSource'))),
      sources.length === 0 ? Empty({ children: t('b.empty') }) : null,
      sources.map((s) => h('div', { key: String(s.id), class: 'dshp-rt-ov-sub', style: { display: 'flex', gap: 6, padding: '2px 0' } },
        Tag({ tone: String(s.status) === 'connected' ? 'live' : String(s.status) === 'offline' ? 'warn' : 'passive', children: String(s.status) }),
        h('span', null, String(s.kind) + ' · ' + String(s.product || '') + ' · 留存 ' + String(s.retention_days ?? '—') + ' 天'),
        h('div', { style: { flex: 1 } }),
        h('span', { class: 'dshp-rt-mono' }, fmt(s.last_event_at))))),
  })

  const ruleBlock = Block({
    title: t('b.dt.rules'), count: rules.length,
    children: h('div', null,
      h('div', { class: 'dshp-rt-actions' },
        h('input', { class: 'dshp-rt-input', style: { width: 140 }, placeholder: 'code', value: rule.code, onChange: (e: { target: { value: string } }) => setRule((s) => ({ ...s, code: e.target.value })) }),
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 140px' }, placeholder: 'name', value: rule.name, onChange: (e: { target: { value: string } }) => setRule((s) => ({ ...s, name: e.target.value })) }),
        h('input', { class: 'dshp-rt-input', style: { width: 84 }, placeholder: t('b.dt.ttp'), value: rule.ttp, onChange: (e: { target: { value: string } }) => setRule((s) => ({ ...s, ttp: e.target.value })) }),
        h('input', { class: 'dshp-rt-input', style: { width: 92 }, placeholder: 'source_id', value: rule.sourceId, onChange: (e: { target: { value: string } }) => setRule((s) => ({ ...s, sourceId: e.target.value })) })),
      h('textarea', { class: 'dshp-rt-textarea', style: { width: '100%', minHeight: 40, marginTop: 6 }, placeholder: t('b.dt.logic'), value: rule.logic, onChange: (e: { target: { value: string } }) => setRule((s) => ({ ...s, logic: e.target.value })) }),
      h('div', { class: 'dshp-rt-actions', style: { marginTop: 6 } },
        h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', onClick: () => call('detectionAdd', { ...rule, source_id: rule.sourceId === '' ? undefined : Number(rule.sourceId) }, t('b.saved')) }, t('b.dt.addRule'))),
      rules.length === 0 ? Empty({ children: t('b.empty') }) : null,
      rules.map((r) => h('div', { key: String(r.id), class: 'dshp-rt-ov-sub', style: { display: 'flex', gap: 6, padding: '2px 0' } },
        Tag({ tone: String(r.status) === 'active' ? 'live' : 'passive', children: String(r.status) }),
        Tag({ children: String(r.ttp || '—') }),
        h('span', { style: { flex: 1 } }, String(r.code) + ' · ' + String(r.name)),
        h('span', null, r.fp_rate === null ? '' : 'FP ' + String(r.fp_rate))))),
  })

  const matrixBlock = Block({
    title: t('b.dt.matrix'),
    sub: t('b.dt.covered') + ' ' + String(cov.covered ?? 0) + ' / ' + String(cov.total ?? 0) + ' · ' + t('b.dt.gap') + ' ' + String(cov.gap ?? 0) + ' · ' + t('b.dt.blind') + ' ' + String(cov.blind ?? 0),
    children: h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 } },
      items.map((it) => h('div', {
        key: String(it.ttp), title: String(it.ttp) + ' · ' + String(it.state),
        class: 'dshp-rt-tag' + (it.state === 'covered' ? ' dshp-rt-tag-live' : it.state === 'gap' ? ' dshp-rt-tag-warn' : ' dshp-rt-tag-passive'),
        style: { justifyContent: 'center', fontSize: 10 },
      }, String(it.ttp)))),
  })

  return h('div', { class: 'dshp-rt-main', style: { overflow: 'auto' } }, sourceBlock, ruleBlock, matrixBlock)
}
