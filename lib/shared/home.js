// $DSH_HOME 解析（共享层简化版）。
// 与 lib/legacy/core.js:1661 的完整版同序，但省去 npm-prefix / shim / WSL 全盘探测——
// 那些只为定位 v1 安装服务，属 legacy 路线；NEXT 宿主按官方 data-directory 语义：
// DSH_HOME 环境变量优先，缺省 ~/.dsh。桌面老安装旁的 dsh-home 候选保留（win32）。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { adapterFor, detectSurface } from "../surface.js";

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function isDshHomeDir(cand) {
  try { return fs.existsSync(path.join(cand, "profiles")); } catch { return false; }
}

function homeHasHarnessData(cand) {
  try { return fs.existsSync(path.join(cand, "redteam")) || fs.existsSync(path.join(cand, "prompt-inject.md")); } catch { return false; }
}

function desktopHomeCandidates() {
  const home = os.homedir();
  if (process.platform === "win32") {
    const appdata = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    const localapp = process.env.LOCALAPPDATA || path.join(home, "AppData", "Local");
    return [
      path.join(appdata, "DeepSeek Harness", "dsh-home"),
      path.join(localapp, "DeepSeek Harness", "dsh-home"),
    ];
  }
  return [];
}

// DSH_HOME env → 桌面 dsh-home 候选 → ~/.dsh
export function findDshHome(options = {}) {
  const env = options.env ?? process.env;
  const fromEnv = env.DSH_HOME;
  if (fromEnv && String(fromEnv).trim()) return path.normalize(fromEnv.trim());
  const desktopHost = adapterFor(detectSurface(options)) === "desktop";
  if (desktopHost) {
    const found = [];
    for (const cand of desktopHomeCandidates()) {
      if (isDshHomeDir(cand)) found.push(path.normalize(cand));
    }
    const unix = path.normalize(path.join(os.homedir(), ".dsh"));
    const usable = found.find((cand) => homeHasHarnessData(cand));
    if (usable) return usable;
    if (isDir(unix) && homeHasHarnessData(unix)) return unix;
    if (found.length) return found[0];
  }
  return path.join(os.homedir(), ".dsh");
}

/** 把本次解析到的主目录钉进环境变量；已有且不同的 DSH_HOME 不改。 */
export function pinDshHome() {
  const home = path.normalize(findDshHome() || "");
  if (!home) return "";
  const current = String(process.env.DSH_HOME || "").trim();
  if (!current) process.env.DSH_HOME = home;
  return path.normalize(findDshHome() || home);
}
