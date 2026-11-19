/**
 * conversation.session.header.utilities：会话头的「红队状态」徽章。
 *
 * 级别划分（本插件的约定）：
 *   - **会话级**（这里）：本会话绑了哪个项目、该项目当前得分/在跑智能体；点开进面板。
 *   - **全局级**（破甲面板）：项目中心、知识库、技能库、环境适配。
 * 未绑定项目时显示「红队 · 未绑定」，点击打开面板去绑定。
 *
 * 项目名册与本会话绑定走 shared/data.ts 的共享缓存：与右栏页签、输入框按钮同一份数据，
 * 不会出现"这里显示 A、那里显示 B"。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { useBindings, useProjects } from '../shared/data.ts'
import { rtOp } from '../redteam/api.ts'
import type { Translate } from '../locale.ts'

type AnyRec = Record<string, any>

export interface DrillBadgeProps {
  t: Translate
  sessionId?: string
  /** 本会话是否为红队模式（index.ts 注入的客户端判定）。 */
  isRedteam?: () => boolean
  /** 打开全局面板（index.ts 注入）。 */
  openPanel: () => void
}

interface BadgeState {
  points: number
  running: number
  max: number
}

const EMPTY: BadgeState = { points: 0, running: 0, max: 0 }

export function DrillBadge(props: DrillBadgeProps): ReturnType<typeof h> {
  const t = props.t
  const { bound } = useBindings(props.sessionId)
  const projects = useProjects()
  const [state, setState] = useState<BadgeState>(EMPTY)
  const [visible, setVisible] = useState(true)

  // 宿主切到后台时不轮询，回来补一次
  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const sync = (): void => { setVisible(document.visibilityState !== 'hidden') }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => { document.removeEventListener('visibilitychange', sync) }
  }, [])

  useEffect(() => {
    if (bound === null) { setState(EMPTY); return undefined }
    let cancelled = false
    const pull = (): void => {
      void Promise.all([
        rtOp<AnyRec>('scoreChain', { engagement: bound }),
        rtOp<AnyRec>('agentsStatus'),
      ]).then(([chain, agents]) => {
        if (cancelled) return
        const summary = chain.ok && chain.data.summary !== undefined ? chain.data.summary : null
        setState({
          points: summary === null ? 0 : Number(summary.points || 0),
          running: agents.ok && typeof agents.data.used === 'number' ? agents.data.used : 0,
          max: agents.ok && typeof agents.data.max === 'number' ? agents.data.max : 0,
        })
      })
    }
    pull()
    if (!visible) return () => { cancelled = true }
    const timer = setInterval(pull, 15000)
    return () => { cancelled = true; clearInterval(timer) }
  }, [bound, visible])

  /* 普通会话里不显示这颗徽章：既不是红队预设、也没绑定项目，就整个不渲染。 */
  const redteamPreset = props.isRedteam === undefined ? false : props.isRedteam()
  if (bound === null && !redteamPreset) return null

  const name = bound === null
    ? null
    : (projects.items ?? []).find((row) => row.id === bound)?.name ?? bound

  const label = bound === null
    ? t('badge.unbound')
    : t('badge.bound', { name: String(name ?? bound), points: state.points })

  return h('button', {
    class: 'dshp-badge' + (bound === null ? ' dshp-badge-idle' : ''),
    type: 'button',
    title: bound === null
      ? t('badge.unboundTip')
      : t('badge.tip', { name: String(name ?? ''), points: state.points, running: state.running, max: state.max }),
    'aria-label': label,
    onClick: props.openPanel,
  }, label)
}
