/**
 * 蓝队控制台 —— Host 半侧 HTTP 桥
 *
 * POST /blueteam/api   { op, ... }
 * GET  /blueteam/api/events?engagement=<id>&since=<seq>
 *
 * 与红队的 /redteam/api 是两条独立路由：蓝队面板只调这里，红队面板只调那里。
 * 审批类 op（actionApprove / actionReject / actionForce）**只在这里存在**，
 * 工具层没有对应工具 —— 模型不能自己批自己。
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeArgs } from './store-blue.js'

export const name = 'dsh-purge-blueteam-ui'
/** webServer 提供路由；blueteam 是 host 平面发布的进程级事实库。 */
export const inject = ['blueteam', 'webServer']

const MAX_BODY = 8 * 1024 * 1024

function sendJson(res, status, body) {
  try {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
    res.end(JSON.stringify(body))
  } catch { /* 连接已断 */ }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) { reject(new Error('请求体过大')); try { req.destroy() } catch { /* 忽略 */ } return }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/** 随包技能目录（安装后仍在包内，与 $DSH_HOME/blueteam/skills 同源）。 */
function bundledSkillsDir() {
  try { return fileURLToPath(new URL('../../skills/blueteam', import.meta.url)) } catch { return null }
}

function pluginVersion() {
  /* lib/blueteam/ui.js → 包根是 ../../package.json（上一级是 lib/） */
  for (const rel of ['../../package.json', '../package.json']) {
    try {
      const pkg = JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'))
      if (typeof pkg.version === 'string') return pkg.version
    } catch { /* 换下一个候选 */ }
  }
  return null
}

/** 本会话 → 项目绑定的只读视图（面板显示"本会话绑定"用）。 */
function bindingsView(store) {
  try {
    return store.bindingsView()
  } catch { return { items: [], byEngagement: {} } }
}

