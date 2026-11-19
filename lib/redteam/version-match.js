/**
 * 版本匹配引擎（漏洞库用）。
 *
 * 目标：把「探测到的 product + version」映射到「已知漏洞」。
 * 不引第三方 semver：厂商版本号格式很杂（5.2.0.1 / 8.5.0-rc1 / 1.2.3.RELEASE），
 * 这里只做三件事：
 *   1. 把版本号拆成数字段 + 后缀（alpha/beta/rc/snapshot）；
 *   2. 支持比较（数字段逐位比，缺位补 0；预发布版 < 正式版）；
 *   3. 支持范围表达式：<、<=、>、>=、=、*，多条件用逗号（AND）。
 */

/** 解析版本为 { nums, pre }。 */
export function parseVersion(raw) {
  const text = String(raw === undefined || raw === null ? '' : raw).trim().toLowerCase()
  if (text === '') return null
  const cleaned = text.replace(/^v/, '').replace(/[_+]/g, '.')
  const m = /^(\d+(?:\.\d+)*)(?:[-.]([a-z]+)(\d*))?/.exec(cleaned)
  if (!m) return null
  const nums = m[1].split('.').map((x) => Number(x) || 0)
  const pre = m[2] || ''
  const preNum = m[3] ? Number(m[3]) : 0
  return { nums, pre, preNum }
}

/** 预发布权重：越靠前越"早"。 */
const PRE_RANK = { dev: 0, alpha: 1, beta: 2, rc: 3, snapshot: 0, milestone: 1, pre: 1 }

/** 比较两个版本：-1 / 0 / 1。解析失败时按字符串比较兜底。 */
export function compareVersion(a, b) {
  const pa = parseVersion(a)
  const pb = parseVersion(b)
  if (pa === null || pb === null) {
    const sa = String(a || '')
    const sb = String(b || '')
    return sa === sb ? 0 : (sa > sb ? 1 : -1)
  }
  const len = Math.max(pa.nums.length, pb.nums.length)
  for (let i = 0; i < len; i += 1) {
    const x = pa.nums[i] || 0
    const y = pb.nums[i] || 0
    if (x !== y) return x > y ? 1 : -1
  }
  /* 数字段相同：预发布版 < 正式版 */
  if (pa.pre === '' && pb.pre !== '') return 1
  if (pa.pre !== '' && pb.pre === '') return -1
  if (pa.pre !== pb.pre) {
    const ra = PRE_RANK[pa.pre] === undefined ? 5 : PRE_RANK[pa.pre]
    const rb = PRE_RANK[pb.pre] === undefined ? 5 : PRE_RANK[pb.pre]
    if (ra !== rb) return ra > rb ? 1 : -1
    return pa.pre > pb.pre ? 1 : -1
  }
  if (pa.preNum !== pb.preNum) return pa.preNum > pb.preNum ? 1 : -1
  return 0
}

/**
 * 判断版本是否满足范围。
 * 范围语法：`<6.0.3`、`>=1.0,<1.3`、`1.2.3`（精确）、`*`（任意）、`8.5.x`（前缀）。
 * @param version - 实际版本。
 * @param range - 范围表达式；空串表示不限。
 */
export function satisfiesRange(version, range) {
  const expr = String(range === undefined || range === null ? '' : range).trim()
  if (expr === '' || expr === '*') return true
  const actual = String(version || '').trim()
  if (actual === '') return false
  if (expr.includes(',')) {
    return expr.split(',').every((part) => satisfiesRange(actual, part))
  }
  const m = /^(<=|>=|<|>|=)?\s*(.+)$/.exec(expr)
  const op = m[1] || '='
  const target = m[2].trim()
  if (target.includes('x') || target.includes('X') || target.includes('*')) {
    const prefix = target.replace(/[xX*]/g, '').replace(/\.$/, '')
    return actual.toLowerCase().startsWith(prefix.toLowerCase())
  }
  if (op === '=') {
    /* 精确匹配允许前缀：8.5 命中 8.5.0 */
    if (compareVersion(actual, target) === 0) return true
    const a = parseVersion(actual)
    const t = parseVersion(target)
    if (a === null || t === null) return false
    for (let i = 0; i < t.nums.length; i += 1) {
      if ((a.nums[i] || 0) !== (t.nums[i] || 0)) return false
    }
    return true
  }
  const cmp = compareVersion(actual, target)
  if (op === '<') return cmp < 0
  if (op === '<=') return cmp <= 0
  if (op === '>') return cmp > 0
  if (op === '>=') return cmp >= 0
  return false
}

/**
 * 在一条漏洞记录上判断是否命中。
 * @param version - 实际版本。
 * @param record - `{ versions, version_max, version_min }`；versions 可为范围或逗号列表。
 */
export function matchesVersion(version, record) {
  const ranges = String(record && record.versions ? record.versions : '').trim()
  const min = record && record.version_min ? String(record.version_min).trim() : ''
  const max = record && record.version_max ? String(record.version_max).trim() : ''
  if (min !== '' && compareVersion(version, min) < 0) return false
  if (max !== '' && compareVersion(version, max) > 0) return false
  if (ranges === '') return min !== '' || max !== ''
  const parts = ranges.split('|').map((x) => x.trim()).filter(Boolean)
  return parts.some((part) => satisfiesRange(version, part))
}
