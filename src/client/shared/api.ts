/**
 * dsh-purge 后端 HTTP 路由的同源 fetch 封装。
 *
 * 后端路由由 lib/next/http.js 注册在同一 Web 服务上，同源相对路径即可调用；
 * 这里统一做：分路由超时、JSON 解析、错误归一为 { ok: false, error }。
 */

/** 请求成功。data 为后端 JSON 里去掉 ok 外的业务字段（此处整体返回，调用方自取）。 */
export interface ApiOk<T> {
  ok: true
  data: T
}

/** 请求失败（网络 / 超时 / 非 2xx / 后端 ok:false）。error 恒为字符串。 */
export interface ApiErr {
  ok: false
  error: string
}

export type ApiResult<T> = ApiOk<T> | ApiErr

/** 分路由超时表（毫秒）。key 取路径 /dsh-purge/<key> 的第二段。 */
const TIMEOUT_BY_KEY: Record<string, number> = {
  'status': 60_000,
  'override': 30_000,
  'update': 180_000,
  'rewind': 30_000,
  'rules': 30_000,
  'skills': 30_000,
  'skill': 30_000,
  'last-user': 30_000,
  'continue': 30_000,
}

/** 表外路由的默认超时。 */
const DEFAULT_TIMEOUT = 30_000

/** 从路径推导超时：/dsh-purge/update → 'update'。 */
function timeoutOf(path: string): number {
  const key = path.split('/')[2] ?? ''
  return TIMEOUT_BY_KEY[key] ?? DEFAULT_TIMEOUT
}

/** 把任意异常 / 响应归一为 ApiErr。 */
async function toApiError(response: Response | null, cause: unknown): Promise<ApiErr> {
  if (response === null) {
    // fetch 本身抛错：超时或网络断开
    const message = cause instanceof DOMException && cause.name === 'AbortError'
      ? 'timeout'
      : cause instanceof Error ? cause.message : String(cause)
    return { ok: false, error: message }
  }
  // HTTP 层错误：后端错误体是 { ok:false, error }，尽量透传原文
  let payload: unknown = null
  try { payload = await response.json() } catch { /* 非 JSON 错误体 */ }
  const error = payload !== null && typeof payload === 'object' && typeof (payload as { error?: unknown }).error === 'string'
    ? (payload as { error: string }).error
    : `HTTP ${response.status}`
  return { ok: false, error }
}

/** 发起一次 JSON 请求并归一结果；绝不抛错。 */
async function request<T>(path: string, method: 'GET' | 'POST', body?: unknown): Promise<ApiResult<T>> {
  const controller = new AbortController()
  const timer = setTimeout(() => { controller.abort() }, timeoutOf(path))
  let response: Response | null = null
  try {
    response = await fetch(path, {
      method,
      headers: body === undefined ? { accept: 'application/json' } : { accept: 'application/json', 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
      signal: controller.signal,
    })
    if (!response.ok) return await toApiError(response, null)
    const payload = (await response.json()) as T & { ok?: boolean; error?: string }
    // 后端约定：ok:false 时业务失败，error 为原因
    if (payload !== null && typeof payload === 'object' && (payload as { ok?: unknown }).ok === false) {
      const error = typeof (payload as { error?: unknown }).error === 'string' ? (payload as { error: string }).error : 'unknown'
      return { ok: false, error }
    }
    return { ok: true, data: payload }
  } catch (cause) {
    return await toApiError(response, cause)
  } finally {
    clearTimeout(timer)
  }
}

/** GET 请求。 */
export function apiGet<T>(path: string): Promise<ApiResult<T>> {
  return request<T>(path, 'GET')
}

/** POST 请求，body 序列化为 JSON。 */
export function apiPost<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(path, 'POST', body)
}

// —— 以下为各路由的载荷类型与语义化助手（字段以 lib/next/http.js 实际返回为准） ——

/** GET /dsh-purge/status 的载荷（gatherNextState + override 视图 + 版本信息）。 */
export interface StatusPayload {
  route: string
  hostCoreVersion: string
  dsh_home: string
  inject_source: string
  inject_rule_id: string | null
  inject_bytes: number
  override_path: string
  override_exists: boolean
  override_customized: boolean
  override_content: string
  default_content: string
  plugin_version: string
  /** 最近一次更新检查结果（可能为 null：尚未检查过）。 */
  update: UpdateCheckPayload | null
}

