/**
 * NEXT 路线 HTTP 路由（/dsh-purge/*）。
 *
 * 迁移自 legacy/index.js 的路由层，NEXT 语义改造：
 *   - apply/revert/restart/uninstall 不再存在（无磁盘补丁可打）；
 *   - own-servers / drill-grant 路由随护栏删除退役；
 *   - 同源校验（sec-fetch-site/origin-host）与 disposer 回收模式照搬。
 * /redteam/api 不在这里 —— 由 dsh-purge-redteam-ui 行（lib/redteam/ui.js）自带。
 */
import * as rules from "../rules.js";
import * as skills from "../skills.js";
import * as rewind from "../rewind.js";
import * as continueRetry from "../continue-retry.js";
import * as updater from "../legacy/update.js";
import { gatherNextState } from "./modules.js";
import { findDshHome } from "../shared/home.js";
import { atomicWriteFile } from "../shared/atomic.js";
import {
  commitOverrideOnApply,
  readOverrideForUi,
  rememberCommittedOverride,
  saveOverrideContent,
  seedPromptInjectAtBoot,
  syncPromptInjectOnDiskSync,
  readPromptInjectFileSync,
  defaultOverrideText,
} from "../shared/override.js";

function headerOf(request, name) {
  const headers = request?.headers;
  if (!headers) return "";
  const value = headers[name] ?? headers[String(name).toLowerCase()];
  if (Array.isArray(value)) return String(value[0] || "");
  return String(value || "");
}

function denyCrossOrigin(response) {
  response.writeHead(403, { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ ok: false, error: "cross-origin blocked" }));
}

