/**
 * 蓝队工具集（blueteam_*，preset 平面）
 *
 * 与红队的两条平行线约定：
 *   · 本文件注册的工具只解析 ctx.blueteam（蓝队数据根），**结构上就看不到红队库**；
 *   · 项目绑定用蓝队根自己的 session-bindings.json（与红队那份是两个文件）；
 *   · 高危动作只能 propose，approve/force 只在面板（/blueteam/api）暴露——模型不能自己批自己。
 */
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { bindingStoreFor } from '../redteam/bindings.js'
import { normalizeArgs } from './store-blue.js'

function loadDefineTool() {
  const candidates = []
  const homes = [process.env.DSH_HOME, join(homedir(), '.dsh')].filter(Boolean)
  for (const home of homes) {
    candidates.push(join(home, 'package.json'))
    for (const profile of ['web', 'desktop', 'default']) {
      candidates.push(join(home, 'profiles', profile, 'package.json'))
      candidates.push(join(home, 'profiles', profile, 'node_modules', '@deepseek-ai', 'dsh', 'package.json'))
    }
  }
  candidates.push(join(process.cwd(), 'package.json'))
  try {
    const bin = process.argv[1]
    if (bin) {
      const norm = String(bin).replace(/\\/g, '/')
      const at = norm.lastIndexOf('/node_modules/@deepseek-ai/dsh/')
      if (at >= 0) candidates.push(norm.slice(0, at + '/node_modules/@deepseek-ai/dsh/'.length - 1) + '/package.json')
    }
  } catch { /* 忽略 */ }
  for (const pkg of candidates) {
    try {
      if (!pkg || !existsSync(pkg)) continue
      const mod = createRequire(pkg)('@deepseek-ai/dsh-tools')
      const fn = mod && (mod.defineTool || (mod.default && mod.default.defineTool))
      if (typeof fn === 'function') return fn
    } catch { /* 换下一个 */ }
  }
  throw new Error('dsh-purge/blueteam/tools: cannot resolve @deepseek-ai/dsh-tools from host')
}

const defineTool = loadDefineTool()

export const name = 'dsh-purge-blueteam-tools'
export const inject = ['tools']

const text = (value) => [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }]
const out = { schema: { type: 'string' }, render: (_args, value) => text(value) }

function withStructuredErrors(tool) {
  const inner = tool.execute
  return Object.assign({}, tool, {
    async execute(args, exec) {
      try {
        return await inner(normalizeArgs(args), exec)
      } catch (error) {
        const message = error && error.message ? error.message : String(error)
        const kind = /必填|只能是|不存在|unknown|required/i.test(message) ? 'bad_input' : 'failed'
        return JSON.stringify({
          ok: false, error: message, error_kind: kind,
          hint: kind === 'bad_input'
            ? '参数或对象标识不对：先用对应的 *_list / *_query 看实际 id，再重试。'
            : '执行失败，先向用户说明卡点，不要静默跳过。',
        }, null, 2)
      }
    },
  })
}

/** 会话 → 项目绑定键（根会话优先，子智能体继承）。 */
function bindingKeysOf(exec) {
  const info = (() => {
    const session = exec && exec.agent ? exec.agent.session : undefined
    if (!session) return { id: undefined, parentId: undefined }
    try {
      return { id: session.id ? String(session.id) : undefined, parentId: session.header && session.header.parentSession ? String(session.header.parentSession) : undefined }
    } catch { return { id: undefined, parentId: undefined } }
  })()
  const chain = []
  let cur = info.id
  let parent = info.parentId
  let guard = 0
  while (cur && guard < 32) {
    chain.push(cur)
    if (!parent) break
    chain.push(parent)
    cur = parent
    parent = undefined
    guard += 1
  }
  return { id: info.id, parentId: info.parentId, chain: Array.from(new Set(chain.filter(Boolean))) }
}

