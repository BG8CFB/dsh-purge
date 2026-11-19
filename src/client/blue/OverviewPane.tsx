/**
 * 防守总览：与红队「总览」同款 tile 网格（dshp-rt-ov-grid / ov-tile / ov-title / ov-big / ov-bar）。
 * 数字只作技术观测（不记分），磁贴可点直接跳到对应页。
 */
import { useCallback, useEffect, useState } from 'react'
import { h, Loading } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { fmt } from '../redteam/bits.tsx'
import { Block, Empty, Tag, Tile } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>

export function OverviewPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [digest, setDigest] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback((): void => {
    void blueOp<AnyRec>('digest', { engagement: props.eng }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setDigest(r.data.digest ?? null)
    })
  }, [props.eng])

  useEffect(() => { load() }, [load, props.refreshKey])

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)
  if (digest === null) return h(Loading, { text: t('b.loading') })

  const alerts = digest.alerts ?? {}
  const incidents = digest.incidents ?? {}
  const metrics = digest.metrics ?? {}
  const exposures = digest.exposures ?? {}
  const detection = digest.detection ?? {}
  const actions = digest.actions ?? {}
  const vulns = digest.vulns ?? {}
  const bySev = (vulns.bySeverity ?? {}) as AnyRec
  const vulnTotal = Number(vulns.total || 0)
  const fixed = Number((vulns.byStatus ?? {}).fixed || 0)
  const coveragePct = Number(detection.rulesActive || 0) > 0 ? Math.min(100, Math.round((Number(detection.rulesActive) / 17) * 100)) : 0

  const alertTile = Tile({
    title: t('b.ov.alerts'),
    big: String(alerts.unhandled ?? 0),
    tone: Number(alerts.unhandled || 0) > 0 ? 'warn' : undefined,
    sub: '超时 ' + String(alerts.overdue ?? 0) + ' · P0 ' + String(alerts.p0 ?? 0),
    onClick: () => props.go('alerts'),
    children: h('div', { style: { display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' } },
      ['P0', 'P1', 'P2', 'P3'].map((s) => Tag({
        key: s,
        tone: s === 'P0' ? 'warn' : s === 'P1' ? 'active' : 'passive',
        children: s + ' ' + String((alerts.bySeverity ?? {})[s] ?? 0),
      })),
      Tag({ tone: 'passive', children: '误报 ' + String(alerts.fpRate ?? 0) + '%' })),
  })

  const incidentTile = Tile({
    title: t('b.ov.incidents'),
    big: String(incidents.open ?? 0),
    sub: '待批 ' + String(actions.pending ?? 0) + ' · 待验证 ' + String(actions.unverified ?? 0),
    onClick: () => props.go('incidents'),
    children: ((incidents.recent ?? []) as AnyRec[]).slice(0, 4).map((row) => h('div', {
      key: String(row.id), class: 'dshp-rt-ov-sub', style: { display: 'flex', gap: 6, marginTop: 4 },
    },
      Tag({ tone: String(row.severity) === 'P0' ? 'warn' : 'passive', children: String(row.severity) }),
      h('span', { style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, String(row.title)),
      h('span', null, String(row.status)))),
  })

  const vulnTile = Tile({
    title: t('b.ov.vulns'),
    big: String(vulnTotal),
    tone: bySev.critical > 0 ? 'bad' : vulnTotal > 0 ? 'warn' : undefined,
    sub: '已修 ' + fixed + ' · 未收敛暴露 ' + String(exposures.open ?? 0),
    onClick: () => props.go('vulns'),
    children: h('div', { style: { display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' } },
      ['critical', 'high', 'medium', 'low'].map((s) => Tag({ key: s, tone: s === 'critical' ? 'warn' : 'passive', children: s + ' ' + String(bySev[s] ?? 0) }))),
  })

  const detectionTile = Tile({
    title: t('b.ov.coverage'),
    big: String(detection.rulesActive ?? 0) + ' / 17',
    sub: '日志源 ' + String(Object.values(detection.sources ?? {}).reduce((a: number, b: any) => a + Number(b), 0)) + ' · MTTD ' + (metrics.mttd ?? '—') + ' / MTTR ' + (metrics.mttr ?? '—'),
    onClick: () => props.go('detection'),
    children: h('div', { style: { marginTop: 6 } },
      h('div', { class: 'dshp-rt-ov-bar' }, h('i', { style: { width: coveragePct + '%' } }))),
  })

  const next: string[] = []
  if (alerts.unhandled > 0) next.push('清告警：未研判 ' + alerts.unhandled + ' 条（超时 ' + alerts.overdue + '）')
  if (actions.pending > 0) next.push('待批处置 ' + actions.pending + ' 条：去「事件处置」批准')
  if (actions.unverified > 0) next.push('待验证动作 ' + actions.unverified + ' 条：验证后事件才能止血')
  if (vulnTotal > 0) next.push('待修漏洞 ' + vulnTotal + ' 条：去「漏洞」闭环')
  if (exposures.open > 0) next.push('暴露面待收敛 ' + exposures.open + ' 项')
  if (Number(detection.rulesActive || 0) === 0) next.push('还没有生效的检测规则：去「检测覆盖」补规则')

  return h('div', { class: 'dshp-rt-main', style: { overflow: 'auto' } },
    h('div', { class: 'dshp-rt-ov-grid' }, alertTile, incidentTile, vulnTile, detectionTile),
    Block({
      title: t('b.ov.next'), count: next.length,
      children: next.length === 0
        ? Empty({ children: '当前没有待办：可以推进检测覆盖或跑一轮基线。' })
        : h('div', null, next.map((line, i) => h('div', { key: 'n' + i, class: 'dshp-rt-ov-sub' }, '· ' + line))),
    }),
    Block({
      title: t('b.ov.changes'), count: (digest.changes ?? []).length,
      children: (digest.changes ?? []).length === 0
        ? Empty({ children: t('b.empty') })
        : h('div', null, ((digest.changes ?? []) as AnyRec[]).slice(0, 12).map((c) => h('div', {
            key: String(c.id), class: 'dshp-rt-ov-sub', style: { display: 'flex', gap: 8 },
          },
            h('span', { class: 'dshp-rt-mono' }, fmt(c.at)),
            h('span', null, String(c.kind)),
            h('span', { class: 'dshp-rt-mono' }, c.ref_id === null ? '' : '#' + String(c.ref_id))))),
    }))
}
