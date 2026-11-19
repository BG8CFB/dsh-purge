/**
 * conversation.input.right：会话内「红队对话」按钮 —— 一键开红队演练会话。
 *
 * 多项目时的交互：点按钮弹出项目列表（当前会话绑定的那个打勾），点哪个进哪个；
 * 只有一个项目时直接进入，不弹菜单。菜单用 fixed 定位，避免被输入框容器裁剪。
 *
 * 项目名册与绑定走 shared/data.ts 的共享缓存（与右栏页签、会话头徽章同源）。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { useBindings, useProjects } from '../shared/data.ts'
import type { Translate } from '../locale.ts'

export interface DrillNewSessionProps {
  t: Translate
  sessionId: string
  newDrillSession?: (id: string) => Promise<boolean>
  /** 普通会话 → 转为红队演练（新建红队会话并交接当前需求）。 */
  convertToDrill?: (sessionId: string, projectId: string) => Promise<boolean>
  /** 全局通知源（失败时提示）。 */
  notices?: { report: (text: string, tone?: 'info' | 'success' | 'failure') => void }
}

export function DrillNewSession(props: DrillNewSessionProps): ReturnType<typeof h> {
  const t = props.t
  const projects = useProjects()
  const { bound } = useBindings(props.sessionId)
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null)

  // 点击外部 / Esc 关闭
  useEffect(() => {
    if (!open) return undefined
    const onDown = (event: Event): void => {
      const target = event.target as { closest?: (sel: string) => unknown } | null
      if (target !== null && typeof target.closest === 'function' && target.closest('.dshp-drill-menu, .dshp-drill-btn') !== null) return
      setOpen(false)
    }
    const onKey = (event: { key?: string }): void => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey as never)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey as never)
    }
  }, [open])

  const rows = projects.items
  if (rows === null || rows.length === 0) return null
  const current = (bound === null ? undefined : rows.find((row) => row.id === bound)) ?? rows[0]
  /* 已绑定项目的红队会话 → 新建一个红队对话；
     普通会话（没绑定项目）→ 把当前需求带进新的红队会话（宿主不支持运行时改预设）。 */
  const isRedteam = bound !== null
  const label = isRedteam
    ? (rows.length === 1
        ? t('input.newDrillTo', { name: String(current.name || current.id) })
        : t('input.newDrillPick', { name: String(current.name || current.id) }))
    : t('input.convertDrillTo', { name: String(current.name || current.id) })

  const run = (id: string): void => {
    setOpen(false)
    const task = isRedteam
      ? (props.newDrillSession === undefined ? undefined : props.newDrillSession(id))
      : (props.convertToDrill === undefined || props.sessionId === ''
          ? undefined
          : props.convertToDrill(props.sessionId, id))
    if (task === undefined) return
    void task.then((ok) => {
      if (ok) return
      /* 失败必须让用户看见原因，否则就是"点了没反应" */
      props.notices?.report(t('input.newDrillFail'), 'failure')
    })
  }

  const toggle = (element: HTMLElement): void => {
    if (open) { setOpen(false); return }
    const rect = element.getBoundingClientRect()
    setAnchor({ left: Math.max(8, rect.left), top: rect.top })
    setOpen(true)
  }

  return h('span', { class: 'dshp-drill-wrap' },
    h('button', {
      class: 'dshp-drill-btn', type: 'button', title: label,
      onClick: (event: { currentTarget: HTMLElement }) => { toggle(event.currentTarget) },
    }, t('input.newDrillShort')),
    open && anchor !== null
      ? h('div', { class: 'dshp-drill-menu', style: { left: anchor.left + 'px', top: anchor.top + 'px' } },
          h('div', { class: 'dshp-drill-menu-title' }, t('input.newDrillMenu')),
          rows.map((row) => h('button', {
            key: row.id,
            class: 'dshp-drill-menu-item' + (row.id === bound ? ' on' : ''),
            type: 'button',
            onClick: () => { run(row.id) },
          },
            h('span', { class: 'dshp-drill-menu-mark' }, row.id === bound ? '●' : ''),
            h('span', { class: 'dshp-drill-menu-name' }, String(row.name || row.id)),
            row.workspace_id ? null : h('span', { class: 'dshp-drill-menu-sub' }, t('rt.pj.workspacePending')))))
      : null,
  )
}
