/**
 * NEXT 配置层合成模拟（源码级验证，不触宿主）。
 *
 * 用 NEXT 安装内真实编译产物驱动整条官方合成链：
 *   真实 YAML 方言解析器（app-boot.loadOverlayPatches，含 !!js 惰性标记）
 *   × 真实三层 patch：dsh-base（建树）→ dsh-web-app（surface 层）→ dsh-purge（本插件）
 *   → 真实补丁引擎（cordis-plugin-include.applyEntryPatches）
 * 断言最终配置树上破甲各行的状态，并捕获引擎 warn（name 守卫/未知 id 都会在这里现形）。
 *
 * 运行前提：.ai_temp/next-app 存在（由 lib/legacy/extract-asar.js 从本机 NEXT 安装只读提取）。
 * 不存在时跳过并提示（CI 无该环境）。
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const RUNTIME = path.resolve(HERE, "..", ".ai_temp", "next-app", "node_modules", "@deepseek-ai");

if (!fs.existsSync(path.join(RUNTIME, "dsh-app-boot", "lib", "index.js"))) {
  console.log("SKIP: .ai_temp/next-app 不存在（先从本机 NEXT 安装只读提取 app.asar）");
  process.exit(0);
}

const boot = await import(pathToFileURL(path.join(RUNTIME, "dsh-app-boot", "lib", "index.js")).href);
const include = await import(pathToFileURL(path.join(RUNTIME, "cordis-plugin-include", "lib", "index.js")).href);
const { applyEntryPatches } = include;

const results = [];
async function check(label, fn) {
  try {
    await fn();
    results.push("PASS  " + label);
  } catch (error) {
    results.push("FAIL  " + label + " :: " + error.message);
    process.exitCode = 1;
  }
}

/** 引擎 warn 收集器：name 守卫跳过 / 未知 id 都会写到这里。 */
const warns = [];
const warn = (format, ...args) => warns.push(String(format).replace(/%C|%s/g, () => String(args.shift() ?? "")));

// ── 真实三层加载（web-app 走官方 bundlePatchPaths 多文件序：主 yml + presets/*.patch.yml）──
const baseLayer = boot.loadOverlayPatches("dsh", path.join(RUNTIME, "dsh-base", "cordis.patch.yml"));
const webAppDir = path.join(RUNTIME, "dsh-web-app");
const webManifest = boot.readProfileManifest("dsh", webAppDir);
const webPatchPaths = boot.bundlePatchPaths(webAppDir, webManifest.dsh?.bundle ?? {});
const webAppLayer = webPatchPaths.flatMap((p) => boot.loadOverlayPatches("dsh", p));
const purgeLayer = boot.loadOverlayPatches("dsh", path.resolve(HERE, "..", "cordis.patch.yml"));

// ── 按宿主合成序叠加（bundle 声明顺序：base → web-app → 用户 bundle dsh-purge）──
let entries = [];
for (const [name, layer] of [["dsh-base", baseLayer], ["dsh-web-app", webAppLayer], ["dsh-purge", purgeLayer]]) {
  entries = applyEntryPatches(entries, layer, (f, ...a) => warn(`[${name}] ${f}`, ...a));
}

const rowById = new Map();
const walk = (list) => {
  for (const entry of list) {
    if (entry.id) rowById.set(entry.id, entry);
    if (entry.group && Array.isArray(entry.config)) walk(entry.config);
  }
};
walk(entries);

// ── 断言：破甲配置行 ──
await check("approval 行最终 policy=ask（never=rc.3 自动拒绝，已修正）", () => {
  assert.equal(rowById.get("approval")?.config?.policy, "ask");
});

await check("sandbox-policy 行 mode=danger-full-access（且 workspaceRoot 重述保留）", () => {
  const cfg = rowById.get("sandbox-policy")?.config ?? {};
  assert.equal(cfg.mode, "danger-full-access");
  assert.ok(cfg.workspaceRoot !== undefined, "workspaceRoot 必须重述（整 config 替换语义）");
});

await check("permission 行 danger-full-access 档 approval=ask（防会话播种拒绝链）", () => {
  const presets = rowById.get("permission")?.config?.presets ?? {};
  assert.equal(presets["danger-full-access"]?.approval, "ask");
  assert.equal(presets["danger-full-access"]?.sandbox, "danger-full-access");
  assert.equal(presets["workspace-write"]?.approval, "ask");
});

await check("system-prompt 行 includeHarnessIdentity=false + personaPrefix 空", () => {
  const cfg = rowById.get("system-prompt")?.config ?? {};
  assert.equal(cfg.includeHarnessIdentity, false);
  assert.equal(cfg.personaPrefix, "");
});

await check("fs-sandbox 未被禁用（ctx.fs 唯一提供者保持在场）", () => {
  const row = rowById.get("fs-sandbox");
  assert.ok(row !== undefined, "fs-sandbox 行必须存在");
  assert.notEqual(row.disabled, true, "fs-sandbox 禁用会砍掉全部文件工具");
});

await check("repeat-tool-reminder / tool-result-pruner 宿主面行已禁用", () => {
  assert.equal(rowById.get("repeat-tool-reminder")?.disabled, true);
  assert.equal(rowById.get("tool-result-pruner")?.disabled, true);
});

await check("插件 insert 行在树中：dsh-purge 薄入口 + 红队三件套", () => {
  const ids = new Set([...rowById.keys()]);
  assert.ok(ids.has("dsh-purge"), "dsh-purge 行缺失");
  assert.ok(ids.has("dsh-purge-redteam"), "演练台行缺失");
  assert.ok(ids.has("dsh-purge-redteam-store"), "事实库行缺失");
  assert.ok(ids.has("dsh-purge-redteam-ui"), "HTTP 桥行缺失");
  const purge = rowById.get("dsh-purge");
  assert.equal(purge.name, "dsh-purge");
  assert.equal(purge.config?.autoGrant, true);
  assert.equal(purge.config?.allowTools, true);
});

await check("旧独立红队包 5 行：干净树上优雅 no-op（引擎 not-found warn 即设计行为，装过旧包的用户树上则真禁用）", () => {
  const expected = ["redteam-store", "redteam-ui", "redteam-mode", "redteam-mode-store", "redteam-mode-ui"];
  for (const id of expected) {
    const warned = warns.some((w) => w.includes(`entry ${id} not found`));
    assert.ok(warned, id + " 应产生 not-found warn（证明行存在时才会被禁用，干净树安全跳过）");
  }
});

await check("引擎 warn 全集 = 仅 5 条预期 redteam not-found（无 name 失配、无其它未知行）", () => {
  const unexpected = warns.filter((w) => /not found|mismatch/.test(w) && !/redteam-(store|ui|mode|mode-store|mode-ui)/.test(w));
  assert.deepEqual(unexpected, [], "存在非预期引擎警告:\n" + warns.join("\n"));
});

await check("preset-standard 行在场且嵌套 agent 工具组未被破坏", () => {
  const row = rowById.get("preset-standard");
  assert.ok(row !== undefined, "preset-standard 行丢失");
  const plugins = row.config?.plugins;
  assert.ok(Array.isArray(plugins) && plugins.length > 0, "preset-standard 的 plugins 组为空");
});

console.log(results.join("\n"));
const failed = results.filter((line) => line.startsWith("FAIL")).length;
console.log("");
console.log("summary: " + (results.length - failed) + " passed, " + failed + " failed" + (failed ? "" : "（真实引擎 × 真实三层 yml 合成，破甲配置层全绿）"));
if (warns.length) console.log("引擎 warn（全部）:\n" + warns.join("\n"));
