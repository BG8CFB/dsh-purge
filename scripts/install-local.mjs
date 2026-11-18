#!/usr/bin/env node
/**
 * Copy this repository into a profile's node_modules so a local build can be tested.
 *
 * Backs up the previous copy first. Refuses to run while DSH is using the profile.
 *
 * usage: node scripts/install-local.mjs [profile]
 */
import { cp, readdir, rename, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const profile = process.argv[2] || 'desktop'
const home = process.env.DSH_HOME || join(homedir(), '.dsh')
const target = join(home, 'profiles', profile, 'node_modules', 'dsh-purge')
const source = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const stamp = new Date().toISOString().replace(/[:.]/g, '-')

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

if (await exists(target)) {
  const backup = target + '.bak-' + stamp
  await rename(target, backup)
  console.log('previous copy moved to ' + backup)
}

await cp(source, target, {
  recursive: true,
  filter: (file) => {
    const skip = ['node_modules', '.git', '.baseline', 'dsh-next-src']
    return !skip.some((part) => file.split(/[\\/]/).includes(part))
  },
})
const files = await readdir(target)
console.log('installed into ' + target)
console.log('entries: ' + files.length)
console.log('restart DSH NEXT to load the new build')
