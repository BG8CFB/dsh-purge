/**
 * 环境适配（全局）：数据根 / 库路径 / 预设注册状态 / 版本（与红队「环境适配」同构）。
 */
import { useCallback, useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { blueOp } from './api.ts'
import { Block, KV, Tag } from './kit.tsx'
import type { BluePaneProps } from './BlueTab.tsx'

type AnyRec = Record<string, any>

export function EnvPane(props: BluePaneProps): ReturnType<typeof h> {
  const t = props.t
  const [info, setInfo] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback((): void => {
    void blueOp<AnyRec>('envInfo').then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setInfo(r.data)
    })
  }, [])

  useEffect(() => { load() }, [load, props.refreshKey])

  if (err !== null) return h('div', { class: 'dshp-rt-err' }, err)
  if (info === null) return h('div', { class: 'dshp-rt-empty' }, t('b.loading'))

  const preset = info.preset || {}
  const stats = info.stats || {}
  const presetOk = preset.ok === true && !preset.broken

  return h('div', { class: 'dshp-rt-main', style: { overflow: 'auto' } },
    Block({
      title: t('b.tab.env'),
      right: Tag({ tone: presetOk ? 'live' : 'warn', children: presetOk ? '预设已注册' : '预设未就绪' }),
      children: KV({ rows: [
        ['侧别', '蓝队（防御）'],
        ['数据根', h('span', { class: 'dshp-rt-mono' }, String(info.root || '—'))],
        ['项目数据目录', h('span', { class: 'dshp-rt-mono' }, String(info.dataDir || '—'))],
        ['SQLite 库', h('span', { class: 'dshp-rt-mono' }, String(info.dbPath || '—'))],
        ['项目数', String(info.projects ?? 0)],
        ['插件版本', String(info.version || '—')],
        ['预设阶段', String(preset.phase || '—') + (preset.broken ? '（broken: ' + String(preset.broken) + '）' : '')],
        ['技能目录', h('span', { class: 'dshp-rt-mono' }, String(info.skillsDir || '—'))],
        ['资产 / 端口 / 漏洞', String(stats.assets ?? 0) + ' / ' + String(stats.openPorts ?? 0) + ' / ' + String(stats.vulns ?? 0)],
        ['告警 / 事件 / 规则', String(stats.alerts ?? 0) + ' / ' + String(stats.incidents ?? 0) + ' / ' + String(stats.rules ?? 0)],
      ] }),
    }),
    Block({
      title: '边界',
      children: h('div', { class: 'dshp-rt-ov-sub' },
        '蓝队与红队是两条平行线：这里只显示防守侧的数据根与库；红队的数据根与库不在此列，只在对账时以只读方式访问。'),
    }))
}
