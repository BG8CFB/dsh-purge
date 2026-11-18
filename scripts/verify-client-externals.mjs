/**
 * 校验 dist/client.js 的外部依赖与工厂包裹格式（照 dsh-tokens-anywhere 的守门脚本）。
 *
 *   1. 运行时 require 只允许 react 家族（宿主 ModuleLoader seed 表供应）；
 *   2. 文件首部是 `window.__ModuleLoader__.load({ id: "dsh-purge", factory: (require) => {` banner；
 *   3. 文件尾部是 `return module.exports; } });` footer；
 *   4. 工厂体内有 `var module = { exports: {} }; var exports = module.exports;` intro。
 *
 * rolldown 会对 banner/footer 重排版（换行与缩进），故格式检查按空白不敏感匹配。
 * 任一不满足即非零退出，挡住把未声明依赖打进产物的事故。
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const bundlePath = resolve(packageRoot, 'dist', 'client.js')

/** 允许的运行时 require：宿主 seed 表内的 react 家族。 */
const ALLOWED_EXTERNALS = new Set([
  'react',
  'react/jsx-runtime',
  'react-dom',
])

/** banner：ModuleLoader 工厂外壳开头（空白不敏感）。 */
const BANNER_RE = /^window\s*\.\s*__ModuleLoader__\s*\.\s*load\s*\(\s*\{\s*id:\s*"dsh-purge"\s*,\s*factory:\s*\(require\)\s*=>\s*\{/
/** intro：工厂体内的 module/exports 垫片（空白不敏感）。 */
const INTRO_RE = /var\s+module\s*=\s*\{\s*exports:\s*\{\}\s*\}\s*;\s*var\s+exports\s*=\s*module\.exports\s*;/
/** footer：工厂返回与外壳收口（空白不敏感，允许结尾空白）。 */
const FOOTER_RE = /return\s+module\.exports\s*;\s*\}\s*\}\s*\)\s*;\s*$/

let bundle
try {
  bundle = readFileSync(bundlePath, 'utf8')
} catch (error) {
  console.error(`dsh-purge: dist/client.js 不可读（先运行构建）：${error?.message ?? error}`)
  process.exit(1)
}

const failures = []

// 1. 运行时 require 清单
const requires = [...new Set([...bundle.matchAll(/\brequire\((['"])([^'"]+)\1\)/gu)].map((match) => match[2]))]
const unexpected = requires.filter((spec) => !ALLOWED_EXTERNALS.has(spec))
if (unexpected.length > 0) {
  failures.push(`存在未声明的运行时依赖：${unexpected.join(', ')}`)
}

// 2-4. 工厂包裹格式（去 BOM 后按空白不敏感匹配）
const body = bundle.replace(/^﻿/, '')
if (!BANNER_RE.test(body)) {
  failures.push('文件首部不是 ModuleLoader banner')
}
if (!INTRO_RE.test(body)) {
  failures.push('缺少 module/exports intro')
}
if (!FOOTER_RE.test(body)) {
  failures.push('文件尾部不是 ModuleLoader footer')
}

if (failures.length > 0) {
  console.error(`dsh-purge: client 产物校验失败：\n  - ${failures.join('\n  - ')}`)
  process.exit(1)
}

console.log(`dsh-purge: client externals 校验通过（require：${requires.length === 0 ? '无' : requires.join(', ')}；banner/footer/intro 均在位）。`)
