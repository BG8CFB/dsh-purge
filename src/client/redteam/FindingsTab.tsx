/**
 * 漏洞战果页签：子页签（漏洞 / 攻击文件 / 凭据 / 访问会话）。
 * 自旧 client.js FindingsTab / AttackFilesTab / detailEvidence 迁移；
 * 新增深链：漏洞详情 → jump('assets', { ip })。
 * 凭据面板保留「明文直显」行为（secret_value 直接展示 + 复制）。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import {
  clickable, copyText, fileKindLabel, fmt, HttpBlock, Section, SevTag, useCollapse, vulnStatusLabel,
  type RtTabProps, type Translate,
} from './bits.tsx'

type AnyRec = Record<string, any>

/** 目标归并：按「scheme://host:port」聚合，避免带路径的 URL 把分组打散。 */
function targetKeyOf(v: AnyRec): string {
  const t = String(v.target || '').trim()
  if (t !== '') {
    const url = /^([a-z][a-z0-9+.-]*:\/\/[^/?#\s]+)/i.exec(t)
    if (url !== null) return url[1]
    const head = /^([^\s/?#]+)/.exec(t)
    if (head !== null) return head[1]
    return t
  }
  return v.asset_ip || '(no target)'
}

export function FindingsTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [sev, setSev] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [qApplied, setQApplied] = useState('')
  const [state, setState] = useState<{ loading: boolean; error: string | null; total: number; items: AnyRec[]; stats: AnyRec | null }>({ loading: false, error: null, total: 0, items: [], stats: null })
  const [creds, setCreds] = useState<AnyRec[]>([])
  const [accesses, setAccesses] = useState<AnyRec[]>([])
  const [files, setFiles] = useState<AnyRec[]>([])
  const [openId, setOpenId] = useState<string | number | null>(null)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)
  const [subTab, setSubTab] = useState<'vulns' | 'files' | 'creds' | 'access'>('vulns')
  // 默认按目标聚合：平铺没法读，先看「哪台被打下什么」
  const [grouped, setGrouped] = useState(true)
  const collapse = useCollapse('findings:' + String(eng))

  const load = (): void => {
    if (eng === null || eng === '') return
    void rtOp<AnyRec>('vulns', {
      engagement: eng, severity: sev || undefined,
      status: status || undefined, q: qApplied || undefined, limit: 200,
    }).then((r) => {
      if (!r.ok) {
        setState({ loading: false, error: r.error, total: 0, items: [], stats: null })
        return
      }
      setState({ loading: false, error: null, total: r.data.total ?? 0, items: r.data.items ?? [], stats: r.data.stats ?? null })
    })
    void rtOp<AnyRec>('credentials', { engagement: eng }).then((r) => { setCreds(r.ok ? (r.data.items ?? []) : []) })
    void rtOp<AnyRec>('access', { engagement: eng }).then((r) => { setAccesses(r.ok ? (r.data.items ?? []) : []) })
    void rtOp<AnyRec>('attackFiles', { engagement: eng }).then((r) => { setFiles(r.ok ? (r.data.items ?? []) : []) })
  }
  useEffect(load, [eng, sev, status, qApplied, props.refreshKey])

  const setVulnStatus = (id: string | number, next: string): void => {
    setMsg(null)
    void rtOp<AnyRec>('updateVuln', { engagement: eng, id, patch: { status: next } }).then((r) => {
      if (!r.ok) { setMsg({ err: r.error }); return }
      setMsg({ ok: t('rt.f.updatedTo', { status: vulnStatusLabel(t, next) }) })
      load()
    })
  }

  const stats: AnyRec = state.stats !== null && state.stats.bySeverity !== undefined
    ? state.stats
    : { bySeverity: {}, byStatus: {} }
  const needRestart = state.error !== null && state.error.includes('unknown op')

  const allFiles = files.flatMap((g) => ((g.files ?? []) as AnyRec[]).map((f) => ({ ...f, target: g.target })))
  const filesByVuln = new Map<number, AnyRec[]>()
  const orphanFiles: AnyRec[] = []
  for (const f of allFiles) {
    const vid = f.vuln_id === null || f.vuln_id === undefined ? null : Number(f.vuln_id)
    if (vid === null) { orphanFiles.push(f); continue }
    if (!filesByVuln.has(vid)) filesByVuln.set(vid, [])
    ;(filesByVuln.get(vid) as AnyRec[]).push(f)
  }

  // 结论行：只给结论，数字点一下就是筛选
  const concl = (key: string, label: string, value: number, active: boolean, onClick: () => void): ReturnType<typeof h> =>
    h('span', {
      ...clickable(onClick, { label: t('rt.a.filterBy', { label, n: value || 0 }), expanded: active }),
      key, class: 'dshp-rt-concl-i' + (active ? ' on' : ''), title: t('rt.a.filterHint'),
    }, h('b', null, String(value || 0)), h('span', null, label))
  const conclusion = h('div', { class: 'dshp-rt-concl' },
    concl('conf', t('rt.vulnstatus.confirmed'), (stats.byStatus ?? {}).confirmed ?? 0, status === 'confirmed', () => { setStatus(v => (v === 'confirmed' ? '' : 'confirmed')) }),
    concl('exp', t('rt.vulnstatus.exploited'), (stats.byStatus ?? {}).exploited ?? 0, status === 'exploited', () => { setStatus(v => (v === 'exploited' ? '' : 'exploited')) }),
    concl('crit', t('rt.sev.critical'), (stats.bySeverity ?? {}).critical ?? 0, sev === 'critical', () => { setSev(v => (v === 'critical' ? '' : 'critical')) }),
    concl('high', t('rt.sev.high'), (stats.bySeverity ?? {}).high ?? 0, sev === 'high', () => { setSev(v => (v === 'high' ? '' : 'high')) }),
    concl('med', t('rt.sev.medium'), (stats.bySeverity ?? {}).medium ?? 0, sev === 'medium', () => { setSev(v => (v === 'medium' ? '' : 'medium')) }),
    concl('gain', t('rt.f.gainedPerm'), stats.withGained ?? 0, false, () => {}),
    h('div', { class: 'dshp-rt-spacer' }),
    h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } },
      t('rt.f.groupedHint', { n: stats.targetGroups ?? 0 })))

  const head = h('div', { class: 'dshp-rt-vrow head' },
    h('span', null, t('rt.f.hSev')), h('span', null, t('rt.f.hVuln')), h('span', null, t('rt.f.hTarget')),
    h('span', null, t('rt.f.hGained')), h('span', null, t('rt.f.hStatus')), h('span', null, t('rt.f.hConf')))

  // 单条漏洞（行 + 展开详情），聚合视图与平铺视图共用
  const vulnRows = (v: AnyRec, compact: boolean): Array<ReturnType<typeof h>> => {
    const out: Array<ReturnType<typeof h>> = []
    const gainedList = String(v.gained || '').split(/[、,;，；]/).map((x) => x.trim()).filter(Boolean)
    const open = openId === v.id
    out.push(h('div', {
      key: 'v' + v.id, class: 'dshp-rt-vrow', role: 'button', tabIndex: 0,
      style: compact === true ? { cursor: 'pointer', gridTemplateColumns: '58px minmax(0,1fr) 104px 68px' } : { cursor: 'pointer' },
      onClick: () => { setOpenId(open ? null : v.id) },
      onKeyDown: (e: { key: string; preventDefault: () => void }) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(open ? null : v.id) }
      },
    },
      h('span', null, h(SevTag, { t, s: v.severity })),
      h('span', { title: v.title || '' }, h('span', { class: 'dshp-rt-sec-caret' }, open ? '▾' : '▸'), (v.cve ? v.cve + ' ' : '') + (v.title || '')),
      compact ? null : h('span', { class: 'dshp-rt-mono', title: v.target || '' }, v.target || v.asset_ip || '—'),
      h('span', { title: v.gained || '' },
        gainedList.length > 0
          ? h('span', {
              class: 'dshp-rt-gain',
              style: { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' },
            }, gainedList[0] + (gainedList.length > 1 ? ' +' + (gainedList.length - 1) : ''))
          : h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } }, '—')),
      h('span', null, h('span', { class: 'dshp-rt-tag' }, vulnStatusLabel(t, v.status))),
      compact ? null : h('span', null, v.confidence === null || v.confidence === undefined ? '—' : Math.round(v.confidence * 100) + '%')))
    if (openId !== v.id) return out
    out.push(h('div', {
      key: 'vd' + v.id, class: 'dshp-rt-vrow',
      style: { cursor: 'default', gridTemplateColumns: '1fr' },
    }, h('div', { class: 'dshp-rt-vdetail' },
      h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.hGained')),
        gainedList.length > 0
          ? h('span', null, gainedList.map((g, gi) => h('span', { key: 'g' + gi, class: 'dshp-rt-gain', style: { marginRight: 6 } }, g)))
          : h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } }, t('rt.f.gainedMissing'))),
      h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.hTarget')), h('span', { class: 'dshp-rt-mono', style: { wordBreak: 'break-all' } }, v.target || '—')),
      h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.asset')),
        h('span', null, (v.asset_ip || '—') + ' · ' + (v.segment_cidr || '')),
        // 深链：这条漏洞落在哪台资产，点一下去资产测绘看详情
        v.asset_ip
          ? h('button', {
              class: 'dshp-rt-btn', type: 'button', style: { marginLeft: 8, padding: '0 6px', fontSize: 11 },
              title: t('rt.f.jumpAssetTitle', { ip: v.asset_ip }),
              onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); props.jump('assets', { ip: v.asset_ip }) },
            }, t('rt.f.jumpAsset'))
          : null),
      h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.source')), h('span', null, (v.source || '—') + ' · ' + (v.found_by_agent || '—') + ' · ' + fmt(v.found_at))),
      detailEvidence(t, v),
      (() => {
        const mine = filesByVuln.get(Number(v.id)) ?? []
        return h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.attackFiles')),
          mine.length > 0
            ? h('span', null, mine.map((f, fi) => h('div', { key: 'af' + fi, style: { marginBottom: 3 } },
                '· ' + (f.kind ? '[' + f.kind + '] ' : '') + (f.name || '(?)')
                + (f.description ? ' — ' + f.description : ''),
                h('div', {
                  class: 'dshp-rt-mono',
                  style: { fontSize: 11, marginLeft: 12, color: 'var(--dsw-alias-label-secondary)', overflowWrap: 'anywhere' },
                }, f.path || ''))))
            : h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } }, t('rt.f.noAttackFiles')))
      })(),
      h('div', { class: 'dshp-rt-actions' },
        h('button', { class: 'dshp-rt-btn', type: 'button', onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setVulnStatus(v.id, 'confirmed') } }, t('rt.vulnstatus.confirmed')),
        h('button', { class: 'dshp-rt-btn', type: 'button', onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setVulnStatus(v.id, 'exploited') } }, t('rt.vulnstatus.exploited')),
        h('button', { class: 'dshp-rt-btn', type: 'button', onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setVulnStatus(v.id, 'false-positive') } }, t('rt.vulnstatus.false-positive')),
        h('button', { class: 'dshp-rt-btn', type: 'button', onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setVulnStatus(v.id, 'fixed') } }, t('rt.vulnstatus.fixed'))))))
    return out
  }

  const rows: Array<ReturnType<typeof h>> = []
  if (grouped) {
    const groups = new Map<string, AnyRec[]>()
    for (const v of state.items) {
      const key = targetKeyOf(v)
      if (!groups.has(key)) groups.set(key, [])
      ;(groups.get(key) as AnyRec[]).push(v)
    }
    const SEV_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
    const list = [...groups.entries()].map(([key, vs]) => ({
      key,
      vulns: vs,
      top: [...vs].sort((a, b) => (SEV_RANK[a.severity] ?? 9) - (SEV_RANK[b.severity] ?? 9))[0],
      gained: [...new Set(vs.flatMap((v) => String(v.gained || '').split(/[、,;，；]/).map((x) => x.trim()).filter(Boolean)))],
      exploited: vs.filter((v) => v.status === 'exploited').length,
    })).sort((a, b) => (SEV_RANK[a.top.severity] ?? 9) - (SEV_RANK[b.top.severity] ?? 9) || b.vulns.length - a.vulns.length)
    for (const g of list) {
      const key = 'target:' + g.key
      rows.push(h(Section, {
        key: 'sec:' + g.key, tone: 'target', title: g.key,
        count: t('rt.f.nVulns', { n: g.vulns.length }),
        sub: [
          t('rt.sev.' + (['critical', 'high', 'medium', 'low', 'info'].includes(g.top.severity) ? g.top.severity : 'info')),
          g.exploited > 0 ? t('rt.f.exploitedN', { n: g.exploited }) : null,
          g.top.asset_ip !== undefined && g.top.asset_ip !== null && g.top.asset_ip !== g.key ? t('rt.f.assetIs', { ip: g.top.asset_ip }) : null,
        ].filter(Boolean).join(' · '),
        right: h('span', null, g.gained.length > 0
          ? g.gained.slice(0, 2).join(' / ') + (g.gained.length > 2 ? ' +' + (g.gained.length - 2) : '')
          : t('rt.f.gainedNone')),
        open: collapse.isOpen(key, false),
        onToggle: collapse.toggle(key, false),
      }, g.vulns.map((v) => vulnRows(v, true))))
    }
    if (list.length === 0 && !state.loading && state.error === null) {
      rows.push(h('div', { key: 'none', class: 'dshp-rt-empty' }, t('rt.f.emptyVulns')))
    }
  } else {
    for (const v of state.items) rows.push(...vulnRows(v, false))
  }

  const toolbar = h('div', { class: 'dshp-rt-toolbar' },
    h('input', {
      class: 'dshp-rt-input', style: { flex: '1 1 140px' }, placeholder: t('rt.f.searchPh'),
      value: q, onChange: (e: { target: { value: string } }) => { setQ(e.target.value) },
      onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') setQApplied(q) },
    }),
    h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { setQApplied(q) } }, t('rt.a.search')),
    h('select', { class: 'dshp-rt-input', value: sev, onChange: (e: { target: { value: string } }) => { setSev(e.target.value) } },
      h('option', { value: '' }, t('rt.f.sevAny')),
      h('option', { value: 'critical' }, t('rt.sev.critical')),
      h('option', { value: 'high' }, t('rt.sev.high')),
      h('option', { value: 'medium' }, t('rt.sev.medium')),
      h('option', { value: 'low' }, t('rt.sev.low')),
      h('option', { value: 'info' }, t('rt.sev.info'))),
    h('select', { class: 'dshp-rt-input', value: status, onChange: (e: { target: { value: string } }) => { setStatus(e.target.value) } },
      h('option', { value: '' }, t('rt.f.statusAny')),
      h('option', { value: 'candidate' }, t('rt.vulnstatus.candidate')),
      h('option', { value: 'confirmed' }, t('rt.vulnstatus.confirmed')),
      h('option', { value: 'exploited' }, t('rt.vulnstatus.exploited')),
      h('option', { value: 'false-positive' }, t('rt.vulnstatus.false-positive')),
      h('option', { value: 'fixed' }, t('rt.vulnstatus.fixed'))))

  // 凭据子页签：明文直显（保留旧行为）
  const credSection = h('div', null,
    h('div', { class: 'dshp-rt-section' }, t('rt.f.credsOf', { n: creds.length }) + (creds.length > 0 ? t('rt.f.credsPlaintextNote') : '')),
    creds.length > 0
      ? h('div', { style: { padding: '4px 10px 0' } }, creds.map((c) => h('div', { key: 'c' + c.id, class: 'dshp-rt-cred' },
          h('div', { class: 'dshp-rt-cred-head' },
            h('span', { class: 'dshp-rt-cred-host' }, c.host),
            c.username ? h('span', { class: 'dshp-rt-tag' }, c.username) : null,
            h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, c.secret_type || 'password'),
            c.privilege ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-active' }, c.privilege) : null,
            h('div', { class: 'dshp-rt-spacer' }),
            h('button', {
              class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
              onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); void copyText(String(c.secret_value || '')) },
            }, t('rt.copy'))),
          c.secret_value
            ? h('div', { class: 'dshp-rt-secret', title: t('rt.f.secretSelectAll') }, c.secret_value)
            : h('div', { class: 'dshp-rt-secret-none' }, t('rt.f.secretMissing')),
          h('div', { class: 'dshp-rt-cred-meta' },
            [c.source ? t('rt.f.cSource', { v: c.source }) : null,
              c.tool ? t('rt.f.cTool', { v: c.tool }) : null,
              c.secret_ref ? t('rt.f.cEvidence', { v: c.secret_ref }) : null,
              c.found_by_agent ? 'by ' + c.found_by_agent : null,
              c.found_at ? fmt(c.found_at) : null].filter(Boolean).join(' · ')),
          c.note ? h('div', { class: 'dshp-rt-cred-meta' }, t('rt.f.cNote', { v: c.note })) : null)))
      : h('div', { class: 'dshp-rt-empty' }, t('rt.f.credsEmpty')))

  const accessSection = h('div', null,
    h('div', { class: 'dshp-rt-section' }, t('rt.f.accessOf', { n: accesses.length })),
    accesses.length > 0
      ? accesses.map((a) => h('div', {
          key: 'a' + a.id, class: 'dshp-rt-vrow',
          style: { cursor: 'default', gridTemplateColumns: '1fr 110px 80px 80px 1fr' },
        },
          h('span', { class: 'dshp-rt-mono' }, a.host),
          h('span', null, a.username || '—'),
          h('span', null, h('span', { class: 'dshp-rt-tag dshp-rt-tag-active' }, a.method || '—')),
          h('span', null, a.privilege || '—'),
          h('span', { class: 'dshp-rt-mono', title: a.session_ref || '' }, a.session_ref || '—')))
      : h('div', { class: 'dshp-rt-empty' }, t('rt.f.accessEmpty')))

  const subTabBtn = (key: 'vulns' | 'files' | 'creds' | 'access', label: string, n: number): ReturnType<typeof h> =>
    h('span', {
      ...clickable(() => { setSubTab(key) }, { label: label + '（' + n + '）', expanded: subTab === key }),
      class: 'dshp-rt-subtab' + (subTab === key ? ' on' : ''),
    }, label + ' ' + n)

  return h('div', { class: 'dshp-rt-main' }, toolbar, conclusion,
    h('div', { class: 'dshp-rt-subtabs' },
      subTabBtn('vulns', t('rt.f.subVulns'), state.total || 0),
      subTabBtn('files', t('rt.f.subFiles'), allFiles.length),
      subTabBtn('creds', t('rt.f.subCreds'), creds.length),
      subTabBtn('access', t('rt.f.subAccess'), accesses.length),
      h('div', { class: 'dshp-rt-spacer' }),
      grouped
        ? h('button', {
            class: 'dshp-rt-btn', type: 'button', title: t('rt.f.expandAllTitle'),
            onClick: () => { collapse.setAll(state.items.map((v) => 'target:' + targetKeyOf(v)), true) },
          }, t('rt.f.expandAll'))
        : null,
      grouped
        ? h('button', {
            class: 'dshp-rt-btn', type: 'button', title: t('rt.f.collapseAllTitle'),
            onClick: () => { collapse.setAll(state.items.map((v) => 'target:' + targetKeyOf(v)), false) },
          }, t('rt.f.collapseAll'))
        : null,
      h('button', {
        class: 'dshp-rt-btn' + (grouped ? ' dshp-rt-btn-primary' : ''), type: 'button',
        title: grouped ? t('rt.f.groupedTitle') : t('rt.f.flatTitle'),
        onClick: () => { setGrouped(g => !g) },
      }, grouped ? t('rt.f.grouped') : t('rt.f.flat'))),
    msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
    needRestart ? h('div', { class: 'dshp-rt-empty' }, t('rt.needRestart')) : null,
    state.error !== null && !needRestart ? h('div', { class: 'dshp-rt-err' }, state.error) : null,
    subTab === 'files'
      ? h('div', { class: 'dshp-rt-body', style: { overflow: 'auto' } },
          h('div', { class: 'dshp-rt-hint', style: { marginBottom: 8 } },
            t('rt.f.filesHint')
            + (orphanFiles.length > 0 ? t('rt.f.filesOrphan', { n: orphanFiles.length }) : '')),
          h(AttackFilesTab, { t, eng, refreshKey: props.refreshKey }))
      : subTab === 'creds'
        ? h('div', { class: 'dshp-rt-body', style: { overflow: 'auto' } }, credSection)
        : subTab === 'access'
          ? h('div', { class: 'dshp-rt-body', style: { overflow: 'auto' } }, accessSection)
          : h('div', { class: 'dshp-rt-table' }, grouped ? null : head, rows,
              !state.loading && state.items.length === 0 && state.error === null ? h('div', { class: 'dshp-rt-empty' }, t('rt.f.emptyVulns')) : null))
}

