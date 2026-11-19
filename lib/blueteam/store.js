/**
 * 蓝队事实库 —— Cordis Host 插件壳
 *
 * 把 BlueteamStore 发布为进程级服务 ctx.blueteam，供
 *   · 客户端（经 /blueteam/api）
 *   · 蓝队预设里的工具行（blueteam_*）
 * 共同使用。数据根独立：默认 $DSH_HOME/blueteam，与 $DSH_HOME/redteam 互不相干。
 */
import { join } from 'node:path'
import { homedir } from 'node:os'
import { readFileSync } from 'node:fs'
import { BlueteamStore } from './store-blue.js'

export const name = 'blueteam-store'
export const inject = []

function resolveRoot(config) {
  if (config && typeof config.root === 'string' && config.root.length > 0) return config.root
  if (process.env.BLUETEAM_HOME) return process.env.BLUETEAM_HOME
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'blueteam')
}

function readSelfPackage() {
  for (const rel of ['../package.json', '../../package.json']) {
    try {
      const pkg = JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'))
      if (pkg && typeof pkg.name === 'string' && typeof pkg.version === 'string') {
        return { name: pkg.name, version: pkg.version, description: pkg.description || '' }
      }
    } catch { /* 换下一个候选 */ }
  }
  return null
}

export function apply(ctx, config = {}) {
  const store = new BlueteamStore(resolveRoot(config))
  const self = readSelfPackage()
  if (self !== null) {
    try { store.plugin = Object.freeze(self) } catch { /* 忽略 */ }
  }
  ctx.effect(() => () => store.close())
  ctx.provide('blueteam', store)
}

export { BlueteamStore }
