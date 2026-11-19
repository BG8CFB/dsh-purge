/**
 * 蓝队模式自举（host 半侧）
 *
 * 与红队预设平行的第二条线：
 *   1. 把 presets/blueteam 落到 $DSH_HOME/.agent-presets/blueteam/（模板里的技能占位符换成 dshHomePath）
 *   2. 随包技能落到 $DSH_HOME/blueteam/skills
 *   3. 注册到 agent-preset registry（否则模式下拉里看不到「蓝队模式」）
 *   4. 暴露 ctx.blueteamPreset.status()/reregister()，供面板做就绪检查
 *
 * 与红队 index.js 的关系：结构同构、**有意不共享**（红队那份还要处理 rc.3 历史预设自愈，
 * 蓝队是全新预设，没有历史包袱；强行合并会把两边的自愈路径搅在一起）。
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPresetDefinition } from '../redteam/preset-composition.js'

export const name = 'dsh-purge-blueteam'
export const inject = []

const PRESET_ID = 'blueteam'
const SKILLS_PLACEHOLDER = '{{BLUETEAM_SKILLS_DIR}}'
const BUNDLED_SKILLS_EXPR = "!!js dshHomePath('blueteam/skills')"

export function packagePaths() {
  const root = fileURLToPath(new URL('../..', import.meta.url))
  return {
    root,
    presetDir: join(root, 'presets', 'blueteam'),
    skills: join(root, 'skills', 'blueteam'),
  }
}

export function dataDir() {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'blueteam')
}

export function userPresetRoot() {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, '.agent-presets')
}

function skillTargets() {
  const out = []
  const push = (p) => { if (p && !out.includes(p)) out.push(p) }
  push(join(dataDir(), 'skills'))
  for (const home of [process.env.DSH_HOME, join(homedir(), '.dsh')]) {
    if (!home || !existsSync(home)) continue
    push(join(home, 'blueteam', 'skills'))
  }
  return out
}

/** 随包技能同步（内容不同即覆盖；同名以包内为准）。 */
export function installBundledSkills() {
  const paths = packagePaths()
  if (!existsSync(paths.skills)) return { copied: 0, path: skillTargets()[0] }
  const files = readdirSync(paths.skills).filter((f) => f.endsWith('.md'))
  let copied = 0
  for (const target of skillTargets()) {
    mkdirSync(target, { recursive: true })
    for (const file of files) {
      const wanted = readFileSync(join(paths.skills, file))
      const dest = join(target, file)
      let same = false
      try { same = readFileSync(dest).equals(wanted) } catch { same = false }
      if (same) continue
      writeFileSync(dest, wanted)
      copied += 1
    }
  }
  return { copied, path: skillTargets()[0], files: files.length }
}

/** 安装/自愈预设：占位符必须替换，否则整份预设挂不上。 */
export function installPreset(options = {}) {
  const paths = packagePaths()
  const skills = installBundledSkills()
  const target = join(userPresetRoot(), PRESET_ID)
  const file = join(target, 'agent.cordis.yml')
  const log = options.log ?? (() => {})
  if (!existsSync(paths.presetDir)) return { action: 'missing', dir: target, skills }
  if (existsSync(file) && options.force !== true) {
    let text = ''
    try { text = readFileSync(file, 'utf8') } catch { text = '' }
    if (text.includes(SKILLS_PLACEHOLDER)) {
      writeFileSync(file, text.split(SKILLS_PLACEHOLDER).join(BUNDLED_SKILLS_EXPR), 'utf8')
      log('蓝队预设里的技能占位符已替换为 ' + BUNDLED_SKILLS_EXPR)
      return { action: 'repaired', dir: target, skills }
    }
    // 锚点门脚本随包更新
    syncAnchor(target)
    return { action: 'kept', dir: target, skills }
  }
  mkdirSync(target, { recursive: true })
  for (const name of readdirSync(paths.presetDir)) {
    const src = join(paths.presetDir, name)
    let text = readFileSync(src, 'utf8')
    if (name.endsWith('.yml')) text = text.split(SKILLS_PLACEHOLDER).join(BUNDLED_SKILLS_EXPR)
    writeFileSync(join(target, name), text, 'utf8')
  }
  syncAnchor(target)
  log('蓝队预设已安装到 ' + target)
  return { action: 'installed', dir: target, skills }
}

function syncAnchor(targetDir) {
  const src = join(packagePaths().presetDir, 'anchor-gate.mjs')
  if (!existsSync(src)) return
  const dest = join(targetDir, 'anchor-gate.mjs')
  const wanted = readFileSync(src)
  let same = false
  try { same = readFileSync(dest).equals(wanted) } catch { same = false }
  if (!same) {
    writeFileSync(dest, wanted)
    try { chmodSync(dest, 0o644) } catch { /* 忽略 */ }
  }
}

