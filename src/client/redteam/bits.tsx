/**
 * 红队演练台共用底座：类型、枚举标签、小组件（徽章 / 折叠 / 长文本 / HTTP 证据块 /
 * 截图条）、剪贴板助手。自旧 client.js 对应片段迁移；只依赖 react 与本目录 api.ts。
 */
import { useEffect, useState } from 'react'
import { h, type NoticeSource } from '../shared/ui.ts'
import { rtOp } from './api.ts'

/** 宿主 locale 绑定函数：唯一定义在 locale.ts，这里转出以保持既有 import 路径可用。 */
export type { Translate } from '../locale.ts'

/** 子页签公共 props（RedteamTab 分发）。 */
export interface RtTabProps {
  t: Translate
  eng: string | null
  refreshKey: number
  /** 跨页签深链：jump('assets', { ip }) / jump('chain', { hitId }) 等。 */
  jump: (tab: string, params?: Record<string, unknown>) => void
  notices: NoticeSource
  /** 最近一次 jump 带来的参数（无深链时为 null）。 */
  params: Record<string, unknown> | null
}

// —— 时间格式化 ——

/** ISO → 「YYYY-MM-DD HH:mm」；空值为 —。 */
export const fmt = (s: unknown): string => (s ? String(s).replace('T', ' ').slice(0, 16) : '—')

/** 列表用短时间（MM-DD HH:mm），完整时间进悬浮提示。 */
export const fmtShort = (s: unknown): string => {
  const t = String(s || '').replace('T', ' ')
  return t.length >= 16 ? t.slice(5, 16) : (t || '—')
}

// —— 可点击 div/span 的键盘可达性 ——

/** 给「可点击但不是 button」的元素补 role/tabIndex/Enter/Space。 */
export function clickable(onActivate: (e?: unknown) => void, options: { label?: unknown; expanded?: boolean } = {}): Record<string, unknown> {
  const props: Record<string, unknown> = {
    role: 'button',
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(e) }
    },
  }
  if (options.label !== undefined) props['aria-label'] = String(options.label)
  if (options.expanded !== undefined) props['aria-expanded'] = options.expanded ? 'true' : 'false'
  return props
}

// —— 剪贴板（结果必须真实） ——

/** 复制文本；clipboard API 不可用时退回 execCommand。返回真实成功与否。 */
export async function copyText(text: unknown): Promise<boolean> {
  const value = text === undefined || text === null ? '' : String(text)
  if (value === '') return false
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch { /* 落到兜底方案 */ }
  try {
    const doc = typeof document === 'undefined' ? null : document
    if (doc === null || doc.body === null) return false
    const ta = doc.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    doc.body.append(ta)
    ta.select()
    const ok = doc.execCommand('copy')
    ta.remove()
    return ok === true
  } catch { return false }
}

/** 复制 + 如实反馈：成功/失败文案统一走 locale。 */
export async function copyWithFeedback(t: Translate, text: unknown, label: string, onResult?: (ok: boolean, message: string) => void): Promise<boolean> {
  const ok = await copyText(text)
  const message = ok ? t('rt.copied', { label }) : t('rt.copyFail')
  if (onResult !== undefined) onResult(ok, message)
  return ok
}

// —— 折叠底座（按「页签 + 靶标」记忆到 localStorage） ——

const COLLAPSE_KEY = 'dshp-rt-collapse:'

function collapseLoad(prefix: string): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(COLLAPSE_KEY + prefix)
    const parsed = raw === null ? null : (JSON.parse(raw) as unknown)
    return parsed !== null && typeof parsed === 'object' ? parsed as Record<string, boolean> : {}
  } catch { return {} }
}

function collapseSave(prefix: string, value: Record<string, boolean>): void {
  try { window.localStorage.setItem(COLLAPSE_KEY + prefix, JSON.stringify(value)) } catch { /* 隐私模式等 */ }
}

export interface Collapse {
  isOpen: (key: string, defaultOpen?: boolean) => boolean
  toggle: (key: string, defaultOpen?: boolean) => (e?: unknown) => void
  setAll: (keys: string[], open: boolean) => void
}

