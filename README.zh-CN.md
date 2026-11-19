# dsh-purge（DSH 破甲插件）

**v2.21.1 · 双路线架构**：一个包同时服务两代宿主——

- **DSH NEXT（core 0.2.2-rc.3 及以上）→ 纯插件路线**：不写任何宿主文件，人格/审批/沙箱/话术全部走官方扩展点（`cordis.patch.yml` 配置层 + 运行时监听器）。官方更新宿主后插件照常工作，无需重新应用。
- **老宿主（dsh 0.1.7-rc.2 ~ 0.2.1）→ 磁盘补丁路线**：沿用既有的 asar 解包 + 字符串替换 + `.dshpurge.bak` 备份机制，行为与 1.1.x 一致。

安装后由插件入口在运行时探测宿主代际自动分派，`DSH_PURGE_ROUTE=next|legacy` 可强制指定（调试用）。

## 署名要求

**借用本项目的名称、思路、代码或提示词，必须署名，并写明来源仓库：** [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge)。本插件内嵌的上游红队组件署名见 `docs/redteam-upstream-DISCLOSURE` 与 `docs/redteam-upstream-LICENSE`。

## 安装

> **别按包名装。** npm 上的 `dsh-purge` 是第三方占位包（历史上只发过 `0.0.0-stage`，空壳），`dsh plugin add dsh-purge` 拿到的不是本仓库代码，装完宿主里什么都没有——这是"装不上"的头号原因。本仓库的代码只从 GitHub 装。

从本仓库 `master` 分支装（当前 **2.21.1**，含 NEXT 纯插件路线 + 红蓝两条台）：

```sh
# DSH NEXT（桌面 2.0.23-next 及以上）
dsh plugin --profile desktop add https://github.com/BG8CFB/dsh-purge/archive/refs/heads/master.tar.gz

# 官方 dsh web（NEXT 代 core）
dsh plugin --profile web add https://github.com/BG8CFB/dsh-purge/archive/refs/heads/master.tar.gz

# 老宿主（0.1.7-rc.2 ~ 0.2.1）：同命令安装后，在面板「清洗」里点「应用」打磁盘补丁
```

- 等价写法：`add github:BG8CFB/dsh-purge`（pnpm 的 git 规格，需要能连 GitHub）；源码就在本地时直接 `add <本仓库路径>`。
- **装完先核对版本**：安装目录里 `package.json` 的 `version` 应是 `2.21.1`。若还是 `1.1.71`，说明拿到的是旧默认分支，先 `dsh plugin --profile desktop remove dsh-purge`（`desktop` 换成你用的 profile）再按上面的 tarball 重装——`1.1.71` 只有老宿主磁盘补丁路线，在 NEXT 上跑不起来。
- Node.js ≥ 22（老宿主无闪窗增强需 ≥22；engines.dsh 已放宽到 `>=0.1.7-rc.2 <0.3.0`，两代都能装）。
- **NEXT 路线装完即生效**（重启宿主一次加载插件即可，没有"应用/还原"步骤）；老宿主路线仍走面板「应用 → 自动重启」。

## 使用

**先读 [docs/howto-zh.md](docs/howto-zh.md)**（3 分钟上手：怎么新建红队会话、智能体怎么被调用、绑定语义、标准五步）。

作战与防守的业务基准：

- [docs/redteam-playbook.md](docs/redteam-playbook.md)：红队作战手册（授权基准、五角色、攻击链与 ATT&CK、与蓝队交战、记分、证据、沉淀）
- [docs/blueteam-playbook.md](docs/blueteam-playbook.md)：蓝队防守手册（防守优势、五阶段、告警链路与实时性、名单体系、自伤约束、蓝队计分、智能体设计）
- [docs/blueteam-design.md](docs/blueteam-design.md)：**蓝队模式设计与实现说明**——两条平行线的定位、数据模型、告警/事件/处置状态机、四时钟与 SLA、红蓝交手剧本、交互流程、遗漏清单（G1–G30）
- [docs/howto-blue.md](docs/howto-blue.md)：**蓝队值守 3 分钟上手**（建项目 → 进值守 → 开局三件事 → 研判/处置/交班/复盘）

```sh
# 聊天命令（两代一致）
/purge status     # NEXT：注入来源/宿主版本/开关；legacy：补丁清单与进度
/rules list | use <id> | create <id> | delete <id> | reset
/skills list | import <路径> | create <id> | delete <id>
/rewind [once|round]

# CLI（legacy 磁盘补丁操作；NEXT 路线无需）
dsh-purge --status | --apply | --revert | --uninstall | --edit

# 模型工具
purge_status
```

