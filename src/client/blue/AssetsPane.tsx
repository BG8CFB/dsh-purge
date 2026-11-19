/**
 * 资产测绘（蓝队）：左侧按 外网/内网 + 网段 分组，右侧资产表，点行展开画像 / 暴露面 / 基线。
 * 与红队「资产测绘」同构：左边是地图，右边是账本，展开看细节。
 */
import { useCallback, useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { fmt } from '../redteam/bits.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>

export function AssetsPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [assets, setAssets] = useState<AnyRec[]>([])
  const [exposures, setExposures] = useState<AnyRec[]>([])
  const [summary, setSummary] = useState<AnyRec>({})
  const [baseline, setBaseline] = useState<AnyRec>({})
  const [group, setGroup] = useState<string>('all')
  const [openId, setOpenId] = useState<number | null>(null)
  const [profile, setProfile] = useState<AnyRec>({})
  const [bl, setBl] = useState({ category: 'account', item: '', expected: '', actual: '', result: 'fail' })
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback((): void => {
    void blueOp<AnyRec>('assets', { engagement: props.eng }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setAssets(Array.isArray(r.data.items) ? r.data.items : [])
    })
    void blueOp<AnyRec>('exposures', { engagement: props.eng }).then((r) => {
      if (r.ok) { setExposures(Array.isArray(r.data.items) ? r.data.items : []); setSummary(r.data.summary ?? {}) }
    })
    void blueOp<AnyRec>('baselineSummary', { engagement: props.eng }).then((r) => { if (r.ok) setBaseline(r.data) })
  }, [props.eng])

  useEffect(() => { load() }, [load, props.refreshKey])

  const call = (op: string, body: Record<string, unknown>, okText: string): void => {
    void blueOp<AnyRec>(op, { engagement: props.eng, ...body }).then((r) => {
      if (!r.ok) { props.notices.report(r.error, 'failure'); return }
      props.notices.report(okText, 'success')
      load()
    })
  }

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)

  const segments = (() => {
    const map = new Map<string, { cidr: string; scope: string; n: number }>()
    for (const a of assets) {
      const cidr = String(a.segment_cidr || '—')
      const scope = String(a.scope || 'external')
      const key = scope + '|' + cidr
      const cur = map.get(key) || { cidr, scope, n: 0 }
      cur.n += 1
      map.set(key, cur)
    }
    return Array.from(map.values()).sort((x, y) => x.scope.localeCompare(y.scope) || x.cidr.localeCompare(y.cidr))
  })()

  const filtered = group === 'all' ? assets
    : group === 'external' || group === 'internal' ? assets.filter((a) => String(a.scope || 'external') === group)
      : assets.filter((a) => String(a.segment_cidr || '—') === group)

  const sideItem = (key: string, label: string, count: number, tone?: string): ReturnType<typeof h> => h('div', {
    key,
    style: {
      padding: '5px 8px', cursor: 'pointer', fontSize: 12, borderRadius: 6,
      background: group === key ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent',
      color: tone === 'external' ? 'var(--dsw-alias-label-secondary)' : 'inherit',
    },
    onClick: () => setGroup(key),
  }, label + ' (' + count + ')')

  const detailOf = (a: AnyRec): ReturnType<typeof h> => {
    const exps = exposures.filter((e) => Number(e.asset_id) === Number(a.id))
    const cur = { owner: a.owner || '', dept: a.dept || '', business: a.business || '', env: a.env || 'prod', criticality: a.criticality || 'P2', data_class: a.data_class || 'internal' }
    return h('div', { class: 'dshp-rt-card', style: { margin: '6px 0 10px' } },
      h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 } },
        h('span', { class: 'dshp-rt-tag' }, '重要级 ' + String(a.criticality || 'P2')),
        h('span', { class: 'dshp-rt-tag' }, String(a.env || 'prod')),
        h('span', { class: 'dshp-rt-tag' }, '暴露 ' + String(a.open_exposures ?? 0)),
        h('span', { class: 'dshp-rt-tag' }, '未研判 ' + String(a.open_alerts ?? 0)),
        h('span', { class: 'dshp-rt-tag dshp-rt-mono' }, String(a.ip))),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
        [['owner', '责任人'], ['dept', '部门'], ['business', '业务'], ['criticality', '重要级'], ['env', '环境'], ['data_class', '数据分级']].map(([key, label]) =>
          h('input', {
            key, class: 'dshp-rt-input', style: { width: key === 'business' ? 150 : 110 },
            placeholder: label,
            value: String(profile.__id === a.id ? (profile[key] ?? cur[key]) : cur[key]),
            onFocus: () => setProfile({ __id: a.id, ...cur }),
            onChange: (e: { target: { value: string } }) => setProfile((s) => ({ __id: a.id, ...(s.__id === a.id ? s : cur), [key]: e.target.value })),
          })),
        h('button', {
          class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
          onClick: () => {
            const p = profile.__id === a.id ? profile : cur
            call('assetProfileSave', { assetId: Number(a.id), ...p }, t('b.saved'))
          },
        }, t('b.save'))),
      exps.length > 0
        ? h('div', { style: { marginTop: 8 } },
            h('div', { style: { fontSize: 11, fontWeight: 600, marginBottom: 4 } }, t('b.as.exposure')),
            exps.map((e) => h('div', { key: String(e.id), style: { fontSize: 11, display: 'flex', gap: 6, padding: '2px 0' } },
              h('span', { class: 'dshp-rt-tag' }, String(e.severity)),
              h('span', null, String(e.title)),
              h('span', { class: 'dshp-rt-tag' }, String(e.status)),
              h('div', { style: { flex: 1 } }),
              e.status === 'fixed' ? null : h('button', {
                class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
                onClick: () => call('exposureUpdate', { id: Number(e.id), status: 'fixed', verifiedBy: 'user', evidenceRef: '资产页标记' }, t('b.saved')),
              }, t('b.as.fix')))))
        : null,
      h('div', { style: { marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' } },
        h('select', { class: 'dshp-rt-input', value: bl.category, onChange: (e: { target: { value: string } }) => setBl((s) => ({ ...s, category: e.target.value })) },
          ['account', 'port', 'patch', 'config', 'log', 'backup'].map((c) => h('option', { key: c, value: c }, c))),
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 130px' }, placeholder: t('b.as.item'), value: bl.item, onChange: (e: { target: { value: string } }) => setBl((s) => ({ ...s, item: e.target.value })) }),
        h('input', { class: 'dshp-rt-input', style: { flex: '1 1 110px' }, placeholder: t('b.as.actual'), value: bl.actual, onChange: (e: { target: { value: string } }) => setBl((s) => ({ ...s, actual: e.target.value })) }),
        h('select', { class: 'dshp-rt-input', value: bl.result, onChange: (e: { target: { value: string } }) => setBl((s) => ({ ...s, result: e.target.value })) },
          ['pass', 'fail', 'unknown', 'na'].map((x) => h('option', { key: x, value: x }, x))),
        h('button', {
          class: 'dshp-rt-btn', type: 'button',
          onClick: () => call('baselineCheck', { assetId: Number(a.id), ...bl }, t('b.saved')),
        }, t('b.as.runBaseline'))))
  }

  return h('div', { class: 'dshp-rt-split' },
    h('div', { style: { width: 190, minWidth: 150, overflow: 'auto' } },
      h('div', { class: 'dshp-rt-hint', style: { fontSize: 11, marginBottom: 6 } },
        '资产 ' + assets.length + ' · 未收敛暴露 ' + String(summary.open ?? 0) + ' · 基线 fail ' + String(baseline.fail ?? 0)),
      sideItem('all', t('b.al.all'), assets.length),
      sideItem('external', '外网', assets.filter((a) => String(a.scope || 'external') === 'external').length, 'external'),
      sideItem('internal', '内网', assets.filter((a) => String(a.scope) === 'internal').length, 'external'),
      h('div', { style: { height: 8 } }),
      segments.map((s) => sideItem(s.cidr, (s.scope === 'internal' ? '内 ' : '外 ') + s.cidr, s.n))),
    h('div', { style: { flex: 1, minWidth: 320, overflow: 'auto', minHeight: 0 } },
      filtered.length === 0 ? h('div', { class: 'dshp-rt-empty' }, '还没有资产：用底部导入框贴 JSON 数组，或让 asset 角色导入 CMDB。') : null,
      filtered.map((a) => h('div', {
        key: String(a.id), style: { borderBottom: '1px solid var(--dsw-alias-border-l2)' },
      },
        h('div', {
          style: { display: 'flex', gap: 8, alignItems: 'center', padding: '6px 8px', cursor: 'pointer', fontSize: 12 },
          onClick: () => setOpenId(openId === Number(a.id) ? null : Number(a.id)),
        },
          h('span', { style: { width: 12, color: 'var(--dsw-alias-label-secondary)' } }, openId === Number(a.id) ? '▾' : '▸'),
          h('span', { class: 'dshp-rt-tag' }, String(a.criticality || 'P2')),
          h('span', { style: { fontWeight: 500, minWidth: 120 } }, String(a.ip)),
          h('span', { style: { flex: 1, color: 'var(--dsw-alias-label-secondary)' } }, String(a.primary_name || a.business || '—')),
          h('span', null, '暴露 ' + String(a.open_exposures ?? 0)),
          h('span', null, '告警 ' + String(a.open_alerts ?? 0)),
          h('span', { class: 'dshp-rt-tag dshp-rt-mono' }, String(a.segment_cidr || ''))),
        openId === Number(a.id) ? detailOf(a) : null))),
    h('div', { class: 'dshp-rt-card', style: { width: 280, marginTop: 0 } },
      h('div', { style: { fontSize: 11, marginBottom: 4 } }, t('b.as.import')),
      h('textarea', { class: 'dshp-rt-input', style: { width: '100%', minHeight: 80 }, id: 'asset-import', placeholder: t('b.as.importHint') }),
      h('button', {
        class: 'dshp-rt-btn', type: 'button',
        onClick: () => {
          const raw = (document.getElementById('asset-import') as HTMLTextAreaElement | null)?.value || '[]'
          let rows: AnyRec[] = []
          try { rows = JSON.parse(raw) } catch { props.notices.report('JSON 解析失败', 'failure'); return }
          if (!Array.isArray(rows)) { props.notices.report('需要 JSON 数组', 'failure'); return }
          call('assetImport', { rows }, '已导入 ' + rows.length + ' 条')
        },
      }, '导入')))
}
