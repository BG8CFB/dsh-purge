// prompt-inject.md / 加密默认 的 override 状态机（自 lib/legacy/core.js:2381-2413, 7589-7862 平移）。
// 依赖收敛到共享层：openSlot ← ./persona-slot.js，原子写 ← ./atomic.js，主目录 ← ./home.js。
// legacy/core.js 保留自己的同名实现（其内部还依赖 hostFs / 打补丁链路），P6.5 再收敛去重。
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { atomicWriteFile, atomicWriteSync } from "./atomic.js";
import { findDshHome } from "./home.js";
import { openSlot } from "./persona-slot.js";

const fsp = fs.promises;

export function findOverrideFile(dshHome) {
  return path.join(dshHome, "prompt-inject.md");
}

let committedOverride = null;

/** 本次进程里提示词框刚提交的正文；与磁盘上用户自改正文合并使用。 */
export function rememberCommittedOverride(dshHome, text) {
  const home = path.normalize(String(dshHome || ""));
  if (!home) return;
  committedOverride = { home, text: typeof text === "string" ? text : "" };
}

/** $DSH_HOME/prompt-inject.md 正文（应用/解包后由加密槽落下；注入与设置框以它为准）。 */
export function readPromptInjectFileSync(dshHome) {
  const fp = findOverrideFile(dshHome);
  let disk = "";
  try {
    if (fp && fs.existsSync(fp)) disk = fs.readFileSync(fp, "utf8");
  } catch {
    disk = "";
  }
  const norm = normalizeOverride(disk);
  return norm ? disk.replace(/\r\n/g, "\n") : "";
}

/** 仅本进程提示词框提交；重启后为空，注入改读 prompt-inject.md。 */
export function peekCommittedOverride(dshHome) {
  if (!committedOverride) return null;
  const home = path.normalize(String(dshHome || ""));
  if (home !== committedOverride.home) return null;
  return committedOverride.text;
}

let hungOperatorPromptText = "";

/** 本进程挂上的操作者正文。没有框里刚提交的字时，就是插件加密默认。 */
export function hangOperatorPrompt(text) {
  hungOperatorPromptText = typeof text === "string" ? text : "";
}

export function hungOperatorPrompt() {
  return hungOperatorPromptText;
}

export function normalizeOverride(text) {
  return String(text ?? "").replace(/\r\n/g, "\n").trim();
}

export function hashOverride(text) {
  return createHash("sha256").update(normalizeOverride(text), "utf8").digest("hex");
}

export function defaultOverrideText() {
  // 插件内置出厂默认（加密槽）。运行注入以 $DSH_HOME/prompt-inject.md 为准。
  const sealed = openSlot();
  return normalizeOverride(sealed) ? sealed : "";
}

export function defaultOverrideHash() {
  return hashOverride(defaultOverrideText());
}

export function overrideStatePath(dshHome) {
  return path.join(dshHome, "dsh-purge", "override-state.json");
}