/** 一个页签一个 hook：只记录用户显式点过的键，没点过的用默认值。 */
export function useCollapse(prefix: string): Collapse {
  const [state, setState] = useState<Record<string, boolean>>(() => collapseLoad(prefix))
  useEffect(() => { setState(collapseLoad(prefix)) }, [prefix])
  const write = (next: Record<string, boolean>): void => { collapseSave(prefix, next); setState(next) }
  const isOpen = (key: string, defaultOpen?: boolean): boolean => {
    const v = state[key]
    return v === undefined ? defaultOpen !== false : v === true
  }
  const toggle = (key: string, defaultOpen?: boolean) => (e?: unknown) => {
    if (e !== null && typeof e === 'object' && typeof (e as { stopPropagation?: () => void }).stopPropagation === 'function') {
      ;(e as { stopPropagation: () => void }).stopPropagation()
    }
    write({ ...state, [key]: !isOpen(key, defaultOpen) })
  }
  const setAll = (keys: string[], open: boolean): void => {
    const next = { ...state }
    for (const k of keys) next[k] = open
    write(next)
  }
  return { isOpen, toggle, setAll }
}

// —— 统一折叠头（L1）与长文本折叠（L3） ——

/** 统一折叠头：caret / 标题 / 计数 / 副题 / 右侧注；always=true 表示常显不可折叠。 */
export function Section(props: {
  tone?: string; title?: string; count?: string | number; sub?: string
  right?: ReturnType<typeof h>; open?: boolean; always?: boolean
  onToggle?: (e?: unknown) => void
  children?: ReturnType<typeof h> | Array<ReturnType<typeof h> | null>
}): ReturnType<typeof h> {
  const always = props.always === true
  const open = always || props.open === true
  const head = h('div', {
    class: 'dshp-rt-sec t-' + (props.tone ?? 'target') + (always ? ' flat' : ''),
    role: always ? undefined : 'button',
    tabIndex: always ? undefined : 0,
    'aria-expanded': always ? undefined : (open ? 'true' : 'false'),
    onClick: always ? undefined : props.onToggle,
    onKeyDown: always ? undefined : (e: { key: string; preventDefault: () => void }) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (props.onToggle !== undefined) props.onToggle(e) }
    },
  },
    h('span', { class: 'dshp-rt-sec-caret' }, always ? '▍' : (open ? '▾' : '▸')),
    props.title === undefined ? null : h('span', { class: 'dshp-rt-sec-title' }, props.title),
    props.count === undefined ? null : h('span', { class: 'dshp-rt-sec-count' }, String(props.count)),
    props.sub === undefined ? null : h('span', { class: 'dshp-rt-sec-sub' }, props.sub),
    props.right === undefined ? null : h('span', { class: 'dshp-rt-sec-right' }, props.right))
  return h('div', { class: 'dshp-rt-sec-wrap' }, head,
    open && props.children !== undefined ? h('div', { class: 'dshp-rt-sec-body' }, props.children) : null)
}

/** 长文本折叠：默认预览两行并渐隐，展开后限高滚动；带复制。 */
export function Clip(props: { t: Translate; label?: string; text: unknown }): ReturnType<typeof h> | null {
  const [open, setOpen] = useState(false)
  const text = String(props.text === undefined || props.text === null ? '' : props.text)
  if (text.trim() === '') return null
  return h('div', { class: 'dshp-rt-clip' + (open ? ' open' : '') },
    h('div', { class: 'dshp-rt-clip-head' },
      props.label === undefined ? null : h('span', { class: 'dshp-rt-clip-label' }, props.label),
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', {
        class: 'dshp-rt-btn', style: { padding: '0 6px', fontSize: 11 }, type: 'button',
        onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); void copyText(text) },
      }, props.t('rt.copy')),
      h('button', {
        class: 'dshp-rt-btn', style: { padding: '0 6px', fontSize: 11 }, type: 'button',
        onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setOpen(v => !v) },
      }, open ? props.t('rt.clipCollapse') : props.t('rt.clipExpand')),
    ),
    h('div', { class: 'dshp-rt-clip-body' }, text))
}

// —— HTTP 报文着色 ——

/** 把原始 HTTP 报文按「请求行/状态行 + 头 + 体」着色。 */
export function HttpBlock(props: { text: string; compact?: boolean }): ReturnType<typeof h> {
  const text = String(props.text || '')
  if (text === '') return null
  const nodes = text.split(/\r?\n/).map((ln, i) => {
    let cls: string | null = null
    if (i === 0 && /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|TRACE)\s/.test(ln)) cls = 'dshp-rt-hl-req'
    else if (i === 0 && /^HTTP\//.test(ln)) cls = 'dshp-rt-hl-res'
    else if (/^[A-Za-z0-9-]+:/.test(ln)) {
      const name = ln.split(':')[0].toLowerCase()
      if (name === 'host' || name === 'cookie' || name === 'authorization' || name === 'content-type') cls = 'dshp-rt-hl-req'
    }
    return h('div', { key: 'l' + i, class: cls === null ? undefined : cls }, ln === '' ? ' ' : ln)
  })
  return h('pre', { class: 'dshp-rt-evi-body' + (props.compact === true ? ' req' : '') }, nodes)
}

