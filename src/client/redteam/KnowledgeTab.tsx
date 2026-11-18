/**
 * 知识库页签（POC/EXP，全局共享不随靶标）：检索、归类分组、详情、复用标记、
 * 本机 nuclei 模板分页。自旧 client.js KnowledgeTab 迁移。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import {
  clickable, copyWithFeedback, fmt, POC_CAT_ORDER, pocCatName, pocKindLabel, pocSourceLabel,
  roleLabel, type RtTabProps,
} from './bits.tsx'

type AnyRec = Record<string, any>

const TPL_PAGE_SIZE = 40

export function KnowledgeTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const [data, setData] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('')
  const [category, setCategory] = useState('')
  const [engagement, setEngagement] = useState('')
  const [assetTarget, setAssetTarget] = useState('')
  const [grouped, setGrouped] = useState(true)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [openId, setOpenId] = useState<string | number | null>(null)
  const [detail, setDetail] = useState<AnyRec | null>(null)
  const [detailBusy, setDetailBusy] = useState(false)
  const [tplOffset, setTplOffset] = useState(0)

  const query = (over: AnyRec = {}): void => {
    const offset = Object.prototype.hasOwnProperty.call(over, 'templateOffset') ? over.templateOffset : 0
    setTplOffset(offset)
    const params: AnyRec = {
      q: q.trim() || undefined,
      kind: kind || undefined,
      category: category || undefined,
      engagement: engagement || undefined,
      asset_target: assetTarget.trim() || undefined,
      verified: verifiedOnly || undefined,
      templateOffset: offset || 0,
      templateLimit: TPL_PAGE_SIZE,
      ...over,
    }
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('pocSearch', params).then((r) => {
      setBusy(false)
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setData(r.data)
    })
  }
  // 首次进入与刷新键变化时拉全量（检索是显式动作，避免边打字边打接口）
  useEffect(() => {
    query({ q: undefined, kind: undefined, category: undefined, engagement: undefined, asset_target: undefined, verified: undefined })
  }, [props.refreshKey])

  const open = (id: string | number): void => {
    if (openId === id) { setOpenId(null); setDetail(null); return }
    setOpenId(id)
    setDetail(null)
    setDetailBusy(true)
    void rtOp<AnyRec>('pocGet', { id }).then((r) => {
      setDetailBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      setDetail(r.data)
    })
  }

  const copy = (text: string, label: string): void => {
    void copyWithFeedback(t, text, label, (ok, message) => {
      setMsg(ok ? { ok: message } : { err: message })
    })
  }
  const useIt = (row: AnyRec): void => {
    void rtOp('pocUse', { id: row.id, used_on: t('rt.k.manualUse') }).then(() => {
      setMsg({ ok: t('rt.k.usedMarked', { title: row.title }) })
      query()
    })
  }

  const stats: AnyRec = (data !== null && data.stats) || { total: 0, verified: 0, reused: 0, byKind: [], bySource: [] }
  const items: AnyRec[] = (data !== null && data.items) || []
  const tpl: AnyRec = (data !== null && data.templates) || { dir: null, total: 0, matched: 0, offset: 0, items: [], byCategory: [] }
  const tplByCat = new Map<string, number>(((tpl.byCategory ?? []) as AnyRec[]).map((c) => [String(c.code), Number(c.n ?? 0)]))
  const catShown = (c: AnyRec): number => (c.n ?? 0) + (tplByCat.get(String(c.code)) ?? 0)
  const tplItems: AnyRec[] = tpl.items ?? []
  const tplMatched = tpl.matched !== null && tpl.matched !== undefined ? tpl.matched : tpl.total
  const tplStart = Number(tpl.offset) || 0
  const turnTpl = (next: number): void => {
    const offset = Math.max(0, next)
    setTplOffset(offset)
    query({ templateOffset: offset })
  }

  const card = (x: AnyRec): ReturnType<typeof h> => {
    const isOpen = openId === x.id
    const d = isOpen && detail !== null && detail.id === x.id ? detail : null
    return h('div', { key: 'p' + x.id, class: 'dshp-rt-kb' + (isOpen ? ' open' : '') },
      h('div', {
        class: 'dshp-rt-kb-head', role: 'button', tabIndex: 0, 'aria-expanded': isOpen ? 'true' : 'false',
        onClick: () => { open(x.id) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(x.id) }
        },
      },
        h('span', { class: 'dshp-rt-sec-caret' }, isOpen ? '▾' : '▸'),
        h('span', { class: 'dshp-rt-kb-kind k-' + (x.kind || 'poc') }, pocKindLabel(t, x.kind)),
        h('span', { class: 'dshp-rt-kb-title' }, x.title),
        x.cve ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, x.cve) : null,
        x.component ? h('span', { class: 'dshp-rt-tag' }, x.component) : null,
        x.verified === 1
          ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.k.verified'))
          : h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.k.unverified')),
        h('div', { class: 'dshp-rt-spacer' }),
        h('span', { class: 'dshp-rt-tag' }, pocSourceLabel(t, x.source) || '—'),
        x.hit_count ? h('span', { class: 'dshp-rt-tag' }, t('rt.k.reuseN', { n: x.hit_count })) : null),
      // 来源行：归类 · 影响版本 · 建立时间 · 来源靶标 · 发现资产
      h('div', { class: 'dshp-rt-kb-sub' },
        [x.category ? t('rt.k.catOf', { v: pocCatName(t, x.category) }) : null,
          x.versions ? t('rt.k.versionsOf', { v: x.versions }) : null,
          x.language || null,
          x.tags || null,
          t('rt.k.createdAt', { time: fmt(x.created_at) }),
          (x.engagement_name ?? x.engagement_id) ? t('rt.k.srcEngagement', { v: x.engagement_name ?? x.engagement_id }) : null,
          x.asset_target ? t('rt.k.foundOn', { v: x.asset_target }) : null,
          x.found_by_agent ? t('rt.k.foundBy', { v: roleLabel(t, x.found_by_agent) }) : null,
          x.source_url ? t('rt.k.sourceIs', { v: x.source_url }) : null].filter(Boolean).join(' · ')),
      isOpen
        ? h('div', { class: 'dshp-rt-kb-body' },
            detailBusy && d === null ? h('div', { class: 'dshp-rt-empty' }, t('rt.loading')) : null,
            d !== null
              ? h('div', null,
                  d.usage ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.k.usage')), h('span', { class: 'dshp-rt-mono' }, d.usage)) : null,
                  d.description ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.k.desc')), h('span', null, d.description)) : null,
                  d.verified_note ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.k.verifyNote')), h('span', null, d.verified_note)) : null,
                  d.used_on ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.k.lastUsed')), h('span', null, d.used_on)) : null,
                  d.path ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.k.path')), h('span', { class: 'dshp-rt-mono' }, d.path)) : null,
                  h('div', { class: 'dshp-rt-kb-actions' },
                    h('button', {
                      class: 'dshp-rt-btn', type: 'button', disabled: !d.content,
                      onClick: () => { copy(d.content || '', t('rt.k.copyContent')) },
                    }, t('rt.k.copyContent')),
                    h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { useIt(x) } }, t('rt.k.markUse')),
                    d.source_url
                      ? h('button', {
                          class: 'dshp-rt-btn', type: 'button',
                          onClick: () => { copy(d.source_url, t('rt.k.copySource')) },
                        }, t('rt.k.copySource'))
                      : null),
                  d.content
                    ? h('pre', {
                        class: 'dshp-rt-rep-http',
                      }, d.content.length > 12000 ? d.content.slice(0, 12000) + '\n…' + t('rt.k.truncated') : d.content)
                    : h('div', { class: 'dshp-rt-empty' }, t('rt.k.metaOnly')))
              : null)
        : null)
  }

  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.tab.knowledge')),
      h('span', { class: 'dshp-rt-tag' }, t('rt.k.totalN', { n: stats.total })),
      h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.k.verifiedN', { n: stats.verified })),
      h('span', { class: 'dshp-rt-tag' }, t('rt.k.reusedN', { n: stats.reused ?? 0 })),
      (stats.uncategorized ?? 0) > 0 && (stats.uncategorized ?? 0) !== stats.total
        ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn', title: t('rt.k.uncatTip') }, t('rt.k.uncatN', { n: stats.uncategorized }))
        : null,
      tpl.total ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, t('rt.k.localTplN', { n: tpl.total })) : null,
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', {
        class: 'dshp-rt-btn' + (grouped ? ' dshp-rt-btn-primary' : ''), type: 'button',
        title: t('rt.k.groupedTitle'), onClick: () => { setGrouped(g => !g) },
      }, grouped ? t('rt.k.grouped') : t('rt.k.flat')),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: () => { query() } }, busy ? t('rt.k.searching') : t('rt.refresh'))),
    // 归类总览：点一下就是按该类筛选
    h('div', { class: 'dshp-rt-kb-cats' },
      ((stats.byCategory ?? []) as AnyRec[]).filter((c) => catShown(c) > 0 || (POC_CAT_ORDER as readonly string[]).includes(String(c.code))).map((c) => h('span', {
        key: c.code,
        class: 'dshp-rt-concl-i' + (category === c.code ? ' on' : ''),
        title: (c.hint || pocCatName(t, String(c.code)))
          + t('rt.k.catStat', {
            tpl: tplByCat.get(String(c.code)) ?? 0,
            kb: c.n ?? 0,
            verified: c.verified ? t('rt.k.catVerified', { n: c.verified }) : '',
          }),
        onClick: () => {
          const next = category === c.code ? '' : String(c.code)
          setCategory(next)
          query({ category: next || undefined })
        },
      },
        h('b', null, String(catShown(c))),
        h('span', null, pocCatName(t, String(c.code)) + (c.verified ? t('rt.k.catVerified', { n: c.verified }) : ''))))),
    h('div', { class: 'dshp-rt-kb-filter' },
      h('input', {
        class: 'dshp-rt-input', style: { flex: 1, minWidth: 140 }, placeholder: t('rt.k.searchPh'),
        value: q, onChange: (e: { target: { value: string } }) => { setQ(e.target.value) },
        onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') query() },
      }),
      h('select', {
        class: 'dshp-rt-input', style: { maxWidth: 120 }, value: category,
        onChange: (e: { target: { value: string } }) => { setCategory(e.target.value); query({ category: e.target.value || undefined }) },
      },
        h('option', { value: '' }, t('rt.k.allCats')),
        POC_CAT_ORDER.map((k) => h('option', { key: k, value: k }, pocCatName(t, k)))),
      h('select', {
        class: 'dshp-rt-input', style: { maxWidth: 120 }, value: engagement,
        onChange: (e: { target: { value: string } }) => { setEngagement(e.target.value); query({ engagement: e.target.value || undefined }) },
      },
        h('option', { value: '' }, t('rt.k.allEngagements')),
        ((stats.byEngagement ?? []) as AnyRec[]).map((e) => h('option', { key: e.engagement, value: e.engagement }, e.engagement + '（' + e.n + '）'))),
      h('input', {
        class: 'dshp-rt-input', style: { width: 120 }, placeholder: t('rt.k.assetFilter'),
        value: assetTarget, onChange: (e: { target: { value: string } }) => { setAssetTarget(e.target.value) },
        onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') query() },
      }),
      h('select', {
        class: 'dshp-rt-input', style: { maxWidth: 110 }, value: kind,
        onChange: (e: { target: { value: string } }) => { setKind(e.target.value); query({ kind: e.target.value || undefined }) },
      },
        h('option', { value: '' }, t('rt.k.allKinds')),
        ['poc', 'exp', 'script', 'template', 'payload'].map((k) => h('option', { key: k, value: k }, pocKindLabel(t, k)))),
      h('label', { class: 'dshp-rt-kb-check' },
        h('input', {
          type: 'checkbox', checked: verifiedOnly,
          onChange: (e: { target: { checked: boolean } }) => { setVerifiedOnly(e.target.checked); query({ verified: e.target.checked || undefined }) },
        }),
        t('rt.k.verifiedOnly')),
      h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', onClick: () => { query() } }, t('rt.k.search'))),
    msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
    err !== null
      ? h('div', { class: 'dshp-rt-err' },
          /engagement required|unknown op/i.test(err)
            ? t('rt.k.oldHostHint')
            : err)
      : null,
    err === null && data !== null && data.dbPath
      ? h('div', { class: 'dshp-rt-foot', style: { marginBottom: 6, fontSize: 11 } },
          t('rt.k.dbAt', { path: data.dbPath }) + (data.root ? t('rt.k.rootAt', { path: data.root }) : ''))
      : null,
    h('div', { class: 'dshp-rt-table' },
      (() => {
        if (!grouped) return items.map(card)
        // 分组渲染：按内置归类顺序，未知归类挂到末尾「其它」
        const buckets = new Map<string, AnyRec[]>()
        for (const x of items) {
          const known = (POC_CAT_ORDER as readonly string[]).includes(String(x.category)) && x.category !== undefined
          const code = known ? String(x.category) : 'other'
          if (!buckets.has(code)) buckets.set(code, [])
          ;(buckets.get(code) as AnyRec[]).push(x)
        }
        const order = (POC_CAT_ORDER as readonly string[]).filter((c) => buckets.has(c))
        for (const code of buckets.keys()) if (!order.includes(code)) order.push(code)
        const out: Array<ReturnType<typeof h>> = []
        for (const code of order) {
          const list = buckets.get(code) as AnyRec[]
          out.push(h('div', { key: 'g' + code, class: 'dshp-rt-kb-cat' },
            h('span', { class: 'dshp-rt-kb-cat-name' }, pocCatName(t, code)),
            h('span', { class: 'dshp-rt-tag' }, t('rt.k.nEntries', { n: list.length })),
            h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.k.verifiedN', { n: list.filter((x) => x.verified === 1).length })),
            h('span', { class: 'dshp-rt-spacer' }),
            h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } },
              t('rt.k.latestAt', { time: fmt(list.map((x) => x.created_at).filter(Boolean).sort().pop()) }))))
          for (const x of list) out.push(card(x))
        }
        return out
      })(),
      tplItems.length > 0
        ? h('div', { class: 'dshp-rt-kb-tpl' },
            h('div', { class: 'dshp-rt-ap-sub' },
              t('rt.k.tplRange', { from: tplStart + 1, to: tplStart + tplItems.length, total: tplMatched })),
            tplItems.map((tp, i) => h('div', { key: 't' + tplStart + '-' + i, class: 'dshp-rt-kb-tpl-row' },
              h('span', { class: 'dshp-rt-tag' }, tp.severity || '—'),
              tp.category ? h('span', { class: 'dshp-rt-tag' }, pocCatName(t, String(tp.category))) : null,
              h('span', { class: 'dshp-rt-mono dshp-rt-kb-tpl-path', title: tp.path }, tp.path),
              h('span', { class: 'dshp-rt-kb-tpl-name', title: tp.name }, tp.name || ''),
              h('button', {
                class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 10.5 },
                onClick: () => { copy('nuclei -t ' + tp.path + ' -u <target>', t('rt.k.tplCmd')) },
              }, t('rt.k.copyCmd')))),
            h('div', { class: 'dshp-rt-kb-actions' },
              h('button', {
                class: 'dshp-rt-btn', type: 'button', disabled: busy || tplStart <= 0,
                onClick: () => { turnTpl(tplStart - TPL_PAGE_SIZE) },
              }, t('rt.k.prevPage')),
              h('button', {
                class: 'dshp-rt-btn', type: 'button', disabled: busy || tplStart + tplItems.length >= tplMatched,
                onClick: () => { turnTpl(tplStart + TPL_PAGE_SIZE) },
              }, t('rt.k.nextPage'))),
            tpl.dir ? h('div', { class: 'dshp-rt-foot' }, h('span', null, t('rt.k.tplDir', { path: tpl.dir }))) : null)
        : null,
      data === null ? h('div', { class: 'dshp-rt-empty' }, t('rt.loading')) : null,
      data !== null && items.length === 0 && tplItems.length === 0
        ? h('div', { class: 'dshp-rt-empty' },
            h('div', null,
              q !== '' || kind !== '' || verifiedOnly
                ? t('rt.k.noHitSearched')
                : (tpl.total
                    ? t('rt.k.emptyWithTpl', { n: tpl.total })
                    : (tpl.dir ? t('rt.k.emptyTplNoYaml') : t('rt.k.emptyNoTpl')))),
            h('div', { style: { marginTop: 6, fontSize: 12 } }, t('rt.k.orderHint')),
            data.dbPath ? h('div', { style: { marginTop: 6, fontSize: 11 }, class: 'dshp-rt-mono' }, t('rt.k.dbAt', { path: data.dbPath })) : null,
            tpl.dir ? h('div', { style: { marginTop: 6, fontSize: 11 }, class: 'dshp-rt-mono' }, t('rt.k.tplDir', { path: String(tpl.dir) })) : null)
        : null),
    h('div', { class: 'dshp-rt-foot' },
      h('span', null, t('rt.k.footNote'))))
}