export function apply(ctx) {
  const resolve = () => {
    const store = ctx.blueteam
    if (!store) throw new Error('蓝队事实库不可用：插件 dsh-purge-blueteam-store 未启动')
    return store
  }
  const bindings = () => bindingStoreFor(resolve().root)

  const resolveEngagement = (store, exec, explicit) => {
    if (typeof explicit === 'string' && explicit.trim() !== '') return explicit.trim()
    const keys = bindingKeysOf(exec)
    const bind = bindings()
    for (const key of keys.chain) {
      const hit = bind.get(key)
      if (typeof hit === 'string' && hit !== '') return hit
    }
    const active = store.activeEngagementId()
    if (active) return active
    const list = store.listEngagements()
    if (list.length === 1) return list[0].id
    throw new Error('尚未绑定防守项目：先 blueteam_project_open（新建/打开）或 blueteam_session_bind（绑定已有）')
  }

  const register = (tool) => ctx.tools.register(withStructuredErrors(defineTool(tool)))

  /* ---------------- 项目 / 会话 ---------------- */

  register({
    name: 'blueteam_project_open',
    description: '【蓝队·第一步】新建或打开一个防守项目（按防守单位/责任区名称），并把**当前会话**绑定到它（子智能体继承）。蓝队项目与红队项目是两条平行线：这里只能看到防守侧的库。',
    parameters: {
      name: { type: 'string', required: true, description: '防守单位 / 责任区名称' },
      scope: { type: 'array', items: { type: 'string' }, description: '责任 CIDR 列表（可空）' },
      mode: { type: 'string', description: 'drill（演练）| live（真实值守），默认 drill' },
      sla_profile: { type: 'string', description: 'strict | standard | loose（默认 standard）' },
      defender: { type: 'string', description: '防守方名称/班组（可空）' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const engagement = store.openEngagement(args.name, Array.isArray(args.scope) ? args.scope : [], {
        mode: args.mode, slaProfile: args.sla_profile, defender: args.defender, bindCurrent: false,
      })
      bindings().setMany(bindingKeysOf(exec).chain, engagement.id)
      return JSON.stringify({ ok: true, engagement, digest: store.blueDigest(engagement.id), note: '已绑定到本会话；红队那条线不受影响。' }, null, 2)
    },
  })

  register({
    name: 'blueteam_session_bind',
    description: '把一个已有的防守项目绑定到当前会话（多会话并行时用：每班/每个复盘会话各绑自己的项目）。只列蓝队项目。',
    parameters: { engagement: { type: 'string', description: '项目 id 或名称；省略只列出候选' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const list = store.listEngagements()
      const wanted = typeof args.engagement === 'string' ? args.engagement.trim() : ''
      if (wanted === '') {
        return JSON.stringify({ ok: false, candidates: list.map((e) => ({ id: e.id, name: e.name, mode: e.mode, created_at: e.created_at })), note: '传 engagement 完成绑定。' }, null, 2)
      }
      const hit = list.find((e) => e.id === wanted) || list.find((e) => String(e.name) === wanted) || list.find((e) => String(e.name).includes(wanted))
      if (hit === undefined) return JSON.stringify({ ok: false, error: '项目不存在：' + wanted, candidates: list.map((e) => e.id) }, null, 2)
      bindings().setMany(bindingKeysOf(exec).chain, hit.id)
      return JSON.stringify({ ok: true, engagement: { id: hit.id, name: hit.name }, note: '本会话已绑定；后续工具只作用于它。' }, null, 2)
    },
  })

  register({
    name: 'blueteam_session_info',
    description: '查看当前会话绑定的是哪个防守项目、当前班次、以及红蓝两侧的绑定文件是否分开（蓝队根 = $DSH_HOME/blueteam）。',
    parameters: {},
    output: out,
    async execute(_args, exec) {
      const store = resolve()
      const keys = bindingKeysOf(exec)
      const bound = keys.chain.map((k) => bindings().get(k)).find(Boolean) || null
      return JSON.stringify({
        ok: true,
        side: 'defense',
        root: store.root,
        session_chain: keys.chain,
        bound_engagement: bound,
        projects: store.listEngagements().map((e) => ({ id: e.id, name: e.name })),
      }, null, 2)
    },
  })

  register({
    name: 'blueteam_digest',
    description: '【派活前后各一次】防守一屏摘要：未研判/超时告警、在处置事件、待批与待验证动作、暴露面、检测覆盖、班次、最近变更。用它核对子智能体回报，也用它的真实数字回答用户"现在什么情况"。',
    parameters: { engagement: { type: 'string', description: '项目 id；省略用当前绑定' }, since: { type: 'number', description: '只看这条 change_log id 之后的变更' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      const digest = store.blueDigest(id)
      if (typeof args.since === 'number') digest.changes = digest.changes.filter((c) => c.id > args.since)
      digest.next_steps = []
      if (digest.alerts.unhandled > 0) digest.next_steps.push('先清告警：未研判 ' + digest.alerts.unhandled + ' 条（超时 ' + digest.alerts.overdue + '）')
      if (digest.actions.pending > 0) digest.next_steps.push('有待批处置 ' + digest.actions.pending + ' 条：提醒用户在面板批准')
      if (digest.actions.unverified > 0) digest.next_steps.push('有已执行未验证动作 ' + digest.actions.unverified + ' 条：必须验证后才能 contained')
      if (digest.exposures.open > 0) digest.next_steps.push('暴露面待收敛 ' + digest.exposures.open + ' 项')
      if ((digest.vulns?.total ?? 0) > 0) digest.next_steps.push('待修漏洞 ' + digest.vulns.total + ' 条：blueteam_vuln_list 看清单，修完用 blueteam_vuln_update 改状态')
      if ((digest.detection?.rulesActive ?? 0) === 0) digest.next_steps.push('还没有生效的检测规则：blueteam_detection_add 补规则，blueteam_coverage 看盲区')
      return JSON.stringify(digest, null, 2)
    },
  })

  /* ---------------- 资产 / 暴露面 / 基线 ---------------- */

  register({
    name: 'blueteam_asset_import',
    description: '批量导入责任区资产（CMDB 导出的 CSV 先在本地解析成数组）。字段：ip（必填）、name/host、owner、dept、business、env、criticality(P0-P3)、data_class、port。已存在的 IP 会更新名称并补画像。',
    parameters: { rows: { type: 'array', items: { type: 'object' }, description: '资产行数组' }, engagement: { type: 'string', description: '项目 id（省略用绑定）' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      const result = store.importAssets(id, Array.isArray(args.rows) ? args.rows : [])
      return JSON.stringify({ ok: true, ...result, note: '导入后请补 criticality（P0-P3）：影响面与计分都靠它。' }, null, 2)
    },
  })

  register({
    name: 'blueteam_asset_profile_save',
    description: '保存资产画像：owner / dept / business / env / criticality / data_class / users_count / rto_min / rpo_min / compliance。criticality 只能是 P0/P1/P2/P3。',
    parameters: {
      asset_id: { type: 'number', description: '资产 id（与 ip 二选一）' },
      ip: { type: 'string', description: '资产 IP（与 asset_id 二选一）' },
      owner: { type: 'string' }, dept: { type: 'string' }, business: { type: 'string' },
      env: { type: 'string', description: 'prod | test | dev' },
      criticality: { type: 'string', description: 'P0 核心 | P1 重要 | P2 一般 | P3 边缘' },
      data_class: { type: 'string', description: 'public | internal | sensitive | secret' },
      users_count: { type: 'number' }, rto_min: { type: 'number' }, rpo_min: { type: 'number' },
      compliance: { type: 'string' }, note: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.saveAssetProfile(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_asset_query',
    description: '查责任区资产（带画像、未收敛暴露面数、未研判告警数）。筛选：criticality / env / owner / q / limit。按 criticality 与暴露面排序。',
    parameters: {
      criticality: { type: 'string' }, env: { type: 'string' }, owner: { type: 'string' },
      q: { type: 'string' }, limit: { type: 'number' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      const items = store.listAssetRows(id, args)
      return JSON.stringify({ ok: true, count: items.length, items }, null, 2)
    },
  })

  register({
    name: 'blueteam_exposure_add',
    description: '登记一条暴露面（端口/弱口令/补丁/配置/日志/备份/证书/调试接口/未授权服务）。基线核查 fail 会自动生成，不必重复手写。',
    parameters: {
      asset_id: { type: 'number' }, ip: { type: 'string' },
      kind: { type: 'string', required: true, description: 'port|weak-password|patch|config|log|backup|tls|debug|unauth-service' },
      port: { type: 'number' }, title: { type: 'string', required: true },
      detail: { type: 'string' }, severity: { type: 'string', description: 'critical|high|medium|low' },
      source: { type: 'string' }, due_at: { type: 'string' }, ticket: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.addExposure(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_exposure_update',
    description: '更新暴露面状态：open/fixing/fixed/accepted/false_positive。fixed 必须给 verified_by + evidence_ref；accepted 必须给 accepted_by + accepted_until。',
    parameters: {
      id: { type: 'number', required: true }, status: { type: 'string' },
      verified_by: { type: 'string' }, evidence_ref: { type: 'string' },
      accepted_by: { type: 'string' }, accepted_until: { type: 'string' },
      ticket: { type: 'string' }, detail: { type: 'string' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.updateExposure(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_exposure_list',
    description: '查暴露面（默认 open+fixing，按状态与严重级排序）。',
    parameters: { status: { type: 'string' }, severity: { type: 'string' }, asset_id: { type: 'number' }, limit: { type: 'number' }, engagement: { type: 'string' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, items: store.listExposure(id, args), summary: store.exposureSummary(id) }, null, 2)
    },
  })

  register({
    name: 'blueteam_baseline_check',
    description: '记录一条基线核查（category：account/port/patch/config/log/backup；result：pass/fail/unknown/na）。**fail 会自动生成暴露面**，同一项重复 fail 不重复记账。',
    parameters: {
      asset_id: { type: 'number' }, ip: { type: 'string' },
      category: { type: 'string', required: true }, item: { type: 'string', required: true },
      expected: { type: 'string' }, actual: { type: 'string' },
      result: { type: 'string' }, severity: { type: 'string' },
      incident_id: { type: 'number' }, note: { type: 'string' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.baselineCheck(id, args) }, null, 2)
    },
  })

  /* ---------------- 检测 ---------------- */

  register({
    name: 'blueteam_logsource_add',
    description: '登记数据源台账（EDR/Sysmon/WAF/NDR/DNS/代理/VPN/蜜罐）。status：planned/connected/degraded/offline。没有日志源，"检测覆盖"就是盲的。',
    parameters: {
      kind: { type: 'string', required: true, description: 'network|host|app|account|honeypot' },
      product: { type: 'string' }, endpoint: { type: 'string' }, owner: { type: 'string' },
      scope: { type: 'string' }, assets_count: { type: 'number' }, status: { type: 'string' },
      retention_days: { type: 'number' }, latency_s: { type: 'number' },
      last_event_at: { type: 'string' }, note: { type: 'string' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.addLogSource(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_detection_add',
    description: '新增/更新检测规则（code 唯一）。必须能复现：logic 写查询语句或匹配逻辑；ttp 用 ATT&CK 编号（如 T1059）。status 从 draft 起步。',
    parameters: {
      code: { type: 'string', required: true }, name: { type: 'string', required: true },
      ttp: { type: 'string' }, tactic: { type: 'string' }, source_id: { type: 'number' },
      product: { type: 'string' }, scope: { type: 'string' }, severity: { type: 'string' },
      logic: { type: 'string' }, content_path: { type: 'string' }, status: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.addDetection(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_detection_verify',
    description: '规则验证：给 evidence（回放结果/样本）与 fp_rate 后可转 active。误报率 >30% 请保持 testing 并写原因。',
    parameters: {
      rule_id: { type: 'number', required: true }, evidence: { type: 'string', required: true },
      fp_rate: { type: 'number' }, status: { type: 'string' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.verifyDetection(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_coverage',
    description: '检测覆盖矩阵：每个关键 TTP 的 covered/gap/blind。gap=有日志没规则，blind=没日志。补盲优先接日志，其次补规则。',
    parameters: { engagement: { type: 'string' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.coverage(id) }, null, 2)
    },
  })

  /* ---------------- 告警 / 事件 / 处置 ---------------- */

  register({
    name: 'blueteam_alert_ingest',
    description: '告警接入（CSV/JSON 先在本地解析成数组）。四闸：白名单 → 变更窗口 → 去重窗口（默认 600s）→ 风暴折叠（默认 60s 内 100 条）。字段：source/rule_code/rule_name/severity(P0-P3)/title/entity_kind/entity_id/first_seen/count/ttp。',
    parameters: {
      rows: { type: 'array', items: { type: 'object' }, description: '告警行数组' },
      window_s: { type: 'number' }, storm_threshold: { type: 'number' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      const result = store.ingestAlerts(id, Array.isArray(args.rows) ? args.rows : [], { windowS: args.window_s, stormThreshold: args.storm_threshold })
      return JSON.stringify({ ok: true, ...result, counts: store.alertCounts(id) }, null, 2)
    },
  })

  register({
    name: 'blueteam_alert_query',
    description: '查告警队列（keyset 分页，默认 50 条）：status/severity/since/q/incident_id/entity/before/limit。返回 items + next（下一页游标）。',
    parameters: {
      status: { type: 'string' }, severity: { type: 'string' }, since: { type: 'string' },
      q: { type: 'string' }, incident_id: { type: 'number' }, entity: { type: 'string' },
      before: { type: 'string' }, limit: { type: 'number' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.listAlerts(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_alert_triage',
    description: '研判一条告警。verdict：confirmed（必须带 incident_id）/ false_positive（必须带 cause：rule|unknown-asset|business-change|clock-skew|other）/ duplicate（必须带 dup_of）/ suppressed / pending。研判即记 acked_at（MTTD 终点）。',
    parameters: {
      alert_id: { type: 'number', required: true }, verdict: { type: 'string', required: true },
      incident_id: { type: 'number' }, cause: { type: 'string' }, dup_of: { type: 'number' },
      note: { type: 'string' }, assignee: { type: 'string' }, conclusion: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.triageAlert(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_alert_suppress',
    description: '抑制一条告警（给 reason 与 until；到期自动失效）。抑制不占 SLA、不计误报。',
    parameters: { alert_id: { type: 'number', required: true }, reason: { type: 'string', required: true }, until: { type: 'string' }, engagement: { type: 'string' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.suppressAlert(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_incident_open',
    description: '建事件（可从多条已确认告警升上来）。detected_at 取关联告警最早时间；自动写时间线与 change_log。',
    parameters: {
      title: { type: 'string', required: true }, severity: { type: 'string', required: true },
      alert_ids: { type: 'array', items: { type: 'number' } }, category: { type: 'string' },
      owner: { type: 'string' }, commander: { type: 'string' }, summary: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.openIncident(id, { ...args, alertIds: args.alert_ids }) }, null, 2)
    },
  })

  register({
    name: 'blueteam_incident_update',
    description: '推进事件：open→contained→eradicated→recovered→closed（只能前进）。contained 前必须有已执行并已验证的动作；P0/P1 关闭必须给 postmortem_ref 或 summary。',
    parameters: {
      incident_id: { type: 'number', required: true }, status: { type: 'string' },
      note: { type: 'string' }, summary: { type: 'string' }, root_cause: { type: 'string' },
      impact: { type: 'string' }, postmortem_ref: { type: 'string' }, by: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.updateIncident(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_incident_note',
    description: '给事件时间线补一条记录（研判依据、基线回看、联系人反馈等）。',
    parameters: {
      incident_id: { type: 'number', required: true }, text: { type: 'string', required: true },
      kind: { type: 'string' }, by: { type: 'string' }, role: { type: 'string' },
      ref_kind: { type: 'string' }, ref_id: { type: 'number' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.addIncidentNote(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_action_propose',
    description: '提处置动作（不执行）。kind：hunt/kill_process/remove_shell/block_ip/block_domain/patch/downgrade_exposure（中低危可自行执行）/ isolate_host/disable_account/rotate_credential/revoke_ticket（高危，待面板审批）。高危必须给 impact + blast_radius + rollback_plan。',
    parameters: {
      incident_id: { type: 'number' }, kind: { type: 'string', required: true },
      target: { type: 'string', required: true }, target_kind: { type: 'string' },
      direction: { type: 'string' }, scope: { type: 'string' },
      impact: { type: 'string' }, blast_radius: { type: 'string' }, rollback_plan: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      const result = store.proposeAction(id, args)
      return JSON.stringify({ ok: true, ...result, note: result.needsApproval ? '高危动作：等用户在面板「事件处置」里批准后再 execute。' : '中低危可直接 execute，执行后必须 verify。' }, null, 2)
    },
  })

  register({
    name: 'blueteam_action_execute',
    description: '执行已批准/中低危的处置动作。高危未批准会被拒绝（emergency 只能由面板发起）。执行后必须 verify。',
    parameters: { action_id: { type: 'number', required: true }, operator: { type: 'string' }, engagement: { type: 'string' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.executeAction(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_action_verify',
    description: '验证处置效果（必填 evidence）：封禁看连通性、隔离看 EDR 状态、改密看旧凭据是否失效、清马看文件与进程是否消失。验证后事件才能进 contained。',
    parameters: { action_id: { type: 'number', required: true }, evidence: { type: 'string', required: true }, result: { type: 'string' }, engagement: { type: 'string' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.verifyAction(id, args) }, null, 2)
    },
  })

  /* ---------------- 名单 / 班次 / 得分 / 报告 ---------------- */

  register({
    name: 'blueteam_asset_add',
    description: '新增一台责任区资产（单条；批量用 blueteam_asset_import）。可顺带写 criticality/owner/business。',
    parameters: {
      ip: { type: 'string', required: true }, name: { type: 'string' },
      owner: { type: 'string' }, business: { type: 'string' },
      criticality: { type: 'string', description: 'P0|P1|P2|P3' },
      env: { type: 'string', description: 'prod|test|dev' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.addAsset(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_vuln_add',
    description: '登记一条待修漏洞（来源：自查扫描 / 渗透复测 / 事件暴露）。severity：critical|high|medium|low|info；status：candidate|confirmed|exploited|fixed|false-positive。',
    parameters: {
      ip: { type: 'string' }, asset_id: { type: 'number' },
      cve: { type: 'string' }, title: { type: 'string', required: true },
      severity: { type: 'string' }, status: { type: 'string' },
      evidence: { type: 'string' }, target: { type: 'string' }, source: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      const assetId = (args.asset_id !== undefined || args.ip !== undefined) ? store.resolveAssetId(id, args) : null
      const result = store.addVuln(id, {
        asset_id: assetId, cve: args.cve, title: args.title, severity: args.severity,
        status: args.status, evidence: args.evidence, target: args.target,
        source: args.source || 'self-check', agent: 'asset',
      })
      return JSON.stringify({ ok: true, ...result, note: '修复后用 blueteam_vuln_update 把 status 改成 fixed，并写 evidence（修复前后对比）。' }, null, 2)
    },
  })

  register({
    name: 'blueteam_vuln_list',
    description: '查待修/已修漏洞（按严重级排序）。筛选：status / severity / q / asset_id / limit。',
    parameters: {
      status: { type: 'string' }, severity: { type: 'string' }, q: { type: 'string' },
      asset_id: { type: 'number' }, limit: { type: 'number' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.listVulns(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_vuln_update',
    description: '更新漏洞状态/严重级/证据（修复闭环：fixed 必须写 evidence）。',
    parameters: {
      vuln_id: { type: 'number', required: true }, status: { type: 'string' },
      severity: { type: 'string' }, evidence: { type: 'string' }, title: { type: 'string' },
      engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      if (args.status === 'fixed' && !String(args.evidence || '').trim()) {
        throw new Error('改 fixed 必须给 evidence（修复前后对比/截图路径）')
      }
      return JSON.stringify({ ok: true, ...store.updateVuln(id, args.vulnId, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_watchlist_add',
    description: '维护名单：asset / white（降噪）/ black / profile / change。白名单必须带 expires_at（会过期，过期标 stale）。',
    parameters: {
      kind: { type: 'string', required: true }, value: { type: 'string', required: true },
      value_kind: { type: 'string', description: 'ip|cidr|domain|url|hash|account|regex' },
      label: { type: 'string' }, source: { type: 'string' }, severity: { type: 'string' },
      expires_at: { type: 'string' }, note: { type: 'string' }, engagement: { type: 'string' },
    },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return JSON.stringify({ ok: true, ...store.addWatchlist(id, args) }, null, 2)
    },
  })

  register({
    name: 'blueteam_report',
    description: '生成蓝队报告（markdown）：态势、事件清单、得分、整改建议。kind：technical（默认）| management。',
    parameters: { kind: { type: 'string' }, engagement: { type: 'string' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      return store.blueReport(id, args.kind)
    },
  })

  register({
    name: 'blueteam_reconcile_list',
    description: '查看已完成的红蓝对账结果（对账本身只能由用户在面板触发，模型只读结果）。verdict：matched/late/missed/unverifiable。',
    parameters: { reconcile_id: { type: 'number' }, engagement: { type: 'string' } },
    output: out,
    async execute(args, exec) {
      const store = resolve()
      const id = resolveEngagement(store, exec, args.engagement)
      if (args.reconcile_id !== undefined) return JSON.stringify({ ok: true, items: store.reconcileItems(id, args.reconcile_id) }, null, 2)
      return JSON.stringify({ ok: true, items: store.listReconciles(id) }, null, 2)
    },
  })
}

export default { name, inject, apply }