/** 漏洞详情的证据区：结构化证据文本 + 原始 HTTP 请求/响应记录。 */
function detailEvidence(t: Translate, v: AnyRec): ReturnType<typeof h> {
  const evi = String(v.evidence || '').trim()
  const looksHttp = /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|HTTP\/)/m.test(evi) || /\n[A-Za-z-]+: /.test(evi)
  const blocks: Array<ReturnType<typeof h>> = []
  if (evi !== '') {
    blocks.push(h('div', { key: 'ev', class: 'dshp-rt-evi' },
      h('div', { class: 'dshp-rt-evi-head' }, t('rt.f.evidenceSummary'),
        h('span', { class: 'dshp-rt-tag' }, looksHttp ? t('rt.f.rawHttp') : t('rt.f.plainText')),
        h('div', { class: 'dshp-rt-spacer' }),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
          onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); void copyText(evi) },
        }, t('rt.copy'))),
      looksHttp ? h(HttpBlock, { text: evi }) : h('pre', { class: 'dshp-rt-evi-body' }, evi)))
  }
  for (const e of (v.http_evidence ?? []) as AnyRec[]) {
    blocks.push(h('div', { key: 'h' + e.id, class: 'dshp-rt-evi' },
      h('div', { class: 'dshp-rt-evi-head' },
        e.label || t('rt.f.httpEvidence'),
        h('span', { class: 'dshp-rt-tag' }, (e.method || '') + ' ' + (e.status === null || e.status === undefined ? '' : e.status)),
        h('div', { class: 'dshp-rt-spacer' }),
        h('span', { style: { fontWeight: 400, color: 'var(--dsw-alias-label-secondary)' } }, fmt(e.captured_at || e.created_at))),
      e.request
        ? h('div', null,
            h('div', { class: 'dshp-rt-evi-head', style: { borderTop: 'none' } }, '▸ ' + t('rt.f.requestBurp')),
            h(HttpBlock, { text: e.request, compact: true }))
        : null,
      e.response
        ? h('div', null,
            h('div', { class: 'dshp-rt-evi-head' }, '▸ ' + t('rt.f.response')),
            h(HttpBlock, { text: e.response }))
        : null,
      e.note ? h('pre', { class: 'dshp-rt-evi-body', style: { maxHeight: 80 } }, e.note) : null))
  }
  if (blocks.length === 0) {
    blocks.push(h('div', { key: 'none', class: 'dshp-rt-kv' }, h('b', null, t('rt.f.evidenceSummary')),
      h('span', { style: { color: 'var(--dsw-alias-state-error-primary)' } }, t('rt.f.evidenceMissing'))))
  }
  return h('div', { key: 'eviwrap' }, blocks)
}