export function handle(store, rawReq) {
  /* 参数名归一放在这里而不是只在 HTTP 入口：直接调用 handle 的测试/脚本也走同一套。 */
  const req = normalizeArgs(rawReq || {})
  const op = typeof req.op === 'string' ? req.op : ''
  const eng = (() => {
    const raw = typeof req.engagement === 'string' ? req.engagement.trim() : ''
    if (raw !== '') return raw
    try { return store.activeEngagementId() || '' } catch { return '' }
  })()
  const needEng = () => {
    if (eng === '') throw new Error('请先选择项目（engagement）')
    return eng
  }

  switch (op) {
    case 'bootstrap': {
      const engagements = store.listEngagements()
      return {
        ok: true,
        root: store.root,
        side: 'defense',
        engagements,
        current: eng || (engagements[0] ? engagements[0].id : null),
        bindings: bindingsView(store),
        version: pluginVersion(),
      }
    }
    case 'projects': {
      const items = store.listEngagements().map((row) => {
        const meta = store.projectMeta(row.id)
        return { ...row, dir: meta.data_dir, workspace_id: meta.workspace_id, workspace_title: meta.workspace_title }
      })
      return { ok: true, items, current: store.activeEngagementId() || null }
    }
    case 'openEngagement': {
      const out = store.openEngagement(String(req.name || '').trim(), Array.isArray(req.scope) ? req.scope : [], {
        mode: req.mode, slaProfile: req.slaProfile, defender: req.defender, tz: req.tz, dataDir: req.dataDir, bindCurrent: true,
      })
      return { ok: true, engagement: out, snapshot: store.snapshot(out.id) }
    }
    case 'updateEngagement': {
      const patch = req.patch && typeof req.patch === 'object' ? req.patch : req
      return { ok: true, engagement: store.updateEngagementMeta(needEng(), patch) }
    }
    case 'deleteEngagement':
      return { ok: true, deleted: store.deleteEngagement(needEng()) }
    case 'activateEngagement':
      store.setActiveEngagement(needEng())
      return { ok: true, current: eng }
    case 'linkWorkspace': {
      const workspaceId = String(req.workspaceId || '').trim()
      if (workspaceId === '') throw new Error('缺少 workspaceId')
      return { ok: true, ...store.linkWorkspace(needEng(), workspaceId, req.title) }
    }
    case 'bindSession': {
      const sessionId = String(req.sessionId || '').trim()
      if (sessionId === '') throw new Error('缺少 sessionId')
      return { ok: true, binding: store.bindSession(sessionId, String(req.engagement || '')) }
    }
    case 'bindings':
      return { ok: true, ...bindingsView(store) }
    case 'snapshot':
      return { ok: true, snapshot: store.snapshot(needEng()), meta: store.projectMeta(needEng()) }
    case 'digest':
      return { ok: true, digest: store.blueDigest(needEng()) }

    /* ---- 资产 / 暴露面 / 基线 ---- */
    case 'assets':
      return { ok: true, items: store.listAssetRows(needEng(), req), profiles: true }
    case 'assetImport':
      return { ok: true, ...store.importAssets(needEng(), Array.isArray(req.rows) ? req.rows : []) }
    case 'assetAdd':
      return { ok: true, ...store.addAsset(needEng(), req) }
    case 'assetProfileSave':
      return { ok: true, ...store.saveAssetProfile(needEng(), req) }
    case 'exposures':
      return { ok: true, items: store.listExposure(needEng(), req), summary: store.exposureSummary(needEng()) }
    case 'exposureAdd':
      return { ok: true, ...store.addExposure(needEng(), req) }
    case 'exposureUpdate':
      return { ok: true, ...store.updateExposure(needEng(), req) }
    case 'baselineCheck':
      return { ok: true, ...store.baselineCheck(needEng(), req) }
    case 'baselineSummary':
      return { ok: true, ...store.baselineSummary(needEng()) }

    /* ---- 检测 ---- */
    case 'logSources':
      return { ok: true, items: store.listLogSources(needEng()) }
    case 'logSourceAdd':
      return { ok: true, ...store.addLogSource(needEng(), req) }
    case 'detections':
      return { ok: true, items: store.listDetections(needEng(), req) }
    case 'detectionAdd':
      return { ok: true, ...store.addDetection(needEng(), req) }
    case 'detectionVerify':
      return { ok: true, ...store.verifyDetection(needEng(), req) }
    case 'coverage':
      return { ok: true, ...store.coverage(needEng()) }

    /* ---- 告警 ---- */
    case 'alerts':
      return { ok: true, ...store.listAlerts(needEng(), req) }
    case 'alertCounts':
      return { ok: true, ...store.alertCounts(needEng()) }
    case 'alertIngest':
      return { ok: true, ...store.ingestAlerts(needEng(), Array.isArray(req.rows) ? req.rows : [], req) }
    case 'alertTriage':
      return { ok: true, ...store.triageAlert(needEng(), req) }
    case 'alertBulkTriage':
      return { ok: true, ...store.bulkTriage(needEng(), req) }
    case 'alertSuppress':
      return { ok: true, ...store.suppressAlert(needEng(), req) }

    /* ---- 事件 ---- */
    case 'incidents':
      return { ok: true, items: store.listIncidents(needEng(), req) }
    case 'incident':
      return { ok: true, ...store.getIncident(needEng(), req.incidentId ?? req.id) }
    case 'incidentOpen':
      return { ok: true, ...store.openIncident(needEng(), { ...req, alertIds: req.alertIds }) }
    case 'incidentUpdate':
      return { ok: true, ...store.updateIncident(needEng(), req) }
    case 'incidentNote':
      return { ok: true, ...store.addIncidentNote(needEng(), req) }

    /* ---- 处置（审批只在这里） ---- */
    case 'actions':
      return { ok: true, items: store.listActions(needEng(), req) }
    case 'actionPropose':
      return { ok: true, ...store.proposeAction(needEng(), req) }
    case 'actionApprove':
      return { ok: true, ...store.approveAction(needEng(), req) }
    case 'actionReject':
      return { ok: true, ...store.approveAction(needEng(), { ...req, approve: false }) }
    case 'actionExecute':
      return { ok: true, ...store.executeAction(needEng(), req) }
    case 'actionForce':
      return { ok: true, ...store.executeAction(needEng(), { ...req, emergency: true }) }
    case 'actionVerify':
      return { ok: true, ...store.verifyAction(needEng(), req) }
    case 'actionRollback':
      return { ok: true, ...store.rollbackAction(needEng(), req) }

    /* ---- 漏洞（待修清单） ---- */
    case 'vulns':
      return { ok: true, ...store.listVulns(needEng(), req) }
    case 'vulnAdd': {
      const assetId = (req.asset_id !== undefined || req.ip !== undefined) ? store.resolveAssetId(needEng(), req) : null
      return { ok: true, ...store.addVuln(needEng(), { ...req, asset_id: assetId, agent: 'user' }) }
    }
    case 'vulnUpdate':
      return { ok: true, ...store.updateVuln(needEng(), req.vulnId, req) }

    /* ---- 降噪名单（白/黑） ---- */
    case 'watchlist':
      return { ok: true, items: store.listWatchlist(needEng(), req.kind) }
    case 'watchlistAdd':
      return { ok: true, ...store.addWatchlist(needEng(), req) }

    /* ---- 报告 / 对账 ---- */
    case 'report':
      return { ok: true, text: store.blueReport(needEng(), req.kind) }
    case 'reconcileRun':
      return {
        ok: true,
        ...store.runReconcile({
          redRoot: req.redRoot, redEngagement: req.redEngagement,
          blueEngagement: eng, windowMin: req.windowMin, by: 'user',
        }),
      }
    case 'reconcileList':
      return { ok: true, items: store.listReconciles(needEng()) }
    case 'reconcileItems':
      return { ok: true, items: store.reconcileItems(needEng(), req.reconcileId) }

    /* ---- 提示词 / 版本 ---- */
    case 'prompts':
      return { ok: true, roles: store.listPrompts(needEng()) }
    case 'promptSave':
      return { ok: true, ...store.savePrompt(needEng(), req.role, req.content) }
    case 'promptReset':
      return { ok: true, ...store.resetPrompts(needEng(), req.role) }
    case 'version':
      return { ok: true, plugin: pluginVersion(), root: store.root }

    /* ---- 全局：技能库 / 环境 ---- */
    case 'skillCatalog': {
      const dir = bundledSkillsDir()
      const items = []
      if (dir !== null && existsSync(dir)) {
        for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
          let content = ''
          try { content = readFileSync(join(dir, file), 'utf8') } catch { content = '' }
          const title = (content.split('\n').find((line) => line.startsWith('# ')) || '').slice(2).trim()
          items.push({ id: file.replace(/\.md$/, ''), file, title: title || file, bytes: content.length, content: content.slice(0, 20000) })
        }
      }
      return { ok: true, dir, items }
    }
    case 'envInfo': {
      const active = eng
      const stats = active !== '' ? store.stats(active) : null
      return {
        ok: true,
        side: 'defense',
        root: store.root,
        version: pluginVersion(),
        active,
        dbPath: active !== '' ? store.dbPathOf(active) : null,
        dataDir: active !== '' ? store.dataDirOf(active) : null,
        projects: store.listEngagements().length,
        skillsDir: bundledSkillsDir(),
        stats,
      }
    }

    default:
      return { ok: false, error: '未知 op：' + (op || '(空)') }
  }
}

