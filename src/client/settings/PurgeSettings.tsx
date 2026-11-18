/**
 * settings.section（id: dsh-purge）的设置页主体。
 *
 * 四个内嵌子页（顶部页签切换）：
 *   1. 人格：override 读 / 写 / 恢复默认（GET/POST /dsh-purge/override）；
 *   2. 规则集：列表 / 新建 / 编辑 / 激活 / 删除 / 还原出厂 + 工作区策略三档（/dsh-purge/rules）；
 *   3. 技能：列表 / 新建 / 删除 / 导入 base64 zip（/dsh-purge/skills）；
 *   4. 更新通道：当前版本 / 检查更新 / stable-beta 双通道切换（/dsh-purge/update）。
 */
import { useCallback, useEffect, useState } from 'react'
import { h, type NoticeSource, Loading, ErrorLine, EmptyHint } from '../shared/ui.ts'
import {
  apiGet, checkUpdate, fetchOverride, fetchStatus, rulesOp, saveOverride, skillsOp, updateOp,
  type OverridePayload, type RuleReadPayload, type RulesStatusPayload, type SkillsImportPayload,
  type SkillsStatusPayload, type StatusPayload, type UpdateCheckPayload,
} from '../shared/api.ts'
import type { Translate } from '../panel/RewindSafe.ts'

export interface PurgeSettingsProps {
  t: Translate
  /** 全局通知源（shell.overlay Toast）。 */
  notices: NoticeSource
  /** settings.section 的 owner props（本页暂未用到，保留契约）。 */
  close?: () => void
}

/** 子页标识。 */
type Tab = 'persona' | 'rules' | 'skills' | 'update'

export function PurgeSettings(props: PurgeSettingsProps): ReturnType<typeof h> {
  const [tab, setTab] = useState<Tab>('persona')
  const t = props.t
  const tabs: Array<[Tab, string]> = [
    ['persona', t('settings.persona')],
    ['rules', t('settings.rules')],
    ['skills', t('settings.skills')],
    ['update', t('settings.update')],
  ]
  return h('div', { class: 'dshp-root' },
    h('div', { class: 'dshp-tabs' },
      tabs.map(([key, label]) => h('button', {
        key, type: 'button',
        class: `dshp-tab${tab === key ? ' dshp-tab-active' : ''}`,
        onClick: () => { setTab(key) },
      }, label))),
    tab === 'persona' ? h(PersonaEditor, { t, notices: props.notices }) : null,
    tab === 'rules' ? h(RulesManager, { t, notices: props.notices }) : null,
    tab === 'skills' ? h(SkillsManager, { t, notices: props.notices }) : null,
    tab === 'update' ? h(UpdateChannel, { t, notices: props.notices }) : null,
  )
}

// ============ 1. 人格（override） ============

function PersonaEditor(props: { t: Translate; notices: NoticeSource }): ReturnType<typeof h> {
  const t = props.t
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading')
  const [error, setError] = useState('')
  const [meta, setMeta] = useState<OverridePayload | null>(null)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setPhase('loading')
    void fetchOverride().then((result) => {
      if (result.ok) { setMeta(result.data); setContent(result.data.content); setPhase('ready') }
      else { setError(result.error); setPhase('error') }
    })
  }, [])
  useEffect(() => { load() }, [load])

  const persist = useCallback((next: string, doneText: string) => {
    if (saving) return
    setSaving(true)
    void saveOverride(next).then((result) => {
      setSaving(false)
      if (result.ok) {
        setMeta(result.data)
        setContent(result.data.content)
        props.notices.report(doneText, 'success')
      } else {
        props.notices.report(`${t('persona.saveFail')}：${result.error}`, 'failure')
      }
    })
  }, [saving, props.notices, t])

  if (phase === 'loading') return h(Loading, { text: t('common.loading') })
  if (phase === 'error') return h(ErrorLine, { label: t('persona.loadFail'), message: error, retryText: t('common.retry'), onRetry: load })
  const unchanged = meta !== null && content === meta.content
  return h('div', { class: 'dshp-section' },
    h('div', { class: 'dshp-section-title' }, t('persona.title')),
    h('div', { class: 'dshp-hint' }, t('persona.hint')),
    meta === null ? null : h('div', { class: 'dshp-row' },
      h('span', { class: `dshp-tag${meta.customized ? '' : ' dshp-tag-active'}` },
        meta.customized ? t('persona.customized') : t('persona.usingDefault')),
      h('span', { class: 'dshp-hint' }, t('persona.path', { path: meta.path }))),
    h('textarea', {
      class: 'dshp-textarea',
      value: content,
      spellCheck: false,
      'aria-label': t('persona.title'),
      onChange: (event: { target: { value: string } }) => { setContent(event.target.value) },
    }),
    content.trim() === '' ? h('div', { class: 'dshp-error' }, t('persona.emptyWarn')) : null,
    h('div', { class: 'dshp-toolbar' },
      h('span', { class: 'dshp-hint' }, t('common.bytes', { n: String(content.length) })),
      h('span', { class: 'dshp-spacer' }),
      h('button', {
        class: 'dshp-btn', type: 'button',
        disabled: saving || unchanged,
        title: unchanged ? t('persona.unchanged') : undefined,
        onClick: () => { persist(content, t('common.saved')) },
      }, saving ? t('common.loading') : t('common.save')),
      h('button', {
        class: 'dshp-btn dshp-btn-danger', type: 'button',
        disabled: saving || (meta !== null && content === meta.defaultContent && meta.content === meta.defaultContent),
        onClick: () => {
          if (meta === null) return
          if (window.confirm(t('persona.resetConfirm'))) persist(meta.defaultContent, t('persona.resetDone'))
        },
      }, t('persona.reset'))),
  )
}

