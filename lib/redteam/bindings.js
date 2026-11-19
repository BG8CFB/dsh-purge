/**
 * 会话 ↔ 项目（靶标）绑定：内存索引 + <redteamRoot>/session-bindings.json 落盘。
 *
 * 为什么单独成模块：模型工具（tools.js）与界面桥接（store-core / ui.js）都要读写同一份
 * 绑定关系。以前 tools.js 自己持有一份模块级 Map，界面侧改磁盘后工具侧仍读旧内存，
 * 出现"面板显示绑了 A、会话里智能体还在打 B"。现在两侧共用 bindingStoreFor(root)：
 * 同一个 root 只创建一个实例，内存与磁盘永远由同一处写入。
 *
 * 绑定键规则（与工具侧一致）：
 *   - 根会话 id 是主键（子智能体共享父会话的绑定）；
 *   - 一条记录 = 一个会话键 → 项目 id；
 *   - 最多 500 条，按插入顺序 FIFO 淘汰（长会话累积的失效 id 不会无限涨）。
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** 落盘文件名（相对 redteam 根）。 */
export const BINDINGS_FILE = 'session-bindings.json'

/** 保留条数上限。 */
export const BINDINGS_CAP = 500

/** 已按 root 建好的实例（同一 root 全进程唯一）。 */
const stores = new Map()

/** 绑定文件路径。 */
function pathOf(root) {
  return join(String(root || '.'), BINDINGS_FILE)
}

/** 读磁盘副本；损坏/不存在一律当空表，绝不让绑定读取阻断业务。 */
function readDisk(root) {
  if (!root) return {}
  try {
    const data = JSON.parse(readFileSync(pathOf(root), 'utf8'))
    if (data === null || typeof data !== 'object' || Array.isArray(data)) return {}
    const out = {}
    for (const [k, v] of Object.entries(data)) {
      if (typeof k === 'string' && k !== '' && typeof v === 'string' && v !== '') out[k] = v
    }
    return out
  } catch { return {} }
}

/** 一条绑定关系。 */
class BindingStore {
  /** @param root - redteam 数据根。 */
  constructor(root) {
    this.root = root
    this.map = new Map(Object.entries(readDisk(root)))
    this.pending = false
  }

  /** 读一个会话键的绑定项目。 */
  get(key) { return this.map.get(key) }

  /** 是否存在该会话键。 */
  has(key) { return this.map.has(key) }

  /** 全部绑定（插入顺序）。 */
  entries() { return Array.from(this.map.entries()) }

  /** 绑定列表（界面用）。 */
  list() { return this.entries().map(([session, engagement]) => ({ session, engagement })) }

  /** 某个项目上的全部会话键。 */
  holders(engagement) {
    return this.entries().filter(([, v]) => v === engagement).map(([k]) => k)
  }

  /** 写一个键；微任务合并落盘，避免批量写时反复写文件。 */
  set(key, engagement) {
    if (!key || !engagement) return
    this.map.set(key, engagement)
    this.trim()
    this.schedulePersist()
  }

  /** 批量写（根会话 + 子链共用一次落盘）。 */
  setMany(keys, engagement) {
    if (!engagement) return
    let touched = false
    for (const key of keys) {
      if (!key) continue
      this.map.set(key, engagement)
      touched = true
    }
    if (!touched) return
    this.trim()
    this.schedulePersist()
  }

  /** 删一个键。 */
  clear(key) {
    if (!this.map.delete(key)) return false
    this.schedulePersist()
    return true
  }

  /** 删掉所有指向某项目的绑定（项目归档/删除时用）。 */
  clearEngagement(engagement) {
    let removed = 0
    for (const [key, value] of this.entries()) {
      if (value !== engagement) continue
      this.map.delete(key)
      removed += 1
    }
    if (removed > 0) this.schedulePersist()
    return removed
  }

  /** 重新从磁盘加载（外部进程改过文件时用）。 */
  reload() {
    this.map = new Map(Object.entries(readDisk(this.root)))
    return this
  }

  /** 立即落盘（测试/收尾用）。 */
  flush() {
    this.pending = false
    this.persist()
  }

  trim() {
    while (this.map.size > BINDINGS_CAP) {
      const first = this.map.keys().next().value
      if (first === undefined) break
      this.map.delete(first)
    }
  }

  schedulePersist() {
    if (this.pending) return
    this.pending = true
    queueMicrotask(() => {
      if (!this.pending) return
      this.pending = false
      this.persist()
    })
  }

  persist() {
    if (!this.root) return
    try {
      mkdirSync(String(this.root), { recursive: true })
      const entries = this.entries().slice(-BINDINGS_CAP)
      const tmp = pathOf(this.root) + '.tmp'
      writeFileSync(tmp, JSON.stringify(Object.fromEntries(entries), null, 2), 'utf8')
      renameSync(tmp, pathOf(this.root))
    } catch { /* 落盘失败不影响内存绑定：本次会话仍可用 */ }
  }
}

/**
 * 取某个 redteam 根上的绑定表（同一 root 复用同一实例）。
 * @param root - redteam 数据根（$DSH_HOME/redteam）。
 * @returns 绑定表。
 */
export function bindingStoreFor(root) {
  const key = String(root || '')
  const cached = stores.get(key)
  if (cached !== undefined) return cached
  const created = new BindingStore(key)
  stores.set(key, created)
  return created
}

/** 绑定文件是否已存在（界面用于提示"尚未绑定过任何会话"）。 */
export function bindingsFileExists(root) {
  try { return existsSync(pathOf(root)) } catch { return false }
}
