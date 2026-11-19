/**
 * conversation.input.right：输入框右侧的「安全回退」按钮（↩）。
 *
 * 交互：挂载时查 /dsh-purge/rewind/options 判断本会话可回退性；
 * 可回退才点亮，点击 POST /dsh-purge/rewind（mode: once）回退到上一条用户消息。
 */
import { useCallback, useEffect, useState } from 'react'
import { h, type NoticeSource } from '../shared/ui.ts'
import { applyRewind, fetchRewindOptions } from '../shared/api.ts'

/** 翻译函数：唯一定义在 locale.ts，这里转出以保持既有 import 路径可用。 */
export type { Translate } from '../locale.ts'

export interface RewindSafeProps {
  t: Translate
  /** 输入栏槽位（session 作用域）的标准 props 提供 sessionId。 */
  sessionId: string
  /** 全局通知源（shell.overlay Toast）。 */
  notices: NoticeSource
}

/** 回退可用性：检查中 / 可回退 / 不可回退。 */
type Availability = 'checking' | 'available' | 'unavailable'

export function RewindSafe(props: RewindSafeProps): ReturnType<typeof h> {
  const [availability, setAvailability] = useState<Availability>('checking')
  const [busy, setBusy] = useState(false)

  // 挂载与切换会话时各查一次可回退性；结果晚于卸载到达则丢弃
  useEffect(() => {
    let cancelled = false
    setAvailability('checking')
    void fetchRewindOptions(props.sessionId).then((result) => {
      if (cancelled) return
      setAvailability(result.ok ? 'available' : 'unavailable')
    })
    return () => { cancelled = true }
  }, [props.sessionId])

  const run = useCallback(() => {
    if (busy || availability !== 'available') return
    setBusy(true)
    void applyRewind(props.sessionId, 'once').then((result) => {
      setBusy(false)
      if (result.ok) {
        props.notices.report(props.t('rewind.ok'), 'success')
        // 回退后再查一次：可能已到最早一条消息
        void fetchRewindOptions(props.sessionId).then((next) => {
          setAvailability(next.ok ? 'available' : 'unavailable')
        })
      } else {
        props.notices.report(`${props.t('rewind.fail')}：${result.error}`, 'failure')
        setAvailability('unavailable')
      }
    })
  }, [busy, availability, props.sessionId, props.notices, props.t])

  const title = availability === 'available'
    ? props.t('rewind.tooltip')
    : availability === 'checking' ? props.t('rewind.checking') : props.t('rewind.unavailable')
  return h('button', {
    class: 'dshp-rewind-btn',
    type: 'button',
    title,
    'aria-label': title,
    disabled: availability !== 'available' || busy,
    onClick: run,
  }, '↩')
}
