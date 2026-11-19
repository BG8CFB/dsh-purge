/**
 * 蓝队事实库（BlueteamStore）
 *
 * 与红队的关系：两条平行线。
 *   · 一个项目只属于一侧（side=offense|defense），由用户在这场攻防里担任的角色决定；
 *   · 两侧各有自己的数据根（$DSH_HOME/redteam 与 $DSH_HOME/blueteam）、自己的会话绑定、
 *     自己的工具集与自己的面板页签；
 *   · 共享的只有同一份代码（资产/端口/指纹表结构相同）与受控的对账通道（只读红队库）。
 *
 * 本类只做事实库：写入、查询、状态机守卫、指标计算。HTTP / 工具 / 面板在别处。
 */

import { DatabaseSync } from 'node:sqlite'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import {
  RedteamStore, readEngagementMeta, writeEngagementMeta, nowIso,
} from '../redteam/store-core.js'
import { cidrOf, scopeOfIp } from '../redteam/ip-utils.js'
import { BLUE_DDL, migrateBlue } from './schema-blue.js'
import { BLUE_ROLE_TITLES, BLUE_DEFAULT_PROMPTS } from './prompts.js'

/* ------------------------------------------------------------------ 常量 */

export const BLUE_SEVERITIES = ['P0', 'P1', 'P2', 'P3']

export const TRIAGE_VERDICTS = {
  confirmed: 'confirmed',
  false_positive: 'false_positive',
  duplicate: 'duplicate',
  suppressed: 'suppressed',
  pending: 'triaging',
  close: 'closed',
}

export const FP_CAUSES = ['rule', 'unknown-asset', 'business-change', 'clock-skew', 'other']

/** 处置动作 → 默认风险。工具层不可下调（只能按这张表定级）。 */
export const ACTION_RISK = {
  hunt: 'low',
  kill_process: 'mid',
  remove_shell: 'mid',
  block_ip: 'mid',
  block_domain: 'mid',
  patch: 'mid',
  downgrade_exposure: 'mid',
  isolate_host: 'high',
  disable_account: 'high',
  rotate_credential: 'high',
  revoke_ticket: 'high',
}

const NEEDS_PLAN = new Set(['high', 'critical'])

/** 关键 TTP：覆盖率的分子分母都按这张表算。 */
export const CRITICAL_TTPS = [
  'T1595', 'T1190', 'T1133', 'T1078', 'T1566', 'T1021', 'T1570', 'T1068',
  'T1059', 'T1547', 'T1543', 'T1053', 'T1071', 'T1090', 'T1567', 'T1486', 'T1003',
]

/** SLA（分钟）：首次研判 / 止血。档位由项目元数据 sla_profile 决定。 */
export const SLA_PROFILES = {
  strict: {
    triage: { P0: 3, P1: 10, P2: 30, P3: 240 },
    contain: { P0: 15, P1: 60, P2: 240, P3: 1440 },
  },
  standard: {
    triage: { P0: 5, P1: 15, P2: 60, P3: 480 },
    contain: { P0: 30, P1: 120, P2: 480, P3: 1440 },
  },
  loose: {
    triage: { P0: 10, P1: 30, P2: 240, P3: 1440 },
    contain: { P0: 60, P1: 240, P2: 1440, P3: 2880 },
  },
}

const INCIDENT_ORDER = { open: 0, contained: 1, eradicated: 2, recovered: 3, closed: 4 }

/* ------------------------------------------------------------------ 小工具 */

const nz = (v) => (v === undefined ? null : v)
const str = (v) => (v === undefined || v === null ? '' : String(v).trim())
const num = (v, d = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}
const sha = (s) => createHash('sha1').update(String(s)).digest('hex').slice(0, 16)
const median = (list) => {
  const xs = list.filter((x) => Number.isFinite(x)).sort((a, b) => a - b)
  if (xs.length === 0) return null
  const mid = Math.floor(xs.length / 2)
  return xs.length % 2 === 1 ? xs[mid] : Math.round((xs[mid - 1] + xs[mid]) / 2)
}
const minutesBetween = (a, b) => {
  const t1 = Date.parse(a || '')
  const t2 = Date.parse(b || '')
  if (!Number.isFinite(t1) || !Number.isFinite(t2)) return null
  return Math.round((t2 - t1) / 60000)
}
const plusMinutes = (fromIso, minutes) => {
  const base = Date.parse(fromIso || '') || Date.now()
  return new Date(base + minutes * 60000).toISOString()
}
const argsToNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/**
 * 参数名归一：snake_case → camelCase（工具与面板两侧都写 snake 更符合习惯，
 * 但事实库内部统一用 camel；在入口一次转换，方法体里就不用两套名字）。
 * 只转顶层键，嵌套对象（如 rows 里的告警行）保持原样。
 */
export function normalizeArgs(args) {
  if (args === null || typeof args !== 'object' || Array.isArray(args)) return args
  const out = {}
  for (const [key, value] of Object.entries(args)) {
    const camel = key.replace(/_([a-z0-9])/g, (_m, c) => c.toUpperCase())
    out[camel] = value
  }
  return out
}

function metaOf(store, id) {
  return readEngagementMeta(store.metaPathOf(id)) || {}
}

/* ------------------------------------------------------------------ 主体 */

export class BlueteamStore extends RedteamStore {
  constructor(root) {
    super(root, { side: 'defense' })
  }

  roleTitles() { return BLUE_ROLE_TITLES }

  defaultPrompts() { return BLUE_DEFAULT_PROMPTS }

  /**
   * 蓝队不种红队得分点（这一版蓝队不做记分，指标只作为技术观测值看）。
   * 基类 openEngagement 会调它，这里空实现，避免蓝队库里出现一堆用不到的红队得分点。
   */
  seedScorePoints() { return { seeded: 0 } }

  /** 每次建库时追加蓝队表（基类 db() 的扩展钩子）。 */
  extendDb(handle) {
    handle.exec(BLUE_DDL)
    migrateBlue(handle)
  }

  /* ---------------- 项目 ---------------- */

  openEngagement(name, scope, options = {}) {
    const out = super.openEngagement(name, scope, options)
    const path = this.metaPathOf(out.id)
    const meta = readEngagementMeta(path) || {}
    meta.side = 'defense'
    meta.mode = options.mode === 'live' ? 'live' : (meta.mode || 'drill')
    meta.sla_profile = options.slaProfile || meta.sla_profile || 'standard'
    meta.tz = options.tz || meta.tz || 'Asia/Shanghai'
    if (typeof options.defender === 'string' && options.defender.trim() !== '') meta.defender = options.defender.trim()
    meta.updated_at = nowIso()
    writeEngagementMeta(path, meta)
    return { ...out, side: 'defense', mode: meta.mode, sla_profile: meta.sla_profile, tz: meta.tz }
  }

  listEngagements() {
    return super.listEngagements().map((row) => {
      const meta = metaOf(this, row.id)
      return {
        ...row,
        side: 'defense',
        mode: meta.mode || 'drill',
        sla_profile: meta.sla_profile || 'standard',
        tz: meta.tz || 'Asia/Shanghai',
        defender: meta.defender || '',
      }
    })
  }

  projectMeta(id) {
    const meta = metaOf(this, id)
    return {
      id,
      name: meta.target_name || id,
      scope: meta.scope_cidrs || [],
      status: meta.status || 'active',
      created_at: meta.created_at || null,
      side: 'defense',
      mode: meta.mode || 'drill',
      sla_profile: meta.sla_profile || 'standard',
      tz: meta.tz || 'Asia/Shanghai',
      defender: meta.defender || '',
      note: meta.note || '',
      data_dir: this.dataDirOf(id),
      workspace_id: meta.workspace_id || null,
      workspace_title: meta.workspace_title || null,
    }
  }

  /* ---------------- 统计 / 摘要 ---------------- */

