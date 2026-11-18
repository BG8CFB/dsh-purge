/**
 * 作战智能体页签：并发名额（可调）+ 六个角色说明 + 角色提示词编辑器。
 * 自旧 client.js AgentsTab / ConcurrencyCard / PromptsTab 迁移合并。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import { clickable, fmt, type RtTabProps, type Translate } from './bits.tsx'

type AnyRec = Record<string, any>

export function AgentsTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [roles, setRoles] = useState<AnyRec[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [concurrency, setConcurrency] = useState<AnyRec | null>(null)
  const [busy, setBusy] = useState(false)

  const load = (): void => {
    setBusy(true)
    void rtOp<AnyRec>(eng !== null && eng !== '' ? 'prompts' : 'bootstrap', { engagement: eng ?? undefined }).then((r) => {
      setBusy(false)
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      if (r.data.roles !== undefined) setRoles(r.data.roles as AnyRec[])
    })
    // 并发名额按「当前跑着的子智能体」算；host 侧读 subagents 注册表
    void rtOp<AnyRec>('agentsStatus').then((r) => {
      if (r.ok) setConcurrency(r.data)
    })
  }
  useEffect(load, [eng, props.refreshKey])

  const used = concurrency !== null ? concurrency.used : null
  const max = concurrency !== null ? concurrency.max : 3
  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.tab.agents')),
      h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, t('rt.ag.maxN', { n: max })),
      used === null
        ? h('span', { class: 'dshp-rt-tag' }, t('rt.ag.usedUnknown'))
        : h('span', { class: 'dshp-rt-tag' + (used >= max ? ' dshp-rt-tag-warn' : ' dshp-rt-tag-live') },
            t('rt.ag.usedN', { used, free: Math.max(max - used, 0) })),
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: load }, busy ? t('rt.loading') : t('rt.refresh'))),
    h('div', { class: 'dshp-rt-pane' },
      err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
      h('div', { class: 'dshp-rt-card' },
        h('h4', null, t('rt.ag.rulesTitle')),
        h('div', { style: { fontSize: 12, lineHeight: 1.7 } },
          h('div', null, t('rt.ag.rule1', { n: max })),
          h('div', null, t('rt.ag.rule2')),
          h('div', null, t('rt.ag.rule3')))),
      h('div', { class: 'dshp-rt-card' },
        h('h4', null, t('rt.ag.rolesTitle')),
        h('div', { style: { fontSize: 12, lineHeight: 1.8 } },
          h('div', null, t('rt.ag.role1')),
          h('div', null, t('rt.ag.role2')),
          h('div', null, t('rt.ag.role3')),
          h('div', null, t('rt.ag.role4')),
          h('div', null, t('rt.ag.role5')),
          h('div', null, t('rt.ag.role6')))),
      h(ConcurrencyCard, { t, concurrency, onSaved: load }),
      h('div', { class: 'dshp-rt-card' },
        h('h4', null, t('rt.ag.promptsTitle')),
        h('div', { style: { fontSize: 11.5, color: 'var(--dsw-alias-label-secondary)', marginBottom: 6 } }, t('rt.ag.promptsHint')),
        h(PromptsTab, { t, eng, refreshKey: props.refreshKey }))))
}

function ConcurrencyCard(props: { t: Translate; concurrency: AnyRec | null; onSaved: () => void }): ReturnType<typeof h> {
  const t = props.t
  const info: AnyRec = props.concurrency ?? {}
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)
  useEffect(() => { if (info.max !== undefined) setDraft(String(info.max)) }, [info.max])

  const limit = info.limit ?? 10
  const used = typeof info.used === 'number' ? info.used : null
  const source = info.source === 'settings' ? t('rt.ag.srcSettings')
    : info.source === 'env' ? t('rt.ag.srcEnv') : t('rt.ag.srcDefault')
  const n = Number(draft)
  const invalid = !Number.isFinite(n) || Math.floor(n) !== n || n < 1 || n > limit
  const save = (): void => {
    if (invalid) return
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('setAgentsMax', { max: n }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      setMsg({ ok: t('rt.ag.savedMax', { n: r.data.max }) })
      props.onSaved()
    })
  }
  return h('div', { class: 'dshp-rt-card' },
    h('h4', null, t('rt.ag.concurrencyTitle')),
    h('div', { style: { fontSize: 12, lineHeight: 1.8, marginBottom: 8 } },
      t('rt.ag.concurrencyLine', {
        max: info.max || '?',
        used: used === null ? '' : t('rt.ag.concurrencyUsed', { used, free: Math.max((info.max || 0) - used, 0) }),
        source,
      })),
    h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
      h('input', {
        class: 'dshp-rt-input', style: { width: 90 }, type: 'number', min: 1, max: limit,
        value: draft, onChange: (e: { target: { value: string } }) => { setDraft(e.target.value) },
      }),
      h('span', { style: { fontSize: 11.5, color: 'var(--dsw-alias-label-secondary)' } }, t('rt.ag.rangeOf', { n: limit })),
      h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy || invalid, onClick: save },
        busy ? t('rt.saving') : t('rt.save')),
      msg !== null && msg.err !== undefined ? h('span', { style: { fontSize: 12, color: 'var(--dsw-alias-state-error-primary, #d33)' } }, msg.err) : null,
      msg !== null && msg.ok !== undefined ? h('span', { style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } }, msg.ok) : null),
    h('div', { style: { marginTop: 8, fontSize: 11.5, color: 'var(--dsw-alias-label-secondary)' } }, t('rt.ag.concurrencyWarn')))
}

/* ---------- 角色提示词编辑器（旧 PromptsTab） ---------- */

