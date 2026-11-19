/**
 * 客户端渲染冒烟（无需浏览器）：把 dist/client.js 装进一个极简 React 假实现里，
 * 跑一遍 apply() 与每个槽位组件的首屏渲染。
 *
 * 目的不是替代真机验证，而是挡住"改完点不开面板"这一类崩溃：
 * 未定义标识符（重命名漏改）、hooks 顺序之外的直接抛错、渲染期访问 undefined 属性。
 * 用法：npm run build:client && node test/client-render-smoke.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const bundlePath = join(here, '..', 'dist', 'client.js')

/* ---------- 极简 React：一次性渲染，不跑 effect，不重渲染 ---------- */

class MiniComponent {
  constructor(props) {
    this.props = props
    this.state = this.constructor.getInitialState === undefined ? {} : {}
  }
  setState(patch) {
    this.state = { ...this.state, ...(typeof patch === 'function' ? patch(this.state) : patch) }
  }
}

const react = {
  createElement(type, config, ...children) {
    const props = { ...(config === null || config === undefined ? {} : config) }
    if (children.length === 1) props.children = children[0]
    else if (children.length > 1) props.children = children
    if (typeof type === 'function' || (typeof type === 'object' && type !== null)) {
      return renderElement(type, props)
    }
    return { type, props }
  },
  Fragment: 'Fragment',
  Component: MiniComponent,
  useState(initial) { return [typeof initial === 'function' ? initial() : initial, () => {}] },
  useReducer(reducer, initial) { return [initial, () => {}] },
  useRef(value) { return { current: value } },
  useCallback(fn) { return fn },
  useMemo(fn) { return fn() },
  useEffect() { return undefined },
  useLayoutEffect() { return undefined },
  useSyncExternalStore(_subscribe, getSnapshot) { return getSnapshot() },
}

function renderElement(type, props) {
  if (type.prototype !== undefined && typeof type.prototype.render === 'function') {
    const instance = new type(props)
    return instance.render()
  }
  return type(props)
}

/* ---------- 载入产物 ---------- */

let captured = null
globalThis.window = { __ModuleLoader__: { load: (entry) => { captured = entry } } }
const code = readFileSync(bundlePath, 'utf8')
// eslint-disable-next-line no-new-func
new Function('require', code)((name) => {
  if (name === 'react') return react
  throw new Error('unexpected require: ' + name)
})
if (captured === null) throw new Error('bundle 没有走 window.__ModuleLoader__.load')
const plugin = captured.factory((name) => {
  if (name === 'react') return react
  throw new Error('unexpected require: ' + name)
})
if (typeof plugin.apply !== 'function') throw new Error('module.exports.apply 缺失')
console.log('bundle ok:', captured.id, '| inject:', JSON.stringify(plugin.inject))

/* ---------- 假宿主 ctx ---------- */

const registrations = []
const notices = { report() {}, subscribe() { return () => {} }, getSnapshot() { return null }, dismiss() {}, hooks: { notice() { return null } } }
const ctx = {
  effect(fn) { const dispose = fn(); return typeof dispose === 'function' ? dispose : () => {} },
  slots: {
    inject(_name, register) { return register() },
    register(options, component) { registrations.push({ options, component }); return () => {} },
    entries() { return [] },
  },
  locale: {
    register() { return () => {} },
    bind() { return (key) => key },
  },
  get() { return undefined },
  sidebarRightTabs: { register() { return () => {} } },
}
plugin.apply(ctx)
console.log('registered slots:', registrations.map((r) => (r.options.key ?? r.options.id ?? r.options.name)).join(', '))

/* ---------- 渲染每个槽位 ---------- */

let rendered = 0
const errors = []
for (const entry of registrations) {
  const { options, component } = entry
  try {
    const props = typeof options.inject === 'function' ? options.inject('smoke-session') : {}
    // 空树是合法结果（未绑定的徽章、无项目的按钮、无通知的 Toast 都返回 null）
    renderElement(component, props)
    rendered += 1
  } catch (error) {
    errors.push((options.key ?? options.id ?? options.name) + ': ' + (error && error.stack ? error.stack.split('\n').slice(0, 3).join(' | ') : String(error)))
  }
}

/* 主面板两个页签各渲染一次（nav 是插件内单例，通过注入的 props.nav 切换） */
for (const tab of ['overview', 'redteam', 'blueteam']) {
  const mainEntry = registrations.find((r) => r.options.name === 'main')
  if (mainEntry === undefined) { errors.push('main 槽位未注册'); break }
  try {
    const props = mainEntry.options.inject()
    props.nav.select(tab)
    renderElement(mainEntry.component, mainEntry.options.inject())
    rendered += 1
  } catch (error) {
    errors.push('main/' + tab + ': ' + (error && error.stack ? error.stack.split('\n').slice(0, 3).join(' | ') : String(error)))
  }
}

if (errors.length > 0) {
  console.error('渲染冒烟失败：\n' + errors.join('\n'))
  process.exit(1)
}
console.log('渲染冒烟通过：' + rendered + ' 个渲染点，0 异常')
