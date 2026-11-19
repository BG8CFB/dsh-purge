/**
 * 主面板（main）内部导航状态：当前页签 + 发起入口的会话上下文。
 *
 * 一个 apply 只创建一个实例，由 index.ts 通过 inject 传给 PurgeMain 与各入口按钮。
 * sessionId 用来在红队工作台里显示/操作「本会话绑定」——主面板是 root 作用域，
 * 自身不知道当前会话，只能由会话内入口（会话头按钮、右栏页签）在打开时带进来。
 *
 * 快照对象只在页签/会话变化时替换，满足 useSyncExternalStore 的引用稳定性要求。
 */

/** 主面板页签：看板 / 红队演练台 / 蓝队值守台。人格/规则/技能/更新属于全局配置，在设置里。 */
export type MainTab = 'overview' | 'redteam' | 'blueteam'

/** 导航快照。 */
export interface MainNavState {
  tab: MainTab
  /** 打开面板的会话 id；从左侧栏直接进入时为 null。 */
  sessionId: string | null
}

/** 主面板内部导航。 */
export interface MainNav {
  /** 切换页签；可选带上发起入口的会话 id。 */
  select: (tab: MainTab, sessionId?: string | null) => void
  /** 供 useSyncExternalStore 绑定的稳定读函数。 */
  getSnapshot: () => MainNavState
  subscribe: (listener: () => void) => () => void
}

/** 创建导航状态（插件内单例，按 apply 生命周期持有）。 */
export function createMainNav(initial: MainTab = 'overview'): MainNav {
  let state: MainNavState = { tab: initial, sessionId: null }
  const listeners = new Set<() => void>()
  const publish = (next: MainNavState): void => {
    if (next.tab === state.tab && next.sessionId === state.sessionId) return
    state = next
    for (const listener of [...listeners]) listener()
  }
  return {
    select(tab, sessionId) {
      publish({ tab, sessionId: sessionId === undefined ? state.sessionId : sessionId })
    },
    getSnapshot: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
}
