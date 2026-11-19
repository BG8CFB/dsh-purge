# 蓝队模式设计与实施规划（dsh-purge · 待审 v1）

> 本文是 `docs/blueteam-playbook.md`（业务基准）的**实现层设计稿**：把"蓝队该干什么"落成"插件里有哪些表、哪些工具、哪些页签、哪些状态机、哪些校验"。
> 读法：§0 是要你拍板的结论；§1 是现状核对（文档 vs 代码）；§8 是**遗漏清单**（本文最重要的一节）；§9 是文件级实施路线。
> 结论口径：凡与 playbook 冲突，以本文为准；playbook 只保留业务意图，不保留过时的映射表。

---

## 0.0.1 v2.19 修订：砍掉"管理面"，只留技术面

第一版把 SOC 的**管理流程**（班次、交接、变更窗口、蓝队记分板）也搬了进来，这不是用户要的。本轮按"AI 能参与的技术防守"重做：

| 移除 | 原因 | 现状 |
| --- | --- | --- |
| 班次 `shift` / 交接 `handover` | 排班表是人的管理动作，AI 参与不了，也不该由插件记录 | 表/工具/页签全部删除 |
| 变更窗口 `change_window` | 变更管理属于 ITIL 流程，蓝队技术面只需要"知道哪条是已知噪声"（白名单足够） | 表/工具/UI 删除 |
| 蓝队记分板 `blueScore` | 用户明确"记分不要都可以"；技术面看指标就够，不需要打分排名 | 计分/得分页删除 |

**保留并强化的技术面**：资产与画像、暴露面与基线、**漏洞清单**（新增）、数据源台账、检测规则与 ATT&CK 覆盖矩阵、告警研判、事件处置（影响面/回滚/审批/验证）、**智能体角色提示词**（新增页）、红蓝只读对账。

新页签（与红队同构的 9 页）：项目中心 / 总览 / 资产与暴露面 / **漏洞** / 告警台 / 事件处置 / 检测覆盖 / **智能体** / 报告与复盘。

新增工具：`blueteam_asset_add`、`blueteam_vuln_add`、`blueteam_vuln_list`、`blueteam_vuln_update`（修完必须带证据）。

## 0.0 定位修正：不是"同一个人兼顾两边"，是两条平行线

这是本文最重要的一条，写在最前面：

- **一次攻防里，用户只担任一侧。** 担任红队就建红队项目、用红队工具、看红队页签；担任蓝队就建蓝队项目、用蓝队工具、看蓝队页签。
- **两条线在插件里是物理分开的**：数据根（`$DSH_HOME/redteam` / `$DSH_HOME/blueteam`）、会话绑定文件、工具集（`redteam_*` / `blueteam_*`）、预设（「红队模式」/「蓝队模式」）、HTTP 桥（`/redteam/api` / `/blueteam/api`）、面板页签，全部各一套。
- **一个会话只会看到自己那一侧的工具**：红队会话里 `blueteam_*` 根本不存在，蓝队会话里 `redteam_*` 也不存在——这不是"靠提示词约束"，是注册层面的隔离。
- **唯一的跨线通道是对账**：复盘时由**用户**在面板点一次"红蓝对账"，只读打开红队库，逐条判断蓝队有没有记录到。模型能读对账结果，不能自己发起。

为什么不做"一个项目里同时有攻防两侧"：那样必然出现"这条资产/这条告警属于哪一侧"的歧义，报告会串、绑定会串、权限也会串。两条平行线是唯一不会互相污染的结构。

## 0.1 这一版已经落地的东西（代码事实）

| 面 | 实现 | 位置 |
| --- | --- | --- |
| 数据根 | `$DSH_HOME/blueteam`（`BLUETEAM_HOME` 可覆盖） | `lib/blueteam/store.js` |
| 事实库 | `BlueteamStore extends RedteamStore`（共享资产/漏洞表 + 追加 12 张蓝队表） | `lib/blueteam/store-blue.js`、`schema-blue.js` |
| 工具 | 32 个 `blueteam_*`（项目/资产/漏洞/暴露面/基线/检测/告警/事件/动作/报告/对账） | `lib/blueteam/tools.js` |
| HTTP | `POST /blueteam/api`（含审批 op）+ `GET /blueteam/api/events` | `lib/blueteam/ui.js` |
| 预设 | 「蓝队模式」（`presets/blueteam`），角色 plan/asset/detection/triage/responder | `lib/blueteam/index.js` |
| 技能 | 8 个 SOC 技能（值守/研判/处置/基线/检测/资产/交接/对账） | `skills/blueteam/` |
| 面板 | 主面板新增「蓝队值守台」页签，9 个项目页（含漏洞、智能体） | `src/client/blue/` |
| 测试 | `test/blue-store.mjs` 33 项断言（含状态机、审批闸门、对账） | `test/` |

**行为边界（刻意的）**：AI 只能 `propose` 处置动作；`approve/reject/force` 只存在于面板 op，工具集里没有。这条不靠提示词，靠代码。

## 0.2 行业做法对照（为什么这么设计）

| 行业通行做法 | 插件里的落点 |
| --- | --- |
| 蓝队按 7×24 班次值守，交接班是硬流程 | `shift` / `handover` 表 + 「值勤交接」页；不开班也能干活，但统计与交班没有依托 |
| 告警来自 EDR/SIEM/WAF/DNS，必须先做资产与日志源台账 | `log_source` + 「检测覆盖」页 + 覆盖矩阵三态（covered/gap/blind） |
| 度量用 MTTD/MTTC/MTTR，且要区分"机器发现"与"人确认" | 四时钟：`alert.first_seen` → `incident.triaged_at` → `contained_at` → `recovered_at` |
| 处置要能回滚，误封核心业务比被拿分更严重 | 动作带 `impact/blast_radius/rollback_plan`；高危必须审批；30 分钟冷静期 |
| 紫队复盘：红队动作 × 蓝队检测，逐条对账 | `reconcile` / `reconcile_item`，红队库只读 |
| 告警风暴是 SOC 第一课 | 去重窗口 + 风暴折叠 + meta 告警 |

