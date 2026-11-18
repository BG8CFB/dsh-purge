# 版本兼容策略（约束 4：尽量不侵入 + 尽量适配更多版本）

本文件记录“能支持哪些 DSH 版本、凭什么、以及怎么在不写版本分支的前提下做到”。

## 1. 官方版本盘点（证据：npm registry）

- @deepseek-ai/dsh 共发布 **43 个版本**：0.0.1-rc.1 → 0.2.2-rc.1。
- dist-tags：latest = 0.2.2-rc.1，next = 0.2.2-rc.1，alpha = 0.2.2-alpha.3。
- 桌面三通道的 core：stable = 0.2.1-rc.3，beta = 0.2.2-rc.1，next = 0.2.2-rc.1。
- 旧版插件的 dshTarget 停在 0.2.0-rc.2，等于放弃了 0.1.x 与 0.2.1+ 两个区间。

## 2. 兼容判据：看“行 id”而不是版本号

插件的全部宿主影响都收敛为对指定行的覆盖或禁用。因此“某个版本能不能用”等价于“该版本是否存在这些行”。
判据可复跑：scripts/compat-probe.mjs 拉取各版本 @deepseek-ai/dsh-base 的 cordis.patch.yml 并比对。

探测结果（18 个覆盖目标，四版全绿）：

| 目标行 | 0.1.7-rc.2 | 0.2.0-rc.1 | 0.2.1-rc.3 | 0.2.2-rc.1 |
|---|---|---|---|---|
| sandbox / sandbox-policy / approval / permission | yes | yes | yes | yes |
| fs-sandbox / fs-observation-policy | yes | yes | yes | yes |
| system-prompt / agent-instructions | yes | yes | yes | yes |
| tool-fs / tool-bash / tool-pwsh / tool-web | yes | yes | yes | yes |
| tool-result-pruner / repeat-tool-reminder | yes | yes | yes | yes |
| subagent / plan-mode / agent-loop / session-log-deepseek | yes | yes | yes | yes |
| 该版本行总数 | 93 | 94 | 96 | 97 |

结论：**配置层从 0.1.7-rc.2 到 0.2.2-rc.1 全部可覆盖**，不需要版本分支。

## 3. 支持分级

| 级别 | 版本范围 | 承诺 | 依据 |
|---|---|---|---|
| T1 完整支持 | 0.2.0-rc.1 ~ 0.2.2-rc.1（含后续 0.2.x） | 破甲全量：section + assemble 规则 + 审批瀑布 + 工具放行 + 沙箱/fs 配置 | 行 id 全在；seam 一致 |
| T2 尽力而为 | 0.1.7-rc.2 ~ 0.1.x | 配置层 + section 人格；assemble 相关规则若事件缺失则自动跳过并记录 | 行 id 全在，但 seam 未逐个实测 |
| T3 不支持 | 小于等于 0.1.6 | 安装即拒绝，给出明确提示 | 行结构与 0.1.7 不同代 |

engines.dsh 建议写 “>=0.1.7-rc.2 <0.3.0”，配合 peer 范围与运行时探测；这样 T1/T2 都能装上，T3 被引擎挡下。

## 4. 跨版本不写分支的四条机制

1. **未知行自动忽略**：补丁引擎对“目标 id 不存在”只 warn 并跳过（vendor/include/src/patch.ts），所以同一份 cordis.patch.yml 可同时喂给多个版本，多出来的行自动失效。
2. **name 守卫防误伤**：覆盖行时带 name（如 @deepseek-ai/dsh-fs-sandbox）。若某版本把同 id 换成别的包，引擎判 name 不符并跳过，而不是把无关插件改坏。
3. **运行时能力探测**：加载时用 ctx.get 判断服务是否可用、判断 systemPrompt.section 是否函数；缺失即降级，不按版本号分支。
4. **事件监听自适应**：system-prompt/assemble、approval/request、tools/pre-execute 都按“有消费者就生效、没有就 no-op”编写。

## 5. 已知版本差异（写进文档，不进代码分支）

| 差异 | 影响 | 处理 |
|---|---|---|
| working-directory / tool-working-directory / remote-access / web-deepseek-api 自 0.2.1 起出现 | 与破甲无关 | 不引用 |
| tool-executor-native / tool-executor-ptc 仅 0.2.2 | 工具执行层重构 | 不按 id 覆盖，改用 pre-execute 瀑布 |
| tool-subagent-fork 在 0.2.2 移除 | 子代理行结构变化 | 覆盖 subagent 主行，不碰子行 |
| tool-ralph 在 0.2.1+ 消失 | 无影响 | 不引用 |
| 0.1.7 无 otel 行，遥测走 session-telemetry-otel | 遥测关闭逻辑 | 只覆盖 session-telemetry-otel |

## 6. 验证矩阵（Phase 3 执行）

四个版本 × 八条断言：

| 断言 | 0.1.7-rc.2 | 0.2.0-rc.1 | 0.2.1-rc.3 | 0.2.2-rc.1 |
|---|---|---|---|---|
| 人格生效（问“你是谁”） | 待跑 | 待跑 | 待跑 | 待跑 |
| 官方身份句消失 | 待跑 | 待跑 | 待跑 | 待跑 |
| 审批不弹窗 | 待跑 | 待跑 | 待跑 | 待跑 |
| 工具不被拒（delete/move） | 待跑 | 待跑 | 待跑 | 待跑 |
| 工作区外写成功 | 待跑 | 待跑 | 待跑 | 待跑 |
| 无沙箱拒绝提示 | 待跑 | 待跑 | 待跑 | 待跑 |
| 长结果不裁剪 | 待跑 | 待跑 | 待跑 | 待跑 |
| 安装目录零改动 | 待跑 | 待跑 | 待跑 | 待跑 |

## 7. 未来版本（0.3+）的降级约定

0.3 若改了 section 或 assemble 的签名、或移除某行：

1. 插件照常加载，逐项探测失败的能力记一条日志并跳过，不允许整插件 FAILED。
2. 配置层未知行 warn-skip，不阻断启动。
3. 发布前跑一次 compat-probe 与四版验证；只有 0.2.x 全绿才提升 minor。

## 8. 复现方式

    node scripts/compat-probe.mjs
    node scripts/compat-probe.mjs 0.2.0-rc.1 0.2.2-rc.1
    node scripts/gen-migration-matrix.mjs

下载物落在 .baseline/compat/（gitignored），可随时删除重拉。

## 9. 范围收窄（2026-11-10 决定）

按你的指示，适配目标从“多版本”收窄为**两条主线的最新版**：

| 目标 | 版本 | 说明 |
|---|---|---|
| 主线（upstream master） | core 0.2.2-rc.1 | beta 与 next 通道所用 core 同版；desktop 走 dsh-plugin-desktop(-beta) |
| NEXT 分支 | dsh-desktop-next 2.0.22-next，core 0.2.2-rc.1 | 当前机器安装的这一支 |

- 上面的 T1/T2/T3 分级保留作为“能力上限”记录，但**验收只在 0.2.2-rc.1 上执行**。
- engines.dsh 收紧为 “>=0.2.2-rc.1 <0.3.0”，0.1.x / 0.2.0 / 0.2.1 不再承诺。
- compat-probe 脚本保留，用于未来升级时快速判断行 id 是否还在。
