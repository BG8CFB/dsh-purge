# 资产清点（asset-inventory）

## 目标
把"守什么"变成可计算的影响面：每台资产都要有 criticality，否则误封判定、收敛率、计分全部失效。

## 步骤
1. 拿清单：CMDB 导出 CSV / 台账 Excel，先在本地解析成数组。
2. `blueteam_asset_import`：ip 必填；带 name/owner/dept/business/env/criticality/port。
3. 补画像 `blueteam_asset_profile_save`：criticality（P0 核心/P1 重要/P2 一般/P3 边缘）、env、data_class、users_count、rto_min/rpo_min、compliance。
4. `blueteam_asset_query` 核对：有没有 criticality=P2 的"看起来很重要"的系统（官网、支付、门户）——那是画像错了。
5. 顺手登记暴露面（`blueteam_exposure_add`）：对外开放的管理端口、默认页面、未授权服务。

## 口径
- P0：对外核心业务 / 承载敏感数据 / 一挂就上新闻。
- P1：内部核心（域控、堡垒机、OA、邮件）。
- P2：一般业务与办公。
- P3：测试、边缘、IoT。