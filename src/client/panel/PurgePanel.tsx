/**
 * sidebar.right.pane.tab（key: dsh-purge）的面板主体。
 *
 * 三块内容：
 *   1. 状态总览：路线 / 宿主 core 版本 / 注入来源与字节数 / 人格文件路径（GET /dsh-purge/status）；
 *   2. 回退本会话一轮（复用 rewind/options → rewind once 流程）；
 *   3. 红队演练台入口：打开同右侧栏的演练台页签（key: redteam）。
 */
import { useCallback, useEffect, useState } from 'react'
import { h, type NoticeSource, Loading, ErrorLine } from '../shared/ui.ts'
import { applyRewind, fetchRewindOptions, fetchStatus, type StatusPayload } from '../shared/api.ts'
import type { Translate } from './RewindSafe.ts'

export interface PurgePanelProps {
  t: Translate
  /** 页签槽位（session 作用域）的标准 props 提供 sessionId。 */
  sessionId?: string
  /** 全局通知源（shell.overlay Toast）。 */
  notices: NoticeSource
  /** 打开红队演练台页签（index.ts 注入；缺省时退回提示占位）。 */
  openDrill?: () => void
}

export function PurgePanel(props: PurgePanelProps): ReturnType<typeof h> {
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<StatusPayload | null>(null)

  const load = useCallback(() => {
    setPhase('loading')
    void fetchStatus().then((result) => {
      if (result.ok) { setStatus(result.data); setPhase('ready') }
      else { setError(result.error); setPhase('error') }
    })
  }, [])
  useEffect(() => { load() }, [load])

  // 回退（与输入栏 ↩ 同一语义：once 模式）
  const [rewindBusy, setRewindBusy] = useState(false)
  const rewind = useCallback(() => {
    if (rewindBusy || props.sessionId === undefined) return
    setRewindBusy(true)
    void fetchRewindOptions(props.sessionId).then((options) => {
      if (!options.ok) {
        setRewindBusy(false)
        props.notices.report(`${props.t('panel.rewindFail')}：${options.error}`, 'failure')
        return
      }
      void applyRewind(props.sessionId as string, 'once').then((result) => {
        setRewindBusy(false)
        if (result.ok) props.notices.report(props.t('panel.rewindOk'), 'success')
        else props.notices.report(`${props.t('panel.rewindFail')}：${result.error}`, 'failure')
      })
    })
  }, [rewindBusy, props.sessionId, props.notices, props.t])

  const t = props.t
  return h('div', { class: 'dshp-root' },
    h('div', { class: 'dshp-section' },
      h('div', { class: 'dshp-section-title' }, t('panel.statusTitle')),
      phase === 'loading' ? h(Loading, { text: t('common.loading') }) : null,
      phase === 'error' ? h(ErrorLine, { label: t('panel.loadFail'), message: error, retryText: t('common.retry'), onRetry: load }) : null,
      phase === 'ready' && status !== null ? renderStatus(t, status) : null,
    ),
    h('div', { class: 'dshp-section' },
      h('button', {
        class: 'dshp-btn', type: 'button',
        disabled: rewindBusy || props.sessionId === undefined,
        title: props.sessionId === undefined ? t('panel.noSession') : t('panel.rewind'),
        onClick: rewind,
      }, rewindBusy ? t('common.loading') : t('panel.rewind')),
    ),
    h('div', { class: 'dshp-section' },
      h('button', {
        class: 'dshp-btn dshp-btn-primary', type: 'button',
        title: t('panel.drillHint'),
        // 打开同右侧栏的红队演练台页签；控制器不可达时退回提示占位
        onClick: () => {
          if (props.openDrill !== undefined) props.openDrill()
          else props.notices.report(t('panel.drillHint'), 'info')
        },
      }, t('panel.drill')),
    ),
  )
}

/** 状态总览的键值行。 */
function renderStatus(t: Translate, status: StatusPayload): ReturnType<typeof h> {
  const rows: Array<[string, string]> = [
    [t('panel.route', { route: status.route })],
    [t('panel.hostCore', { version: status.hostCoreVersion })],
    [t('panel.injectSource', { source: status.inject_source })
      + (status.inject_rule_id !== null ? t('panel.injectRule', { id: status.inject_rule_id }) : '')],
    [t('panel.injectBytes', { n: String(status.inject_bytes) })],
    [t('panel.overridePath', { path: status.override_path })
      + (status.override_exists ? '' : t('panel.overrideMissing'))],
    [t('update.current', { version: status.plugin_version })],
  ]
  return h('div', { class: 'dshp-list' },
    rows.map(([text], index) => h('div', { key: index, class: 'dshp-row' },
      h('span', { class: 'dshp-row-value' }, text))),
  )
}
