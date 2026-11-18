// dsh-purge 薄入口：按宿主代际分派到 next（纯插件路线，DSH NEXT / core >= 0.2.2）
// 或 legacy（磁盘补丁路线，老宿主 0.1.7-rc.2 ~ 0.2.1）。
// 单一 insert 行 name='dsh-purge' 指向本文件；两条子路线各有自己的完整 apply。
import { detectHostGeneration } from "./shared/host-version.js";

export const name = "dsh-purge";

// 两代路线的服务交集；webServer/commands/slots 等由各子路线按需软取（ctx.get），
// 不写进 inject（Cordis 对 inject 里每个 key 空等，宿主缺服务会挂起）。
export const inject = ["systemPrompt", "tools"];

export async function apply(ctx, config) {
  const generation = detectHostGeneration();
  const mod = generation === "next"
    ? await import("./next/index.js")
    : await import("./legacy/index.js");
  return mod.apply(ctx, config);
}

const plugin = { name, inject, apply };

export default plugin;