// —— 枚举标签（走 locale） ——

const FALLBACK = (t: Translate, key: string, raw: string | undefined): string =>
  raw === undefined || raw === '' || raw === null ? t(key) : (t(key) === key ? raw : t(key))

export function testLabel(t: Translate, s?: string): string {
  const key = 'rt.test.' + (s || 'untested')
  return t(key) === key ? (s || t('rt.test.untested')) : t(key)
}
export function priLabel(t: Translate, p?: string): string {
  const key = 'rt.pri.' + (p || 'none')
  return t(key) === key ? (p || t('rt.pri.none')) : t(key)
}
export function sevLabel(t: Translate, s?: string): string {
  const key = 'rt.sev.' + (s || 'info')
  return t(key) === key ? (s || t('rt.sev.info')) : t(key)
}
export function vulnStatusLabel(t: Translate, s?: string): string {
  const key = 'rt.vulnstatus.' + (s || 'candidate')
  return t(key) === key ? (s || t('rt.vulnstatus.candidate')) : t(key)
}
export function roleLabel(t: Translate, r?: string): string {
  if (r === undefined || r === null || r === '') return '—'
  const key = 'rt.role.' + r
  return t(key) === key ? r : t(key)
}
export function fileKindLabel(t: Translate, k?: string): string {
  if (k === undefined || k === '') return '—'
  const key = 'rt.filekind.' + k
  return t(key) === key ? k : t(key)
}
export function pocKindLabel(t: Translate, k?: string): string {
  const key = 'rt.pockind.' + (k || 'poc')
  return t(key) === key ? (k || 'POC') : t(key)
}
export function pocSourceLabel(t: Translate, s?: string): string {
  const key = 'rt.pocsource.' + (s || '')
  return t(key) === key ? (s || '—') : t(key)
}
export function provLabel(t: Translate, p?: string): string {
  const key = 'rt.prov.' + (p || 'unknown')
  return t(key) === key ? (p || t('rt.prov.unknown')) : t(key)
}
export { FALLBACK as labelFallback }

/** 知识库归类 code（顺序与 core.js 的 POC_CATEGORIES 一致）。 */
export const POC_CAT_ORDER = [
  'rce', 'deserialization', 'file-upload', 'sqli', 'unauthorized', 'auth-bypass',
  'weak-password', 'ssrf', 'xxe', 'path-traversal', 'info-leak', 'privesc', 'tunnel', 'other',
] as const

export function pocCatName(t: Translate, code: string): string {
  const key = 'rt.poccat.' + code
  return t(key) === key ? code : t(key)
}

// —— 徽章组件 ——

export function ProvTag(props: { t: Translate; p?: string }): ReturnType<typeof h> {
  if (props.p !== 'passive' && props.p !== 'active') {
    return h('span', { class: 'dshp-rt-tag' }, props.t('rt.prov.unknown'))
  }
  return h('span', { class: 'dshp-rt-tag dshp-rt-tag-' + props.p }, provLabel(props.t, props.p))
}

export function PriTag(props: { t: Translate; p?: string; title?: string }): ReturnType<typeof h> {
  if (props.p !== 'high' && props.p !== 'medium' && props.p !== 'low') {
    return h('span', { class: 'dshp-rt-tag' }, props.t('rt.pri.none'))
  }
  return h('span', { class: 'dshp-rt-pri dshp-rt-pri-' + props.p, title: props.title || '' }, priLabel(props.t, props.p))
}

export function TestTag(props: { t: Translate; s?: string }): ReturnType<typeof h> {
  const st = props.s || 'untested'
  return h('span', { class: 'dshp-rt-test dshp-rt-test-' + st }, testLabel(props.t, st))
}

export function SevTag(props: { t: Translate; s?: string }): ReturnType<typeof h> {
  const known = ['critical', 'high', 'medium', 'low', 'info'].includes(props.s || '')
  return h('span', { class: 'dshp-rt-sev dshp-rt-sev-' + (known ? props.s : 'info') }, sevLabel(props.t, props.s))
}

/** 内外网小标（short=true 用单字「内 / 外」）。 */
export function ScopeTag(props: { t: Translate; scope?: string; short?: boolean; title?: string }): ReturnType<typeof h> {
  const internal = props.scope === 'internal'
  const key = internal ? (props.short === true ? 'rt.scope.inShort' : 'rt.scope.internal') : (props.short === true ? 'rt.scope.outShort' : 'rt.scope.external')
  return h('span', { class: 'dshp-rt-scope dshp-rt-scope-' + (internal ? 'internal' : 'external'), title: props.title || '' }, props.t(key))
}

