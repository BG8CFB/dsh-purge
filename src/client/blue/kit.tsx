/**
 * 蓝队 UI 套件：**直接复用红队演练台的视觉语言**（同一批 dshp-* 类名），
 * 保证两边的卡片、标题、字牌（tag）、KPI、进度条、键值表长得一模一样。
 *
 * 这里只做"把类名封成组件"，不引入新的样式；新增样式一律加到 redteam/styles.ts。
 */
import { h } from '../shared/ui.ts'
import { Section } from '../redteam/bits.tsx'
import type { ReactNode } from 'react'

type Node = ReturnType<typeof h>

/** 卡片标题（与红队总览的 tile 标题同款）。 */
export function Title(props: { children?: ReactNode; right?: Node }): Node {
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
    h('div', { class: 'dshp-rt-ov-title', style: { flex: 1 } }, props.children),
    props.right === undefined ? null : props.right)
}

/** KPI 磁贴：大数字 + 副题。 */
export function Tile(props: { title?: string; big?: string; sub?: string; tone?: 'bad' | 'warn'; onClick?: () => void; children?: ReactNode }): Node {
  return h('div', {
    class: 'dshp-rt-ov-tile',
    style: props.onClick === undefined ? undefined : { cursor: 'pointer' },
    onClick: props.onClick,
  },
    props.title === undefined ? null : h('div', { class: 'dshp-rt-ov-title' }, props.title),
    props.big === undefined ? null : h('div', {
      class: 'dshp-rt-ov-big',
      style: props.tone === 'bad' ? { color: 'var(--dsw-alias-state-error-primary)' } : props.tone === 'warn' ? { color: 'var(--dsw-alias-state-warning-primary)' } : undefined,
    }, props.big),
    props.sub === undefined ? null : h('div', { class: 'dshp-rt-ov-sub' }, props.sub),
    props.children)
}

/** 进度条（红队总览/项目卡片同款）。 */
export function Bar(props: { pct: number; caption?: string }): Node {
  const pct = Math.max(0, Math.min(100, Math.round(props.pct)))
  return h('div', null,
    h('div', { class: 'dshp-rt-ov-bar' }, h('i', { style: { width: pct + '%' } })),
    props.caption === undefined ? null : h('div', { class: 'dshp-rt-ov-sub' }, props.caption))
}

/** 字牌：统一走 dshp-rt-tag 系列（live/warn/passive/active）。 */
export function Tag(props: { tone?: 'live' | 'warn' | 'passive' | 'active'; mono?: boolean; children?: ReactNode; title?: string }): Node {
  const cls = 'dshp-rt-tag'
    + (props.tone === undefined || props.tone === 'passive' ? (props.tone === 'passive' ? ' dshp-rt-tag-passive' : '') : ' dshp-rt-tag-' + props.tone)
    + (props.mono === true ? ' dshp-rt-mono' : '')
  return h('span', { class: cls, title: props.title }, props.children)
}

/** 键值行（设置/环境/详情页统一用它）。 */
export function KV(props: { rows: Array<[string, ReactNode]> }): Node {
  return h('div', null, props.rows.map(([k, v]) => h('div', { key: k, class: 'dshp-rt-kv' },
    h('b', null, k), h('span', null, v))))
}

/** 表单字段（项目中心 create 卡同款）。 */
export function Field(props: { label?: string; children?: ReactNode }): Node {
  return h('div', { class: 'dshp-pj-field' },
    props.label === undefined ? null : h('div', { class: 'dshp-pj-label' }, props.label),
    props.children)
}

export function Empty(props: { children?: ReactNode }): Node {
  return h('div', { class: 'dshp-rt-empty' }, props.children)
}

/** 带标题的分区卡片（红队 Section 组件，标题带计数与右侧操作）。 */
export function Block(props: { title?: string; count?: string | number; sub?: string; right?: Node; children?: ReactNode }): Node {
  return h(Section, {
    title: props.title, count: props.count, sub: props.sub, right: props.right,
    always: true,
  }, props.children)
}

/** 两栏布局：左列表 + 右详情（红队分栏同款比例）。 */
export function Split(props: { left: Node; right: Node }): Node {
  return h('div', { class: 'dshp-rt-split' }, props.left, props.right)
}
