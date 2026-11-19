# 基线核查（baseline-check）

## 六类检查项
account（账号）/ port（端口）/ patch（补丁）/ config（配置）/ log（日志）/ backup（备份）。

## 做法
逐资产、逐项调用 `blueteam_baseline_check`：
- category、item 必填；
- expected / actual 写真实值（不要写"符合要求"这种空话）；
- result：pass / fail / unknown / na。

## 关键机制
**fail 会自动生成暴露面**（同一个分母），同一项重复 fail 不重复记账。所以：
- 不要另外用 `blueteam_exposure_add` 重复登记基线项；
- 修好后走 `blueteam_exposure_update` status=fixed（必须 verified_by + evidence_ref）。

## 判定口径（默认）
- 账号：无默认口令；管理员双因素；90 天未登录禁用。
- 端口：仅业务端口开放；22/3389/数据库不对公网。
- 补丁：高危 7 天内、严重 72 小时内。
- 配置：关闭调试与目录浏览；TLS1.2+。
- 日志：主机+应用+网络接入集中日志，留存 ≥180 天。
- 备份：3-2-1；备份账号与生产隔离。