export function readOverrideStateSync(dshHome) {
  const fp = overrideStatePath(dshHome);
  try {
    const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

export async function readOverrideState(dshHome) {
  return readOverrideStateSync(dshHome);
}

export async function writeOverrideState(dshHome, state) {
  const fp = overrideStatePath(dshHome);
  // H19:原子写。半写坏的 override-state 会让下次启动 JSON.parse 抛错。
  await atomicWriteFile(fp, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export async function markOverrideCustomized(dshHome, customized, text) {
  await writeOverrideState(dshHome, {
    customized: Boolean(customized),
    hash: hashOverride(text ?? defaultOverrideText()),
    seedHash: defaultOverrideHash(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * 磁盘上这份正文是不是「上一次我们自己落盘写进去的」。
 *
 * 必须先比这一步，再比内置默认：重新加密（embed-prompt）之后 defaultOverrideHash()
 * 一定会变，而磁盘上还是上一版默认。直接拿磁盘比新默认，会把「插件自己写的旧默认」
 * 误判成「用户手改」，installOverride 从此永久拒绝更新。
 */
function overrideTextIsOurs(state, text) {
  const stamp = hashOverride(text);
  if (typeof state?.hash === "string" && state.hash === stamp) return true;
  if (typeof state?.seedHash === "string" && state.seedHash === stamp) return true;
  return false;
}

/** 插件默认血统：ChatML 头 + 小码酱标记。旧槽/旧盘也带这两句，应用时应刷到当前槽，不必再点保存。 */
const PLUGIN_DEFAULT_MARKS = [
  "<|im_start|>system:",
  "<project_instructions>",
  "Little Code Sauce",
];

export function looksLikePluginDefault(text) {
  const n = normalizeOverride(text);
  if (!n) return false;
  if (n === normalizeOverride(defaultOverrideText())) return true;
  return PLUGIN_DEFAULT_MARKS.every((mark) => n.includes(mark));
}

/** 框里/盘上这份是不是「用户另写的稿」。插件旧默认、当前槽、上次 seed 都算否。 */
export function isKeepableUserOverride(dshHome, text) {
  const incoming = normalizeOverride(text);
  if (!incoming) return false;
  if (incoming === normalizeOverride(defaultOverrideText())) return false;
  if (looksLikePluginDefault(text)) return false;
  const state = readOverrideStateSync(dshHome);
  const stamp = hashOverride(text);
  if (typeof state?.seedHash === "string" && state.seedHash === stamp) return false;
  if (state.customized !== true && overrideTextIsOurs(state, text)) return false;
  return true;
}

export function isUserCustomizedOverrideSync(dshHome) {
  return isKeepableUserOverride(dshHome, readPromptInjectFileSync(dshHome));
}

export async function isUserCustomizedOverride(dshHome) {
  return isUserCustomizedOverrideSync(dshHome);
}

export async function overrideStatus(_dshHome) {
  if (normalizeOverride(defaultOverrideText())) return "default";
  return "missing";
}

/** 设置框显示 $DSH_HOME/prompt-inject.md；尚未落下时预览加密默认。 */
export async function readOverrideForUi(dshHome) {
  const fp = findOverrideFile(dshHome);
  const defaultContent = defaultOverrideText();
  const disk = readPromptInjectFileSync(dshHome);
  let exists = false;
  try { exists = fs.existsSync(fp); } catch { exists = false; }
  const hasDisk = Boolean(normalizeOverride(disk));
  const customized = isUserCustomizedOverrideSync(dshHome);
  const content = hasDisk ? disk : defaultContent;
  return {
    path: fp,
    exists: exists && hasDisk,
    empty: !normalizeOverride(content),
    customized,
    usingDefault: hasDisk && !customized,
    content,
    defaultContent,
  };
}

function writeOverrideStateSync(dshHome, state) {
  const fp = overrideStatePath(dshHome);
  // H19:原子写。
  atomicWriteSync(fp, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

/**
 * 组装/对话读的是磁盘 prompt-inject.md；设置框里的预览来自加密槽，点保存才 POST。
 * 缺文件或仍是插件落盘的旧默认时，静默同步当前槽到磁盘，避免「界面看着对、聊天却用旧稿/空稿」。
 */
export function syncPromptInjectOnDiskSync(dshHome) {
  const home = path.normalize(String(dshHome || findDshHome() || ""));
  if (!home) return { action: "skip", reason: "no_home" };
  const bundled = defaultOverrideText();
  const bundledNorm = normalizeOverride(bundled);
  if (!bundledNorm) return { action: "skip", reason: "empty_slot" };
  const fp = findOverrideFile(home);
  const diskRaw = readPromptInjectFileSync(home);
  const diskNorm = normalizeOverride(diskRaw);
  if (isKeepableUserOverride(home, diskRaw)) {
    return { action: "keep", reason: "user_custom" };
  }
  if (diskNorm === bundledNorm) {
    return { action: "keep", reason: "current" };
  }
  try {
    // H19:原子写 prompt-inject.md,半写坏的 inject 会让组装直接拿到残片。
    atomicWriteSync(fp, bundled, "utf8");
    writeOverrideStateSync(home, {
      customized: false,
      hash: hashOverride(bundled),
      seedHash: defaultOverrideHash(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return { action: "error", reason: String(error && error.message ? error.message : error) };
  }
  return { action: "wrote", reason: diskNorm ? "refresh_default" : "seed_default" };
}

/**
 * 启动时把加密槽喂到磁盘。syncPromptInjectOnDiskSync 的包装,
 * 返回更细的 action 名字(seed_default / refresh_default / kept_user_custom / current / empty_slot / error)。
 */
export function seedPromptInjectAtBoot(dshHome) {
  const home = path.normalize(String(dshHome || findDshHome() || ""));
  const fp = home ? findOverrideFile(home) : "";
  const result = syncPromptInjectOnDiskSync(home);
  const base = { path: fp, reason: result.reason || "" };
  switch (result.action) {
    case "wrote":
      return { ...base, action: result.reason === "refresh_default" ? "refresh_default" : "seed_default" };
    case "keep":
      if (result.reason === "current") return { ...base, action: "current" };
      return { ...base, action: "kept_user_custom" };
    case "skip":
      if (result.reason === "empty_slot") return { ...base, action: "empty_slot" };
      return { ...base, action: "error" };
    case "error":
      return { ...base, action: "error" };
    default:
      return { ...base, action: result.action || "error" };
  }
}

/**
 * 把加密槽写入 $DSH_HOME/prompt-inject.md(用户自改时不覆盖)。
 * force 仅用于显式「恢复默认」。
 */
export async function installOverride(dshHome, force = false) {
  const fp = findOverrideFile(dshHome);
  await fsp.mkdir(dshHome, { recursive: true });
  const bundled = defaultOverrideText();
  if (!normalizeOverride(bundled)) return fs.existsSync(fp) ? "empty" : "missing";
  let disk = "";
  if (fs.existsSync(fp)) {
    try {
      disk = await fsp.readFile(fp, "utf8");
    } catch {
      disk = "";
    }
  }
  // 用户正文（与内置不同、且不是我们上次写下去的那一份）一律保留，除非显式 force。
  const state = await readOverrideState(dshHome);
  if (
    !force
    && normalizeOverride(disk)
    && hashOverride(disk) !== defaultOverrideHash()
    && !overrideTextIsOurs(state, disk)
    && !looksLikePluginDefault(disk)
  ) {
    await markOverrideCustomized(dshHome, true, disk);
    return "exists";
  }
  if (!force && await isUserCustomizedOverride(dshHome)) return "exists";
  // 磁盘已是同一份默认则只刷新标记，避免无意义重写。
  if (!force && normalizeOverride(disk) && normalizeOverride(disk) === normalizeOverride(bundled)) {
    await markOverrideCustomized(dshHome, false, bundled);
    return "exists";
  }
  await fsp.writeFile(fp, bundled, "utf8");
  await markOverrideCustomized(dshHome, false, bundled);
  return "wrote";
}

/**
 * 点应用：框里仍是插件默认血统或空 → 刷当前加密槽，不必再点保存。
 * 只有用户另写的稿才按框落盘。
 */
export async function commitOverrideOnApply(dshHome, incoming) {
  const home = path.normalize(String(dshHome || findDshHome() || ""));
  if (!home) return { action: "skip", reason: "no_home" };
  if (isKeepableUserOverride(home, incoming)) {
    const saved = await saveOverrideContent(home, incoming);
    return { ...saved, action: "saved_user" };
  }
  const seed = seedPromptInjectAtBoot(home);
  try {
    rememberCommittedOverride(home, readPromptInjectFileSync(home) || defaultOverrideText());
  } catch { /* hang 仍会在 refresh 时再钉 */ }
  return seed;
}

export async function saveOverrideContent(dshHome, content) {
  const bundled = defaultOverrideText();
  const incoming = typeof content === "string" ? content : "";
  const customized = Boolean(normalizeOverride(incoming))
    && normalizeOverride(incoming) !== normalizeOverride(bundled);
  const home = path.normalize(dshHome);
  const fp = findOverrideFile(home);
  await fsp.mkdir(home, { recursive: true });
  const handle = await fs.promises.open(fp, "w");
  try {
    await handle.writeFile(incoming, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  rememberCommittedOverride(home, incoming);
  if (!String(process.env.DSH_HOME || "").trim()) process.env.DSH_HOME = home;
  await markOverrideCustomized(home, customized, incoming);
  return { path: fp, customized, content: incoming, defaultContent: bundled };
}
