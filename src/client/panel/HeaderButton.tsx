/**
 * conversation.session.header.utilities：会话头右侧的「dsh-purge」按钮。
 *
 * 点击打开右侧栏的 dsh-purge 页签（openPanel 由 index.ts 注入，
 * 内含「打开服务不可达 → 降级跳设置页」的回退链）。
 */
import { h } from '../shared/ui.ts'
import type { Translate } from './RewindSafe.ts'

export interface HeaderButtonProps {
  t: Translate
  /** 打开 dsh-purge 面板（降级逻辑由注入方实现）。 */
  openPanel: () => void
}

export function HeaderButton(props: HeaderButtonProps): ReturnType<typeof h> {
  const label = props.t('header.label')
  return h('button', {
    class: 'dshp-btn dshp-btn-ghost',
    type: 'button',
    title: label,
    'aria-label': label,
    onClick: props.openPanel,
  }, label)
}