/** GET/POST /dsh-purge/override 的载荷。 */
export interface OverridePayload {
  path: string
  exists: boolean
  customized: boolean
  usingDefault: boolean
  content: string
  defaultContent: string
}

/** GET /dsh-purge/rules（op=status）的载荷。 */
export interface RulesStatusPayload {
  rules: Array<{ id: string; name: string; target: string; size: number }>
  active: string | null
  active_target: string | null
  agents_exists: boolean
  agents_synced: boolean
  agents_path: string
  rules_dir: string
  workspace_policy: string
  workspace_policies: string[]
}

/** POST /dsh-purge/rules op=read 的载荷。 */
export interface RuleReadPayload {
  id: string
  name: string
  target: string
  content: string
}

/** GET /dsh-purge/skills（op=status）的载荷。 */
export interface SkillsStatusPayload {
  skills_dir: string
  skills: Array<{ id: string; description: string; kind: string; valid: boolean; error: string; size: number; path: string }>
}

/** POST /dsh-purge/skills op=import 的载荷。 */
export interface SkillsImportPayload {
  imported: Array<{ id: string }>
}

/** GET /dsh-purge/rewind/options 的载荷（ok:false 表示不可回退）。 */
export interface RewindOptionsPayload {
  kind: 'main' | 'subagent'
  sessionId: string
  hasSubagents: boolean
  subagentIds: string[]
}

/** GET /dsh-purge/update 的载荷（checkUpdate 结果，字段按需取用）。 */
export interface UpdateCheckPayload {
  hasUpdate: boolean
  hasBeta: boolean
  error: string
  localVersion: string
  remoteVersion: string
  localSha: string
  channel: string
  channelLabel: string
  versions?: Array<{ ref?: string; id?: string; current?: boolean; name?: string }>
}

/** POST /dsh-purge/update 的载荷（switch/apply 等操作结果）。 */
export interface UpdateOpPayload extends UpdateCheckPayload {
  restartAfter?: boolean
  note?: string
}

/** 拉取状态总览。 */
export function fetchStatus(): Promise<ApiResult<StatusPayload>> {
  return apiGet<StatusPayload>('/dsh-purge/status')
}

/** 读取人格（override）。 */
export function fetchOverride(): Promise<ApiResult<OverridePayload>> {
  return apiGet<OverridePayload>('/dsh-purge/override')
}

/** 保存人格（POST {content}）。 */
export function saveOverride(content: string): Promise<ApiResult<OverridePayload>> {
  return apiPost<OverridePayload>('/dsh-purge/override', { content })
}

/** 规则集操作（op 与 body 语义见 lib/next/http.js handleRulesOp）。 */
export function rulesOp<T = unknown>(op: string, body: Record<string, unknown> = {}): Promise<ApiResult<T>> {
  return apiPost<T>('/dsh-purge/rules', { op, ...body })
}

/** 技能操作（op 与 body 语义见 lib/next/http.js handleSkillsOp）。 */
export function skillsOp<T = unknown>(op: string, body: Record<string, unknown> = {}): Promise<ApiResult<T>> {
  return apiPost<T>('/dsh-purge/skills', { op, ...body })
}

/** 检查更新（GET /dsh-purge/update）。 */
export function checkUpdate(): Promise<ApiResult<UpdateCheckPayload>> {
  return apiGet<UpdateCheckPayload>('/dsh-purge/update')
}

/** 更新操作（op: channel/switch/apply 等）。 */
export function updateOp(body: Record<string, unknown>): Promise<ApiResult<UpdateOpPayload>> {
  return apiPost<UpdateOpPayload>('/dsh-purge/update', body)
}

/** 查询某会话可回退性。 */
export function fetchRewindOptions(sessionId: string): Promise<ApiResult<RewindOptionsPayload>> {
  return apiGet<RewindOptionsPayload>(`/dsh-purge/rewind/options?sessionId=${encodeURIComponent(sessionId)}`)
}

/** 执行回退（mode: once | round）。 */
export function applyRewind(sessionId: string, mode: 'once' | 'round'): Promise<ApiResult<unknown>> {
  return apiPost<unknown>('/dsh-purge/rewind', { sessionId, mode })
}
