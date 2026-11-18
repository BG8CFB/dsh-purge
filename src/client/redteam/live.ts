/**
 * 实时化（C-3.1）：GET /redteam/api/events 的 SSE 订阅，失败自动退回 5s 轮询。
 *
 * 契约（服务端随后接入）：每条消息 `data: {"engagement":"<id>","kind":"asset|vuln|score|...","at":"<iso>"}`。
 * - 连上 → live：每条事件回调 onEvent(kind)；断开/出错 → polling：每 5s 回调一次
 *   onEvent('__poll')（语义为「用现有 op 刷新当前页签」），并每 30s 重试 SSE。
 * 角标状态经 subscribe/getSnapshot 暴露（useSyncExternalStore 消费）。
 */
import { RT_EVENTS_PATH } from './api.ts'

export type LiveStatus = 'connecting' | 'live' | 'polling'

export interface LiveSnapshot {
  status: LiveStatus
  /** 收到的事件数（含轮询心跳）；仅用于触发重绘。 */
  events: number
}

export interface LiveSource {
  /** 开始跟随某个靶标（null = 停止）。 */
  start: (engagement: string | null) => void
  stop: () => void
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => LiveSnapshot
  /** 供 useSyncExternalStore 直接绑定。 */
  hooks: { snapshot: () => LiveSnapshot }
}

/** 事件回调：kind 为契约里的 kind，或 '__poll'（轮询心跳，只刷新不打扰）。 */
export function createLive(onEvent: (kind: string, engagement: string | null) => void): LiveSource {
  let status: LiveStatus = 'connecting'
  let events = 0
  let eng: string | null = null
  let es: EventSource | null = null
  let pollTimer: ReturnType<typeof setInterval> | undefined
  let retryTimer: ReturnType<typeof setTimeout> | undefined
  const listeners = new Set<() => void>()
  const notify = (): void => { for (const f of [...listeners]) { try { f() } catch { /* ignore */ } } }

  const clearPoll = (): void => {
    if (pollTimer !== undefined) { clearInterval(pollTimer); pollTimer = undefined }
    if (retryTimer !== undefined) { clearTimeout(retryTimer); retryTimer = undefined }
  }
  const startPolling = (): void => {
    if (pollTimer !== undefined) return
    pollTimer = setInterval(() => {
      events += 1
      onEvent('__poll', eng)
      notify()
    }, 5_000)
    if (retryTimer === undefined) {
      retryTimer = setTimeout(() => { retryTimer = undefined; connect() }, 30_000)
    }
  }
  const handle = (kind: string, engagement: string | null): void => {
    // 事件属于其它靶标时忽略；服务端没带 engagement 视为全局事件
    if (engagement !== null && engagement !== undefined && eng !== null && engagement !== eng) return
    events += 1
    onEvent(kind, engagement ?? eng)
    notify()
  }
  const connect = (): void => {
    if (typeof EventSource === 'undefined') {
      status = 'polling'
      notify()
      startPolling()
      return
    }
    status = 'connecting'
    notify()
    try { es = new EventSource(RT_EVENTS_PATH) } catch {
      status = 'polling'
      notify()
      startPolling()
      return
    }
    es.onopen = (): void => {
      status = 'live'
      clearPoll()
      notify()
    }
    es.onmessage = (ev: MessageEvent<string>): void => {
      try {
        const data = JSON.parse(ev.data) as { engagement?: string | null; kind?: string }
        handle(typeof data.kind === 'string' ? data.kind : 'unknown', typeof data.engagement === 'string' ? data.engagement : null)
      } catch { /* 非 JSON 事件：忽略 */ }
    }
    es.onerror = (): void => {
      try { es?.close() } catch { /* ignore */ }
      es = null
      status = 'polling'
      notify()
      startPolling()
    }
  }

  const source: LiveSource = {
    start(nextEng) {
      eng = nextEng
      try { es?.close() } catch { /* ignore */ }
      es = null
      clearPoll()
      if (eng === null) {
        status = 'connecting'
        notify()
        return
      }
      connect()
    },
    stop() {
      eng = null
      try { es?.close() } catch { /* ignore */ }
      es = null
      clearPoll()
      status = 'connecting'
      events = 0
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    getSnapshot: () => ({ status, events }),
    hooks: { snapshot: null as unknown as () => LiveSnapshot },
  }
  source.hooks.snapshot = source.getSnapshot
  return source
}
