/**
 * 会话与入口页签：WebShell / 内网隧道集中展示，带连通状态与一键实测。
 * 自旧 client.js SessionTab 迁移；新增深链：卡片所在资产 → jump('assets', { ip })。
 */
import { useEffect, useState } from 'react'
import { h } from '../shared/ui.ts'
import { rtOp } from './api.ts'
import { clickable, copyWithFeedback, fmt, Section, useCollapse, type RtTabProps } from './bits.tsx'

type AnyRec = Record<string, any>

export function SessionsTab(props: RtTabProps): ReturnType<typeof h> {
  const t = props.t
  const eng = props.eng
  const [data, setData] = useState<AnyRec | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const load = (): void => {
    if (eng === null || eng === '') return
    void rtOp<AnyRec>('sessions', { engagement: eng }).then((r) => {
      if (!r.ok) { setErr(r.error); return }
      setErr(null)
      setData(r.data)
    })
  }
  useEffect(load, [eng, props.refreshKey])

  const probe = (): void => {
    setBusy(true)
    setMsg(null)
    void rtOp<AnyRec>('probeSessions', { engagement: eng, timeoutMs: 6000 }).then((r) => {
      setBusy(false)
      if (!r.ok) { setMsg({ err: r.error }); load(); return }
      const on = ((r.data.webshells ?? []) as AnyRec[]).filter((x) => x.status === 'online').length
      const act = ((r.data.tunnels ?? []) as AnyRec[]).filter((x) => x.status === 'active').length
      setMsg({
        ok: t('rt.se.probeDone', {
          on, n1: (r.data.webshells ?? []).length,
          act, n2: (r.data.tunnels ?? []).length,
        }),
      })
      load()
    })
  }

  // 只有真的写进剪贴板才把按钮点亮成「已复制」；失败时如实报错
  const copy = (key: string, text: string): void => {
    void copyWithFeedback(t, text, text, (ok, message) => {
      if (!ok) { setMsg({ err: message }); return }
      setCopied(key)
      setTimeout(() => { setCopied(c => (c === key ? null : c)) }, 1500)
    })
  }

  const markTunnel = (tn: AnyRec, status: string): void => {
    setMsg(null)
    void rtOp('updateTunnel', { engagement: eng, id: tn.id, patch: { status, check_note: t('rt.se.manualMark') } })
      .then(load)
  }
  const markShell = (w: AnyRec, status: string): void => {
    setMsg(null)
    void rtOp('updateWebshell', { engagement: eng, id: w.id, patch: { status, check_note: t('rt.se.manualMark') } })
      .then(load)
  }

  const sessCollapse = useCollapse('sessions:' + String(eng))
  const totals: AnyRec = (data !== null && data.totals) || {}
  const shells: AnyRec[] = (data !== null && data.webshells) || []
  const tunnels: AnyRec[] = (data !== null && data.tunnels) || []
  const statusDot = (s: string | undefined): ReturnType<typeof h> =>
    h('span', { class: s === 'online' || s === 'active' ? 'dshp-rt-dot-on' : (s === 'unknown' || s === undefined || s === '' ? 'dshp-rt-dot-unk' : 'dshp-rt-dot-off') })
  const fact = (label: string, value: unknown): ReturnType<typeof h> =>
    h('div', { class: 'dshp-rt-sess-fact' }, h('b', null, label), h('span', null, value as string))
  // 交付纪律：马必须是冰蝎/哥斯拉加密马，内网必须走 suo5 隧道
  const isEncryptedShell = (x: string | undefined): boolean => /behinder|godzilla|冰蝎|哥斯拉/i.test(String(x || ''))
  const isSuo5 = (x: string | undefined): boolean => /suo5/i.test(String(x || ''))
  const hint = (key: string, title: string, detail: string): ReturnType<typeof h> =>
    h('div', { key, class: 'dshp-rt-hint' },
      h('b', null, title),
      h('details', { class: 'dshp-rt-sess-fold', style: { marginTop: 3 } },
        h('summary', null, t('rt.se.howTo')),
        h('div', { style: { marginTop: 4 } }, detail)))
  const hints: Array<ReturnType<typeof h>> = []
  const badShells = shells.filter((w) => !isEncryptedShell(w.shell_type))
  const legitTunnels = tunnels.filter((tn) => tn.legit === true)
  if (badShells.length > 0) {
    hints.push(hint('h1', t('rt.se.hintShell', { n: badShells.length }), t('rt.se.hintShellHow')))
  }
  if (tunnels.length > 0 && legitTunnels.length === 0) {
    hints.push(hint('h3', t('rt.se.hintTunnel', { n: tunnels.length }), t('rt.se.hintTunnelHow')))
  }
  const activeSuo5 = tunnels.filter((tn) => isSuo5(tn.kind) && tn.status === 'active')
  if (shells.length > 0 && activeSuo5.length === 0) {
    hints.push(hint('h2', t('rt.se.hintSuo5'), t('rt.se.hintSuo5How')))
  }

  // 资产深链按钮（卡片所在资产）
  const assetJump = (ip: string | undefined | null): ReturnType<typeof h> | null =>
    ip === undefined || ip === null || ip === ''
      ? null
      : h('button', {
          class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
          title: t('rt.f.jumpAssetTitle', { ip }),
          onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); props.jump('assets', { ip }) },
        }, t('rt.f.jumpAsset'))

  const shellCards = shells.map((w) => h('div', { key: 'w' + w.id, class: 'dshp-rt-sess' },
    h('div', { class: 'dshp-rt-sess-head' },
      statusDot(w.status),
      h('span', { class: 'dshp-rt-sess-title' }, w.url),
      h('span', { class: 'dshp-rt-tag dshp-rt-tag-active' }, w.shell_type || 'webshell'),
      isEncryptedShell(w.shell_type) ? null : h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.se.userCantConnect')),
      w.privilege ? h('span', { class: 'dshp-rt-tag' }, w.privilege) : null,
      h('div', { class: 'dshp-rt-spacer' }),
      assetJump(w.asset_ip),
      copied === 'cmd' + w.id
        ? h('span', { class: 'dshp-rt-tag', style: { color: '#10b981' } }, t('rt.copiedShort'))
        : h('button', {
            class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
            onClick: () => { copy('cmd' + w.id, 'curl -s "' + w.url + '"') },
          }, t('rt.se.copyUrl')),
      h('button', {
        class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
        onClick: () => { markShell(w, 'offline') },
      }, t('rt.se.markOffline'))),
    h('div', { class: 'dshp-rt-sess-facts' },
      fact(t('rt.se.kind'), isEncryptedShell(w.shell_type) ? t('rt.se.encryptedShell') : t('rt.se.plainShell')),
      w.pass_key ? fact(t('rt.se.passKey'), h('span', { class: 'dshp-rt-mono' }, w.pass_key)) : null,
      w.asset_ip ? fact(t('rt.f.asset'), w.asset_ip) : null,
      w.privilege ? fact(t('rt.se.privilege'), w.privilege) : null,
      w.secret_ref ? fact(t('rt.se.credRef'), h('span', { class: 'dshp-rt-mono' }, w.secret_ref)) : null,
      fact(t('rt.se.lastCheck'), (w.last_check ? fmt(w.last_check) : t('rt.se.unchecked'))
        + (w.latency_ms !== null && w.latency_ms !== undefined ? '（' + w.latency_ms + 'ms）' : '')),
      w.check_note ? fact(t('rt.se.checkNote'), w.check_note) : null,
      w.note ? fact(t('rt.se.note'), w.note) : null)))

  const tunnelCards = tunnels.map((tn) => {
    const proxy = tn.listen ? 'socks5://' + tn.listen : ''
    const gogoCmd = tn.listen ? './gogo -i <CIDR> -m ss --ping -p top2,win,db --proxy ' + proxy : ''
    const fscanCmd = tn.listen ? './fscan -h <CIDR> -np -nobr -nopoc -socks5 ' + tn.listen + ' -o intranet.txt' : ''
    return h('div', { key: 't' + tn.id, class: 'dshp-rt-sess' },
      h('div', { class: 'dshp-rt-sess-head' },
        statusDot(tn.status),
        h('span', { class: 'dshp-rt-sess-title' }, tn.listen || t('rt.se.noListen')),
        h('span', { class: 'dshp-rt-tag dshp-rt-tag-passive' }, tn.kind || 'tunnel'),
        isSuo5(tn.kind) ? null : h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.se.notSuo5')),
        // 只有跨越靶标边界的通道才算突破凭证
        tn.legit === true
          ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live', title: tn.entry_kind_label || '' }, t('rt.se.targetSide'))
          : (tn.legit === false
              ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn', title: t('rt.se.selfOnlyTip') }, t('rt.se.notBreakthrough'))
              : h('span', { class: 'dshp-rt-tag', title: t('rt.se.entryKindTip') }, t('rt.se.pendingConfirm'))),
        tn.reach ? h('span', { class: 'dshp-rt-tag' }, t('rt.se.reachN', { v: tn.reach })) : null,
        h('div', { class: 'dshp-rt-spacer' }),
        assetJump(tn.asset_ip),
        h('button', {
          class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
          onClick: () => { copy('sock' + tn.id, tn.listen || '') },
        }, copied === 'sock' + tn.id ? t('rt.copiedShort') : t('rt.se.copyAddr')),
        tn.status === 'active'
          ? h('button', {
              class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
              onClick: () => { markTunnel(tn, 'down') },
            }, t('rt.se.markOffline'))
          : h('button', {
              class: 'dshp-rt-btn', type: 'button', style: { padding: '0 6px', fontSize: 11 },
              onClick: () => { markTunnel(tn, 'active') },
            }, t('rt.se.markActive'))),
      h('div', { class: 'dshp-rt-sess-facts' },
        fact(t('rt.se.targetEntry'), tn.entry || t('rt.r.unregistered')),
        fact(t('rt.se.crossBoundary'), tn.legit === true
          ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-live' }, tn.entry_kind_label || tn.entry_kind || t('rt.se.confirmedTargetSide'))
          : (tn.legit === false
              ? h('span', { class: 'dshp-rt-tag dshp-rt-tag-warn' }, t('rt.se.notBreakthroughFact'))
              : h('span', { class: 'dshp-rt-tag' }, t('rt.se.entryKindPending')))),
        tn.reach ? fact(t('rt.se.reachSeg'), tn.reach) : null,
        tn.asset_ip ? fact(t('rt.f.asset'), tn.asset_ip) : null,
        fact(t('rt.se.lastCheck'), (tn.last_check ? fmt(tn.last_check) : t('rt.se.unchecked'))
          + (tn.latency_ms !== null && tn.latency_ms !== undefined ? '（' + tn.latency_ms + 'ms）' : '')),
        tn.check_note ? fact(t('rt.se.checkNote'), tn.check_note) : null,
        tn.note ? fact(t('rt.se.note'), tn.note) : null),
      // 命令默认折叠：卡片首要信息是「这条通道能不能用、通向哪」
      tn.command
        ? h('details', { class: 'dshp-rt-sess-fold' },
            h('summary', null, t('rt.se.buildCmd')),
            h('div', {
              ...clickable(() => { copy('c' + tn.id, tn.command) }, { label: t('rt.r.copyCmd') }),
              class: 'dshp-rt-code', title: t('rt.copyThis'),
            }, copied === 'c' + tn.id ? t('rt.copiedShort') : tn.command))
        : null,
      tn.status === 'active' && tn.listen
        ? h('details', { class: 'dshp-rt-sess-fold' },
            h('summary', null, t('rt.se.scanVia')),
            h('div', { class: 'dshp-rt-sess-cmd' },
              h('div', {
                ...clickable(() => { copy('g' + tn.id, gogoCmd) }, { label: t('rt.se.copyGogo') }),
                class: 'dshp-rt-code', title: t('rt.copyThis'),
              }, copied === 'g' + tn.id ? t('rt.copiedShort') : gogoCmd),
              h('div', {
                ...clickable(() => { copy('f' + tn.id, fscanCmd) }, { label: t('rt.se.copyFscan') }),
                class: 'dshp-rt-code', style: { display: 'block', marginTop: 3 }, title: t('rt.copyThis'),
              }, copied === 'f' + tn.id ? t('rt.copiedShort') : fscanCmd)))
        : null)
  })

  return h('div', { class: 'dshp-rt-main' },
    h('div', { class: 'dshp-rt-toolbar' },
      h('span', { style: { fontWeight: 600 } }, t('rt.tab.sessions')),
      h('span', { class: 'dshp-rt-tag' }, t('rt.se.shellStat', { on: totals.webshellsOnline ?? 0, n: totals.webshells ?? 0 })),
      h('span', { class: 'dshp-rt-tag' }, t('rt.se.tunnelStat', { on: totals.tunnelsActive ?? 0, n: totals.tunnels ?? 0 })),
      h('span', { class: 'dshp-rt-tag' }, t('rt.se.credStat', { n: totals.credentials ?? 0 })),
      h('span', { class: 'dshp-rt-tag' }, t('rt.se.accessStat', { n: totals.access ?? 0 })),
      h('div', { class: 'dshp-rt-spacer' }),
      h('button', { class: 'dshp-rt-btn dshp-rt-btn-primary', type: 'button', disabled: busy, onClick: probe }, busy ? t('rt.se.probing') : t('rt.se.probe')),
      h('button', { class: 'dshp-rt-btn', type: 'button', onClick: load }, t('rt.refresh'))),
    msg !== null ? h('div', { class: msg.err !== undefined ? 'dshp-rt-err' : 'dshp-rt-foot' }, msg.err || msg.ok) : null,
    err !== null ? h('div', { class: 'dshp-rt-err' }, err) : null,
    h('div', { class: 'dshp-rt-body', style: { overflow: 'auto' } },
      shells.length === 0 && tunnels.length === 0
        ? h('div', { class: 'dshp-rt-empty' },
            h('div', null, t('rt.se.empty')),
            h('div', { style: { marginTop: 6, fontSize: 12 } }, t('rt.se.emptyHow')))
        : null,
      hints.length > 0 ? h('div', { style: { padding: '8px 10px 0' } }, hints) : null,
      h(Section, {
        tone: 'queue', title: 'WebShell',
        count: t('rt.se.shellOnline', { on: totals.webshellsOnline ?? 0, n: totals.webshells ?? 0 }),
        sub: t('rt.se.shellSub'),
        open: sessCollapse.isOpen('shells', true), onToggle: sessCollapse.toggle('shells', true),
      }, shells.length > 0
        ? h('div', { class: 'dshp-rt-sess-grid', style: { padding: 0 } }, shellCards)
        : h('div', { class: 'dshp-rt-atest-meta' }, t('rt.se.shellsEmpty'))),
      h(Section, {
        tone: 'test', title: t('rt.se.tunnelsTitle'),
        count: t('rt.se.tunnelActive', { on: totals.tunnelsActive ?? 0, n: totals.tunnels ?? 0 }),
        sub: t('rt.se.tunnelSub'),
        open: sessCollapse.isOpen('tunnels', true), onToggle: sessCollapse.toggle('tunnels', true),
      }, tunnels.length > 0
        ? h('div', { class: 'dshp-rt-sess-grid', style: { padding: 0 } }, tunnelCards)
        : h('div', { class: 'dshp-rt-atest-meta' }, t('rt.se.tunnelsEmpty')))))
}
