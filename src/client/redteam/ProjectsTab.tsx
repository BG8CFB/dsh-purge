/**
 * 项目中心（projects 页签）：红队演练的第一个界面。
 *
 * 业务模型：**一个项目 = 一个靶标工作区**（store 的 engagement）——
 * 每个项目一个目录 + 一个 SQLite 库（资产/端口/指纹/漏洞/凭据/攻击链/得分/截图），
 * 项目之间互不共享数据；知识库、技能库、环境适配是全局的。
 * 会话（含它派出的子智能体）通过 session-bindings.json 绑到一个项目，
 * 面板顶部的「绑定本会话」与这里显示的「绑定会话 N」是同一份关系。
 *
 * 所以页面的第一性问题不是"看某个库"，而是「我有哪些项目、每个做到哪、最近谁在动」。
 */
import { useCallback, useEffect, useState } from 'react'
import { h, Loading, ErrorLine } from '../shared/ui.ts'
import { confirmDialog } from '../shared/dialogs.tsx'
import { invalidateProjects } from '../shared/data.ts'
import { rtOp } from './api.ts'
import { copyText, fmt, type RtTabProps } from './bits.tsx'

type AnyRec = Record<string, any>

export interface ProjectsTabProps extends RtTabProps {
  /** 打开项目工作台（切当前项目 + 跳到总览）。 */
  onOpen: (id: string, name: string) => void
  /** 只切换「当前项目」指针，不进工作台。 */
  onSetCurrent: (id: string) => void
  /** 进入演练：切到项目工作区并打开红队会话。 */
  onEnter: (id: string) => Promise<boolean>
  /** 在同一工作区再开一个红队会话。 */
  onNewSession: (id: string) => Promise<boolean>
  /** 删除项目（含目录与工作区）。 */
  onDelete: (id: string, workspaceId?: string | null) => Promise<boolean>
  /** 项目集合变化后让上层刷新名册/快照。 */
  onChanged: () => void
}

type Filter = 'active' | 'archived' | 'all'

