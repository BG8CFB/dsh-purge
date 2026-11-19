# 事件处置（incident-response）

## 六个阶段
确认 → 止血 → 清源 → 恢复 → 复盘 → 关闭。

## 工具序列
1. `blueteam_incident_open`（title/severity/alert_ids/category）。
2. 止血：`blueteam_action_propose`（kind/target/impact/blast_radius/rollback_plan）。
   - 中低危（kill_process / remove_shell / block_ip / block_domain）→ `blueteam_action_execute`。
   - 高危（isolate_host / disable_account / rotate_credential / revoke_ticket）→ 只能等**用户在面板批准**，然后 `execute`。
3. `blueteam_action_verify`：必须给 evidence（前后对比/EDR 状态/旧凭据失效/文件与进程消失）。
4. `blueteam_incident_update` status=contained（必须先有已验证动作）。
5. 清源：清马、改密、吊票据、打补丁（每条动作独立 propose → execute → verify）→ status=eradicated。
6. 恢复：status=recovered。
7. 复盘：写 `summary` / `root_cause` / `postmortem_ref` → status=closed（P0/P1 必须有复盘材料）。

## 红线
- 没有回滚方案的高危动作不要提；提了也批不过。
- 误封核心业务的代价高于晚封 10 分钟：不确定时先提"范围更小"的动作（单 IP 而非整段）。
- 动作执行后 30 分钟是冷静期：发现打错了立刻让用户在面板回滚。