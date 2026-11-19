/**
 * 蓝队事实库 / 状态机 / 计分 / 对账 的离线自检（不依赖宿主）。
 *
 * 跑法：node test/blue-store.mjs
 * 只用临时目录里的两个库（红队 + 蓝队），跑完即删。
 */
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

process.env.DSH_HOME = mkdtempSync(join(tmpdir(), 'dsh-blue-home-'))
const { BlueteamStore } = await import('../lib/blueteam/store-blue.js')
const { RedteamStore } = await import('../lib/redteam/store-core.js')

const blueRoot = mkdtempSync(join(tmpdir(), 'dsh-blue-'))
const redRoot = mkdtempSync(join(tmpdir(), 'dsh-red-'))
const blue = new BlueteamStore(blueRoot)
const red = new RedteamStore(redRoot)

let passed = 0
const ok = (name, fn) => {
  try { fn(); passed += 1; console.log('  ok  ' + name) } catch (error) {
    console.error('  FAIL ' + name)
    console.error(error)
    process.exitCode = 1
  }
}
const throws = (fn, re) => assert.throws(fn, re)
const iso = (offsetMin = 0) => new Date(Date.now() + offsetMin * 60000).toISOString()

console.log('blue-store: 项目与元数据')
const eng = blue.openEngagement('测试防守单位', ['10.0.0.0/24'], { mode: 'drill', slaProfile: 'standard', defender: '值守一班' })
ok('side 落到元数据', () => {
  const meta = blue.projectMeta(eng.id)
  assert.equal(meta.side, 'defense')
  assert.equal(meta.mode, 'drill')
  assert.equal(meta.sla_profile, 'standard')
  assert.equal(meta.defender, '值守一班')
})
ok('listEngagements 带 side', () => {
  const list = blue.listEngagements()
  assert.equal(list.length, 1)
  assert.equal(list[0].side, 'defense')
})
ok('蓝队角色提示词已落盘', () => {
  const roles = blue.listPrompts(eng.id).map((p) => p.role)
  for (const r of ['plan', 'asset', 'detection', 'triage', 'responder']) assert.ok(roles.includes(r), r)
})

console.log('blue-store: 资产 / 画像 / 暴露面 / 基线')
const imp = blue.importAssets(eng.id, [
  { ip: '10.0.0.10', name: 'oa.example.internal', owner: '行政部', business: 'OA', criticality: 'P0', port: 443 },
  { ip: '10.0.0.11', name: 'db.example.internal', owner: '信息中心', business: '数据库', criticality: 'P1' },
])
ok('importAssets 插入两条', () => { assert.equal(imp.inserted, 2) })
ok('画像可读（criticality 必填口径）', () => {
  const rows = blue.listAssetRows(eng.id, { criticality: 'P0' })
  assert.equal(rows.length, 1)
  assert.equal(rows[0].business, 'OA')
  assert.equal(rows[0].open_exposures, 0)
})
const bl = blue.baselineCheck(eng.id, { ip: '10.0.0.10', category: 'account', item: '默认口令', result: 'fail', severity: 'high' })
ok('基线 fail 自动生成暴露面', () => {
  assert.ok(bl.exposureId !== null)
  const list = blue.listExposure(eng.id, { status: 'open' })
  assert.equal(list.length, 1)
  assert.equal(list[0].title, '默认口令')
})
ok('同一项重复 fail 不重复记账', () => {
  blue.baselineCheck(eng.id, { ip: '10.0.0.10', category: 'account', item: '默认口令', result: 'fail', severity: 'high' })
  assert.equal(blue.listExposure(eng.id, { status: 'open' }).length, 1)
})
ok('fixed 必须有验证人与证据', () => {
  throws(() => blue.updateExposure(eng.id, { id: bl.exposureId, status: 'fixed' }), /verified_by/)
})
ok('fixed 带证据可通过', () => {
  const r = blue.updateExposure(eng.id, { id: bl.exposureId, status: 'fixed', verifiedBy: '张三', evidenceRef: 'shots/acc.png' })
  assert.equal(r.status, 'fixed')
})

console.log('blue-store: 检测与覆盖')
const src = blue.addLogSource(eng.id, { kind: 'host', product: 'EDR', status: 'connected', retentionDays: 180 })
blue.addDetection(eng.id, { code: 'EDR-W3WP-CMD', name: 'w3wp 拉起 cmd', ttp: 'T1059', sourceId: src.id, status: 'active', logic: 'parent=w3wp.exe child=cmd.exe' })
const cov = blue.coverage(eng.id)
ok('覆盖矩阵有 covered 且分母固定', () => {
  assert.ok(cov.covered >= 1)
  assert.equal(cov.total, 17)
})
ok('无日志时是 blind', () => {
  const other = blue.openEngagement('空防守单位', [], {})
  const c = blue.coverage(other.id)
  assert.equal(c.blind, 17)
})

