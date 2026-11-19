# 红队演练 · 能力体检（生成于 2026-11-19）

## 1. 预设与人格

| 项 | 状态 |
| --- | --- |
| 预设 id / 名称 | `redteam` / 红队模式 |
| 注册状态 | `ok: true`, `phase: registered`, `broken: null` |
| 插件行数 | 19 |
| 指挥人格 | `dsh-persona` prefix（指挥职责硬约束 + 派活规则） |
| 锚点门 | `anchor-gate.mjs`：bootstrap 阶段限输出，避免首轮空转 |

## 2. 角色提示词（6 份，全部有正文）

| 角色 | 标题 | 落盘 |
| --- | --- | --- |
| plan | 主会话（指挥） | `agents/plan.md` |
| recon | 信息收集 | `agents/recon.md` |
| assess | 资产梳理 | `agents/assess.md` |
| vuln-scan | 漏洞发现 | `agents/vuln-scan.md` |
| exploit | 漏洞利用 | `agents/exploit.md` |
| internal | 内网渗透 | `agents/internal.md` |

提示词里已写入：记分纪律（25 条规则 + 权限取高 + 规则上限）、先查库再打、证据要求、交接格式、叶子节点约束。

## 3. 模型工具（57 个）

资产/测绘：`asset_add` `asset_query` `asset_get` `asset_assess` `asset_test` `asset_graph` `asset_link` `asset_next` `asset_stats` `asset_timeline` `scan_import`

漏洞/利用：`vuln_add` `vuln_query` `vuln_update` `credential_add` `credential_list` `access_add` `access_list` `webshell_add` `webshell_list` `webshell_update` `tunnel_add` `tunnel_list` `tunnel_update` `sessions` `session_check` `http_evidence_add` `web_list` `domain_index` `attack_file_add` `attack_file_list` `attack_path`

攻击链/得分：`chain` `chain_add` `score_list` `score_hit` `score_report` `score_point_save`

编排/绑定：`preflight` `engagement_open` `engagement_digest` `session_bind` `session_info` `agent_slot` `roles` `role_prompt` `role_prompt_reset`

知识库：`poc_search` `poc_get` `poc_add` `poc_list` `poc_update` `poc_use`

## 4. 知识库（两级）

| 层级 | 位置 | 内容 | 生命周期 |
| --- | --- | --- | --- |
| 项目级 | `<项目数据目录>/assets.db` 的 `poc` 表 + `<项目数据目录>/pocs/` | 本次演练沉淀的 POC/EXP/脚本 | 随项目删除，天然隔离 |
| 全局级 | `$DSH_HOME/redteam/knowledge.db` + `redteam/pocs/` | 跨项目复用的经验 | 长期保留 |

- 写入：`redteam_poc_add` 默认 `scope=project`，通用经验用 `scope=global` 再存一份。
- 检索：`redteam_poc_search` 默认 `scope=all`（先项目、再全局，按 code 去重），结果带 `scope` 字段。
- 索引：SQLite FTS5（`poc_fts`），无 FTS5 的 Node 构建自动降级 LIKE。
- 向量：暂不引入。POC 检索维度是产品/版本/CVE/类别等结构化字段，FTS 命中率更稳且零运维；向量只在"相似历史战报"这类语义检索上才有增量价值。

## 5. 项目 / 工作区 / 会话

- 项目 = 一个数据目录（可自定义，默认 `$DSH_HOME/redteam/engagements/<id>`）= 一个 DSH 工作区（标题「攻防演练 · 名称」）。
- 「进入演练」= 切到该项目工作区并打开红队会话；「新建对话」= 在同一工作区再开一个。
- 会话绑定写在 `session-bindings.json`，子智能体继承父会话绑定；一个会话只写一个项目。

## 6. 已知宿主限制

- 左侧栏工作区的「新建会话」按钮使用**设置里的默认模式**（PTC），插件无法改它的默认预设；在演练工作区里请用破甲面板「新建对话」或会话输入框旁的「＋」。
- 工作区列表不向插件暴露"当前选中工作区"，因此无法按工作区自动切换默认预设。
