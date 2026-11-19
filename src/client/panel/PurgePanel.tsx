/**
 * sidebar.right.pane.tab（key: dsh-purge）的面板主体 —— 会话内轻量控制台。
 *
 * 右侧栏默认 ~360px，放不下演练台的表格与报告，所以这里只放"跟本会话直接相关"的东西：
 *   1. 本会话演练进度（得分 / 阶段 / 在跑智能体 / 最近命中）；
 *   2. 状态总览（折叠；与主面板共用同一个 StatusGrid）；
 *   3. 本会话绑定：显示当前绑到哪个项目，可切换/解绑（与演练台项目头同一套 useSessionBinding）；
 *   4. 回退本会话一轮；
 *   5. 一个入口：全宽红队演练台（主面板由左栏图标与会话头徽章进入，不再重复摆一个按钮）。
 *
 * 绑定语义：项目（engagement）= 靶标工作区，会话通过 session-bindings.json 绑上去；
 * 绑定后本会话派出的智能体只读写该项目，不会串到别的项目库里。
 */
import { useCallback, useEffect, useState } from 'react'
import { h, type NoticeSource, Loading, ErrorLine, useAsyncData } from '../shared/ui.ts'
import { applyRewind, fetchRewindOptions, fetchStatus } from '../shared/api.ts'
import { StatusGrid } from '../shared/status.tsx'
import { useProjects, useSessionBinding } from '../shared/data.ts'
import { rtOp } from '../redteam/api.ts'
import type { Translate } from '../locale.ts'

type AnyRec = Record<string, any>

/** 本会话演练进度（会话级）。 */
interface ProgressState {
  points: number
  total: number
  stages: number
  running: number
  max: number
  recent: Array<{ name: string; points: number }>
}

export interface PurgePanelProps {
  t: Translate
  /** 页签槽位（session 作用域）的标准 props 提供 sessionId。 */
  sessionId?: string
  /** 本会话是否为红队模式（index.ts 注入）。 */
  isRedteam?: () => boolean
  /** 全局通知源（shell.overlay Toast）。 */
  notices: NoticeSource
  /** 打开全宽红队演练台（index.ts 注入；已带上本会话 id）。 */
  openDrill?: () => void
}

