/**
 * 攻击链页签（五阶段）：A 竖向链（逐阶段细节）/ B 横向链（一屏看完）。
 * 自旧 client.js ChainTab 迁移；新增深链消费：jump('chain', { hitId }) 展开对应命中。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import { Clip, clickable, fmt, ScopeTag, type RtTabProps, type Translate } from './bits.tsx'

type AnyRec = Record<string, any>

const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥']

export function ChainTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [data, setData] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'A' | 'B'>('A')
  const [openId, setOpenId] = useState<string | number | null>(null)

  const load = (): void => {
    if (eng === null || eng === '') return
    setLoading(true)
    void rtOp<AnyRec>('scoreChain', { engagement: eng }).then((r) => {
      setLoading(false)
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setData(r.data)
    })
  }
  useEffect(load, [eng, props.refreshKey])

  // 深链：报告页「→ 攻击链」定位到某次命中（scoreChain item id）
  useEffect(() => {
    const p = props.params
    if (p === null || p === undefined || p.hitId === undefined) return
    setOpenId(p.hitId as string | number)
  }, [props.params])

  const stages: AnyRec[] = (data !== null && data.stages) || []
  const summary: AnyRec | null = data !== null ? data.summary : null
  const toggle = (id: string | number): void => { setOpenId(cur => (cur === id ? null : id)) }

  // 单次得分的详情
  const hitDetail = (x: AnyRec): ReturnType<typeof h> =>
    h('div', { class: 'dshp-rt-flow-detail' },
      h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.hTarget')), h('span', { class: 'dshp-rt-mono', style: { wordBreak: 'break-all' } }, x.target || '—')),
      x.asset_ip ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.asset')), h('span', { class: 'dshp-rt-mono' }, x.asset_ip)) : null,
      x.vuln_title ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.c.usedVuln')), h('span', null, [x.vuln_cve, x.vuln_title].filter(Boolean).join(' '))) : null,
      h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.c.nthOfPoint')), h('span', null,
        t('rt.c.nthOf', { n: x.nth_of_point, pts: x.points ?? 0 }))),
      h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.c.record')), h('span', null, fmt(x.recorded_at) + (x.recorded_by ? ' · ' + x.recorded_by : ''))),
      x.evidence ? h(Clip, { t, label: t('rt.c.resultEvidence'), text: x.evidence }) : null)

  const hitRow = (x: AnyRec): ReturnType<typeof h> =>
    h('div', {
      key: 'h' + x.id,
      class: 'dshp-rt-ap-hit' + (openId === x.id ? ' open' : ''),
      role: 'button', tabIndex: 0,
      onClick: () => { toggle(x.id) },
      onKeyDown: (e: { key: string; preventDefault: () => void }) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(x.id) }
      },
    },
      h('div', { class: 'dshp-rt-ap-hit-head' },
        h('span', { class: 'dshp-rt-ap-pts' + (x.counted ? '' : ' uncounted'), title: x.capped_reason || undefined },
          '+' + (x.counted === true ? (x.points ?? 0) : 0)),
        h('span', { class: 'dshp-rt-ap-hit-name' }, x.point_name),
        x.capped === true
          ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn', title: x.capped_reason || t('rt.c.cappedDefault') }, t('rt.c.cappedTag'))
          : null,
        x.nth_of_point > 1 ? h('span', { class: 'dshp-rt-ap-nth' }, t('rt.c.nth', { n: x.nth_of_point })) : null,
        h('span', { class: 'dshp-rt-ap-hit-target' }, x.target || x.asset_ip || '—')),
      x.action
        ? h('div', { class: 'dshp-rt-ap-act' + (x.action_inferred ? ' inferred' : '') },
            t('rt.c.action') + '：' + (x.action.title || t('rt.c.unnamedStep')) + (x.action_inferred ? t('rt.c.inferred') : ''))
        : null,
      openId === x.id ? hitDetail(x) : null)

  // 资产行（信息收集阶段 / 各阶段涉及资产）
  const assetRow = (a: AnyRec): ReturnType<typeof h> =>
    h('div', { key: 'a' + a.id, class: 'dshp-rt-ap-asset' },
      h(ScopeTag, { t, scope: a.scope, short: true }),
      h('span', { class: 'dshp-rt-mono', style: { fontWeight: 600 } }, a.ip),
      a.segment_cidr ? h('span', { class: 'dshp-rt-ap-nth' }, a.segment_cidr) : null,
      h('span', { class: 'dshp-rt-ap-nth' }, t('rt.a.dPorts', { n: a.open_ports ?? 0 })),
      a.vulns ? h('span', { class: 'dshp-rt-ap-nth' }, t('rt.c.nVulns', { n: a.vulns })) : null,
      a.priority ? h('span', { class: 'dshp-rt-tag' }, t('rt.c.easyN', { p: a.priority })) : null,
      h('div', { class: 'dshp-rt-spacer' }),
      h('span', { class: 'dshp-rt-ap-pts' }, '+' + (a.points ?? 0)),
      h('span', { class: 'dshp-rt-ap-nth' }, t('rt.c.nHits', { n: a.hits ?? 0 })))

  // A：竖向攻击链
  const stageA = (st: AnyRec, i: number): ReturnType<typeof h> => {
    const isRecon = st.code === 'recon'
    const body: Array<ReturnType<typeof h>> = []
    if (isRecon) {
      body.push(h('div', { key: 'at', class: 'dshp-rt-ap-sub' }, t('rt.c.scoredAssets', { n: st.assetCount })))
      body.push(h('div', { key: 'al', class: 'dshp-rt-ap-assets' },
        (st.assets ?? []).length > 0 ? (st.assets as AnyRec[]).map(assetRow) : h('div', { class: 'dshp-rt-ap-none' }, t('rt.c.noScoredAssets'))))
    } else {
      body.push(h('div', { key: 'ht', class: 'dshp-rt-ap-sub' },
        t('rt.c.stageHits', { n: st.hits }) + (st.points ? ' · +' + st.points : '')))
      body.push(h('div', { key: 'hl', class: 'dshp-rt-ap-hits' },
        (st.items ?? []).length > 0 ? (st.items as AnyRec[]).map(hitRow) : h('div', { class: 'dshp-rt-ap-none' }, t('rt.c.noStageScore'))))
      if (st.code === 'boundary') {
        const selfOnly = ((st.tunnels_self_only ?? []) as AnyRec[]).length
        body.push(h('div', { key: 'tt', class: 'dshp-rt-ap-sub' },
          t('rt.c.tunnelsOf', { n: (st.tunnels ?? []).length }) + (selfOnly > 0 ? t('rt.c.tunnelsSelfOnly', { n: selfOnly }) : '')))
        if (selfOnly > 0 && (st.tunnels ?? []).length === 0) {
          body.push(h('div', { key: 'tw', class: 'dshp-rt-ap-none' }, t('rt.c.tunnelsAllSelf')))
        }
        body.push(h('div', { key: 'tl', class: 'dshp-rt-ap-tunnels' },
          (st.tunnels ?? []).length > 0
            ? (st.tunnels as AnyRec[]).map((tr) => h('div', { key: 't' + tr.id, class: 'dshp-rt-ap-tunnel' },
                h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, tr.kind || 'tunnel'),
                h('span', { class: 'dshp-rt-mono', style: { fontWeight: 600 } }, tr.listen || '—'),
                h('span', {
                  class: 'dshp-rt-tag ' + (tr.status === 'active' ? 'dshp-rt-tag-live' : ''),
                  style: tr.status === 'active' ? {} : { opacity: .7 },
                }, tr.status === 'active' ? t('rt.c.usable') : (tr.status || t('rt.unknown'))),
                h('span', { class: 'dshp-rt-ap-nth', style: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' } },
                  t('rt.c.reach') + ' ' + (tr.reach || '—'))))
            : h('div', { class: 'dshp-rt-ap-none' }, t('rt.c.noTunnels'))))
      }
      if ((st.assets ?? []).length > 0 && st.code !== 'boundary') {
        body.push(h('div', { key: 'at2', class: 'dshp-rt-ap-sub' }, t('rt.c.involvedAssets', { n: st.assetCount })))
        body.push(h('div', { key: 'al2', class: 'dshp-rt-ap-assets' }, (st.assets as AnyRec[]).map(assetRow)))
      }
    }

    return h('div', { key: 'st' + st.code, class: 'dshp-rt-ap-stage' },
      h('div', { class: 'dshp-rt-ap-head', style: { borderLeftColor: st.color } },
        h('span', { class: 'dshp-rt-ap-no', style: { background: st.color } }, CIRCLED[i] || ('0' + (i + 1))),
        h('span', { class: 'dshp-rt-ap-name' }, st.name),
        st.subtitle ? h('span', { class: 'dshp-rt-ap-en' }, st.subtitle) : null,
        h('div', { class: 'dshp-rt-spacer' }),
        st.points > 0
          ? h('span', {
              class: 'dshp-rt-ap-pts',
              style: { background: st.color + '22', color: st.color, borderColor: st.color + '66' },
            }, '+' + st.points)
          : null,
        h('span', { class: 'dshp-rt-ap-cum' }, t('rt.c.cumulative', { n: st.cumulative }))),
      h('div', { class: 'dshp-rt-ap-goal', style: { borderLeftColor: st.color } },
        h('span', { class: 'dshp-rt-ap-goal-tag', style: { color: st.color, borderColor: st.color + '66' } }, t('rt.c.stageGoal')),
        h('span', null, st.goal)),
      h('div', { class: 'dshp-rt-ap-result', style: { borderLeftColor: st.color } }, body),
      i < stages.length - 1
        ? h('div', { class: 'dshp-rt-ap-trans' },
            h('span', { class: 'dshp-rt-sec-caret' }, '▼'),
            st.transition ? h('span', { class: 'dshp-rt-ap-trans-t' }, st.transition) : null,
            h('span', { class: 'dshp-rt-ap-trans-t', style: { marginLeft: 'auto' } }, t('rt.c.cumulative', { n: st.cumulative })))
        : h('div', { class: 'dshp-rt-ap-trans' },
            h('span', { class: 'dshp-rt-sec-caret' }, '▼'),
            h('span', { class: 'dshp-rt-ap-trans-t' }, t('rt.c.total', { n: (summary !== null && summary.points) || 0 }))))
  }

  // B：横向攻击链（一屏看完）
  const stageB = (st: AnyRec, i: number): ReturnType<typeof h> =>
    h('div', { key: 'c' + st.code, class: 'dshp-rt-ap-col' },
      i > 0 ? h('span', { class: 'dshp-rt-ap-col-arrow' }, '▶') : null,
      h('div', { class: 'dshp-rt-hcol', style: { borderTopColor: st.color } },
        h('div', { class: 'dshp-rt-ap-head', style: { borderLeftColor: st.color, padding: '5px 8px' } },
          h('span', { class: 'dshp-rt-ap-no', style: { background: st.color, width: 16, height: 16, fontSize: 10 } }, String(i + 1)),
          h('span', { class: 'dshp-rt-ap-name', style: { fontSize: 12 } }, st.name),
          h('div', { class: 'dshp-rt-spacer' }),
          h('span', { class: 'dshp-rt-ap-cum', style: { fontWeight: 700 } }, st.cumulative)),
        h('div', { class: 'dshp-rt-hcol-goal', title: st.goal }, st.goal),
        h('div', { class: 'dshp-rt-hcol-body' },
          st.code === 'boundary'
            ? h('div', null,
                h('div', { class: 'dshp-rt-hcol-hit' },
                  h('span', { class: 'dshp-rt-hcol-pts' }, '+' + st.points),
                  h('span', { class: 'dshp-rt-hcol-name' }, t('rt.c.tunnelsN', { n: (st.tunnels ?? []).length }))),
                (st.tunnels ?? []).slice(0, 3).map((tr: AnyRec) =>
                  h('div', { key: 't' + tr.id, class: 'dshp-rt-hcol-sub' }, '▸ ' + (tr.kind || '') + ' ' + (tr.listen || ''))))
            : st.code === 'recon'
              ? h('div', null,
                  h('div', { class: 'dshp-rt-hcol-hit' },
                    h('span', { class: 'dshp-rt-hcol-pts' }, String(st.assetCount)),
                    h('span', { class: 'dshp-rt-hcol-name' }, t('rt.c.assetsScored'))),
                  (st.assets ?? []).slice(0, 6).map((a: AnyRec) =>
                    h('div', {
                      key: 'a' + a.id, class: 'dshp-rt-hcol-sub',
                      title: a.ip + '  +' + a.points,
                    }, (a.scope === 'internal' ? t('rt.scope.inShort') + ' ' : t('rt.scope.outShort') + ' ') + a.ip + '  +' + a.points)))
              : h('div', null,
                  h('div', { class: 'dshp-rt-hcol-hit' },
                    h('span', { class: 'dshp-rt-hcol-pts' }, '+' + st.points),
                    h('span', { class: 'dshp-rt-hcol-name' }, t('rt.c.hitsN', { n: st.hits }))),
                  (st.items ?? []).slice(0, 6).map((x: AnyRec) =>
                    h('div', {
                      key: 'c' + x.id, class: 'dshp-rt-hcol-sub',
                      title: x.point_name + '  ' + (x.target || ''),
                    }, h('span', { class: 'dshp-rt-hcol-pts' }, '+' + x.points), h('span', { class: 'dshp-rt-hcol-name' }, x.point_name))),
                  (st.items ?? []).length > 6 ? h('div', { class: 'dshp-rt-hcol-none' }, t('rt.c.moreN', { n: (st.items ?? []).length - 6 })) : null,
                  st.assetCount ? h('div', { class: 'dshp-rt-hcol-none' }, t('rt.c.involvedAssets', { n: st.assetCount })) : null))))

  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.tab.chain')),
      h('span', { class: 'dshp-rt-tag', style: { fontSize: 10.5 } }, t('rt.c.flowHint')),
      summary !== null ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.c.totalScore', { n: summary.points })) : null,
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', { class: 'dshp-rt-btn' + (view === 'A' ? ' dshp-rt-btn-primary' : ''), type: 'button', title: t('rt.c.viewATitle'), onClick: () => { setView('A') } }, t('rt.c.viewA')),
      h('button', { class: 'dshp-rt-btn' + (view === 'B' ? ' dshp-rt-btn-primary' : ''), type: 'button', title: t('rt.c.viewBTitle'), onClick: () => { setView('B') } }, t('rt.c.viewB')),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: loading, onClick: load }, loading ? t('rt.loading') : t('rt.refresh'))),
    err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
    stages.length === 0 && err === null && data !== null
      ? h('div', { class: 'dshp-rt-empty' },
          h('div', null, t('rt.c.empty')),
          h('div', { style: { marginTop: 6, fontSize: 12 } }, t('rt.c.emptyHint')))
      : view === 'A'
        ? h('div', { class: 'dshp-rt-ap' }, stages.map(stageA))
        : h('div', { class: 'dshp-rt-ap-h' }, stages.map(stageB)))
}

/** 报告页兜底分组用：host 只给平铺条目时按 scoreChain 的阶段信息分组。 */
export function groupByStage(reportItems: AnyRec[], chain: AnyRec | null): AnyRec[] {
  const byId = new Map((reportItems ?? []).map((x) => [x.id, x]))
  const groups: AnyRec[] = []
  const stageList = (chain !== null && chain.stages) || []
  stageList.forEach((st: AnyRec, si: number) => {
    const items = ((st.items ?? []) as AnyRec[]).map((x) => byId.get(x.id)).filter(Boolean) as AnyRec[]
    if (items.length === 0) return
    groups.push({
      code: st.code, name: st.name, color: st.color || '#64748b',
      ordinal: st.ordinal || si + 1, points: st.points || 0, cumulative: st.cumulative || 0, items,
    })
  })
  const grouped = new Set(groups.reduce<number[]>((acc, g) => acc.concat((g.items as AnyRec[]).map((x) => x.id as number)), []))
  const rest = (reportItems ?? []).filter((x) => !grouped.has(x.id))
  if (rest.length > 0) {
    groups.push({
      code: 'other', name: '', color: '#64748b', ordinal: groups.length + 1,
      points: rest.reduce((n, x) => n + (x.counted === true ? x.points : 0), 0),
      cumulative: 0, items: rest,
    })
  }
  return groups
}
