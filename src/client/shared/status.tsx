/**
 * 状态网格：路线 / 宿主 core / 注入来源 / 生效规则 / 字节 / 人格文件 / 版本。
 *
 * 全插件唯一实现。以前右栏页签的 renderStatus 与主面板的 StatusGrid 各写了一遍
 * 同样的七行键值（主面板那份还没有任何引用），文案与字段一改就漏一处。
 */
import { h } from './ui.ts'
import type { StatusPayload } from './api.ts'
import type { Translate } from '../locale.ts'

export function StatusGrid(props: { t: Translate; status: StatusPayload }): ReturnType<typeof h> {
  const t = props.t
  const status = props.status
  const version = typeof status.plugin_version === 'string' && status.plugin_version !== ''
    ? status.plugin_version
    : t('panel.versionMissing')
  const rows: Array<[string, string]> = [
    [t('field.route'), String(status.route ?? '')],
    [t('field.hostCore'), String(status.hostCoreVersion ?? '')],
    [t('field.injectSource'), String(status.inject_source ?? '')],
    [t('field.rule'), status.inject_rule_id === null || status.inject_rule_id === undefined ? '—' : String(status.inject_rule_id)],
    [t('field.injectBytes'), String(status.inject_bytes ?? 0)],
    [t('field.overridePath'), String(status.override_path ?? '') + (status.override_exists ? '' : t('panel.overrideMissing'))],
    [t('field.version'), version],
  ]
  return h('div', { class: 'dshp-grid' },
    rows.map(([key, value], index) => [
      h('div', { key: 'k' + index, class: 'dshp-grid-key' }, key),
      h('div', { key: 'v' + index, class: 'dshp-grid-value' }, value === '' ? '—' : value),
    ]),
  )
}
