/**
 * NEXT 路线功能模块接线：自动重试/继续、规则库初始化、加密槽种子、会话回退包装。
 * 这些模块全部是纯插件功能（零宿主写入），与 legacy 路线共用同一实现。
 */
import fs from "node:fs";
import * as rules from "../rules.js";
import * as continueRetry from "../continue-retry.js";
import * as rewind from "../rewind.js";
import { findDshHome, pinDshHome } from "../shared/home.js";
import { seedPromptInjectAtBoot } from "../shared/override.js";
import { hostCoreVersion } from "../shared/host-version.js";

/** 启动期初始化：钉主目录 → 种子加密槽到 prompt-inject.md → 规则库状态就绪。 */
export async function ensureInitialState() {
  const home = pinDshHome() || findDshHome();
  let seed = null;
  try {
    seed = seedPromptInjectAtBoot(home);
  } catch { /* 主目录尚未就绪 */ }
  let rulesInit = null;
  try {
    rulesInit = await rules.ensureInitialState(home);
  } catch { /* ignore */ }
  return { home, seed, rulesInit };
}

/** 自动重试/继续（与 legacy 同一实现；返回 runtime 句柄供 effect 回收）。 */
export function installContinueRetry(ctx, pluginCfg) {
  const saved = continueRetry.loadSettings(findDshHome());
  return continueRetry.installContinueRetry(ctx, {
    getConfig: () => continueRetry.mergeConfig(pluginCfg, saved),
  });
}

/** 会话回退包装：既有会话补挂 derive 过滤，新会话自动包装。 */
export function installRewindDeriveFilter(ctx) {
  if (!ctx || ctx.__dshPurgeRewindDerive) return;
  ctx.__dshPurgeRewindDerive = true;
  const wrapOne = (session) => {
    try { rewind.wrapSessionDeriveMessages(session); } catch { /* ignore */ }
  };
  try {
    const store = ctx.get?.("sessions");
    const all = typeof store?.all === "function" ? store.all()
      : typeof store?.list === "function" ? store.list()
      : [];
    for (const session of all || []) wrapOne(session);
  } catch { /* ignore */ }
  try {
    ctx.effect(() => {
      let disposer = null;
      try { disposer = ctx.on("session/created", (session) => wrapOne(session)); } catch { /* ignore */ }
      return () => {
        try { if (typeof disposer === "function") disposer(); } catch { /* ignore */ }
        delete ctx.__dshPurgeRewindDerive;
      };
    });
  } catch { /* 无 effect 时靠 cordis scope 回收 */ }
}

/** NEXT 状态快照（/purge status 与 /dsh-purge/status 共用）。 */
export async function gatherNextState() {
  const home = pinDshHome() || findDshHome();
  let inject = { source: "none", text: "" };
  try {
    inject = rules.resolveInjectText(home);
  } catch { /* ignore */ }
  const ui = { home };
  try {
    ui.injectPath = `${home}${fs.sep}prompt-inject.md`.replace(/\\/g, "/");
    ui.injectExists = fs.existsSync(ui.injectPath);
  } catch { /* ignore */ }
  return {
    route: "next",
    hostCoreVersion: hostCoreVersion() || "(unresolved)",
    dsh_home: home,
    inject_source: inject.source || "none",
    inject_rule_id: inject.ruleId ?? null,
    inject_bytes: typeof inject.text === "string" ? inject.text.length : 0,
    ...ui,
  };
}
