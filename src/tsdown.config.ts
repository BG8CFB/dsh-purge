/**
 * dsh-purge 客户端构建配置（单一 client face）。
 *
 * 产物 dist/client.js 是宿主 ModuleLoader 的工厂格式：
 * banner/footer 组出 `window.__ModuleLoader__.load({ id, factory })` 外壳，
 * intro 提供工厂体内的 module/exports 变量；react 家族保持 external，
 * 由宿主 seed 表在浏览器侧供应。host face 不在此构建（宿主半在 lib/，已存在）。
 */
import { defineConfig } from 'tsdown'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** 包根（配置在 src/ 下，路径显式锚到包根，避免按配置文件目录解析）。 */
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** 模块加载器登记的插件 id（package.json name）。 */
const PACKAGE_NAME = 'dsh-purge'

export default defineConfig([
  {
    name: `${PACKAGE_NAME}/client`,
    entry: { client: resolve(packageRoot, 'src/client/index.ts') },
    outDir: resolve(packageRoot, 'dist'),
    format: 'cjs',
    // cjs 格式下 platform 默认按 Node 处理，这里声明 neutral + 输入级 browser，
    // 明确产物面向浏览器（无 node 内建注入）
    platform: 'neutral',
    inputOptions: { platform: 'browser' },
    target: 'es2022',
    fixedExtension: false,
    dts: false,
    clean: true,
    sourcemap: false,
    // react 家族在宿主 seed 表内，永不打包；除此之外不允许任何运行时依赖
    deps: { neverBundle: ['react', 'react/jsx-runtime', 'react-dom'] },
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PACKAGE_NAME)}, factory: (require) => {`,
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
])
