/**
 * 攻击得分链路复现报告页签：按阶段折叠的交付报告。
 * 自旧 client.js ReportTab 迁移：md 复制/下载、复现步骤（动作/命令/凭据/隧道/WebShell）、
 * 证据缺口展示（无请求 / 无步骤 / gaps）；新增深链：每项 → jump('chain', { hitId })。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import { groupByStage } from './ChainTab.tsx'
import {
  clickable, copyWithFeedback, fmt, roleLabel, Section, ShotStrip, useCollapse,
  type RtTabProps, type Translate,
} from './bits.tsx'

type AnyRec = Record<string, any>

const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']

export function ReportTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [data, setData] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)
  const collapse = useCollapse('report:' + String(eng))

  const load = (): void => {
    if (eng === null || eng === '') return
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('scoreReport', { engagement: eng }).then((r) => {
      if (!r.ok) { setBusy(false); setErr(r.error); return }
      // 老 host 只给平铺条目、不给阶段分组：自己按 scoreChain 分组，别让报告页误报空
      if ((r.data.stages ?? []).length === 0 && (r.data.items ?? []).length > 0) {
        void rtOp<AnyRec>('scoreChain', { engagement: eng }).then((c) => {
          setBusy(false)
          setErr(null)
          const stages = c.ok ? groupByStage(r.data.items as AnyRec[], c.data) : groupByStage(r.data.items as AnyRec[], null)
          for (const st of stages) if (st.code === 'other' && !st.name) st.name = t('rt.r.otherGroup')
          setData({ ...r.data, stages })
        })
        return
      }
      setBusy(false)
      setErr(null)
      setData(r.data)
    })
  }
  useEffect(load, [eng, props.refreshKey])

  const copy = (text: string, label: string): void => {
    void copyWithFeedback(t, text, label, (ok, message) => {
      setMsg(ok ? { ok: message } : { err: message })
    })
  }
  const download = (text: string, label: string): void => {
    try {
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'report-' + String(label || 'score').replace(/[^\w.-]/g, '_') + '.md'
      a.click()
      URL.revokeObjectURL(url)
      setMsg({ ok: t('rt.r.downloaded', { label }) })
    } catch (e) {
      setMsg({ err: t('rt.r.downloadFail', { msg: e instanceof Error ? e.message : String(e) }) })
    }
  }

  const items: AnyRec[] = (data !== null && data.items) || []
  const stages: AnyRec[] = (data !== null && data.stages) || []
  const summary: AnyRec | null = data !== null ? data.summary : null
  const mdText: string = (data !== null && data.markdown) || ''

  // 每项一条：目标 → 拿到什么 → 复现请求（可直接粘进 Yakit）→ 响应
  const card = (x: AnyRec): ReturnType<typeof h> =>
    h('div', { key: 'r' + x.id, class: 'dshp-rt-rep' },
      h('div', { class: 'dshp-rt-rep-head' },
        h('span', { class: 'dshp-rt-rep-idx' }, String(x.seq)),
        h('span', { class: 'dshp-rt-rep-name' }, x.point_name),
        h('span', { class: 'dshp-rt-flow-pts' }, '+' + x.points),
        x.nth_of_point > 1 ? h('span', { class: 'dshp-rt-tag' }, t('rt.c.nth', { n: x.nth_of_point })) : null,
        h('div', { class: 'dshp-rt-spacer' }),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
          title: t('rt.r.jumpChainTitle'),
          onClick: () => { props.jump('chain', { hitId: x.id }) },
        }, t('rt.r.jumpChain')),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
          onClick: () => { copy(((x.requests ?? []) as AnyRec[]).map((v) => v.request || '').filter(Boolean).join('\n\n'), t('rt.r.copyReqOf', { n: x.seq })) },
        }, t('rt.r.copyReq'))),
      h('div', { class: 'dshp-rt-rep-meta' },
        h('span', null, h('b', null, t('rt.f.hTarget') + ' ')), h('span', { class: 'dshp-rt-mono' }, x.target || x.asset_ip || '—')),
      x.gained ? h('div', { class: 'dshp-rt-rep-meta' }, h('b', null, t('rt.f.hGained') + ' '), h('span', null, x.gained)) : null,
      x.vuln ? h('div', { class: 'dshp-rt-rep-meta' }, h('b', null, t('rt.c.usedVuln') + ' '),
        h('span', null, [x.vuln.cve, x.vuln.title].filter(Boolean).join(' '))) : null,
      x.evidence ? h('div', { class: 'dshp-rt-rep-meta' }, h('b', null, t('rt.c.resultShort') + ' '),
        h('span', null, String(x.evidence).replace(/\n+/g, ' '))) : null,
      x.recorded_at
        ? h('div', { class: 'dshp-rt-rep-meta' }, h('b', null, t('rt.r.gotAt') + ' '),
          h('span', null, fmt(x.recorded_at) + (x.recorded_by ? '（' + roleLabel(t, x.recorded_by) + '）' : '')))
        : null,
      h(ShotStrip, { t, eng: eng ?? '', shots: x.shots, total: x.shot_total, title: t('rt.shot.title') }),
      // 复现步骤：动作记录（含实际命令与回显）+ 凭据 + 隧道 + WebShell
      h('details', { class: 'dshp-rt-rep-trace', open: x.incomplete === true || (x.steps ?? []).length === 0 },
        h('summary', { class: 'dshp-rt-rep-trace-head', style: { cursor: 'pointer' } },
          h('span', { class: 'dshp-rt-rep-trace-title' }, t('rt.r.traceTitle')),
          (x.steps ?? []).length ? h('span', { class: 'dshp-rt-tag' }, t('rt.r.nSteps', { n: (x.steps ?? []).length })) : null,
          (x.credentials ?? []).length ? h('span', { class: 'dshp-rt-tag' }, t('rt.r.nCreds', { n: (x.credentials ?? []).length })) : null,
          (x.tunnels ?? []).length ? h('span', { class: 'dshp-rt-tag' }, t('rt.r.nTunnels', { n: (x.tunnels ?? []).length })) : null,
          x.incomplete
            ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.r.incomplete'))
            : h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.r.reproducible'))),
        h('div', { style: { paddingTop: 6 } },
          x.how ? h('div', { class: 'dshp-rt-rep-trace-how' }, x.how) : null,
          (x.steps ?? []).length === 0
            ? h('div', { class: 'dshp-rt-rep-missing' }, t('rt.r.noSteps'))
            : (x.steps as AnyRec[]).map((s, si) => h('div', { key: 's' + s.id, class: 'dshp-rt-rep-step' },
                h('div', { class: 'dshp-rt-rep-step-head' },
                  h('span', { class: 'dshp-rt-rep-step-no' }, String(si + 1)),
                  h('span', { class: 'dshp-rt-rep-step-title' }, s.title || t('rt.c.unnamedStep')),
                  s.agent ? h('span', { class: 'dshp-rt-tag' }, roleLabel(t, s.agent)) : null,
                  s.stage_code ? h('span', { class: 'dshp-rt-tag' }, s.stage_code) : null,
                  s.inferred ? h('span', { class: 'dshp-rt-tag' }, t('rt.r.inferred')) : null,
                  h('div', { class: 'dshp-rt-spacer' }),
                  s.recorded_at ? h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } }, fmt(s.recorded_at)) : null),
                s.detail ? h('div', { class: 'dshp-rt-rep-step-detail' }, s.detail) : null,
                h('div', { class: 'dshp-rt-rep-step-cmd' },
                  h('b', null, t('rt.r.exec') + ' '),
                  s.tool
                    ? h('span', { class: 'dshp-rt-mono' }, s.tool)
                    : h('span', { style: { color: 'var(--dsw-alias-state-warn-primary, #f59e0b)' } }, t('rt.r.noTool'))),
                s.tool
                  ? h('div', { style: { marginTop: 3 } },
                      h('button', {
                        class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
                        onClick: () => { copy(String(s.tool), t('rt.r.stepCmdOf', { n: si + 1 })) },
                      }, t('rt.r.copyCmd')))
                  : null,
                s.result ? h('div', { class: 'dshp-rt-rep-step-result' }, h('b', null, t('rt.r.result') + ' '), String(s.result).replace(/\n+/g, ' ')) : null,
                s.evidence_ref ? h('div', { class: 'dshp-rt-rep-step-result' }, h('b', null, t('rt.f.evidenceSummary') + ' '), h('span', { class: 'dshp-rt-mono' }, s.evidence_ref)) : null)),
          // 账号密码怎么来的：凭据的来源 + 取得方式
          (x.credentials ?? []).length > 0
            ? h('div', { class: 'dshp-rt-rep-src' },
                h('div', { class: 'dshp-rt-rep-src-title' }, t('rt.r.credsSrc')),
                (x.credentials as AnyRec[]).map((c) => h('div', { key: 'c' + c.id, class: 'dshp-rt-kv' },
                  h('b', { class: 'dshp-rt-mono', style: { minWidth: 120 } }, c.host || '—'),
                  h('span', null, t('rt.r.credLine', {
                    user: c.username || t('rt.r.noUser'),
                    type: c.secret_type || 'password',
                    priv: c.privilege ? t('rt.r.credPriv', { p: c.privilege }) : '',
                    src: c.source || t('rt.r.unmarked'),
                    tool: c.tool ? t('rt.r.credTool', { v: String(c.tool).replace(/\n+/g, ' ').slice(0, 160) }) : '',
                  })))))
            : null,
          // 隧道怎么搭的
          (x.tunnels ?? []).length > 0
            ? h('div', { class: 'dshp-rt-rep-src' },
                h('div', { class: 'dshp-rt-rep-src-title' }, t('rt.r.tunnelsUsed')),
                (x.tunnels as AnyRec[]).map((tn) => h('div', { key: 't' + tn.id, class: 'dshp-rt-kv' },
                  h('b', { class: 'dshp-rt-mono', style: { minWidth: 120 } }, (tn.kind || 'socks5') + ' ' + (tn.listen || '')),
                  h('span', null, t('rt.r.tunnelLine', {
                    entry: tn.entry || t('rt.r.unregistered'),
                    reach: tn.reach ? t('rt.r.tunnelReach', { v: tn.reach }) : '',
                    side: tn.entry_kind || t('rt.r.undeclared'),
                    legit: tn.legit === false ? t('rt.r.notBoundary') : '',
                    status: tn.status ? ' · ' + tn.status : '',
                    cmd: tn.command ? t('rt.r.tunnelCmd', { v: String(tn.command).replace(/\n+/g, ' ').slice(0, 160) }) : '',
                  })))))
            : null,
          (x.webshells ?? []).length > 0
            ? h('div', { class: 'dshp-rt-rep-src' },
                h('div', { class: 'dshp-rt-rep-src-title' }, t('rt.r.shellsUsed')),
                (x.webshells as AnyRec[]).map((w) => h('div', { key: 'w' + w.id, class: 'dshp-rt-kv' },
                  h('b', { class: 'dshp-rt-mono', style: { minWidth: 120 } }, w.shell_type || 'shell'),
                  h('span', null, (w.url || '') + (w.pass_key ? t('rt.r.shellPass', { v: w.pass_key }) : '')
                    + (w.privilege ? t('rt.r.credPriv', { p: w.privilege }) : '') + (w.status ? ' · ' + w.status : '')))))
            : null,
          (x.gaps ?? []).length > 0 ? h('div', { class: 'dshp-rt-rep-missing' }, t('rt.r.gaps') + x.gaps.join('；')) : null),
      (x.requests ?? []).length === 0
        ? h('div', { class: 'dshp-rt-rep-missing' }, t('rt.r.noRequest'))
        : (x.requests as AnyRec[]).map((r, ri) => h('div', { key: 'q' + ri, class: 'dshp-rt-rep-req' },
            h('div', { class: 'dshp-rt-rep-req-head' },
              h('span', null, t('rt.r.requestN', { n: ri + 1 }) + (r.source === 'auto' ? t('rt.r.requestAuto') : '')),
              h('span', { class: 'dshp-rt-tag' }, (r.method || 'GET') + ' ' + (r.status === null || r.status === undefined ? '' : r.status)),
              h('div', { class: 'dshp-rt-spacer' }),
              h('button', {
                class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
                onClick: () => { copy(String(r.request || ''), t('rt.r.requestOf', { n: ri + 1 })) },
              }, t('rt.r.copyYakit'))),
            h('pre', { class: 'dshp-rt-rep-http' }, r.request || ((r.method || 'GET') + ' ' + (r.url || '') + ' HTTP/1.1')),
            r.response
              ? h('div', null,
                  h('div', { class: 'dshp-rt-rep-req-head' }, h('span', null, t('rt.r.respSummary'))),
                  h('pre', { class: 'dshp-rt-rep-http', style: { maxHeight: 160 } }, String(r.response).slice(0, 1600)))
              : null))),
      x.note ? h('div', { class: 'dshp-rt-rep-meta' }, h('b', null, t('rt.r.note') + ' '), h('span', null, x.note)) : null)

  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.tab.report')),
      summary !== null ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.r.totalN', { n: summary.points })) : null,
      summary !== null ? h('span', { class: 'dshp-rt-tag' }, t('rt.r.countN', { n: summary.count })) : null,
      summary !== null
        ? h('span', { class: 'dshp-rt-tag' + (summary.missingRequests ? '' : ' dshp-rt-tag-live') },
            t('rt.r.withRequests', { n: summary.withRequests, m: summary.count }))
        : null,
      summary !== null
        ? h('span', {
            class: 'dshp-rt-tag' + (summary.incomplete ? ' dshp-rt-tag-warn' : ' dshp-rt-tag-live'),
            title: t('rt.r.reproTitle'),
          }, t('rt.r.reproN', { n: summary.count - (summary.incomplete || 0), m: summary.count }))
        : null,
      summary !== null && summary.serviceCappedExcluded
        ? h('span', {
            class: 'dshp-rt-tag dshp-rt-tag-warn',
            title: ((summary.serviceCapped ?? []) as AnyRec[]).map((x) => (x.service || '') + '｜' + (x.point_name || '')).join('\n')
              || t('rt.r.serviceCappedTip'),
          }, t('rt.r.serviceCappedN', { n: summary.serviceCappedExcluded }))
        : null,
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy || mdText === '', onClick: () => { copy(mdText, t('rt.r.wholeReport')) } }, t('rt.r.copyAll')),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy || mdText === '', onClick: () => { download(mdText, (data !== null && data.target) || String(eng)) } }, t('rt.r.downloadMd')),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: load }, busy ? t('rt.r.generating') : t('rt.r.regenerate'))),
    msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
    err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
    h('div', { class: 'dshp-rt-body', style: { overflow: 'auto' } },
      stages.length > 0
        ? h('div', { class: 'dshp-rt-rep-list' },
            h('div', { class: 'dshp-rt-rep-tools' },
              h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { collapse.setAll(stages.map((s) => 'st:' + s.code), true) } }, t('rt.f.expandAll')),
              h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { collapse.setAll(stages.map((s) => 'st:' + s.code), false) } }, t('rt.f.collapseAll'))),
            stages.map((st) => {
              const open = collapse.isOpen('st:' + st.code, true)
              const toggle = collapse.toggle('st:' + st.code, true)
              return h('div', { key: 'g' + st.code, class: 'dshp-rt-rep-group' },
                h('div', {
                  class: 'dshp-rt-rep-stage', role: 'button', tabIndex: 0,
                  style: { borderLeftColor: st.color },
                  'aria-expanded': open ? 'true' : 'false',
                  onClick: toggle,
                  onKeyDown: (e: { key: string; preventDefault: () => void }) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e) }
                  },
                },
                  h('span', { class: 'dshp-rt-sec-caret' }, open ? '▾' : '▸'),
                  h('span', { class: 'dshp-rt-rep-no', style: { background: st.color } }, CIRCLED[st.ordinal - 1] || st.ordinal),
                  h('span', { class: 'dshp-rt-rep-stage-name' }, st.name),
                  h('span', { class: 'dshp-rt-rep-stage-n' }, t('rt.r.nItems', { n: (st.items ?? []).length })),
                  h('div', { class: 'dshp-rt-spacer' }),
                  h('span', {
                    class: 'dshp-rt-rep-pts',
                    style: { background: st.color + '22', color: st.color, borderColor: st.color + '66' },
                  }, '+' + st.points),
                  h('span', { class: 'dshp-rt-ap-cum' }, t('rt.c.cumulative', { n: st.cumulative }))),
                open ? h('div', { class: 'dshp-rt-rep-body' }, (st.items as AnyRec[]).map(card)) : null)
            }))
        : (data === null
            ? h('div', { class: 'dshp-rt-empty' }, t('rt.loading'))
            : h('div', { class: 'dshp-rt-empty' },
                h('div', null, t('rt.r.empty')),
                h('div', { style: { marginTop: 6, fontSize: 12 } }, t('rt.r.emptyHint'))))),
    h('div', { class: 'dshp-rt-foot' },
      h('span', null, t('rt.r.footNote'))))
}
