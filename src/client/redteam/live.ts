/**
 * 实时化（C-3.1）：GET /redteam/api/events 的 SSE 订阅，失败自动退回 5s 轮询。
 *
 * 契约（服务端随后接入）：每条消息 `data: {"engagement":"<id>","kind":"asset|vuln|score|...","at":"<iso>"}`。
 * - 连上 → live：每条事件回调 onEvent(kind)；断开/出错 → polling：每 15s 回调一次
 *   onEvent('__poll')（语义为「用现有 op 刷新当前页签」），并每 30s 重试 SSE。
 * 角标状态经 subscribe/getSnapshot 暴露（useSyncExternalStore 消费）。
 *
 * 快照稳定性：getSnapshot 在状态未变时必须返回同一对象引用，否则 React 每次
 * 读取都判定「快照变了」→ 无限重渲染（表现为面板白屏、CPU 拉满）。
 * 这里所有状态改动都走 publish()，由它换一次快照再通知订阅者。
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
export function createLive(onEvent: (kind: string, engagement: string | null) => void, eventsPath: string = RT_EVENTS_PATH): LiveSource {
  let status: LiveStatus = 'connecting'
  let events = 0
  let eng: string | null = null
  let es: EventSource | null = null
  let pollTimer: ReturnType<typeof setInterval> | undefined
  let retryTimer: ReturnType<typeof setTimeout> | undefined
  const listeners = new Set<() => void>()
  const notify = (): void => { for (const f of [...listeners]) { try { f() } catch { /* ignore */ } } }

  /** 当前快照；只在 publish 时替换引用。 */
  let snapshot: LiveSnapshot = { status, events }

  /** 状态变化后换快照并通知（唯一出口，避免漏发或重复发）。 */
  const publish = (): void => {
    snapshot = { status, events }
    notify()
  }

  const clearPoll = (): void => {
    if (pollTimer !== undefined) { clearInterval(pollTimer); pollTimer = undefined }
    if (retryTimer !== undefined) { clearTimeout(retryTimer); retryTimer = undefined }
  }
  const startPolling = (): void => {
    if (pollTimer !== undefined) return
    pollTimer = setInterval(() => {
      events += 1
      onEvent('__poll', eng)
      publish()
    }, 15_000)
    if (retryTimer === undefined) {
      retryTimer = setTimeout(() => { retryTimer = undefined; connect() }, 30_000)
    }
  }
  const handle = (kind: string, engagement: string | null): void => {
    // 事件属于其它靶标时忽略；服务端没带 engagement 视为全局事件
    if (engagement !== null && engagement !== undefined && eng !== null && engagement !== eng) return
    events += 1
    onEvent(kind, engagement ?? eng)
    publish()
  }
  const connect = (): void => {
    if (typeof EventSource === 'undefined' || eng === null) {
      status = 'polling'
      publish()
      startPolling()
      return
    }
    // 服务端按 engagement 过滤变更流；不带参数只会收到心跳，等于白连。
    status = 'connecting'
    publish()
    try { es = new EventSource(`${eventsPath}?engagement=${encodeURIComponent(eng)}`) } catch {
      status = 'polling'
      publish()
      startPolling()
      return
    }
    es.onopen = (): void => {
      status = 'live'
      clearPoll()
      publish()
    }
    es.onmessage = (ev: MessageEvent<string>): void => {
      try {
        const data = JSON.parse(ev.data) as { engagement?: string | null; kind?: string; heartbeat?: boolean }
        // 心跳只证明链路活着：保持 live 角标，不触发数据刷新。
        if (data.heartbeat === true || typeof data.kind !== 'string') {
          if (status !== 'live') { status = 'live'; publish() }
          return
        }
        handle(data.kind, typeof data.engagement === 'string' ? data.engagement : null)
      } catch { /* 非 JSON 事件：忽略 */ }
    }
    es.onerror = (): void => {
      try { es?.close() } catch { /* ignore */ }
      es = null
      status = 'polling'
      publish()
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
        publish()
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
      publish()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    getSnapshot: () => snapshot,
    hooks: { snapshot: null as unknown as () => LiveSnapshot },
  }
  source.hooks.snapshot = source.getSnapshot
  return source
}
