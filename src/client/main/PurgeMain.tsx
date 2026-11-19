/**
 * main 槽位（root 作用域，key: dsh-purge）的全局主面板。
 *
 * 版式分工（v2.18 去重后）：
 *   - 这里只有两页：**总览**（开工检查 + 进入演练）与 **红队演练台**（全宽工作台）；
 *   - 项目的新建 / 改名 / 归档 / 删除只在演练台「项目中心」——面板不再保留第二套表单；
 *   - 人格 / 规则集 / 技能 / 更新属于全局配置，只存在于「设置 → 破甲」，右上 ⚙ 一键直达
 *     （以前这里还有第三个页签渲染同一份设置页，等于把一张表单挂了两处）。
 *
 * 进入演练 = 切到该项目工作区并打开一个红队模式会话：进去就是一个能说话的对话，
 * 不写草稿、不要求回车；想再开一个点「新建对话」。
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { h, type NoticeSource, Loading } from '../shared/ui.ts'
import { useProjects } from '../shared/data.ts'
import { rtOp } from '../redteam/api.ts'
import type { Translate } from '../locale.ts'
import { RedteamTab } from '../redteam/RedteamTab.tsx'
import { BlueTab } from '../blue/BlueTab.tsx'
import type { MainNav, MainTab } from './nav.ts'

type AnyRec = Record<string, any>

export interface PurgeMainProps {
  t: Translate
  trt: Translate
  /** 蓝队词典（缺项在 BlueTab 内回落到中文）。 */
  tb: Translate
  notices: NoticeSource
  nav: MainNav
  /** 深链到「设置 → 破甲」（人格 / 规则 / 技能 / 更新）。 */
  openSettings: () => void
  /** 进入项目工作区并打开红队会话（主入口）。 */
  enterDrill: (id: string) => Promise<boolean>
  /** 在同一工作区再开一个红队会话。 */
  newDrillSession: (id: string) => Promise<boolean>
  /** 进入蓝队值守（切工作区 + 开「蓝队模式」会话）。 */
  enterShift: (id: string) => Promise<boolean>
  /** 在同一蓝队项目里再开一个值守会话。 */
  newShiftSession: (id: string) => Promise<boolean>
  /** 删除蓝队项目（含目录与工作区）。 */
  deleteBlueProject: (id: string) => Promise<boolean>
  /** 删除项目（含目录与工作区）。 */
  deleteProject: (id: string, workspaceId?: string | null) => Promise<boolean>
  closeMain: () => boolean
  /** 客户端服务自检（uiWorkspace / workspaces / layout）。 */
  probeServices: () => { uiWorkspace: boolean; workspaces: boolean; layout: boolean }
}

const TABS: readonly MainTab[] = ['overview', 'redteam', 'blueteam']

const TAB_LABELS: Record<MainTab, string> = {
  overview: 'main.tab.overview',
  redteam: 'main.tab.redteam',
  blueteam: 'main.tab.blueteam',
}

export function PurgeMain(props: PurgeMainProps): ReturnType<typeof h> {
  const t = props.t
  const state = useSyncExternalStore(props.nav.subscribe, props.nav.getSnapshot)
  const tab = state.tab
  const services = props.probeServices()
  /** 页签键盘导航：左右方向键在同一组 role=tab 之间移动。 */
  const move = (dir: number): void => {
    const index = TABS.indexOf(tab)
    props.nav.select(TABS[(index + dir + TABS.length) % TABS.length])
  }

  return h('div', { class: 'dshp-main' },
    h('div', { class: 'dshp-main-head' },
      h('div', { class: 'dshp-main-brand' },
        h('span', { class: 'dshp-main-title' }, t('main.title')),
        h('span', { class: 'dshp-main-sub' }, t('main.subtitle'))),
      h('div', { class: 'dshp-main-tabs', role: 'tablist' },
        TABS.map((key) => h('button', {
          key, type: 'button', role: 'tab',
          'aria-selected': tab === key ? 'true' : 'false',
          class: 'dshp-main-tab' + (tab === key ? ' on' : ''),
          tabIndex: tab === key ? 0 : -1,
          onClick: () => { props.nav.select(key) },
          onKeyDown: (event: { key: string; preventDefault: () => void }) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
            else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
          },
        }, t(TAB_LABELS[key])))),
      h('div', { class: 'dshp-spacer' }),
      h('button', {
        class: 'dshp-btn dshp-btn-ghost', type: 'button',
        title: services.layout ? t('main.closeHint') : t('main.closeUnavailable'),
        'aria-label': t('main.closeHint'),
        disabled: !services.layout,
        onClick: () => { props.closeMain() },
      }, '✕'),
      h('button', {
        class: 'dshp-btn', type: 'button',
        title: t('main.settingsLink'),
        'aria-label': t('main.settingsLink'),
        onClick: props.openSettings,
      }, '⚙')),

    h('div', { class: 'dshp-main-body' },
      tab === 'overview'
        ? h(OverviewPane, {
            t, notices: props.notices, nav: props.nav,
            enterDrill: props.enterDrill, newDrillSession: props.newDrillSession,
            probeServices: props.probeServices,
          })
        : tab === 'blueteam'
          ? h('div', { class: 'dshp-main-fill' },
              h(BlueTab, {
                t: props.tb,
                notices: props.notices,
                sessionId: state.sessionId === null ? undefined : state.sessionId,
                enterShift: props.enterShift,
                newShiftSession: props.newShiftSession,
                deleteProject: props.deleteBlueProject,
              }))
          : h('div', { class: 'dshp-main-fill' },
              h(RedteamTab, {
                t: props.trt,
                notices: props.notices,
                sessionId: state.sessionId === null ? undefined : state.sessionId,
                enterDrill: props.enterDrill,
                newDrillSession: props.newDrillSession,
                deleteProject: props.deleteProject,
                openSettings: props.openSettings,
              }))),
  )
}

