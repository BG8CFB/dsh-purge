/**
 * 红队演练台后端桥接：POST /redteam/api {op, ...}（lib/redteam/ui.js）。
 *
 * 不复用 shared/api.ts 的请求底座：它的超时按 /dsh-purge/<key> 路由取名，
 * 对 /redteam/api 恒为 30s，撑不住 updateApply（npm 安装可达数分钟）；
 * 这里自带按 op 的超时表与同款错误归一（ok:false / 非 2xx / 网络异常 → 字符串 error）。
 */
import type { ApiResult } from '../shared/api.ts'

/** SSE 事件端点（GET，EventSource 消费；服务端由后端阶段接入）。 */
export const RT_EVENTS_PATH = '/redteam/api/events'

/** op 级超时表（毫秒）；表外默认 30s。 */
const TIMEOUT_BY_OP: Record<string, number> = {
  assets: 60_000,
  probeSessions: 30_000,
  platformAssignToolkit: 120_000,
  updateCheck: 180_000,
  updateApply: 600_000,
}

const DEFAULT_TIMEOUT = 30_000

/** 把异常 / 响应归一为 ApiErr（与 shared/api.ts 同构）。 */
async function toApiError(response: Response | null, cause: unknown): Promise<ApiResult<never>> {
  if (response === null) {
    const message = cause instanceof DOMException && cause.name === 'AbortError'
      ? 'timeout'
      : cause instanceof Error ? cause.message : String(cause)
    return { ok: false, error: message }
  }
  let payload: unknown = null
  try { payload = await response.json() } catch { /* 非 JSON 错误体 */ }
  const error = payload !== null && typeof payload === 'object' && typeof (payload as { error?: unknown }).error === 'string'
    ? (payload as { error: string }).error
    : `HTTP ${response.status}`
  return { ok: false, error }
}

/**
 * 发一个 redteam op。载荷与返回结构以 lib/redteam/ui.js 与旧 client.js 的用法为准；
 * 绝不 reject，失败一律归一为 { ok:false, error }。
 */
export async function rtOp<T = Record<string, any>>(op: string, body: Record<string, unknown> = {}): Promise<ApiResult<T>> {
  const controller = new AbortController()
  const timer = setTimeout(() => { controller.abort() }, TIMEOUT_BY_OP[op] ?? DEFAULT_TIMEOUT)
  let response: Response | null = null
  try {
    response = await fetch('/redteam/api', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ op, ...body }),
      credentials: 'same-origin',
      signal: controller.signal,
    })
    if (!response.ok) return await toApiError(response, null)
    const payload = (await response.json()) as Record<string, any>
    if (payload !== null && typeof payload === 'object' && payload.ok === false) {
      const error = typeof payload.error === 'string' ? payload.error : 'unknown'
      return { ok: false, error }
    }
    return { ok: true, data: payload as T }
  } catch (cause) {
    return await toApiError(response, cause)
  } finally {
    clearTimeout(timer)
  }
}