**面板（NEXT 官方形态，v2.2.0 起）**：主工作台是左侧栏「破甲」全局面板（`main`，root 作用域，与「插件 / 自动化任务」并列）——三个页签：**总览**（开工检查：路线 / 宿主 core / 注入来源与字节 / 人格文件 / 版本，以及项目选择与进入演练）、**红队演练台**（全宽工作台：项目中心 / 资产测绘 / 环境适配 / 智能体 / 会话隧道 / 漏洞战果 / 攻击链 / 得分 / 报告 / 知识库 / 技能库）、**蓝队值守台**（防守侧：项目中心 / 值守总览 / 资产与暴露面 / 漏洞 / 告警台 / 事件处置 / 检测覆盖 / 智能体 / 报告与复盘）。

**全局配置只在一个地方**：人格编辑 / 规则集 / 技能 / 更新通道都在「设置 → 破甲」分区（右下角头像 → 设置）；破甲面板右上 ⚙ 一键深链过去。以前面板里还挂着第三个页签渲染同一份设置，等于一张表单两处入口，已删除。

**新会话同样可用**：`main` 是 root 作用域，不需要 on-screen 会话；右侧栏页签是 session 作用域，空会话时不渲染，不能当作主入口。

**项目（engagement）= 靶标工作区**（v2.3.0）：

| 层 | 范围 | 内容 |
| --- | --- | --- |
| 项目 | 每项目独立目录 + SQLite | 资产 / 端口 / 指纹 / 漏洞 / 凭据 / WebShell / 隧道 / 攻击链 / 得分 / 截图 / 报告 |
| 全局 | 跨项目共享 | 知识库（POC/模板）、技能库、环境适配、智能体角色提示词模板 |

演练台第一页是**项目中心**：卡片显示每个项目的状态、授权范围、阶段得分进度、资产/漏洞/得分、最近活动、绑定会话数；新建项目（名称 + CIDR + 目标说明）后直接进入工作台。工作台顶部固定"项目头"，显示当前项目与本会话的绑定状态（绑定/解绑），页签分为**项目组**（项目中心 / 总览 / 资产测绘 / 智能体 / 会话隧道 / 漏洞战果 / 攻击链 / 得分目标 / 报告）与**全局组**（知识库 / 技能库 / 环境适配）。

会话绑定落盘在 `$DSH_HOME/redteam/session-bindings.json`（键 = 根会话 id，子智能体共享父会话的绑定，500 条 FIFO）。绑定后本会话的红队工具只读写该项目，多会话并行不会串库；右栏「dsh-purge」页签可随时切换/解绑本会话的绑定。

会话内另有两个轻量入口：右侧栏「dsh-purge」页签（本会话进度 + 绑定/解绑 + 回退一轮 + 打开演练台）与输入框「↩ 回退」按钮；会话头「dsh-purge」徽章直接跳到全局面板。确认类操作（删项目 / 删规则 / 切通道）统一走插件自己的确认框，不再用宿主原生 `window.confirm`。

**红队模式**：会话预设选「红队模式」→ 指挥智能体先 `redteam_preflight` 预检 → 开靶（`redteam_engagement_open`）→ 按五角色（recon / assess / vuln-scan / exploit / internal）派活。新工具：

- `redteam_engagement_digest`：一次往返拿到靶标总览（阶段 / 得分 / 最近变更 / 缺证据 / 建议下一步），指挥收尾核对靠它；
- `redteam_scan_import`：把 runs/ 下的 gogo / fscan / nuclei 原始输出导入资产库（草稿态 candidate），落库从纪律变默认；
- `redteam_asset_next`：下一条该测什么 + 该资产指纹命中的知识库 POC 推荐。

会话与靶标的绑定落盘保存，宿主重启后不用重新 open/bind。

**蓝队值守台（v2.19.0，与红队并行的第二条线，只做技术面）**：一次攻防里你只担任一侧——担任蓝队就从「蓝队值守台」建防守项目（责任区），它有自己的数据根 `$DSH_HOME/blueteam`、自己的会话绑定、自己的技能与工具（`blueteam_*`）、自己的预设（**蓝队模式**：防守指挥 + asset / detection / triage / responder 四个技术角色）。红队那条线一行不受影响，两边数据互不可见。