// ============ 2. 规则集 ============

/** 后端 lib/rules.js 的 RULE_ID_RE。 */
const RULE_ID_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/

/** 规则编辑器状态。 */
interface RuleDraft {
  id: string
  name: string
  target: string
  content: string
}

function RulesManager(props: { t: Translate; notices: NoticeSource }): ReturnType<typeof h> {
  const t = props.t
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<RulesStatusPayload | null>(null)
  const [draft, setDraft] = useState<RuleDraft | null>(null)
  const [draftSaving, setDraftSaving] = useState(false)
  const [newId, setNewId] = useState('')
  const [idError, setIdError] = useState('')
  const [policyBusy, setPolicyBusy] = useState(false)

  const load = useCallback(() => {
    setPhase('loading')
    void apiGet<RulesStatusPayload>('/dsh-purge/rules').then((result) => {
      if (result.ok) { setStatus(result.data); setPhase('ready') }
      else { setError(result.error); setPhase('error') }
    })
  }, [])
  useEffect(() => { load() }, [load])

  const refresh = useCallback(() => { void load() }, [load])

  const openRule = useCallback((id: string) => {
    void rulesOp<RuleReadPayload>('read', { id }).then((result) => {
      if (result.ok) setDraft({ id: result.data.id, name: result.data.name, target: result.data.target, content: result.data.content })
      else props.notices.report(`${result.error}`, 'failure')
    })
  }, [props.notices])

  const createRule = useCallback(() => {
    const id = newId.trim()
    if (!RULE_ID_RE.test(id)) { setIdError(t('rules.invalidId')); return }
    setIdError('')
    // 创建即写一条空规则，再进入编辑器
    void rulesOp('save', { id, content: '' }).then((result) => {
      if (result.ok) { setNewId(''); refresh(); openRule(id) }
      else props.notices.report(`${result.error}`, 'failure')
    })
  }, [newId, t, refresh, openRule, props.notices])

  const saveDraft = useCallback(() => {
    if (draft === null || draftSaving) return
    setDraftSaving(true)
    void rulesOp('save', { id: draft.id, content: draft.content, name: draft.name, target: draft.target }).then((result) => {
      setDraftSaving(false)
      if (result.ok) { props.notices.report(t('common.saved'), 'success'); refresh() }
      else props.notices.report(`${result.error}`, 'failure')
    })
  }, [draft, draftSaving, props.notices, t, refresh])

  const activate = useCallback((id: string) => {
    void rulesOp('activate', { id }).then((result) => {
      if (result.ok) { props.notices.report(t('rules.activated', { id }), 'success'); refresh() }
      else props.notices.report(`${result.error}`, 'failure')
    })
  }, [props.notices, t, refresh])

  const remove = useCallback((id: string) => {
    if (!window.confirm(t('rules.deleteConfirm', { id }))) return
    void rulesOp('delete', { id }).then((result) => {
      if (result.ok) {
        props.notices.report(t('common.saved'), 'success')
        if (draft !== null && draft.id === id) setDraft(null)
        refresh()
      } else props.notices.report(`${result.error}`, 'failure')
    })
  }, [t, props.notices, refresh, draft])

  const factoryReset = useCallback(() => {
    if (!window.confirm(t('rules.resetConfirm'))) return
    void rulesOp('reset').then((result) => {
      if (result.ok) { props.notices.report(t('rules.resetDone'), 'success'); refresh() }
      else props.notices.report(`${result.error}`, 'failure')
    })
  }, [t, props.notices, refresh])

  const setPolicy = useCallback((policy: string) => {
    if (status === null || policyBusy) return
    setPolicyBusy(true)
    void rulesOp('set-policy', { policy }).then((result) => {
      setPolicyBusy(false)
      if (result.ok) {
        props.notices.report(t('rules.policySaved', { policy }), 'success')
        setStatus({ ...status, workspace_policy: policy })
      } else props.notices.report(`${result.error}`, 'failure')
    })
  }, [status, policyBusy, props.notices, t])

  if (phase === 'loading') return h(Loading, { text: t('common.loading') })
  if (phase === 'error') return h(ErrorLine, { label: t('common.error'), message: error, retryText: t('common.retry'), onRetry: load })

  const rules = status?.rules ?? []
  const policies = status?.workspace_policies ?? ['fallback', 'strict', 'always']
  return h('div', { class: 'dshp-section' },
    h('div', { class: 'dshp-section-title' }, t('rules.title')),
    status === null ? null : h('div', { class: 'dshp-hint' }, t('rules.dir', { path: status.rules_dir })),

    // 新建
    h('div', { class: 'dshp-form' },
      h('div', { class: 'dshp-field' },
        h('span', { class: 'dshp-hint' }, t('rules.newId')),
        h('div', { class: 'dshp-row' },
          h('input', {
            class: 'dshp-input', value: newId, placeholder: 'my-rule',
            onChange: (event: { target: { value: string } }) => { setNewId(event.target.value) },
          }),
          h('button', {
            class: 'dshp-btn dshp-btn-primary', type: 'button',
            disabled: newId.trim() === '',
            onClick: createRule,
          }, t('rules.create'))),
        idError === '' ? null : h('span', { class: 'dshp-error' }, idError))),

    // 编辑器
    draft !== null ? h('div', { class: 'dshp-form' },
      h('div', { class: 'dshp-row' },
        h('strong', null, draft.id),
        h('span', { class: 'dshp-spacer' }),
        h('button', { class: 'dshp-btn dshp-btn-ghost', type: 'button', onClick: () => { setDraft(null) } }, t('common.close'))),
      h('div', { class: 'dshp-field' },
        h('span', { class: 'dshp-hint' }, t('rules.newName')),
        h('input', {
          class: 'dshp-input', value: draft.name,
          onChange: (event: { target: { value: string } }) => { setDraft({ ...draft, name: event.target.value }) },
        })),
      h('div', { class: 'dshp-field' },
        h('span', { class: 'dshp-hint' }, t('rules.target')),
        h('select', {
          class: 'dshp-select', value: draft.target,
          onChange: (event: { target: { value: string } }) => { setDraft({ ...draft, target: event.target.value }) },
        }, ['AGENTS.md', 'CLAUDE.md'].map((target) => h('option', { key: target, value: target }, target)))),
      h('div', { class: 'dshp-field' },
        h('span', { class: 'dshp-hint' }, t('rules.content')),
        h('textarea', {
          class: 'dshp-textarea', value: draft.content, spellCheck: false,
          onChange: (event: { target: { value: string } }) => { setDraft({ ...draft, content: event.target.value }) },
        })),
      h('div', { class: 'dshp-toolbar' },
        h('button', {
          class: 'dshp-btn dshp-btn-primary', type: 'button',
          disabled: draftSaving, onClick: saveDraft,
        }, draftSaving ? t('common.loading') : t('rules.save')))) : null,

    // 列表
    rules.length === 0
      ? h(EmptyHint, { text: t('rules.empty') })
      : h('div', { class: 'dshp-list' },
        rules.map((rule) => {
          const isActive = status !== null && status.active === rule.id
          return h('div', { key: rule.id, class: 'dshp-list-item' },
            h('div', { class: 'dshp-list-item-main' },
              h('div', { class: 'dshp-list-item-title' },
                h('span', { class: 'dshp-list-item-name' }, rule.name === '' ? rule.id : `${rule.name}`),
                isActive ? h('span', { class: 'dshp-tag dshp-tag-active' }, t('rules.active')) : null,
                h('span', { class: 'dshp-tag' }, rule.target)),
              h('div', { class: 'dshp-list-item-sub' }, `${rule.id} · ${rule.size} B`)),
            h('div', { class: 'dshp-list-actions' },
              isActive ? null : h('button', { class: 'dshp-btn', type: 'button', onClick: () => { activate(rule.id) } }, t('rules.activate')),
              h('button', { class: 'dshp-btn', type: 'button', onClick: () => { openRule(rule.id) } }, t('rules.edit')),
              h('button', { class: 'dshp-btn dshp-btn-danger', type: 'button', onClick: () => { remove(rule.id) } }, t('rules.delete'))))
        })),
    isActiveAndDrifted(status)
      ? h('div', { class: 'dshp-hint' }, t('rules.notSynced')) : null,

    // 工作区策略三档
    h('div', { class: 'dshp-form' },
      h('span', { class: 'dshp-hint' }, t('rules.policyTitle')),
      policies.map((policy) => h('label', { key: policy, class: 'dshp-row' },
        h('input', {
          type: 'radio', name: 'dshp-policy', value: policy,
          disabled: policyBusy,
          checked: status?.workspace_policy === policy,
          onChange: () => { setPolicy(policy) },
        }),
        h('span', null, t(`rules.policy.${policy}`))))),

    // 还原出厂
    h('div', { class: 'dshp-toolbar' },
      h('span', { class: 'dshp-spacer' }),
      h('button', { class: 'dshp-btn dshp-btn-danger', type: 'button', onClick: factoryReset }, t('rules.reset'))),
  )
}

