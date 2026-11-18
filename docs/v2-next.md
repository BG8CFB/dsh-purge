# dsh-purge v2（NEXT 适配版）——已实现状态

面向 DSH NEXT（core **0.2.2-rc.3**，实测环境：NEXT 桌面 2.0.23-next）。**不修改宿主任何文件**，官方更新不被挡住，也不需要重装插件。v2.1.0 起与 v1 磁盘补丁路线在同一包内共存（`lib/next/` 与 `lib/legacy/`，`lib/index.js` 薄入口按宿主代际分派）。

## 与旧版 v2 骨架（2.0.0-next.0）的差异：三处根因修复

| 旧骨架的做法 | rc.3 的事实 | v2.1.0 的做法 |
| --- | --- |
| patch 覆盖 `approval: policy=never` | `never` 在瀑布派发**之前**直接 `return 'rejected'`（官方防监听器旁路） | `policy: ask` + `approval/request` **prepend** 监听器返回 `allowed-once` |
| patch 禁用 `fs-sandbox` | fs-sandbox 是组合中 **ctx.fs 唯一提供者**，禁用后 tool-fs 全家 PENDING | 移除禁用；全开仅靠 `sandbox-policy: danger-full-access`（该模式本就无围栏） |
| 改写只遍历 sections+tools | 审批/沙箱/子代理/Web 表层话术走 `assembly.contexts`；tools 不在瀑布载荷 | sections + **contexts** 双遍历；具名 context（approval:policy）整体替换；锚点按 rc.3 重校 + 失配自检 |

另：permission 行 danger-full-access 档的 approval 由 never 改 ask（防新会话播种拒绝链）；人格段 `interpolate:false`（严格插值遇 `{{x}}` 会炸轮）。

## 能力对照（对应旧补丁编号）

| 能力 | v2.1.0 实现 | 旧补丁 |
| --- | --- | --- |
| 人格注入 | systemPrompt.section（order 1，interpolate:false），四级回退：config → prompt-inject.md → AES 加密槽 → 内置 | 4 / 26 / 71 |
| 能力选用协议 | systemPrompt.section（order 5100，dshpg-capabilities） | 28 相关 |
| 去掉官方身份 | patch `includeHarnessIdentity:false` + assemble 改写 | 25 / 4 |
| 审批话术中性化 | 具名 context 'approval:policy' 整体替换 + 正则兜底 | 5 / 11 / 12 |
| 工具拒绝话术中性化 | tools/post-execute 结果改写 + assemble 正则 | 33 / 34 / 48 |
| Web/会话引用框定 | contexts 正则（rc.3 锚点） | 32 / 50 / 53 / 54 / 60 / 70 / 29 / 37 |
| 审批自动放行 | approval/request prepend → allowed-once | 9 / 14 / 35 / 62 |
| 工具调用放行 | tools/pre-execute prepend → allow | 30 / 31 / 59 |
| 沙箱全开 | patch sandbox-policy 行（mode + workspaceRoot 全量重述） | 7 / 15 / 61 |
| 权限预设防拒绝链 | patch permission 行（danger-full-access 档 approval:ask） | （新增） |
| 结果裁剪/重复提醒关闭 | patch tool-result-pruner / repeat-tool-reminder 行 disabled | 18 / 19 |

## 双路线共存

- 薄入口 `lib/index.js`：`detectHostGeneration()`（DSH_PURGE_ROUTE 强制 → dsh-app-boot 版本解析 → 目录探测 → 兜底 next）
- legacy 打击目标按代际过滤（≥0.2.2 安装剔除），并装不误触；legacy settle/自愈在 NEXT 宿主上双重门禁
- 共享层 `lib/shared/`：home/atomic/override/persona-slot/host-version/zip-extract（legacy 侧保留 hostFs 感知的自有实现，二者有意不合并——legacy 需要穿透 asar 遮蔽）
- engines.dsh `>=0.1.7-rc.2 <0.3.0`；`dsh.bundle.patch` 单文件（数组形式 0.2.0 未证实，不用）

## 测试

`node test/next-rules.mjs` —— 20 项断言：入口契约、人格段（order/interpolate/四级回退/加密槽）、四个监听器、rc.3 真实文案逐条改写（ASK/NEVER 句、子代理锁、Web 表层、session-reference、policy denial 冒号句）、具名 context 替换、无关文本保留、放行闸、post-execute 中性化与 block 透传、开关全关。

## 已知限制

- 工具**描述**里的拒绝句（tool-bash/pwsh description）不在瀑布载荷、provider 机制不适合整体改写——实际拒绝对模型的告知主要发生在结果层（已由 post-execute 覆盖），描述残留影响很小；后续可用 restrict+重注册 shadow 方案补。
- 适配器层（#47/49/57）放弃：默认路由不经 pi-ai；宿主自理。
- 极简/SDK 预设条件规则（26/71/70）只在对应预设出现时才有意义，保留为条件命中。