export function ProjectsTab(props: ProjectsTabProps): ReturnType<typeof h> {
  const t = props.t
  const [items, setItems] = useState<AnyRec[] | null>(null)
  const [current, setCurrent] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('active')
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState('')
  const [form, setForm] = useState({ name: '', scope: '', note: '' })

  const load = useCallback((): void => {
    void rtOp<AnyRec>('projects').then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setItems(Array.isArray(r.data.items) ? r.data.items : [])
      setCurrent(typeof r.data.current === 'string' ? r.data.current : null)
    })
  }, [])
  useEffect(() => { load() }, [load, props.refreshKey])

  const open = (id: string, name: string): void => {
    setBusy('open:' + id)
    void rtOp('activateEngagement', { engagement: id }).then((r) => {
      setBusy('')
      if (!r.ok) { props.notices.report(props.t('rt.pj.openFailed') + '：' + r.error, 'failure'); return }
      setCurrent(id)
      props.onOpen(id, name)
    })
  }

  const create = (): void => {
    const name = form.name.trim()
    if (name === '') return
    const scope = form.scope.split(/[\n,，\s]+/).map((x) => x.trim()).filter(Boolean)
    setBusy('create')
    void rtOp<AnyRec>('openEngagement', { name, scope }).then((r) => {
      setBusy('')
      if (!r.ok) { props.notices.report(props.t('rt.pj.createFailed') + '：' + r.error, 'failure'); return }
      const id = r.data.engagement !== undefined ? r.data.engagement.id : ''
      setCreating(false)
      setForm({ name: '', scope: '', note: '' })
      invalidateProjects()
      load()
      props.onChanged()
      if (typeof id === 'string' && id !== '') {
        // 新建即进入：用户刚建的项目就是他现在要做的项目
        if (form.note.trim() !== '') void rtOp('updateEngagement', { engagement: id, patch: { note: form.note.trim() } })
        open(id, name)
      }
    })
  }

  const update = (id: string, patch: AnyRec, done?: string): void => {
    setBusy('upd:' + id)
    void rtOp('updateEngagement', { engagement: id, patch }).then((r) => {
      setBusy('')
      if (!r.ok) { props.notices.report(props.t('rt.pj.updateFailed') + '：' + r.error, 'failure'); return }
      if (done !== undefined) props.notices.report(done, 'success')
      invalidateProjects()
      load()
      props.onChanged()
    })
  }

  const visible = (items ?? []).filter((p) => {
    if (filter === 'all') return true
    if (filter === 'archived') return p.status === 'archived' || p.status === 'closed'
    return p.status !== 'archived' && p.status !== 'closed'
  })

  const statusTag = (status: string): ReturnType<typeof h> => status === 'archived'
    ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, t('rt.pj.archived'))
    : status === 'closed'
      ? h('span', { class: 'dshp-rt-tag' }, t('rt.pj.closed'))
      : h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, t('rt.pj.active'))

  return h('div', { class: 'dshp-rt-main', style: { overflow: 'auto' } },
    h('div', { class: 'dshp-pj-head' },
      h('div', { class: 'dshp-pj-titlebox' },
        h('div', { class: 'dshp-pj-title' }, t('rt.pj.title')),
        h('div', { class: 'dshp-pj-sub' }, t('rt.pj.subtitle'))),
      h('div', { class: 'dshp-rt-spacer' }),
      h('div', { class: 'dshp-rt-subtabs', style: { borderBottom: 'none', padding: 0 } },
        (['active', 'archived', 'all'] as Filter[]).map((f) => h('button', {
          key: f, type: 'button',
          class: 'dshp-rt-subtab' + (filter === f ? ' on' : ''),
          onClick: () => { setFilter(f) },
        }, t('rt.pj.filter.' + f)))),
      h('button', {
        class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
        onClick: () => { setCreating((v) => !v) },
      }, t('rt.pj.new'))),

    creating
      ? h('div', { class: 'dshp-rt-card dshp-pj-create' },
          h('div', { class: 'dshp-rt-ov-title' }, t('rt.pj.new')),
          h('div', { class: 'dshp-pj-field' },
            h('div', { class: 'dshp-pj-label' }, t('rt.pj.name')),
            h('input', {
              class: 'dshp-rt-input', placeholder: t('rt.pj.namePh'), value: form.name,
              onChange: (e: { target: { value: string } }) => { setForm((s) => ({ ...s, name: e.target.value })) },
              onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') create() },
            })),
          h('div', { class: 'dshp-pj-field' },
            h('div', { class: 'dshp-pj-label' }, t('rt.pj.scope')),
            h('textarea', {
              class: 'dshp-rt-textarea', style: { minHeight: 56, fontFamily: 'ui-monospace, Consolas, monospace' },
              placeholder: t('rt.pj.scopePh'), value: form.scope,
              onChange: (e: { target: { value: string } }) => { setForm((s) => ({ ...s, scope: e.target.value })) },
            })),
          h('div', { class: 'dshp-pj-field' },
            h('div', { class: 'dshp-pj-label' }, t('rt.pj.note')),
            h('input', {
              class: 'dshp-rt-input', value: form.note,
              onChange: (e: { target: { value: string } }) => { setForm((s) => ({ ...s, note: e.target.value })) },
            })),
          h('div', { class: 'dshp-pj-actions' },
            h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { setCreating(false) } }, t('rt.pj.cancel')),
            h('button', {
              class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
              disabled: busy === 'create' || form.name.trim() === '',
              onClick: create,
            }, busy === 'create' ? t('rt.pj.creating') : t('rt.pj.create'))))
      : null,

    err !== null
      ? h(ErrorLine, { label: t('rt.pj.title'), message: err, retryText: t('common.retry'), onRetry: load })
      : null,

    items === null && err === null ? h(Loading, { text: t('rt.loading') }) : null,
    items !== null && visible.length === 0
      ? h('div', { class: 'dshp-rt-empty' }, t('rt.pj.empty'))
      : null,

    h('div', { class: 'dshp-pj-grid' },
      visible.map((p) => h(ProjectCard, {
        key: p.id, t, project: p, isCurrent: current === p.id, busy,
        statusTag, onOpen: open, onUpdate: update, notices: props.notices,
        onEnter: props.onEnter, onNewSession: props.onNewSession,
      onDelete: async (id: string, workspaceId?: string | null) => {
        const ok = await props.onDelete(id, workspaceId)
        /* 删完立刻从本地列表移除并通知上层重拉：否则要手动刷新才消失 */
        if (ok) {
          invalidateProjects()
          setItems((prev) => (prev === null ? null : prev.filter((p) => p.id !== id)))
          props.onChanged()
        }
        return ok
      },
        onSetCurrent: (id: string) => {
          void rtOp('activateEngagement', { engagement: id }).then((r) => {
            if (!r.ok) { props.notices.report(props.t('rt.pj.openFailed') + '：' + r.error, 'failure'); return }
            setCurrent(id)
            props.onSetCurrent(id)
          })
        },
        confirmArchive: () => confirmDialog(t('rt.pj.archiveConfirm', { name: p.name }), {
          okText: t('rt.pj.archive'), cancelText: t('common.cancel'),
        }),
      }))),

    items !== null
      ? h('div', { class: 'dshp-rt-foot', style: { borderTop: 'none', paddingLeft: 0 } }, t('rt.pj.count', { n: items.length }))
      : null,
  )
}

