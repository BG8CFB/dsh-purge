/**
 * 漏洞（蓝队待修清单）：左列表 + 右详情，与红队「漏洞战果」同构。
 * 红队记"打穿什么"，蓝队记"还剩什么没修"；修完必须留证据。
 */
import { useCallback, useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { fmt } from '../redteam/bits.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>
const STATUSES = ['candidate', 'confirmed', 'exploited', 'fixed', 'false-positive']
const SEVERITIES = ['critical', 'high', 'medium', 'low', 'info']

export function VulnsPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [items, setItems] = useState<AnyRec[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [severity, setSeverity] = useState('')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<number | null>(null)
  const [evidence, setEvidence] = useState('')
  const [form, setForm] = useState({ ip: '', title: '', severity: 'high', cve: '' })
  const [err, setErr] = useState<string | null>(null)
  const [params, setParams] = useState<Record<string, any> | null>(null)

  const load = useCallback((): void => {
    void blueOp<AnyRec>('vulns', {
      engagement: props.eng, status: status || undefined, severity: severity || undefined, q: q || undefined, limit: 300,
    }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      const list = Array.isArray(r.data.items) ? r.data.items : []
      setItems(list)
      setTotal(Number(r.data.total || 0))
      if (sel === null && list[0] !== undefined) setSel(Number(list[0].id))
      if (props.params !== null && props.params !== undefined && props.params.vulnId !== undefined) setSel(Number(props.params.vulnId))
    })
  }, [props.eng, status, severity, q, sel, props.params])

  useEffect(() => { load() }, [load, props.refreshKey])

  const call = (op: string, body: Record<string, unknown>, okText: string): void => {
    void blueOp<AnyRec>(op, { engagement: props.eng, ...body }).then((r) => {
      if (!r.ok) { props.notices.report(r.error, 'failure'); return }
      props.notices.report(okText, 'success')
      load()
    })
  }

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)
  const current = items.find((x) => Number(x.id) === sel) || null

  const sevColor = (sev: string): string => sev === 'critical' ? 'var(--dsw-alias-state-error-primary)'
    : sev === 'high' ? 'var(--dsw-alias-state-warning-primary)' : 'var(--dsw-alias-interactive-bg-hover)'

  const left = h('div', { style: { width: '46%', minWidth: 300, display: 'flex', flexDirection: 'column', minHeight: 0 } },
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 } },
      h('select', { class: 'dshp-rt-input', value: status, onChange: (e: { target: { value: string } }) => setStatus(e.target.value) },
        h('option', { value: '' }, t('b.vu.all') + ' (' + total + ')'),
        STATUSES.map((s) => h('option', { key: s, value: s }, t('b.vu.status.' + s)))),
      h('select', { class: 'dshp-rt-input', value: severity, onChange: (e: { target: { value: string } }) => setSeverity(e.target.value) },
        h('option', { value: '' }, t('b.ov.risk')),
        SEVERITIES.map((s) => h('option', { key: s, value: s }, s))),
      h('input', {
        class: 'dshp-rt-input', style: { flex: '1 1 120px' }, placeholder: t('b.vu.search'), value: q,
        onChange: (e: { target: { value: string } }) => setQ(e.target.value),
      })),
    h('div', { style: { overflow: 'auto', minHeight: 0 } },
      items.length === 0 ? h('div', { class: 'dshp-rt-empty' }, t('b.vu.empty')) : null,
      items.map((v) => h('div', {
        key: String(v.id),
        style: {
          padding: '6px 8px', borderBottom: '1px solid var(--dsw-alias-border-l2)', cursor: 'pointer',
          background: sel === Number(v.id) ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent',
        },
        onClick: () => { setSel(Number(v.id)); setEvidence('') },
      },
        h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
          h('span', { style: { fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: sevColor(String(v.severity)), color: v.severity === 'critical' ? 'var(--dsw-alias-label-on-color)' : 'inherit' } }, String(v.severity)),
          h('span', { style: { flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, String(v.title)),
          h('span', { class: 'dshp-rt-tag' }, t('b.vu.status.' + String(v.status)))),
        h('div', { style: { fontSize: 10, color: 'var(--dsw-alias-label-secondary)' } },
          String(v.asset_ip || v.target || '—') + (v.cve ? ' · ' + String(v.cve) : '') + ' · ' + fmt(v.found_at))))))

  const right = h('div', { style: { flex: 1, minWidth: 300, overflow: 'auto', minHeight: 0 } },
    current === null
      ? h('div', { class: 'dshp-rt-empty' }, '左侧选一条漏洞；或在下方登记新的。')
      : h('div', null,
          h('h4', { style: { margin: '0 0 6px' } }, String(current.title)),
          h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, marginBottom: 8 } },
            h('span', { class: 'dshp-rt-tag' }, String(current.severity)),
            h('span', { class: 'dshp-rt-tag' }, String(current.status)),
            current.cve ? h('span', { class: 'dshp-rt-tag dshp-rt-mono' }, String(current.cve)) : null,
            h('span', null, '资产：' + String(current.asset_ip || current.target || '—')),
            h('span', null, '来源：' + String(current.source || '—')),
            h('span', null, '发现：' + fmt(current.found_at))),
          h('div', { class: 'dshp-rt-card' },
            h('div', { style: { fontSize: 11, marginBottom: 4 } }, t('b.vu.evidence')),
            h('textarea', {
              class: 'dshp-rt-input', style: { width: '100%', minHeight: 60 }, value: evidence,
              onChange: (e: { target: { value: string } }) => setEvidence(e.target.value),
            }),
            h('div', { style: { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' } },
              h('button', {
                class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
                onClick: () => call('vulnUpdate', { vuln_id: Number(current.id), status: 'fixed', evidence: evidence || '修复记录见工单' }, t('b.vu.fixed')),
              }, t('b.vu.markFixed')),
              h('button', {
                class: 'dshp-rt-btn', type: 'button',
                onClick: () => call('vulnUpdate', { vuln_id: Number(current.id), status: 'confirmed', evidence: evidence || undefined }, '已确认'),
              }, '确认成立'),
              h('button', {
                class: 'dshp-rt-btn', type: 'button',
                onClick: () => call('vulnUpdate', { vuln_id: Number(current.id), status: 'false-positive', evidence: evidence || '复测不成立' }, t('b.vu.falsePositive')),
              }, t('b.vu.falsePositive')))),
          h('div', { class: 'dshp-rt-card' },
            h('div', { style: { fontSize: 11, marginBottom: 4 } }, '登记新漏洞'),
            h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
              h('input', { class: 'dshp-rt-input', style: { width: 120 }, placeholder: 'IP', value: form.ip, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, ip: e.target.value })) }),
              h('input', { class: 'dshp-rt-input', style: { flex: '1 1 160px' }, placeholder: t('b.vu.title'), value: form.title, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, title: e.target.value })) }),
              h('input', { class: 'dshp-rt-input', style: { width: 100 }, placeholder: 'CVE', value: form.cve, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, cve: e.target.value })) }),
              h('select', { class: 'dshp-rt-input', value: form.severity, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, severity: e.target.value })) },
                SEVERITIES.map((s) => h('option', { key: s, value: s }, s))),
              h('button', {
                class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
                onClick: () => {
                  if (form.ip.trim() === '' || form.title.trim() === '') { props.notices.report('ip 与 title 必填', 'failure'); return }
                  call('vulnAdd', { ip: form.ip.trim(), title: form.title.trim(), severity: form.severity, cve: form.cve.trim() || undefined }, t('b.saved'))
                  setForm({ ip: '', title: '', severity: 'high', cve: '' })
                },
              }, '登记')))))

  return h('div', { class: 'dshp-rt-split' }, left, right)
}
