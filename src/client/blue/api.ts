/**
 * 蓝队值守台后端桥：POST /blueteam/api {op, ...}、GET /blueteam/api/events。
 *
 * 与红队的 /redteam/api 完全独立：两条线各连各的库、各连各的事件流。
 */
import type { ApiResult } from '../shared/api.ts'

export const BLUE_EVENTS_PATH = '/blueteam/api/events'

const TIMEOUT_BY_OP: Record<string, number> = {
  assetImport: 60_000,
  alertIngest: 60_000,
  alerts: 60_000,
  reconcileRun: 120_000,
  report: 60_000,
}

const DEFAULT_TIMEOUT = 30_000

async function toApiError(response: Response | null, cause: unknown): Promise<ApiResult<never>> {
  if (response === null) {
    const message = cause instanceof DOMException && cause.name === 'AbortError'
      ? 'timeout'
      : cause instanceof Error ? cause.message : String(cause)
    return { ok: false, error: message }
  }
  let payload: unknown = null
  try { payload = await response.json() } catch { /* 非 JSON */ }
  const error = payload !== null && typeof payload === 'object' && typeof (payload as { error?: unknown }).error === 'string'
    ? (payload as { error: string }).error
    : 'HTTP ' + response.status
  return { ok: false, error }
}

export async function blueOp<T = Record<string, any>>(op: string, body: Record<string, unknown> = {}): Promise<ApiResult<T>> {
  const controller = new AbortController()
  const timer = setTimeout(() => { controller.abort() }, TIMEOUT_BY_OP[op] ?? DEFAULT_TIMEOUT)
  let response: Response | null = null
  try {
    response = await fetch('/blueteam/api', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ op, ...body }),
      credentials: 'same-origin',
      signal: controller.signal,
    })
    if (!response.ok) return await toApiError(response, null)
    const payload = (await response.json()) as Record<string, any>
    if (payload !== null && typeof payload === 'object' && payload.ok === false) {
      return { ok: false, error: typeof payload.error === 'string' ? payload.error : 'unknown' }
    }
    return { ok: true, data: payload as T }
  } catch (cause) {
    return await toApiError(response, cause)
  } finally {
    clearTimeout(timer)
  }
}
