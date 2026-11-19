/**
 * 技能库（全局）：随包蓝队技术技能，只读浏览（与红队「技能库」同构）。
 */
import { useCallback, useEffect, useState } from 'react'
import { h, Loading } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { Block, Empty, Tag } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>

export function SkillsPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [items, setItems] = useState<AnyRec[]>([])
  const [dir, setDir] = useState('')
  const [sel, setSel] = useState<string>('')
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback((): void => {
    void blueOp<AnyRec>('skillCatalog').then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      const list = Array.isArray(r.data.items) ? r.data.items : []
      setItems(list)
      setDir(String(r.data.dir || ''))
      if (list[0] !== undefined && sel === '') setSel(String(list[0].id))
    })
  }, [sel])

  useEffect(() => { load() }, [load, props.refreshKey])

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)
  if (items.length === 0) return h(Loading, { text: t('b.loading') })
  const current = items.find((x) => x.id === sel) || items[0]

  const left = h('div', { class: 'dshp-rt-pane', style: { width: 240, minWidth: 180, overflow: 'auto' } },
    h('div', { class: 'dshp-rt-ov-sub', style: { marginBottom: 6 } }, '目录：' + dir),
    items.map((s) => h('div', {
      key: String(s.id),
      class: 'dshp-rt-row',
      style: { padding: '6px 8px', cursor: 'pointer', borderRadius: 6, background: sel === s.id ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent' },
      onClick: () => setSel(String(s.id)),
    },
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
        h('span', { style: { fontWeight: 600, fontSize: 12 } }, String(s.title)),
        Tag({ tone: 'passive', children: String(s.bytes) + 'B' })),
      h('div', { class: 'dshp-rt-ov-sub' }, String(s.file)))))

  const right = h('div', { class: 'dshp-rt-pane', style: { flex: 1, minHeight: 0 } },
    Block({ title: String(current.title), children: h('pre', { class: 'dshp-rt-evi-body', style: { whiteSpace: 'pre-wrap', maxHeight: '66vh', overflow: 'auto' } }, String(current.content || '')) }))

  return h('div', { class: 'dshp-rt-split' }, left, right)
}