/* ────────────────────────── 总览 ────────────────────────── */

interface OverviewProps {
  t: Translate
  notices: NoticeSource
  nav: MainNav
  enterDrill: (id: string) => Promise<boolean>
  newDrillSession: (id: string) => Promise<boolean>
  probeServices: () => { uiWorkspace: boolean; workspaces: boolean; layout: boolean }
}

function OverviewPane(props: OverviewProps): ReturnType<typeof h> {
  const t = props.t
  const projects = useProjects()
  const [doctor, setDoctor] = useState<AnyRec | null>(null)
  const [doctorError, setDoctorError] = useState<string | null>(null)
  const [busy, setBusy] = useState('')
  const [repairing, setRepairing] = useState(false)
  const [current, setCurrent] = useState('')
  const reloadProjects = projects.reload
  const items = projects.items
  const serverCurrent = projects.current

  const loadDoctor = useCallback(() => {
    void rtOp<AnyRec>('drillDoctor').then((doc) => {
      if (!doc.ok) { setDoctorError(doc.error); return }
      setDoctorError(null)
      setDoctor(doc.data)
    })
  }, [])
  useEffect(() => { loadDoctor() }, [loadDoctor])

  // 当前项目：优先用户手选，其次服务端 current 指针，最后第一个项目
  useEffect(() => {
    if (items === null || items.length === 0) { setCurrent(''); return }
    setCurrent((prev) => {
      if (prev !== '' && items.some((row) => row.id === prev)) return prev
      if (serverCurrent !== '' && items.some((row) => row.id === serverCurrent)) return serverCurrent
      return String(items[0].id)
    })
  }, [items, serverCurrent])

  const services = props.probeServices()
  const servicesOk = services.uiWorkspace && services.workspaces
  const preset = doctor !== null && doctor.preset !== undefined ? doctor.preset : null
  const presetOk = preset !== null && preset.declared === true && (preset.broken === null || preset.broken === undefined)
  const presetBroken = preset !== null && (preset.declared !== true || (preset.broken !== null && preset.broken !== undefined))

  const run = async (kind: 'enter' | 'new'): Promise<void> => {
    if (current === '') { props.notices.report(t('main.noProject'), 'failure'); return }
    setBusy(kind)
    try {
      const ok = kind === 'enter' ? await props.enterDrill(current) : await props.newDrillSession(current)
      if (!ok) props.notices.report(t('main.sessionUnavailable'), 'failure')
    } finally {
      setBusy('')
    }
  }

  const picked = items === null ? undefined : items.find((row) => row.id === current)

  const tile = (key: string, value: string, mod?: string, title?: string): ReturnType<typeof h> => h('div', { class: 'dshp-check' + (mod === undefined ? '' : ' ' + mod) },
    h('div', { class: 'dshp-check-key' }, key),
    h('div', { class: 'dshp-check-val' + (mod === 'store' ? ' dshp-mono-ellipsis' : ''), title }, value),
  )

  return h('div', { class: 'dshp-main-scroll' },
    // —— 就绪检查 ——
    h('div', { class: 'dshp-card' },
      h('div', { class: 'dshp-card-head' },
        h('div', { class: 'dshp-card-title' }, t('main.doc.title')),
        h('div', { class: 'dshp-spacer' }),
        h('button', {
          class: 'dshp-btn dshp-btn-ghost', type: 'button',
          onClick: () => { loadDoctor(); reloadProjects() },
        }, t('main.doc.refresh'))),
      doctor === null && doctorError === null ? h(Loading, { text: t('common.loading') }) : null,
      doctorError !== null ? h('div', { class: 'dshp-hint' }, t('main.doc.loadFail') + '：' + doctorError) : null,
      h('div', { class: 'dshp-check-grid' },
        tile(t('main.doc.services'),
          servicesOk ? t('main.doc.servicesOk') : t('main.doc.servicesBad'),
          servicesOk ? 'ok' : 'bad')),
      doctor !== null
        ? h('div', { class: 'dshp-check-grid' },
            tile(t('main.doc.preset'),
              presetOk ? t('main.doc.presetOk') : (preset === null || preset.declared !== true ? t('main.doc.presetMissing') : t('main.doc.presetBroken')),
              presetOk ? 'ok' : 'bad'),
            tile(t('main.doc.projects'), String(doctor.projects === null || doctor.projects === undefined ? '—' : doctor.projects)),
            tile(t('main.doc.skills'), String(doctor.skills === null || doctor.skills === undefined ? '—' : doctor.skills)),
            tile(t('main.doc.agents'), String(doctor.agents === undefined || doctor.agents === null ? '—' : doctor.agents.max)),
            tile(t('main.doc.store'), String(doctor.root ?? '—'), 'store', String(doctor.root ?? '')))
        : null,
      presetBroken
        ? h('div', { class: 'dshp-actions' },
            h('button', {
              class: 'dshp-btn dshp-btn-primary', type: 'button', disabled: repairing,
              onClick: () => {
                setRepairing(true)
                void rtOp<AnyRec>('presetRepair').then((r) => {
                  setRepairing(false)
                  props.notices.report(r.ok ? t('main.doc.repairOk') : t('main.doc.repairFail') + '：' + r.error, r.ok ? 'success' : 'failure')
                  loadDoctor()
                })
              },
            }, repairing ? t('main.doc.repairing') : t('main.doc.repair')),
            h('div', { class: 'dshp-hint' }, t('main.doc.repairHint')))
        : null,
      h('div', { class: 'dshp-hint' }, t('main.doc.flow'))),

    // —— 进入演练（项目增删改在演练台的项目中心，这里只做入口） ——
    h('div', { class: 'dshp-card' },
      h('div', { class: 'dshp-card-title' }, t('main.enterTitle')),
      h('div', { class: 'dshp-field' },
        h('div', { class: 'dshp-hint' }, t('main.doc.projectLabel')),
        h('select', {
          class: 'dshp-select', style: { width: '100%' }, value: current,
          onChange: (e: { target: { value: string } }) => { setCurrent(e.target.value) },
        },
          current === '' ? h('option', { value: '' }, t('main.noProject')) : null,
          (items ?? []).map((row) => h('option', { key: row.id, value: row.id }, String(row.name || row.id)))),
        picked !== undefined
          ? h('div', { class: 'dshp-hint' },
              t('rt.pj.workspace') + '：'
              + (picked.workspace_id ? t('rt.pj.workspaceReady') : t('rt.pj.workspacePending'))
              + ' · ' + String(picked.dir || ''))
          : null),
      h('div', { class: 'dshp-actions' },
        h('button', {
          class: 'dshp-btn dshp-btn-primary', type: 'button',
          disabled: busy !== '' || current === '',
          title: t('main.enterHint'),
          onClick: () => { void run('enter') },
        }, busy === 'enter' ? t('common.loading') : t('main.enter')),
        h('button', {
          class: 'dshp-btn', type: 'button',
          disabled: busy !== '' || current === '',
          title: t('main.newSessionHint'),
          onClick: () => { void run('new') },
        }, busy === 'new' ? t('common.loading') : t('main.newSession')),
        h('button', {
          class: 'dshp-btn dshp-btn-ghost', type: 'button',
          onClick: () => { props.nav.select('redteam') },
        }, t('main.quick.redteam'))),
      h('div', { class: 'dshp-hint' }, t('main.doc.workspaceHint')),
      h('div', { class: 'dshp-hint' }, t('main.doc.roles'))),
  )
}