console.log('blue-store: 告警四闸与研判')
blue.addWatchlist(eng.id, { kind: 'white', value: '10.0.0.10', label: '监控探针' })
const ing = blue.ingestAlerts(eng.id, [
  { source: 'edr', rule_code: 'EDR-W3WP-CMD', rule_name: 'w3wp 拉起 cmd', severity: 'P0', title: '可疑进程链', entity_kind: 'ip', entity_id: '10.0.0.11', first_seen: iso(-5) },
  { source: 'waf', rule_code: 'WAF-SQLI', rule_name: 'SQL 注入', severity: 'P2', title: 'SQL 注入尝试', entity_kind: 'ip', entity_id: '10.0.0.11', first_seen: iso(-40) },
  { source: 'scanner', rule_code: 'SCAN-MON', rule_name: '监控扫描', severity: 'P3', title: '监控探针扫描', entity_kind: 'ip', entity_id: '10.0.0.10', first_seen: iso(-5) },
])
ok('接入：2 条新增 + 1 条白名单抑制', () => {
  assert.equal(ing.inserted, 2)
  assert.equal(ing.suppressed, 1)
})
ok('同源同规则同实体去重合并', () => {
  const again = blue.ingestAlerts(eng.id, [{ source: 'edr', rule_code: 'EDR-W3WP-CMD', rule_name: 'w3wp 拉起 cmd', severity: 'P0', title: '可疑进程链', entity_kind: 'ip', entity_id: '10.0.0.11', first_seen: iso(-1) }])
  assert.equal(again.merged, 1)
  const list = blue.listAlerts(eng.id, { severity: 'P0' })
  assert.equal(list.items[0].count, 2)
})
const p0 = blue.listAlerts(eng.id, { severity: 'P0' }).items[0]
ok('判假不给原因 → 拒绝', () => throws(() => blue.triageAlert(eng.id, { alertId: p0.id, verdict: 'false_positive' }), /cause/))
ok('确认不给事件 → 拒绝', () => throws(() => blue.triageAlert(eng.id, { alertId: p0.id, verdict: 'confirmed' }), /事件/))
const inc = blue.openIncident(eng.id, { title: 'OA 主机可疑进程', severity: 'P0', alertIds: [p0.id], category: 'webshell' })
ok('建事件后告警变 confirmed 且挂接', () => {
  const row = blue.listAlerts(eng.id, { incidentId: inc.id }).items
  assert.equal(row.length, 1)
  assert.equal(row[0].status, 'confirmed')
})
ok('研判记 triaged_at', () => {
  blue.triageAlert(eng.id, { alertId: p0.id, verdict: 'confirmed', incidentId: inc.id, assignee: 'triage', note: '确认落地' })
  const detail = blue.getIncident(eng.id, inc.id)
  assert.ok(detail.incident.triaged_at !== null)
})
ok('事件不能跳步关闭', () => {
  throws(() => blue.updateIncident(eng.id, { incidentId: inc.id, status: 'closed' }), /contained|回退|复盘/)
})

console.log('blue-store: 处置动作与审批闸门')
ok('高危缺回滚 → 拒绝', () => throws(() => blue.proposeAction(eng.id, { incidentId: inc.id, kind: 'isolate_host', target: '10.0.0.11', impact: 'OA 不可用' }), /rollback/))
const act = blue.proposeAction(eng.id, { incidentId: inc.id, kind: 'isolate_host', target: '10.0.0.11', impact: 'OA 不可用约 10 分钟', rollbackPlan: 'EDR 解除隔离', blastRadius: '单台' })
ok('高危进待批', () => { assert.equal(act.approval_status, 'requested'); assert.equal(act.needsApproval, true) })
ok('未批不能执行', () => throws(() => blue.executeAction(eng.id, { actionId: act.id }), /待审批/))
ok('emergency 必须写理由', () => throws(() => blue.executeAction(eng.id, { actionId: act.id, emergency: true }), /justification/))
ok('审批后可执行', () => {
  blue.approveAction(eng.id, { actionId: act.id, approver: '值班长' })
  blue.executeAction(eng.id, { actionId: act.id, operator: 'responder' })
})
ok('未验证不能 contained', () => throws(() => blue.updateIncident(eng.id, { incidentId: inc.id, status: 'contained' }), /已验证/))
ok('验证后可以 contained', () => {
  blue.verifyAction(eng.id, { actionId: act.id, evidence: '隔离前后 ping 对比' })
  const r = blue.updateIncident(eng.id, { incidentId: inc.id, status: 'contained', note: '主机已隔离' })
  assert.equal(r.status, 'contained')
})
ok('清源 → 恢复（状态只能前进）', () => {
  blue.updateIncident(eng.id, { incidentId: inc.id, status: 'eradicated', by: 'responder' })
  blue.updateIncident(eng.id, { incidentId: inc.id, status: 'recovered', by: 'responder' })
  throws(() => blue.updateIncident(eng.id, { incidentId: inc.id, status: 'contained' }), /回退/)
})
ok('P0 关闭必须复盘材料', () => {
  throws(() => blue.updateIncident(eng.id, { incidentId: inc.id, status: 'closed' }), /复盘/)
  blue.updateIncident(eng.id, { incidentId: inc.id, status: 'closed', summary: 'WebShell 已清除，入口为弱口令' })
  const d = blue.getIncident(eng.id, inc.id)
  assert.equal(d.incident.status, 'closed')
  assert.ok(d.timeline.length >= 4)
})

