/**
 * 得分目标页签：按 8 个类别分组、命中/上限/封顶展示、新增/编辑/停用/删除。
 * 自旧 client.js ScoreTab 迁移；新增深链消费：jump('scores', { pointId }) 直接展开该得分点的命中列表。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import { clickable, copyText, fmt, ShotStrip, type RtTabProps } from './bits.tsx'

type AnyRec = Record<string, any>

export function ScoresTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [data, setData] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [openId, setOpenId] = useState<string | number | null>(null)
  const [form, setForm] = useState<AnyRec | null>(null)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)

  const load = (): void => {
    if (eng === null || eng === '') return
    setBusy(true)
    void rtOp<AnyRec>('scores', { engagement: eng }).then((r) => {
      setBusy(false)
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setData(r.data)
    })
  }
  useEffect(load, [eng, props.refreshKey])

  // 深链：总览「最近命中」点进对应得分点并展开命中列表
  useEffect(() => {
    const p = props.params
    if (p === null || p === undefined || p.pointId === undefined) return
    setOpenId(p.pointId as string | number)
  }, [props.params])

  // builtin 要一路带到表单：内置得分点的分值/名称/口径由《得分规则》锁定，输入框置灰
  const startEdit = (p: AnyRec): void => {
    setForm({
      id: p.id, name: p.name, category: p.category || '', points: p.points,
      description: p.description || '', enabled: p.enabled, builtin: p.builtin === true,
      src: p.src, cap: p.cap, rule: p.rule,
    })
  }
  const startNew = (): void => {
    setForm({ name: '', category: '', points: 10, description: '', enabled: true, builtin: false })
    setMsg(null)
  }
  const setField = (k: string, v: unknown): void => { setForm(f => (f === null ? f : { ...f, [k]: v })) }

  const save = (): void => {
    if (form === null || form.name === '') { setMsg({ err: t('rt.s.nameRequired') }); return }
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('saveScorePoint', { engagement: eng, point: form }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      // overridden === false 表示后端没有采纳提交的分值（内置点由规则锁定）
      if (r.data.overridden === false) {
        setMsg({ err: t('rt.s.builtinLocked') })
      } else {
        setMsg({ ok: (r.data.note as string) || t('rt.saved') })
      }
      setForm(null)
      load()
    })
  }
  const remove = (): void => {
    if (form === null || form.id === undefined) { setForm(null); return }
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('deleteScorePoint', { engagement: eng, id: form.id }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      setMsg({ ok: t('rt.deleted') })
      setForm(null)
      setOpenId(null)
      load()
    })
  }

  const summary: AnyRec = (data !== null && data.summary) || { achievedPoints: 0, pointCount: 0, hitPointCount: 0, hitCount: 0, selfCreatedHits: 0, serviceCappedHits: 0, countedHits: 0 }
  const items: AnyRec[] = (data !== null && data.items) || []

  const groups: AnyRec[] = data !== null && Array.isArray(data.ruleGroups) && data.ruleGroups.length > 0
    ? data.ruleGroups
    : [{ key: 'all', name: '', capSum: 0, points: 0, counted: 0, tiers: items }]
  const rows: Array<ReturnType<typeof h>> = []
  for (const g of groups) {
    if (g.name) {
      rows.push(h('div', { key: 'g-' + g.key, class: 'dshp-rt-score-group' },
        h('span', null, g.name),
        h('span', { class: 'dshp-rt-sg-sub' },
          t('rt.s.groupItems', { n: (g.tiers ?? []).length })
          + (g.capSum > 0 ? t('rt.s.groupCap', { n: g.capSum }) : '')),
        h('div', { class: 'dshp-rt-spacer' }),
        g.points > 0 ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-active' }, '+' + g.points) : null))
    }
    for (const p of (g.tiers ?? []) as AnyRec[]) {
      const achieved = (p.hits ?? []).length > 0
      const open = openId === p.id
      rows.push(h('div', {
        key: 'sp' + p.id, class: 'dshp-rt-score-row', role: 'button', tabIndex: 0,
        onClick: () => { setOpenId(open ? null : p.id) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(open ? null : p.id) }
        },
      },
        h('span', { class: 'dshp-rt-sec-caret' }, open ? '▾' : '▸'),
        h('span', null, h('span', {
          class: achieved ? 'dshp-rt-pri dshp-rt-pri-high' : 'dshp-rt-pri dshp-rt-pri-low',
          style: achieved ? {} : { background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-secondary)' },
        }, t('rt.s.pointsN', { n: p.points }))),
        h('span', { title: p.description || '' },
          p.name,
          p.tier ? h('span', { class: 'dshp-rt-scope' }, '　' + p.tier) : null),
        h('span', {
          title: p.capped > 0
            ? t('rt.s.cappedTip', { counted: p.counted, capped: p.capped, scope: p.scope_label || t('rt.s.scopeLabel') })
            : (p.scope_label || ''),
        },
          h('span', { class: 'dshp-rt-sec-count' }, (p.hits ?? []).length > 0 ? t('rt.s.nHits', { n: p.counted }) : t('rt.s.noHit')),
          p.cap > 0
            ? h('span', { class: 'dshp-rt-scope' }, '　' + t('rt.s.cap', { used: p.cap_used === null ? 0 : p.cap_used, cap: p.cap }))
            : null),
        h('span', { style: { textAlign: 'right' } }, p.earned > 0
          ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-active' }, '+' + p.earned)
          : h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } }, '—'))))
      if (!open) continue
      // 命中记录：一行一条（序号 + 资产 + 时间 + 复制），内容另起一行自适应换行
      const hitNodes = ((p.hits ?? []) as AnyRec[]).map((hh, hi) => h('div', {
        key: 'h' + hh.id,
        class: 'dshp-rt-hit-row' + (hh.self_created ? ' self-created' : '') + (hh.capped ? ' service-capped' : ''),
      },
        h('span', { class: 'dshp-rt-hit-idx' }, String(hi + 1)),
        h('span', { class: 'dshp-rt-hit-asset', title: hh.target || hh.asset_ip || '' },
          hh.asset_ip || hh.target || t('rt.s.noAsset')),
        hh.self_created
          ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn', title: t('rt.s.selfCreatedTip') }, t('rt.s.selfCreated'))
          : null,
        hh.capped
          ? h('span', {
              class: 'dshp-rt-tag dshp-rt-tag-warn',
              title: hh.capped_reason || t('rt.c.cappedDefault'),
            }, t('rt.s.serviceCapped') + (hh.service ? '（' + hh.service + '）' : ''))
          : null,
        hh.shot_count
          ? h('span', { class: 'dshp-rt-tag', title: t('rt.s.shotCountTip') }, t('rt.s.shotN', { n: hh.shot_count }))
          : null,
        h('span', { class: 'dshp-rt-hit-time' }, fmt(hh.recorded_at)),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', style: { padding: '0 5px', fontSize: 10.5 },
          title: t('rt.copyThis'),
          onClick: (e: { stopPropagation: () => void }) => {
            e.stopPropagation()
            void copyText((hh.asset_ip || hh.target || '') + '  ' + (hh.evidence || ''))
          },
        }, t('rt.copy')),
        hh.evidence
          ? h('span', { class: 'dshp-rt-hit-txt', title: hh.evidence }, String(hh.evidence).replace(/\n+/g, ' '))
          : h('span', { class: 'dshp-rt-hit-txt none' }, t('rt.s.noEvidence'))))
      rows.push(h('div', {
        key: 'spd' + p.id, class: 'dshp-rt-score-row',
        style: { cursor: 'default', gridTemplateColumns: '1fr' },
      }, h('div', { class: 'dshp-rt-score-detail' },
        p.description ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.s.condition')), h('span', null, p.description)) : null,
        h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.s.status')),
          h('span', null, t('rt.s.statusLine', {
            enabled: p.enabled ? t('rt.s.enabled') : t('rt.s.disabled'),
            pts: p.points, n: (p.hits ?? []).length, earned: p.earned,
            self: p.self_created ? t('rt.s.selfExtra', { n: p.self_created }) : '',
            capped: p.capped ? t('rt.s.cappedExtra', { n: p.capped }) : '',
          }))),
        p.capped
          ? h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.s.serviceCap')),
              h('span', null, (p.service_summary || '') + t('rt.s.serviceCapRule')))
          : null,
        (p.hits ?? []).length > 0
          ? h('div', null,
              h(ShotStrip, {
                t, eng: eng ?? '', shots: p.shots, total: p.shot_total,
                title: t('rt.s.shotsTitle', { n: p.shot_total || ((p.shots ?? []) as AnyRec[]).length }),
              }),
              h('div', { class: 'dshp-rt-section', style: { padding: '6px 0 0' } },
                t('rt.s.hitRecords', { n: (p.hits ?? []).length })),
              h('div', { class: 'dshp-rt-hits' }, hitNodes))
          : h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.s.hitRecords')),
              h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } }, t('rt.s.hitRecordsEmpty'))),
        h('div', { class: 'dshp-rt-actions' },
          h('button', {
            class: 'dshp-rt-btn', type: 'button',
            onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); startEdit(p) },
          }, t('rt.edit'))))))
    }
  }

  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.tab.scores')),
      h('span', { style: { fontSize: 13, color: 'var(--dsw-alias-label-secondary)', marginLeft: 4 } }, t('rt.s.total')),
      h('span', { class: 'dshp-rt-total' }, String(summary.achievedPoints)),
      h('span', { style: { fontSize: 13, color: 'var(--dsw-alias-label-secondary)' } }, t('rt.s.ptsUnit')),
      h('span', { class: 'dshp-rt-tag' }, t('rt.s.nPoints', { n: summary.pointCount })),
      h('span', { class: 'dshp-rt-tag' }, t('rt.s.nHitCount', { n: summary.countedHits })),
      summary.selfCreatedHits
        ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn', title: t('rt.s.selfCreatedTip') }, t('rt.s.selfNotCounted', { n: summary.selfCreatedHits }))
        : null,
      summary.serviceCappedHits
        ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn', title: t('rt.s.serviceCappedTip') }, t('rt.s.serviceNotCounted', { n: summary.serviceCappedHits }))
        : null,
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', { class: 'dshp-rt-btn', type: 'button', onClick: startNew }, t('rt.s.newPoint')),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: load }, busy ? t('rt.refreshing') : t('rt.refresh'))),
    msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
    err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
    form !== null
      ? h('div', { class: 'dshp-rt-pane', style: { flex: 'none', borderBottom: '1px solid var(--dsw-alias-border-l1)' } },
          form.builtin === true
            ? h('div', { class: 'dshp-rt-hint', style: { marginBottom: 8 } },
                h('b', null, t('rt.s.builtinTitle')),
                h('div', { style: { marginTop: 3 } }, t('rt.s.builtinHint')),
                form.src !== null && form.src !== undefined
                  ? h('div', {
                      style: { marginTop: 3, color: 'var(--dsw-alias-label-secondary)' },
                    }, t('rt.s.builtinSrc', {
                      src: form.src,
                      rule: form.rule || '',
                      cap: form.cap > 0 ? t('rt.s.builtinCap', { n: form.cap }) : t('rt.s.builtinNoCap'),
                    }))
                  : null)
            : null,
          h('div', { class: 'dshp-rt-score-form' },
            h('input', {
              class: 'dshp-rt-input', placeholder: t('rt.s.fName'), value: form.name,
              readonly: form.builtin === true,
              title: form.builtin ? t('rt.s.builtinNameLocked') : '',
              onChange: (e: { target: { value: string } }) => { setField('name', e.target.value) },
            }),
            h('input', {
              class: 'dshp-rt-input', placeholder: t('rt.s.fCategory'), value: form.category,
              readonly: form.builtin === true,
              title: form.builtin ? t('rt.s.builtinCatLocked') : '',
              onChange: (e: { target: { value: string } }) => { setField('category', e.target.value) },
            }),
            h('input', {
              class: 'dshp-rt-input', type: 'number', placeholder: t('rt.s.fPoints'),
              readonly: form.builtin === true,
              title: form.builtin ? t('rt.s.builtinPointsLocked') : t('rt.s.fPointsTip'),
              value: form.points,
              onChange: (e: { target: { value: string } }) => { setField('points', Number(e.target.value)) },
            }),
            h('select', {
              class: 'dshp-rt-input', value: form.enabled ? '1' : '0',
              onChange: (e: { target: { value: string } }) => { setField('enabled', e.target.value === '1') },
            },
              h('option', { value: '1' }, t('rt.s.enabled')),
              h('option', { value: '0' }, t('rt.s.disabled')))),
          h('input', {
            class: 'dshp-rt-input', style: { width: '100%', marginBottom: 6, boxSizing: 'border-box' },
            placeholder: t('rt.s.fDesc'), value: form.description,
            readonly: form.builtin === true,
            title: form.builtin ? t('rt.s.builtinDescLocked') : '',
            onChange: (e: { target: { value: string } }) => { setField('description', e.target.value) },
          }),
          h('div', { class: 'dshp-rt-actions' },
            h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy, onClick: save }, t('rt.save')),
            form.id !== undefined
              ? (form.builtin
                  ? h('button', {
                      class: 'dshp-rt-btn', type: 'button', disabled: true,
                      title: t('rt.s.builtinNoDelete'),
                    }, t('rt.s.deleteBuiltin'))
                  : h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: remove }, t('rt.delete')))
              : null,
            h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { setForm(null) } }, t('rt.cancel'))))
      : null,
    h('div', { class: 'dshp-rt-table' },
      h('div', { class: 'dshp-rt-score-row head' },
        h('span', null, ''), h('span', null, t('rt.s.hPoints')), h('span', null, t('rt.s.hName')),
        h('span', null, t('rt.s.hHits')), h('span', { style: { textAlign: 'right' } }, t('rt.s.hEarned'))),
      rows,
      items.length === 0 ? h('div', { class: 'dshp-rt-empty' }, t('rt.s.empty')) : null))
}
