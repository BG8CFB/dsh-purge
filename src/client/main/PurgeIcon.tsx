/**
 * 左侧栏导航图标（sidebar.panellist 项，id 与 main 面板 key 同名）。
 *
 * 纯 SVG + currentColor，随主题自适应；包内不带图片资产。
 * 图形：盾形轮廓 + 中间一道裂口，对应「破甲」语义。
 */
import { h } from '../shared/ui.ts'

export function PurgeIcon(): ReturnType<typeof h> {
  return h('svg', {
    width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
    'aria-hidden': 'true', focusable: 'false',
  },
    h('path', {
      d: 'M12 2.6 20 6v6.1c0 4.6-3.2 8.1-8 9.3-4.8-1.2-8-4.7-8-9.3V6z',
      stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linejoin': 'round',
    }),
    h('path', {
      d: 'M12.4 6.8 10 12h3.2l-1.8 5.2',
      stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }),
  )
}