// —— 证据截图（模块级缓存 + 订阅重绘） ——

const shotCache = new Map<string, string>()
const shotLoading = new Set<string>()
const shotSubs = new Set<() => void>()

function notifyShots(): void { for (const f of [...shotSubs]) { try { f() } catch { /* ignore */ } } }

function loadShot(eng: string, id: unknown): void {
  const key = eng + ':' + String(id)
  if (shotCache.has(key) || shotLoading.has(key)) return
  shotLoading.add(key)
  void rtOp('shotData', { engagement: eng, id }).then((r) => {
    const d = r.ok ? r.data as Record<string, any> : null
    shotCache.set(key, d !== null && d.base64 ? 'data:' + (d.mime || 'image/png') + ';base64,' + d.base64 : '')
    shotLoading.delete(key)
    notifyShots()
  }).catch(() => { shotLoading.delete(key) })
}

function shotKindLabel(t: Translate, kind: string | undefined): string {
  const key = 'rt.shot.' + (kind || 'screenshot')
  return t(key) === key ? (kind || t('rt.shot.screenshot')) : t(key)
}

export function ShotImage(props: { t: Translate; eng: string; shot: Record<string, any>; height?: number }): ReturnType<typeof h> {
  const [zoom, setZoom] = useState(false)
  const [, bump] = useState(0)
  useEffect(() => {
    const f = (): void => { bump(n => n + 1) }
    shotSubs.add(f)
    return () => { shotSubs.delete(f) }
  }, [])
  const key = props.eng + ':' + String(props.shot.id)
  const src = shotCache.has(key) ? shotCache.get(key) as string : null
  if (src === null) loadShot(props.eng, props.shot.id)
  const shot = props.shot
  const card = shot.kind === 'card'
  return h('div', { class: 'dshp-rt-shot' },
    src === null
      ? h('div', { class: 'dshp-rt-shot-thumb dshp-rt-shot-loading', style: { height: (props.height ?? 96) + 'px' } }, props.t('rt.loading'))
      : h('img', {
          class: 'dshp-rt-shot-thumb', src, alt: shot.label || (props.t('rt.shot.alt') + ' ' + String(shot.id)),
          style: { height: (props.height ?? 96) + 'px', cursor: 'zoom-in' },
          onClick: () => { setZoom(true) },
        }),
    h('div', { class: 'dshp-rt-shot-cap' },
      h('span', {
        class: 'dshp-rt-tag ' + (card ? 'dshp-rt-tag-warn' : 'dshp-rt-tag-live'),
        title: card ? props.t('rt.shot.cardTitle') : props.t('rt.shot.screenshotTitle'),
      }, shotKindLabel(props.t, shot.kind)),
      h('span', { class: 'dshp-rt-shot-label', title: shot.label || shot.note || '' },
        shot.label || shot.target || ('#' + String(shot.id)))),
    zoom
      ? h('div', { class: 'dshp-rt-shot-zoom', onClick: () => { setZoom(false) } },
          h('img', { src: src === null ? undefined : src, alt: shot.label || '' }),
          h('div', { class: 'dshp-rt-shot-zoom-cap' }, (shot.label || shot.target || '')
            + (card ? '　·　' + props.t('rt.shot.cardSuffix') : '')
            + (shot.captured_at ? '　·　' + fmt(shot.captured_at) : '')
            + '　·　' + props.t('rt.shot.zoomClose')))
      : null)
}

export function ShotStrip(props: { t: Translate; eng: string; shots?: Array<Record<string, any>>; total?: number; title?: string }): ReturnType<typeof h> | null {
  const list = props.shots || []
  if (list.length === 0) return null
  return h('div', { class: 'dshp-rt-shots' },
    h('div', { class: 'dshp-rt-shots-head' },
      h('b', null, props.title ?? props.t('rt.shot.title')),
      h('span', { class: 'dshp-rt-shots-n' }, props.t('rt.shot.showing', { n: list.length })
        + (props.total !== undefined && props.total > list.length ? props.t('rt.shot.ofTotal', { n: props.total }) : ''))),
    h('div', { class: 'dshp-rt-shot-row' }, list.map((sh) => h(ShotImage, { key: 'sh' + String(sh.id), t: props.t, eng: props.eng, shot: sh }))))
}
