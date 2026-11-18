#!/usr/bin/env node
/**
 * Compare two extracted application trees and report every difference.
 * Reads only; writes one JSON report under .baseline/.
 */
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { pipeline } from 'node:stream/promises'

const [dirA, dirB, outName = 'install-diff.json'] = process.argv.slice(2)
if (!dirA || !dirB) {
  console.error('usage: compare-install.mjs <dirA> <dirB> [out.json]')
  process.exit(1)
}

async function hashFile(path) {
  const hash = createHash('sha256')
  await pipeline(createReadStream(path), hash)
  return hash.digest('hex')
}

async function index(dir) {
  const map = new Map()
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) await walk(full)
      else if (entry.isFile()) {
        const info = await stat(full)
        map.set(relative(dir, full).split('\\').join('/'), { size: info.size, full })
      }
    }
  }
  await walk(dir)
  return map
}

const a = await index(dirA)
const b = await index(dirB)

const onlyInA = []
const onlyInB = []
const changed = []
let identical = 0

for (const [key, entry] of a) {
  const other = b.get(key)
  if (!other) {
    onlyInA.push(key)
    continue
  }
  if (other.size !== entry.size) {
    changed.push({ path: key, from: entry.size, to: other.size, reason: 'size' })
    continue
  }
  const ha = await hashFile(entry.full)
  const hb = await hashFile(other.full)
  if (ha === hb) identical++
  else changed.push({ path: key, from: entry.size, to: other.size, reason: 'content', ha, hb })
}

for (const key of b.keys()) if (!a.has(key)) onlyInB.push(key)

const report = {
  dirA,
  dirB,
  counts: { filesA: a.size, filesB: b.size, identical, changed: changed.length, onlyInA: onlyInA.length, onlyInB: onlyInB.length },
  onlyInA,
  onlyInB,
  changed,
}
await writeFile(join('.baseline', outName), JSON.stringify(report, null, 2), 'utf8')
console.log(JSON.stringify(report.counts, null, 1))
for (const row of changed.slice(0, 30)) console.log('  ' + row.reason + '  ' + row.path + '  ' + row.from + ' -> ' + row.to)
if (onlyInB.length) {
  console.log('only in B (first 20):')
  for (const row of onlyInB.slice(0, 20)) console.log('  + ' + row)
}