function PromptsTab(props: { t: Translate; eng: string | null; refreshKey: number }): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [roles, setRoles] = useState<AnyRec[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    // 无靶标也允许：服务端回内置默认
    void rtOp<AnyRec>('prompts', eng !== null && eng !== '' ? { engagement: eng } : {}).then((r) => {
      if (!r.ok) { setMsg({ err: r.error }); return }
      setRoles(r.data.roles ?? [])
      if ((r.data.roles ?? []).length > 0) { setActive(cur => cur ?? (r.data.roles as AnyRec[])[0].role) }
      if (r.data.builtin === true) setMsg({ ok: t('rt.p.builtinNote') })
    })
  }, [eng, props.refreshKey])

  useEffect(() => {
    const r = roles.find((x) => x.role === active)
    if (r !== undefined) setDraft(r.content || '')
  }, [active, roles])

  const save = (): void => {
    if (eng === null || eng === '') { setMsg({ err: t('rt.p.needEngagement') }); return }
    if (active === null) return
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('savePrompt', { engagement: eng, role: active, content: draft }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      setRoles(list => list.map((x) => (x.role === active
        ? { ...x, content: draft, updated_at: new Date().toISOString() }
        : x)))
      setMsg({ ok: t('rt.saved') })
    })
  }

  // 老靶标的提示词是旧版模板；可把当前角色（或全部）恢复成内置最新版
  const reset = (all: boolean): void => {
    if (eng === null || eng === '') { setMsg({ err: t('rt.p.needEngagement') }); return }
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('resetPrompts', { engagement: eng, role: all ? undefined : (active ?? undefined) }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      setMsg({ ok: t('rt.p.resetDone', { roles: (r.data.reset ?? []).join(t('rt.p.resetSep')) }) })
      void rtOp<AnyRec>('prompts', { engagement: eng }).then((rr) => {
        if (!rr.ok) return
        setRoles(rr.data.roles ?? [])
        const cur2 = (rr.data.roles ?? []).find((x) => x.role === active)
        if (cur2 !== undefined) setDraft(cur2.content || '')
      })
    })
  }

  const cur = roles.find((x) => x.role === active)
  const items = roles.map((r) => h('div', {
    ...clickable(() => { setActive(r.role); setMsg(null) }, { label: t('rt.p.viewPrompt', { role: r.title }), expanded: active === r.role }),
    key: r.role, class: 'dshp-rt-item' + (active === r.role ? ' on' : ''),
  },
    h('div', { class: 'dshp-rt-item-name' }, r.title),
    h('div', { class: 'dshp-rt-item-desc' }, (r.content || '').replace(/[#*`]/g, '').slice(0, 60) || t('rt.empty'))))

  return h('div', { class: 'dshp-rt-split' },
    h('div', { class: 'dshp-rt-list' }, items),
    h('div', { class: 'dshp-rt-main' },
      h('div', { class: 'dshp-rt-toolbar' },
        h('span', { style: { fontWeight: 600 } }, cur !== undefined ? cur.title : t('rt.p.promptsTitle')),
        h('span', { class: 'dshp-rt-tag' }, t('rt.p.updated', { time: fmt(cur !== undefined ? cur.updated_at : '') })),
        h('div', { class: 'dshp-rt-spacer' }),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', disabled: busy || active === null,
          title: t('rt.p.resetCurTitle'), onClick: () => { reset(false) },
        }, t('rt.p.resetCur')),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', disabled: busy,
          title: t('rt.p.resetAllTitle'), onClick: () => { reset(true) },
        }, t('rt.p.resetAll')),
        h('button', {
          class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
          disabled: busy || active === null, onClick: save,
        }, busy ? t('rt.saving') : t('rt.save'))),
      msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
      h('div', { class: 'dshp-rt-pane' },
        h('textarea', {
          class: 'dshp-rt-textarea', value: draft, spellCheck: false,
          onChange: (e: { target: { value: string } }) => { setDraft(e.target.value) },
          placeholder: t('rt.p.placeholder'),
        }),
        h('div', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)', marginTop: 6 } },
          t('rt.p.saveHint', { role: active || 'role' })))))
}
