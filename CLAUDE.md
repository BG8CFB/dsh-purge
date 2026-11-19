# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目定位

dsh-purge 是 DSH（DeepSeek Harness，Cordis 插件体系）的"破甲"红队评测插件，**v2.1.0 起为双路线单包架构**：

- **NEXT 路线**（`lib/next/`，宿主 core ≥ 0.2.2）：纯插件，零宿主文件写入，全部走官方扩展点（`cordis.patch.yml` 配置层 + systemPrompt 段/瀑布 + approval 与 tools 事件监听器）。
- **legacy 路线**（`lib/legacy/`，宿主 0.1.7-rc.2 ~ 0.2.1）：磁盘补丁（82 条，解 asar + 字符串替换 + `.dshpurge.bak` 备份）。
- `lib/index.js` 是**薄入口**：`detectHostGeneration()`（`DSH_PURGE_ROUTE` 强制 → `@deepseek-ai/dsh-app-boot` 版本解析 → 兜底 next）决定动态 import 哪条子路线。NEXT 进程内绝不 import legacy/core.js。

## 常用命令

```sh
# 语法/导入校验（CI 同款）
node --check lib/index.js && node --check lib/legacy/core.js && node --check lib/next/index.js
node --input-type=module -e "import './lib/index.js'"

# NEXT 路线测试套（rc.3 真实文案锚点；文案漂移会先在这里红）
node test/next-rules.mjs

# 蓝队事实库（状态机 / 审批闸门 / 漏洞闭环 / 只读对账，37 项）
node test/blue-store.mjs

# 前端构建 + externals 纯度校验（tsdown 双 face：产物 dist/client.js）
npm run build:client

# 客户端渲染冒烟（无浏览器：apply + 每个槽位首屏渲染，挡"面板点不开"）
node test/client-render-smoke.mjs

# 加密默认提示词重封印（改 lib/default-prompt-inject.md 后）
npm run embed-prompt
```

发布：改 `package.json` 版本 → `release-notes.md` 首行必须 `# <版本>`（CI 强制）→ 推 master 自动出 Release。**人格提示词内容（加密槽）按用户要求保持原样，不做"改进"。**

## 架构地图

```text
lib/index.js        薄入口（代际分派）
lib/shared/         两路线公共设施：home（DSH_HOME 解析）/atomic（原子写）/override
                    （prompt-inject 状态机）/persona-slot（AES 加密槽，openSlot）/
                    host-version（detectHostGeneration）/zip-extract
lib/next/           NEXT 纯插件：persona（order1+interpolate:false+四级回退）/rules
                    （sections+contexts 双遍历改写+具名 context 替换+失配自检）/gates
                    （approval prepend→allowed-once、pre-execute prepend→allow）/
                    tools-face（post-execute 结果中性化）/commands/http/modules
lib/legacy/         v1 磁盘补丁引擎（core.js ~8000 行 82 补丁 + asar/重启/自更新），
                    打击目标按代际过滤（≥0.2.2 安装剔除），settle 在 NEXT 上双重门禁
lib/redteam/        红队演练台（两路线共用，零 core.js 依赖）：store-core（node:SQLite）+
                    schema + tools（redteam_* 工具）+ ui（/redteam/api 桥）+ 评分
lib/blueteam/       蓝队值守台（与红队平行的第二条线，只做技术面）：store-blue（extends
                    RedteamStore，side=defense）+ schema-blue（12 张蓝队表）+ tools（blueteam_*）+
                    ui（/blueteam/api，审批只在这里）+ 预设自举 + 报告/只读对账
src/                前端源码（tsdown 构建 → dist/client.js，官方槽位形态）
src/client/main/    全局主面板（main 槽位，root 作用域）：总览 / 红队演练台 / 蓝队值守台
                    （全局配置只在 settings.section，面板 ⚙ 深链，不重复渲染）
src/client/blue/    蓝队页签（与红队同构：项目组 9 页 项目/总览/资产测绘/智能体/告警研判/
                    漏洞/事件处置/检测覆盖/报告 + 全局组 技能库/环境适配）
presets/redteam/    红队预设（指挥人格 + 五角色 + anchor-gate）
presets/blueteam/   蓝队预设（值守指挥 + asset/detection/triage/responder + anchor-gate）
skills/redteam/     23 个红队技能（教模型操作第三方 CLI 的手册）
skills/blueteam/    7 个技术技能（研判/处置/基线/检测/资产/漏洞/对账）
```

## rc.3 关键语义（写代码前必知，反直觉处已踩过坑）

