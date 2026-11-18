#!/usr/bin/env node
/**
 * Phase 0: freeze a byte-exact baseline of everything the plugin must never change.
 *
 * The whole migration rests on one falsifiable claim: the plugin produces no writes inside the
 * DSH installation. That claim is only checkable against a recorded baseline, so this script
 * snapshots the installation and the harness home into .baseline/ (gitignored).
 */
import { createHash } from 'node:crypto'
import { readdir, stat, writeFile, mkdir } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { homedir } from 'node:os'
import { join, relative, sep } from 'node:path'

const ROOT = 'C:/Program Files/DSH NEXT'
const RESOURCES = join(ROOT, 'resources')
const OUT_DIR = new URL('../.baseline/', import.meta.url)
/** Files above this size are still hashed, just far more slowly; recorded for visibility. */
const BIG_FILE = 64 * 1024 * 1024

async function sha256(path) {
  // Stream: app.asar is far larger than any sane in-memory buffer.
  const hash = createHash('sha256')
  await pipeline(createReadStream(path), hash)
  return hash.digest('hex')
}

async function walk(dir, base = dir, acc = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) await walk(full, base, acc)
    else if (entry.isFile()) {
      const info = await stat(full)
      acc.push({ path: relative(base, full).split(sep).join('/'), size: info.size })
    }
  }
  return acc
}

async function snapshot(label, targets) {
  const files = []
  for (const target of targets) {
    const info = await stat(target).catch(() => undefined)
    if (!info) {
      files.push({ path: target, missing: true })
      continue
    }
    if (info.isDirectory()) {
      for (const entry of await walk(target)) {
        const full = join(target, entry.path.split('/').join(sep))
        files.push({
          area: relative(target, full).startsWith('..') ? 'dir' : 'dir',
          path: target + '/' + entry.path,
          size: entry.size,
          sha256: await sha256(full).catch(() => null),
          big: entry.size > BIG_FILE,
        })
      }
    } else {
      files.push({ path: target, size: info.size, sha256: await sha256(target).catch(() => null), big: info.size > BIG_FILE })
    }
  }
  return { label, capturedAt: new Date().toISOString(), files }
}

await mkdir(OUT_DIR, { recursive: true })

const install = await snapshot('install', [join(RESOURCES, 'app.asar'), join(RESOURCES, 'app.asar.unpacked'), join(RESOURCES, 'app')])
await writeFile(new URL('./install-baseline.json', OUT_DIR), JSON.stringify(install, null, 2), 'utf8')

const home = process.env.DSH_HOME || join(homedir(), '.dsh')
const homeTargets = [
  join(home, 'prompt-inject.md'),
  join(home, 'cordis.patch.yml'),
  join(home, 'profiles'),
]
const homeSnapshot = await snapshot('dsh-home', homeTargets)
await writeFile(new URL('./dsh-home-baseline.json', OUT_DIR), JSON.stringify(homeSnapshot, null, 2), 'utf8')

const shimCandidates = ['dsh.cmd', 'dsh.ps1', 'dsh']
const shims = []
for (const name of shimCandidates) {
  const found = await stat(join(home, name)).then(() => true).catch(() => false)
  if (found) shims.push(join(home, name))
}

console.log('install files hashed: ' + install.files.length)
console.log('  app.asar: ' + (install.files.find((f) => f.path.endsWith('app.asar')) ?? {}).sha256)
console.log('dsh-home files listed: ' + homeSnapshot.files.length + ' (' + home + ')')
console.log('shims present: ' + (shims.length ? shims.join(', ') : 'none'))