/** 已激活规则但目标文件与内容不同步时提示（复检提示信息）。 */
function isActiveAndDrifted(status: RulesStatusPayload | null): boolean {
  return status !== null && status.active !== null && status.agents_exists && !status.agents_synced
}

// ============ 3. 技能 ============

/** 后端 lib/skills.js 的 SKILL_NAME_RE。 */
const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function SkillsManager(props: { t: Translate; notices: NoticeSource }): ReturnType<typeof h> {
  const t = props.t
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<SkillsStatusPayload | null>(null)
  const [newId, setNewId] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newContent, setNewContent] = useState('')
  const [creating, setCreating] = useState(false)
  const [idError, setIdError] = useState('')
  const [importing, setImporting] = useState(false)

  const load = useCallback(() => {
    setPhase('loading')
    void apiGet<SkillsStatusPayload>('/dsh-purge/skills').then((result) => {
      if (result.ok) { setStatus(result.data); setPhase('ready') }
      else { setError(result.error); setPhase('error') }
    })
  }, [])
  useEffect(() => { load() }, [load])
  const refresh = useCallback(() => { void load() }, [load])

  const create = useCallback(() => {
    const id = newId.trim()
    if (!SKILL_NAME_RE.test(id)) { setIdError(t('skills.invalidId')); return }
    setIdError('')
    if (creating) return
    setCreating(true)
    void skillsOp('save', { id, content: newContent, description: newDesc }).then((result) => {
      setCreating(false)
      if (result.ok) {
        props.notices.report(t('common.saved'), 'success')
        setNewId(''); setNewDesc(''); setNewContent('')
        refresh()
      } else props.notices.report(`${result.error}`, 'failure')
    })
  }, [newId, newDesc, newContent, creating, t, props.notices, refresh])

  const remove = useCallback((id: string) => {
    if (!window.confirm(t('skills.deleteConfirm', { id }))) return
    void skillsOp('delete', { id }).then((result) => {
      if (result.ok) { props.notices.report(t('common.saved'), 'success'); refresh() }
      else props.notices.report(`${result.error}`, 'failure')
    })
  }, [t, props.notices, refresh])

  // 导入：FileReader 读 zip 为 base64，POST op:import {data, name}
  const importArchive = useCallback((file: File) => {
    if (importing) return
    setImporting(true)
    const reader = new FileReader()
    reader.onerror = () => {
      setImporting(false)
      props.notices.report(`${t('skills.importFail')}：read error`, 'failure')
    }
    reader.onload = () => {
      // ArrayBuffer → base64（大文件分块转换，zip 上限 12MB）
      const bytes = new Uint8Array(reader.result as ArrayBuffer)
      let binary = ''
      const CHUNK = 0x8000
      for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
      }
      const data = btoa(binary)
      void skillsOp<SkillsImportPayload>('import', { data, name: file.name }).then((result) => {
        setImporting(false)
        if (result.ok) {
          props.notices.report(t('skills.imported', { n: String(result.data.imported.length) }), 'success')
          refresh()
        } else props.notices.report(`${t('skills.importFail')}：${result.error}`, 'failure')
      })
    }
    reader.readAsArrayBuffer(file)
  }, [importing, props.notices, t, refresh])

  if (phase === 'loading') return h(Loading, { text: t('common.loading') })
  if (phase === 'error') return h(ErrorLine, { label: t('skills.loadFail'), message: error, retryText: t('common.retry'), onRetry: load })

  const skills = status?.skills ?? []
  return h('div', { class: 'dshp-section' },
    h('div', { class: 'dshp-section-title' }, t('skills.title')),
    status === null ? null : h('div', { class: 'dshp-hint' }, t('skills.dir', { path: status.skills_dir })),

    // 导入 zip（base64 上传）
    h('div', { class: 'dshp-form' },
      h('span', { class: 'dshp-hint' }, t('skills.importTitle')),
      h('label', { class: 'dshp-row' },
        h('input', {
          class: 'dshp-input', type: 'file', accept: '.zip',
          disabled: importing,
          onChange: (event: { target: { files: FileList | null } }) => {
            const file = event.target.files !== null ? event.target.files[0] : undefined
            if (file !== undefined) importArchive(file)
            // 允许连续导入同一个文件
            (event.target as HTMLInputElement).value = ''
          },
        }),
        importing ? h('span', { class: 'dshp-hint' }, t('skills.importing')) : null)),

    // 新建技能
    h('div', { class: 'dshp-form' },
      h('div', { class: 'dshp-field' },
        h('span', { class: 'dshp-hint' }, t('skills.newId')),
        h('input', {
          class: 'dshp-input', value: newId, placeholder: 'web-recon',
          onChange: (event: { target: { value: string } }) => { setNewId(event.target.value) },
        }),
        idError === '' ? null : h('span', { class: 'dshp-error' }, idError)),
      h('div', { class: 'dshp-field' },
        h('span', { class: 'dshp-hint' }, t('skills.newDesc')),
        h('input', {
          class: 'dshp-input', value: newDesc,
          onChange: (event: { target: { value: string } }) => { setNewDesc(event.target.value) },
        })),
      h('div', { class: 'dshp-field' },
        h('span', { class: 'dshp-hint' }, t('skills.content')),
        h('textarea', {
          class: 'dshp-textarea', value: newContent, spellCheck: false,
          onChange: (event: { target: { value: string } }) => { setNewContent(event.target.value) },
        })),
      h('div', { class: 'dshp-toolbar' },
        h('button', {
          class: 'dshp-btn dshp-btn-primary', type: 'button',
          disabled: creating || newId.trim() === '' || newContent.trim() === '',
          onClick: create,
        }, creating ? t('common.loading') : t('skills.create')))),

    // 列表
    skills.length === 0
      ? h(EmptyHint, { text: t('skills.empty') })
      : h('div', { class: 'dshp-list' },
        skills.map((skill) => h('div', { key: skill.id, class: 'dshp-list-item' },
          h('div', { class: 'dshp-list-item-main' },
            h('div', { class: 'dshp-list-item-title' },
              h('span', { class: 'dshp-list-item-name' }, skill.id),
              skill.valid ? null : h('span', { class: 'dshp-tag dshp-tag-error' }, t('skills.invalid')),
              h('span', { class: 'dshp-tag' }, skill.kind)),
            h('div', { class: 'dshp-list-item-sub' },
              (skill.description === '' ? skill.path : `${skill.description} · ${skill.size} B`))),
          h('div', { class: 'dshp-list-actions' },
            h('button', {
              class: 'dshp-btn dshp-btn-danger', type: 'button',
              onClick: () => { remove(skill.id) },
            }, t('common.delete')))))),
  )
}

