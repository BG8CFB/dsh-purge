# 旧版补丁到新机制的迁移矩阵

生成脚本：scripts/gen-migration-matrix.mjs。数据源：lib/core.js 的 ALL_PATCHES 加 docs/patch-decisions.json。

## 结论概览

| 指标 | 数值 |
|---|---|
| 旧补丁总数 | 82 |
| 保留（改写/配置/运行时） | 66 |
| 取消（非破甲） | 16 |
| 需要写安装目录源码 | 0 |

## 分桶

| 桶 | 含义 | 条数 |
|---|---|---|
| A | 提示词/身份/preset/工具描述 | 26 |
| B | 审批/沙箱/fs/策略 | 20 |
| C | 循环/会话/LLM 内部 | 19 |
| D | 桌面壳/客户端 UI | 8 |
| E | 体积/限额 | 9 |

## 判定分布

| 判定 | 含义 | 条数 |
|---|---|---|
| runtime | 运行时扩展点（section/瀑布） | 10 |
| config | 配置行覆盖 | 20 |
| rewritten | 改写实现（非源码替换） | 36 |
| dropped | 取消（非破甲项） | 16 |

## 逐条矩阵

| id | 名称 | 目标包 | 桶 | 判定 | 新机制 | 验证 |
|---|---|---|---|---|---|---|
| 1 | WORKSPACE_CONTEXT_INTRO | agent-instructions | A | rewritten | assemble 规则改写工作区引言 | 系统提示含强制语 |
| 2 | REPLACEMENT_WORKSPACE_CONTEXT_INTRO | agent-instructions | A | rewritten | assemble 规则改写替代引言 | 同上 |
| 3 | SCOPE_INTRO | agent-instructions | A | rewritten | assemble 规则改写作用域强制语 | 作用域段含强制语 |
| 4 | SYSTEM_PROMPT_PERSONA | agent-preset, web-app, headless, preset-acp-app, preset-sdk-app | A | rewritten | 自有 preset 行提供 personaPrefix | dump-config 有本插件 preset |
| 5 | APPROVAL_NEVER_SENTENCE | user-approval, user-approval-invariant | A | rewritten | assemble 改写审批禁用说明 | 提示含可自由提权措辞 |
| 6 | SANDBOX_DENY_FILE_WRITE | sandbox-local | B | config | sandbox-policy mode=danger-full-access 后 confine 直通 | 写文件不被 seatbelt 拦 |
| 7 | SANDBOX_MODE_DEFAULT | base | B | config | 覆盖 sandbox 行 config.mode | dump-config mode 正确 |
| 8 | APPROVAL_POLICY_DEFAULT | base | B | config | 覆盖 approval 行 config.policy=never | dump-config policy 正确 |
| 9 | APPROVAL_AUTO_GRANT | user-approval-code, user-approval-invariant, user-approval | B | runtime | approval/request 返回 allowed-once | 无弹窗直接执行 |
| 10 | APPROVAL_CONFIG_DEFAULT_NEVER | user-approval-code | B | config | approval 行 config.policy=never | 同上 |
| 11 | APPROVAL_NEVER_SENTENCE_BYPASS | user-approval-code | A | rewritten | assemble 改写 never 场景话术 | 话术已替换 |
| 12 | APPROVAL_ASK_SENTENCE_BYPASS | user-approval-code, user-approval, user-approval-invariant | A | rewritten | assemble 改写 ask 场景话术 | 话术已替换 |
| 13 | ESCALATION_WIDENING_EXEMPT | escalation | B | runtime | pre-execute 放行 + mode 直达避免升级 | 越权操作可执行 |
| 14 | ESCALATION_GRANT_UNCONDITIONAL | escalation | B | runtime | approval/request 无条件批准升级 | 升级不弹窗 |
| 15 | SANDBOX_CONFINE_PASSTHROUGH | sandbox-local | B | config | mode=danger-full-access 使 confine 不包装 | 命令无沙箱前缀 |
| 16 | FS_FENCE_DISABLED | fs-sandbox | B | config | danger 模式下 checkedTarget 直通 | 工作区外写成功 |
| 17 | FS_OBSERVATION_INTENT_FREE | fs-observation-policy | B | config | fs-observation-policy 行保持 disabled | 无 FS_NOT_OBSERVED |
| 18 | REPEAT_TOOL_REMINDER_DISABLED | repeat-tool-reminder | E | config | repeat-tool-reminder 行 disabled | 无重复提醒 |
| 19 | TOOL_RESULT_PRUNER_DISABLED | compaction-tool-result-pruner | E | config | pruner 行 disabled 或阈值调高 | 长结果不裁剪 |
| 21 | BASH_TIMEOUT_RESTORE | base | E | config | 覆盖 bash 行 timeoutMs | 超时值符合预期 |
| 22 | READ_CAPS_RAISED | tool-fs | E | config | tool-fs 行 config 提高读上限 | 长行不被截断 |
| 23 | SUBAGENT_MAXDEPTH_RAISED | subagent, tool-subagent | E | config | subagent 行 config.maxDepth | 深链可行 |
| 24 | PRESET_FETCH_ENABLED | preset-unrestricted, preset-standard, preset-cordis, preset-ptc, preset-liangshen, preset-liangshen-pkg | E | config | tool-web 行 config.fetch=true | fetch 可用 |
| 25 | HARNESS_IDENTITY_STRIP | system-prompt | A | config | system-prompt 行 config 去官方身份 | 无官方身份段 |
| 26 | MINIMAL_PERSONA_PURGE | preset-minimal, preset-sdk-minimal | A | rewritten | 自有 preset 覆盖 minimal 身份 | minimal 会话人格正确 |
| 28 | LIANGSHEN_PHASE1_KEEP_INJECT | liangshen-tool-bootstrap | C | dropped | 第三方插件内部注入，不介入 | 不适用 |
| 29 | TOOL_WEB_UNTRUSTED_NEUTRAL | tool-web, tool-web-nested | A | rewritten | assemble 改工具描述 + post-execute 改结果头 | 网页内容无不可信提示 |
| 30 | HOOKS_CLAUDE_DENY_ALLOW | hooks-claude-code, hooks-claude-code-nested | B | runtime | 自有 hooks 兼容层在 pre-execute 放行 | deny 不生效 |
| 31 | HOOKS_CODEX_DENY_ALLOW | hooks-codex, hooks-codex-nested | B | runtime | 同上（codex 配置） | deny 不生效 |
| 32 | WEB_SURFACE_IDENTITY_NEUTRAL | web-app-lib | A | rewritten | assemble 改写 web 身份句 | 身份句已替换 |
| 33 | TOOL_SHELL_DENIAL_PROMPT | tool-bash, tool-pwsh | A | rewritten | assemble 改写被拒提示 | 提示无 policy denial 措辞 |
| 34 | SANDBOX_HINT_NEUTRAL | escalation | A | rewritten | post-execute 改写沙箱拒绝提示 | 提示中性化 |
| 35 | ESCALATION_NEVER_REJECT | escalation | B | runtime | approval/request allowed-once 使升级不抛错 | 升级链不断 |
| 36 | TOOL_FS_ESCALATION_SCHEMA | tool-fs, escalation | A | rewritten | assemble 改写提权 schema 文案 | schema 文案中性 |
| 37 | SUBAGENT_SCOPE_LOCK_NEUTRAL | subagent, subagent-types | A | rewritten | assemble 改写子代理权限固定提示 | 提示已改写 |
| 38 | PERSONA_TEXT_PREFIX_ALIAS | persona | A | rewritten | 自有 persona section，无需改官方 Config | 人格生效 |
| 39 | SESSION_V0_PLUGIN_SUMMARY_ALIAS | session-format-v0 | C | dropped | 旧版会话格式垫片 | 不适用 |
| 40 | COMPLETE_PROMPT_KEEP_INJECT | system-prompt, system-prompt-nested | A | rewritten | assemble 监听器自行追加注入段 | 注入段存在 |
| 42 | SETTINGS_LEGACY_API | settings | C | dropped | settings 旧 API 垫片 | 不适用 |
| 43 | WEB_PRESET_IDENTITY_STRIP | preset-standard, preset-ptc, preset-cordis, preset-minimal | A | rewritten | assemble 去除 4 个 preset 身份前缀 | 无身份前缀 |
| 45 | OFFICIAL_DESKTOP_UPDATE_HANDOFF | desktop-shell | D | dropped | 桌面更新接管，改为不干预 | 更新走官方 |
| 46 | OFFICIAL_DESKTOP_UPDATE_ASCII | desktop-shell | D | dropped | 同上文案 | 不适用 |
| 47 | ANTHROPIC_OAUTH_NO_CLAUDE_IDENTITY | pi-ai-anthropic-messages | C | rewritten | 自建 anthropic adapter 去身份块 | OAuth 请求无 Claude 身份 |
| 48 | TOOL_SHELL_DELETE_MOVE_NEUTRAL | tool-bash, tool-pwsh | A | rewritten | assemble 改写 delete/move 提示 | 提示已中性 |
| 49 | ANTHROPIC_OAUTH_CLI_NEUTRAL | pi-ai-anthropic-messages | C | rewritten | 自建 adapter 工具名映射 | 工具名不被改名 |
| 50 | SESSION_REFERENCE_FRAMING_NEUTRAL | session-reference | A | rewritten | assemble 改会话引用框定 | 框定语中性 |
| 51 | FRESH_SESSION_FULL_ACCESS | permission-presets, permission-presets-types | B | config | permission-presets 行 config | 新会话直通 |
| 52 | SESSION_LOG_UPLOAD_DEFAULT_OFF | session-log-deepseek, session-log-deepseek-types | E | config | session-log 行 config 上传关 | 默认不上传 |
| 53 | WEB_SURFACE_PROHIBITION | web-app-lib | A | rewritten | assemble 改写 web 禁令 | 禁令已去掉 |
| 54 | DELIVERABLE_DO_NOT | deliverables-prompt | A | rewritten | assemble 改 present 限制语 | 限制语已去掉 |
| 55 | SYSTEM_PROMPT_REPLACE_HEAD | agent-loop | C | rewritten | assemble 层替换 system 段 | 模型收到新系统消息 |
| 56 | REWIND_HIDE_CUT_ONLY | conversation-client | D | dropped | 回退 UI，可选 slots 重写 | 不适用 |
| 57 | DEEPSEEK_SYSTEM_ROLE | pi-ai-completions, pi-ai-responses-shared | C | rewritten | 自建 adapter 统一 system role | 第三方网关可用 |
| 58 | REWIND_SKIP_DERIVE | session | D | dropped | 会话回退派生 | 不适用 |
| 59 | OFFICIAL_AUTO_REVIEW_PASSTHROUGH | auto-review | B | runtime | auto-review 在 pre-execute 放行 | 自动审阅不拦 |
| 60 | OFFICIAL_RUN_CODE_APPROVAL_NEUTRAL | dsh-tools, dsh-tools-ptc | A | rewritten | assemble 改 run_code 审批话术 | 话术已中性 |
| 61 | OFFICIAL_SANDBOX_POLICY_NEUTRAL | sandbox-policy | B | config | sandbox-policy 行 config | 策略符合预期 |
| 62 | OFFICIAL_TOOL_ASK_FAILOPEN | dsh-tools, dsh-tools-types | B | runtime | approval allowed-once + pre-execute allow | 无通道也放行 |
| 63 | OFFICIAL_PLAN_MODE_NEUTRAL | base, preset-ptc, preset-standard, preset-cordis | B | config | preset patch 打开 plan 行 | plan 可用 |
| 64 | HOOKS_STOP_STEER_NEUTRAL | hooks-claude-code, hooks-claude-code-nested, hooks-codex, hooks-codex-nested | B | runtime | hooks stop/steer 在事件层中性化 | steer 不被拦 |
| 65 | HOOKS_PRESTEP_REJECT_NEUTRAL | hooks-claude-code, hooks-claude-code-nested, hooks-codex, hooks-codex-nested | B | runtime | agent/pre-step 返回 enter | pre-step 不拒 |
| 66 | SYSTEM_PROMPT_RENDER_GUARD | system-prompt, system-prompt-nested | C | rewritten | assemble 输出即最终，无需守卫 | 提示渲染正确 |
| 67 | AGENT_LOOP_MESSAGES_GUARD | agent-loop | C | rewritten | agent/pre-step 空消息补位 | 不空转 |
| 68 | SYSTEM_NODES_CONTENT_GUARD | agent-loop, session | C | rewritten | 同 67（system 节点） | 系统段存在 |
| 69 | MODEL_STREAM_RELEASE | llm-deepseek | C | dropped | 流释放稳定性修复 | 不适用 |
| 70 | PRESET_SHELL_NETWORK | preset-minimal, preset-sdk-minimal | E | config | preset patch 注入 shell 行 | minimal 有 pwsh |
| 71 | LIANGSHEN_IDENTITY_LINE | preset-liangshen, preset-liangshen-pkg | A | rewritten | 第三方 preset 身份由 section 覆盖 | 装了才有意义 |
| 72 | MESSAGES_SYSTEM_CURRENT | llm-deepseek | C | rewritten | assemble 处理 in-history system | 系统消息生效 |
| 73 | PRESET_BASH_MIRROR_LINE | preset-minimal, preset-sdk-minimal | A | rewritten | assemble 删镜像提示行 | 提示已删 |
| 74 | ASSEMBLE_BEFORE_PRESTEP | agent-loop | C | rewritten | pre-step 前自行装配注入 | 首步即带注入 |
| 75 | REWIND_RESET_TODOS | tool-todo | C | dropped | 回退时重置 todo | 不适用 |
| 76 | PRESET_UNRESTRICTED_IDENTITY_STRIP | preset-unrestricted | A | rewritten | assemble 去 unrestricted 身份 | 无人格前缀 |
| 77 | REWIND_DROP_SENT_ON_APPEND | conversation-client | D | dropped | 回退 UI 记录 | 不适用 |
| 78 | OVERLAY_RESTORE_FROM_BAK | app-boot | C | dropped | app-boot 覆盖恢复 | 不适用 |
| 80 | MINIMAL_OFFICIAL_TOOLSET | preset-minimal, preset-sdk-minimal | E | config | preset patch 补齐 minimal 工具集 | 工具齐全 |
| 82 | DESKTOP_SHELL_PROFILE_FALLBACK | desktop-shell | D | dropped | 桌面 profile 回退 | 不适用 |
| 83 | DESKTOP_HOST_CLOSE_NO_FATAL | desktop-shell | D | dropped | 桌面 host 关闭容错 | 不适用 |
| 84 | DESKTOP_HOST_CLOSE_CODE0_NO_FAIL | desktop-shell | D | dropped | 同上 | 不适用 |
| 85 | SESSION_PROMPT_ALWAYS_FOLLOWUP | api-session-controller | C | rewritten | 事件层强制 followup | 空响应后继续 |
| 86 | SESSION_STEER_ALWAYS_FOLLOWUP | api-session-controller, agent-loop | C | rewritten | 同上（steer） | steer 后继续 |
| 87 | HUNG_PROMPT_LF_NEEDLE | agent-loop | C | dropped | 卡住检测兜底 | 不适用 |
| 88 | HUNG_PROMPT_STRICT_NEEDLE | agent-loop | C | dropped | 同上（严格版） | 不适用 |

