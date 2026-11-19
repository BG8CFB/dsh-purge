/**
 * 极简 UI 基础设施：createElement 助手、常用小组件、全局通知（shell.overlay 用）、
 * 异步加载 hook、样式表安装。
 *
 * 约束：不 import 官方 UI 组件包（ui-primitives 不在本插件 external 里），
 * 纯手写元素 + CSS；主题全走宿主 design-platform.css 里真实存在的 --dsw-alias-* 语义变量。
 *
 * token 踩坑记录（rc.3 / NEXT 2.0.24）：
 *   - --dsw-alias-brand-primary 在暗色主题是中性近白色（bluish-50），不是品牌蓝，
 *     拿它当按钮填充色会得到「白底白字」的隐形按钮；
 *     实心按钮用 --dsw-alias-button-info-fill（deepseek-400）+ --dsw-alias-label-on-color；
 *   - --dsw-alias-label-error / --dsw-alias-fill-l1 已不存在，错误色用
 *     --dsw-alias-state-error-primary，悬停底色用 --dsw-alias-interactive-bg-hover；
 *   - 卡片底色用 --dsw-alias-bg-layer-1，边框用 --dsw-alias-border-l1。
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
  /** 写操作成功后直接把新值写回（避免为了刷新整页再拉一次）。 */
  setData: (data: T) => void
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
  const setData = useCallback((data: T) => { setState({ phase: 'ready', data }) }, [])
  return { state, reload, setData }
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
/* ---- 基础 ---- */
.dshp-root { color: var(--dsw-alias-label-primary); font-size: 13px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.dshp-section { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.dshp-section-title { font-weight: 600; color: var(--dsw-alias-label-primary); }
.dshp-hint { color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.5; }
.dshp-row { display: flex; gap: 8px; align-items: baseline; min-width: 0; }
.dshp-row-label { color: var(--dsw-alias-label-secondary); flex: none; }
.dshp-row-value { color: var(--dsw-alias-label-primary); word-break: break-all; }
.dshp-loading { color: var(--dsw-alias-label-secondary); padding: 8px 0; }
.dshp-empty { color: var(--dsw-alias-label-secondary); padding: 12px; border: 1px dashed var(--dsw-alias-border-l2); border-radius: 8px; text-align: center; }
.dshp-spacer { flex: 1 1 auto; min-width: 0; }

/* ---- 按钮 ---- */
.dshp-btn {
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-button-elevated-fill);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 4px 12px; font-size: 12px; cursor: pointer; line-height: 20px;
  font-family: inherit; white-space: nowrap;
}
.dshp-btn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-btn:disabled { opacity: .45; cursor: default; }
.dshp-btn-primary {
  border-color: transparent;
  background: var(--dsw-alias-button-info-fill);
  color: var(--dsw-alias-label-on-color);
  font-weight: 500;
}
.dshp-btn-primary:hover:not(:disabled) { background: var(--dsw-alias-button-info-hover); }
.dshp-btn-danger { color: var(--dsw-alias-state-error-primary); }
.dshp-rt-btn-danger { color: var(--dsw-alias-state-error-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent); }
.dshp-rt-btn-danger:hover { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); }
.dshp-btn-ghost { border-color: transparent; background: transparent; padding: 4px 8px; }
.dshp-btn-ghost:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-btn-icon { padding: 4px 7px; line-height: 16px; }

/* ---- 错误 ---- */
.dshp-error {
  display: flex; gap: 8px; align-items: center; padding: 8px 10px; border-radius: 8px;
  color: var(--dsw-alias-state-error-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, transparent);
}
.dshp-error-text { word-break: break-all; flex: 1; }

/* ---- 输入 ---- */
.dshp-input, .dshp-textarea, .dshp-select {
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 5px 9px; font-size: 12px; font-family: inherit;
  width: 100%; box-sizing: border-box;
}
.dshp-input:focus, .dshp-textarea:focus, .dshp-select:focus {
  outline: none; border-color: var(--dsw-alias-button-info-fill);
}
.dshp-textarea { min-height: 180px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre; }
.dshp-select { width: auto; }

/* ---- 列表与卡片 ---- */
.dshp-list { display: flex; flex-direction: column; gap: 6px; }
.dshp-list-item {
  display: flex; gap: 8px; align-items: center; padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1); min-width: 0;
}
.dshp-list-item-main { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.dshp-list-item-title { display: flex; gap: 6px; align-items: center; min-width: 0; }
.dshp-list-item-name { font-weight: 600; color: var(--dsw-alias-label-primary); word-break: break-all; }
.dshp-list-item-sub { color: var(--dsw-alias-label-secondary); font-size: 12px; word-break: break-all; }
.dshp-list-actions { display: flex; gap: 4px; flex: none; }

.dshp-card {
  display: flex; flex-direction: column; gap: 10px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1); padding: 14px 16px; min-width: 0;
}
.dshp-card-head { display: flex; align-items: center; gap: 8px; }
.dshp-card-title { font-weight: 600; font-size: 13px; color: var(--dsw-alias-label-primary); }
.dshp-actions { display: flex; flex-wrap: wrap; gap: 8px; }

