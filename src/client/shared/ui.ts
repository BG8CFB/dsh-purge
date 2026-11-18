/**
 * 极简 UI 基础设施：createElement 助手、常用小组件、全局通知（shell.overlay 用）、
 * 异步加载 hook、样式表安装。
 *
 * 约束：不 import 官方 UI 组件包（ui-primitives 不在本插件 external 里），
 * 纯手写元素 + CSS；主题全走宿主 --dsw-alias-* 变量，暗亮自动适配，
 * 少量补充变量用 --dshp-* 前缀。
 */
import { createElement, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ApiResult } from './api.ts'

/** createElement 别名，全插件统一用 h(...) 组元素（与旧 client.js 风格一致）。 */
export const h = createElement

// —— 通知源（shell.overlay 注册的 Toast 消费） ——

export type NoticeTone = 'info' | 'success' | 'failure'

export interface NoticeState {
  seq: number
  text: string
  tone: NoticeTone
}

export interface NoticeSource {
  /** 弹一条通知；4 秒后自动消失，新通知顶替旧通知。 */
  report: (text: string, tone?: NoticeTone) => void
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => NoticeState | null
  dismiss: () => void
  /** 供 useSyncExternalStore 用的稳定快照（getSnapshot 直接绑定）。 */
  hooks: { notice: NoticeSource['getSnapshot'] }
}

/** 创建一个插件级通知源；一次 apply 一个，Toast 与各面板共享。 */
export function createNotices(): NoticeSource {
  let current: NoticeState | null = null
  const listeners = new Set<() => void>()
  let seq = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  const publish = (): void => { for (const listener of [...listeners]) listener() }
  const source: NoticeSource = {
    report(text, tone = 'info') {
      if (timer !== undefined) clearTimeout(timer)
      seq += 1
      current = { seq, text, tone }
      publish()
      timer = setTimeout(() => { current = null; publish() }, 4000)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    getSnapshot: () => current,
    dismiss() {
      if (timer !== undefined) clearTimeout(timer)
      current = null
      publish()
    },
    hooks: { notice: null as unknown as NoticeSource['getSnapshot'] },
  }
  source.hooks.notice = source.getSnapshot
  return source
}

/** shell.overlay 的 Toast 主体：右下角浮动通知，点击关闭。 */
export function Toast(props: { source: NoticeSource }): ReturnType<typeof h> {
  const notice = useSyncExternalStore(props.source.subscribe, props.source.getSnapshot)
  if (notice === null) return null
  return h('div', { key: notice.seq, class: `dshp-toast dshp-toast-${notice.tone}`, onClick: () => { props.source.dismiss() } }, notice.text)
}

// —— 异步加载 hook ——

export type AsyncState<T> =
  | { phase: 'loading' }
  | { phase: 'error'; error: string }
  | { phase: 'ready'; data: T }

/**
 * 通用「加载 → 就绪/出错」hook：loader 返回 ApiResult，reload 手动重拉。
 * 组件卸载后到达的结果会被丢弃。
 */
export function useAsyncData<T>(loader: () => Promise<ApiResult<T>>): {
  state: AsyncState<T>
  reload: () => void
} {
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<AsyncState<T>>({ phase: 'loading' })
  // loader 允许每次渲染是新闭包，用 ref 取最新值，避免 effect 反复触发
  const loaderRef = useRef(loader)
  loaderRef.current = loader
  useEffect(() => {
    let cancelled = false
    setState({ phase: 'loading' })
    void loaderRef.current().then((result) => {
      if (cancelled) return
      if (result.ok) setState({ phase: 'ready', data: result.data })
      else setState({ phase: 'error', error: result.error })
    })
    return () => { cancelled = true }
  }, [revision])
  const reload = useCallback(() => { setRevision((n) => n + 1) }, [])
  return { state, reload }
}

// —— 常用小组件 ——

/** 加载态：一行居中的省略提示。 */
export function Loading(props: { text: string }): ReturnType<typeof h> {
  return h('div', { class: 'dshp-loading' }, props.text)
}

/** 错误态：错误原文 + 可选重试按钮。 */
export function ErrorLine(props: { label: string; message?: string; retryText?: string; onRetry?: () => void }): ReturnType<typeof h> {
  return h('div', { class: 'dshp-error' },
    h('span', { class: 'dshp-error-text' }, props.label + (props.message ? `：${props.message}` : '')),
    props.onRetry === undefined ? null : h('button', {
      class: 'dshp-btn dshp-btn-ghost', onClick: props.onRetry, type: 'button',
    }, props.retryText ?? '↻'),
  )
}

/** 空态提示行。 */
export function EmptyHint(props: { text: string }): ReturnType<typeof h> {
  return h('div', { class: 'dshp-empty' }, props.text)
}

// —— 样式表 ——

/**
 * 安装插件样式（幂等：data-dshp-style 标记查重）。
 * 主题变量来自宿主 --dsw-alias-*；缺省回退值只作兜底，不应被命中。
 * @returns 卸载函数（移除 style 元素）。
 */
export function installStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  const existing = document.querySelector('style[data-dshp-style]')
  if (existing !== null) return () => {}
  const style = document.createElement('style')
  style.setAttribute('data-dshp-style', '1')
  style.textContent = CSS
  document.head.append(style)
  return () => { style.remove() }
}