  stats(id) {
    const base = super.stats(id)
    const db = this.db(id)
    const one = (sql) => {
      try { return Number(db.prepare(sql).get()?.n ?? 0) || 0 } catch { return 0 }
    }
    return {
      ...base,
      alerts: one('SELECT COUNT(*) AS n FROM alert'),
      unhandledAlerts: one("SELECT COUNT(*) AS n FROM alert WHERE status IN ('new','triaging')"),
      p0Alerts: one("SELECT COUNT(*) AS n FROM alert WHERE severity='P0' AND status IN ('new','triaging','confirmed')"),
      incidents: one('SELECT COUNT(*) AS n FROM incident'),
      openIncidents: one("SELECT COUNT(*) AS n FROM incident WHERE status <> 'closed'"),
      exposures: one('SELECT COUNT(*) AS n FROM exposure'),
      openExposures: one("SELECT COUNT(*) AS n FROM exposure WHERE status IN ('open','fixing')"),
      rules: one("SELECT COUNT(*) AS n FROM detection_rule WHERE status='active'"),
      sources: one('SELECT COUNT(*) AS n FROM log_source'),
      pendingActions: one("SELECT COUNT(*) AS n FROM response_action WHERE approval_status='requested'"),
      unverifiedActions: one('SELECT COUNT(*) AS n FROM response_action WHERE executed_at IS NOT NULL AND verify_at IS NULL AND rolled_back_at IS NULL'),
    }
  }

  blueDigest(id) {
    const db = this.db(id)
    const now = Date.now()
    const group = (sql) => Object.fromEntries(db.prepare(sql).all().map((r) => [r.k, r.n]))
    const alertBySev = group('SELECT severity AS k, COUNT(*) AS n FROM alert GROUP BY severity')
    const alertByStatus = group('SELECT status AS k, COUNT(*) AS n FROM alert GROUP BY status')
    const pendingRows = db.prepare("SELECT id, severity, status, first_seen, sla_due_at FROM alert WHERE status IN ('new','triaging')").all()
    const overdue = pendingRows.filter((r) => r.sla_due_at !== null && Date.parse(r.sla_due_at) < now)
    const openIncidents = db.prepare("SELECT id, title, severity, status, detected_at, triaged_at, contained_at FROM incident WHERE status <> 'closed' ORDER BY detected_at DESC LIMIT 10").all()
    const allInc = db.prepare('SELECT detected_at, triaged_at, contained_at FROM incident WHERE detected_at IS NOT NULL').all()
    const mttdAll = median(allInc.map((i) => minutesBetween(i.detected_at, i.triaged_at)))
    const mttrAll = median(allInc.map((i) => minutesBetween(i.detected_at, i.contained_at)))
    const fp = Number(db.prepare("SELECT COUNT(*) AS n FROM alert WHERE status='false_positive'").get().n) || 0
    const totalAlerts = Number(db.prepare('SELECT COUNT(*) AS n FROM alert').get().n) || 0
    const exp = group('SELECT status AS k, COUNT(*) AS n FROM exposure GROUP BY status')
    const actions = {
      pending: Number(db.prepare("SELECT COUNT(*) AS n FROM response_action WHERE approval_status='requested'").get().n) || 0,
      unverified: Number(db.prepare('SELECT COUNT(*) AS n FROM response_action WHERE executed_at IS NOT NULL AND verify_at IS NULL AND rolled_back_at IS NULL').get().n) || 0,
      cooling: Number(db.prepare('SELECT COUNT(*) AS n FROM response_action WHERE cool_down_until IS NOT NULL AND rolled_back_at IS NULL AND verify_at IS NULL').get().n) || 0,
    }
    const sources = group('SELECT status AS k, COUNT(*) AS n FROM log_source GROUP BY status')
    const rulesActive = Number(db.prepare("SELECT COUNT(*) AS n FROM detection_rule WHERE status='active'").get().n) || 0
    const changes = db.prepare('SELECT id, kind, ref_id, at FROM change_log ORDER BY id DESC LIMIT 15').all()
    return {
      engagement: this.projectMeta(id),
      alerts: {
        total: totalAlerts,
        unhandled: pendingRows.length,
        overdue: overdue.length,
        p0: Number(alertBySev.P0 || 0),
        bySeverity: alertBySev,
        byStatus: alertByStatus,
        fpRate: totalAlerts === 0 ? 0 : Math.round((fp / totalAlerts) * 1000) / 10,
      },
      incidents: { open: openIncidents.length, recent: openIncidents },
      metrics: { mttd: mttdAll, mttr: mttrAll },
      exposures: { ...exp, open: (exp.open || 0) + (exp.fixing || 0) },
      detection: { rulesActive, sources },
      actions,
      vulns: this.vulnStats(id),
      changes,
      at: nowIso(),
    }
  }

  /* ---------------- 资产 / 画像 ---------------- */

  importAssets(id, rows = []) {
    const db = this.db(id)
    const out = { inserted: 0, updated: 0, skipped: 0, assets: [] }
    const find = db.prepare('SELECT id FROM asset WHERE ip = ?')
    const ins = db.prepare('INSERT INTO asset (segment_cidr, ip, state, primary_name, first_seen, last_seen, discovered_at, scope) VALUES (?,?,?,?,?,?,?,?)')
    const updName = db.prepare("UPDATE asset SET primary_name = COALESCE(NULLIF(primary_name, ''), ?) WHERE id = ?")
    const insPort = db.prepare('INSERT OR IGNORE INTO port (asset_id, proto, port, state, provenance, first_seen, last_seen) VALUES (?,?,?,?,?,?,?)')
    const now = nowIso()
    for (const raw of rows) {
      const row = raw && typeof raw === 'object' ? raw : {}
      const ip = str(row.ip || row.IP || row.address)
      if (ip === '') { out.skipped += 1; continue }
      const name = str(row.name || row.host || row.hostname || row.domain)
      let assetId = find.get(ip)?.id
      if (assetId === undefined) {
        const info = ins.run(cidrOf(ip), ip, 'live', name || null, now, now, now, scopeOfIp(ip))
        assetId = Number(info.lastInsertRowid)
        out.inserted += 1
      } else {
        if (name !== '') updName.run(name, assetId)
        out.updated += 1
      }
      const port = num(row.port, 0)
      if (port > 0) insPort.run(assetId, str(row.proto) || 'tcp', port, 'open', 'manual', now, now)
      const profile = {
        owner: str(row.owner), dept: str(row.dept), business: str(row.business),
        env: str(row.env) || 'prod', criticality: str(row.criticality) || 'P2',
        data_class: str(row.data_class) || 'internal',
      }
      const hasProfile = profile.owner || profile.dept || profile.business || profile.env !== 'prod'
        || profile.criticality !== 'P2' || profile.data_class !== 'internal'
      if (hasProfile) this.saveAssetProfile(id, { assetId, ...profile, updatedBy: 'import' })
      out.assets.push({ id: assetId, ip, name })
    }
    return out
  }

  saveAssetProfile(id, args = {}) {
    const db = this.db(id)
    const assetId = this.resolveAssetId(id, args)
    const cur = db.prepare('SELECT * FROM asset_profile WHERE asset_id = ?').get(assetId) || {}
    const next = {
      owner: args.owner !== undefined ? str(args.owner) : (cur.owner || ''),
      dept: args.dept !== undefined ? str(args.dept) : (cur.dept || ''),
      business: args.business !== undefined ? str(args.business) : (cur.business || ''),
      env: args.env !== undefined ? str(args.env) : (cur.env || 'prod'),
      criticality: args.criticality !== undefined ? str(args.criticality) : (cur.criticality || 'P2'),
      data_class: args.data_class !== undefined ? str(args.data_class) : (cur.data_class || 'internal'),
      users_count: args.users_count !== undefined ? num(args.users_count) : nz(cur.users_count),
      rto_min: args.rto_min !== undefined ? num(args.rto_min) : nz(cur.rto_min),
      rpo_min: args.rpo_min !== undefined ? num(args.rpo_min) : nz(cur.rpo_min),
      compliance: args.compliance !== undefined ? str(args.compliance) : (cur.compliance || ''),
      note: args.note !== undefined ? str(args.note) : (cur.note || ''),
      updated_at: nowIso(),
      updated_by: str(args.updatedBy || args.agent || 'user'),
    }
    if (!['P0', 'P1', 'P2', 'P3'].includes(next.criticality)) throw new Error('criticality 只能是 P0/P1/P2/P3')
    db.prepare('INSERT INTO asset_profile (asset_id, owner, dept, business, env, criticality, data_class,'
      + ' users_count, rto_min, rpo_min, compliance, note, updated_at, updated_by)'
      + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
      + ' ON CONFLICT(asset_id) DO UPDATE SET owner=excluded.owner, dept=excluded.dept, business=excluded.business,'
      + ' env=excluded.env, criticality=excluded.criticality, data_class=excluded.data_class,'
      + ' users_count=excluded.users_count, rto_min=excluded.rto_min, rpo_min=excluded.rpo_min,'
      + ' compliance=excluded.compliance, note=excluded.note, updated_at=excluded.updated_at, updated_by=excluded.updated_by')
      .run(assetId, next.owner, next.dept, next.business, next.env, next.criticality, next.data_class,
        next.users_count, next.rto_min, next.rpo_min, next.compliance, next.note, next.updated_at, next.updated_by)
    return { assetId, profile: next }
  }

