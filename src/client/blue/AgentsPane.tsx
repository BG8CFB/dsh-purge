/**
 * 智能体：四个防守角色 + 提示词（可改可恢复），与红队「智能体」页同构。
 */
import { useCallback, useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { Block, Empty, Tag } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>

export function AgentsPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [roles, setRoles] = useState<AnyRec[]>([])
  const [sel, setSel] = useState<string>('plan')
  const [draft, setDraft] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback((): void => {
    void blueOp<AnyRec>('prompts', { engagement: props.eng }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      const list = Array.isArray(r.data.roles) ? r.data.roles : []
      setRoles(list)
      const cur = list.find((x: AnyRec) => x.role === sel) || list[0]
      if (cur !== undefined) { setSel(String(cur.role)); setDraft(String(cur.content || '')) }
    })
  }, [props.eng, sel])

  useEffect(() => { load() }, [load, props.refreshKey])

  const pick = (role: string): void => {
    setSel(role)
    const hit = roles.find((x) => x.role === role)
    setDraft(hit !== undefined ? String(hit.content || '') : '')
  }
  const save = (): void => {
    void blueOp<AnyRec>('promptSave', { engagement: props.eng, role: sel, content: draft }).then((r) => {
      props.notices.report(r.ok ? t('b.saved') : r.error, r.ok ? 'success' : 'failure')
      if (r.ok) load()
    })
  }
  const reset = (): void => {
    void blueOp<AnyRec>('promptReset', { engagement: props.eng, role: sel }).then((r) => {
      props.notices.report(r.ok ? t('b.ag.reset') + ' ✓' : r.error, r.ok ? 'success' : 'failure')
      if (r.ok) load()
    })
  }

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)

  const left = h('div', { class: 'dshp-rt-pane', style: { width: 220, minWidth: 170 } },
    roles.length === 0 ? Empty({ children: t('b.empty') }) : null,
    roles.map((r) => h('div', {
      key: String(r.role),
      class: 'dshp-rt-row',
      style: {
        padding: '6px 8px', cursor: 'pointer', borderRadius: 6,
        background: sel === r.role ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent',
      },
      onClick: () => pick(String(r.role)),
    },
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
        h('span', { style: { fontWeight: 600, fontSize: 12 } }, String(r.title || r.role)),
        r.role === 'plan' ? Tag({ tone: 'passive', children: '主会话' }) : Tag({ tone: 'live', children: '可派' })),
      h('div', { class: 'dshp-rt-ov-sub' }, String(r.role)))),
    h('div', { class: 'dshp-rt-foot', style: { borderTop: 'none', paddingLeft: 0 } }, t('b.ag.hint')))

  const right = h('div', { class: 'dshp-rt-pane', style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } },
    Block({
      title: String((roles.find((x) => x.role === sel) || {}).title || sel),
      right: h('div', { class: 'dshp-rt-actions' },
        h('button', { class: 'dshp-rt-btn', type: 'button', onClick: reset }, t('b.ag.reset')),
        h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', onClick: save }, t('b.save'))),
      children: h('textarea', {
        class: 'dshp-rt-textarea',
        style: { width: '100%', minHeight: 380, fontFamily: 'ui-monospace, Consolas, monospace' },
        value: draft, onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
      }),
    }))

  return h('div', { class: 'dshp-rt-split' }, left, right)
}