## 取消清单（非破甲项，逐条说明）

- 28 LIANGSHEN_PHASE1_KEEP_INJECT：第三方插件内部注入，不介入
- 39 SESSION_V0_PLUGIN_SUMMARY_ALIAS：旧版会话格式垫片
- 42 SETTINGS_LEGACY_API：settings 旧 API 垫片
- 45 OFFICIAL_DESKTOP_UPDATE_HANDOFF：桌面更新接管，改为不干预
- 46 OFFICIAL_DESKTOP_UPDATE_ASCII：同上文案
- 56 REWIND_HIDE_CUT_ONLY：回退 UI，可选 slots 重写
- 58 REWIND_SKIP_DERIVE：会话回退派生
- 69 MODEL_STREAM_RELEASE：流释放稳定性修复
- 75 REWIND_RESET_TODOS：回退时重置 todo
- 77 REWIND_DROP_SENT_ON_APPEND：回退 UI 记录
- 78 OVERLAY_RESTORE_FROM_BAK：app-boot 覆盖恢复
- 82 DESKTOP_SHELL_PROFILE_FALLBACK：桌面 profile 回退
- 83 DESKTOP_HOST_CLOSE_NO_FATAL：桌面 host 关闭容错
- 84 DESKTOP_HOST_CLOSE_CODE0_NO_FAIL：同上
- 87 HUNG_PROMPT_LF_NEEDLE：卡住检测兜底
- 88 HUNG_PROMPT_STRICT_NEEDLE：同上（严格版）
