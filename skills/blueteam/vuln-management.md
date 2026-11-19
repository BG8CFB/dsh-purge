# 漏洞管理（vuln-management）

## 定位
蓝队的"技术账"：责任区里**已知但还没修**的漏洞。与红队「漏洞战果」镜像——红队记"打穿什么"，你记"还剩什么没修"。

## 三个来源
1. 自查扫描（nuclei / fscan / 漏扫平台导出）→ 解析成行后 `blueteam_vuln_add`；
2. 红队演练复盘（对账里"被打穿"的入口）→ 补登记，标 `exploited`；
3. 事件处置暴露的入口（WebShell 从哪进来的）→ 补登记。

## 登记口径
```
blueteam_vuln_add { ip, title, cve?, severity, status, evidence?, target? }
```
- `severity`：critical / high / medium / low / info；
- `status`：candidate（待确认）→ confirmed（复测确认）→ fixed（已修）；
- **标题写"组件 + 版本 + 问题"**（如 `Apache 2.4.49 路径穿越`），不要写"存在漏洞"。

## 修复闭环
1. `blueteam_vuln_list` 按严重级排，先修 critical/high；
2. 修完 `blueteam_vuln_update { vuln_id, status: "fixed", evidence: "复测结果/截图路径" }`；
3. 复测不成立 → `status: "false-positive"` 并写原因；
4. 修不动的（需要停机/变更）→ 保留 confirmed，把"为什么没修"写进 evidence。

## 与暴露面的区别
- `vuln` = 具体组件的已知漏洞（有 CVE/版本）。
- `exposure` = 配置面缺口（开放端口、弱口令、默认页面、日志缺失）。
两者不要互相替代：一个 Redis 未授权既是 vuln 也可能是 exposure，按来源各自记，别重复计数到同一个指标上。