// ============ 4. 更新通道 ============

function UpdateChannel(props: { t: Translate; notices: NoticeSource }): ReturnType<typeof h> {
  const t = props.t
  const [statusPhase, setStatusPhase] = useState<'loading' | 'error' | 'ready'>('loading')
  const [status, setStatus] = useState<StatusPayload | null>(null)
  const [check, setCheck] = useState<UpdateCheckPayload | null>(null)
  const [busy, setBusy] = useState<'check' | 'switch' | null>(null)
  const [error, setError] = useState('')

  // 只为拿当前版本与最近一次更新信息；失败不阻塞整个子页
  useEffect(() => {
    void fetchStatus().then((result) => {
      if (result.ok) { setStatus(result.data); setStatusPhase('ready') }
      else { setError(result.error); setStatusPhase('error') }
    })
  }, [])

  const runCheck = useCallback(() => {
    if (busy !== null) return
    setBusy('check')
    void checkUpdate().then((result) => {
      setBusy(null)
      if (result.ok) {
        setCheck(result.data)
        if (result.data.error !== '') props.notices.report(result.data.error, 'failure')
      } else props.notices.report(`${t('update.error')}：${result.error}`, 'failure')
    })
  }, [busy, props.notices, t])

  const switchChannel = useCallback((channel: 'stable' | 'beta') => {
    if (busy !== null) return
    const label = channel === 'stable' ? t('update.stable') : t('update.beta')
    if (!window.confirm(t('update.switchConfirm', { channel: label }))) return
    setBusy('switch')
    // op:channel 立即下载应用；180s 超时见 api.ts 超时表
    void updateOp({ op: 'channel', channel, apply: true }).then((result) => {
      setBusy(null)
      if (result.ok) {
        setCheck(result.data)
        props.notices.report(result.data.note ?? t('update.restartNote'), 'success')
      } else props.notices.report(`${result.error}`, 'failure')
    })
  }, [busy, t, props.notices])

  // 展示用的通道/版本信息：优先最新一次检查，其次 status 里的上次结果
  const info: UpdateCheckPayload | null = check ?? status?.update ?? null
  const channelLabel = info === null
    ? '—'
    : info.channel === 'beta' ? t('update.beta') : t('update.stable')

  return h('div', { class: 'dshp-section' },
    h('div', { class: 'dshp-section-title' }, t('update.title')),
    statusPhase === 'loading' ? h(Loading, { text: t('common.loading') }) : null,
    statusPhase === 'error' ? h(ErrorLine, { label: t('update.error'), message: error, retryText: t('common.retry') }) : null,
    status === null ? null : h('div', { class: 'dshp-row' },
      h('span', { class: 'dshp-row-value' }, t('update.current', { version: status.plugin_version }))),
    info === null ? null : h('div', { class: 'dshp-row' },
      h('span', { class: 'dshp-row-value' },
        t('update.channel', { channel: channelLabel }),
        info.localSha === '' ? '' : ` · ${t('update.localSha', { sha: info.localSha })}`)),
    info !== null && info.hasUpdate
      ? h('div', { class: 'dshp-row' }, h('span', { class: 'dshp-row-value' },
        t('update.hasUpdate', { version: info.remoteVersion, current: info.localVersion })))
      : null,
    info !== null && !info.hasUpdate && info.error === '' && busy === null
      ? h('div', { class: 'dshp-hint' }, t('update.noUpdate', { version: info.localVersion }))
      : null,
    info !== null && info.error !== '' ? h('div', { class: 'dshp-hint' }, info.error) : null,
    h('div', { class: 'dshp-toolbar' },
      h('button', {
        class: 'dshp-btn', type: 'button',
        disabled: busy !== null, onClick: runCheck,
      }, busy === 'check' ? t('update.checking') : t('update.check')),
      h('button', {
        class: 'dshp-btn', type: 'button',
        disabled: busy !== null || info?.channel === 'stable',
        onClick: () => { switchChannel('stable') },
      }, busy === 'switch' ? t('update.switching') : t('update.switchTo', { channel: t('update.stable') })),
      h('button', {
        class: 'dshp-btn', type: 'button',
        disabled: busy !== null || info?.channel === 'beta',
        onClick: () => { switchChannel('beta') },
      }, busy === 'switch' ? t('update.switching') : t('update.switchTo', { channel: t('update.beta') })),
    ),
  )
}