/* ---- 键值网格 ---- */
.dshp-grid { display: grid; grid-template-columns: minmax(88px, max-content) 1fr; gap: 6px 16px; align-items: baseline; }
.dshp-grid-key { color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dshp-grid-value { color: var(--dsw-alias-label-primary); word-break: break-all; font-size: 12.5px; }

/* ---- 标签 ---- */
.dshp-tag {
  font-size: 11px; border-radius: 5px; padding: 0 6px; line-height: 17px;
  background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); flex: none;
}
.dshp-tag-active { background: var(--dsw-alias-button-info-fill); color: var(--dsw-alias-label-on-color); }
.dshp-tag-error { color: var(--dsw-alias-state-error-primary); }

/* ---- 旧页签（设置页内嵌） ---- */
.dshp-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--dsw-alias-border-l1); padding-bottom: 8px; flex-wrap: wrap; }
.dshp-tab {
  border: none; background: transparent; color: var(--dsw-alias-label-secondary);
  font-size: 13px; cursor: pointer; padding: 4px 12px; border-radius: 8px; font-family: inherit;
}
.dshp-tab:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-tab-active { color: var(--dsw-alias-label-primary); font-weight: 600; background: var(--dsw-alias-interactive-bg-active); }

/* ---- 输入框回退按钮 ---- */
.dshp-rewind-btn {
  border: 1px solid transparent; background: transparent; color: var(--dsw-alias-label-secondary);
  border-radius: 8px; width: 28px; height: 28px; cursor: pointer; font-size: 14px; line-height: 1; padding: 0;
}
.dshp-rewind-btn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dshp-rewind-btn:disabled { opacity: .4; cursor: default; }

/* ---- Toast ---- */
.dshp-toast {
  position: fixed; right: 16px; bottom: 16px; z-index: 60; max-width: 360px; padding: 10px 14px;
  border-radius: 10px; font-size: 13px; cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,.28);
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-primary); word-break: break-all;
}
.dshp-toast-success { border-color: var(--dsw-alias-button-info-fill); }
.dshp-toast-failure { color: var(--dsw-alias-state-error-primary); }

/* ---- 工具栏与表单 ---- */
.dshp-toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.dshp-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.dshp-form { display: flex; flex-direction: column; gap: 10px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 12px; background: var(--dsw-alias-bg-layer-1); }