export function apply(ctx) {
  const result = (() => {
    try {
      return installPreset({ force: process.env.BLUETEAM_PRESET_REFRESH === '1', log: (m) => ctx.logger?.info?.('blueteam-mode: ' + m) })
    } catch (error) {
      ctx.logger?.error?.('blueteam-mode: 预设安装失败 ' + (error && error.message ? error.message : String(error)))
      return { action: 'failed', dir: join(userPresetRoot(), PRESET_ID), skills: null }
    }
  })()

  const statusFile = join(dataDir(), 'preset-declare.json')
  const writeStatus = (patch) => {
    try {
      mkdirSync(dataDir(), { recursive: true })
      let prev = {}
      try { prev = JSON.parse(readFileSync(statusFile, 'utf8')) } catch { /* first */ }
      writeFileSync(statusFile, JSON.stringify({ ...prev, ...patch, at: new Date().toISOString() }, null, 2), 'utf8')
    } catch { /* 忽略 */ }
  }
  writeStatus({ ok: false, phase: 'apply-start', dir: result.dir })

  const softRegistry = () => {
    try {
      if (ctx.agentPresets && typeof ctx.agentPresets.register === 'function') return ctx.agentPresets
    } catch { /* 无 inject */ }
    try {
      const reg = ctx.get('agentPresets')
      if (reg && typeof reg.register === 'function') return reg
    } catch { /* 缺失 */ }
    return null
  }

  let releaseDeclared
  let closed = false
  const undeclare = async () => {
    const dispose = releaseDeclared
    releaseDeclared = undefined
    if (!dispose) return
    try { await dispose() } catch { /* 忽略 */ }
  }

  const registerOnce = (registry) => {
    let definition
    try {
      const dir = existsSync(join(userPresetRoot(), PRESET_ID, 'agent.cordis.yml'))
        ? join(userPresetRoot(), PRESET_ID)
        : packagePaths().presetDir
      definition = readPresetDefinition(PRESET_ID, dir)
    } catch (error) {
      writeStatus({ ok: false, phase: 'read-failed', error: error?.message || String(error) })
      return
    }
    writeStatus({ ok: false, phase: 'registering', id: definition.id, name: definition.name })
    Promise.resolve()
      .then(async () => {
        await undeclare()
        releaseDeclared = await registry.register(definition)
        let broken = null
        try {
          const row = (await registry.list()).find((p) => p.id === PRESET_ID)
          broken = row?.broken || null
        } catch { /* 忽略 */ }
        writeStatus({ ok: !broken, phase: broken ? 'registered-broken' : 'registered', id: definition.id, name: definition.name, broken })
        if (broken) ctx.logger?.warn?.('blueteam-mode: declared but broken: ' + broken)
        else ctx.logger?.info?.('blueteam-mode: 已声明到模式下拉：' + (definition.name || PRESET_ID))
      })
      .catch((error) => {
        writeStatus({ ok: false, phase: 'register-failed', error: error?.message || String(error) })
      })
  }

  try {
    ctx.provide('blueteamPreset', {
      status: () => {
        try { return JSON.parse(readFileSync(statusFile, 'utf8')) } catch { return { ok: false, phase: 'no-status' } }
      },
      reregister: () => {
        const registry = softRegistry()
        if (!registry) return { ok: false, error: 'agentPresets 服务不可用' }
        registerOnce(registry)
        return { ok: true, note: '已重新注册，约 1 秒后刷新状态' }
      },
    })
  } catch (error) {
    ctx.logger?.warn?.('blueteam-mode: 控制面注册失败 ' + (error && error.message ? error.message : String(error)))
  }

  ctx.effect(() => {
    let tries = 0
    const tick = () => {
      if (closed) return true
      tries += 1
      const registry = softRegistry()
      if (!registry) {
        writeStatus({ ok: false, phase: 'waiting-registry', tries })
        return false
      }
      registerOnce(registry)
      return true
    }
    let timer
    let stop
    if (!tick()) {
      timer = setInterval(() => {
        if (tick()) {
          clearInterval(timer)
          timer = undefined
          if (stop) clearTimeout(stop)
        }
      }, 400)
      if (typeof timer.unref === 'function') timer.unref()
      stop = setTimeout(() => {
        if (timer) {
          clearInterval(timer)
          timer = undefined
          writeStatus({ ok: false, phase: 'timeout-waiting-registry', tries })
        }
      }, 45000)
      try { stop.unref?.() } catch { /* 忽略 */ }
    }
    return () => {
      closed = true
      if (timer) clearInterval(timer)
      if (stop) clearTimeout(stop)
      void undeclare()
    }
  }, 'dsh-purge-blueteam: declare agent preset')

  ctx.provide('blueteamMode', Object.freeze({ preset: result }))
  ctx.logger?.info?.('blueteam-mode: 就绪（数据目录默认 $DSH_HOME/blueteam）')
}

export default { name, inject, apply }
