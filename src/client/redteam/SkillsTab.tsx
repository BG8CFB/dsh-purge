/**
 * 技能库页签（DSH 原生）：目录 / 可用性徽章 / 只看过滤 / 正文详情。
 * 自旧 client.js SkillsTab 迁移。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import { clickable, fmt, type RtTabProps } from './bits.tsx'

type AnyRec = Record<string, any>

export function SkillsTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const [items, setItems] = useState<AnyRec[]>([])
  const [meta, setMeta] = useState<AnyRec>({})
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [srcOnly, setSrcOnly] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [detail, setDetail] = useState<AnyRec | null>(null)
  const [busy, setBusy] = useState(false)
  const [brokenOnly, setBrokenOnly] = useState(false)

  // refresh=true 跳过后端 30 秒可用性缓存（技能正文/环境变量可能刚改过）
  const load = (force: boolean): void => {
    setBusy(true)
    void rtOp<AnyRec>('skillCatalog', { refresh: force === true }).then((r) => {
      setBusy(false)
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setMeta(r.data)
      setItems(r.data.items ?? [])
    })
  }
  useEffect(() => { load(false) }, [props.refreshKey])

  const open = (skill: AnyRec): void => {
    const name = skill !== null ? skill.name : undefined
    const key = ((skill !== null && skill.library) ? skill.library : 'redteam') + ':' + String(name)
    if (active === key) { setActive(null); setDetail(null); return }
    setActive(key)
    setDetail(null)
    void rtOp<AnyRec>('skillRead', { name, library: skill.library || 'redteam' }).then((r) => {
      if (r.ok) setDetail(r.data)
      else setErr(r.error)
    })
  }

  const needle = q.trim().toLowerCase()
  let filtered = needle !== ''
    ? items.filter((s) => (s.name + ' ' + s.description + ' ' + (s.whenToUse ?? '')).toLowerCase().includes(needle))
    : items
  if (srcOnly) filtered = filtered.filter((s) => s.library !== 'official' && s.fromPlugin === true)
  if (brokenOnly) filtered = filtered.filter((s) => s.library !== 'official' && (s.availability === 'broken' || s.availability === 'unknown'))
  // 目录聚合：一眼看出「这么多技能是哪来的」
  const dirs = ((meta.byDir ?? []) as AnyRec[]).filter((d) => d.n > 0).slice(0, 6)
  const availSummary: AnyRec | null = meta.availability !== undefined ? meta.availability.summary : null
  const needRestart = err !== null && err.includes('unknown op')

  const renderSkill = (s: AnyRec): ReturnType<typeof h> => {
    const key = (s.library || 'redteam') + ':' + s.name
    return h('div', {
      ...clickable(() => { open(s) }, { label: t('rt.sk.viewSkill', { name: s.name }), expanded: active === key }),
      key, class: 'dshp-rt-item' + (active === key ? ' on' : ''),
    },
      h('div', { class: 'dshp-rt-item-name' }, s.name,
        s.modelInvocable === false ? h('span', { class: 'dshp-rt-tag', style: { marginLeft: 6 } }, t('rt.sk.manualOnly')) : null,
        s.library === 'official'
          ? h('span', { class: 'dshp-rt-tag', style: { marginLeft: 6 }, title: t('rt.sk.officialTip') }, t('rt.sk.official'))
          : h('span', {
              class: 'dshp-rt-avail dshp-rt-avail-' + (s.availability || 'unknown'),
              style: { marginLeft: 6 },
              title: s.availability === 'available'
                ? t('rt.sk.availableTip')
                : ((s.problems ?? []).join('\n') || t('rt.unknown')),
            }, s.availability === 'available' ? t('rt.sk.available') : s.availability === 'broken' ? t('rt.sk.broken') : t('rt.unknown'))),
      h('div', { class: 'dshp-rt-item-desc' }, s.description || t('rt.sk.noDesc')),
      h('div', { class: 'dshp-rt-kb-sub' },
        [s.source ? t('rt.sk.srcOf', { v: s.source }) : null,
          s.fromPlugin ? t('rt.sk.fromPlugin') : null,
          s.provider || null,
          s.dir || null].filter(Boolean).join(' · ')),
      (s.problems ?? []).length > 0 && s.availability !== 'available' && s.library !== 'official'
        ? h('div', { class: 'dshp-rt-kb-sub', style: { color: 'var(--dsw-alias-state-warn-primary, #f59e0b)' } },
            '! ' + String(s.problems[0]).slice(0, 60))
        : null)
  }
  const redteamRows = filtered.filter((s) => s.library !== 'official').map(renderSkill)
  const officialRows = filtered.filter((s) => s.library === 'official').map(renderSkill)
  const listItems: Array<ReturnType<typeof h>> = []
  if (redteamRows.length > 0) {
    listItems.push(h('div', { key: 'head-redteam', class: 'dshp-rt-kb-sub', style: { margin: '8px 0 4px', fontWeight: 600 } }, t('rt.sk.redteamSkills')))
    listItems.push(...redteamRows)
  }
  if (officialRows.length > 0) {
    listItems.push(h('div', { key: 'head-official', class: 'dshp-rt-kb-sub', style: { margin: '8px 0 4px', fontWeight: 600 } }, t('rt.sk.officialSkills')))
    listItems.push(...officialRows)
  }

  return h('div', { class: 'dshp-rt-split' },
    h('div', { class: 'dshp-rt-list' },
      h('input', {
        class: 'dshp-rt-input', style: { width: '100%', marginBottom: 8, boxSizing: 'border-box' },
        placeholder: t('rt.sk.filterPh'), value: q,
        onChange: (e: { target: { value: string } }) => { setQ(e.target.value) },
      }),
      h('label', { class: 'dshp-rt-kb-check', style: { display: 'flex', margin: '0 0 6px' } },
        h('input', { type: 'checkbox', checked: srcOnly, onChange: (e: { target: { checked: boolean } }) => { setSrcOnly(e.target.checked) } }),
        t('rt.sk.pluginOnly', { n: meta.fromPlugin ?? 0 })),
      availSummary !== null && (availSummary.broken > 0 || availSummary.unknown > 0)
        ? h('label', {
            class: 'dshp-rt-kb-check', style: { display: 'flex', margin: '0 0 8px' },
            title: t('rt.sk.brokenOnlyTip'),
          },
          h('input', { type: 'checkbox', checked: brokenOnly, onChange: (e: { target: { checked: boolean } }) => { setBrokenOnly(e.target.checked) } }),
          t('rt.sk.brokenOnly', { n: (availSummary.broken ?? 0) + (availSummary.unknown ?? 0) }))
        : null,
      availSummary !== null
        ? h('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 } },
            h('span', { class: 'dshp-rt-avail dshp-rt-avail-available' }, t('rt.sk.availableN', { n: availSummary.available ?? 0 })),
            availSummary.broken > 0 ? h('span', { class: 'dshp-rt-avail dshp-rt-avail-broken' }, t('rt.sk.brokenN', { n: availSummary.broken })) : null,
            availSummary.unknown > 0 ? h('span', { class: 'dshp-rt-avail dshp-rt-avail-unknown' }, t('rt.sk.unknownN', { n: availSummary.unknown })) : null,
            h('span', {
              ...clickable(() => { load(true) }, { label: t('rt.sk.recheck') }),
              class: 'dshp-rt-tag', style: { cursor: 'pointer' },
              title: t('rt.sk.recheckTip'),
            }, t('rt.sk.recheck')))
        : null,
      h('div', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)', marginBottom: 6 } },
        t('rt.sk.libsStat', {
          rt: (meta.libraries ?? {}).redteam ?? 0,
          of: (meta.libraries ?? {}).official ?? 0,
        }),
        items.length > 100 ? h('div', { style: { marginTop: 3 } }, t('rt.sk.manyNote', { n: meta.fromPlugin ?? 0 })) : null),
      listItems),
    h('div', { class: 'dshp-rt-main' },
      h('div', { class: 'dshp-rt-toolbar' },
        h('span', { style: { fontWeight: 600 } }, detail !== null ? detail.name : t('rt.sk.catalogTitle')),
        h('div', { class: 'dshp-rt-spacer' }),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: () => { load(true) },
        }, busy ? t('rt.refreshing') : t('rt.refresh'))),
      err !== null
        ? (needRestart
            ? h('div', { class: 'dshp-rt-empty' }, t('rt.needRestart'))
            : h('div', { class: 'dshp-rt-err' }, err))
        : null,
      detail !== null
        ? h('div', { class: 'dshp-rt-pane' },
            h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.k.desc')), h('span', null, detail.description || '—')),
            h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.sk.whenToUse')), h('span', null, detail.whenToUse || '—')),
            h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.a.dSource')), h('span', null, (detail.provider || '—') + ' / ' + (detail.source || '—'))),
            (() => {
              const s2 = items.find((x) => ((x.library || 'redteam') + ':' + x.name) === active)
              if (s2 === undefined) return null
              if (s2.library === 'official') {
                return h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.sk.kindLabel')), h('span', null, t('rt.sk.officialKind')))
              }
              const avail = s2.availability || 'unknown'
              return h('div', null,
                h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.sk.availability')),
                  h('span', { class: 'dshp-rt-avail dshp-rt-avail-' + avail },
                    avail === 'available' ? t('rt.sk.available') : avail === 'broken' ? t('rt.sk.brokenDetail') : t('rt.sk.unknownDetail'))),
                (s2.problems ?? []).length > 0
                  ? h('div', { class: 'dshp-rt-kv' }, h('b', null, avail === 'available' ? t('rt.sk.missingTools') : t('rt.sk.gaps')),
                      h('span', null, (s2.problems as string[]).map((x, i) => h('div', { key: 'p' + i }, '· ' + x))))
                  : null,
                (s2.needs_user ?? []).length > 0
                  ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.sk.needsUser')),
                      h('span', { style: { color: 'var(--dsw-alias-state-warn-primary, #f59e0b)' } },
                        (s2.needs_user as string[]).map((x, i) => h('div', { key: 'n' + i }, '· ' + x))))
                  : null)
            })(),
            detail.path ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.k.path')), h('span', { class: 'dshp-rt-mono', style: { wordBreak: 'break-all' } }, detail.path)) : null,
            h('pre', {
              class: 'dshp-rt-md',
              style: { border: '1px solid var(--dsw-alias-border-l1)', borderRadius: 6, maxHeight: '52vh' },
            }, detail.content || t('rt.empty')))
        : h('div', { class: 'dshp-rt-pane' },
            h('div', { style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)', marginBottom: 8 } },
              meta.note || t('rt.sk.noteDefault')),
            availSummary !== null
              ? h('div', { style: { fontSize: 12, marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' } },
                  h('span', { class: 'dshp-rt-avail dshp-rt-avail-available' }, t('rt.sk.availableN', { n: availSummary.available ?? 0 })),
                  availSummary.broken > 0 ? h('span', { class: 'dshp-rt-avail dshp-rt-avail-broken' }, t('rt.sk.brokenN', { n: availSummary.broken })) : null,
                  availSummary.unknown > 0 ? h('span', { class: 'dshp-rt-avail dshp-rt-avail-unknown' }, t('rt.sk.unknownN', { n: availSummary.unknown })) : null,
                  h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } },
                    t('rt.sk.checkedAt', {
                      when: meta.availability.cached ? t('rt.sk.cachedAt') : t('rt.sk.checkedAtLabel'),
                      time: meta.availability.checked_at ? fmt(meta.availability.checked_at) : '—',
                    })))
              : null,
            meta.availability !== undefined && ((meta.availability.broken ?? []) as AnyRec[]).length > 0
              ? h('div', { class: 'dshp-rt-hint' },
                  h('div', { style: { fontWeight: 600, marginBottom: 4 } }, t('rt.sk.brokenListTitle')),
                  ((meta.availability.broken ?? []) as AnyRec[]).slice(0, 12).map((b) => h('div', { key: b.name },
                    '· ' + b.name + (b.problems !== undefined && b.problems.length > 0 ? ' — ' + b.problems[0] : ''))))
              : null,
            dirs.map((d) => h('div', {
              key: d.key, class: 'dshp-rt-mono',
              style: { fontSize: 11, marginBottom: 2, overflowWrap: 'anywhere' },
            }, t('rt.sk.dirN', { n: d.n, path: d.key }))),
            ((meta.byDir ?? []) as AnyRec[]).length > 6
              ? h('div', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } },
                  t('rt.sk.moreDirs', { n: ((meta.byDir ?? []) as AnyRec[]).length - 6, m: items.length }))
              : null,
            h('div', { class: 'dshp-rt-empty' }, t('rt.sk.pickLeft')))))
}