export function apply(ctx) {
  const store = ctx.blueteam

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/blueteam/api/events',
    handler: (req, res) => {
      if (req.method !== 'GET') { sendJson(res, 405, { ok: false, error: 'GET only' }); return }
      const url = new URL(req.url || '/', 'http://127.0.0.1')
      const engagement = String(url.searchParams.get('engagement') || '').trim()
      let since = Number(url.searchParams.get('since') || 0)
      if (!Number.isFinite(since)) since = 0
      res.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        connection: 'keep-alive',
      })
      res.write('retry: 3000\n\n')
      let closed = false
      req.on('close', () => { closed = true })
      const push = (event) => {
        if (closed) return
        try { res.write('data: ' + JSON.stringify(event) + '\n\n') } catch { closed = true }
      }
      const tick = () => {
        if (closed) return
        try {
          if (engagement && typeof store.listChanges === 'function') {
            const rows = store.listChanges(engagement, since, 20) || []
            for (let i = rows.length - 1; i >= 0; i -= 1) {
              const row = rows[i]
              push({ engagement, kind: row.kind, ref_id: row.ref_id, at: row.at, seq: row.id })
              if (row.id > since) since = row.id
            }
          } else {
            push({ heartbeat: true, at: new Date().toISOString() })
          }
        } catch { /* 轮询失败按心跳处理 */ }
      }
      tick()
      const timer = setInterval(tick, 1000)
      if (typeof timer.unref === 'function') timer.unref()
      req.on('close', () => { clearInterval(timer) })
    },
  }, 'blueteam: events'))

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/blueteam/api',
    handler: async (req, res) => {
      if (req.method !== 'POST') { sendJson(res, 405, { ok: false, error: 'POST only' }); return }
      const remote = req.socket && req.socket.remoteAddress ? String(req.socket.remoteAddress) : ''
      const loopback = remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
      const host = typeof req.headers.host === 'string' ? req.headers.host : ''
      const hostLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(host)
      const origin = req.headers.origin
      const originOk = (() => {
        if (loopback) return true
        if (hostLocal) {
          if (origin === undefined || origin === '' || origin === 'null') return true
          if (typeof origin === 'string' && /^app:/i.test(origin)) return true
          try { if (new URL(origin).host === host) return true } catch { /* fallthrough */ }
        }
        if (typeof origin !== 'string' || origin === '') return false
        try { return new URL(origin).host === host } catch { return false }
      })()
      if (!originOk) { sendJson(res, 403, { ok: false, error: 'cross-origin request rejected' }); return }
      try {
        const raw = await readBody(req)
        const request = normalizeArgs(raw.trim() ? JSON.parse(raw) : {})
        const result = handle(store, request)
        /* 环境页需要预设注册状态（只有 ctx 侧拿得到） */
        if (request.op === 'envInfo') {
          try { result.preset = ctx.blueteamPreset !== undefined ? ctx.blueteamPreset.status() : null } catch { result.preset = null }
        }
        sendJson(res, 200, result)
      } catch (error) {
        sendJson(res, 400, { ok: false, error: error && error.message ? error.message : String(error) })
      }
    },
  }))
}

export default { name, inject, apply }