/* ---- 全局主面板（main 槽位） ---- */
.dshp-main { height: 100%; min-height: 0; display: flex; flex-direction: column; background: var(--dsw-alias-bg-base); }
.dshp-main-head {
  display: flex; align-items: center; gap: 12px; padding: 10px 18px; flex-wrap: wrap;
  border-bottom: 1px solid var(--dsw-alias-border-l1); flex: none;
}
.dshp-main-brand { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.dshp-main-title { font-size: 15px; font-weight: 650; color: var(--dsw-alias-label-primary); }
.dshp-main-sub { font-size: 12px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dshp-main-tabs { display: flex; gap: 2px; align-items: center; }
.dshp-main-tab {
  border: none; background: transparent; color: var(--dsw-alias-label-secondary);
  font-size: 13px; padding: 5px 12px; border-radius: 8px; cursor: pointer; font-family: inherit;
}
.dshp-main-tab:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dshp-main-tab.on { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-interactive-bg-active); font-weight: 600; }
.dshp-main-body { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.dshp-main-scroll { flex: 1; min-height: 0; overflow: auto; padding: 16px 20px 28px; display: flex; flex-direction: column; gap: 14px; }
.dshp-main-fill { flex: 1; min-height: 0; display: flex; flex-direction: column; }

/* ---- 指挥台（就绪检查网格 / 内联新建） ---- */
.dshp-check-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; }
.dshp-check {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 8px 10px;
  background: var(--dsw-alias-bg-layer-2); display: flex; flex-direction: column; gap: 3px; min-width: 0;
}
.dshp-check.ok { border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #10b981) 55%, transparent); }
.dshp-check.bad { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 55%, transparent); }
.dshp-check-key { font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.dshp-check-val { font-size: 12.5px; color: var(--dsw-alias-label-primary); font-weight: 600; word-break: break-word; }
.dshp-check.ok .dshp-check-val { color: var(--dsw-alias-state-success-primary, #10b981); }
.dshp-check.bad .dshp-check-val { color: var(--dsw-alias-state-error-primary); }
.dshp-check-detail { font-size: 11px; color: var(--dsw-alias-label-secondary); word-break: break-all;
  max-height: 34px; overflow: hidden; }
.dshp-form-inline { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 6px; }
.dshp-pj-divider { font-size: 11.5px; color: var(--dsw-alias-label-tertiary); margin: 2px 0; }
.dshp-mono-ellipsis { font-family: ui-monospace, Consolas, monospace; font-size: 11.5px; font-weight: 400;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ---- 右栏折叠块 ---- */
.dshp-details { border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 6px 10px; }
.dshp-details > summary { cursor: pointer; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dshp-details[open] > summary { margin-bottom: 6px; }

/* ---- 会话头红队状态徽章 ---- */
.dshp-badge {
  border: 1px solid color-mix(in srgb, var(--dsw-alias-button-info-fill) 40%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 12%, transparent);
  color: var(--dsw-alias-label-primary);
  border-radius: 999px; font-size: 11.5px; line-height: 18px; padding: 1px 10px;
  cursor: pointer; font-family: inherit; white-space: nowrap; max-width: 240px;
  overflow: hidden; text-overflow: ellipsis;
}
.dshp-badge:hover { background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 24%, transparent); }
.dshp-badge-idle { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); }

/* ---- 输入框右侧「红队对话」胶囊按钮 ---- */
.dshp-drill-btn {
  border: 1px solid color-mix(in srgb, var(--dsw-alias-button-info-fill) 45%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 14%, transparent);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px; font-size: 11.5px; line-height: 18px; padding: 1px 9px;
  cursor: pointer; flex: none; font-family: inherit; white-space: nowrap;
}
.dshp-drill-btn:hover { background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 26%, transparent); }
.dshp-drill-wrap { position: relative; display: inline-flex; align-items: center; }
.dshp-drill-menu {
  position: fixed; transform: translateY(calc(-100% - 8px)); z-index: 70;
  min-width: 200px; max-width: 320px; max-height: 320px; overflow: auto;
  background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px; padding: 6px; box-shadow: 0 10px 28px rgba(0,0,0,.32);
  display: flex; flex-direction: column; gap: 2px;
}
.dshp-drill-menu-title { font-size: 11px; color: var(--dsw-alias-label-secondary); padding: 4px 6px 6px; }
.dshp-drill-menu-item {
  display: flex; align-items: center; gap: 6px; width: 100%; text-align: left;
  border: none; background: transparent; color: var(--dsw-alias-label-primary);
  font-size: 12.5px; padding: 6px 8px; border-radius: 7px; cursor: pointer; font-family: inherit;
}
.dshp-drill-menu-item:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-drill-menu-item.on { background: var(--dsw-alias-interactive-bg-active); }
.dshp-drill-menu-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dshp-drill-menu-mark { color: var(--dsw-alias-button-info-fill); font-size: 9px; flex: none; }
.dshp-drill-menu-sub { font-size: 10.5px; color: var(--dsw-alias-label-tertiary); flex: none; }

/* ---- 侧栏「新建会话」行里的红队按钮 ---- */
.dshp-sidebar-row { display: inline-flex; align-items: center; gap: 4px; min-width: 0; }
.dshp-sidebar-drill {
  border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-button-elevated-fill);
  color: var(--dsw-alias-label-primary); border-radius: 6px; font-size: 11px; line-height: 16px;
  padding: 1px 6px; cursor: pointer; flex: none; font-family: inherit;
}
.dshp-sidebar-drill:hover { background: var(--dsw-alias-interactive-bg-hover); }

/* ---- 会话绑定行（右栏） ---- */
.dshp-bindrow { display: flex; gap: 6px; align-items: center; min-width: 0; margin-top: 4px; }
.dshp-bindrow .dshp-select { flex: 1; min-width: 0; }
.dshp-bindname { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--dsw-alias-label-primary); font-size: 12.5px; }

/* ---- 全局确认框（shell.overlay 里的 DialogHost） ---- */
.dshp-modal-mask {
  position: fixed; inset: 0; z-index: 90; background: rgba(0, 0, 0, .42);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.dshp-modal {
  width: min(420px, 100%); box-sizing: border-box;
  background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px; padding: 16px; box-shadow: 0 18px 48px rgba(0, 0, 0, .4);
  display: flex; flex-direction: column; gap: 12px;
}
.dshp-modal-text { font-size: 13px; line-height: 1.6; color: var(--dsw-alias-label-primary); white-space: pre-wrap; }
.dshp-modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
`;
