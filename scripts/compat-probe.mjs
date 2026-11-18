#!/usr/bin/env node
/**
 * Version compatibility probe.
 *
 * Every config-row override the plugin relies on must exist in the host it targets. Rather than
 * trusting a changelog, this script pulls the published @deepseek-ai/dsh-base tarball for each
 * version, reads its cordis.patch.yml, and reports which override targets are present.
 *
 * Downloads land in .baseline/compat (gitignored). Network required; results are cached per version.
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const work = join(root, '.baseline', 'compat')
const PKG = '@deepseek-ai/dsh-base'

/** Row ids this plugin overrides or disables. Keep in sync with cordis.patch.yml. */
export const TARGETS = [
  'sandbox',
  'sandbox-policy',
  'approval',
  'permission',
  'fs-sandbox',
  'fs-observation-policy',
  'system-prompt',
  'agent-instructions',
  'tool-fs',
  'tool-bash',
  'tool-pwsh',
  'tool-result-pruner',
  'repeat-tool-reminder',
  'tool-web',
  'subagent',
  'plan-mode',
  'agent-loop',
  'session-log-deepseek',
]

const DEFAULT_VERSIONS = ['0.1.7-rc.2', '0.2.0-rc.1', '0.2.1-rc.3', '0.2.2-rc.1']

async function ensureTarball(version) {
  await mkdir(work, { recursive: true })
  const tarPath = join(work, 'dsh-base-' + version + '.tgz')
  if (!existsSync(tarPath)) {
    execFileSync('npm', ['pack', PKG + '@' + version, '--silent'], { cwd: work, stdio: 'pipe' })
    const packed = (await readdir(work)).find((name) => name.endsWith(version + '.tgz'))
    if (!packed) throw new Error('npm pack produced no tarball for ' + version)
    const { rename } = await import('node:fs/promises')
    await rename(join(work, packed), tarPath)
  }
  return tarPath
}

async function rowIds(version) {
  const tarPath = await ensureTarball(version)
  const dir = join(work, 'v' + version)
  await mkdir(dir, { recursive: true })
  execFileSync('tar', ['-xzf', tarPath, '-C', dir, '--strip-components=1'], { stdio: 'pipe' })
  const text = await readFile(join(dir, 'cordis.patch.yml'), 'utf8')
  const ids = new Set()
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*-\s*id:\s*(\S+)/.exec(line)
    if (match) ids.add(match[1])
  }
  return ids
}

const versions = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_VERSIONS
const table = []
for (const version of versions) {
  const ids = await rowIds(version)
  table.push({ version, total: ids.size, ids })
}

const header = ['target', ...table.map((row) => row.version)]
const lines = [header.join('\t')]
for (const target of TARGETS) {
  lines.push([target, ...table.map((row) => (row.ids.has(target) ? 'yes' : 'NO'))].join('\t'))
}
lines.push(['total rows', ...table.map((row) => String(row.total))].join('\t'))

console.log(lines.join('\n'))

const missing = []
for (const row of table) for (const target of TARGETS) if (!row.ids.has(target)) missing.push(row.version + ':' + target)
console.log('')
console.log(missing.length === 0 ? 'all targets present in every probed version' : 'missing: ' + missing.join(', '))
