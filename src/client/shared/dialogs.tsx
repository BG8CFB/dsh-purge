/**
 * 全局确认框（替代 window.confirm）。
 *
 * window.confirm 会阻塞渲染线程、样式与宿主格格不入，在 Electron 里还会出现
 * "页面被遮住"的观感。这里做成模块级单例 + shell.overlay 里挂一个 DialogHost：
 * 调用方 `const ok = await confirmDialog(msg, { okText, cancelText, danger })`，
 * 不阻塞、可测、和插件自己的按钮样式一致。
 *
 * 单实例语义：新的确认把旧的按取消结算，避免队列里积压看不见的弹窗。
 */
import { useSyncExternalStore } from 'react'
import { h } from './ui.ts'

export interface DialogOptions {
  /** 确认按钮文案（调用方传 t('common.confirm') 之类）。 */
  okText: string
  /** 取消按钮文案。 */
  cancelText: string
  /** 危险操作：确认按钮用 danger 样式。 */
  danger?: boolean
}

interface DialogState extends Required<DialogOptions> {
  seq: number
  message: string
  resolve: (ok: boolean) => void
}

let current: DialogState | null = null
const listeners = new Set<() => void>()
let seq = 0

function publish(): void {
  for (const listener of [...listeners]) {
    try { listener() } catch { /* ignore */ }
  }
}

/** 弹一个确认框，返回用户是否确认。 */
export function confirmDialog(message: string, options: DialogOptions): Promise<boolean> {
  const previous = current
  if (previous !== null) {
    current = null
    previous.resolve(false)
  }
  return new Promise<boolean>((resolve) => {
    seq += 1
    current = {
      seq,
      message,
      resolve,
      okText: options.okText,
      cancelText: options.cancelText,
      danger: options.danger === true,
    }
    publish()
  })
}

/** 结算当前确认框（幂等）。 */
function settle(ok: boolean): void {
  const request = current
  if (request === null) return
  current = null
  request.resolve(ok)
  publish()
}

function getSnapshot(): DialogState | null { return current }

/** shell.overlay 里挂的宿主；无弹窗时渲染 null。 */
export function DialogHost(): ReturnType<typeof h> | null {
  const state = useSyncExternalStore((listener) => {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, getSnapshot)
  if (state === null) return null
  return h('div', {
    key: state.seq,
    class: 'dshp-modal-mask',
    role: 'presentation',
    onClick: () => { settle(false) },
  },
    h('div', {
      class: 'dshp-modal',
      role: 'dialog',
      'aria-modal': 'true',
      onClick: (event: { stopPropagation: () => void }) => { event.stopPropagation() },
    },
      h('div', { class: 'dshp-modal-text' }, state.message),
      h('div', { class: 'dshp-modal-actions' },
        h('button', { class: 'dshp-btn', type: 'button', onClick: () => { settle(false) } }, state.cancelText),
        h('button', {
          class: state.danger ? 'dshp-btn dshp-btn-danger' : 'dshp-btn dshp-btn-primary',
          type: 'button',
          onClick: () => { settle(true) },
        }, state.okText))))
}