  /** 单条资产添加（工具用；批量走 importAssets）。 */
  addAsset(id, args = {}) {
    const db = this.db(id)
    const ip = str(args.ip)
    if (ip === '') throw new Error('ip 必填')
    const existing = db.prepare('SELECT id FROM asset WHERE ip = ?').get(ip)
    if (existing !== undefined) return { id: Number(existing.id), existed: true }
    const now = nowIso()
    const info = db.prepare('INSERT INTO asset (segment_cidr, ip, state, primary_name, first_seen, last_seen, discovered_at, scope) VALUES (?,?,?,?,?,?,?,?)')
      .run(cidrOf(ip), ip, 'live', str(args.name) || null, now, now, now, scopeOfIp(ip))
    const assetId = Number(info.lastInsertRowid)
    if (args.criticality || args.owner || args.business) {
      this.saveAssetProfile(id, { assetId, owner: args.owner, business: args.business, criticality: args.criticality, env: args.env })
    }
    return { id: assetId, existed: false }
  }

  resolveAssetId(id, args = {}) {
    const db = this.db(id)
    const raw = args.assetId ?? args.asset_id
    if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
      const hit = db.prepare('SELECT id FROM asset WHERE id = ?').get(num(raw))
      if (hit !== undefined) return Number(hit.id)
      throw new Error('资产不存在：' + raw)
    }
    const ip = str(args.ip)
    if (ip !== '') {
      const hit = db.prepare('SELECT id FROM asset WHERE ip = ?').get(ip)
      if (hit !== undefined) return Number(hit.id)
      throw new Error('资产不存在：' + ip + '（先 blueteam_asset_import 导入）')
    }
    throw new Error('请给 asset_id 或 ip')
  }

  listAssetRows(id, f = {}) {
    const db = this.db(id)
    const where = []
    const args = []
    if (f.criticality) { where.push("COALESCE(p.criticality, 'P2') = ?"); args.push(str(f.criticality)) }
    if (f.env) { where.push("COALESCE(p.env, 'prod') = ?"); args.push(str(f.env)) }
    if (f.owner) { where.push('p.owner = ?'); args.push(str(f.owner)) }
    if (f.q) {
      where.push('(a.ip LIKE ? OR a.primary_name LIKE ? OR p.business LIKE ? OR p.owner LIKE ?)')
      const q = '%' + str(f.q) + '%'
      args.push(q, q, q, q)
    }
    const limit = Math.min(num(f.limit, 300), 1000)
    const sql = 'SELECT a.id, a.ip, a.primary_name, a.segment_cidr, a.state,'
      + " COALESCE(a.scope, 'external') AS scope,"
      + ' p.owner, p.dept, p.business, p.env, p.criticality, p.data_class, p.users_count,'
      + " (SELECT COUNT(*) FROM exposure e WHERE e.asset_id = a.id AND e.status IN ('open','fixing')) AS open_exposures,"
      + " (SELECT COUNT(*) FROM alert al WHERE al.asset_id = a.id AND al.status IN ('new','triaging')) AS open_alerts"
      + ' FROM asset a LEFT JOIN asset_profile p ON p.asset_id = a.id '
      + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '')
      + " ORDER BY CASE COALESCE(p.criticality, 'P2') WHEN 'P0' THEN 0 WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 ELSE 3 END,"
      + ' open_exposures DESC, a.ip LIMIT ?'
    args.push(limit)
    return db.prepare(sql).all(...args)
  }

  /* ---------------- 暴露面 / 基线 ---------------- */

  addExposure(id, args = {}) {
    const db = this.db(id)
    const assetId = (args.assetId !== undefined || args.ip !== undefined) ? this.resolveAssetId(id, args) : null
    const kind = str(args.kind) || 'config'
    const title = str(args.title) || (kind + ' 缺口')
    const now = nowIso()
    const info = db.prepare('INSERT INTO exposure (asset_id, kind, port, title, detail, severity, status, source, found_at, due_at, ticket, updated_at)'
      + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(
      assetId, kind, args.port !== undefined ? num(args.port) : null, title, str(args.detail),
      str(args.severity) || 'medium', 'open', str(args.source) || 'manual', now,
      str(args.dueAt) || null, str(args.ticket) || null, now,
    )
    return { id: Number(info.lastInsertRowid), assetId, kind, severity: str(args.severity) || 'medium', title }
  }

  updateExposure(id, args = {}) {
    const db = this.db(id)
    const row = db.prepare('SELECT * FROM exposure WHERE id = ?').get(num(args.exposureId ?? args.id))
    if (row === undefined) throw new Error('暴露面不存在')
    const status = str(args.status) || row.status
    const allowed = ['open', 'fixing', 'fixed', 'accepted', 'false_positive']
    if (!allowed.includes(status)) throw new Error('status 只能是 ' + allowed.join('/'))
    if (status === 'fixed') {
      if (!str(args.verifiedBy)) throw new Error('标 fixed 必须给 verified_by（谁验证的）')
      if (!str(args.evidenceRef)) throw new Error('标 fixed 必须给 evidence_ref（验证证据）')
    }
    if (status === 'accepted') {
      if (!str(args.acceptedBy)) throw new Error('风险接受必须给 accepted_by')
      if (!str(args.acceptedUntil)) throw new Error('风险接受必须给 accepted_until（到期自动回 open）')
    }
    db.prepare('UPDATE exposure SET status=?, fixed_at=?, verified_by=?, accepted_by=?, accepted_until=?,'
      + ' evidence_ref=?, ticket=?, detail=COALESCE(?, detail), updated_at=? WHERE id=?').run(
      status,
      status === 'fixed' ? nowIso() : row.fixed_at,
      str(args.verifiedBy) || row.verified_by,
      str(args.acceptedBy) || row.accepted_by,
      str(args.acceptedUntil) || row.accepted_until,
      str(args.evidenceRef) || row.evidence_ref,
      args.ticket !== undefined ? str(args.ticket) : row.ticket,
      args.detail !== undefined ? str(args.detail) : null,
      nowIso(), row.id,
    )
    return { id: row.id, status }
  }

  listExposure(id, f = {}) {
    const db = this.db(id)
    const where = []
    const args = []
    if (f.status) {
      const list = String(f.status).split(',').map((x) => x.trim()).filter(Boolean)
      where.push('e.status IN (' + list.map(() => '?').join(',') + ')')
      args.push(...list)
    }
    if (f.severity) { where.push('e.severity = ?'); args.push(str(f.severity)) }
    if (f.assetId) { where.push('e.asset_id = ?'); args.push(num(f.assetId)) }
    const limit = Math.min(num(f.limit, 200), 1000)
    const sql = "SELECT e.*, a.ip, a.primary_name, COALESCE(p.criticality, 'P2') AS criticality"
      + ' FROM exposure e LEFT JOIN asset a ON a.id = e.asset_id'
      + ' LEFT JOIN asset_profile p ON p.asset_id = e.asset_id '
      + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '')
      + " ORDER BY CASE e.status WHEN 'open' THEN 0 WHEN 'fixing' THEN 1 WHEN 'accepted' THEN 2 ELSE 3 END,"
      + " CASE e.severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,"
      + ' e.found_at DESC LIMIT ?'
    args.push(limit)
    return db.prepare(sql).all(...args)
  }

  exposureSummary(id) {
    const db = this.db(id)
    const rows = db.prepare('SELECT status, severity, COUNT(*) AS n FROM exposure GROUP BY status, severity').all()
    const out = { open: 0, fixing: 0, fixed: 0, accepted: 0, false_positive: 0, bySeverity: {} }
    for (const r of rows) {
      out[r.status] = (out[r.status] || 0) + r.n
      if (r.status === 'open' || r.status === 'fixing') out.bySeverity[r.severity] = (out.bySeverity[r.severity] || 0) + r.n
    }
    return out
  }

  /** 记录一条基线核查；fail 自动生成暴露面（同一个分母，不重复记账）。 */
  baselineCheck(id, args = {}) {
    const db = this.db(id)
    const assetId = this.resolveAssetId(id, args)
    const category = str(args.category)
    const item = str(args.item)
    if (!category || !item) throw new Error('category 与 item 必填')
    const result = str(args.result) || 'unknown'
    if (!['pass', 'fail', 'unknown', 'na'].includes(result)) throw new Error('result 只能是 pass/fail/unknown/na')
    const now = nowIso()
    const info = db.prepare('INSERT INTO baseline_check (asset_id, category, item, expected, actual, result, severity, checked_at, checked_by, incident_id, note)'
      + ' VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(
      assetId, category, item, str(args.expected), str(args.actual), result,
      str(args.severity) || 'medium', now, str(args.by || args.agent || 'user'),
      args.incidentId !== undefined ? num(args.incidentId) : null, str(args.note),
    )
    let exposureId = null
    if (result === 'fail') {
      const existing = db.prepare("SELECT id FROM exposure WHERE asset_id = ? AND kind = ? AND title = ? AND status IN ('open','fixing')").get(assetId, category, item)
      exposureId = existing !== undefined ? Number(existing.id) : this.addExposure(id, {
        assetId, kind: category, title: item, detail: str(args.actual),
        severity: str(args.severity) || 'medium', source: 'baseline',
      }).id
    }
    return { id: Number(info.lastInsertRowid), assetId, result, exposureId }
  }

  baselineSummary(id) {
    const db = this.db(id)
    const rows = db.prepare('SELECT category, result, COUNT(*) AS n FROM baseline_check GROUP BY category, result').all()
    const out = { categories: {}, pass: 0, fail: 0, unknown: 0, total: 0 }
    for (const r of rows) {
      if (!out.categories[r.category]) out.categories[r.category] = { pass: 0, fail: 0, unknown: 0 }
      out.categories[r.category][r.result] = (out.categories[r.category][r.result] || 0) + r.n
      out[r.result] = (out[r.result] || 0) + r.n
      out.total += r.n
    }
    return out
  }

  /* ---------------- 检测 ---------------- */

  addLogSource(id, args = {}) {
    const db = this.db(id)
    const info = db.prepare('INSERT INTO log_source (kind, product, endpoint, owner, scope, assets_count, status, retention_days, latency_s, last_event_at, note, updated_at)'
      + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(
      str(args.kind) || 'host', str(args.product), str(args.endpoint), str(args.owner), str(args.scope),
      args.assetsCount !== undefined ? num(args.assetsCount) : null, str(args.status) || 'planned',
      args.retentionDays !== undefined ? num(args.retentionDays) : null,
      args.latencyS !== undefined ? num(args.latencyS) : null,
      str(args.lastEventAt) || null, str(args.note), nowIso(),
    )
    return { id: Number(info.lastInsertRowid) }
  }

  listLogSources(id) {
    return this.db(id).prepare("SELECT * FROM log_source ORDER BY CASE status WHEN 'connected' THEN 0 WHEN 'degraded' THEN 1 WHEN 'planned' THEN 2 ELSE 3 END, id").all()
  }

  addDetection(id, args = {}) {
    const db = this.db(id)
    const code = str(args.code)
    const name = str(args.name)
    if (!code || !name) throw new Error('code 与 name 必填')
    const now = nowIso()
    const existing = db.prepare('SELECT id FROM detection_rule WHERE code = ?').get(code)
    if (existing !== undefined) {
      db.prepare('UPDATE detection_rule SET name=?, ttp=?, tactic=?, source_id=?, product=?, scope=?, severity=?,'
        + ' logic=?, content_path=?, status=?, updated_at=? WHERE code=?').run(
        name, str(args.ttp), str(args.tactic),
        args.sourceId !== undefined ? num(args.sourceId) : null,
        str(args.product), str(args.scope), str(args.severity) || 'medium',
        str(args.logic), str(args.contentPath), str(args.status) || 'draft', now, code,
      )
      return { id: Number(existing.id), updated: true }
    }
    const info = db.prepare('INSERT INTO detection_rule (code, name, ttp, tactic, source_id, product, scope, severity, logic, content_path, status, created_at, created_by, updated_at)'
      + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
      code, name, str(args.ttp), str(args.tactic),
      args.sourceId !== undefined ? num(args.sourceId) : null,
      str(args.product), str(args.scope), str(args.severity) || 'medium',
      str(args.logic), str(args.contentPath), str(args.status) || 'draft', now,
      str(args.by || args.agent || 'user'), now,
    )
    return { id: Number(info.lastInsertRowid), created: true }
  }

  verifyDetection(id, args = {}) {
    const db = this.db(id)
    const row = db.prepare('SELECT * FROM detection_rule WHERE id = ?').get(num(args.ruleId ?? args.id))
    if (row === undefined) throw new Error('规则不存在')
    if (!str(args.evidence)) throw new Error('验证必须给 evidence（样本/回放结果）')
    const fpRate = args.fpRate !== undefined ? num(args.fpRate) : nz(row.fp_rate)
    const status = str(args.status) || 'active'
    db.prepare('UPDATE detection_rule SET verified=1, verified_note=?, fp_rate=?, last_verified_at=?, status=?, updated_at=? WHERE id=?')
      .run(str(args.evidence), fpRate, nowIso(), status, nowIso(), row.id)
    return { id: row.id, status, fpRate }
  }

  listDetections(id, f = {}) {
    const db = this.db(id)
    const where = []
    const args = []
    if (f.status) { where.push('status = ?'); args.push(str(f.status)) }
    if (f.ttp) { where.push('ttp = ?'); args.push(str(f.ttp)) }
    return db.prepare('SELECT * FROM detection_rule ' + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '')
      + "ORDER BY CASE status WHEN 'active' THEN 0 WHEN 'testing' THEN 1 WHEN 'draft' THEN 2 ELSE 3 END, code").all(...args)
  }

  /** 覆盖矩阵：critical TTP × 有无日志源/规则 → covered / gap / blind。 */
  coverage(id) {
    const db = this.db(id)
    const rules = db.prepare('SELECT ttp, source_id, status FROM detection_rule').all()
    const sources = db.prepare('SELECT id, status FROM log_source').all()
    const connected = new Set(sources.filter((s) => s.status === 'connected' || s.status === 'degraded').map((s) => Number(s.id)))
    const activeByTtp = new Map()
    for (const r of rules) {
      if (r.status !== 'active' || !r.ttp) continue
      const cur = activeByTtp.get(r.ttp) || { rules: 0, withSource: 0 }
      cur.rules += 1
      if (r.source_id !== null && connected.has(Number(r.source_id))) cur.withSource += 1
      activeByTtp.set(r.ttp, cur)
    }
    const items = CRITICAL_TTPS.map((ttp) => {
      const hit = activeByTtp.get(ttp)
      const state = (hit !== undefined && hit.withSource > 0) ? 'covered' : (connected.size > 0 ? 'gap' : 'blind')
      return { ttp, state, rules: hit !== undefined ? hit.rules : 0 }
    })
    return {
      items,
      covered: items.filter((x) => x.state === 'covered').length,
      gap: items.filter((x) => x.state === 'gap').length,
      blind: items.filter((x) => x.state === 'blind').length,
      total: items.length,
      sources: { total: sources.length, connected: connected.size },
    }
  }

  /* ---------------- 告警 ---------------- */

  /** 白名单 / 变更窗口命中 → 抑制（不占 SLA、不计误报）。 */
  suppressedBy(id, row) {
    const db = this.db(id)
    const now = nowIso()
    const wl = db.prepare("SELECT value, value_kind FROM watchlist WHERE kind='white' AND active=1 AND (expires_at IS NULL OR expires_at > ?)").all(now)
    const target = String(row.entity_id || '')
    if (target !== '') {
      for (const w of wl) {
        const v = String(w.value)
        if (w.value_kind === 'regex') {
          try { if (new RegExp(v).test(target)) return 'whitelist' } catch { /* 非法正则忽略 */ }
        } else if (target === v) {
          return 'whitelist'
        } else if (w.value_kind === 'cidr' && v.includes('/')) {
          const prefix = v.split('/')[0].split('.').slice(0, 3).join('.')
          if (target.startsWith(prefix + '.')) return 'whitelist'
        }
      }
    }
    return null
  }

  /**
   * 告警接入。四闸顺序：白名单 → 变更窗口 → 去重窗口 → 风暴折叠。
   * @returns { inserted, merged, suppressed, stormed, ids }
   */
  ingestAlerts(id, rows = [], opts = {}) {
    const db = this.db(id)
    const meta = metaOf(this, id)
    const profile = SLA_PROFILES[meta.sla_profile] || SLA_PROFILES.standard
    const windowS = num(opts.windowS, 600)
    const stormThreshold = num(opts.stormThreshold, 100)
    const out = { inserted: 0, merged: 0, suppressed: 0, stormed: 0, ids: [] }
    const now = nowIso()
    for (const raw of rows) {
      const row = raw && typeof raw === 'object' ? raw : {}
      const severity = BLUE_SEVERITIES.includes(str(row.severity)) ? str(row.severity) : 'P3'
      const firstSeen = str(row.first_seen || row.time) || now
      const entityKind = str(row.entity_kind) || 'ip'
      const entityId = str(row.entity_id || row.entity || row.src_ip)
      const key = sha([str(row.source), str(row.rule_code || row.rule), entityKind, entityId].join('|'))
      let assetId = null
      if (row.asset_id !== undefined) assetId = num(row.asset_id)
      else if (entityId !== '') {
        const hit = db.prepare('SELECT id FROM asset WHERE ip = ? OR primary_name = ?').get(entityId, entityId)
        if (hit !== undefined) assetId = Number(hit.id)
      }
      const suppress = this.suppressedBy(id, { asset_id: assetId, entity_id: entityId })
      if (suppress !== null) {
        const info = db.prepare('INSERT INTO alert (source, rule_code, rule_name, severity, title, entity_kind, entity_id, entity_label,'
          + ' asset_id, first_seen, last_seen, count, status, ttp, confidence, dedup_key, raw_ref, ingested_at, tz)'
          + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
          str(row.source) || 'manual', str(row.rule_code || row.rule), str(row.rule_name),
          severity, str(row.title) || (suppress === 'whitelist' ? '白名单命中（已抑制）' : '变更窗口内（已抑制）'),
          entityKind, entityId, str(row.entity_label), assetId, firstSeen, firstSeen, num(row.count, 1),
          'suppressed', str(row.ttp), argsToNum(row.confidence), key, str(row.raw_ref), now, str(row.tz) || meta.tz || 'Asia/Shanghai',
        )
        out.suppressed += 1
        out.ids.push(Number(info.lastInsertRowid))
        continue
      }
      const dup = db.prepare('SELECT * FROM alert WHERE dedup_key = ? AND last_seen >= ? ORDER BY id DESC LIMIT 1')
        .get(key, new Date(Date.now() - windowS * 1000).toISOString())
      if (dup !== undefined) {
        const nextCount = Number(dup.count) + num(row.count, 1)
        db.prepare('UPDATE alert SET last_seen = ?, count = ? WHERE id = ?')
          .run(firstSeen > dup.last_seen ? firstSeen : dup.last_seen, nextCount, dup.id)
        out.merged += 1
        out.ids.push(Number(dup.id))
        if (nextCount >= stormThreshold && dup.escalated_at === null) {
          db.prepare('UPDATE alert SET escalated_at = ? WHERE id = ?').run(now, dup.id)
          db.prepare('INSERT INTO alert (source, rule_code, rule_name, severity, title, entity_kind, entity_id, count, status, dedup_key, ingested_at, tz)'
            + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(
            'storm', str(row.rule_code || row.rule), str(row.rule_name), 'P2',
            '告警风暴：' + (str(row.rule_name) || str(row.rule_code) || '未知规则') + ' 10 分钟内超过 ' + stormThreshold + ' 条',
            'rule', str(row.rule_code), nextCount, 'new', 'storm:' + key, now, str(row.tz) || meta.tz || 'Asia/Shanghai',
          )
          out.stormed += 1
        }
        continue
      }
      const slaDue = plusMinutes(firstSeen, profile.triage[severity] || 60)
      const info = db.prepare('INSERT INTO alert (source, rule_code, rule_name, severity, title, entity_kind, entity_id, entity_label,'
        + ' asset_id, first_seen, last_seen, count, status, ttp, confidence, dedup_key, raw_ref, ingested_at, clock_skew_ms, sla_due_at, tz)'
        + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
        str(row.source) || 'manual', str(row.rule_code || row.rule), str(row.rule_name),
        severity, str(row.title) || '未命名告警', entityKind, entityId, str(row.entity_label),
        assetId, firstSeen, firstSeen, num(row.count, 1), 'new', str(row.ttp),
        argsToNum(row.confidence), key, str(row.raw_ref), now,
        (Date.parse(now) - Date.parse(firstSeen)) || 0, slaDue, str(row.tz) || meta.tz || 'Asia/Shanghai',
      )
      out.inserted += 1
      out.ids.push(Number(info.lastInsertRowid))
      db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('alert', String(info.lastInsertRowid), now)
    }
    return out
  }

  /** 告警队列（keyset 分页，禁止全量）。 */
  listAlerts(id, f = {}) {
    const db = this.db(id)
    const where = []
    const args = []
    if (f.status) {
      const list = String(f.status).split(',').map((x) => x.trim()).filter(Boolean)
      where.push('al.status IN (' + list.map(() => '?').join(',') + ')')
      args.push(...list)
    }
    if (f.severity) {
      const list = String(f.severity).split(',').map((x) => x.trim()).filter(Boolean)
      where.push('al.severity IN (' + list.map(() => '?').join(',') + ')')
      args.push(...list)
    }
    if (f.since) { where.push('al.first_seen >= ?'); args.push(str(f.since)) }
    if (f.incidentId) { where.push('al.incident_id = ?'); args.push(num(f.incidentId)) }
    if (f.entity) { where.push('al.entity_id = ?'); args.push(str(f.entity)) }
    if (f.q) {
      where.push('(al.title LIKE ? OR al.rule_name LIKE ? OR al.entity_id LIKE ? OR al.entity_label LIKE ?)')
      const q = '%' + str(f.q) + '%'
      args.push(q, q, q, q)
    }
    if (f.before) {
      const parts = String(f.before).split('|')
      where.push('(al.first_seen < ? OR (al.first_seen = ? AND al.id < ?))')
      args.push(parts[0], parts[0], num(parts[1]))
    }
    const limit = Math.min(num(f.limit, 50), 500)
    const sql = 'SELECT al.*, a.ip AS asset_ip, COALESCE(p.criticality, \'P2\') AS criticality,'
      + " COALESCE(p.business, '') AS business"
      + ' FROM alert al LEFT JOIN asset a ON a.id = al.asset_id'
      + ' LEFT JOIN asset_profile p ON p.asset_id = al.asset_id '
      + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '')
      + ' ORDER BY al.first_seen DESC, al.id DESC LIMIT ?'
    args.push(limit + 1)
    const rows = db.prepare(sql).all(...args)
    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows
    const last = items[items.length - 1]
    return { items, next: (hasMore && last !== undefined) ? (last.first_seen + '|' + last.id) : null, counts: this.alertCounts(id) }
  }

  alertCounts(id) {
    const db = this.db(id)
    const byStatus = Object.fromEntries(db.prepare('SELECT status AS k, COUNT(*) AS n FROM alert GROUP BY status').all().map((r) => [r.k, r.n]))
    const bySeverity = Object.fromEntries(db.prepare('SELECT severity AS k, COUNT(*) AS n FROM alert GROUP BY severity').all().map((r) => [r.k, r.n]))
    const overdue = db.prepare("SELECT COUNT(*) AS n FROM alert WHERE status IN ('new','triaging') AND sla_due_at IS NOT NULL AND sla_due_at < ?").get(nowIso()).n
    return { byStatus, bySeverity, overdue: Number(overdue) || 0 }
  }

  /** 研判。守卫：confirmed 必须挂事件；false_positive 必须给原因；duplicate 必须给 dup_of。 */
  triageAlert(id, args = {}) {
    const db = this.db(id)
    const alertId = num(args.alertId ?? args.id)
    const row = db.prepare('SELECT * FROM alert WHERE id = ?').get(alertId)
    if (row === undefined) throw new Error('告警不存在：' + alertId)
    const verdict = str(args.verdict)
    const status = TRIAGE_VERDICTS[verdict]
    if (!status) throw new Error('verdict 只能是 ' + Object.keys(TRIAGE_VERDICTS).join('/'))
    if (status === 'false_positive' && !FP_CAUSES.includes(str(args.cause))) {
      throw new Error('判假必须给 cause：' + FP_CAUSES.join('/'))
    }
    if (status === 'duplicate' && (args.dupOf === undefined || args.dupOf === null)) {
      throw new Error('判重复必须给 dup_of（原告警 id）')
    }
    if (status === 'confirmed' && (args.incidentId === undefined || args.incidentId === null)) {
      throw new Error('确认真警必须挂事件：先 blueteam_incident_open，再带 incident_id 研判')
    }
    const now = nowIso()
    const note = (str(args.note) + (status === 'false_positive' ? ' [cause=' + str(args.cause) + ']' : '')).trim()
    db.prepare('UPDATE alert SET status=?, conclusion=?, triage_note=?, assignee=COALESCE(?, assignee),'
      + ' acked_at=COALESCE(acked_at, ?), incident_id=COALESCE(?, incident_id), dup_of=? WHERE id=?').run(
      status, str(args.conclusion) || str(args.verdict), note, str(args.assignee) || null, now,
      args.incidentId !== undefined ? num(args.incidentId) : null,
      args.dupOf !== undefined ? num(args.dupOf) : null, alertId,
    )
    if (status === 'confirmed' && args.incidentId !== undefined && args.incidentId !== null) {
      const inc = db.prepare('SELECT id, detected_at, triaged_at FROM incident WHERE id = ?').get(num(args.incidentId))
      if (inc !== undefined) {
        const detected = (inc.detected_at && inc.detected_at < row.first_seen) ? inc.detected_at : row.first_seen
        db.prepare('UPDATE incident SET detected_at = ?, triaged_at = COALESCE(triaged_at, ?) WHERE id = ?').run(detected, now, inc.id)
        db.prepare('INSERT INTO incident_timeline (incident_id, at, kind, actor, role, text, ref_kind, ref_id) VALUES (?,?,?,?,?,?,?,?)')
          .run(inc.id, now, 'triage', str(args.assignee || 'triage'), 'triage', '确认真警（告警 #' + alertId + '）', 'alert', alertId)
      }
    }
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('alert:triage', String(alertId), now)
    return { id: alertId, status }
  }

  bulkTriage(id, args = {}) {
    const ids = Array.isArray(args.alertIds) ? args.alertIds : []
    const done = []
    const failed = []
    for (const alertId of ids) {
      try {
        this.triageAlert(id, { ...args, alertId })
        done.push(num(alertId))
      } catch (error) {
        failed.push({ id: num(alertId), error: error && error.message ? error.message : String(error) })
      }
    }
    return { done, failed }
  }

  suppressAlert(id, args = {}) {
    const db = this.db(id)
    const alertId = num(args.alertId ?? args.id)
    if (!str(args.reason)) throw new Error('抑制必须给 reason')
    const until = str(args.until) || plusMinutes(nowIso(), 60)
    db.prepare('UPDATE alert SET status=?, suppressed_until=?, triage_note=? WHERE id=?')
      .run('suppressed', until, '抑制：' + str(args.reason) + '（至 ' + until + '）', alertId)
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('alert:suppress', String(alertId), nowIso())
    return { id: alertId, until }
  }

  /* ---------------- 事件 ---------------- */

  openIncident(id, args = {}) {
    const db = this.db(id)
    const alertIds = Array.isArray(args.alertIds) ? args.alertIds.map(num).filter((x) => x > 0) : []
    const severity = BLUE_SEVERITIES.includes(str(args.severity)) ? str(args.severity) : 'P2'
    const first = alertIds.length > 0
      ? db.prepare('SELECT MIN(first_seen) AS t FROM alert WHERE id IN (' + alertIds.map(() => '?').join(',') + ')').get(...alertIds)?.t
      : null
    const now = nowIso()
    const detected = str(args.detectedAt) || first || now
    const info = db.prepare('INSERT INTO incident (title, severity, category, status, detected_at, owner, commander, summary, sla_due_at)'
      + ' VALUES (?,?,?,?,?,?,?,?,?)').run(
      str(args.title) || '未命名事件', severity, str(args.category) || 'other', 'open', detected,
      str(args.owner), str(args.commander), str(args.summary), null,
    )
    const incidentId = Number(info.lastInsertRowid)
    for (const alertId of alertIds) {
      db.prepare("UPDATE alert SET incident_id = ?, status = CASE WHEN status IN ('false_positive','duplicate') THEN status ELSE 'confirmed' END WHERE id = ?")
        .run(incidentId, alertId)
    }
    db.prepare('INSERT INTO incident_timeline (incident_id, at, kind, actor, role, text) VALUES (?,?,?,?,?,?)')
      .run(incidentId, now, 'detect', str(args.by || 'triage'), 'triage', '事件建立（' + severity + '，关联告警 ' + alertIds.length + ' 条）')
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('incident', String(incidentId), now)
    return { id: incidentId, severity, detected_at: detected, alertIds }
  }

  /** 推进事件状态：只能前进；contained 需已验证动作；closed 时 P0/P1 需复盘材料。 */
  updateIncident(id, args = {}) {
    const db = this.db(id)
    const incidentId = num(args.incidentId ?? args.id)
    const row = db.prepare('SELECT * FROM incident WHERE id = ?').get(incidentId)
    if (row === undefined) throw new Error('事件不存在：' + incidentId)
    const now = nowIso()
    const patch = {}
    const status = str(args.status)
    if (status !== '') {
      if (!(status in INCIDENT_ORDER)) throw new Error('status 只能是 ' + Object.keys(INCIDENT_ORDER).join('/'))
      if (INCIDENT_ORDER[status] < INCIDENT_ORDER[row.status]) throw new Error('事件状态不能回退：' + row.status + ' → ' + status)
      if (status === 'contained') {
        const verified = db.prepare('SELECT COUNT(*) AS n FROM response_action WHERE incident_id = ? AND verify_at IS NOT NULL').get(incidentId).n
        if (Number(verified) === 0) throw new Error('进入 contained 前必须有一条已执行并已验证的处置动作')
      }
      if (status === 'closed') {
        const postmortem = str(args.postmortemRef) || str(row.postmortem_ref)
        const summary = str(args.summary) || str(row.summary)
        if ((row.severity === 'P0' || row.severity === 'P1') && postmortem === '' && summary === '') {
          throw new Error('P0/P1 关闭必须给 postmortem_ref 或 summary（复盘结论）')
        }
        patch.closed_at = row.closed_at || now
      }
      const col = { contained: 'contained_at', eradicated: 'eradicated_at', recovered: 'recovered_at' }[status]
      if (col !== undefined) {
        if (row[col]) throw new Error('时间戳已存在，不允许改写：' + col)
        patch[col] = now
      }
      patch.status = status
      const kind = status === 'contained' ? 'contain' : status === 'eradicated' ? 'eradicate' : status === 'recovered' ? 'recover' : status
      db.prepare('INSERT INTO incident_timeline (incident_id, at, kind, actor, role, text) VALUES (?,?,?,?,?,?)')
        .run(incidentId, now, kind, str(args.by || 'responder'), 'responder', str(args.note) || ('状态 → ' + status))
    }
    for (const key of ['summary', 'root_cause', 'impact', 'postmortem_ref', 'owner', 'commander']) {
      if (args[key] !== undefined) patch[key] = str(args[key])
    }
    const sets = Object.keys(patch).map((k) => k + ' = ?')
    if (sets.length > 0) db.prepare('UPDATE incident SET ' + sets.join(', ') + ' WHERE id = ?').run(...Object.values(patch), incidentId)
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('incident:' + (status || 'update'), String(incidentId), now)
    return { id: incidentId, status: patch.status || row.status }
  }

  listIncidents(id, f = {}) {
    const db = this.db(id)
    const where = []
    const args = []
    if (f.status) {
      const list = String(f.status).split(',').map((x) => x.trim()).filter(Boolean)
      where.push('i.status IN (' + list.map(() => '?').join(',') + ')')
      args.push(...list)
    }
    if (f.severity) { where.push('i.severity = ?'); args.push(str(f.severity)) }
    const limit = Math.min(num(f.limit, 100), 500)
    const sql = 'SELECT i.*, (SELECT COUNT(*) FROM alert a WHERE a.incident_id = i.id) AS alert_count'
      + ' FROM incident i '
      + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '')
      + " ORDER BY CASE i.status WHEN 'open' THEN 0 WHEN 'contained' THEN 1 WHEN 'eradicated' THEN 2 WHEN 'recovered' THEN 3 ELSE 4 END,"
      + " CASE i.severity WHEN 'P0' THEN 0 WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 ELSE 3 END, i.detected_at DESC LIMIT ?"
    args.push(limit)
    return db.prepare(sql).all(...args)
  }

  getIncident(id, incidentId) {
    const db = this.db(id)
    const incident = db.prepare('SELECT * FROM incident WHERE id = ?').get(num(incidentId))
    if (incident === undefined) throw new Error('事件不存在')
    return {
      incident,
      timeline: db.prepare('SELECT * FROM incident_timeline WHERE incident_id = ? ORDER BY at, id').all(incident.id),
      alerts: db.prepare('SELECT id, severity, title, status, entity_id, first_seen FROM alert WHERE incident_id = ? ORDER BY first_seen').all(incident.id),
      actions: db.prepare('SELECT * FROM response_action WHERE incident_id = ? ORDER BY id').all(incident.id),
    }
  }

  addIncidentNote(id, args = {}) {
    const db = this.db(id)
    const incidentId = num(args.incidentId ?? args.id)
    db.prepare('INSERT INTO incident_timeline (incident_id, at, kind, actor, role, text, ref_kind, ref_id) VALUES (?,?,?,?,?,?,?,?)')
      .run(incidentId, nowIso(), str(args.kind) || 'note', str(args.by || 'user'), str(args.role || 'user'),
        str(args.text), str(args.refKind) || null, args.refId !== undefined ? num(args.refId) : null)
    return { incidentId }
  }

  /* ---------------- 处置动作 ---------------- */

  proposeAction(id, args = {}) {
    const db = this.db(id)
    const kind = str(args.kind)
    const risk = ACTION_RISK[kind]
    if (risk === undefined) throw new Error('未知动作：' + kind + '（可用：' + Object.keys(ACTION_RISK).join('/') + '）')
    const impact = str(args.impact)
    const rollback = str(args.rollbackPlan ?? args.rollback)
    if (NEEDS_PLAN.has(risk) && (impact === '' || rollback === '')) {
      throw new Error(risk + ' 风险动作必须给 impact 与 rollback_plan（影响面 + 回滚方案）')
    }
    if (!str(args.target)) throw new Error('必须给 target（封谁 / 隔离谁 / 改谁的密）')
    const approval = (risk === 'low' || risk === 'mid') ? 'auto' : 'requested'
    const now = nowIso()
    const info = db.prepare('INSERT INTO response_action (incident_id, kind, target_kind, target, direction, scope,'
      + ' impact, blast_radius, rollback_plan, risk, approval_status, requestor, created_at, operator)'
      + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
      args.incidentId !== undefined ? num(args.incidentId) : null, kind, str(args.targetKind) || 'ip',
      str(args.target), str(args.direction), str(args.scope), impact, str(args.blastRadius),
      rollback, risk, approval, str(args.requestor || args.agent || 'responder'), now, str(args.operator || args.agent || 'responder'),
    )
    const actionId = Number(info.lastInsertRowid)
    if (args.incidentId !== undefined) {
      db.prepare('INSERT INTO incident_timeline (incident_id, at, kind, actor, role, text, ref_kind, ref_id) VALUES (?,?,?,?,?,?,?,?)')
        .run(num(args.incidentId), now, 'action', str(args.agent || 'responder'), 'responder',
          '提出处置：' + kind + ' → ' + str(args.target) + '（risk=' + risk + (approval === 'requested' ? '，待审批' : '') + '）', 'action', actionId)
    }
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('action:propose', String(actionId), now)
    return { id: actionId, risk, approval_status: approval, needsApproval: approval === 'requested' }
  }

  /** 审批（只由面板调用，工具层不暴露）。 */
  approveAction(id, args = {}) {
    const db = this.db(id)
    const actionId = num(args.actionId ?? args.id)
    const row = db.prepare('SELECT * FROM response_action WHERE id = ?').get(actionId)
    if (row === undefined) throw new Error('动作不存在')
    const approve = args.approve !== false
    if (!str(args.approver)) throw new Error('审批必须记录 approver')
    db.prepare('UPDATE response_action SET approval_status=?, approver=?, approved_at=? WHERE id=?')
      .run(approve ? 'approved' : 'rejected', str(args.approver), nowIso(), actionId)
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('action:' + (approve ? 'approve' : 'reject'), String(actionId), nowIso())
    return { id: actionId, approval_status: approve ? 'approved' : 'rejected' }
  }

  /** 执行。高危必须先批准；emergency 只由面板传（先斩后奏，必须写理由）。 */
  executeAction(id, args = {}) {
    const db = this.db(id)
    const actionId = num(args.actionId ?? args.id)
    const row = db.prepare('SELECT * FROM response_action WHERE id = ?').get(actionId)
    if (row === undefined) throw new Error('动作不存在')
    if (row.executed_at) throw new Error('动作已执行过（执行不可重复，回滚请用 rollback）')
    const emergency = args.emergency === true
    if (row.approval_status === 'rejected') throw new Error('该动作已被拒绝，不能执行')
    if (row.approval_status === 'requested' && !emergency) {
      throw new Error('高危动作待审批：请在面板「事件处置」里批准，或走 emergency（先斩后奏，必须写 justification）')
    }
    if (emergency && !str(args.justification)) throw new Error('emergency 执行必须写 justification（为什么等不了审批）')
    const now = nowIso()
    db.prepare('UPDATE response_action SET executed_at=?, result=?, emergency=?, justification=?, cool_down_until=?, operator=COALESCE(?, operator) WHERE id=?')
      .run(now, 'pending', emergency ? 1 : 0, str(args.justification), plusMinutes(now, 30), str(args.operator) || null, actionId)
    if (row.incident_id) {
      db.prepare('INSERT INTO incident_timeline (incident_id, at, kind, actor, role, text, ref_kind, ref_id) VALUES (?,?,?,?,?,?,?,?)')
        .run(row.incident_id, now, 'action', str(args.operator || 'responder'), 'responder',
          '执行处置：' + row.kind + ' → ' + row.target + (emergency ? '（emergency）' : ''), 'action', actionId)
    }
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('action:execute', String(actionId), now)
    return { id: actionId, executed_at: now, cool_down_until: plusMinutes(now, 30) }
  }

  verifyAction(id, args = {}) {
    const db = this.db(id)
    const actionId = num(args.actionId ?? args.id)
    const row = db.prepare('SELECT * FROM response_action WHERE id = ?').get(actionId)
    if (row === undefined) throw new Error('动作不存在')
    if (!row.executed_at) throw new Error('动作还没执行，不能验证')
    if (!str(args.evidence)) throw new Error('验证必须给 evidence（前后对比 / 状态截图 / 命令回显）')
    const result = str(args.result) || 'success'
    db.prepare('UPDATE response_action SET verify_at=?, verify_evidence_ref=?, result=? WHERE id=?')
      .run(nowIso(), str(args.evidence), result, actionId)
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('action:verify', String(actionId), nowIso())
    return { id: actionId, result }
  }

  rollbackAction(id, args = {}) {
    const db = this.db(id)
    const actionId = num(args.actionId ?? args.id)
    db.prepare('UPDATE response_action SET rolled_back_at=?, rollback_result=? WHERE id=?')
      .run(nowIso(), str(args.note) || 'rolled back', actionId)
    db.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('action:rollback', String(actionId), nowIso())
    return { id: actionId }
  }

  listActions(id, f = {}) {
    const db = this.db(id)
    const where = []
    const args = []
    if (f.incidentId) { where.push('incident_id = ?'); args.push(num(f.incidentId)) }
    if (f.pending) where.push("approval_status = 'requested'")
    if (f.unverified) where.push('executed_at IS NOT NULL AND verify_at IS NULL AND rolled_back_at IS NULL')
    const limit = Math.min(num(f.limit, 100), 500)
    const sql = 'SELECT * FROM response_action '
      + (where.length ? 'WHERE ' + where.join(' AND ') + ' ' : '')
      + " ORDER BY CASE approval_status WHEN 'requested' THEN 0 ELSE 1 END, id DESC LIMIT ?"
    args.push(limit)
    return db.prepare(sql).all(...args)
  }

  /* ---------------- 名单 / 变更 ---------------- */

  addWatchlist(id, args = {}) {
    const db = this.db(id)
    const kind = str(args.kind)
    if (!['asset', 'white', 'black', 'profile', 'change'].includes(kind)) throw new Error('kind 只能是 asset/white/black/profile/change')
    const value = str(args.value)
    if (value === '') throw new Error('value 必填')
    db.prepare('INSERT INTO watchlist (kind, value, value_kind, label, source, severity, expires_at, note, active, created_by, created_at)'
      + ' VALUES (?,?,?,?,?,?,?,?,?,?,?)'
      + ' ON CONFLICT(kind, value) DO UPDATE SET label=excluded.label, expires_at=excluded.expires_at, note=excluded.note, active=1').run(
      kind, value, str(args.valueKind) || 'ip', str(args.label), str(args.source), str(args.severity),
      str(args.expiresAt) || null, str(args.note), 1, str(args.by || 'user'), nowIso(),
    )
    return { kind, value }
  }

  listWatchlist(id, kind) {
    const db = this.db(id)
    const now = nowIso()
    return db.prepare("SELECT *, CASE WHEN expires_at IS NOT NULL AND expires_at < ? THEN 'stale' ELSE 'active' END AS state FROM watchlist "
      + (kind ? 'WHERE kind = ? ' : '')
      + 'ORDER BY kind, id DESC').all(...(kind ? [now, str(kind)] : [now]))
  }

  /* ---------------- 报告 ---------------- */

  blueReport(id, kind = 'technical') {
    const meta = this.projectMeta(id)
    const digest = this.blueDigest(id)
    const cov = this.coverage(id)
    const rows = this.db(id).prepare('SELECT * FROM incident ORDER BY detected_at DESC LIMIT 50').all()
    const lines = []
    lines.push('# 蓝队' + (kind === 'management' ? '防守态势报告' : '值守复盘报告') + ' · ' + meta.name)
    lines.push('')
    lines.push('- 项目：' + meta.name + '（' + meta.mode + ' / SLA ' + meta.sla_profile + ' / ' + meta.tz + '）')
    lines.push('- 责任范围：' + (meta.scope.length > 0 ? meta.scope.join(', ') : '未填写'))
    lines.push('- 生成时间：' + nowIso())
    lines.push('')
    lines.push('## 一、态势')
    lines.push('- 告警 ' + digest.alerts.total + ' 条（未研判 ' + digest.alerts.unhandled + '，超时 ' + digest.alerts.overdue + '，P0 ' + digest.alerts.p0 + '）')
    lines.push('- 事件 ' + digest.incidents.open + ' 起在处置；误报率 ' + digest.alerts.fpRate + '%')
    lines.push('- 暴露面：未收敛 ' + digest.exposures.open + '；检测覆盖 ' + cov.covered + '/' + cov.total + '（盲区 ' + cov.blind + '）')
    lines.push('- 时效：MTTD ' + (digest.metrics.mttd === null ? '—' : digest.metrics.mttd + ' 分钟') + ' / MTTR ' + (digest.metrics.mttr === null ? '—' : digest.metrics.mttr + ' 分钟'))
    lines.push('')
    lines.push('## 二、事件清单')
    if (rows.length === 0) lines.push('（本次无事件）')
    for (const it of rows) {
      lines.push('- #' + it.id + ' [' + it.severity + '] ' + it.title + ' — ' + it.status
        + '｜发现 ' + (it.detected_at || '—') + '｜止血 ' + (it.contained_at || '—'))
    }
    lines.push('')
    lines.push('## 三、整改建议')
    const advice = []
    if (cov.blind > 0) advice.push('补数据源：' + cov.blind + ' 个关键 TTP 处于无日志状态')
    if (cov.gap > 0) advice.push('补规则：' + cov.gap + ' 个 TTP 有日志但无规则')
    if (digest.exposures.open > 0) advice.push('收敛暴露面：' + digest.exposures.open + ' 项待处理')
    if (digest.alerts.fpRate > 10) advice.push('规则调优：误报率 ' + digest.alerts.fpRate + '% 偏高')
    if (advice.length === 0) advice.push('保持当前基线，进入下一周期观察')
    for (const a of advice) lines.push('- ' + a)
    return lines.join('\n')
  }

  /* ---------------- 对账（只读红队库） ---------------- */

  /**
   * 红蓝对账：对每个红队动作，看蓝队有没有在时间窗内记录到对应告警。
   * 红队库以 readOnly 打开；结果落 reconcile / reconcile_item。
   */
  runReconcile(args = {}) {
    const blueId = str(args.blueEngagement || args.engagement) || this.listEngagements()[0]?.id
    if (!blueId) throw new Error('没有可对账的蓝队项目')
    const redRoot = str(args.redRoot) || join(homedir(), '.dsh', 'redteam')
    const redId = str(args.redEngagement)
    if (!redId) throw new Error('对账需要 red_engagement（红队项目 id）')
    const redMeta = readEngagementMeta(join(redRoot, 'engagements', redId, 'engagement.yaml')) || {}
    const redDbPath = join(redMeta.data_dir || join(redRoot, 'engagements', redId), 'assets.db')
    if (!existsSync(redDbPath)) throw new Error('红队库不存在：' + redDbPath)
    const windowMin = num(args.windowMin, 15)
    const red = new DatabaseSync(redDbPath, { readOnly: true })
    let steps = []
    try {
      steps = red.prepare('SELECT s.id, s.seq, s.title, s.recorded_at, s.stage, s.tool, a.ip AS asset_ip'
        + ' FROM attack_step s LEFT JOIN asset a ON a.id = s.asset_id ORDER BY s.recorded_at, s.id').all()
    } finally {
      try { red.close() } catch { /* 忽略 */ }
    }
    const db2 = this.db(blueId)
    const items = []
    let matched = 0
    let late = 0
    let missed = 0
    let unverifiable = 0
    for (const step of steps) {
      const at = str(step.recorded_at)
      const ip = str(step.asset_ip)
      if (at === '' || ip === '') {
        items.push({ verdict: 'unverifiable', red_step_id: step.id, red_at: at || null, red_title: step.title, red_asset: ip || null, match_strategy: 'missing-time-or-asset' })
        unverifiable += 1
        continue
      }
      const t = Date.parse(at)
      const from = new Date(t - windowMin * 60000).toISOString()
      const to = new Date(t + windowMin * 60000).toISOString()
      const hit = db2.prepare('SELECT al.id, al.first_seen, al.incident_id FROM alert al'
        + ' LEFT JOIN asset a ON a.id = al.asset_id'
        + ' WHERE (al.entity_id = ? OR a.ip = ?) AND al.first_seen BETWEEN ? AND ?'
        + ' ORDER BY ABS(julianday(al.first_seen) - julianday(?)) LIMIT 1').get(ip, ip, from, to, at)
      if (hit === undefined) {
        items.push({ verdict: 'missed', red_step_id: step.id, red_at: at, red_title: step.title, red_asset: ip, red_ttp: str(step.stage), match_strategy: 'entity+window' })
        missed += 1
        continue
      }
      const delta = Math.round((Date.parse(hit.first_seen) - t) / 1000)
      const verdict = Math.abs(delta) <= 300 ? 'matched' : 'late'
      if (verdict === 'matched') matched += 1
      else late += 1
      items.push({
        verdict, red_step_id: step.id, red_at: at, red_title: step.title, red_asset: ip,
        red_ttp: str(step.stage), blue_alert_id: hit.id, blue_incident_id: hit.incident_id,
        delta_s: delta, match_strategy: 'entity+window',
      })
    }
    const summary = { red: redId, blue: blueId, steps: steps.length, matched, late, missed, unverifiable, window_min: windowMin }
    const info = db2.prepare('INSERT INTO reconcile (red_ref, blue_ref, at, by, mode, summary) VALUES (?,?,?,?,?,?)')
      .run(redId, blueId, nowIso(), str(args.by || 'user'), 'manual', JSON.stringify(summary))
    const rid = Number(info.lastInsertRowid)
    const ins = db2.prepare('INSERT INTO reconcile_item (reconcile_id, verdict, red_step_id, red_at, red_title, red_asset, red_ttp,'
      + ' blue_alert_id, blue_incident_id, delta_s, match_strategy, note) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    for (const it of items) {
      ins.run(rid, it.verdict, it.red_step_id ?? null, it.red_at ?? null, it.red_title ?? null, it.red_asset ?? null,
        it.red_ttp ?? null, it.blue_alert_id ?? null, it.blue_incident_id ?? null, it.delta_s ?? null,
        it.match_strategy ?? null, it.note ?? null)
    }
    db2.prepare('INSERT INTO change_log (kind, ref_id, at) VALUES (?,?,?)').run('reconcile', String(rid), nowIso())
    return { id: rid, summary, items: items.slice(0, 200) }
  }

  listReconciles(id) {
    return this.db(id).prepare('SELECT * FROM reconcile ORDER BY id DESC LIMIT 20').all().map((r) => ({
      ...r,
      summary: (() => { try { return JSON.parse(r.summary || '{}') } catch { return {} } })(),
    }))
  }

  reconcileItems(id, reconcileId) {
    return this.db(id).prepare('SELECT * FROM reconcile_item WHERE reconcile_id = ? ORDER BY id').all(num(reconcileId))
  }
}