/** 全部样式。选择器统一 dshp- 前缀，避免与宿主冲突。 */
const CSS = `
.dshp-root { color: var(--dsw-alias-label-primary, inherit); font-size: 13px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.dshp-section { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.dshp-section-title { font-weight: 600; color: var(--dsw-alias-label-primary, inherit); }
.dshp-hint { color: var(--dsw-alias-label-secondary, #888); font-size: 12px; }
.dshp-row { display: flex; gap: 8px; align-items: baseline; min-width: 0; }
.dshp-row-label { color: var(--dsw-alias-label-secondary, #888); flex: none; }
.dshp-row-value { color: var(--dsw-alias-label-primary, inherit); word-break: break-all; }
.dshp-loading { color: var(--dsw-alias-label-secondary, #888); padding: 8px 0; }
.dshp-empty { color: var(--dsw-alias-label-secondary, #888); padding: 8px 0; border: 1px dashed var(--dsw-alias-border-l1, #ddd); border-radius: 6px; text-align: center; }
.dshp-error { display: flex; gap: 8px; align-items: center; color: var(--dsw-alias-label-error, #d33); padding: 6px 0; }
.dshp-error-text { word-break: break-all; }
.dshp-btn { border: 1px solid var(--dsw-alias-border-l1, #ccc); background: var(--dsw-alias-bg-layer-2, transparent); color: var(--dsw-alias-label-primary, inherit); border-radius: 6px; padding: 3px 10px; font-size: 12px; cursor: pointer; line-height: 18px; }
.dshp-btn:hover:not(:disabled) { background: var(--dsw-alias-fill-l1, rgba(0,0,0,.05)); }
.dshp-btn:disabled { opacity: .45; cursor: default; }
.dshp-btn-primary { border-color: var(--dsw-alias-brand-primary, #4a6cf7); background: var(--dsw-alias-brand-primary, #4a6cf7); color: var(--dsw-alias-label-on-color, #fff); }
.dshp-btn-primary:hover:not(:disabled) { background: var(--dsw-alias-brand-primary, #4a6cf7); filter: brightness(1.08); }
.dshp-btn-danger { color: var(--dsw-alias-label-error, #d33); }
.dshp-btn-ghost { border-color: transparent; padding: 3px 6px; }
.dshp-input, .dshp-textarea, .dshp-select { border: 1px solid var(--dsw-alias-border-l1, #ccc); background: var(--dsw-alias-bg-layer-1, transparent); color: var(--dsw-alias-label-primary, inherit); border-radius: 6px; padding: 4px 8px; font-size: 12px; font-family: inherit; width: 100%; box-sizing: border-box; }
.dshp-textarea { min-height: 160px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre; }
.dshp-list { display: flex; flex-direction: column; gap: 4px; }
.dshp-list-item { display: flex; gap: 8px; align-items: center; padding: 6px 8px; border: 1px solid var(--dsw-alias-border-l1, #e0e0e0); border-radius: 6px; background: var(--dsw-alias-bg-layer-1, transparent); min-width: 0; }
.dshp-list-item-main { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.dshp-list-item-title { display: flex; gap: 6px; align-items: center; min-width: 0; }
.dshp-list-item-name { font-weight: 600; color: var(--dsw-alias-label-primary, inherit); word-break: break-all; }
.dshp-list-item-sub { color: var(--dsw-alias-label-secondary, #888); font-size: 12px; word-break: break-all; }
.dshp-list-actions { display: flex; gap: 4px; flex: none; }
.dshp-tag { font-size: 11px; border-radius: 4px; padding: 0 5px; line-height: 16px; background: var(--dsw-alias-fill-l1, rgba(0,0,0,.07)); color: var(--dsw-alias-label-secondary, #888); flex: none; }
.dshp-tag-active { background: var(--dsw-alias-brand-primary, #4a6cf7); color: var(--dsw-alias-label-on-color, #fff); }
.dshp-tag-error { color: var(--dsw-alias-label-error, #d33); }
.dshp-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--dsw-alias-border-l1, #e0e0e0); padding-bottom: 6px; }
.dshp-tab { border: none; background: transparent; color: var(--dsw-alias-label-secondary, #888); font-size: 13px; cursor: pointer; padding: 3px 10px; border-radius: 6px; }
.dshp-tab-active { color: var(--dsw-alias-brand-primary, #4a6cf7); font-weight: 600; background: var(--dsw-alias-fill-l1, rgba(0,0,0,.05)); }
.dshp-rewind-btn { border: 1px solid transparent; background: transparent; color: var(--dsw-alias-label-secondary, #888); border-radius: 6px; width: 26px; height: 26px; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; }
.dshp-rewind-btn:hover:not(:disabled) { background: var(--dsw-alias-fill-l1, rgba(0,0,0,.06)); color: var(--dsw-alias-label-primary, inherit); }
.dshp-rewind-btn:disabled { opacity: .4; cursor: default; }
.dshp-toast { position: fixed; right: 16px; bottom: 16px; z-index: 60; max-width: 320px; padding: 8px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,.18); border: 1px solid var(--dsw-alias-border-l1, transparent); background: var(--dsw-alias-bg-layer-2, #fff); color: var(--dsw-alias-label-primary, inherit); word-break: break-all; }
.dshp-toast-success { border-color: var(--dsw-alias-brand-primary, #4a6cf7); }
.dshp-toast-failure { color: var(--dsw-alias-label-error, #d33); }
.dshp-toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.dshp-spacer { flex: 1; }
.dshp-field { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.dshp-form { display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--dsw-alias-border-l1, #e0e0e0); border-radius: 8px; padding: 10px; background: var(--dsw-alias-bg-layer-1, transparent); }
`
