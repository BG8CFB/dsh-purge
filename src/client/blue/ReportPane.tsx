/**
 * 报告与复盘：技术复盘 / 管理层态势 + 红蓝只读对账（与红队「报告」页同构）。
 */
import { useCallback, useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { fmt, copyText } from '../redteam/bits.tsx'
import { Block, Empty, Tag } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>

export function ReportPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [text, setText] = useState('')
  const [busy, setBusy] = useState('')
  const [redRoot, setRedRoot] = useState('')
  const [redEng, setRedEng] = useState('')
  const [rec, setRec] = useState<AnyRec | null>(null)
  const [history, setHistory] = useState<AnyRec[]>([])
  const [err, setErr] = useState<string | null>(null)

  const loadHistory = useCallback((): void => {
    void blueOp<AnyRec>('reconcileList', { engagement: props.eng }).then((r) => {
      if (r.ok) setHistory(Array.isArray(r.data.items) ? r.data.items : [])
    })
  }, [props.eng])

  useEffect(() => { loadHistory() }, [loadHistory, props.refreshKey])

  const gen = (kind: string): void => {
    setBusy('report')
    void blueOp<AnyRec>('report', { engagement: props.eng, kind }).then((r) => {
      setBusy('')
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setText(String(r.data.text || ''))
    })
  }

  const runReconcile = (): void => {
    if (redEng.trim() === '') { setErr('请填红队项目 id'); return }
    setBusy('rec')
    void blueOp<AnyRec>('reconcileRun', {
      engagement: props.eng, redRoot: redRoot.trim() === '' ? undefined : redRoot.trim(), redEngagement: redEng.trim(),
    }).then((r) => {
      setBusy('')
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setRec(r.data)
      loadHistory()
    })
  }

  const left = h('div', { class: 'dshp-rt-pane', style: { flex: 1, minWidth: 340, display: 'flex', flexDirection: 'column', minHeight: 0 } },
    Block({
      title: t('b.rp.title'),
      right: h('div', { class: 'dshp-rt-actions' },
        h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy !== '', onClick: () => gen('technical') }, t('b.rp.technical')),
        h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy !== '', onClick: () => gen('management') }, t('b.rp.management')),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', disabled: text === '',
          onClick: () => { void copyText(text).then((ok) => props.notices.report(ok ? '已复制' : '复制失败', ok ? 'success' : 'failure')) },
        }, t('b.rp.download'))),
      children: text === ''
        ? Empty({ children: '生成一份报告试试：技术复盘给执行人，管理层态势给负责人。' })
        : h('pre', { class: 'dshp-rt-evi-body', style: { whiteSpace: 'pre-wrap', maxHeight: '58vh', overflow: 'auto' } }, text),
    }))

  const recBlock = Block({
    title: t('b.rp.reconcile'),
    children: h('div', null,
      h('div', { class: 'dshp-rt-ov-sub', style: { marginBottom: 6 } }, t('b.rp.reconcileHint')),
      h('input', { class: 'dshp-rt-input', style: { width: '100%', marginBottom: 6 }, placeholder: t('b.rp.redRoot'), value: redRoot, onChange: (e: { target: { value: string } }) => setRedRoot(e.target.value) }),
      h('div', { class: 'dshp-rt-actions' },
        h('input', { class: 'dshp-rt-input', style: { flex: 1 }, placeholder: t('b.rp.redProject'), value: redEng, onChange: (e: { target: { value: string } }) => setRedEng(e.target.value) }),
        h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy !== '', onClick: runReconcile }, busy === 'rec' ? t('b.loading') : t('b.rp.run'))),
      rec === null ? null : h('div', { style: { marginTop: 8 } },
        h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
          Tag({ tone: 'live', children: t('b.rp.matched') + ' ' + String(rec.summary?.matched ?? 0) }),
          Tag({ tone: 'warn', children: t('b.rp.late') + ' ' + String(rec.summary?.late ?? 0) }),
          Tag({ tone: 'warn', children: t('b.rp.missed') + ' ' + String(rec.summary?.missed ?? 0) }),
          Tag({ tone: 'passive', children: t('b.rp.unverifiable') + ' ' + String(rec.summary?.unverifiable ?? 0) })),
        ((rec.items ?? []) as AnyRec[]).slice(0, 20).map((it) => h('div', { key: String(it.red_step_id) + String(it.verdict), class: 'dshp-rt-ov-sub' },
          '[' + String(it.verdict) + '] ' + String(it.red_asset || '—') + ' · ' + String(it.red_title || '') + ' · ' + fmt(it.red_at)))),
    ),
  })

  const histBlock = Block({
    title: t('b.rp.history'), count: history.length,
    children: history.length === 0
      ? Empty({ children: t('b.empty') })
      : h('div', null, history.map((row) => h('div', { key: String(row.id), class: 'dshp-rt-ov-sub' },
          '#' + String(row.id) + ' · ' + fmt(row.at) + ' · 红队 ' + String(row.red_ref || '—')
          + ' · 命中 ' + String(row.summary?.matched ?? 0) + ' / 漏 ' + String(row.summary?.missed ?? 0)))),
  })

  const right = h('div', { class: 'dshp-rt-pane', style: { width: 380 } },
    recBlock, histBlock,
    err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null)

  return h('div', { class: 'dshp-rt-split' }, left, right)
}
