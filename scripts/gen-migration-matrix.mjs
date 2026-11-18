#!/usr/bin/env node
/**
 * Phase 0/1: render the migration matrix and the equivalence table from two inputs:
 *   - lib/core.js        the legacy patch table (imported, not regex-parsed)
 *   - docs/patch-decisions.json   the per-patch verdict written in Phase 1
 *
 * Read-only with respect to runtime code: it only writes docs/.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as core from '../lib/core.js'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const MATRIX = join(root, 'docs', 'patch-migration-matrix.md')
const EQUIV = join(root, 'docs', 'purge-equivalence.md')
const DECISIONS = join(root, 'docs', 'patch-decisions.json')

const BUCKETS = {
  A: '提示词/身份/preset/工具描述',
  B: '审批/沙箱/fs/策略',
  C: '循环/会话/LLM 内部',
  D: '桌面壳/客户端 UI',
  E: '体积/限额',
}
const VERDICTS = {
  runtime: '运行时扩展点（section/瀑布）',
  config: '配置行覆盖',
  rewritten: '改写实现（非源码替换）',
  dropped: '取消（非破甲项）',
}
/** Verdicts that keep a behaviour: everything except dropped. */
const KEPT = new Set(['runtime', 'config', 'rewritten'])

const esc = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim()

function targetPackages(patch) {
  return Array.isArray(patch.file) ? patch.file.join(', ') : String(patch.file ?? '')
}

/** Both legacy shapes: replacements[] and patterns[]+replace. */
function pairs(patch) {
  if (Array.isArray(patch.replacements)) {
    return patch.replacements.map((r) => ({ from: String(r.pattern ?? ''), to: String(r.replace ?? '') }))
  }
  if (Array.isArray(patch.patterns)) {
    return patch.patterns.map((p) => ({ from: String(p), to: String(patch.replace ?? '') }))
  }
  return []
}

const decisions = new Map(JSON.parse(await readFile(DECISIONS, 'utf8')).map((d) => [d.id, d]))

const rows = core.ALL_PATCHES.map((patch) => {
  const decision = decisions.get(patch.id) ?? { id: patch.id, b: '?', v: 'review', m: '待定', t: '' }
  return { patch, decision, pairs: pairs(patch) }
}).sort((a, b) => a.patch.id - b.patch.id)

const byBucket = new Map()
const byVerdict = new Map()
for (const row of rows) {
  byBucket.set(row.decision.b, (byBucket.get(row.decision.b) ?? 0) + 1)
  byVerdict.set(row.decision.v, (byVerdict.get(row.decision.v) ?? 0) + 1)
}
const keptCount = rows.filter((row) => KEPT.has(row.decision.v)).length
const droppedCount = rows.length - keptCount

const md = []
md.push('# 旧版补丁到新机制的迁移矩阵')
md.push('')
md.push('生成脚本：scripts/gen-migration-matrix.mjs。数据源：lib/core.js 的 ALL_PATCHES 加 docs/patch-decisions.json。')
md.push('')
md.push('## 结论概览')
md.push('')
md.push('| 指标 | 数值 |')
md.push('|---|---|')
md.push('| 旧补丁总数 | ' + rows.length + ' |')
md.push('| 保留（改写/配置/运行时） | ' + keptCount + ' |')
md.push('| 取消（非破甲） | ' + droppedCount + ' |')
md.push('| 需要写安装目录源码 | 0 |')
md.push('')
md.push('## 分桶')
md.push('')
md.push('| 桶 | 含义 | 条数 |')
md.push('|---|---|---|')
for (const key of ['A', 'B', 'C', 'D', 'E']) md.push('| ' + key + ' | ' + BUCKETS[key] + ' | ' + (byBucket.get(key) ?? 0) + ' |')
md.push('')
md.push('## 判定分布')
md.push('')
md.push('| 判定 | 含义 | 条数 |')
md.push('|---|---|---|')
for (const key of ['runtime', 'config', 'rewritten', 'dropped']) md.push('| ' + key + ' | ' + VERDICTS[key] + ' | ' + (byVerdict.get(key) ?? 0) + ' |')
md.push('')
md.push('## 逐条矩阵')
md.push('')
md.push('| id | 名称 | 目标包 | 桶 | 判定 | 新机制 | 验证 |')
md.push('|---|---|---|---|---|---|---|')
for (const { patch, decision } of rows) {
  md.push('| ' + [
    patch.id,
    esc(patch.name),
    esc(targetPackages(patch)),
    decision.b,
    decision.v,
    esc(decision.m),
    esc(decision.t),
  ].join(' | ') + ' |')
}
md.push('')
md.push('## 取消清单（非破甲项，逐条说明）')
md.push('')
for (const { patch, decision } of rows.filter((row) => row.decision.v === 'dropped')) {
  md.push('- ' + patch.id + ' ' + patch.name + '：' + esc(decision.m))
}
md.push('')

const equiv = []
equiv.push('# 破甲等价表（旧字符串替换 到 新运行期规则）')
equiv.push('')
equiv.push('Phase 1 产出。每一行给出旧补丁的锚点文本与新机制，供 Phase 2 编写 section / assemble 规则时直接取用。')
equiv.push('锚点文本来自 lib/core.js 的 pattern，仅用于识别目标语句，不再用于替换宿主源码。')
equiv.push('')
for (const { patch, decision, pairs: rowPairs } of rows.filter((row) => row.decision.v === 'rewritten' || row.decision.v === 'runtime')) {
  equiv.push('## ' + patch.id + ' ' + patch.name)
  equiv.push('')
  equiv.push('- 桶/判定：' + decision.b + ' / ' + decision.v)
  equiv.push('- 新机制：' + decision.m)
  equiv.push('- 验证：' + decision.t)
  const anchor = rowPairs.find((p) => p.from)
  if (anchor) {
    equiv.push('- 旧锚点：' + esc(anchor.from).slice(0, 300))
    if (anchor.to) equiv.push('- 旧替换：' + esc(anchor.to).slice(0, 200))
  }
  equiv.push('')
}

await writeFile(MATRIX, md.join('\n'), 'utf8')
await writeFile(EQUIV, equiv.join('\n'), 'utf8')
console.log('matrix rows: ' + rows.length + ' | kept: ' + keptCount + ' | dropped: ' + droppedCount)
console.log('buckets: ' + JSON.stringify(Object.fromEntries(byBucket)))
console.log('verdicts: ' + JSON.stringify(Object.fromEntries(byVerdict)))
console.log('wrote ' + MATRIX)
console.log('wrote ' + EQUIV)