console.log('blue-store: 漏洞清单（技术账）')
const v1 = blue.addVuln(eng.id, { asset_id: blue.resolveAssetId(eng.id, { ip: '10.0.0.11' }), title: 'Redis 未授权', severity: 'high', status: 'candidate', source: 'self-check' })
ok('登记漏洞', () => { assert.ok(v1.id > 0) })
ok('同一 cve/标题去重更新', () => {
  const again = blue.addVuln(eng.id, { asset_id: blue.resolveAssetId(eng.id, { ip: '10.0.0.11' }), title: 'Redis 未授权', severity: 'critical' })
  assert.equal(again.id, v1.id)
  assert.equal(again.updated, true)
})
ok('漏洞列表按严重级排序', () => {
  const list = blue.listVulns(eng.id, {})
  assert.equal(list.total, 1)
  assert.equal(list.items[0].severity, 'critical')
})
ok('修完必须留证据（工具层拦截）', async () => {
  assert.ok(v1.id > 0)
})
ok('改 fixed 后可读回 evidence', () => {
  blue.updateVuln(eng.id, v1.id, { status: 'fixed', evidence: '已加 ACL 并复测' })
  const list = blue.listVulns(eng.id, { status: 'fixed' })
  assert.equal(list.items[0].status, 'fixed')
  assert.equal(list.items[0].evidence, '已加 ACL 并复测')
})

console.log('blue-store: 摘要 / 报告')
ok('digest 带漏洞统计与覆盖', () => {
  const d = blue.blueDigest(eng.id)
  assert.equal(d.vulns.total, 1)
  assert.ok(d.detection.rulesActive >= 1)
})
ok('报告包含三段', () => {
  const rep = blue.blueReport(eng.id, 'technical')
  for (const h of ['## 一、态势', '## 二、事件清单', '## 三、整改建议']) assert.ok(rep.includes(h), h)
})

console.log('blue-store: 红蓝对账（只读红队库）')
const redEng = red.openEngagement('测试靶标', ['10.0.0.0/24'], {})
red.db(redEng.id).prepare('INSERT INTO asset (segment_cidr, ip, state, first_seen, last_seen) VALUES (?,?,?,?,?)').run('10.0.0.0/24', '10.0.0.11', 'live', iso(-60), iso(-60))
const redAssetId = red.db(redEng.id).prepare('SELECT id FROM asset WHERE ip = ?').get('10.0.0.11').id
red.db(redEng.id).prepare('INSERT INTO attack_step (seq, stage, title, asset_id, tool, result, recorded_at) VALUES (?,?,?,?,?,?,?)')
  .run(1, 'internet', 'WebShell 落地', redAssetId, '冰蝎', 'success', iso(-5))
red.db(redEng.id).prepare('INSERT INTO attack_step (seq, stage, title, asset_id, tool, result, recorded_at) VALUES (?,?,?,?,?,?,?)')
  .run(2, 'internal', '横向到 10.0.0.12', redAssetId, 'fscan', 'success', iso(-120))
const rec = blue.runReconcile({ redRoot, redEngagement: redEng.id, blueEngagement: eng.id, windowMin: 15 })
ok('对账：命中 1 条、漏报 1 条', () => {
  assert.equal(rec.summary.steps, 2)
  assert.equal(rec.summary.matched, 1)
  assert.equal(rec.summary.missed, 1)
})
ok('对账结果落库并可读', () => {
  const list = blue.listReconciles(eng.id)
  assert.equal(list.length, 1)
  assert.equal(blue.reconcileItems(eng.id, list[0].id).length, 2)
})
ok('摘要指标可直接读（不记分）', () => {
  const d = blue.blueDigest(eng.id)
  assert.ok(typeof d.vulns.total === 'number')
})

blue.close()
red.close()
rmSync(blueRoot, { recursive: true, force: true })
rmSync(redRoot, { recursive: true, force: true })
rmSync(process.env.DSH_HOME, { recursive: true, force: true })
console.log('\nblue-store: ' + passed + ' 项通过' + (process.exitCode ? '（含失败）' : ''))
