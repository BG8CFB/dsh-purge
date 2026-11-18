// 原子写三件套（自 lib/legacy/core.js:51-88 平移，node:fs 直连——共享层不做 asar 探测）。
// H19:原子写。write-to-tmp + rename。EBUSY/ENOSPC 都不会半写坏原文件。
import fs from "node:fs";
import path from "node:path";

const fsp = fs.promises;

export function atomicWriteSync(fp, content, encoding = "utf8") {
  const dir = path.dirname(fp);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${fp}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, content, encoding);
  try {
    fs.renameSync(tmp, fp);
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch { /* ignore */ }
    throw e;
  }
}

export async function atomicWriteFile(fp, content, encoding = "utf8") {
  const dir = path.dirname(fp);
  await fsp.mkdir(dir, { recursive: true });
  const tmp = `${fp}.${process.pid}.${Date.now()}.tmp`;
  await fsp.writeFile(tmp, content, encoding);
  try {
    await fsp.rename(tmp, fp);
  } catch (e) {
    try { await fsp.unlink(tmp); } catch { /* ignore */ }
    throw e;
  }
}

export async function atomicCopyFile(src, dst) {
  const dir = path.dirname(dst);
  await fsp.mkdir(dir, { recursive: true });
  const tmp = `${dst}.${process.pid}.${Date.now()}.copytmp`;
  await fsp.copyFile(src, tmp);
  try {
    await fsp.rename(tmp, dst);
  } catch (e) {
    try { await fsp.unlink(tmp); } catch { /* ignore */ }
    throw e;
  }
}
