# 告警研判（alert-triage）

## 目标
每条告警都必须有结论，且结论要能解释给检测工程与复盘看。

## 步骤
1. `blueteam_alert_query`：默认按 severity + SLA 排序；`status=new,triaging` 只拉未处理。
2. 单条看上下文：
   - 实体：同 IP/账号 24h 内历史告警（`entity` 过滤）。
   - 资产：`blueteam_asset_query` 查 criticality/owner/business —— P0 资产上的 P2 告警要按 P1 对待。
   - 白名单/变更窗口：命中就抑制，不要硬判。
3. 判定：
   - 真 → 先 `blueteam_incident_open`（带 alert_ids），再 `blueteam_alert_triage`（verdict=confirmed, incident_id）。
   - 假 → `verdict=false_positive` + `cause`（rule / unknown-asset / business-change / clock-skew / other）。
   - 重复 → `verdict=duplicate` + `dup_of`。
   - 需要观察 → `verdict=pending`，并在 note 写"还缺什么证据"。

## 口径
- "看起来像"不是真警；拿不到证据就写待查，不要凑结论。
- 判假必须给原因：这是检测工程改规则的唯一输入。
- 同一实体的多条告警先合并成一个事件，不要开一堆事件。