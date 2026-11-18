// 宿主代际探测：决定薄入口分派到 next（纯插件）还是 legacy（磁盘补丁）路线。
// 判据链：
//   1. DSH_PURGE_ROUTE=next|legacy 强制覆盖（调试/逃生门）
//   2. 从本包位置解析宿主安装里的 @deepseek-ai/dsh-app-boot（或 dsh）package.json 版本
//      —— profile 安装时本包位于 profiles/<x>/node_modules/dsh-purge，向上走即命中宿主依赖树
//   3. 解析不到 → 兜底 next（NEXT 优先；0.1.x 老宿主必然装有可解析的 dsh 包，不会落到这里）
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adapterFor, detectSurface } from "../surface.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** 语义化版本 triple 比较：a>b → 1，a<b → -1，相等 → 0（prerelease 后缀忽略）。 */
function compareVersion(a, b) {
  const pa = String(a || "").replace(/-.*$/, "").split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = String(b || "").replace(/-.*$/, "").split(".").map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i += 1) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

/** 找宿主 core 版本号；找不到返回空串。 */
export function hostCoreVersion() {
  const names = ["@deepseek-ai/dsh-app-boot", "@deepseek-ai/dsh"];
  // 1) ESM 解析（会走宿主 profile 的解析链）
  for (const name of names) {
    try {
      const req = createRequire(import.meta.url);
      const pkgPath = req.resolve(`${name}/package.json`);
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      if (pkg?.version) return pkg.version;
    } catch { /* 继续 */ }
  }
  // 2) 从本包位置逐级向上找 node_modules（便携/非常规布局兜底）
  let dir = HERE;
  for (let i = 0; i < 12 && dir; i += 1) {
    for (const name of names) {
      const pkgPath = path.join(dir, "node_modules", name, "package.json");
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        if (pkg?.version) return pkg.version;
      } catch { /* 上一层 */ }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // 3) junction/拷贝安装形态：真实路径逃出了 profile 树，按 DSH_PROFILE_DIR /
  //    $DSH_HOME/profiles/*/node_modules 再探一轮（每 profile 的 @deepseek-ai 同版本）。
  const profileDirs = [];
  if (process.env.DSH_PROFILE_DIR) profileDirs.push(process.env.DSH_PROFILE_DIR);
  try {
    const os = { homedir: null };
    // 内联取 homedir，避免顶层多一个常量 import
    os.homedir = process.env.USERPROFILE || process.env.HOME || "";
    if (os.homedir) {
      const dshHome = process.env.DSH_HOME || path.join(os.homedir, ".dsh");
      const profilesRoot = path.join(dshHome, "profiles");
      for (const entry of fs.readdirSync(profilesRoot, { withFileTypes: true })) {
        if (entry.isDirectory()) profileDirs.push(path.join(profilesRoot, entry.name));
      }
    }
  } catch { /* 无 profiles 目录 */ }
  for (const profileDir of profileDirs) {
    for (const name of names) {
      const pkgPath = path.join(profileDir, "node_modules", name, "package.json");
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        if (pkg?.version) return pkg.version;
      } catch { /* 下一个 */ }
    }
  }
  // 3b) NEXT 桌面：官方包整体在安装目录的 vendored runtime 里（profile 不带 @deepseek-ai）。
  //     权威标记 = <安装>/resources/runtime/*/primary-runtime/runtime.json 的 desktopVersion。
  //     宿主进程内 process.execPath 即 NEXT exe；2.x 桌面版本恒为 NEXT 代。
  try {
    const installDir = path.dirname(process.execPath || "");
    const resources = path.join(installDir, "resources", "runtime");
    for (const arch of fs.readdirSync(resources, { withFileTypes: true })) {
      if (!arch.isDirectory()) continue;
      const manifest = path.join(resources, arch.name, "primary-runtime", "runtime.json");
      try {
        const raw = JSON.parse(fs.readFileSync(manifest, "utf8"));
        if (raw?.desktopVersion) return String(raw.desktopVersion);
      } catch { /* 下一个 arch */ }
    }
  } catch { /* 非 NEXT 桌面布局 */ }
  // 3c) 桌面形态但没有 NEXT runtime.json → 老官方桌面（@deepseek-ai 在其安装目录里，
  //     前面各级都探不到）。老桌面线恒为 ≤0.2.1，直接按 legacy 计。
  try {
    if (adapterFor(detectSurface({})) === "desktop") return "0.2.1";
  } catch { /* surface 探测失败走兜底 */ }
  return "";
}

/**
 * 探测宿主代际。
 * @returns {'next'|'legacy'} next = core >= 0.2.2（NEXT 纯插件路线）；legacy = 磁盘补丁路线
 */
export function detectHostGeneration() {
  const forced = String(process.env.DSH_PURGE_ROUTE || "").trim().toLowerCase();
  if (forced === "next" || forced === "legacy") return forced;
  const version = hostCoreVersion();
  if (!version) return "next";
  return compareVersion(version, "0.2.2") >= 0 ? "next" : "legacy";
}