/* ---------- 攻击文件（FindingsTab 子页签） ---------- */

function AttackFilesTab(props: { t: Translate; eng: string | null; refreshKey: number }): ReturnType<typeof h> {
  const t = props.t
  const [folders, setFolders] = useState<AnyRec[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const collapse = useCollapse('files:' + String(props.eng))
  const [detail, setDetail] = useState<AnyRec | null>(null)

  const load = (): void => {
    if (props.eng === null || props.eng === '') return
    setBusy(true)
    void rtOp<AnyRec>('attackFiles', { engagement: props.eng }).then((r) => {
      setBusy(false)
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setFolders(r.data.items ?? [])
    })
  }
  useEffect(load, [props.eng, props.refreshKey])

  const openFile = (f: AnyRec): void => {
    if (detail !== null && detail.id === f.id) { setDetail(null); return }
    setDetail(null)
    void rtOp<AnyRec>('readAttackFile', { engagement: props.eng, id: f.id }).then((r) => {
      if (r.ok) setDetail(r.data)
      else setErr(r.error)
    })
  }

  const rows: Array<ReturnType<typeof h>> = []
  for (const folder of folders) {
    const fKey = 'folder:' + folder.folder
    const fileNodes: Array<ReturnType<typeof h>> = []
    for (const f of (folder.files ?? []) as AnyRec[]) {
      fileNodes.push(h('div', {
        key: 'a' + f.id, class: 'dshp-rt-vrow',
        style: { gridTemplateColumns: '18px 1.2fr 60px 1.6fr', cursor: 'pointer' },
        role: 'button', tabIndex: 0,
        onClick: () => { openFile(f) },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFile(f) }
        },
      },
        h('span', { class: 'dshp-rt-sec-caret' }, detail !== null && detail.id === f.id ? '▾' : '▸'),
        h('span', { class: 'dshp-rt-mono' }, f.name),
        h('span', null, h('span', { class: 'dshp-rt-tag dshp-rt-tag-active' }, fileKindLabel(t, f.kind))),
        h('span', { style: { fontSize: 11.5, color: 'var(--dsw-alias-label-secondary)' }, title: f.description || '' }, f.description || '—')))
      if (detail === null || detail.id !== f.id) continue
      fileNodes.push(h('div', {
        key: 'ad' + f.id, class: 'dshp-rt-vrow', style: { cursor: 'default', gridTemplateColumns: '1fr' },
      }, h('div', { class: 'dshp-rt-vdetail' },
        h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.fileEffect')), h('span', null, detail.evidence || '—')),
        h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.filePath')), h('span', { class: 'dshp-rt-mono', style: { wordBreak: 'break-all' } }, detail.path)),
        h('div', { class: 'dshp-rt-kv' }, h('b', null, t('rt.f.fileRecord')), h('span', null, fmt(detail.created_at) + (detail.created_by ? ' · ' + detail.created_by : ''))),
        h('pre', {
          class: 'dshp-rt-md',
          style: { border: '1px solid var(--dsw-alias-border-l1)', borderRadius: 6, maxHeight: '40vh', padding: '10px 12px' },
        }, detail.content || t('rt.empty')))))
    }
    rows.push(h(Section, {
      key: 'sec:' + folder.folder, tone: 'folder', title: folder.folder + '/',
      count: t('rt.f.nFiles', { n: folder.count }),
      open: collapse.isOpen(fKey, true), onToggle: collapse.toggle(fKey, true),
    }, fileNodes.length > 0 ? fileNodes : h('div', { class: 'dshp-rt-atest-meta' }, t('rt.empty'))))
  }

  const total = folders.reduce((n, f) => n + (f.count ?? 0), 0)
  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.f.subFiles')),
      h('span', { class: 'dshp-rt-tag' }, t('rt.f.filesStat', { n: folders.length, m: total })),
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: load }, busy ? t('rt.refreshing') : t('rt.refresh'))),
    err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
    h('div', { class: 'dshp-rt-table' },
      rows,
      folders.length === 0 ? h('div', { class: 'dshp-rt-empty' }, t('rt.f.filesEmpty')) : null),
    h('div', { class: 'dshp-rt-foot' }, h('span', null, t('rt.f.filesFoot'))))
}