参考（行业公开材料，只作方法论对照）：
- [护网行动实战实操手册：蓝队核心职责与全流程](https://www.wsisp.com/helps/115775.html)
- [Purple Teaming: How Red and Blue Teams Work Together](https://cyberfortgroup.com/glossary/purple-teaming/)
- [MTTD, MTTC & MTTR: The Metrics, and the Blind Spot](https://www.crogl.com/resources/blog/mttd-mttc-soc-metrics)

---

## 0. 结论先行（10 条决策）

| # | 决策 | 理由 | 代价 |
| --- | --- | --- | --- |
| D1 | **side 是项目第一级属性**，红蓝各建各的项目、各开各的库 | playbook 的核心承诺是"互不可见"，这必须由目录边界保证，不能靠每处查询都记得加过滤 | 项目列表/绑定/当前指针要按 side 分开 |
| D2 | **物理独立数据根**：`$DSH_HOME/blueteam`（红队继续用 `$DSH_HOME/redteam`，零迁移） | 红队库可以整包删、可以拷贝给客户；蓝队库要留存、要取证。备份与删除边界不同 | 两套 `engagements/`、`current`、`session-bindings.json` |
| D3 | **复用 `RedteamStore` 基类**，用 `side profile` 注入 DDL / 角色 / 默认提示词 / 计分种子 | 6123 行事实库不该复制一份；复制必然漂移 | 要在 store-core 做约 5 处小手术（默认行为不变） |
| D4 | **蓝队是独立预设 + 独立工具行 + 独立 HTTP 桥 + 面板新页签** | 工具随预设注入：红队会话里根本看不到 `blueteam_*`，天然隔离 | 多一份 preset/工具/面板代码 |
| D5 | **告警必须能 ingest**（CSV/JSON/通用映射 + 去重键 + 时钟校正） | 没有接入，告警台就是空壳；这是"能跑起来"的分水岭 | 需要一份字段映射规范 |
| D6 | **AI 不能自我审批**：审批与 `force` 执行只走面板（用户点），模型只能 propose / execute / verify | 否则"审批"在 AI 值守里等于没有 | 工具集少两个动作，面板多两个弹窗 |
| D7 | **MTTD/MTTR 重定义为四时钟**：`first_seen`（机器）/ `triaged_at`（人确认）/ `contained_at`（止血）/ `recovered_at`（恢复） | playbook 用 `detected_at` 一个字段混装"机器发现"和"人确认"，指标必然失真 | 事件表多两个时间列，报告口径要重写 |
| D8 | **对账是唯一跨库通道**：只在面板触发，红库只读，结果落 `reconcile*` | "蓝队漏报"无法由蓝队自证；但完全隔离又无法复盘 → 只能开一条受控通道 | 需要红库 root 配置 + 只读访问 |
| D9 | **基线 fail ⇒ 自动 upsert 暴露面**，收敛率只有一个分母 | 两份账（基线 + 暴露面）各算一遍，数字永远对不上 | 写入路径要合并（工具层做，不做双写） |
| D10 | **值勤（班次/交接）是一等公民**，不是备注 | 实战是班次制；没有交接，"守住了"只存在于上一班的人脑里 | 多两张表 + 一个页签 |

**还需要你拍板的 8 个点**见 §11.3。

---

## 1. 现状核对：文档写了什么，插件现在有什么

### 1.1 代码盘点（事实）

| 面 | 现状 | 位置 |
| --- | --- | --- |
| 项目 | `engagement` = 目录 + 独立 SQLite；元数据 `engagement.yaml`（`target_name/scope_cidrs/status/note/data_dir/workspace_id`） | `lib/redteam/store-core.js`（`openEngagement` 等） |
| **side** | **不存在**。全仓 `grep side` 只有"侧边栏"语义（`sideCollapse`） | — |
| 表 | 24 张（资产库）：segment/asset/asset_name/port/service/fingerprint/observation/edge/tag/vuln/score_point/score_hit/stage/credential/access_session/webshell/tunnel/http_evidence/attack_file/attack_step/change_log/score_snapshot/shot/scan_run | `lib/redteam/schema.js` |
| 工具 | 59 个 `redteam_*`，随「红队模式」预设注入；靶标按根会话绑定 | `lib/redteam/tools.js` |
| 面板 | `main` 全局面板 2 页签（总览/红队演练台）；演练台内 9 项目页 + 3 全局页；人格/规则/技能/更新在设置分区 | `src/client/main/PurgeMain.tsx`、`src/client/redteam/RedteamTab.tsx` |
| 接口 | `POST /redteam/api`（80+ op）+ `GET /redteam/api/events`（SSE，1s 轮询 `change_log`） | `lib/redteam/ui.js` |
| 实时 | `change_log(kind, ref_id, at)`；SSE 的 `kind` 实为**表名**（或 `表名:动作`），不是业务事件名 | 同上 |
| 预设 | `presets/redteam`（红队模式）+ 5 执行角色 + 指挥；技能 23 个 | `presets/redteam/`、`skills/redteam/` |
| 数据根 | `$DSH_HOME/redteam`：`engagements/<id>`、`knowledge.db`、`settings.json`（`maxAgents`）、`session-bindings.json`（上限 500）、`current` 指针 | `lib/redteam/store.js`、`bindings.js`、`settings.js` |
| 绑定 | 根会话 id → 项目 id；子智能体继承；「当前项目被别的会话占用」时**抛错而不是串写** | `tools.js#resolveEngagement` |

### 1.2 文档与实现的差距（逐条）

| playbook 的说法 | 代码事实 | 结论 |
| --- | --- | --- |
| 项目字段 `side=offense/defense` | 没有 `side` | §10 的映射表整张是**未实现的计划** |
| 页签「资产与暴露面/告警台/事件处置/检测覆盖/得分/报告」 | 只有红队 12 页签 | 蓝队页签**一个都没有** |
| 工具前缀 `blueteam_*` | 0 个 | 需要新建 |
| 表 `alert / incident / response_action / detection / exposure` | 0 张 | 需要新建 |
| SSE 事件类型 `alert/incident/action` | 实际是 `change_log.kind`（表名） | 需要一层 **kind → 频道** 映射（§6.6） |
| `MTTD = incident.detected_at − alert.first_seen` | `detected_at` 语义未定义 | 四时钟重定义（§4.3） |
| 「红队那侧同构」 | 红队工具只认 `ctx.redteam` | 蓝队需要独立 `ctx.blueteam` |

### 1.3 一句话判断

playbook 的**业务骨架可用**（防守优势、五阶段、告警分级、自伤约束、蓝队计分），但有 3 类硬伤：
1. **少了"值守"这条主线**（班次、交接、SLA 倒计时、升级路径），整篇读起来像一次性项目，不像 7×24；
2. **数据与接入缺一层**（数据源台账、告警 ingest、去重/抑制/风暴、时钟校正），照它实现会发现"台子搭好了但没有告警"；
3. **不可执行的规则太多**（"变更审批""回滚预案""误报扣分"都没有判定所需的最小字段）。

§8 是完整清单。

---

## 2. 形态与命名

### 2.1 三个可选形态

| 方案 | 做法 | 优点 | 致命问题 |
| --- | --- | --- | --- |
| A 同库加列 | `engagement.yaml` 加 `side`，仍用 `redteam` 根 | 改动最小 | `current` 指针、绑定表、`knowledge.db`、`settings.json` 全共享 → 一旦哪处忘了过滤就串味；删红队库会连蓝队一起删 |
| B 完全独立包 | 另起一个 npm 包 | 隔离最彻底 | 面板/预设/工具/UI 全复制一遍，两份维护 |
| **C 单包 + side 命名空间 + 独立数据根（选定）** | 同一份代码、两个 store 实例、两个预设、两条 HTTP 桥、同一个面板加页签 | 隔离靠目录边界；代码复用靠基类；发布仍是一个包 | store-core 需要 5 处小手术 |

### 2.2 数据根与目录规范

```
$DSH_HOME/
  redteam/                     # 红队（现状不动）
    engagements/<id>/          #   engagement.yaml, assets.db, agents/, runs/, reports/, shots/
    knowledge.db               #   POC 全局库
    settings.json              #   { maxAgents }
    session-bindings.json
    current
  blueteam/                    # 蓝队（新增）
    engagements/<id>/
      engagement.yaml          #   + side: defense, mode: drill|live, tz, sla_profile
      assets.db                #   同构 schema + 蓝队表
      agents/<role>.md         #   soc-lead / asset / detection / triage / responder
      alerts/YYYYMMDD/*.json   #   告警原文（库内存 raw_ref）
      runs/ reports/ shots/
    detection.db               #   检测规则库（全局，跨项目复用）
    settings.json              #   { maxAgents, slaProfile, tz, notify }
    session-bindings.json
    current
```

- 覆盖：`BLUETEAM_HOME` 环境变量 > 插件 config `root` > 默认。
- 禁止：蓝队 store **不得**写入红队根（唯一例外：§4.9 对账的**只读**访问）。

### 2.3 命名

| 面 | 红队 | 蓝队 |
| --- | --- | --- |
| 预设 id / 名称 | `redteam` / 红队模式 | `blueteam` / 蓝队模式 |
| 插件行 | `dsh-purge/redteam{,/store,/ui,/tools}` | `dsh-purge/blueteam{,/store,/ui,/tools}` |
| 服务名 | `ctx.redteam` | `ctx.blueteam` |
| 工具前缀 | `redteam_*` | `blueteam_*` |
| HTTP | `/redteam/api`、`/redteam/api/events` | `/blueteam/api`、`/blueteam/api/events` |
| 面板页签 | 红队演练台（key `redteam`） | **蓝队值守台**（key `blueteam`） |
| 徽章 | 红队 · 项目 · 得分 | 蓝队 · 项目 · MTTD / 未处置 P0 |
| 术语 | 靶标 / 攻击 | **责任区 / 防守**（避免"打靶"话术混入蓝队） |

---

## 3. 数据模型

约定：**时间一律 ISO-8601 UTC 存库**，原始时区与设备时间另存（`tz`、`clock_skew_ms`）；**凭证/口令类不存明文**（只存 ref）。

### 3.1 复用表（不改结构）

`asset / asset_name / port / service / fingerprint / observation / edge / segment / tag / vuln / credential / change_log / score_point / score_hit / score_snapshot / shot`。

- `asset` 继续表示"责任区里的一个主机/域名/IP"，蓝队只补画像（`asset_profile`），**不复制一遍资产**。
- `vuln` 在蓝队语境 = "本单位待修漏洞"（来源可为扫描或事件），沿用 `status` 做修复跟踪。
- `credential` 在蓝队语境 = "已泄露/待轮换的凭据"，复用 `secret_type/privilege`，`note` 写轮换状态。
- `shot` 扩展 3 个可空外键（`incident_id / action_id / alert_id`）后作为蓝队证据仓；文件仍落 `shots/`。

### 3.2 新增表（核心 8 张，完整字段）

```sql
-- ① 资产画像：业务视角（红队没有、蓝队必须有）
CREATE TABLE IF NOT EXISTS asset_profile (
  asset_id INTEGER PRIMARY KEY,
  owner TEXT, dept TEXT, business TEXT,
  env TEXT DEFAULT 'prod',              -- prod | test | dev
  criticality TEXT DEFAULT 'P2',        -- P0 核心 | P1 重要 | P2 一般 | P3 边缘
  data_class TEXT DEFAULT 'internal',   -- public | internal | sensitive | secret
  users_count INTEGER, rto_min INTEGER, rpo_min INTEGER,
  compliance TEXT,                      -- 等保级别/行业监管，逗号分隔
  note TEXT, updated_at TEXT, updated_by TEXT
);
CREATE INDEX IF NOT EXISTS ix_bp_crit ON asset_profile(criticality, env);

-- ② 暴露面：一个"缺口"一行，收敛率的唯一分母
CREATE TABLE IF NOT EXISTS exposure (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER, kind TEXT NOT NULL, port INTEGER,
  title TEXT NOT NULL, detail TEXT, severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',           -- open|fixing|fixed|accepted|false_positive
  source TEXT,                          -- baseline|scan|manual|incident
  found_at TEXT, due_at TEXT, fixed_at TEXT, verified_by TEXT,
  accepted_by TEXT, accepted_until TEXT,
  evidence_ref TEXT, ticket TEXT, updated_at TEXT
);
CREATE INDEX IF NOT EXISTS ix_exp_queue ON exposure(status, severity);
CREATE INDEX IF NOT EXISTS ix_exp_asset ON exposure(asset_id);

-- ③ 数据源台账：没有它，"检测覆盖"是空的
CREATE TABLE IF NOT EXISTS log_source (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,                   -- network|host|app|account|honeypot
  product TEXT, endpoint TEXT, owner TEXT,
  scope TEXT, assets_count INTEGER,
  status TEXT DEFAULT 'planned',        -- planned|connected|degraded|offline
  retention_days INTEGER, latency_s INTEGER,
  last_event_at TEXT, note TEXT, updated_at TEXT
);

-- ④ 检测规则：生命周期 + 误报率
CREATE TABLE IF NOT EXISTS detection_rule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  ttp TEXT, tactic TEXT,
  source_id INTEGER, product TEXT, scope TEXT,
  severity TEXT, logic TEXT, content_path TEXT,
  status TEXT DEFAULT 'draft',          -- draft|testing|active|retired
  verified INTEGER DEFAULT 0, verified_note TEXT,
  fp_rate REAL, last_verified_at TEXT, hit_count INTEGER DEFAULT 0,
  created_at TEXT, created_by TEXT, updated_at TEXT
);
CREATE INDEX IF NOT EXISTS ix_dr_ttp ON detection_rule(ttp, status);

-- ⑤ 告警：高频表，索引与分页是硬要求
CREATE TABLE IF NOT EXISTS alert (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT, rule_code TEXT, rule_name TEXT,
  severity TEXT NOT NULL,               -- P0..P3
  title TEXT NOT NULL,
  entity_kind TEXT, entity_id TEXT, entity_label TEXT,
  asset_id INTEGER,
  first_seen TEXT, last_seen TEXT, count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'new',            -- new|triaging|confirmed|false_positive|duplicate|suppressed|closed
  conclusion TEXT, triage_note TEXT, assignee TEXT, acked_at TEXT,
  incident_id INTEGER, ttp TEXT, confidence REAL,
  dedup_key TEXT, suppressed_until TEXT,
  raw_ref TEXT, ingested_at TEXT, clock_skew_ms INTEGER,
  sla_due_at TEXT, escalated_at TEXT, tz TEXT
);
CREATE INDEX IF NOT EXISTS ix_alert_queue ON alert(status, severity, first_seen);
CREATE INDEX IF NOT EXISTS ix_alert_dedup ON alert(dedup_key, last_seen);
CREATE INDEX IF NOT EXISTS ix_alert_entity ON alert(entity_kind, entity_id);
CREATE INDEX IF NOT EXISTS ix_alert_incident ON alert(incident_id);

-- ⑥ 事件：四时钟 + 复盘
CREATE TABLE IF NOT EXISTS incident (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, severity TEXT NOT NULL,
  category TEXT,                        -- webshell|tunnel|cred|ransom|scan|exfil|other
  status TEXT DEFAULT 'open',           -- open|contained|eradicated|recovered|closed
  detected_at TEXT, triaged_at TEXT, contained_at TEXT,
  eradicated_at TEXT, recovered_at TEXT, closed_at TEXT,
  owner TEXT, commander TEXT,
  summary TEXT, root_cause TEXT, impact TEXT,
  sla_due_at TEXT, postmortem_ref TEXT, reconcile_state TEXT
);
CREATE INDEX IF NOT EXISTS ix_inc_status ON incident(status, severity, detected_at);

-- ⑦ 事件时间线（playbook 要求"每个事件必须有时间线"，此前没有表）
CREATE TABLE IF NOT EXISTS incident_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_id INTEGER NOT NULL, at TEXT NOT NULL,
  kind TEXT,                            -- detect|triage|contain|eradicate|recover|action|evidence|note
  actor TEXT, role TEXT, text TEXT, ref_kind TEXT, ref_id INTEGER
);
CREATE INDEX IF NOT EXISTS ix_tl_inc ON incident_timeline(incident_id, at, id);

-- ⑧ 处置动作：影响面 + 回滚 + 审批 + 冷静期
CREATE TABLE IF NOT EXISTS response_action (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_id INTEGER,
  kind TEXT NOT NULL,                   -- block_ip|block_domain|isolate_host|disable_account|rotate_credential|revoke_ticket|patch|remove_shell|kill_process|hunt|downgrade_exposure
  target_kind TEXT, target TEXT, direction TEXT, scope TEXT,
  impact TEXT, blast_radius TEXT, rollback_plan TEXT,
  risk TEXT,                            -- low|mid|high|critical
  approval_status TEXT DEFAULT 'requested', -- requested|approved|rejected|auto|not_required
  requestor TEXT, approver TEXT, approved_at TEXT,
  emergency INTEGER DEFAULT 0, justification TEXT, after_action_review INTEGER DEFAULT 0,
  executed_at TEXT, result TEXT, verify_at TEXT, verify_evidence_ref TEXT,
  rolled_back_at TEXT, rollback_result TEXT,
  cool_down_until TEXT, operator TEXT
);
CREATE INDEX IF NOT EXISTS ix_ra_inc ON response_action(incident_id);
CREATE INDEX IF NOT EXISTS ix_ra_pending ON response_action(approval_status, risk);
```

### 3.3 其余表（字段从简，实现时按同风格补齐）

| 表 | 关键字段 | 用途 |
| --- | --- | --- |
| `baseline_check` | asset_id, category(account/port/patch/config/log/backup), item, expected, actual, result(pass/fail/unknown/na), severity, checked_at, checked_by, incident_id | §2.1 基线清单的**逐项结果**；fail 自动 upsert exposure |
| `watchlist` | kind(asset/white/black/profile/change), value, value_kind(ip/cidr/domain/url/hash/account/regex), label, source, severity, expires_at, active | 五类名单；**必须有过期**（IOC 会烂） |
| `change` | system, asset_id, kind(deploy/config/network/cert/data), window_start, window_end, owner, ticket, approved_by, risk, status | 变更窗口：降噪 + 自伤冲突检测 |
| `shift` | name, start_at, end_at, lead, members, timezone, status(planned/active/closed) | 班次；同一时刻只允许一个 active |
| `handover` | from_shift, to_shift, at, by, open_alerts, open_incidents, pending_actions, notes, ack_by, ack_at | 交接班 |
| `honeypot` | asset_id, kind(service/file/credential/url), endpoint, deployed_at, status, hit_count | 蜜罐/蜜标对象化（playbook 只有一句"可选"） |
| `decoy_hit` | honeypot_id, source_ip, at, evidence_ref | 命中即生成 P0 告警 |
| `reconcile` | red_ref, blue_ref, at, by, mode(manual/auto), summary | 对账批次 |
| `reconcile_item` | reconcile_id, verdict(matched/missed/late/unverifiable), red_step_id, red_at, blue_alert_id, blue_incident_id, delta_s, match_strategy, note | 逐条对账结果（漏报判定的唯一依据） |
| `alert_stat_hourly` / `metric_daily` | 维度 + 计数 + mttd/mttr 均值 | 大屏与趋势；P2 起物化（否则几十万行告警实时聚合会卡） |

### 3.4 关系

```
asset ─1:1─ asset_profile
asset ─1:n─ exposure / baseline_check / honeypot
log_source ─1:n─ detection_rule ─1:n─ alert
alert ─n:1─ incident ─1:n─ response_action
incident ─1:n─ incident_timeline
incident ─n:n─ shot(证据) / http_evidence
shift ─1:1─ handover
reconcile ─1:n─ reconcile_item ─n:1─ (red) attack_step / score_hit
```

### 3.5 迁移

- `BLUE_DDL` 用 `CREATE TABLE IF NOT EXISTS`，随 `db()` 幂等执行；`migrateBlue()` 沿用"先查 PRAGMA 再 ADD COLUMN"的既有纪律。
- 老库（先做红队后加蓝队）不受影响：蓝队表只在蓝队库创建。
- `shot` 的三列外键用 `ensure('shot','incident_id','INTEGER')` 方式补，红队库也会获得三个空列——**可接受**（红队报告不读它们）。

---

## 4. 业务逻辑（状态机 + 判定 + 副作用）

### 4.1 告警接入与降噪

**接入（ingest）必须做四件事**，缺一件告警台就不可信：

1. **字段映射**：`{source, format: csv|json|cEF, mapping: {time, rule, severity, entity, title, count, ttp}}`；映射模板可存项目内复用。
2. **时钟归一**：`first_seen = 设备时间 → UTC`，同时存 `tz` 与 `clock_skew_ms = ingested_at − first_seen`；`|skew| > 60s` 在面板挂黄条（多设备时钟不齐是 MTTD 变负的头号原因）。
3. **实体归一**：`entity_kind + entity_id`（ip/host/account/domain/hash/url/file）；能对上 `asset` 就回填 `asset_id`，对不上保留 `asset_id=NULL` 并在研判时可一键建资产。
4. **原文留存**：原始载荷写 `alerts/YYYYMMDD/<sha8>.json`，库内只存 `raw_ref`（照 `shots/` 的做法；告警原文体积远大于截图）。

**降噪四闸（顺序固定，先命中先返回）**：

```
① 白名单闸：watchlist(kind=white) 命中 entity/pattern → status=suppressed（不占 SLA、不计误报）
② 变更闸：change 窗口内 且 asset/system 命中 → status=suppressed，reason=change-window
③ 去重闸：dedup_key = sha1(source|rule_code|entity_kind|entity_id)
           窗口内（规则级 window_s，默认 600s）已存在 → 合并：count += n, last_seen = max()
           合并后 status 沿用原行（不把已研判的告警打回 new）
④ 风暴闸：同一 dedup_key 60s 内 > storm_threshold（默认 100）→ 只留 1 条代表行 + count
           + 生成一条 meta 告警「规则 X 风暴」，并暂停该规则 5 分钟评估
```

> 这四条 playbook 只写了"三招降噪"，没有顺序、没有 dedup_key 定义、没有风暴抑制——而**风暴**是真实 SOC 最先遇到的事故。

### 4.2 告警状态机

```
                   ┌── false_positive（须 fp_cause）
                   │
new ─→ triaging ──┼── duplicate（须 duplicate_of）
                   │
                   ├── confirmed ─→ [升事件] ─→ closed
                   │
                   └── suppressed（白名单/变更窗口/手动抑制到 until）─→ closed
```

| 迁移 | 守卫 | 副作用 |
| --- | --- | --- |
| new→triaging | 有 assignee（可自动=当班 lead） | 写 `alert.acked_at`（认领时间；**事件级 MTTD 用 `incident.triaged_at`**） |
| →false_positive | 必填 `fp_cause` ∈ 规则误报/资产未知/业务变更/时钟漂移/其它 | 计入误报率；按 cause 归到规则调优清单 |
| →duplicate | 必填 `duplicate_of` | 不计误报、不占 SLA |
| →confirmed | 必须有 `incident_id`（可当场建） | 触发事件状态机 |
| →suppressed | 必填 `until` + `reason` | 到期自动回 new 并重新计时 |
| 任何→closed | 必须有 `conclusion` | 写 change_log |

**SLA 与升级**（`sla_profile: strict|standard|loose`）：

| 级别 | standard 首次研判 | standard 止血 | strict | loose |
| --- | --- | --- | --- | --- |
| P0 已确认入侵 | 5 min | 30 min | 3/15 | 10/60 |
| P1 高置信 | 15 min | 2 h | 10/60 | 30/4h |
| P2 中置信 | 1 h | 8 h | 30/4h | 4h/24h |
| P3 低置信 | 当日归档 | — | 4h | 次日 |

- `sla_due_at` 在 ingest 时算死（不随后续改级重算，除非显式 `rescore`）。
- 超时**不自动升 severity**（会污染统计），只做：`escalated_at` + 面板红 + P0 超时 10 min 桌面通知指挥官。

### 4.3 事件状态机与四时钟

```
open ──triage──→ contained ──eradicate──→ eradicated ──recover──→ recovered ──close──→ closed
 │                  ▲                         │
 └──(P3 免止血直接归并)┘                      └── 复核不通过 → 退回 contained
```

| 迁移 | 守卫 | 写入 |
| --- | --- | --- |
| open | 至少 1 条 confirmed 告警（或手工建事件必须写来源） | `detected_at = min(alert.first_seen)` |
| →contained | 至少 1 条 `response_action` 且 `verify_at` 非空 | `contained_at`（**MTTR 止血口径终点**） |
| →eradicated | 必填 `verify_evidence_ref`（清马/改密/封禁的前后对比） | `eradicated_at` |
| →recovered | 业务恢复确认（可勾"仅安全侧恢复"并降级为 P3 收口） | `recovered_at` |
| →closed | P0/P1 必须 `postmortem_ref`；P2/P3 可填免复盘理由 | `closed_at` + 报告条目 |

**四时钟定义（修正 playbook §8）**：

| 时钟 | 字段 | 含义 |
| --- | --- | --- |
| ① 机器发现 | `alert.first_seen`（min） | 设备侧最早时间 |
| ② 人确认 | `incident.triaged_at`（告警级先落 `alert.acked_at`） | 有人把它当真 |
| ③ 止血 | `incident.contained_at` | 攻击面被切断（不是"开始处置"） |
| ④ 恢复 | `incident.recovered_at` | 业务恢复 |

- `MTTD = ② − ①`（**人发现**；机器发现能力另用"覆盖矩阵"衡量，不混进 MTTD）
- `MTTR_contain = ③ − ①`、`MTTR_recover = ④ − ①`
- 报告同时给中位数与 P90；单条极值不参与计分（扔进附录）。

**时间戳纪律**：只前进不后退；补录必须 `source=manual` 且保留原值到 `incident_timeline`。

### 4.4 处置动作：风险 → 审批 → 执行 → 验证 → 冷静期

**风险分级（`risk` 由 kind 决定，工具层强制，不允许模型自填降低）**：

| kind | 默认 risk | 必填 | 允许 AI 执行 |
| --- | --- | --- | --- |
| `hunt`（只读排查） | low | — | 是 |
| `kill_process` / `remove_shell` | mid | target、evidence | 是（需 verify） |
| `block_ip`（非核心资产） / `block_domain` | mid | direction、scope | 是（需 verify） |
| `patch` / `downgrade_exposure` | mid | ticket、rollback | 否（走变更） |
| `isolate_host` | high | impact、blast_radius、rollback | 否 |
| `disable_account` / `revoke_ticket` | high | impact、rollback | 否 |
| `rotate_credential` | high | impact、rollback | 否 |
| `block_ip`（命中核心资产/白名单） | critical | 以上 + 二次确认 | 否（面板 force） |

**审批模型（D6）**：

- 模型只能：`propose` → `execute`（仅 `risk=mid` 且 `approval_status=auto`）→ `verify`。
- `approve` / `reject` / `force` **只在面板暴露**（`/blueteam/api` op，不是模型工具）。单机场景用"同一用户两次确认"实现双人复核：requestor / approver 是两个字段，面板要求勾选"我已核对影响面与回滚方案"。
- **先斩后奏**（P0 已确认入侵）：允许 `emergency=1` 直接执行，但必须写 `justification`；执行后 24 h 内必须补审批或标 `after_action_review`，否则该动作计入自伤。
- **冷静期**：`cool_down_until = executed_at + 30min`，期间面板给"一键回滚"按钮；超时未回滚的误封计入自伤。

**执行前后必须成对**：`executed_at` 后 `verify_at` 为空 → 该动作在"待验证"队列，事件不能进 `contained`。验证内容按 kind 固定（封禁=连通性对比；隔离=EDR 状态；改密=旧凭据登录失败）。这是 playbook "处置要闭环"的可判定化。

### 4.5 检测：规则生命周期与覆盖矩阵

```
draft ─→ testing ─(回放/样本验证，填 fp_rate)─→ active ─→ retired
```

- `active` 必须：`ttp` + `source_id` + `verified_note` + `fp_rate`。
- 覆盖矩阵三态（**这是 playbook 缺的那张表**）：

| 状态 | 条件 | 面板色 | 含义 |
| --- | --- | --- | --- |
| covered | 有日志源 且 有 active 规则 且 `last_verified_at` < 90 天 | 绿 | 能看见 |
| gap | 有日志源 但 无规则 | 黄 | 能看见但没人看 |
| blind | 无日志源 | 红 | 瞎的 |

- 矩阵按 `tactic × asset(criticality)` 展示；点 gap 直接开"新建规则"，点 blind 直接开"数据源接入任务"。

### 4.6 暴露面与基线：一个分母

- `baseline_check` 只记"检查结果"；`result=fail` **自动 upsert** `exposure(kind=category, source=baseline)`。
- `exposure.fixed` 必须 `verified_by` + `evidence_ref`，并回写对应 baseline 为 `pass`。
- `accepted`（风险接受）必须 `accepted_by` + `accepted_until`，到期自动回 `open`。
- 收敛率 = `Σ weight(fixed) / Σ weight(fixed+open+fixing)`，`weight = criticality × severity`。
- 事件收口时必须回答一句：**这条路径上的基线为什么没守住**（写进 `incident_timeline(kind=note)` + 生成整改项）。这是 playbook §2.1 那句"每次事件后都要回看"的可执行化。

### 4.7 值勤：班次与交接（v2.19 已移除）

> 本节仅作历史记录：班次/交接属管理流程，AI 参与不了，已从表、工具与面板中删除。

- 同一时刻只允许 1 个 `active` 班次；开新班次自动关旧班次（要求先 `handover`）。
- 交接清单**自动生成**：未闭环告警（按 SLA 剩余排序）、在处置事件、待批动作、待验证动作、24 h 内新增暴露面、班次内误报率。
- `handover` 必须被下一班 `ack` 才算交班完成；未 ack 的面板持续红点。

### 4.8 名单与变更

- 五类名单必须有过期时间；`white` 过期 → 自动改为 `review` 状态提醒复评（白名单烂掉是蓝队最常见的失效模式）。
- `change` 窗口用于：告警抑制 + 自伤冲突检测（"你要封的 IP 是今晚正在上线的系统"→ 面板拦截，需 `force`）。
- `black` 名单支持批量导入 IOC，带 `source/expires_at`；过期不删，标 `stale`（保留历史解释力）。

### 4.9 对账（紫队复盘，唯一跨库通道）

```
面板「报告 → 复盘对账」选择：红队项目 A × 蓝队项目 B
  → 只读打开 A 的 assets.db（sqlite readonly）
  → 取 A 的 attack_step / score_hit（时间、资产、TTP、动作）
  → 与 B 的 alert / incident（实体、时间窗、TTP）匹配：
       ① 实体+时间窗（±N min）  ② TTP 匹配  ③ 人工勾对
  → 每条给 verdict：matched / missed / late（超出 SLA 才处置）/ unverifiable
  → 落 reconcile + reconcile_item，写蓝队 change_log
```

- **只读**：以 `new DatabaseSync(path, { readOnly: true })` 打开；写红库 = 设计缺陷。
- **只由面板触发**：模型没有对账工具，避免 AI 在蓝队会话里"看见"红队数据。
- `unverifiable` 必须保留：红队没记录证据的步骤，不能反过来算蓝队漏报。

### 4.10 评分（v2.19 已移除）

> 本节仅作历史记录：蓝队不做记分。技术指标（MTTD/MTTR/覆盖/误报）只在总览与报告里作为观测值展示。

| 维度 | 权重 | 计算 | 满分条件 | 归零条件 |
| --- | --- | --- | --- | --- |
| 检测覆盖 | 30 | `Σ w(ttp) · covered / Σ w(critical_ttp)`，关键 TTP ×2 | ≥90% | ≤30% |
| 发现时效 | 15 | MTTD 中位数分段线性 | ≤15 min | ≥120 min |
| 止血时效 | 10 | MTTR_contain 中位数分段线性 | ≤30 min | ≥240 min |
| 暴露面收敛 | 20 | 加权收敛率 | ≥80% | ≤20% |
| 基线达标 | 10 | pass / (pass+fail) | ≥95% | ≤60% |
| 误报率 | −10 | fp / alerts，超过 30% 开始扣 | ≤5% 不扣 | 100% 扣满 |
| 自伤 | −15 | 高危误操作 + 超时未回滚（每条 −5） | 0 条 | ≥3 条扣满 |
| 漏报 | 按红队 | `Σ missed 对应红队 hit.points × 0.5` | 0 | 全额扣 |
| 失守判定 | 一票 | 核心资产（P0）出现"未检测到的持久化/数据外带" | — | 总分不高于 40 且报告置顶 |

- 每条得分必须能回到 SQL：`评分卡片 → 点击展开 → 明细行 + 来源表 + 时间戳`。**不接受"我估个分"**。
- 规则版本：`score_rules_version` 写进 `score_snapshot.summary`，口径变更必须升版本，否则跨周期对比无意义。

---

## 5. 角色与工具（模型面）

### 5.1 五个角色（与 playbook §7 对齐，补职责边界）

| 角色 | code | 能做 | 不能做 | 主要产出 |
| --- | --- | --- | --- | --- |
| 值守指挥 | `soc-lead` | 分级、派活、汇总、对外汇报 | 不直接处置、不审批 | 班次综述、事件定级、升级决策 |
| 资产与暴露面 | `asset` | 资产导入/画像/基线核查/暴露面收敛 | 不改生产配置（只提变更） | asset_profile、exposure、baseline |
| 检测工程 | `detection` | 数据源台账、规则编写、覆盖矩阵、规则验证 | 不碰告警处置 | detection_rule、log_source |
| 告警研判 | `triage` | 研判、关联、升事件、误报归因 | 不下发高危动作 | alert 结论、incident |
| 处置响应 | `responder` | 提处置预案、执行中低危、验证、取证 | 不自行审批高危 | response_action、证据 |

并发：蓝队默认 4（研判 + 处置 + 检测 + 资产可并行），由指挥在提示词里自律；**工具级闸门（`blueteam_agent_slot`）列为 P1**，因为蓝队的并发压力远小于红队（同一条告警不会因为多派一个角色而丢）。

### 5.2 工具清单

**P0（最小闭环，13 个）**

| 工具 | 作用 |
| --- | --- |
| `blueteam_project_open` / `blueteam_session_bind` / `blueteam_session_info` | 项目与会话绑定（拒绝跨 side 绑定） |
| `blueteam_asset_import` | CSV/JSON 批量导入（CMDB 导出） |
| `blueteam_asset_profile_save` / `blueteam_asset_query` | 画像与查询（支持 criticality/env/owner 过滤） |
| `blueteam_exposure_add` / `blueteam_exposure_update` / `blueteam_exposure_list` | 暴露面 |
| `blueteam_alert_query` | 队列查询（**keyset 分页**，不接受全量） |
| `blueteam_alert_triage` | 研判（六种结论，带守卫） |
| `blueteam_incident_open` / `blueteam_incident_update` | 事件（状态机守卫） |

**P1（可用）**

`blueteam_alert_ingest`、`blueteam_alert_bulk_triage`、`blueteam_alert_suppress`、`blueteam_alert_stats`、`blueteam_incident_timeline_add`、`blueteam_action_propose`、`blueteam_action_execute`、`blueteam_action_verify`、`blueteam_baseline_check`、`blueteam_logsource_add`、`blueteam_detection_add`、`blueteam_shift_open`、`blueteam_shift_close`、`blueteam_handover_write`、`blueteam_digest`、`blueteam_score_list`、`blueteam_report`。

**P2**

`blueteam_detection_verify`、`blueteam_coverage_matrix`、`blueteam_watchlist_add/list`、`blueteam_change_add`、`blueteam_honeypot_add`、`blueteam_evidence_add`、`blueteam_reconcile_list`（只读已完成的对账）。

**工具层硬校验（与红队同构，缺一不可）**

1. 未绑定项目 → 抛错并提示 `blueteam_project_open`（**不许猜**）。
2. 绑定到红队项目 → 拒绝（跨 side）。
3. `approve` 不存在于工具集（D6）。
4. `risk>=high` 的 `execute` → 拒绝，返回"需在面板审批"。
5. 任何写操作 → 追加 `change_log(kind=表名或表名:动作)`。

### 5.3 技能库

`skills/blueteam/` 首批 12 个（教模型操作真实工具，不教"安全理念"）：

`asset-inventory`、`cmdb-import`、`baseline-check`、`exposure-triage`、`log-onboarding`、`detection-rule-writing`、`attck-coverage`、`alert-triage-playbook`、`incident-response-runbook`、`containment-actions`、`evidence-collection`、`shift-handover`。

---

## 6. 用户交互

### 6.1 入口

- **唯一入口**：左侧栏「破甲」→ 主面板新增页签 **「蓝队值守台」**（与"红队演练台"并列）。
- 不从右侧栏开新入口：右侧栏是 session 作用域，空会话不渲染（红队已踩过坑）。
- 项目 = 工作区 = 目录（与红队同构）：`enterShift(id)` = 切工作区 + 开「蓝队模式」会话；**不写草稿、不自动发消息**（用户说第一句）。
- 首次进入给"开局三件事"引导卡（导资产 → 接数据源 → 跑基线），可关闭、可跳过。

### 6.2 页签结构（9 项目页 + 2 全局页，与红队演练台同构）

| 组 | 页签 | 职责 |
| --- | --- | --- |
| 项目 | 项目中心 | 责任区卡片：状态/模式/SLA/范围/资产·漏洞·告警·事件计数 + 进入/新建/删除 |
| 项目 | 值守总览 | KPI 磁贴（未研判/超时/P0/在处置/待批/待验证/待修漏洞/暴露面/覆盖）+ 下一步建议 + 风险分布 + 最近变更 |
| 项目 | 资产测绘 | 左侧按 外网/内网 + 网段 分组，右侧资产表；点行展开画像 / 暴露面 / 基线登记 |
| 项目 | 智能体 | 四个防守角色 + 各自提示词（可改可恢复） |
| 项目 | 告警研判 | 左队列（j/k/f/p/i）+ 右详情（实体/资产/规则/SLA）+ 升事件/误报/重复/抑制 |
| 项目 | 漏洞 | 左列表 + 右详情：来源/严重级/修复证据，与红队「漏洞战果」镜像 |
| 项目 | 事件处置 | 事件列表 + 时间线 + 处置卡 + 待批 + 待验证 + 回滚 |
| 项目 | 检测覆盖 | 数据源台账 + 规则表 + ATT&CK 三色矩阵 |
| 项目 | 报告与复盘 | 技术复盘 / 管理层态势 + 红蓝只读对账 |
| 全局 | 技能库 | 随包蓝队技术技能（只读浏览） |
| 全局 | 环境适配 | 数据根 / SQLite 路径 / 预设注册状态 / 版本 / 计数 |

> 交互与红队演练台一致：项目头（名称/侧别/模式/SLA/范围/本会话绑定）+ 项目下拉 + 实时角标 + 版本 + 刷新 + 项目组/全局组页签 + 分页签错误边界 + 底部统计。

### 6.3 告警台交互（最高频，必须顺手）

**布局**：顶部 KPI 条（未研判 / 超时 / P0 / 今日事件 / 在处置）→ 左列队列表 → 右侧详情三栏（原始告警 / 实体与关联 / 处置建议与动作）。

**列表**：列 = 时间·级别·规则·实体·资产·状态·SLA 剩余·指派；默认排序 = severity → SLA 剩余；支持"按规则聚合"视图（一个规则一行，展开看样本）。

**键盘**：`j/k` 上下、`t` 真、`f` 假、`d` 重复、`i` 升事件、`a` 指派、`Enter` 详情、`Esc` 返回、`/` 搜索。批量：勾选后 Shift 区间选择。

**详情三段式**：
1. 原始：原文 JSON/CEF（折叠高亮）、时钟偏差、去重键、合并条数。
2. 实体：该实体 30 天内历史告警、关联资产画像（criticality/owner/business）、该资产已有暴露面与漏洞、是否白名单/变更窗口命中。
3. 动作：研判（六选一，必填结论）→ 升事件（自动带告警与时间线）→ 处置建议（按规则给预案模板，点击即 `propose`，高危进审批）。

**空态**：没有告警时显示"数据源状态"（哪几个 offline → 引导接入），而不是一句"暂无数据"。

### 6.4 事件处置向导（6 步）

1. **确认**：事件头（级别/类别/影响面）+ 关联告警；`triaged_at` 落定。
2. **止血**：从预案库选动作 → 填 impact / blast_radius / rollback（高危）+ 审批 → 执行 → 验证（必须贴证据）。
3. **清源**：清马、改密、吊票据、打补丁（每条动作独立审批 + 验证）。
4. **恢复**：业务确认（可勾"仅安全侧恢复"）。
5. **复盘**：根因、时间线自动汇总（四时钟 + 所有动作 + 证据）、基线回看、整改项（责任人 + 期限）。
6. **关闭**：P0/P1 强制 `postmortem_ref`。

**待办常驻**：`待批(n)`、`待验证(n)`、`冷静期中(n)` 三个角标全局可见（任何页签都能看到）。

### 6.5 交班与复盘

- **交班**：值勤页点「交班」→ 自动生成清单草稿 → 补备注 → 生成 `handover` → 下一班「接」并 `ack`。
- **复盘**：报告页「复盘对账」→ 选红队项目 → 跑对账 → 四张清单（漏报/迟报/误报/自伤）→ 一键写入报告附录 + 生成整改项。

### 6.6 实时与通知

`change_log.kind`（表名或 `表名:动作`）→ 前端频道映射：

| kind 前缀 | 频道 | 反应 |
| --- | --- | --- |
| `alert` | 告警 | 角标 +1；`severity=P0` 弹 toast + 声音（可关） |
| `alert:triage` / `alert:suppress` | 告警 | 静默刷新队列 |
| `incident` / `incident:*` | 事件 | 事件页刷新 + 待办角标 |
| `action` / `action:propose` / `action:approve` | 处置 | 待批角标 + 卡片提示 |
| `exposure` / `detection` / `shift` / `reconcile` | 对应页 | 刷新 |
| 其它 | — | 只更新角标，不刷新页面（避免抖动） |

- SSE 断开 → 角标变灰 → 15 s 轮询（复用 `live.ts`，只改频道判定）。
- 桌面通知只在 P0/P1；页面隐藏时也发。

### 6.7 异常与边界态

| 场景 | 表现 |
| --- | --- |
| 未绑定项目 | 页头提示"本会话未绑定责任区"+ 绑定按钮；工具调用返回可读错误 |
| 告警风暴 | 队列顶部黄条"规则 X 风暴中，已折叠 N 条" |
| 时钟偏差 | 黄条"设备 A 与本机相差 3 分 12 秒，MTTD 可能失真" |
| 审批被拒 | 红条 + 拒绝理由 + "重新提交"（保留原请求为 rejected 记录） |
| 执行失败/目标不可达 | 动作卡转红 + 回滚建议 + 允许标记 `partial` |
| 项目归档 | 全页只读，写按钮禁用，提示"归档项目仅可查看与导出" |
| 跨 side 误绑 | 明确拒绝："该项目属于红队侧，蓝队会话不能绑定" |

---

## 7. 端到端 SOP

**7.1 开局（30 分钟）**
建项目（名称/责任 CIDR/时区/SLA 档/模式 drill|live）→ 导入资产（CSV/CMDB）→ 补画像（criticality 必填，否则影响面算不出来）→ 登记数据源 → 跑第一轮基线（账号/端口/补丁/配置/日志/备份）→ 生成首批暴露面 → 给检测工程派活（按盲区补日志）。

**7.2 日常值守（一班 8 h）**
接班 ack → 看总览（未研判/超时/在处置/风暴）→ 清 P0/P1 → 处理 P2 积压 → 推进在处置事件与待验证动作 → 收敛暴露面（今日到期）→ 交班草稿。

**7.3 P0 事件（目标 30 min 止血）**
告警弹窗 → 5 min 内认领 → 判真 → 升事件 → 选止血动作（高危走审批，或 emergency 先斩）→ 执行 → 验证 → 通知业务方 → 清源 → 恢复 → 24 h 内复盘。

**7.4 交班（10 分钟）**
生成交接清单 → 逐条口述（在处置/待批/待验证/风险变化）→ 下一班 ack → 班次关闭。

**7.5 复盘与整改（每周/演练后）**
跑对账 → 四张清单 → 根因（人/流程/技术）→ 整改项（责任人 + 期限）→ 更新检测规则与基线 → 下一周期对比 MTTD。

---

## 8. 遗漏清单与修正（审核重点）

> 编号即建议的整改项编号；"落点"指应该改哪里。

| # | playbook 的遗漏 | 后果 | 落点 | 优先级 |
| --- | --- | --- | --- | --- |
| G1 | 没有"值守"维度（班次/交接/值班人/SLA 倒计时/升级路径） | 文档像一次性项目；实战交接靠口头，事故在班次之间丢 | `shift/handover` + 值勤页 + 通知 | P0 |
| G2 | 没有数据源台账（只有一句"接入日志"） | "检测覆盖"无从计算，盲区不可见 | `log_source` + 检测页 | P0 |
| G3 | 没有告警 ingest 规范（字段映射/批量/时钟） | 台子搭好没有告警，或时间乱导致 MTTD 为负 | `ingest.js` + 映射模板 | P0 |
| G4 | 降噪只写"三招"，没有顺序/dedup_key/风暴抑制 | 真实 SOC 第一条告警就是风暴；抑制规则互相打架 | §4.1 四闸 | P0 |
| G5 | 误报只扣分，没有"误报→归因→调规则→复测"闭环 | 同一个规则误报一整年 | `fp_cause` + 规则 fp_rate + 调优清单 | P1 |
| G6 | 自伤只有原则，没有机制（审批人/冷静期/恢复 SLA/冲突检测） | "不能自伤"落不了地 | `response_action` 字段 + 面板双重确认 + 冷静期 | P0 |
| G7 | 无审批模型（谁批、几级、能否自动批、拒绝后怎么办） | 高危动作要么卡死要么裸奔 | §4.4 + **AI 不能自我审批** | P0 |
| G8 | 处置动作没有作用域（方向/端口/范围/隔离 vs 封禁 vs 改密） | 影响面无法评估，回滚无法执行 | `kind/direction/scope/impact/blast_radius` | P0 |
| G9 | MTTD/MTTR 定义混装"机器发现"与"人确认" | 指标失真，跨周期对比无效 | 四时钟（§4.3） | P0 |
| G10 | 漏报无法自证（蓝队库里没有红队做过什么） | 扣分项永远算不出来 | 对账通道（§4.9） | P1 |
| G11 | 业务影响不可量化（只有 criticality 一列） | "误封核心业务"无法机器判定 | `asset_profile`（business/users/RTO/RPO/compliance） | P0 |
| G12 | 证据链缺失（hash/保管人/只读） | 取证材料不可信，监管场景过不了 | `shot` 扩展 + sha256 + 只读目录 | P1 |
| G13 | 蜜罐/蜜标只是一句"可选" | 最高置信度的告警源没有对象 | `honeypot/decoy_hit` → 自动 P0 | P2 |
| G14 | 分级与 SLA 没绑定升级路径 | P0 超时后没人知道该找谁 | `escalation` 规则 + 通知 | P1 |
| G15 | 防守成果缺"前后对比"证据（封禁/隔离/改密） | 无法证明"处置有效"，也无法回滚验证 | `verify_evidence_ref` 强制 + 对比截图 | P1 |
| G16 | 没有跨周期趋势（只有单次报告） | 蓝队价值无法体现（MTTD 降了多少） | `metric_daily` + 趋势图 | P2 |
| G17 | 名单没有过期机制 | 白名单/黑名单烂掉，降噪失效或误封 | `watchlist.expires_at` + stale 提醒 | P1 |
| G18 | 没有角色分离（requestor/approver/operator） | "双人复核"无法记录 | 三个字段 + 面板交互 | P0 |
| G19 | 多会话隔离只对红队写了，蓝队同构没提 | 值班/复盘/演练并行时串项目 | 复用绑定 + 跨 side 拒绝 | P0 |
| G20 | "不能自伤"与"必须快"冲突时没有仲裁规则 | P0 现场要么延误要么违规 | emergency + 24h 补审（§4.4） | P0 |
| G21 | 没有演练/实战双模式 | 演练可以激进、实战必须保守，策略混用 | `engagement.mode=drill|live` 驱动审批与计分 | P1 |
| G22 | 面板缺大屏/通知/键盘/批量/红点 | 值守体验撑不住 8 小时 | §6.3/6.6 | P1 |
| G23 | 告警数据量没设计（几十万行） | 面板卡死（红队 `listX` 模式是全量+JS 过滤） | keyset 分页 + 索引 + 日聚合 | P0 |
| G24 | 告警原文没地方放 | 复盘规则时没有样本 | `alerts/YYYYMMDD/` + `raw_ref` | P1 |
| G25 | 时区/时钟没处理 | 多设备告警时间不可比 | `tz` + `clock_skew_ms` + 黄条 | P0 |
| G26 | 实体模型缺失（IP/域名/账号/哈希不统一） | 没法回答"这个 IP 关联了哪些告警与事件" | `entity_kind/entity_id` + 索引 | P0 |
| G27 | 检测规则没有生命周期与回归 | 规则上线即腐烂 | `status` + `last_verified_at` + 90 天复验 | P1 |
| G28 | 报告没区分读者（管理层/技术/监管） | 一份报告三种人都不满意 | 三模板 | P2 |
| G29 | "互不可见"与"必须对账"的矛盾没解决 | 要么串库，要么无法复盘 | 对账通道（受控、只读、人工触发） | P1 |
| G30 | 没有"蓝队失败"的判定 | "守住"无法定义，得分没有底线 | 失守判定（§4.10） | P1 |

---

## 9. 实施路线（文件级）

### P0 · 骨架（可建项目、能进值守、能看到一条告警闭环）

```
lib/redteam/store-core.js        改 5 处：side profile 注入（roles / prompts / ddl / seed）、
                                 db() 追加 BLUE_DDL、openEngagement 写 side、
                                 stats/snapshot 带 side、dispatch 透传 side
lib/blueteam/
  schema-blue.js                 BLUE_DDL + migrateBlue（含 shot 补三列）
  store.js                       new RedteamStore(blueRoot, {side:'defense'}) → ctx.blueteam
  store-blue.js                  BlueteamStore：alert/incident/action/exposure 方法
  prompts.js                     五角色默认提示词
  ingest.js                      字段映射 + 去重键 + 时钟归一（P0 只支持 JSON/CSV）
  tools.js                       P0 的 13 个 blueteam_* + 绑定/闸门
  ui.js                          POST /blueteam/api + GET /blueteam/api/events
  index.js                       预设安装 + 技能同步 + 注册 blueteam preset
  score-rules-blue.js            BLUE_POINTS + evaluateBlueBoard（先只算覆盖/时效/收敛）
presets/blueteam/agent.cordis.yml 蓝队指挥人格 + blueteam-tools 行 + 技能根
presets/blueteam/preset.yml       name: 蓝队模式
presets/blueteam/anchor-gate.mjs  复用红队实现（复制一份，先不抽象）
package.json                      exports: ./blueteam{,/store,/ui,/tools}
cordis.patch.yml                  insert 三行（preset-boot / store(root=blueteam) / ui）
src/client/main/nav.ts            MainTab += 'blueteam'
src/client/main/PurgeMain.tsx     页签 + 渲染 BlueTab
src/client/blue/{BlueTab,AlertsTab,IncidentsTab,ProjectsTab,OverviewTab}.tsx
src/client/blue/{api,live,locale,styles}.ts   （api/live 可直接按 base path 参数化复用）
```

验收：建项目 → 进会话 → 导入 3 条资产 → 手工 ingest 1 条 P0 告警 → 研判为真 → 升事件 → 提一条 mid 动作 → 执行 → 验证 → 事件 contained。全程面板与工具两条路径都能走。

### P1 · 可用（值守真能上）

shift/handover、baseline/exposure 自动联动、watchlist/change、detection 规则与覆盖矩阵、批量研判与批量指派、审批与冷静期、报告三模板、对账、通知与键盘、keyset 分页、告警原文留存。

### P2 · 工程化

metric_daily 与趋势、大屏、规则回放复验、蜜罐/蜜标、依赖传导（`edge` → blast radius）、报警声音策略、导出（md/html/pdf）、跨周期对比、i18n 全量。

### 与红队共用的改造（风险点）

- `RedteamStore` 五处小手术必须**默认值不变**：`new RedteamStore(root)` 行为与今天字节级一致（`side='offense'`）。
- 不改 `presets/redteam` 与 `skills/redteam`；新 preset 单独目录。
- `bindings.js` 不改（按 root 实例化，天然支持两个根）。
- `settings.js` 不改（蓝队用 `blueRoot/settings.json`）。

---

## 10. 测试与验收

新增 `test/blue-rules.mjs`（Node，无需宿主）：

1. `BLUE_DDL` 幂等：连续两次 `migrateBlue` 不报错、不重复列。
2. 状态机守卫：incident 不能从 open 直接 closed；alert 不能 confirmed 而无 incident。
3. 时间戳单调：contained_at < detected_at 被拒。
4. SLA：P0 5 min / P1 15 min / P2 60 min 计算正确；超时标 escalated。
5. 去重：同 dedup_key 10 分钟内合并 count、不同 source 不合并。
6. 风暴：60s 内 150 条 → 折叠为 1 条代表 + 1 条 meta 告警。
7. 审批：模型调用 `execute(risk=high)` 被拒；`approve` 不在工具表里。
8. 自伤：无 rollback_plan 的 high 动作 `propose` 被拒。
9. 评分：给定构造数据，覆盖/MTTD/收敛/自伤各项与手算一致；封顶生效。
10. 隔离：蓝队 store 读不到红队项目；跨 side 绑定被拒。
11. 对账：只读打开红库（写试探必须失败）；verdict 分类正确。

人工验收清单：8 h 值守模拟（构造 200 条告警 + 3 个事件 + 1 次交班），面板不卡、无漏刷新、无串项目。

---

## 11. 风险与待决

### 11.1 风险

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| store-core 改造引入红队回归 | 红队不可用（最严重） | 只加可选参数；`side` 默认 offense；回归跑 `test/next-rules.mjs` + 红队手工冒烟 |
| 告警量导致面板卡顿 | 值守不可用 | keyset 分页 + 索引 + 日聚合；禁止 `listX` 全量模式 |
| 计分口径争议 | 报告不被认可 | 规则版本化 + 每条可展开到 SQL 明细 |
| 审批在单机上名存实亡 | 自伤风险 | 面板双重确认 + requestor/approver 记录 + 24h 补审 |
| 对账通道被滥用 | 隔离失效 | 只读 + 仅面板 + 每次写 reconcile 留痕 |

### 11.2 回滚

- 代码：蓝队全部新增文件；删掉 `lib/blueteam`、`presets/blueteam`、`src/client/blue` 并回退 `cordis.patch.yml`/package.json 三行即恢复。
- 数据：`$DSH_HOME/blueteam` 独立目录，整删即净。
- store-core 五处改动可用单一 commit 回退（红队默认路径无行为差异）。

### 11.3 需要你拍板的 8 个点

1. **入口**：蓝队作为主面板新页签（我的建议），还是左侧栏独立图标（第二个入口）？
2. **数据根**：`$DSH_HOME/blueteam`（建议）还是 `$DSH_HOME/redteam/blue`？
3. **演练/实战双模式**：一期就加 `mode`（建议，审批策略不同），还是二期？
4. **告警接入**：先做通用 CSV/JSON 映射（建议），还是直接对接某家 EDR/SIEM（需要你给导出样例）？
5. **SLA 默认值**：5/15/60/当日（标准档）是否符合你们的口径？
6. **审批人**：单机只有一个用户时，是否接受"同一人两次确认 + requestor/approver 记录"作为双人复核的替代？
7. **对账触发**：只允许面板（建议），还是也给模型一个"申请对账"的工具？
8. **评分对齐**：是否要对接某份官方评分表（红队有《突破入侵类得分规则》），还是按本文 §4.10 自定义？

---

## 附录 A · API 与契约

```
POST /blueteam/api   {op, ...}
  项目：bootstrap / projects / openEngagement / updateEngagement / deleteEngagement /
        activateEngagement / bindSession / bindings / snapshot / consoleDigest
  资产：assets / asset / assetProfileSave / exposure* / baseline* / watchlist* / change*
  检测：logSources / detectionRules / coverageMatrix
  告警：alerts（分页）/ alert / alertIngest / alertTriage / alertBulkTriage / alertSuppress / alertStats
  事件：incidents / incident / incidentOpen / incidentUpdate / incidentTimelineAdd
  处置：actions / actionPropose / actionApprove / actionReject / actionExecute / actionVerify /
        actionRollback / actionForce
  值勤：shiftCurrent / shiftOpen / shiftClose / handovers / handoverWrite / handoverAck
  复盘：reconcileRun / reconcileList / report / scoreList
  其它：digest / settings / version / drillDoctor / presetRepair
GET /blueteam/api/events?engagement=<id>&since=<seq>
```

## 附录 B · 与红队组件复用矩阵

| 组件 | 处理 | 说明 |
| --- | --- | --- |
| `bindings.js` `settings.js` `shared/atomic.js` | 原样复用 | 按 root 实例化 |
| `store-core.js` | 五处小手术 | side profile 注入 |
| `score-rules.js` | 不改 | 蓝队新写 `score-rules-blue.js` |
| `ui.js` `tools.js` | 复制骨架后分叉 | 逻辑差异大，强行合并会更难读 |
| `preset-composition.js` `anchor-gate.mjs` | 复制 | P2 再抽公共 |
| `src/client/redteam/{bits,styles,api,live}` | 参数化复用 | api/live 增加 basePath 参数 |
| 面板页签组件 | 分叉 | 红队"攻击链/战果"对蓝队无意义 |

---

## 12. 红蓝交手：红队做什么，蓝队看到什么、做什么

这是"攻防演练"里真正会发生的事。下表把**红队动作 → 蓝队可观测信号 → 插件里的具体操作**对齐；同一行既是防守 SOP，也是复盘对账的判定依据。

| # | 红队动作 | 蓝队可观测信号（真实世界） | 插件里怎么做 | 时效目标 |
| --- | --- | --- | --- | --- |
| 1 | 端口/目录扫描（T1595） | WAF/IDS 大量 404、连接数激增、单 IP 高频 | `blueteam_alert_ingest`（规则 WAF-404）→ 研判 → 命中白名单就抑制；不抑制则 `block_ip`（中危，可直接执行） | P2 1h |
| 2 | 公网应用漏洞利用（T1190） | 异常请求体、命令回显、WAF 拦截日志 | 告警升事件 → `isolate_host` 或 `patch`（高危/变更，走审批）→ 验证 | P0/P1 30min 止血 |
| 3 | WebShell 落地 | 新增 .jsp/.php 文件、w3wp→cmd 进程链 | 事件 → `remove_shell` + `kill_process`（中危）→ 验证（文件不存在、进程消失）→ 基线回看"上传为什么没拦住" | P0 30min |
| 4 | 隧道建立（T1090） | 异常长连接、DNS 隧道特征、非业务端口外连 | 告警 → `block_ip`（出向）→ 查跳板；隧道主机 `isolate_host` | P1 2h |
| 5 | 凭据转储（T1003） | lsass 访问、SAM 读取、EDR 高危告警 | 事件 → `rotate_credential` + `revoke_ticket`（高危，审批）→ 验证"旧凭据登录失败" | P0 1h |
| 6 | 横向移动（T1021/T1570） | 内网 SMB/WinRM 异常、PsExec 服务创建 | 分段隔离 + `disable_account`（审批）+ 查被控账号；在 `asset_profile` 里看影响面 | P1 2h |
| 7 | 持久化（T1547/T1053） | 新建计划任务/服务、启动项变化 | 告警 → `kill_process` + 清持久化 → 基线回看"账号/配置为什么允许" | P1 |
| 8 | C2 回连（T1071） | 固定间隔外连、罕见域名、证书异常 | 封域名/封 IP（出向）+ 情报名单 `watchlist(black)` | P1 |
| 9 | 数据外带（T1567） | 大流量外发、非工作时段、云盘/网盘 | 优先止血（`block_ip`/`isolate_host`），再评估数据分级与合规上报 | P0 |
| 10 | 钓鱼（T1566） | 邮件网关告警、员工上报、异常登录 | 封发件域、重置受害账号、全员通告；`credential` 记受影响账号 | P1 |
| 11 | 供应链/云入口（T1195） | CI/CD 变更、AK/SK 异常调用、容器逃逸告警 | 登记为暴露面 + 变更窗口；处置走变更审批，不直接下线 | P2 |
| 12 | 已被拿下但没告警（漏报） | **没有信号** | 复盘对账 `missed` → 记分板扣分 → 补日志/补规则 | 复盘时 |

**交手时的三条铁律**（写进蓝队预设人格）：

1. **先止血再溯源**：P0 已确认入侵允许"先斩后奏"（`emergency` + 理由），24 小时内补审；否则一律先审批。
2. **不确定就缩小动作范围**：单 IP 优于整段，单账号优于全域，隔离优于下线。
3. **每个动作都要能回滚、能验证**：没有 `rollback_plan` 不许提，没有 `verify` 不算完成。

## 13. 用户使用流程（三条主线）

**主线 A · 值守（每天）**
蓝队值守台 → 项目中心（或直接进上次的项目）→ 值守总览看"下一步建议" → 告警台清 P0/P1 → 事件处置推进 → 值勤交接写交接单 → 关班。

**主线 B · 处置（P0 来了）**
告警弹出（SSE）→ 5 分钟内认领 → 判真 → 升事件 → 提动作（高危等审批）→ 执行 → 验证 → 止血 → 清源 → 恢复 → 复盘关闭。

**主线 C · 复盘（每周/演练后）**
报告与复盘 → 生成技术复盘/管理层态势 → 红蓝对账（填红队项目 id）→ 看命中/迟报/漏报 → 把整改项写回报告 → 更新规则与基线 → 下一周期对比 MTTD。

---

**一句话总结**：红队与蓝队是两条平行线；playbook 的业务判断可用，但要落地必须补三样东西——**台账（数据源/规则/资产画像）、时钟（四时钟 + SLA）、闸门（去重/审批/冷静期）**，再补一条**受控的对账通道**。这一版已经把这三样 + 对账通道写进代码，红队那条线零改动。