/** 单个项目卡片：进度 + 统计 + 四个动作。 */
function ProjectCard(props: {
  t: (k: string, p?: Record<string, string | number>) => string
  project: AnyRec
  isCurrent: boolean
  busy: string
  statusTag: (status: string) => ReturnType<typeof h>
  onOpen: (id: string, name: string) => void
  onSetCurrent: (id: string) => void
  onUpdate: (id: string, patch: AnyRec, done?: string) => void
  onEnter: (id: string) => Promise<boolean>
  onNewSession: (id: string) => Promise<boolean>
  onDelete: (id: string, workspaceId?: string | null) => Promise<boolean>
  notices: { report: (text: string, tone?: 'info' | 'success' | 'failure') => void }
  /** 归档前确认（宿主 overlay 的确认框，异步）。 */
  confirmArchive: () => Promise<boolean>
}): ReturnType<typeof h> {
  const t = props.t
  const p = props.project
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name: String(p.name || ''), scope: (p.scope || []).join(', '), note: String(p.note || '') })
  const stage = p.stage || {}
  const total = Number(stage.totalPoints || 0)
  const points = Number(stage.points || 0)
  const pct = total > 0 ? Math.min(100, Math.round((points / total) * 100)) : 0
  const stats = p.stats || {}
  const archived = p.status === 'archived' || p.status === 'closed'

  return h('div', { class: 'dshp-pj-card' + (props.isCurrent ? ' is-current' : '') + (archived ? ' is-archived' : '') },
    h('div', { class: 'dshp-pj-card-head' },
      h('div', { class: 'dshp-pj-card-name', title: p.id }, String(p.name || p.id)),
      props.statusTag(String(p.status || 'active')),
      props.isCurrent ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-active' }, t('rt.pj.current')) : null,
      p.bound_sessions > 0 ? h('span', { class: 'dshp-rt-tag' }, t('rt.pj.boundSessions', { n: p.bound_sessions })) : null),

    h('div', { class: 'dshp-pj-meta' },
      h('span', { class: 'dshp-rt-mono' }, String(p.id)),
      h('span', { class: 'dshp-pj-dot' }, '·'),
      h('span', null, t('rt.pj.lastActivity') + '：' + (p.last_activity ? fmt(p.last_activity) : t('rt.pj.never')))),

    // 项目 = 目录 = 工作区：让用户看得见它落在哪、会话会开在哪
    h('div', { class: 'dshp-pj-meta' },
      h('span', { class: 'dshp-rt-tag' + (p.workspace_id ? ' dshp-rt-tag-live' : '') },
        t('rt.pj.workspace') + '：' + (p.workspace_id ? t('rt.pj.workspaceReady') : t('rt.pj.workspacePending'))),
      h('button', {
        class: 'dshp-rt-linkbtn', type: 'button',
        title: String(p.dir || ''),
        onClick: () => {
          void copyText(String(p.dir || '')).then((ok) => {
            props.notices.report(ok ? t('rt.pj.dirCopied') : t('rt.pj.copyFail'), ok ? 'success' : 'failure')
          })
        },
      }, t('rt.pj.copyDir'))),

    (p.scope || []).length > 0
      ? h('div', { class: 'dshp-pj-chips' }, (p.scope || []).map((cidr: string, i: number) =>
          h('span', { key: 'c' + i, class: 'dshp-rt-tag dshp-rt-mono' }, cidr)))
      : h('div', { class: 'dshp-pj-chips' }, h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, t('rt.pj.noScope'))),

    p.note ? h('div', { class: 'dshp-pj-note' }, String(p.note)) : null,

    h('div', { class: 'dshp-pj-progress' },
      h('div', { class: 'dshp-rt-ov-bar' }, h('i', { style: { width: pct + '%' } })),
      h('div', { class: 'dshp-pj-stats' },
        h('span', null, t('rt.pj.stat.assets') + ' ' + Number(stats.assets || 0)),
        h('span', null, t('rt.pj.stat.vulns') + ' ' + Number(stats.vulns || 0)),
        h('span', null, t('rt.pj.stat.points') + ' ' + points + '/' + total))),

    editing
      ? h('div', { class: 'dshp-pj-edit' },
          h('input', {
            class: 'dshp-rt-input', value: draft.name,
            onChange: (e: { target: { value: string } }) => { setDraft((s) => ({ ...s, name: e.target.value })) },
          }),
          h('input', {
            class: 'dshp-rt-input', value: draft.scope, placeholder: t('rt.pj.editScope'),
            onChange: (e: { target: { value: string } }) => { setDraft((s) => ({ ...s, scope: e.target.value })) },
          }),
          h('input', {
            class: 'dshp-rt-input', value: draft.note, placeholder: t('rt.pj.editNote'),
            onChange: (e: { target: { value: string } }) => { setDraft((s) => ({ ...s, note: e.target.value })) },
          }),
          h('div', { class: 'dshp-pj-actions' },
            h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { setEditing(false) } }, t('rt.pj.cancel')),
            archived
              ? h('button', {
                  class: 'dshp-rt-btn', type: 'button',
                  onClick: () => { props.onUpdate(String(p.id), { status: 'active' }, t('rt.pj.saved')) },
                }, t('rt.pj.restore'))
              : h('button', {
                  class: 'dshp-rt-btn', type: 'button',
                  onClick: () => {
                    void props.confirmArchive().then((ok) => {
                      if (ok) props.onUpdate(String(p.id), { status: 'archived' }, t('rt.pj.saved'))
                    })
                  },
                }, t('rt.pj.archive')),
            h('button', {
              class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
              onClick: () => {
                props.onUpdate(String(p.id), {
                  name: draft.name,
                  scope: draft.scope.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean),
                  note: draft.note,
                }, t('rt.pj.saved'))
                setEditing(false)
              },
            }, t('rt.pj.save'))))
      : null,

    h('div', { class: 'dshp-pj-actions' },
      h('button', {
        class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button',
        title: t('main.enterHint'),
        disabled: props.busy !== '',
        onClick: () => { void props.onEnter(String(p.id)) },
      }, t('main.enter')),
      h('button', {
        class: 'dshp-rt-btn', type: 'button',
        title: t('main.newSessionHint'),
        disabled: props.busy !== '',
        onClick: () => { void props.onNewSession(String(p.id)) },
      }, t('main.newSession')),
      h('button', {
        class: 'dshp-rt-btn', type: 'button',
        disabled: props.busy !== '',
        onClick: () => { props.onOpen(String(p.id), String(p.name || p.id)) },
      }, t('rt.pj.enter')),
      h('button', { class: 'dshp-rt-btn', type: 'button', onClick: () => { setEditing((v) => !v) } }, t('rt.pj.edit')),
      h('button', {
        class: 'dshp-rt-btn dshp-rt-btn-danger', type: 'button',
        disabled: props.busy !== '',
        onClick: () => {
          void confirmDialog(t('main.deleteConfirm', { name: String(p.name || p.id) }), {
            okText: t('main.deleteProject'), cancelText: t('common.cancel'), danger: true,
          }).then((ok) => {
            if (!ok) return
            void props.onDelete(String(p.id), p.workspace_id ?? null).then((done) => {
              props.notices.report(done ? t('rt.pj.deleted', { name: String(p.name || p.id) }) : t('rt.pj.updateFailed'), done ? 'success' : 'failure')
            })
          })
        },
      }, t('main.deleteProject'))),
  )
}