- `approval policy: never` = **派发前确定性拒绝**（官方防监听器旁路）——必须 `ask` + prepend 监听器 `allowed-once`。
- **fs-sandbox 不可禁用**：它是 ctx.fs 唯一提供者，禁了文件工具全灭；全开只需 `sandbox-policy: danger-full-access`（该模式本就无围栏）。
- assemble 瀑布载荷 `{sections, contexts, variables}` **不含 tools**；审批/沙箱/子代理/Web 表层话术在 **contexts** 里；人格段必须 `interpolate:false`（严格插值遇未注册 `{{x}}` 会炸轮）。
- permission 行 danger-full-access 档的 approval 必须同改 ask（防新会话播种拒绝链）。
- web-app bundle 把 agent 面工具行挂进 preset-standard `config.plugins`，外层 patch 按 id 覆盖打不进去——工具面改行走运行时 seam。
- NEXT 官方前端槽位齐全（116 个）；client 面板经 `package.json → dsh.client`（嵌套键）+ `exports['./client']` 被 clientModules 收录。
- **`sidebar.right.pane.tab` 的分发键是页签类型定义的 `id`，不是 `kind`**：body 的 `key` 与 register 时的 `id` 不同名 → 页签能打开但没有 body（表现为白屏/"无法查看"）。
- **`sidebarRight.openTab` 是 session 级命令**：无 on-screen 会话时 throw。要"新会话也能用"的入口必须挂 `main`（root 作用域）+ `sidebar.panellist`（root 作用域图标），切换用 `ctx.get('layout').selectPanel(id)`。
- **主题 token 语义**：`--dsw-alias-brand-primary` 在暗色主题是中性近白色，不是品牌蓝；实心按钮用 `--dsw-alias-button-info-fill` + `--dsw-alias-label-on-color`。`--dsw-alias-label-error`/`--dsw-alias-fill-l1` 已不存在（用 `state-error-primary`/`interactive-bg-hover`）。
- **`useSyncExternalStore` 的 `getSnapshot` 必须返回稳定引用**：每次新建对象 → 无限重渲染（面板白屏/卡死的经典成因）。
- **红队预设在 rc.3 上会 registered-broken**（模式下拉里看不到「红队模式」）：`list-agents` 子入口已并入 `tool-subagent-control`（无 exports）；`toolFilter` / `backgroundMode` / `modelSelectionSettings` 均已移除。`lib/redteam/index.js` 的 `repairRc3Schema()` 在每次 apply 时对用户预设就地自愈；`ctx.redteamPreset` 暴露 `status()/reregister()`，`/redteam/api` 的 `drillDoctor` / `presetRepair` 供面板做就绪检查与一键修复。
- **子智能体不是"调用"出来的**：指挥用 `subagent` 工具按角色派发；`redteam_*` 工具随「红队模式」预设注入，预设没注册时工具根本不存在——所以"红队模式"能否出现在模式下拉里，是整条链路的前置条件。
- **全局面板是发射台，不是工作台**：`startDrill` 用 `uiWorkspace.startSession({ agentPreset: 'redteam', prompt })` 建会话，随后 `layout.selectPanel(null)` 关闭面板回到对话；绑定由全局 current 指针在首个工具调用时自动完成。
- **红蓝是两条平行线，不是一个项目两侧**：各自的数据根（`$DSH_HOME/redteam` / `$DSH_HOME/blueteam`）、绑定文件、工具集、预设、HTTP 桥、页签。一个会话只拿到自己那侧的工具（注册层隔离，不靠提示词）。
- **蓝队在基类上的扩展点只有四个**：`roleTitles()` / `defaultPrompts()`（角色集不同）、`extendDb()`（追加蓝队 DDL）、`seedScorePoints()`（空实现，不种红队得分点）；再加 `openEngagement()` 写 `side/mode/sla_profile`。红队默认路径行为不变。
- **审批只存在于面板**：`actionApprove/actionReject/actionForce` 是 `/blueteam/api` 的 op，`tools.js` 里没有对应工具——模型无法自己批准高危动作。改这条等于拆掉自伤防线。
- **对账是唯一跨库通道**：`runReconcile` 以 `readOnly: true` 打开红队库，只在面板触发；模型只有 `blueteam_reconcile_list`（只读结果）。

## 历史包袱（有意保留，勿"顺手清理"）

- legacy 与 shared 各有一份 home/atomic/override 实现：legacy 版 hostFs 感知（穿透 asar 遮蔽），shared 版纯 node:fs——**有意不合并**。
- skills/redteam 内的操作纪律（授权范围确认、限速防打崩、失败放弃规则）是刻意保留的运行边界，不是待删护栏。
- hooks-deny.js 是 legacy 补丁机制（deny→allow 旁路的可逆实现），不是护栏。
- `docs/redteam-upstream-DISCLOSURE`/`redteam-upstream-LICENSE` 是上游署名义务，不动。

## 提交风格

conventional 前缀（fix/feat/release/docs/chore/perf）+ 中文描述。