function allowPluginRequest(request, response) {
  const site = headerOf(request, "sec-fetch-site").toLowerCase();
  if (site === "cross-site") return denyCrossOrigin(response), false;
  const origin = headerOf(request, "origin").trim();
  if (origin === "null") return denyCrossOrigin(response), false;
  if (!origin) return true;
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    return denyCrossOrigin(response), false;
  }
  const host = headerOf(request, "host").trim();
  if (!host || originHost.toLowerCase() !== host.toLowerCase()) {
    return denyCrossOrigin(response), false;
  }
  return true;
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request, maxBytes = 512 * 1024) {
  const chunks = [];
  let size = 0;
  const limit = Number.isFinite(maxBytes) && maxBytes > 0 ? maxBytes : 512 * 1024;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > limit) throw new Error("request body too large");
    chunks.push(buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

function registerRoute(webServer, spec) {
  try {
    const handler = spec.handler;
    return webServer.register({
      ...spec,
      handler: async (request, response) => {
        if (!allowPluginRequest(request, response)) return;
        return handler(request, response);
      },
    });
  } catch (e) {
    console.warn("[dsh-purge] route", spec?.path, String(e && e.message ? e.message : e));
    return () => {};
  }
}

function injectSnapshot(home) {
  try {
    const resolved = rules.resolveInjectText(home);
    return { injectSource: resolved.source, injectRuleId: resolved.ruleId ?? null };
  } catch {
    return { injectSource: "none", injectRuleId: null };
  }
}

async function handleRulesOp(op, body, queryId, queryCwd) {
  const dshHome = findDshHome();
  const id = typeof body?.id === "string" ? body.id : String(queryId || "");
  const cwdHint = typeof body?.cwd === "string" && body.cwd.trim()
    ? body.cwd.trim()
    : (typeof queryCwd === "string" && queryCwd.trim() ? queryCwd.trim() : "");
  if (cwdHint) {
    try { rules.writeLastCwd(dshHome, cwdHint); } catch { /* ignore */ }
  }
  if (op === "status") return { ok: true, ...(await rules.rulesStatus(dshHome, cwdHint)) };
  if (op === "scan-cwd" || op === "scan") {
    const effective = cwdHint || rules.readLastCwd(dshHome);
    const candidates = effective ? rules.scanCwdInstructions(effective) : [];
    const selections = rules.readCwdSelections(dshHome);
    return {
      ok: true,
      cwd: effective,
      candidates: candidates.map((item) => ({ ...item, selected: selections.includes(item.path) })),
      selections,
    };
  }
  if (op === "toggle-cwd") {
    const target = typeof body?.path === "string" ? body.path.trim() : "";
    if (!target) return { status: 400, ok: false, error: "path required" };
    const enabled = body?.enabled !== false;
    const next = await rules.toggleCwdSelection(dshHome, target, enabled);
    return { ok: true, selections: next };
  }
  if (op === "set-policy" || op === "workspace-policy") {
    const policy = typeof body?.policy === "string" ? body.policy.trim() : "";
    if (!rules.WORKSPACE_POLICIES.includes(policy)) {
      return { status: 400, ok: false, error: `invalid policy: ${policy}` };
    }
    const applied = await rules.writeWorkspacePolicy(dshHome, policy);
    return { ok: true, policy: applied, policies: [...rules.WORKSPACE_POLICIES] };
  }
  if (op === "read") {
    if (!rules.validRuleId(id)) return { status: 400, ok: false, error: "invalid id" };
    const content = await rules.readRule(dshHome, id);
    if (content === null) return { status: 404, ok: false, error: `rule not found: ${id}` };
    const meta = await rules.readRuleMeta(dshHome, id);
    return { ok: true, id, name: meta.name, target: meta.target, content };
  }
  if (op === "save") {
    const content = typeof body?.content === "string" ? body.content : null;
    if (!rules.validRuleId(id) || content === null) {
      return { status: 400, ok: false, error: "id and content (string) required" };
    }
    const target = typeof body?.target === "string" ? body.target : undefined;
    if (target !== undefined && !rules.validTarget(target)) {
      return { status: 400, ok: false, error: `invalid target: ${target}` };
    }
    await rules.saveRule(dshHome, id, content, {
      name: typeof body?.name === "string" ? body.name : undefined,
      target,
    });
    rememberCommittedOverride(dshHome, readPromptInjectFileSync(dshHome) || defaultOverrideText());
    return { ok: true, id, ...injectSnapshot(dshHome) };
  }
  if (op === "activate") {
    if (!rules.validRuleId(id)) return { status: 400, ok: false, error: "invalid id" };
    const meta = await rules.activateRule(dshHome, id);
    return {
      ok: true,
      id,
      name: meta.name,
      target: meta.target,
      agents_path: rules.targetPath(dshHome, meta.target),
      note: "已写入目标文件并注入 systemPrompt，新会话生效",
      ...injectSnapshot(dshHome),
    };
  }
  if (op === "delete") {
    if (!rules.validRuleId(id)) return { status: 400, ok: false, error: "invalid id" };
    await rules.deleteRule(dshHome, id);
    return { ok: true, id };
  }
  if (op === "reset") {
    const r = await rules.resetToOriginal(dshHome);
    return { ok: true, ...r, note: "已还原出厂状态（无全局指令）；规则库保留" };
  }
  return { status: 400, ok: false, error: `unknown op: ${op}` };
}

function rulesHttpHandler() {
  return async (request, response) => {
    if (request.method === "OPTIONS") {
      response.writeHead(204, { "cache-control": "no-store" });
      response.end();
      return;
    }
    try {
      const url = new URL(request.url ?? "", "http://127.0.0.1");
      const tail = url.pathname.replace(/^\/dsh-purge\/rules\/?/, "").replace(/\/$/, "");
      let body = {};
      if (request.method === "POST") body = await readJsonBody(request);
      else if (request.method !== "GET" && request.method !== "POST") {
        response.writeHead(405, { allow: "GET, POST, OPTIONS" });
        response.end();
        return;
      }
      const op = body.op || tail || "status";
      const result = await handleRulesOp(op, body, url.searchParams.get("id"), url.searchParams.get("cwd"));
      sendJson(response, result.status || 200, result);
    } catch (e) {
      sendJson(response, 500, { ok: false, error: String(e && e.message ? e.message : e) });
    }
  };
}

async function handleSkillsOp(op, body, queryId) {
  const dshHome = findDshHome();
  const id = typeof body?.id === "string" ? body.id : String(queryId || "");
  if (op === "status") return { ok: true, ...(await skills.skillsStatus(dshHome)) };
  if (op === "read") {
    if (!skills.validSkillName(id)) return { status: 400, ok: false, error: "invalid skill name" };
    const item = await skills.readSkill(dshHome, id);
    if (!item) return { status: 404, ok: false, error: `skill not found: ${id}` };
    return { ok: true, ...skills.toPublicSkill(dshHome, item) };
  }
  if (op === "save") {
    if (!skills.validSkillName(id)) return { status: 400, ok: false, error: "id 必须是 kebab-case" };
    const content = typeof body?.content === "string" ? body.content : "";
    const description = typeof body?.description === "string" ? body.description : "";
    const saved = await skills.saveSkill(dshHome, id, content, description);
    return { ok: true, ...skills.toPublicSkill(dshHome, saved) };
  }
  if (op === "delete") {
    if (!skills.validSkillName(id)) return { status: 400, ok: false, error: "invalid skill name" };
    const removed = await skills.deleteSkill(dshHome, id);
    return { ok: true, ...skills.toPublicSkill(dshHome, removed) };
  }
  if (op === "import") {
    if (body?.path || body?.source || body?.folder) {
      return { status: 400, ok: false, error: "请在本机选择压缩包或文件夹导入" };
    }
    if (typeof body?.data === "string" && body.data.trim()) {
      const packed = await skills.importArchive(dshHome, Buffer.from(body.data, "base64"), body.name || "skill.zip");
      return { ok: true, ...packed };
    }
    if (Array.isArray(body?.files) && body.files.length) {
      const packed = await skills.importFileTree(dshHome, body.files, body.name || "");
      return { ok: true, ...packed };
    }
    return { status: 400, ok: false, error: "请选择压缩包或文件夹" };
  }
  return { status: 400, ok: false, error: `unknown op: ${op}` };
}

function skillsHttpHandler() {
  return async (request, response) => {
    if (request.method === "OPTIONS") {
      response.writeHead(204, { "cache-control": "no-store" });
      response.end();
      return;
    }
    if (request.method !== "GET" && request.method !== "POST") {
      response.writeHead(405, { allow: "GET, POST, OPTIONS" });
      response.end();
      return;
    }
    try {
      const url = new URL(request.url ?? "", "http://127.0.0.1");
      const match = String(url.pathname || "").match(/^\/dsh-purge\/skills?(?:\/(.*))?$/i);
      const tail = match ? String(match[1] || "").replace(/\/$/, "") : "";
      const body = request.method === "POST" ? await readJsonBody(request, 14 * 1024 * 1024) : {};
      const op = body.op || tail || url.searchParams.get("op") || (url.searchParams.get("id") ? "read" : "status");
      const result = await handleSkillsOp(op, body, url.searchParams.get("id"));
      sendJson(response, result.status || 200, result);
    } catch (e) {
      sendJson(response, 500, { ok: false, error: String(e && e.message ? e.message : e) });
    }
  };
}

/** @param {any} ctx @param {object} cfg */
export function installHttp(ctx, cfg) {
  try {
    ctx.inject(["webServer"], (host) => {
      host.effect(() => {
        const stop = [];
        const track = (d) => { if (typeof d === "function") stop.push(d); return d; };
        const route = (spec) => track(host.webServer.register(spec));

        track(host.webServer.register({
          kind: "exact",
          path: "/dsh-purge/status",
          handler: async (request, response) => {
            if (request.method !== "GET") { response.writeHead(405, { allow: "GET" }); response.end(); return; }
            try {
              const state = await gatherNextState();
              const ui = await readOverrideForUi(state.dsh_home);
              sendJson(response, 200, {
                ok: true,
                ...state,
                override_path: ui.path,
                override_exists: ui.exists,
                override_customized: ui.customized,
                override_content: ui.content,
                default_content: ui.defaultContent,
                plugin_version: updater.localVersion(),
                update: updater.lastUpdateResult(),
                ...injectSnapshot(state.dsh_home),
              });
            } catch (e) {
              sendJson(response, 500, { ok: false, error: String(e) });
            }
          },
        }, "dsh-purge: status"));

        track(host.webServer.register({
          kind: "exact",
          path: "/dsh-purge/override",
          handler: async (request, response) => {
            if (request.method === "GET") {
              try {
                const home = findDshHome();
                try { seedPromptInjectAtBoot(home); } catch { /* ignore */ }
                syncPromptInjectOnDiskSync(home);
                const ui = await readOverrideForUi(home);
                sendJson(response, 200, { ok: true, ...ui, ...injectSnapshot(home) });
              } catch (e) {
                sendJson(response, 500, { ok: false, error: String(e) });
              }
              return;
            }
            if (request.method === "POST") {
              try {
                const body = await readJsonBody(request, 2 * 1024 * 1024);
                const content = typeof body?.content === "string" ? body.content : null;
                if (content === null) {
                  sendJson(response, 400, { ok: false, error: "content must be a string" });
                  return;
                }
                const home = findDshHome();
                const saved = await saveOverrideContent(home, content);
                const ui = await readOverrideForUi(home);
                sendJson(response, 200, {
                  ok: true,
                  content: saved.content,
                  defaultContent: saved.defaultContent,
                  customized: ui.customized,
                  path: ui.path,
                  ...injectSnapshot(home),
                });
              } catch (e) {
                sendJson(response, 500, { ok: false, error: String(e) });
              }
              return;
            }
            response.writeHead(405, { allow: "GET, POST" });
            response.end();
          },
        }, "dsh-purge: override"));

        track(host.webServer.register({
          kind: "prefix",
          path: "/dsh-purge/rules",
          handler: rulesHttpHandler(),
        }, "dsh-purge: rules"));
        track(host.webServer.register({
          kind: "prefix",
          path: "/dsh-purge/skills",
          handler: skillsHttpHandler(),
        }, "dsh-purge: skills"));
        track(host.webServer.register({
          kind: "prefix",
          path: "/dsh-purge/skill",
          handler: skillsHttpHandler(),
        }, "dsh-purge: skill"));

        track(host.webServer.register({
          kind: "exact",
          path: "/dsh-purge/last-user",
          handler: async (request, response) => {
            if (request.method !== "GET") { response.writeHead(405, { allow: "GET" }); response.end(); return; }
            try {
              const url = new URL(request.url, "http://127.0.0.1");
              const sessionId = String(url.searchParams.get("sessionId") || "").trim();
              sendJson(response, 200, await rewind.readLastUserText(ctx, sessionId));
            } catch (e) {
              sendJson(response, 500, { ok: false, error: String(e) });
            }
          },
        }, "dsh-purge: last user"));

        track(host.webServer.register({
          kind: "exact",
          path: "/dsh-purge/rewind/options",
          handler: async (request, response) => {
            if (request.method !== "GET") { response.writeHead(405, { allow: "GET" }); response.end(); return; }
            try {
              const url = new URL(request.url, "http://127.0.0.1");
              const sessionId = String(url.searchParams.get("sessionId") || "").trim();
              sendJson(response, 200, await rewind.analyzeRewind(ctx, sessionId));
            } catch (e) {
              sendJson(response, 500, { ok: false, error: String(e) });
            }
          },
        }, "dsh-purge: rewind options"));

        track(host.webServer.register({
          kind: "exact",
          path: "/dsh-purge/rewind",
          handler: async (request, response) => {
            if (request.method === "GET") {
              try {
                const url = new URL(request.url, "http://127.0.0.1");
                const sessionId = url.searchParams.get("sessionId");
                if (sessionId) {
                  const draft = rewind.takeDraft(sessionId);
                  sendJson(response, 200, { ok: true, ...(draft || {}) });
                  return;
                }
                const pending = rewind.getPending();
                sendJson(response, 200, { ok: true, ...(pending || {}) });
              } catch (e) {
                sendJson(response, 500, { ok: false, error: String(e) });
              }
              return;
            }
            if (request.method === "POST") {
              try {
                const body = await readJsonBody(request);
                const sessionId = String(body?.sessionId || "").trim();
                if (!sessionId) { sendJson(response, 400, { ok: false, error: "需要 sessionId" }); return; }
                const mode = body?.mode === "round" ? "round" : "once";
                const result = await rewind.applyRewind(ctx, sessionId, mode);
                sendJson(response, result.ok ? 200 : 409, result);
              } catch (e) {
                sendJson(response, 500, { ok: false, error: String(e) });
              }
              return;
            }
            response.writeHead(405, { allow: "GET, POST" });
            response.end();
          },
        }, "dsh-purge: rewind"));

        track(host.webServer.register({
          kind: "exact",
          path: "/dsh-purge/continue/settings",
          handler: async (request, response) => {
            const home = findDshHome();
            if (request.method === "GET") {
              sendJson(response, 200, { ok: true, settings: continueRetry.loadSettings(home) });
              return;
            }
            if (request.method === "POST") {
              try {
                const body = await readJsonBody(request);
                const current = continueRetry.loadSettings(home);
                const next = {
                  ...current,
                  ...(typeof body?.autoContinue === "boolean" ? { autoContinue: body.autoContinue } : {}),
                  ...(Number.isFinite(body?.continueMax) ? { continueMax: continueRetry.clampCount(body.continueMax) } : {}),
                  ...(typeof body?.continueText === "string" && body.continueText.trim() ? { continueText: body.continueText.trim() } : {}),
                };
                await atomicWriteFile(continueRetry.settingsPath(home), `${JSON.stringify(next, null, 2)}\n`, "utf8");
                sendJson(response, 200, { ok: true, settings: next });
              } catch (e) {
                sendJson(response, 500, { ok: false, error: String(e) });
              }
              return;
            }
            response.writeHead(405, { allow: "GET, POST" });
            response.end();
          },
        }, "dsh-purge: continue settings"));

        track(host.webServer.register({
          kind: "exact",
          path: "/dsh-purge/update",
          handler: async (request, response) => {
            if (request.method === "GET") {
              try {
                sendJson(response, 200, await updater.checkUpdate());
              } catch (e) {
                sendJson(response, 500, { ok: false, error: String(e) });
              }
              return;
            }
            if (request.method === "POST") {
              try {
                const body = await readJsonBody(request);
                const result = await updater.handleUpdateOp(body || {});
                sendJson(response, 200, result);
                // NEXT 路线无磁盘补丁：更新后不触发 reapply/重启，提示用户手动重启宿主。
                if (result && result.restartAfter) {
                  result.note = "更新完成；请手动重启宿主使新版本生效。";
                }
              } catch (e) {
                sendJson(response, 500, { ok: false, error: String(e) });
              }
              return;
            }
            response.writeHead(405, { allow: "GET, POST" });
            response.end();
          },
        }, "dsh-purge: update"));

        return () => {
          for (let i = stop.length - 1; i >= 0; i -= 1) {
            try { stop[i](); } catch { /* ignore */ }
          }
          stop.length = 0;
        };
      }, "dsh-purge: next http routes");
    });
  } catch (error) {
    try {
      ctx.logger?.warn?.(`dsh-purge: http install failed: ${String(error?.message ?? error)}`);
    } catch { /* ignore */ }
  }
}

export { commitOverrideOnApply };
