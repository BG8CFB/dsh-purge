/**
 * 环境适配页签：纯工具配置页（op: platformConfigGet / platformConfigSave /
 * platformAssignToolkit）。自旧 client.js EnvTab 迁移；授权门 / own-servers 面板
 * 等删除项不在此页复活。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import type { RtTabProps } from './bits.tsx'

type AnyRec = Record<string, any>

export function EnvTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const [data, setData] = useState<AnyRec | null>(null)
  const [draft, setDraft] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [folderPath, setFolderPath] = useState('')

  const applyDraftFrom = (r: AnyRec | null): void => {
    const c = (r !== null && r.config) || {}
    setDraft({
      platform: c.platform || 'auto',
      toolkitDir: c.toolkitDir || '',
      nucleiTemplatesDir: c.nucleiTemplatesDir || '',
      binDirsText: (c.binDirs ?? []).join('\n'),
      tools: { ...(c.tools ?? {}) },
      env: { FOFA_KEY: '', REDTEAM_VPS_HOST: '', REDTEAM_VPS_KEY: '', ...(c.env ?? {}) },
      notes: c.notes || '',
    })
    if (c.toolkitDir) setFolderPath(c.toolkitDir)
  }

  const load = (): void => {
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('platformConfigGet').then((r) => {
      setBusy(false)
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setData(r.data)
      applyDraftFrom(r.data)
    })
  }
  useEffect(load, [props.refreshKey])

  const save = (): void => {
    if (draft === null) return
    setBusy(true)
    setMsg(null)
    const config = {
      platform: draft.platform,
      toolkitDir: draft.toolkitDir,
      nucleiTemplatesDir: draft.nucleiTemplatesDir,
      binDirs: String(draft.binDirsText || '').split(/\r?\n/).map((x: string) => x.trim()).filter(Boolean),
      tools: draft.tools,
      env: draft.env,
      notes: draft.notes,
    }
    void rtOp<AnyRec>('platformConfigSave', { config }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      setData(r.data)
      setMsg({ ok: t('rt.e.savedTo', { path: (r.data.config ?? {}).path ?? '$DSH_HOME/redteam/config.json' }) })
      applyDraftFrom(r.data)
    })
  }

  const assignFolder = (): void => {
    const dir = String(folderPath || (draft !== null ? draft.toolkitDir : '') || '').trim()
    if (dir === '') { setMsg({ err: t('rt.e.folderRequired') }); return }
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('platformAssignToolkit', { dir }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); return }
      setData(r.data)
      applyDraftFrom(r.data)
      setMsg({
        ok: t('rt.e.assigned', {
          n: r.data.assignedCount ?? 0,
          tpl: r.data.nucleiTemplatesDir ? t('rt.e.assignedTpl') : '',
        }),
      })
    })
  }

  const setTool = (id: string, value: string): void => {
    setDraft(d => (d === null ? d : { ...d, tools: { ...d.tools, [id]: value } }))
  }
  const setEnv = (key: string, value: string): void => {
    setDraft(d => (d === null ? d : { ...d, env: { ...d.env, [key]: value } }))
  }

  const runtime: AnyRec = (data !== null && data.runtime) || {}
  const adapt: AnyRec = (data !== null && data.adapt) || {}
  const tools: AnyRec[] = (data !== null && data.tools !== undefined && data.tools.items) || []
  const found = tools.filter((x) => x.path).length
  const defaultToolkit = (data !== null && data.toolkitDir) || '$DSH_HOME/redteam/toolkit'
  const defaultNuclei = (data !== null && data.nucleiTemplatesDir) || (defaultToolkit + '/nuclei-templates')

  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.tab.env')),
      h('span', { class: 'dshp-rt-tag' }, runtime.effective === 'windows' ? 'Windows' : 'Linux/Kali'),
      adapt.kali ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, 'Kali') : null,
      h('span', { class: 'dshp-rt-tag' + (adapt.ready ? ' dshp-rt-tag-live' : ' dshp-rt-tag-warn') },
        adapt.ready ? t('rt.e.ready', { reason: adapt.reason || '' }) : t('rt.e.pending')),
      h('span', { class: 'dshp-rt-tag' + (found > 0 ? ' dshp-rt-tag-live' : ' dshp-rt-tag-warn') }, t('rt.e.toolsN', { found, total: tools.length })),
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', { class: 'dshp-rt-btn', type: 'button', disabled: busy, onClick: load }, busy ? t('rt.loading') : t('rt.refresh')),
      h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy || draft === null, onClick: save }, t('rt.save'))),
    h('div', { class: 'dshp-rt-pane', style: { minHeight: 0 } },
      err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
      msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
      h('div', { class: 'dshp-rt-card', style: { margin: '0 0 8px', fontSize: 12, lineHeight: 1.6 } },
        (data !== null && data.adapt !== undefined && data.adapt.message) || t('rt.e.hintDefault')),
      h('div', { class: 'dshp-rt-card', style: { margin: '0 0 8px', fontSize: 12, lineHeight: 1.6 } },
        h('div', { style: { fontWeight: 600, marginBottom: 6 } }, t('rt.e.folderAssignTitle')),
        h('div', { style: { marginBottom: 8, opacity: 0.9 } }, t('rt.e.folderAssignHint')),
        h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
          h('input', {
            class: 'dshp-rt-input', style: { flex: 1 },
            placeholder: t('rt.e.folderPh'),
            value: folderPath,
            onChange: (e: { target: { value: string } }) => { setFolderPath(e.target.value) },
            onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') assignFolder() },
          }),
          h('button', {
            class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy,
            onClick: assignFolder,
          }, busy ? t('rt.e.scanning') : t('rt.e.assign')))),
      data !== null && data.hint !== undefined
        ? h('div', { class: 'dshp-rt-card', style: { margin: '0 0 8px', fontSize: 12, lineHeight: 1.6 } }, data.hint)
        : null,
      data !== null && data.egress !== undefined
        ? h('div', { class: 'dshp-rt-card', style: { margin: '0 0 8px', fontSize: 12, lineHeight: 1.55 } },
            h('div', { style: { fontWeight: 600, marginBottom: 6 } }, t('rt.e.egressTitle')),
            h('div', { class: 'dshp-rt-mono', style: { fontSize: 11 } }, 'HTTP_PROXY=' + (data.egress.http_proxy || t('rt.e.emptyParen'))),
            h('div', { class: 'dshp-rt-mono', style: { fontSize: 11 } }, 'HTTPS_PROXY=' + (data.egress.https_proxy || t('rt.e.emptyParen'))),
            h('div', { class: 'dshp-rt-mono', style: { fontSize: 11 } }, 'ALL_PROXY=' + (data.egress.all_proxy || t('rt.e.emptyParen'))),
            h('div', { class: 'dshp-rt-mono', style: { fontSize: 11 } }, 'NO_PROXY=' + (data.egress.no_proxy || t('rt.e.emptyParen'))),
            h('div', { style: { marginTop: 6, opacity: 0.85 } }, data.egress.note || ''))
        : null,
      draft === null
        ? h('div', { class: 'dshp-rt-empty' }, t('rt.loading'))
        : h('div', null,
            h('div', { class: 'dshp-rt-card' },
              h('h4', null, t('rt.e.platformDirTitle')),
              h('div', { style: { display: 'grid', gap: 8 } },
                h('label', { style: { fontSize: 12 } }, t('rt.e.platformMode'),
                  h('select', {
                    class: 'dshp-rt-input', style: { display: 'block', width: '100%', marginTop: 4 },
                    value: draft.platform,
                    onChange: (e: { target: { value: string } }) => { setDraft({ ...draft, platform: e.target.value }) },
                  },
                    h('option', { value: 'auto' }, t('rt.e.platformAuto')),
                    h('option', { value: 'windows' }, 'windows'),
                    h('option', { value: 'linux' }, 'linux'))),
                h('label', { style: { fontSize: 12 } }, t('rt.e.toolkitDirLabel'),
                  h('input', {
                    class: 'dshp-rt-input', style: { display: 'block', width: '100%', marginTop: 4 },
                    placeholder: t('rt.e.defaultIs', { path: defaultToolkit }),
                    value: draft.toolkitDir,
                    onChange: (e: { target: { value: string } }) => { setDraft({ ...draft, toolkitDir: e.target.value }) },
                  })),
                h('label', { style: { fontSize: 12 } }, t('rt.e.nucleiDirLabel'),
                  h('input', {
                    class: 'dshp-rt-input', style: { display: 'block', width: '100%', marginTop: 4 },
                    placeholder: t('rt.e.defaultIs', { path: defaultNuclei }),
                    value: draft.nucleiTemplatesDir,
                    onChange: (e: { target: { value: string } }) => { setDraft({ ...draft, nucleiTemplatesDir: e.target.value }) },
                  })),
                h('label', { style: { fontSize: 12 } }, t('rt.e.binDirsLabel'),
                  h('textarea', {
                    class: 'dshp-rt-input', rows: 4,
                    style: { display: 'block', width: '100%', marginTop: 4, fontFamily: 'var(--dsw-font-mono, monospace)' },
                    placeholder: t('rt.e.binDirsPh'),
                    value: draft.binDirsText,
                    onChange: (e: { target: { value: string } }) => { setDraft({ ...draft, binDirsText: e.target.value }) },
                  })))),
            h('div', { class: 'dshp-rt-card' },
              h('h4', null, t('rt.e.envTitle')),
              h('div', { style: { display: 'grid', gap: 8 } },
                ['FOFA_KEY', 'REDTEAM_VPS_HOST', 'REDTEAM_VPS_KEY'].map((k) => h('label', { key: k, style: { fontSize: 12 } }, k + t('rt.e.optional'),
                  h('input', {
                    class: 'dshp-rt-input', style: { display: 'block', width: '100%', marginTop: 4 },
                    type: k === 'FOFA_KEY' ? 'password' : 'text',
                    placeholder: k === 'REDTEAM_VPS_KEY'
                      ? t('rt.e.vpsKeyPh')
                      : (k === 'REDTEAM_VPS_HOST' ? t('rt.e.vpsHostPh') : t('rt.e.fofaPh')),
                    value: (draft.env ?? {})[k] ?? '',
                    onChange: (e: { target: { value: string } }) => { setEnv(k, e.target.value) },
                  }))))),
            h('div', { class: 'dshp-rt-card' },
              h('h4', null, t('rt.e.toolsTitle')),
              h('div', { style: { fontSize: 11.5, color: 'var(--dsw-alias-label-secondary)', marginBottom: 8 } }, t('rt.e.toolsResolveOrder')),
              tools.map((tool) => h('div', { key: tool.id, style: { marginBottom: 8 } },
                h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 } },
                  h('span', { style: { fontWeight: 600, minWidth: 88 } }, tool.label || tool.id),
                  tool.path
                    ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live', title: tool.path }, tool.source + ' · ' + t('rt.e.found'))
                    : h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.e.notFound'))),
                h('input', {
                  class: 'dshp-rt-input', style: { width: '100%' },
                  placeholder: t('rt.e.autoFindPh', { names: (tool.names ?? []).slice(0, 3).join(' / ') }),
                  value: (draft.tools ?? {})[tool.id] ?? '',
                  onChange: (e: { target: { value: string } }) => { setTool(tool.id, e.target.value) },
                }),
                tool.path
                  ? h('div', { class: 'dshp-rt-mono', style: { fontSize: 10.5, marginTop: 2, opacity: 0.8 } }, tool.path)
                  : null))),
            h('div', { class: 'dshp-rt-card' },
              h('h4', null, t('rt.e.notesTitle')),
              h('textarea', {
                class: 'dshp-rt-input', rows: 3, style: { width: '100%' },
                placeholder: t('rt.e.notesPh'),
                value: draft.notes,
                onChange: (e: { target: { value: string } }) => { setDraft({ ...draft, notes: e.target.value }) },
              })),
            h('div', { class: 'dshp-rt-foot' },
              h('span', null,
                t('rt.e.configFile', {
                  path: (data !== null && data.config !== undefined && data.config.path) || '$DSH_HOME/redteam/config.json',
                }))))))
}
