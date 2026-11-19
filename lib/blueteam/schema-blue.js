/**
 * 蓝队事实库 schema（追加在红队资产库之上）。
 *
 * 为什么不是另一套库：蓝队要的资产/端口/指纹/网段与红队完全同构（同一份扫描结果
 * 两边都要用），所以共用 `DDL`；蓝队**只追加自己需要的表**。物理隔离靠数据根
 * （`$DSH_HOME/blueteam`），不靠表名区分。
 *
 * 纪律（与 redteam/schema.js 一致）：
 *   · 一律 CREATE TABLE IF NOT EXISTS，可重复执行；
 *   · 加列走 migrateBlue()：先查 PRAGMA 再 ADD COLUMN；
 *   · 时间存 ISO-8601 UTC 字符串；设备原始时间与时钟偏差另存。
 */

export const BLUE_DDL = `
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;

/* ── 资产画像：业务视角（红队没有、蓝队必须有） ───────────────────────── */
CREATE TABLE IF NOT EXISTS asset_profile (
  asset_id INTEGER PRIMARY KEY,
  owner TEXT, dept TEXT, business TEXT,
  env TEXT DEFAULT 'prod',
  criticality TEXT DEFAULT 'P2',
  data_class TEXT DEFAULT 'internal',
  users_count INTEGER, rto_min INTEGER, rpo_min INTEGER,
  compliance TEXT, note TEXT, updated_at TEXT, updated_by TEXT
);

/* ── 暴露面：一个缺口一行（收敛率的唯一分母） ─────────────────────────── */
CREATE TABLE IF NOT EXISTS exposure (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER, kind TEXT NOT NULL, port INTEGER,
  title TEXT NOT NULL, detail TEXT, severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  source TEXT, found_at TEXT, due_at TEXT, fixed_at TEXT, verified_by TEXT,
  accepted_by TEXT, accepted_until TEXT,
  evidence_ref TEXT, ticket TEXT, updated_at TEXT
);

/* ── 基线核查：逐项结果（fail 自动生成暴露面） ─────────────────────── */
CREATE TABLE IF NOT EXISTS baseline_check (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER, category TEXT NOT NULL, item TEXT NOT NULL,
  expected TEXT, actual TEXT,
  result TEXT DEFAULT 'unknown',
  severity TEXT DEFAULT 'medium',
  checked_at TEXT, checked_by TEXT, incident_id INTEGER, note TEXT
);

/* ── 数据源台账：没有它"检测覆盖"是空的 ───────────────────────────────── */
CREATE TABLE IF NOT EXISTS log_source (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL, product TEXT, endpoint TEXT, owner TEXT,
  scope TEXT, assets_count INTEGER,
  status TEXT DEFAULT 'planned',
  retention_days INTEGER, latency_s INTEGER,
  last_event_at TEXT, note TEXT, updated_at TEXT
);

/* ── 检测规则：生命周期 + 误报率 ─────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS detection_rule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  ttp TEXT, tactic TEXT,
  source_id INTEGER, product TEXT, scope TEXT,
  severity TEXT, logic TEXT, content_path TEXT,
  status TEXT DEFAULT 'draft',
  verified INTEGER DEFAULT 0, verified_note TEXT,
  fp_rate REAL, last_verified_at TEXT, hit_count INTEGER DEFAULT 0,
  created_at TEXT, created_by TEXT, updated_at TEXT
);

/* ── 告警：高频表（分页/索引是硬要求） ───────────────────────────────── */
CREATE TABLE IF NOT EXISTS alert (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT, rule_code TEXT, rule_name TEXT,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  entity_kind TEXT, entity_id TEXT, entity_label TEXT,
  asset_id INTEGER,
  first_seen TEXT, last_seen TEXT, count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'new',
  conclusion TEXT, triage_note TEXT, assignee TEXT, acked_at TEXT,
  incident_id INTEGER, dup_of INTEGER,
  ttp TEXT, confidence REAL,
  dedup_key TEXT, suppressed_until TEXT,
  raw_ref TEXT, ingested_at TEXT, clock_skew_ms INTEGER,
  sla_due_at TEXT, escalated_at TEXT, tz TEXT
);

/* ── 事件：四时钟 + 复盘 ─────────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS incident (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, severity TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'open',
  detected_at TEXT, triaged_at TEXT, contained_at TEXT,
  eradicated_at TEXT, recovered_at TEXT, closed_at TEXT,
  owner TEXT, commander TEXT,
  summary TEXT, root_cause TEXT, impact TEXT,
  sla_due_at TEXT, postmortem_ref TEXT, reconcile_state TEXT
);

/* ── 事件时间线：每个事件必须有时间线 ─────────────────────────────────── */
CREATE TABLE IF NOT EXISTS incident_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_id INTEGER NOT NULL, at TEXT NOT NULL,
  kind TEXT, actor TEXT, role TEXT, text TEXT,
  ref_kind TEXT, ref_id INTEGER
);

/* ── 处置动作：影响面 + 回滚 + 审批 + 冷静期 ─────────────────────────── */
CREATE TABLE IF NOT EXISTS response_action (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_id INTEGER,
  kind TEXT NOT NULL,
  target_kind TEXT, target TEXT, direction TEXT, scope TEXT,
  impact TEXT, blast_radius TEXT, rollback_plan TEXT,
  risk TEXT DEFAULT 'mid',
  approval_status TEXT DEFAULT 'requested',
  requestor TEXT, approver TEXT, approved_at TEXT,
  emergency INTEGER DEFAULT 0, justification TEXT, after_action_review INTEGER DEFAULT 0,
  executed_at TEXT, result TEXT, verify_at TEXT, verify_evidence_ref TEXT,
  rolled_back_at TEXT, rollback_result TEXT,
  cool_down_until TEXT, operator TEXT, created_at TEXT
);

/* ── 名单：五类，必须有过期 ───────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  value TEXT NOT NULL, value_kind TEXT DEFAULT 'ip',
  label TEXT, source TEXT, severity TEXT,
  expires_at TEXT, note TEXT,
  active INTEGER DEFAULT 1, created_by TEXT, created_at TEXT,
  UNIQUE(kind, value)
);

/* ── 对账（紫队复盘唯一跨库通道，只读红队库） ─────────────────────────── */
CREATE TABLE IF NOT EXISTS reconcile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  red_ref TEXT, blue_ref TEXT, at TEXT, by TEXT,
  mode TEXT DEFAULT 'manual', summary TEXT
);

CREATE TABLE IF NOT EXISTS reconcile_item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reconcile_id INTEGER NOT NULL,
  verdict TEXT,
  red_step_id INTEGER, red_at TEXT, red_title TEXT, red_asset TEXT, red_ttp TEXT,
  blue_alert_id INTEGER, blue_incident_id INTEGER,
  delta_s INTEGER, match_strategy TEXT, note TEXT
);

/* ── 索引 ───────────────────────────────────────────────────────────── */
CREATE INDEX IF NOT EXISTS ix_bp_crit ON asset_profile(criticality, env);
CREATE INDEX IF NOT EXISTS ix_exp_queue ON exposure(status, severity);
CREATE INDEX IF NOT EXISTS ix_exp_asset ON exposure(asset_id);
CREATE INDEX IF NOT EXISTS ix_bl_asset ON baseline_check(asset_id, category);
CREATE INDEX IF NOT EXISTS ix_dr_ttp ON detection_rule(ttp, status);
CREATE INDEX IF NOT EXISTS ix_alert_queue ON alert(status, severity, first_seen);
CREATE INDEX IF NOT EXISTS ix_alert_dedup ON alert(dedup_key, last_seen);
CREATE INDEX IF NOT EXISTS ix_alert_entity ON alert(entity_kind, entity_id);
CREATE INDEX IF NOT EXISTS ix_alert_incident ON alert(incident_id);
CREATE INDEX IF NOT EXISTS ix_alert_seen ON alert(first_seen, id);
CREATE INDEX IF NOT EXISTS ix_inc_status ON incident(status, severity, detected_at);
CREATE INDEX IF NOT EXISTS ix_tl_inc ON incident_timeline(incident_id, at, id);
CREATE INDEX IF NOT EXISTS ix_ra_inc ON response_action(incident_id);
CREATE INDEX IF NOT EXISTS ix_ra_pending ON response_action(approval_status, risk);
CREATE INDEX IF NOT EXISTS ix_wl_kind ON watchlist(kind, active);
CREATE INDEX IF NOT EXISTS ix_rec_item ON reconcile_item(reconcile_id, verdict);
`

