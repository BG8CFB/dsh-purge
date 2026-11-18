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

# 前端构建 + externals 纯度校验（tsdown 双 face：产物 dist/client.js）
npm run build:client

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
lib/redteam/        演练台（两路线共用，零 core.js 依赖）：store-core（node:SQLite）+
                    schema + tools（redteam_* 工具）+ ui（/redteam/api 桥）+ 评分
src/                前端源码（tsdown 构建 → dist/client.js，官方槽位形态）
presets/redteam/    红队预设（指挥人格 + 五角色 + anchor-gate）
skills/redteam/     23 个红队技能（教模型操作第三方 CLI 的手册）
```

## rc.3 关键语义（写代码前必知，反直觉处已踩过坑）

- `approval policy: never` = **派发前确定性拒绝**（官方防监听器旁路）——必须 `ask` + prepend 监听器 `allowed-once`。
- **fs-sandbox 不可禁用**：它是 ctx.fs 唯一提供者，禁了文件工具全灭；全开只需 `sandbox-policy: danger-full-access`（该模式本就无围栏）。
- assemble 瀑布载荷 `{sections, contexts, variables}` **不含 tools**；审批/沙箱/子代理/Web 表层话术在 **contexts** 里；人格段必须 `interpolate:false`（严格插值遇未注册 `{{x}}` 会炸轮）。
- permission 行 danger-full-access 档的 approval 必须同改 ask（防新会话播种拒绝链）。
- web-app bundle 把 agent 面工具行挂进 preset-standard `config.plugins`，外层 patch 按 id 覆盖打不进去——工具面改行走运行时 seam。
- NEXT 官方前端槽位齐全（116 个）；client 面板经 `package.json → dsh.client`（嵌套键）+ `exports['./client']` 被 clientModules 收录。

## 历史包袱（有意保留，勿"顺手清理"）

- legacy 与 shared 各有一份 home/atomic/override 实现：legacy 版 hostFs 感知（穿透 asar 遮蔽），shared 版纯 node:fs——**有意不合并**。
- skills/redteam 内的操作纪律（授权范围确认、限速防打崩、失败放弃规则）是刻意保留的运行边界，不是待删护栏。
- hooks-deny.js 是 legacy 补丁机制（deny→allow 旁路的可逆实现），不是护栏。
- `docs/redteam-upstream-DISCLOSURE`/`redteam-upstream-LICENSE` 是上游署名义务，不动。

## 提交风格

conventional 前缀（fix/feat/release/docs/chore/perf）+ 中文描述。
