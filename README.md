# dsh-purge (DSH jailbreak plugin)

**v2.21.1 · dual-route architecture** — one package serves two host generations:

- **DSH NEXT (core 0.2.2-rc.3+)** → **pure-plugin route**: zero host-file writes. Persona / approval / sandbox / prompt wording all go through official extension points (`cordis.patch.yml` config layer + runtime listeners). Official host updates never require re-applying.
- **Older hosts (dsh 0.1.7-rc.2 ~ 0.2.1)** → **disk-patch route**: the established asar-unpack + string-replacement + `.dshpurge.bak` mechanism, unchanged from 1.1.x.

The plugin entry detects the host generation at runtime and dispatches accordingly (`DSH_PURGE_ROUTE=next|legacy` forces a route for debugging).

## Attribution

Borrowing the name, ideas, code, or prompts of this project requires attribution to [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge). Attribution for the embedded upstream red-team components is in `docs/redteam-upstream-DISCLOSURE` and `docs/redteam-upstream-LICENSE`.

## Install

> **Do not install by package name.** `dsh-purge` on npm is a third-party placeholder (only `0.0.0-stage` was ever published — an empty shell), so `dsh plugin add dsh-purge` does **not** install this repository's code and the host shows nothing. That is the #1 cause of "it won't install". This project's code is distributed from GitHub only.

Install from this repo's `master` branch (currently **2.21.1**: NEXT pure-plugin route + red/blue consoles):

```sh
# DSH NEXT desktop (2.0.23-next+)
dsh plugin --profile desktop add https://github.com/BG8CFB/dsh-purge/archive/refs/heads/master.tar.gz
# official dsh web (NEXT-generation core)
dsh plugin --profile web add https://github.com/BG8CFB/dsh-purge/archive/refs/heads/master.tar.gz
# older hosts (0.1.7-rc.2 ~ 0.2.1): same command, then click "Apply" in the panel for the disk patches
```

- Equivalent: `add github:BG8CFB/dsh-purge` (pnpm git spec, needs GitHub reachable); if the source is already local, `add <path to this repo>`.
- **Check the version right after installing**: `version` in the install directory's `package.json` must read `2.21.1`. If it still says `1.1.71` you received the old default branch — run `dsh plugin --profile desktop remove dsh-purge` (swap `desktop` for your profile) and reinstall from the tarball above; `1.1.71` is the legacy disk-patch-only line and cannot run on NEXT.
- Node.js ≥ 22; `engines.dsh` is `>=0.1.7-rc.2 <0.3.0` so both host generations install.
- The **NEXT route works immediately** after one host restart (nothing to apply or revert); the legacy route keeps its Apply → auto-restart flow.

## Usage

```sh
# chat commands (identical on both routes)
/purge status
/rules list | use <id> | create <id> | delete <id> | reset
/skills list | import <path> | create <id> | delete <id>
/rewind [once|round]

# CLI (legacy disk-patch operations; not needed on NEXT)
dsh-purge --status | --apply | --revert | --uninstall | --edit

# model tool
purge_status
```

**Panels (official NEXT shape)**: a "dsh-purge" settings page (persona editing / rule sets / skills / update channel), a right-sidebar "dsh-purge" tab (status overview / rewind / drill console entry), and a rewind button beside the input box. The red-team drill console (assets / env / agents / sessions / findings / chain / scores / report / knowledge / skills) opens directly from its sidebar tab.

**Red-team mode**: pick the "red team" preset → the commander runs `redteam_preflight` → opens an engagement → dispatches the five roles (recon / assess / vuln-scan / exploit / internal). New tooling:

- `redteam_engagement_digest` — one round trip for the full engagement overview (stage / score / recent changes / missing evidence / next-step hint);
- `redteam_scan_import` — imports raw gogo / fscan / nuclei output from runs/ as draft (candidate) records;
- `redteam_asset_next` — the next asset to test, with fingerprint-matched knowledge-base POCs.

Session↔engagement bindings persist across host restarts.

## How it works (NEXT route)

| capability | mechanism |
| --- | --- |
| persona | `systemPrompt.section` (order 1, `interpolate:false`); 4-level fallback: config → prompt-inject.md → AES-sealed slot → built-in |
| identity strip | patch-level `includeHarnessIdentity:false` + assemble rewrite |
| approval | patch-level `approval: ask` (rc.3 `never` means deterministic pre-dispatch rejection) + prepend `approval/request` listener returning `allowed-once` |
| sandbox | patch-level `sandbox-policy: danger-full-access` (already unfenced; fs-sandbox stays enabled — it provides the file-tool host service) |
| wording | `system-prompt/assemble` waterfall: sections **and contexts** traversal, named-context replacement, rc.3-calibrated anchors with drift self-checks |
| tools | prepend `tools/pre-execute` → allow; `tools/post-execute` neutralizes refusal/untrusted wording in results |
| permission presets | the danger-full-access preset's approval is also set to ask to avoid seeding a rejection chain |

The legacy route is unchanged from 1.1.x, plus two safeguards: patch targets are filtered by host generation (NEXT installs are never touched), and startup self-healing only runs on old hosts.

## Revert / uninstall

- **NEXT route**: `dsh plugin --profile <x> remove dsh-purge` — host files were never modified.
- **legacy route**: panel → Clean → Revert/Uninstall, or `/purge revert` / `dsh-purge --uninstall`.

## Local checks

```sh
node --check lib/index.js && node --check lib/legacy/core.js && node --check lib/next/index.js
node --input-type=module -e "import './lib/index.js'"
node test/next-rules.mjs        # NEXT route test suite
npm run build                    # frontend tsdown build + externals check
```

## Layout

`lib/index.js` thin entry (generation dispatch); `lib/next/` NEXT pure-plugin route; `lib/legacy/` disk-patch route; `lib/shared/` shared facilities (home resolution / atomic writes / sealed persona slot / override state machine); `lib/redteam/` drill console (shared by both routes); `presets/redteam/` red-team preset; `skills/redteam/` bundled skills; `src/` frontend sources (tsdown build).

## Updates

See [Releases](https://github.com/BG8CFB/dsh-purge/releases). Publishing: bump `package.json`, make the first line of `release-notes.md` read `# <version>` (CI enforces upstream), push to master, then cut the matching `v<version>` tag and Release by hand (this fork does not run the upstream Release CI; the update panel reads GitHub tags, so the tag is what makes a version discoverable — installing `master`'s tarball is always the latest). The panel offers stable/beta channels; after a self-update on the NEXT route just restart the host.