/**
 * 增量迁移：给既有蓝队库补列（先查 PRAGMA 再 ADD COLUMN，可重复执行）。
 * @param db - node:sqlite 句柄。
 */
export function migrateBlue(db) {
  const has = (table, column) => {
    try {
      return db.prepare(`PRAGMA table_info(${table})`).all().some((row) => row.name === column)
    } catch { return false }
  }
  const ensure = (table, column, ddl) => {
    if (has(table, column)) return false
    try { db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`) } catch { /* 并发迁移忽略 */ }
    return true
  }
  /* 告警：去重来源、时钟偏差、SLA 与风暴标记 */
  ensure('alert', 'dup_of', 'INTEGER')
  ensure('alert', 'clock_skew_ms', 'INTEGER')
  ensure('alert', 'escalated_at', 'TEXT')
  ensure('alert', 'acked_at', 'TEXT')
  /* 处置：先斩后奏与复盘标记 */
  ensure('response_action', 'emergency', 'INTEGER DEFAULT 0')
  ensure('response_action', 'after_action_review', 'INTEGER DEFAULT 0')
  /* 证据截图：蓝队复用 shot 表，补三个可空外键 */
  ensure('shot', 'incident_id', 'INTEGER')
  ensure('shot', 'action_id', 'INTEGER')
  ensure('shot', 'alert_id', 'INTEGER')
  /* 事件：漏报对账状态 */
  ensure('incident', 'reconcile_state', 'TEXT')
  ensure('reconcile_item', 'red_ttp', 'TEXT')
}
