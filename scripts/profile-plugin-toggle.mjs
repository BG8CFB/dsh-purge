#!/usr/bin/env node
/**
 * Inspect or toggle one bundle in a DSH profile's dsh.profile.bundles list.
 *
 * Written for bisecting UI regressions: the delete-session entry can disappear because of a
 * profile bundle, not only because of patched host code. Mutations back the manifest up first.
 *
 * usage:
 *   node scripts/profile-plugin-toggle.mjs list [profile]
 *   node scripts/profile-plugin-toggle.mjs disable <bundle> [profile]
 *   node scripts/profile-plugin-toggle.mjs enable  <bundle> [profile]
 */
import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const [action, arg1, arg2] = process.argv.slice(2)
const home = process.env.DSH_HOME || join(homedir(), '.dsh')

function paths(profile) {
  const dir = join(home, 'profiles', profile)
  return { dir, manifest: join(dir, 'package.json') }
}

async function readManifest(profile) {
  const { manifest, dir } = paths(profile)
  const text = await readFile(manifest, 'utf8')
  return { parsed: JSON.parse(text), text, manifest, dir }
}

async function writeManifest(manifest, parsed, original) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backup = manifest + '.bak-' + stamp
  await copyFile(manifest, backup)
  const indent = /\n( +)"/.exec(original)?.[1]?.length ?? 2
  await writeFile(manifest, JSON.stringify(parsed, null, indent) + '\n', 'utf8')
  return backup
}

if (action === 'list') {
  const profile = arg1 || 'desktop'
  const { parsed } = await readManifest(profile)
  const bundles = parsed?.dsh?.profile?.bundles ?? []
  console.log('profile: ' + profile + '  (' + paths(profile).dir + ')')
  console.log('bundles (' + bundles.length + '):')
  for (const name of bundles) console.log('  - ' + name)
} else if (action === 'disable' || action === 'enable') {
  const bundle = arg1
  const profile = arg2 || 'desktop'
  if (!bundle) {
    console.error('missing bundle name')
    process.exit(1)
  }
  const { parsed, manifest, text } = await readManifest(profile)
  const list = parsed?.dsh?.profile?.bundles
  if (!Array.isArray(list)) {
    console.error('profile manifest has no dsh.profile.bundles')
    process.exit(1)
  }
  const has = list.includes(bundle)
  if (action === 'disable') {
    if (!has) {
      console.log(bundle + ' not in bundles; nothing to do')
      process.exit(0)
    }
    parsed.dsh.profile.bundles = list.filter((name) => name !== bundle)
  } else {
    if (has) {
      console.log(bundle + ' already enabled')
      process.exit(0)
    }
    parsed.dsh.profile.bundles = [...list, bundle]
  }
  const backup = await writeManifest(manifest, parsed, text)
  console.log(action + 'd ' + bundle + ' in profile ' + profile)
  console.log('backup: ' + backup)
  console.log('restart DSH NEXT for the new composition to load')
} else {
  console.error('usage: profile-plugin-toggle.mjs list|disable|enable [bundle] [profile]')
  process.exit(1)
}
