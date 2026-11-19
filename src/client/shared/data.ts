/**
 * 客户端共享数据层：projects / session-bindings / 会话绑定动作。
 *
 * 同一份数据以前被五个组件各自 rtOp 拉一遍（主面板、右栏页签、会话头徽章、
 * 输入框按钮、项目中心），彼此不知道对方的写入，表现为"A 面板刚绑好，
 * B 面板还显示未绑定"。这里提供 5 秒 TTL 的模块级缓存 + 写后显式失效，
 * 消费方一律走 hook，读到的是同一份快照。
 *
 * 只缓存"读多写少的全局指针"（项目名册、绑定表）；资产/漏洞等大表仍由各页自取。
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { rtOp } from '../redteam/api.ts'
import type { NoticeSource } from './ui.ts'
import type { Translate } from '../locale.ts'

/** 项目行（engagement 的客户端投影，字段按后端 projects op 实际返回取子集）。 */
export interface ProjectRow {
  id: string
  name?: string
  dir?: string
  workspace_id?: string | null
  status?: string
}

/** 会话绑定行（session-bindings.json 的投影）。 */
export interface BindingRow {
  session?: string
  engagement?: string
}

/** 缓存有效期：全局指针类数据 5 秒足够新，又能挡住同一帧里的重复请求。 */
const TTL_MS = 5000
const cache = new Map<string, { at: number; value: unknown }>()

/**
 * 全局修订号：任何写后失效都会 +1 并通知所有订阅者。
 * 组件不再各自维护 revision —— 右栏绑定会话时，会话头徽章与主面板同时刷新，
 * 不会出现"这里还显示未绑定"。
 */
let revision = 0
const listeners = new Set<() => void>()

function subscribeData(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function readRevision(): number { return revision }

function bump(): void {
  revision += 1
  for (const listener of [...listeners]) {
    try { listener() } catch { /* ignore */ }
  }
}

function readCache<T>(key: string): T | undefined {
  const hit = cache.get(key)
  if (hit === undefined) return undefined
  if (Date.now() - hit.at > TTL_MS) { cache.delete(key); return undefined }
  return hit.value as T
}

function writeCache<T>(key: string, value: T): T {
  cache.set(key, { at: Date.now(), value })
  return value
}

/** 项目集合变了（新建 / 删除 / 改名 / 归档）后调用。 */
export function invalidateProjects(): void { cache.delete('projects'); bump() }

/** 会话绑定变了（bind / unbind）后调用。 */
export function invalidateBindings(): void { cache.delete('bindings'); bump() }

type Loaded<T> = { ok: true; data: T } | { ok: false; error: string }

async function loadProjects(): Promise<Loaded<{ items: ProjectRow[]; current: string }>> {
  const hit = readCache<{ items: ProjectRow[]; current: string }>('projects')
  if (hit !== undefined) return { ok: true, data: hit }
  const result = await rtOp<{ items?: ProjectRow[]; current?: string }>('projects')
  if (!result.ok) return { ok: false, error: result.error }
  const data = writeCache('projects', {
    items: Array.isArray(result.data.items) ? result.data.items as ProjectRow[] : [],
    current: typeof result.data.current === 'string' ? result.data.current : '',
  })
  return { ok: true, data }
}

async function loadBindings(): Promise<Loaded<BindingRow[]>> {
  const hit = readCache<BindingRow[]>('bindings')
  if (hit !== undefined) return { ok: true, data: hit }
  const result = await rtOp<{ items?: BindingRow[] }>('bindings')
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, data: writeCache('bindings', Array.isArray(result.data.items) ? result.data.items : []) }
}

/** 从绑定表里取某会话绑定的项目 id。 */
export function boundOf(rows: BindingRow[], sessionId: string): string | null {
  const hit = rows.find((row) => row.session === sessionId)
  return hit !== undefined && typeof hit.engagement === 'string' && hit.engagement !== '' ? hit.engagement : null
}

/** 项目名册（共享缓存）。 */
export interface ProjectsView {
  items: ProjectRow[] | null
  /** 服务端的"当前项目"指针。 */
  current: string
  error: string | null
  reload: () => void
}

export function useProjects(): ProjectsView {
  const [state, setState] = useState<{ items: ProjectRow[] | null; current: string; error: string | null }>(() => {
    const hit = readCache<{ items: ProjectRow[]; current: string }>('projects')
    return hit !== undefined
      ? { items: hit.items, current: hit.current, error: null }
      : { items: null, current: '', error: null }
  })
  const tick = useSyncExternalStore(subscribeData, readRevision)
  useEffect(() => {
    let cancelled = false
    void loadProjects().then((result) => {
      if (cancelled) return
      if (!result.ok) { setState((prev) => ({ ...prev, error: result.error })); return }
      setState({ items: result.data.items, current: result.data.current, error: null })
    })
    return () => { cancelled = true }
  }, [tick])
  const reload = useCallback(() => { invalidateProjects() }, [])
  return { items: state.items, current: state.current, error: state.error, reload }
}

/** 本会话绑定的项目 id（共享缓存）。 */
export function useBindings(sessionId?: string): { bound: string | null; reload: () => void } {
  const [bound, setBound] = useState<string | null>(null)
  const tick = useSyncExternalStore(subscribeData, readRevision)
  useEffect(() => {
    const id = sessionId ?? ''
    if (id === '') { setBound(null); return }
    let cancelled = false
    void loadBindings().then((result) => {
      if (cancelled || !result.ok) return
      setBound(boundOf(result.data, id))
    })
    return () => { cancelled = true }
  }, [sessionId, tick])
  const reload = useCallback(() => { invalidateBindings() }, [])
  return { bound, reload }
}

/** 绑定动作（bind / unbind）：右栏页签与演练台项目头共用同一套语义与文案。 */
export interface SessionBinding {
  bound: string | null
  busy: boolean
  bind: (engagement: string, name?: string) => Promise<boolean>
  unbind: () => Promise<boolean>
  /** 外部改动后重读绑定表（走缓存失效）。 */
  reload: () => void
}

export function useSessionBinding(
  sessionId: string | undefined,
  t: Translate,
  notices: NoticeSource,
  onChanged?: () => void,
): SessionBinding {
  const { bound, reload } = useBindings(sessionId)
  const [busy, setBusy] = useState(false)
  const id = sessionId ?? ''
  const bind = useCallback(async (engagement: string, name?: string): Promise<boolean> => {
    if (id === '' || engagement === '') return false
    setBusy(true)
    const result = await rtOp('bindSession', { sessionId: id, engagement })
    setBusy(false)
    if (!result.ok) {
      notices.report(t('panel.bindingFail') + '：' + result.error, 'failure')
      return false
    }
    reload()
    // 面板切换与智能体绑定保持同一个当前项目指针
    void rtOp('activateEngagement', { engagement })
    notices.report(t('panel.bindOk', { name: name ?? engagement }), 'success')
    if (onChanged !== undefined) onChanged()
    return true
  }, [id, notices, t, reload, onChanged])
  const unbind = useCallback(async (): Promise<boolean> => {
    if (id === '') return false
    setBusy(true)
    const result = await rtOp('bindSession', { sessionId: id, engagement: '' })
    setBusy(false)
    if (!result.ok) {
      notices.report(t('panel.bindingFail') + '：' + result.error, 'failure')
      return false
    }
    reload()
    notices.report(t('panel.unbindOk'), 'success')
    if (onChanged !== undefined) onChanged()
    return true
  }, [id, notices, t, reload, onChanged])
  return { bound, busy, bind, unbind, reload }
}
