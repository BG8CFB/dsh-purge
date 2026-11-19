/**
 * 事件处置：左事件列表 + 右处置台（时间线 / 动作 / 状态推进），与红队「攻击链」同款分栏。
 * 审批只在这里（面板），模型没有 approve 工具。
 */
import { useCallback, useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { fmt } from '../redteam/bits.tsx'
import { Block, Empty, KV, Tag } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>
const KINDS = ['hunt', 'kill_process', 'remove_shell', 'block_ip', 'block_domain', 'isolate_host', 'disable_account', 'rotate_credential', 'revoke_ticket', 'patch', 'downgrade_exposure']
const NEXT: Record<string, string | null> = { open: 'contained', contained: 'eradicated', eradicated: 'recovered', recovered: 'closed', closed: null }

export function IncidentsPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [rows, setRows] = useState<AnyRec[]>([])
  const [sel, setSel] = useState<number | null>(null)
  const [detail, setDetail] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ kind: 'block_ip', target: '', impact: '', blast: '', rollback: '' })
  const [evidence, setEvidence] = useState('')
  const [summary, setSummary] = useState('')
  const [note, setNote] = useState('')

  const loadList = useCallback((): void => {
    void blueOp<AnyRec>('incidents', { engagement: props.eng }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      const items = Array.isArray(r.data.items) ? r.data.items : []
      setRows(items)
      const wanted = props.params !== null && props.params !== undefined && props.params.incidentId !== undefined ? Number(props.params.incidentId) : null
      if (wanted !== null && items.some((x: AnyRec) => Number(x.id) === wanted)) setSel(wanted)
      else if (sel === null && items[0] !== undefined) setSel(Number(items[0].id))
    })
  }, [props.eng, props.params, sel])

  const loadDetail = useCallback((id: number): void => {
    void blueOp<AnyRec>('incident', { engagement: props.eng, incidentId: id }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setDetail(r.data)
    })
  }, [props.eng])

  useEffect(() => { loadList() }, [loadList, props.refreshKey])
  useEffect(() => { if (sel !== null) loadDetail(sel) }, [sel, loadDetail, props.refreshKey])

  const report = (message: string, ok: boolean): void => { props.notices.report(message, ok ? 'success' : 'failure') }
  const call = (op: string, body: Record<string, unknown>, okText: string): void => {
    setBusy(true)
    void blueOp<AnyRec>(op, { engagement: props.eng, ...body }).then((r) => {
      setBusy(false)
      if (!r.ok) { report(r.error, false); return }
      report(okText, true)
      if (sel !== null) loadDetail(sel)
      loadList()
    })
  }

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)

  const incident = detail !== null ? detail.incident : null
  const timeline = (detail !== null ? detail.timeline : []) as AnyRec[]
  const actions = (detail !== null ? detail.actions : []) as AnyRec[]
  const linked = (detail !== null ? detail.alerts : []) as AnyRec[]

  const left = h('div', { class: 'dshp-rt-pane', style: { width: '34%', minWidth: 260, overflow: 'auto', minHeight: 0 } },
    rows.length === 0 ? Empty({ children: t('b.in.noIncident') }) : null,
    rows.map((r) => h('div', {
      key: String(r.id), class: 'dshp-rt-row',
      style: {
        padding: '8px', borderBottom: '1px solid var(--dsw-alias-border-l2)', cursor: 'pointer',
        background: Number(r.id) === sel ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent',
      },
      onClick: () => setSel(Number(r.id)),
    },
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
        Tag({ tone: String(r.severity) === 'P0' ? 'warn' : 'active', children: String(r.severity) }),
        h('span', { style: { flex: 1, fontSize: 12 } }, String(r.title || '')),
        Tag({ tone: String(r.status) === 'closed' ? 'passive' : 'live', children: t('b.in.phase.' + String(r.status)) })),
      h('div', { class: 'dshp-rt-ov-sub' }, '#' + String(r.id) + ' · ' + fmt(r.detected_at) + ' · 告警 ' + String(r.alert_count ?? 0)))))

  const header = incident === null ? null : h('div', null,
    h('div', { class: 'dshp-rt-ov-title' }, '#' + String(incident.id) + ' ' + String(incident.title)),
    h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', margin: '6px 0' } },
      Tag({ tone: String(incident.severity) === 'P0' ? 'warn' : 'active', children: String(incident.severity) }),
      Tag({ tone: String(incident.status) === 'closed' ? 'passive' : 'live', children: t('b.in.phase.' + String(incident.status)) })),
    KV({ rows: [
      ['发现', fmt(incident.detected_at)],
      ['确认', fmt(incident.triaged_at)],
      ['止血', fmt(incident.contained_at)],
      ['恢复', fmt(incident.recovered_at)],
    ] }))

  const advance = incident === null ? null : Block({
    title: '状态推进',
    children: h('div', null,
      h('div', { class: 'dshp-rt-actions' },
        NEXT[String(incident.status)] !== null && NEXT[String(incident.status)] !== undefined
          ? h('button', {
              class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy,
              onClick: () => call('incidentUpdate', { incidentId: Number(incident.id), status: NEXT[String(incident.status)], note }, '已推进'),
            }, t('b.in.advance') + ' ' + t('b.in.phase.' + String(NEXT[String(incident.status)])))
          : Tag({ tone: 'passive', children: '已闭环' })),
      h('input', {
        class: 'dshp-rt-input', style: { width: '100%', marginTop: 6 }, placeholder: t('b.in.summary'),
        value: summary, onChange: (e: { target: { value: string } }) => setSummary(e.target.value),
      }),
      h('div', { class: 'dshp-rt-actions', style: { marginTop: 6 } },
        h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: () => call('incidentUpdate', { incidentId: Number(incident.id), summary }, '已保存复盘结论') }, t('b.save')),
        h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: () => call('incidentNote', { incidentId: Number(incident.id), text: note || '补记', by: 'user' }, '已补时间线') }, t('b.in.addNote')))),
  })

  const propose = incident === null ? null : Block({
    title: t('b.in.propose'),
    children: h('div', null,
      h('div', { class: 'dshp-rt-actions' },
        h('select', { class: 'dshp-rt-input', value: form.kind, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, kind: e.target.value })) },
          KINDS.map((k) => h('option', { key: k, value: k }, k))),
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 160px' }, placeholder: t('b.target'), value: form.target, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, target: e.target.value })) })),
      h('div', { class: 'dshp-rt-actions', style: { marginTop: 6 } },
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 140px' }, placeholder: t('b.in.impact'), value: form.impact, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, impact: e.target.value })) }),
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 110px' }, placeholder: t('b.in.blast'), value: form.blast, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, blast: e.target.value })) }),
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 140px' }, placeholder: t('b.in.rollback'), value: form.rollback, onChange: (e: { target: { value: string } }) => setForm((s) => ({ ...s, rollback: e.target.value })) }),
        h('button', {
          class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy,
          onClick: () => call('actionPropose', { incidentId: Number(incident.id), kind: form.kind, target: form.target, impact: form.impact, blastRadius: form.blast, rollbackPlan: form.rollback }, '已提交处置动作'),
        }, t('b.in.propose')))),
  })

  const actionList = incident === null ? null : Block({
    title: t('b.in.actions'), count: actions.length,
    children: actions.length === 0
      ? Empty({ children: t('b.empty') })
      : h('div', null, actions.map((a) => h('div', {
          key: String(a.id), class: 'dshp-rt-card', style: { margin: '6px 0', padding: '8px 10px' },
        },
          h('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' } },
            h('span', { style: { fontWeight: 600, fontSize: 12 } }, String(a.kind)),
            Tag({ children: '→ ' + String(a.target) }),
            Tag({ tone: String(a.risk) === 'high' || String(a.risk) === 'critical' ? 'warn' : 'passive', children: 'risk ' + String(a.risk) }),
            Tag({ tone: String(a.approval_status) === 'approved' ? 'live' : String(a.approval_status) === 'rejected' ? 'passive' : 'warn', children: String(a.approval_status) }),
            a.emergency === 1 ? Tag({ tone: 'warn', children: 'emergency' }) : null,
            a.verify_at !== null ? Tag({ tone: 'live', children: 'verified' }) : (a.executed_at !== null ? Tag({ tone: 'warn', children: t('b.in.unverified') }) : null)),
          h('div', { class: 'dshp-rt-ov-sub', style: { margin: '2px 0' } },
            (a.impact ? '影响：' + String(a.impact) + ' ' : '') + (a.rollback_plan ? '回滚：' + String(a.rollback_plan) : '')),
          h('div', { class: 'dshp-rt-actions', style: { flexWrap: 'wrap' } },
            a.approval_status === 'requested'
              ? h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy, onClick: () => call('actionApprove', { actionId: Number(a.id), approver: 'user' }, '已批准') }, t('b.in.approve'))
              : null,
            a.approval_status === 'requested'
              ? h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: () => call('actionReject', { actionId: Number(a.id), approver: 'user' }, '已拒绝') }, t('b.in.reject'))
              : null,
            a.executed_at === null && (a.approval_status === 'auto' || a.approval_status === 'approved')
              ? h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: () => call('actionExecute', { actionId: Number(a.id), operator: 'user' }, '已执行') }, t('b.in.execute'))
              : null,
            a.executed_at !== null && a.verify_at === null
              ? h('span', { style: { display: 'flex', gap: 4, flex: '1 1 220px' } },
                  h('input', { class: 'dshp-rt-input', style: { flex: 1 }, placeholder: t('b.in.evidence'), value: evidence, onChange: (e: { target: { value: string } }) => setEvidence(e.target.value) }),
                  h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy, onClick: () => call('actionVerify', { actionId: Number(a.id), evidence: evidence || '见工单' }, '已验证') }, t('b.in.verify')))
              : null,
            a.executed_at !== null && a.rolled_back_at === null
              ? h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: () => call('actionRollback', { actionId: Number(a.id), note: '面板回滚' }, '已回滚') }, t('b.in.rollbackBtn'))
              : null)))),
  })

  const timelineBlock = incident === null ? null : Block({
    title: t('b.in.timeline'), count: timeline.length,
    children: h('div', null,
      h('input', { class: 'dshp-rt-input', style: { width: '100%', marginBottom: 6 }, placeholder: t('b.note'), value: note, onChange: (e: { target: { value: string } }) => setNote(e.target.value) }),
      timeline.length === 0 ? Empty({ children: t('b.empty') }) : null,
      timeline.map((row) => h('div', { key: String(row.id), class: 'dshp-rt-ov-sub', style: { display: 'flex', gap: 8 } },
        h('span', { class: 'dshp-rt-mono', style: { whiteSpace: 'nowrap' } }, fmt(row.at)),
        Tag({ children: String(row.kind || '') }),
        h('span', null, String(row.text || ''))))),
  })

  const alertBlock = incident === null ? null : Block({
    title: t('b.in.alerts'), count: linked.length,
    children: linked.length === 0 ? Empty({ children: t('b.empty') }) : h('div', null, linked.map((a) => h('div', {
      key: String(a.id), class: 'dshp-rt-ov-sub', style: { display: 'flex', gap: 6 },
    }, '#' + String(a.id), Tag({ children: String(a.severity) }), h('span', null, String(a.title)), Tag({ children: String(a.status) })))),
  })

  const right = incident === null
    ? Empty({ children: t('b.in.title') })
    : h('div', { class: 'dshp-rt-pane', style: { flex: 1, minWidth: 360, overflow: 'auto', minHeight: 0 } },
        header, advance, propose, actionList, timelineBlock, alertBlock)

  return h('div', { class: 'dshp-rt-split' }, left, right)
}
