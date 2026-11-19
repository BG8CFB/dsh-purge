# 检测工程（detection-engineering）

## 两件事
1. 让日志进来（数据源台账）；2. 让规则能命中（规则库 + 覆盖矩阵）。

## 数据源
`blueteam_logsource_add`：kind（network/host/app/account/honeypot）、product、status（connected/degraded/offline）、retention_days、last_event_at。
**没有 connected 的数据源，覆盖矩阵里全是 blind。**

## 规则
`blueteam_detection_add`：
- code 稳定唯一（如 `EDR-W3WP-CMD`）；
- ttp 用 ATT&CK 编号（T1059 命令执行、T1003 凭据转储、T1190 公网应用利用…）；
- logic 必须是可复现的查询/匹配逻辑，不许写"监控异常行为"；
- status 从 draft 起。

`blueteam_detection_verify`：给回放结果/样本 evidence 与 fp_rate 后转 active。误报率 >30% 保持 testing 并写原因。

## 覆盖矩阵
`blueteam_coverage`：covered 绿 / gap 黄（有日志没规则）/ blind 红（没日志）。
优先级：盲区先接日志，其次补规则；只补规则不接日志等于自欺。