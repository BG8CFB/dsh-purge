# dsh-purge（DSH 破甲插件）

**v2.1.0 · 双路线架构**：一个包同时服务两代宿主——

- **DSH NEXT（core 0.2.2-rc.3 及以上）→ 纯插件路线**：不写任何宿主文件，人格/审批/沙箱/话术全部走官方扩展点（`cordis.patch.yml` 配置层 + 运行时监听器）。官方更新宿主后插件照常工作，无需重新应用。
- **老宿主（dsh 0.1.7-rc.2 ~ 0.2.1）→ 磁盘补丁路线**：沿用既有的 asar 解包 + 字符串替换 + `.dshpurge.bak` 备份机制，行为与 1.1.x 一致。

安装后由插件入口在运行时探测宿主代际自动分派，`DSH_PURGE_ROUTE=next|legacy` 可强制指定（调试用）。

## 署名要求

**借用本项目的名称、思路、代码或提示词，必须署名，并写明来源仓库：** [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge)。本插件内嵌的上游红队组件署名见 `docs/redteam-upstream-DISCLOSURE` 与 `docs/redteam-upstream-LICENSE`。

## 安装

```sh
# DSH NEXT（桌面 2.0.23-next 及以上）
dsh plugin --profile desktop add dsh-purge
# 官方 dsh web（NEXT 代 core）
dsh plugin --profile web add dsh-purge

# 老宿主（0.1.7-rc.2 ~ 0.2.1）：同命令安装后，在面板「清洗」里点「应用」打磁盘补丁
```

- registry 上不去时改用 `https://github.com/YuJunZhiXue/dsh-purge/archive/refs/heads/master.tar.gz`。
- Node.js ≥ 22（老宿主无闪窗增强需 ≥22；engines.dsh 已放宽到 `>=0.1.7-rc.2 <0.3.0`，两代都能装）。
- **NEXT 路线装完即生效**（重启宿主一次加载插件即可，没有"应用/还原"步骤）；老宿主路线仍走面板「应用 → 自动重启」。

## 使用

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

**面板（NEXT 官方形态）**：设置页「dsh-purge」（人格编辑 / 规则集 / 技能管理 / 更新通道）+ 右侧栏「dsh-purge」页签（状态总览 / 回退 / 演练台入口）+ 输入框回退按钮。演练台（资产测绘 / 环境适配 / 智能体 / 会话隧道 / 漏洞战果 / 攻击链 / 得分 / 报告 / 知识库 / 技能库）在右侧栏独立页签，打开即用。

**红队模式**：会话预设选「红队模式」→ 指挥智能体先 `redteam_preflight` 预检 → 开靶（`redteam_engagement_open`）→ 按五角色（recon / assess / vuln-scan / exploit / internal）派活。新工具：

- `redteam_engagement_digest`：一次往返拿到靶标总览（阶段 / 得分 / 最近变更 / 缺证据 / 建议下一步），指挥收尾核对靠它；
- `redteam_scan_import`：把 runs/ 下的 gogo / fscan / nuclei 原始输出导入资产库（草稿态 candidate），落库从纪律变默认；
- `redteam_asset_next`：下一条该测什么 + 该资产指纹命中的知识库 POC 推荐。

会话与靶标的绑定落盘保存，宿主重启后不用重新 open/bind。

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
npm run build                    # 前端 tsdown 构建 + externals 校验
```

## 目录结构

`lib/index.js` 薄入口（代际分派）；`lib/next/` NEXT 纯插件路线；`lib/legacy/` 磁盘补丁路线；`lib/shared/` 两路线公共设施（主目录解析/原子写/加密槽/override 状态机）；`lib/redteam/` 演练台（两路线共用）；`presets/redteam/` 红队预设；`skills/redteam/` 随包技能；`src/` 前端源码（tsdown 双 face 构建）。

## 更新

每版改动见 [Releases](https://github.com/YuJunZhiXue/dsh-purge/releases)。发新版：改 `package.json` 版本 → `release-notes.md` 首行必须是 `# <版本>`（CI 强制）→ 推 master 自动打包。自更新面板支持 stable / beta 双通道；NEXT 路线更新后手动重启宿主即可（无补丁可重打）。