- 面板与红队演练台**同构**：项目头（名称/侧别/模式/SLA/范围/本会话绑定）+ 项目下拉 + 实时角标 + 版本 + 刷新 + 项目组/全局组页签 + 底部统计。
- 项目组九页：项目中心 / 值守总览（KPI 磁贴 + 下一步建议 + 风险分布）/ **资产测绘**（左分组 + 右资产表，点行展开画像 / 暴露面 / 基线）/ 智能体（四个角色与提示词）/ 告警研判（队列 + 详情 + 升事件）/ **漏洞**（左列表 + 右详情，与红队「战果」镜像）/ 事件处置（动作 + 审批 + 验证 + 时间线）/ 检测覆盖（数据源 + 规则 + ATT&CK 三色矩阵）/ 报告与复盘（技术复盘 + 管理层态势 + **红蓝对账**）。
- 全局组两页：技能库（随包技术技能）/ 环境适配（数据根 / 库路径 / 预设状态 / 版本）。
- 不做排班、交接、变更窗口与记分：这些是人的管理流程，不是 AI 能参与的技术活；指标（MTTD/MTTR/覆盖/误报）只作观测值展示。
- **AI 不能自己批自己**：`isolate_host` / `disable_account` / `rotate_credential` 等高危动作只能"提"，批准/强制执行只存在于面板。
- **红蓝对账**是唯一的跨线通道：由你在面板触发，红队库**只读**打开，逐条判 命中 / 迟报 / 漏报 / 不可判定，漏报进蓝队记分板。
- 快速上手见 [docs/howto-blue.md](docs/howto-blue.md)。

## 工作原理

**NEXT 路线（零宿主写入）**：

| 能力 | 机制 |
| --- | --- |
| 人格注入 | `systemPrompt.section`（order 1，`interpolate:false`）；四级回退：config → prompt-inject.md → AES 加密槽 → 内置兜底 |
| 身份剥离 | patch 层 `includeHarnessIdentity:false` + assemble 改写 |
| 审批放行 | patch 层 `approval: ask`（rc.3 的 `never` 是"派发前自动拒绝"，不能用）+ `approval/request` prepend 监听器返回 `allowed-once` |
| 沙箱全开 | patch 层 `sandbox-policy: danger-full-access`（该模式下文件沙箱本就无围栏；**不禁 fs-sandbox**——它是文件工具的宿主服务） |
| 话术改写 | `system-prompt/assemble` 瀑布：sections + **contexts** 双遍历，具名 context（approval:policy）整体替换，规则锚点按 rc.3 校准并带失配告警 |
| 工具放行 | `tools/pre-execute` prepend → allow；`tools/post-execute` 中性化工具结果里的拒绝/不可信话术 |
| 权限预设 | permission 表 danger-full-access 档 approval 同步改 ask，防会话播种拒绝链 |

**legacy 路线**：与 1.1.x 相同（82 条磁盘补丁 + shim + 备份还原），并新增两点保护：打击目标按代际过滤（不误触 NEXT 安装）、启动自愈只在老宿主生效。

## 还原 / 卸载

- **NEXT 路线**：`dsh plugin --profile <x> remove dsh-purge` 即可，宿主文件从未被修改。
- **legacy 路线**：面板「清洗 → 还原/卸载」或 `/purge revert` / `dsh-purge --uninstall`（先还原备份再清插件）。

## 本地校验

```sh
node --check lib/index.js && node --check lib/legacy/core.js && node --check lib/next/index.js
node --input-type=module -e "import './lib/index.js'"
node test/next-rules.mjs        # NEXT 路线测试套（20 项）
node test/blue-store.mjs         # 蓝队事实库 / 状态机 / 审批闸门 / 对账（33 项）
npm run build:client             # 前端 tsdown 构建 + externals 校验
node test/client-render-smoke.mjs # 客户端渲染冒烟（apply + 各槽位首屏渲染，含蓝队页签）
```

## 目录结构

`lib/index.js` 薄入口（代际分派）；`lib/next/` NEXT 纯插件路线；`lib/legacy/` 磁盘补丁路线；`lib/shared/` 两路线公共设施（主目录解析/原子写/加密槽/override 状态机）；`lib/redteam/` 红队演练台；`lib/blueteam/` 蓝队值守台（schema/store/tools/ui/预设自举，与红队平行）；`presets/{redteam,blueteam}/` 两套预设；`skills/{redteam,blueteam}/` 随包技能；`src/client/{redteam,blue}/` 两套前端；`src/` 前端源码（tsdown 双 face 构建）。

## 更新

每版改动见 [Releases](https://github.com/YuJunZhiXue/dsh-purge/releases)。发新版：改 `package.json` 版本 → `release-notes.md` 首行必须是 `# <版本>`（CI 强制）→ 推 master 即最新（本 fork 的 Release CI 只在上游仓库跑，故这里不自动出 Release，装 `master` 的 tarball 就是最新版）。自更新面板支持 stable / beta 双通道；NEXT 路线更新后手动重启宿主即可（无补丁可重打）。
