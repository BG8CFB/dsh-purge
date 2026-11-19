/**
 * 告警研判：左队列 + 右详情（红队「漏洞战果」同款分栏与字牌）。
 * j/k 选行，f 误报，p 待查，i 升事件。
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { fmt, fmtShort } from '../redteam/bits.tsx'
import { Block, Empty, KV, Tag } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>
const CAUSES = ['rule', 'unknown-asset', 'business-change', 'clock-skew', 'other']

export function AlertsPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [status, setStatus] = useState('new,triaging')
  const [severity, setSeverity] = useState('')
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<AnyRec[]>([])
  const [counts, setCounts] = useState<AnyRec>({})
  const [sel, setSel] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [cause, setCause] = useState('rule')
  const [incTitle, setIncTitle] = useState('')
  const [incSev, setIncSev] = useState('P2')
  const [note, setNote] = useState('')
  const [suppressUntil, setSuppressUntil] = useState('')
  const selRef = useRef<number | null>(null)
  selRef.current = sel

  const load = useCallback((): void => {
    void blueOp<AnyRec>('alerts', {
      engagement: props.eng, status: status === '' ? undefined : status, severity: severity || undefined, q: q || undefined, limit: 80,
    }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      const items = Array.isArray(r.data.items) ? r.data.items : []
      setRows(items)
      setCounts(r.data.counts ?? {})
      if (selRef.current !== null && !items.some((x: AnyRec) => Number(x.id) === selRef.current)) setSel(items[0] !== undefined ? Number(items[0].id) : null)
      else if (selRef.current === null && items[0] !== undefined) setSel(Number(items[0].id))
    })
  }, [props.eng, status, severity, q])

  useEffect(() => { load() }, [load, props.refreshKey])

  const selected = rows.find((r) => Number(r.id) === sel) ?? null
  const report = (message: string, ok: boolean): void => { props.notices.report(message, ok ? 'success' : 'failure') }
  const call = (op: string, body: Record<string, unknown>, okText: string): void => {
    setBusy(true)
    void blueOp<AnyRec>(op, { engagement: props.eng, ...body }).then((r) => {
      setBusy(false)
      if (!r.ok) { report(r.error, false); return }
      report(okText, true)
      load()
    })
  }

  const triageFalse = (): void => { if (selected !== null) call('alertTriage', { alert_id: Number(selected.id), verdict: 'false_positive', cause, note }, '已判误报') }
  const triagePending = (): void => { if (selected !== null) call('alertTriage', { alert_id: Number(selected.id), verdict: 'pending', note }, '已标记待查') }
  const promote = (): void => {
    if (selected === null) return
    const title = incTitle.trim() !== '' ? incTitle.trim() : String(selected.title || '事件')
    setBusy(true)
    void blueOp<AnyRec>('incidentOpen', { engagement: props.eng, title, severity: incSev, alertIds: [Number(selected.id)], category: 'other' }).then((r) => {
      if (!r.ok) { setBusy(false); report(r.error, false); return }
      const incidentId = Number(r.data.id)
      void blueOp<AnyRec>('alertTriage', { engagement: props.eng, alert_id: Number(selected.id), verdict: 'confirmed', incident_id: incidentId, note }).then((r2) => {
        setBusy(false)
        if (!r2.ok) { report(r2.error, false); return }
        report('已升为事件 #' + incidentId, true)
        setIncTitle('')
        load()
        props.jump('incidents', { incidentId })
      })
    })
  }
  const suppress = (): void => { if (selected !== null) call('alertSuppress', { alert_id: Number(selected.id), reason: note || '手动抑制', until: suppressUntil || undefined }, '已抑制') }
  const duplicate = (): void => {
    if (selected === null) return
    const raw = typeof window !== 'undefined' ? window.prompt('原告警 id') : null
    if (raw === null || raw.trim() === '') return
    call('alertTriage', { alert_id: Number(selected.id), verdict: 'duplicate', dup_of: Number(raw), note }, '已标重复')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const tag = e.target !== null && (e.target as { tagName?: string }).tagName ? (e.target as { tagName?: string }).tagName : ''
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || rows.length === 0) return
      const idx = rows.findIndex((r) => Number(r.id) === selRef.current)
      if (e.key === 'j' || e.key === 'ArrowDown') { const next = rows[Math.min(rows.length - 1, idx + 1)]; if (next) setSel(Number(next.id)) }
      else if (e.key === 'k' || e.key === 'ArrowUp') { const prev = rows[Math.max(0, idx - 1)]; if (prev) setSel(Number(prev.id)) }
      else if (e.key === 'f') triageFalse()
      else if (e.key === 'p') triagePending()
      else if (e.key === 'i') promote()
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  })

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)

  const sevTag = (s: string) => Tag({ tone: s === 'P0' ? 'warn' : s === 'P1' ? 'active' : 'passive', children: s })
  const statusTag = (s: string) => Tag({
    tone: s === 'confirmed' ? 'live' : s === 'false_positive' ? 'passive' : s === 'suppressed' ? 'passive' : 'active',
    children: String(s),
  })

  const left = h('div', { class: 'dshp-rt-pane', style: { width: '46%', minWidth: 320, display: 'flex', flexDirection: 'column', minHeight: 0 } },
    h('div', { class: 'dshp-rt-actions', style: { marginBottom: 6 } },
      h('select', { class: 'dshp-rt-input', value: status, onChange: (e: { target: { value: string } }) => setStatus(e.target.value) },
        h('option', { value: 'new,triaging' }, t('b.al.pending') + ' (' + String(counts.byStatus?.new ?? 0) + ')'),
        h('option', { value: '' }, t('b.al.all'))),
      h('select', { class: 'dshp-rt-input', value: severity, onChange: (e: { target: { value: string } }) => setSeverity(e.target.value) },
        h('option', { value: '' }, t('b.al.filterSeverity')),
        ['P0', 'P1', 'P2', 'P3'].map((s) => h('option', { key: s, value: s }, s))),
      h('input', { class: 'dshp-rt-input', style: { flex: '1 1 120px' }, placeholder: t('b.al.search'), value: q, onChange: (e: { target: { value: string } }) => setQ(e.target.value) })),
    rows.length === 0
      ? Empty({ children: t('b.al.noAlerts') })
      : h('div', { style: { overflow: 'auto', minHeight: 0 } }, rows.map((r) => h('div', {
          key: String(r.id),
          class: 'dshp-rt-row',
          style: {
            padding: '6px 8px', borderBottom: '1px solid var(--dsw-alias-border-l2)', cursor: 'pointer',
            background: Number(r.id) === sel ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent',
          },
          onClick: () => setSel(Number(r.id)),
        },
          h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
            sevTag(String(r.severity)),
            h('span', { style: { flex: 1, fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, String(r.title || '')),
            Tag({ tone: 'passive', children: String(r.count || 1) + '×' })),
          h('div', { class: 'dshp-rt-ov-sub', style: { display: 'flex', gap: 8 } },
            h('span', null, fmtShort(r.first_seen)),
            h('span', { class: 'dshp-rt-mono' }, String(r.entity_id || '—')),
            h('span', null, String(r.rule_name || r.rule_code || '')),
            r.sla_due_at !== null ? h('span', null, 'SLA ' + fmtShort(r.sla_due_at)) : null)))))

  const triageBlock = Block({
    title: '研判',
    children: h('div', null,
      KV({ rows: [['首次出现', fmt(selected === null ? null : selected.first_seen)], ['SLA 截止', fmt(selected === null ? null : selected.sla_due_at)]] }),
      h('textarea', {
        class: 'dshp-rt-textarea', style: { width: '100%', minHeight: 54, marginTop: 6 },
        placeholder: t('b.note'), value: note, onChange: (e: { target: { value: string } }) => setNote(e.target.value),
      }),
      h('div', { class: 'dshp-rt-actions', style: { marginTop: 6 } },
        h('select', { class: 'dshp-rt-input', value: cause, onChange: (e: { target: { value: string } }) => setCause(e.target.value) },
          CAUSES.map((c) => h('option', { key: c, value: c }, t('b.al.cause.' + c)))),
        h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: triageFalse }, t('b.al.false')),
        h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: triagePending }, t('b.al.pendingBtn')),
        h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: duplicate }, t('b.al.dup'))))
  })

  const promoteBlock = Block({
    title: '升为事件',
    children: h('div', { class: 'dshp-rt-actions' },
      h('input', { class: 'dshp-rt-input', style: { flex: '1 1 160px' }, placeholder: t('b.al.incidentTitle'), value: incTitle, onChange: (e: { target: { value: string } }) => setIncTitle(e.target.value) }),
      h('select', { class: 'dshp-rt-input', value: incSev, onChange: (e: { target: { value: string } }) => setIncSev(e.target.value) },
        ['P0', 'P1', 'P2', 'P3'].map((s) => h('option', { key: s, value: s }, s))),
      h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy, onClick: promote }, t('b.al.toIncident')))
  })

  const suppressBlock = Block({
    title: '抑制',
    children: h('div', { class: 'dshp-rt-actions' },
      h('input', { class: 'dshp-rt-input', style: { flex: '1 1 160px' }, placeholder: 'until (ISO，可空)', value: suppressUntil, onChange: (e: { target: { value: string } }) => setSuppressUntil(e.target.value) }),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: suppress }, t('b.al.suppress')))
  })

  const detail = selected === null
    ? Empty({ children: t('b.al.pick') })
    : h('div', { class: 'dshp-rt-pane', style: { flex: 1, minHeight: 0, overflow: 'auto' } },
        h('div', { class: 'dshp-rt-ov-title' }, String(selected.title || '')),
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', margin: '6px 0' } },
          Tag({ tone: String(selected.severity) === 'P0' ? 'warn' : 'active', children: String(selected.severity) }),
          Tag({ tone: String(selected.status) === 'confirmed' ? 'live' : 'passive', children: String(selected.status) }),
          Tag({ children: t('b.al.entity') + ': ' + String(selected.entity_id || '—') }),
          Tag({ children: t('b.al.asset') + ': ' + String(selected.asset_ip || '—') }),
          Tag({ children: t('b.al.rule') + ': ' + String(selected.rule_name || selected.rule_code || '—') }),
          Tag({ children: t('b.al.count') + ': ' + String(selected.count || 1) })),
        triageBlock, promoteBlock, suppressBlock,
        h('div', { class: 'dshp-rt-foot', style: { borderTop: 'none', paddingLeft: 0 } }, 'j/k 选行 · f 误报 · p 待查 · i 升事件'),
        selected.triage_note ? h('pre', { class: 'dshp-rt-evi-body' }, String(selected.triage_note)) : null)

  return h('div', { class: 'dshp-rt-split' }, left, detail)
}