export function PurgePanel(props: PurgePanelProps): ReturnType<typeof h> {
  const t = props.t
  const status = useAsyncData(fetchStatus)
  const projects = useProjects()
  const binding = useSessionBinding(props.sessionId, t, props.notices)
  const bound = binding.bound

  const [pick, setPick] = useState('')
  const [progress, setProgress] = useState<ProgressState | null>(null)
  const [visible, setVisible] = useState(true)

  // 页签切到后台时停止轮询：右栏页签会一直挂着，没必要在看不见的时候继续打接口
  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const sync = (): void => { setVisible(document.visibilityState !== 'hidden') }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => { document.removeEventListener('visibilitychange', sync) }
  }, [])

  useEffect(() => {
    if (bound === null || bound === '' || !visible) {
      if (bound === null || bound === '') setProgress(null)
      return undefined
    }
    let cancelled = false
    const pull = (): void => {
      void Promise.all([
        rtOp<AnyRec>('scoreChain', { engagement: bound }),
        rtOp<AnyRec>('agentsStatus'),
        rtOp<AnyRec>('scores', { engagement: bound }),
      ]).then(([chain, agents, scores]) => {
        if (cancelled) return
        const summary = chain.ok && chain.data.summary !== undefined ? chain.data.summary : null
        const stages = chain.ok && Array.isArray(chain.data.stages) ? chain.data.stages.length : 0
        const hits = scores.ok && Array.isArray(scores.data.hits) ? (scores.data.hits as AnyRec[]) : []
        setProgress({
          points: summary === null ? 0 : Number(summary.points || 0),
          total: summary === null ? 0 : Number(summary.totalPoints || 0),
          stages,
          running: agents.ok && typeof agents.data.used === 'number' ? agents.data.used : 0,
          max: agents.ok && typeof agents.data.max === 'number' ? agents.data.max : 0,
          recent: hits.slice(0, 3).map((hit) => ({ name: String(hit.point_name || hit.code || ''), points: Number(hit.points || 0) })),
        })
      })
    }
    pull()
    const timer = setInterval(pull, 15000)
    return () => { cancelled = true; clearInterval(timer) }
  }, [bound, visible])

  // —— 回退（与输入栏 ↩ 同一语义：once 模式） ——
  const [rewindBusy, setRewindBusy] = useState(false)
  const rewind = useCallback(() => {
    const sessionId = props.sessionId
    if (rewindBusy || sessionId === undefined || sessionId === '') return
    setRewindBusy(true)
    void fetchRewindOptions(sessionId).then((options) => {
      if (!options.ok) {
        setRewindBusy(false)
        props.notices.report(t('panel.rewindFail') + '：' + options.error, 'failure')
        return
      }
      void applyRewind(sessionId, 'once').then((result) => {
        setRewindBusy(false)
        if (result.ok) props.notices.report(t('panel.rewindOk'), 'success')
        else props.notices.report(t('panel.rewindFail') + '：' + result.error, 'failure')
      })
    })
  }, [rewindBusy, props.sessionId, props.notices, t])

  const items = projects.items
  const boundName = bound === null ? undefined : (items ?? []).find((row) => row.id === bound)?.name
  const canBind = props.sessionId !== undefined && props.sessionId !== ''

  /* 普通会话（非红队预设且未绑定项目）：只给一句引导，不铺演练数据。 */
  const redteamPreset = props.isRedteam === undefined ? false : props.isRedteam()
  if (!redteamPreset && bound === null) {
    return h('div', { class: 'dshp-root' },
      h('div', { class: 'dshp-section' },
        h('div', { class: 'dshp-section-title' }, t('panel.notDrillTitle')),
        h('div', { class: 'dshp-hint' }, t('panel.notDrillHint')),
        h('button', {
          class: 'dshp-btn dshp-btn-primary', type: 'button',
          onClick: () => { if (props.openDrill !== undefined) props.openDrill() },
        }, t('panel.goDrill'))),
    )
  }

  const statusState = status.state
  return h('div', { class: 'dshp-root' },
    // —— 会话级：本会话演练进度 ——
    progress !== null
      ? h('div', { class: 'dshp-section' },
          h('div', { class: 'dshp-section-title' }, t('panel.progressTitle')),
          h('div', { class: 'dshp-grid' },
            h('div', { class: 'dshp-grid-key' }, t('panel.points')),
            h('div', { class: 'dshp-grid-value' }, progress.points + ' / ' + progress.total),
            h('div', { class: 'dshp-grid-key' }, t('panel.stages')),
            h('div', { class: 'dshp-grid-value' }, String(progress.stages)),
            h('div', { class: 'dshp-grid-key' }, t('panel.agents')),
            h('div', { class: 'dshp-grid-value' }, progress.running + ' / ' + progress.max)),
          progress.recent.length > 0
            ? h('div', { class: 'dshp-list' },
                progress.recent.map((hit, index) => h('div', { key: 'h' + index, class: 'dshp-list-item' },
                  h('div', { class: 'dshp-list-item-main' },
                    h('div', { class: 'dshp-list-item-sub' }, hit.name)),
                  h('span', { class: 'dshp-tag dshp-tag-active' }, '+' + hit.points))))
            : h('div', { class: 'dshp-hint' }, t('panel.noHits')))
      : null,

    // —— 插件自检信息：折叠，不抢版面 ——
    h('details', { class: 'dshp-details' },
      h('summary', null, t('panel.statusTitle')),
      statusState.phase === 'loading' ? h(Loading, { text: t('common.loading') }) : null,
      statusState.phase === 'error'
        ? h(ErrorLine, { label: t('panel.loadFail'), message: statusState.error, retryText: t('common.retry'), onRetry: status.reload })
        : null,
      statusState.phase === 'ready' ? h(StatusGrid, { t, status: statusState.data }) : null),

    // —— 本会话绑定 ——
    h('div', { class: 'dshp-section' },
      h('div', { class: 'dshp-section-title' }, t('panel.bindingTitle')),
      canBind
        ? (bound !== null
            ? h('div', { class: 'dshp-bindrow' },
                h('span', { class: 'dshp-bindname', title: bound }, t('panel.bindingBound', { name: String(boundName ?? bound) })),
                h('button', {
                  class: 'dshp-btn dshp-btn-ghost', type: 'button', disabled: binding.busy,
                  onClick: () => { void binding.unbind() },
                }, t('panel.unbind')))
            : h('div', null,
                h('div', { class: 'dshp-hint' }, t('panel.bindingNone')),
                h('div', { class: 'dshp-bindrow' },
                  h('select', {
                    class: 'dshp-select', value: pick,
                    onChange: (e: { target: { value: string } }) => { setPick(e.target.value) },
                  },
                    h('option', { value: '' }, items !== null && items.length > 0 ? t('panel.bindingPick') : t('panel.noProjects')),
                    (items ?? []).map((row) => h('option', { key: row.id, value: row.id }, String(row.name || row.id)))),
                  h('button', {
                    class: 'dshp-btn dshp-btn-primary', type: 'button',
                    disabled: binding.busy || pick === '',
                    onClick: () => {
                      const name = (items ?? []).find((row) => row.id === pick)?.name
                      void binding.bind(pick, name).then((ok) => { if (ok) setPick('') })
                    },
                  }, t('panel.bind')))))
        : h('div', { class: 'dshp-hint' }, t('panel.noSession')),
      h('div', { class: 'dshp-hint' }, t('panel.bindingHint'))),

    h('div', { class: 'dshp-section' },
      h('button', {
        class: 'dshp-btn', type: 'button',
        disabled: rewindBusy || props.sessionId === undefined,
        title: props.sessionId === undefined ? t('panel.noSession') : t('panel.rewind'),
        onClick: rewind,
      }, rewindBusy ? t('common.loading') : t('panel.rewind'))),

    // 唯一入口：演练台全宽打开（主面板由左栏图标 / 会话头徽章进入）
    h('div', { class: 'dshp-actions' },
      h('button', {
        class: 'dshp-btn dshp-btn-primary', type: 'button',
        title: t('panel.drillHint'),
        onClick: () => {
          if (props.openDrill !== undefined) props.openDrill()
          else props.notices.report(t('panel.drillHint'), 'info')
        },
      }, t('panel.drill'))),
  )
}
