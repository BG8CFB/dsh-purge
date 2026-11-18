/**
 * 红队演练台样式：旧 lib/redteam/client.js 的 rt-* 样式全量迁入，
 * 统一改前缀 dshp-rt-（避免与宿主和 dsh-purge 主面板冲突）。
 *
 * 变化：去掉浮动窗（.rt-dock/拖拽条）与 #redteam-full 全屏窗形态（新骨架是右侧栏页签），
 * 新增面板根容器、SSE 连接角标与「总览」页样式；主题仍全走宿主 --dsw-alias-* 变量，暗亮自适应。
 */

/** 安装演练台样式（幂等：data-dshp-rt-style 标记查重）。@returns 卸载函数。 */
export function installRtStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  const existing = document.querySelector('style[data-dshp-rt-style]')
  if (existing !== null) return () => {}
  const style = document.createElement('style')
  style.setAttribute('data-dshp-rt-style', '1')
  style.textContent = CSS
  document.head.append(style)
  return () => { style.remove() }
}

const CSS = `
/* ── 面板根：右侧栏页签内铺满 ─────────────────────────────────────── */
.dshp-rt-root{height:100%;min-height:0;display:flex;flex-direction:column;color:var(--dsw-alias-label-primary);
  font-size:13px;line-height:1.5}
/* SSE 连接角标：live 绿点脉动 / polling 灰点 */
.dshp-rt-livebadge{display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:1px 8px;border-radius:9px;
  border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap;flex:none}
.dshp-rt-livebadge>b{width:7px;height:7px;border-radius:50%;background:#94a3b8;flex:none}
.dshp-rt-livebadge.is-live{color:#10b981;border-color:#10b98155}
.dshp-rt-livebadge.is-live>b{background:#10b981;animation:dshp-rt-pulse 1.6s ease-in-out infinite}
/* ── 头 / 页签 / 主体骨架 ───────────────────────────────────────── */
.dshp-rt-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap}
.dshp-rt-spacer{flex:1}
.dshp-rt-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:inherit;
  border-radius:6px;padding:3px 9px;font-size:12px;cursor:pointer;font-family:inherit;white-space:nowrap}
.dshp-rt-btn:hover{border-color:var(--dsw-alias-border-l2)}
.dshp-rt-btn-primary{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff}
.dshp-rt-btn-primary:hover{opacity:.9}
.dshp-rt-btn:disabled{opacity:.5;cursor:default}
.dshp-rt-tabs{display:flex;flex-wrap:wrap;gap:2px;padding:6px 12px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dshp-rt-tab{padding:8px 10px 7px;border-radius:0;cursor:pointer;font-size:12.5px;color:var(--dsw-alias-label-secondary);
  display:inline-flex;align-items:center;gap:5px;border-bottom:2px solid transparent;margin-bottom:-1px;background:transparent}
.dshp-rt-tab:hover{color:var(--dsw-alias-label-primary)}
.dshp-rt-tab.on{color:var(--dsw-alias-label-primary);background:transparent;font-weight:600;border-bottom-color:var(--dsw-alias-brand-primary,#6dbf8c)}
.dshp-rt-body{flex:1;min-height:0;display:flex;flex-direction:column}
.dshp-rt-split{flex:1;min-height:0;display:flex}
.dshp-rt-side{width:200px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);overflow:auto;padding:8px}
.dshp-rt-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.dshp-rt-seg{padding:7px 8px;border-radius:6px;cursor:pointer;margin-bottom:4px;border:1px solid transparent}
.dshp-rt-seg:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-seg.on{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-brand-primary)}
.dshp-rt-seg-cidr{font-family:ui-monospace,Menlo,monospace;font-size:12.5px}
.dshp-rt-seg-meta{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px}
.dshp-rt-toolbar{display:flex;gap:6px;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;align-items:center}
.dshp-rt-input{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:inherit;
  border-radius:6px;padding:4px 8px;font-size:12px;font-family:inherit;outline:none;min-width:0}
.dshp-rt-input:focus{border-color:var(--dsw-alias-brand-primary)}
.dshp-rt-input option{background:var(--dsw-alias-bg-layer-1,#1c1c1c);color:var(--dsw-alias-label-primary,#f2f2f2)}
.dshp-rt-table{flex:1;overflow:auto}
.dshp-rt-row{display:grid;grid-template-columns:150px 74px 104px 1.15fr 1fr;gap:8px;padding:6px 10px;
  border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;cursor:pointer;font-size:12.5px}
.dshp-rt-row:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-row.head{cursor:default;color:var(--dsw-alias-label-secondary);font-size:11.5px;font-weight:600;position:sticky;top:0;
  background:var(--dsw-alias-bg-layer-1);z-index:1}
.dshp-rt-row.head:hover{background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-mono{font-family:ui-monospace,Menlo,monospace}
.dshp-rt-tag{display:inline-block;padding:0 5px;border-radius:4px;font-size:11px;margin-right:4px;
  border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-tag-passive{color:#8b5cf6;border-color:#8b5cf655;background:#8b5cf61a}
.dshp-rt-tag-active{color:#f59e0b;border-color:#f59e0b55;background:#f59e0b1a}
.dshp-rt-tag-live{color:#10b981;border-color:#10b98155;background:#10b9811a}
.dshp-rt-tag-warn{color:#ef4444;border-color:#ef444455;background:#ef44441a}
.dshp-rt-hint{border-radius:6px;padding:7px 9px;margin-bottom:8px;font-size:11.5px;line-height:1.6;
  border:1px dashed #ef444488;background:#ef44440f;color:var(--dsw-alias-label-primary)}
.dshp-rt-hint b{color:#ef4444}
.dshp-rt-expand{grid-column:1/-1;padding:8px 4px 10px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-kv{display:flex;gap:8px;margin-bottom:3px;align-items:baseline}
.dshp-rt-kv b{color:var(--dsw-alias-label-primary);font-weight:600;min-width:64px;flex:none}
.dshp-rt-pane{flex:1;min-height:0;overflow:auto;padding:12px}
.dshp-rt-card{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:10px;margin-bottom:10px;
  background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-card h4{margin:0 0 6px;font-size:13px}
.dshp-rt-textarea{width:100%;min-height:260px;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);
  color:inherit;border-radius:6px;padding:8px;font-size:12.5px;font-family:ui-monospace,Menlo,monospace;
  line-height:1.6;resize:vertical;outline:none;box-sizing:border-box}
.dshp-rt-textarea:focus{border-color:var(--dsw-alias-brand-primary)}
.dshp-rt-list{width:210px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);overflow:auto;padding:8px}
.dshp-rt-item{padding:7px 8px;border-radius:6px;cursor:pointer;margin-bottom:4px;border:1px solid transparent}
.dshp-rt-item:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-item.on{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-brand-primary)}
.dshp-rt-item-name{font-weight:600;font-size:12.5px}
.dshp-rt-item-desc{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dshp-rt-empty{padding:24px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12.5px}
.dshp-rt-err{color:var(--dsw-alias-state-error-primary);font-size:12px;padding:6px 10px}
.dshp-rt-foot{padding:8px 12px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11px;
  color:var(--dsw-alias-label-secondary);display:flex;gap:12px;flex-wrap:wrap;align-items:center}
/* ── 徽章 ───────────────────────────────────────────────────────── */
.dshp-rt-test{display:inline-block;padding:0 5px;border-radius:4px;font-size:11px;white-space:nowrap;
  border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
.dshp-rt-test-testing{color:#f59e0b;border-color:#f59e0b55;background:#f59e0b1a}
.dshp-rt-test-tested{color:#10b981;border-color:#10b98155;background:#10b9811a}
.dshp-rt-test-blocked{color:#fff;background:#ef4444;border-color:#ef4444}
.dshp-rt-test-abandoned{color:#94a3b8;border-color:#94a3b855;background:#94a3b81a}
.dshp-rt-test-no_surface{color:#6366f1;border-color:#6366f155;background:#6366f11a}
.dshp-rt-pri{display:inline-block;padding:0 6px;border-radius:4px;font-size:11px;font-weight:600;white-space:nowrap}
.dshp-rt-pri-high{color:#fff;background:#ef4444}
.dshp-rt-pri-medium{color:#fff;background:#f59e0b}
.dshp-rt-pri-low{color:#fff;background:#94a3b8}
.dshp-rt-sev{display:inline-block;padding:0 6px;border-radius:4px;font-size:11px;font-weight:600;border:1px solid transparent}
.dshp-rt-sev-critical{color:#fff;background:#b91c1c}.dshp-rt-sev-high{color:#fff;background:#ef4444}
.dshp-rt-sev-medium{color:#7c2d12;background:#fdba74}.dshp-rt-sev-low{color:#1e3a8a;background:#bfdbfe}
.dshp-rt-sev-info{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l1)}
.dshp-rt-scope{display:inline-block;padding:0 4px;border-radius:3px;font-size:10px;font-weight:700;line-height:15px;flex:none}
.dshp-rt-scope-internal{color:#0e7490;background:#a5f3fc}
.dshp-rt-scope-external{color:#9a3412;background:#fed7aa}
.dshp-rt-scope-testing{color:#5b21b6;background:#ddd6fe}
.dshp-rt-dot-on{display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 0 3px #10b98133}
.dshp-rt-dot-off{display:inline-block;width:7px;height:7px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 3px #ef444433}
.dshp-rt-dot-unk{display:inline-block;width:7px;height:7px;border-radius:50%;background:#94a3b8;box-shadow:0 0 0 3px #94a3b833}
.dshp-rt-live-dot{width:8px;height:8px;border-radius:50%;background:#10b981;flex:none;animation:dshp-rt-pulse 1.6s ease-in-out infinite}
@keyframes dshp-rt-pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 #10b98166}50%{opacity:.5;box-shadow:0 0 0 5px #10b98100}}
/* ── 得分目标 ───────────────────────────────────────────────────── */
.dshp-rt-score-row{display:grid;grid-template-columns:16px 62px minmax(0,1fr) 116px 66px;gap:8px;padding:7px 10px;
  border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;font-size:12.5px;cursor:pointer}
.dshp-rt-score-row:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-score-row.head{cursor:default;color:var(--dsw-alias-label-secondary);font-size:11.5px;font-weight:600;
  position:sticky;top:0;background:var(--dsw-alias-bg-layer-1);z-index:1}
.dshp-rt-score-detail{grid-column:1/-1;padding:8px 4px 10px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-score-group{display:flex;align-items:center;gap:8px;padding:7px 10px 5px;margin-top:2px;
  font-size:12px;font-weight:600;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-score-group:first-child{border-top:none}
.dshp-rt-score-group .dshp-rt-sg-sub{font-weight:400;font-size:11px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-score-row .dshp-rt-scope{font-size:10.5px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-score-form{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}
.dshp-rt-score-form input,.dshp-rt-score-form select{width:100%;box-sizing:border-box}
.dshp-rt-total{font-size:20px;font-weight:700;font-family:ui-monospace,Menlo,monospace}
.dshp-rt-counted{font-family:ui-monospace,Menlo,monospace;font-size:12px;font-weight:700;color:#065f46;background:#a7f3d0;border:1px solid #10b98155;border-radius:9px;padding:0 7px}
.dshp-rt-scorepts{font-size:11.5px;font-weight:700;color:#065f46;background:#a7f3d0;border:1px solid #10b98155;
  border-radius:10px;padding:0 7px;white-space:nowrap}
.dshp-rt-gain{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:12px;
  color:#065f46;background:#a7f3d0;border:1px solid #10b98155}
.dshp-rt-hits{display:flex;flex-direction:column;gap:6px;margin-top:7px}
.dshp-rt-hit{border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #10b981;border-radius:6px;
  padding:7px 9px;background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-hit-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dshp-rt-hit-idx{width:16px;height:16px;border-radius:50%;background:#10b981;color:#fff;font-size:10.5px;font-weight:700;
  display:inline-flex;align-items:center;justify-content:center;flex:none}
.dshp-rt-hit-target{font-family:ui-monospace,Menlo,monospace;font-weight:600;font-size:12px;word-break:break-all}
.dshp-rt-hit-time{margin-left:auto;font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-hit-evi{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.65;white-space:pre-wrap;word-break:break-word;
  background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:6px 8px;margin-top:5px}
.dshp-rt-hit-note{font-size:11.5px;color:var(--dsw-alias-label-secondary);margin-top:4px}
.dshp-rt-hit-row{display:flex;flex-wrap:wrap;align-items:center;gap:2px 7px;font-size:11.5px;padding:4px 7px;border-radius:5px;
  background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);margin-bottom:3px}
.dshp-rt-hit-asset{font-family:ui-monospace,Menlo,monospace;font-weight:600;flex:0 1 auto;max-width:100%;
  overflow-wrap:anywhere;word-break:break-word}
.dshp-rt-hit-txt{flex:1 1 100%;color:var(--dsw-alias-label-primary);line-height:1.55;
  white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}
.dshp-rt-hit-txt.none{color:var(--dsw-alias-state-error-primary)}
.dshp-rt-hit-row .dshp-rt-hit-time{flex:none;margin-left:auto}
.dshp-rt-hit-row.self-created{opacity:.72;border-left:3px solid #ef444488}
.dshp-rt-hit-row.service-capped{opacity:.72;border-left:3px solid #f59e0b88}
.dshp-rt-hit-row.service-capped .dshp-rt-hit-idx{background:#f59e0b}
/* ── 会话与入口（WebShell / 隧道卡片） ──────────────────────────── */
.dshp-rt-sess-facts{display:flex;flex-direction:column;gap:2px;margin-top:5px}
.dshp-rt-sess-fact{display:flex;gap:6px;font-size:11.5px;line-height:1.5}
.dshp-rt-sess-fact>b{flex:none;min-width:62px;font-weight:600;color:var(--dsw-alias-label-secondary)}
.dshp-rt-sess-fact>span{min-width:0;overflow-wrap:anywhere}
.dshp-rt-sess-cmd{margin-top:6px}
.dshp-rt-sess-cmd>b{display:block;font-size:11px;color:var(--dsw-alias-label-secondary);margin-bottom:3px;font-weight:600}
.dshp-rt-sess-fold{margin-top:6px;font-size:11.5px}
.dshp-rt-sess-fold>summary{cursor:pointer;color:var(--dsw-alias-label-secondary);user-select:none}
.dshp-rt-sess-fold>summary:hover{color:var(--dsw-alias-label-primary)}
.dshp-rt-sess-grid{display:grid;grid-template-columns:1fr;gap:8px;padding:10px 12px}
.dshp-rt-sess{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:9px 10px;background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-sess-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dshp-rt-sess-title{font-weight:600;font-size:12.5px;font-family:ui-monospace,Menlo,monospace;word-break:break-all}
.dshp-rt-sess-sub{font-size:11.5px;color:var(--dsw-alias-label-secondary);margin-top:3px;word-break:break-word}
.dshp-rt-code{font-family:ui-monospace,Menlo,monospace;font-size:11px;background:var(--dsw-alias-bg-base);
  border:1px solid var(--dsw-alias-border-l1);border-radius:4px;padding:1px 5px;cursor:pointer;word-break:break-all}
.dshp-rt-code:hover{border-color:var(--dsw-alias-brand-primary)}
/* ── 漏洞战果 ───────────────────────────────────────────────────── */
.dshp-rt-vrow{display:grid;grid-template-columns:62px minmax(0,1fr) 132px 108px 74px 52px;gap:8px;padding:6px 10px;
  border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;font-size:12.5px;cursor:pointer}
.dshp-rt-vrow:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-vrow.head{cursor:default;color:var(--dsw-alias-label-secondary);font-size:11.5px;font-weight:600;
  position:sticky;top:0;background:var(--dsw-alias-bg-layer-1);z-index:1}
.dshp-rt-vdetail{grid-column:1/-1;padding:8px 4px 10px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-vdetail .dshp-rt-kv{margin-bottom:4px}
.dshp-rt-actions{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.dshp-rt-section{padding:8px 10px 2px;font-size:11.5px;font-weight:600;color:var(--dsw-alias-label-secondary)}
.dshp-rt-link{color:var(--dsw-alias-brand-primary);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshp-rt-link:hover{text-decoration:underline}
.dshp-rt-more{color:var(--dsw-alias-brand-primary);font-size:11.5px;cursor:pointer;user-select:none;margin-top:4px;display:inline-block}
.dshp-rt-more:hover{text-decoration:underline}
.dshp-rt-subtabs{display:flex;gap:4px;padding:6px 10px 0;border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;flex-wrap:wrap}
.dshp-rt-subtab{padding:4px 10px;border-radius:6px 6px 0 0;cursor:pointer;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-subtab.on{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);font-weight:600}
/* ── 凭据（明文直显） ───────────────────────────────────────────── */
.dshp-rt-cred{border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #f59e0b;border-radius:6px;
  padding:8px 10px;background:var(--dsw-alias-bg-layer-2);margin-bottom:7px}
.dshp-rt-cred-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dshp-rt-cred-host{font-family:ui-monospace,Menlo,monospace;font-weight:600;font-size:12.5px;word-break:break-all}
.dshp-rt-secret{font-family:ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.6;background:#fef3c7;color:#78350f;
  border:1px solid #f59e0b66;border-radius:5px;padding:6px 9px;margin-top:6px;white-space:pre-wrap;word-break:break-all;
  user-select:all;cursor:text}
.dshp-rt-secret-none{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--dsw-alias-state-error-primary);
  border:1px dashed var(--dsw-alias-state-error-primary);border-radius:5px;padding:5px 9px;margin-top:6px}
.dshp-rt-cred-meta{font-size:11.5px;color:var(--dsw-alias-label-secondary);margin-top:5px;word-break:break-word}
/* ── 结论条 / 折叠体系（L1 头 / L2 卡 / L3 长文本 / L4 子容器） ──── */
.dshp-rt-concl{display:flex;align-items:center;gap:4px;padding:6px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);
  background:var(--dsw-alias-bg-layer-2);flex-wrap:wrap}
.dshp-rt-concl-i{display:inline-flex;align-items:baseline;gap:4px;padding:2px 8px;border-radius:6px;cursor:pointer;
  border:1px solid transparent}
.dshp-rt-concl-i:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-concl-i.on{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-concl-i b{font-family:ui-monospace,Menlo,monospace;font-size:14px;font-weight:700}
.dshp-rt-concl-i>span{color:var(--dsw-alias-label-secondary);font-size:11.5px}
.dshp-rt-sec-wrap{margin:0}
.dshp-rt-sec{display:flex;align-items:center;gap:8px;padding:7px 12px 7px 9px;cursor:pointer;
  background:var(--dsw-alias-bg-layer-2);border-left:3px solid var(--dsw-alias-border-l2);
  border-top:1px solid var(--dsw-alias-border-l1);user-select:none;outline:none}
.dshp-rt-sec:hover{background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-sec:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dshp-rt-sec.flat{cursor:default}
.dshp-rt-sec.flat:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-sec-caret{flex:none;width:11px;font-size:10px;color:var(--dsw-alias-label-secondary);text-align:center}
.dshp-rt-sec-title{font-weight:600;font-size:13px;white-space:nowrap}
.dshp-rt-sec-count{font-size:11.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-sec-sub{font-size:11.5px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshp-rt-sec-right{margin-left:auto;font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap;flex:none}
.dshp-rt-sec.t-stage{border-left-color:#8b5cf6}
.dshp-rt-sec.t-target{border-left-color:#0ea5e9}
.dshp-rt-sec.t-folder{border-left-color:#64748b}
.dshp-rt-sec.t-test{border-left-color:#10b981}
.dshp-rt-sec.t-queue{border-left-color:#f59e0b}
.dshp-rt-sec.t-past{border-left-color:#94a3b8}
.dshp-rt-sec-body{margin-left:12px;border-left:1px solid var(--dsw-alias-border-l1);padding:7px 0 3px 10px}
.dshp-rt-sec-body>.dshp-rt-atest:last-child,.dshp-rt-sec-body>.dshp-rt-hit:last-child{margin-bottom:2px}
.dshp-rt-clip{margin-top:6px}
.dshp-rt-clip-head{display:flex;align-items:center;gap:6px}
.dshp-rt-clip-label{font-size:11px;color:var(--dsw-alias-label-secondary);font-weight:600}
.dshp-rt-clip-body{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.65;white-space:pre-wrap;
  word-break:break-word;background:var(--dsw-alias-bg-base);border-radius:5px;padding:6px 8px;margin-top:3px}
.dshp-rt-clip:not(.open) .dshp-rt-clip-body{max-height:46px;overflow:hidden;
  -webkit-mask-image:linear-gradient(180deg,#000 55%,transparent);mask-image:linear-gradient(180deg,#000 55%,transparent)}
.dshp-rt-clip.open .dshp-rt-clip-body{max-height:340px;overflow:auto}
.dshp-rt-sidehead{padding:7px 8px 2px;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);
  display:flex;align-items:center;gap:5px}
.dshp-rt-sidehead-btn{cursor:pointer;outline:none;padding:6px 6px 5px;border-radius:5px;user-select:none}
.dshp-rt-sidehead-btn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-sidehead-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
/* ── 证据 / HTTP 报文 ───────────────────────────────────────────── */
.dshp-rt-evi{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;overflow:hidden;margin-top:8px}
.dshp-rt-evi-head{display:flex;align-items:center;gap:8px;padding:5px 9px;background:var(--dsw-alias-bg-layer-2);
  font-size:11.5px;font-weight:600;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dshp-rt-evi-body{margin:0;padding:9px 11px;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.6;
  white-space:pre-wrap;word-break:break-word;max-height:340px;overflow:auto;background:var(--dsw-alias-bg-base)}
.dshp-rt-evi-body.req{max-height:220px}
.dshp-rt-hl-req{color:#10b981;font-weight:600}
.dshp-rt-hl-res{color:#0ea5e9;font-weight:600}
.dshp-rt-md{flex:1;overflow:auto;margin:0;padding:14px 16px;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;
  line-height:1.65;white-space:pre-wrap;word-break:break-word;background:var(--dsw-alias-bg-base)}
/* ── 截图 ───────────────────────────────────────────────────────── */
.dshp-rt-shots{margin:8px 0 4px;padding:7px 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;
  background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-shots-head{display:flex;align-items:baseline;gap:8px;font-size:11.5px;margin-bottom:6px}
.dshp-rt-shots-n{color:var(--dsw-alias-label-secondary)}
.dshp-rt-shot-row{display:flex;gap:8px;flex-wrap:wrap}
.dshp-rt-shot{display:flex;flex-direction:column;gap:3px;max-width:220px}
.dshp-rt-shot-thumb{border:1px solid var(--dsw-alias-border-l1);border-radius:5px;background:#0b1020;
  object-fit:contain;display:block;width:auto;max-width:216px}
.dshp-rt-shot-loading{display:flex;align-items:center;justify-content:center;width:150px;font-size:11px;
  color:var(--dsw-alias-label-secondary)}
.dshp-rt-shot-cap{display:flex;align-items:center;gap:5px;font-size:10.5px;overflow-wrap:anywhere}
.dshp-rt-shot-label{color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:170px}
.dshp-rt-shot-zoom{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.82);display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:10px;cursor:zoom-out;padding:18px}
.dshp-rt-shot-zoom img{max-width:96vw;max-height:86vh;border-radius:6px;box-shadow:0 18px 48px rgba(0,0,0,.5)}
.dshp-rt-shot-zoom-cap{color:#e5e7eb;font-size:12px;text-align:center;max-width:90vw;overflow-wrap:anywhere}
/* ── 攻击链（A 竖向 / B 横向） ──────────────────────────────────── */
.dshp-rt-ap{padding:10px 12px 18px;overflow:auto}
.dshp-rt-ap-stage{margin-bottom:2px}
.dshp-rt-ap-head{display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--dsw-alias-bg-layer-2);
  border-left:4px solid #64748b;border-top:1px solid var(--dsw-alias-border-l1);border-radius:6px 6px 0 0}
.dshp-rt-ap-no{width:20px;height:20px;border-radius:5px;color:#fff;font-size:11px;font-weight:700;flex:none;
  display:inline-flex;align-items:center;justify-content:center}
.dshp-rt-ap-name{font-weight:700;font-size:13.5px}
.dshp-rt-ap-en{font-size:10px;color:var(--dsw-alias-label-secondary);letter-spacing:.3px}
.dshp-rt-ap-phase{font-size:10.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-ap-goal{display:flex;align-items:baseline;gap:8px;padding:6px 10px 6px 9px;font-size:12px;
  border-left:4px solid #64748b;background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-ap-goal-tag{font-size:10.5px;font-weight:700;border:1px solid;border-radius:4px;padding:0 5px;white-space:nowrap;flex:none}
.dshp-rt-ap-result{padding:7px 10px 3px;border-left:4px solid transparent}
.dshp-rt-ap-result-head{display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap}
.dshp-rt-ap-pts{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:700;color:#065f46;background:#a7f3d0;
  border:1px solid #10b98155;border-radius:10px;padding:0 7px;white-space:nowrap}
.dshp-rt-ap-pts.off{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l1)}
.dshp-rt-ap-pts.uncounted{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l1)}
.dshp-rt-ap-nth{font-size:10.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-ap-hit{border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #10b981;border-radius:6px;
  padding:6px 9px;margin-bottom:5px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;outline:none}
.dshp-rt-ap-hit:hover{border-color:var(--dsw-alias-border-l2)}
.dshp-rt-ap-hit:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dshp-rt-ap-hit.overflow{border-left-color:#94a3b8;opacity:.75}
.dshp-rt-ap-hit-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dshp-rt-ap-hit-name{font-weight:600;font-size:12.5px}
.dshp-rt-ap-hit-target{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--dsw-alias-label-secondary);
  margin-left:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:46%}
.dshp-rt-ap-act{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:3px}
.dshp-rt-ap-act.inferred{font-style:italic;opacity:.75}
.dshp-rt-ap-none{font-size:11.5px;color:var(--dsw-alias-label-secondary);padding:2px 0 4px}
.dshp-rt-ap-trans{display:flex;align-items:center;gap:7px;padding:2px 0 2px 14px}
.dshp-rt-ap-trans-t{font-size:11px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-ap-cum{font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-ap-sub{font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);margin:6px 0 3px}
.dshp-rt-ap-assets,.dshp-rt-ap-tunnels{display:flex;flex-direction:column;gap:3px}
.dshp-rt-ap-asset{display:flex;align-items:center;gap:6px;font-size:11.5px;padding:3px 6px;border-radius:5px;
  background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}
.dshp-rt-ap-tunnel{display:flex;align-items:center;gap:6px;font-size:11.5px;padding:4px 7px;border-radius:5px;
  background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #f59e0b}
.dshp-rt-ap-h{display:flex;align-items:stretch;padding:10px 12px 14px;overflow-x:auto;flex:1;min-height:0}
.dshp-rt-ap-col{display:flex;align-items:stretch;flex:none}
.dshp-rt-ap-col-arrow{align-self:center;color:var(--dsw-alias-border-l2);padding:0 6px;font-size:12px;flex:none}
.dshp-rt-hcol{width:228px;display:flex;flex-direction:column;border:1px solid var(--dsw-alias-border-l1);
  border-top:3px solid #64748b;border-radius:7px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
.dshp-rt-hcol-goal{font-size:11px;color:var(--dsw-alias-label-secondary);padding:5px 8px;line-height:1.45;
  border-bottom:1px solid var(--dsw-alias-border-l1);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dshp-rt-hcol-body{padding:6px 8px;flex:1;min-height:0;overflow:auto}
.dshp-rt-hcol-hit{display:flex;align-items:center;gap:5px;font-size:11px;margin-bottom:3px}
.dshp-rt-hcol-hit.off{opacity:.6}
.dshp-rt-hcol-pts{font-family:ui-monospace,Menlo,monospace;font-size:10.5px;font-weight:700;color:#065f46;background:#a7f3d0;
  border-radius:7px;padding:0 5px;flex:none}
.dshp-rt-hcol-hit.off .dshp-rt-hcol-pts{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-hcol-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshp-rt-hcol-none{font-size:11px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-hcol-sub{font-size:10.5px;color:var(--dsw-alias-label-secondary);margin-bottom:2px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;gap:5px;align-items:center}
.dshp-rt-hcol-sub.off{opacity:.6}
.dshp-rt-flow-detail{margin-top:7px;padding-top:7px;border-top:1px dashed var(--dsw-alias-border-l1)}
.dshp-rt-flow-pts{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:700;color:#065f46;background:#a7f3d0;
  border:1px solid #10b98155;border-radius:10px;padding:0 8px;white-space:nowrap}
.dshp-rt-flow-pts.off{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l1)}
/* ── 报告 ───────────────────────────────────────────────────────── */
.dshp-rt-rep-list{padding:10px 12px 14px}
.dshp-rt-rep-tools{display:flex;gap:6px;justify-content:flex-end;margin-bottom:8px}
.dshp-rt-rep{border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #10b981;border-radius:8px;
  padding:9px 11px;margin-bottom:10px;background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-rep-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dshp-rt-rep-idx{font-size:15px;color:#10b981;font-weight:700;flex:none}
.dshp-rt-rep-name{font-weight:600;font-size:13px}
.dshp-rt-rep-meta{font-size:12px;margin-top:4px;color:var(--dsw-alias-label-secondary);word-break:break-word}
.dshp-rt-rep-meta b{color:var(--dsw-alias-label-primary);font-weight:600;margin-right:2px}
.dshp-rt-rep-missing{font-size:11.5px;color:var(--dsw-alias-state-error-primary);margin-top:6px;
  border:1px dashed var(--dsw-alias-state-error-primary);border-radius:5px;padding:5px 8px}
.dshp-rt-rep-req{margin-top:7px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;overflow:hidden}
.dshp-rt-rep-req-head{display:flex;align-items:center;gap:7px;padding:4px 8px;font-size:11.5px;font-weight:600;
  background:var(--dsw-alias-bg-layer-1);border-bottom:1px solid var(--dsw-alias-border-l1)}
.dshp-rt-rep-http{margin:0;padding:8px 10px;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.6;white-space:pre-wrap;word-break:break-word;max-height:240px;overflow:auto;background:var(--dsw-alias-bg-base)}
.dshp-rt-rep-group{margin-bottom:14px}
.dshp-rt-rep-stage{display:flex;align-items:center;gap:8px;padding:7px 10px;margin-bottom:7px;
  background:var(--dsw-alias-bg-layer-2);border-left:4px solid #64748b;border-radius:6px;
  cursor:pointer;outline:none;user-select:none}
.dshp-rt-rep-stage:hover{background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-rep-stage:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dshp-rt-rep-no{width:20px;height:20px;border-radius:5px;color:#fff;font-size:11px;font-weight:700;flex:none;
  display:inline-flex;align-items:center;justify-content:center}
.dshp-rt-rep-stage-name{font-weight:700;font-size:13px}
.dshp-rt-rep-stage-n{font-size:11px;color:var(--dsw-alias-label-secondary)}
.dshp-rt-rep-pts{font-size:11px;font-weight:600;padding:1px 6px;border-radius:5px;border:1px solid transparent;flex:none}
.dshp-rt-rep-body{padding-left:6px}
.dshp-rt-rep-trace{margin-top:8px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;padding:8px 10px;
  background:var(--dsw-alias-bg-base)}
.dshp-rt-rep-trace-head{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.dshp-rt-rep-trace-title{font-weight:600;font-size:12.5px}
.dshp-rt-rep-trace-how{font-size:12px;color:var(--dsw-alias-label-secondary);margin-bottom:6px}
.dshp-rt-rep-step{border-left:2px solid var(--dsw-alias-border-l1);padding:2px 0 6px 9px;margin-bottom:6px}
.dshp-rt-rep-step-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.dshp-rt-rep-step-no{width:17px;height:17px;border-radius:50%;background:var(--dsw-alias-brand-primary);color:#fff;
  font-size:10.5px;display:flex;align-items:center;justify-content:center;flex:none}
.dshp-rt-rep-step-title{font-weight:600;font-size:12.5px}
.dshp-rt-rep-step-detail{font-size:12px;color:var(--dsw-alias-label-secondary);margin-top:2px}
.dshp-rt-rep-step-cmd{font-size:11.5px;margin-top:4px;display:flex;gap:6px;align-items:flex-start;flex-wrap:wrap}
.dshp-rt-rep-step-cmd .dshp-rt-mono{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);
  border-radius:5px;padding:2px 6px;word-break:break-all}
.dshp-rt-rep-step-result{font-size:11.5px;margin-top:3px;word-break:break-word}
.dshp-rt-rep-src{margin-top:6px;padding-top:6px;border-top:1px dashed var(--dsw-alias-border-l1)}
.dshp-rt-rep-src-title{font-weight:600;font-size:12px;margin-bottom:3px}
/* ── 知识库 ─────────────────────────────────────────────────────── */
.dshp-rt-kb-filter{display:flex;align-items:center;gap:7px;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap}
.dshp-rt-kb-cats{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dshp-rt-kb-cat{display:flex;align-items:center;gap:7px;padding:7px 10px;background:var(--dsw-alias-bg-layer-2);
  border-bottom:1px solid var(--dsw-alias-border-l1);position:sticky;top:0;z-index:1}
.dshp-rt-kb-cat-name{font-weight:600;font-size:12.5px}
.dshp-rt-avail{display:inline-block;padding:0 5px;border-radius:4px;font-size:10.5px;white-space:nowrap;
  border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
.dshp-rt-avail-available{color:#10b981;border-color:#10b98155;background:#10b9811a}
.dshp-rt-avail-broken{color:#ef4444;border-color:#ef444455;background:#ef44441a}
.dshp-rt-avail-unknown{color:#94a3b8;border-color:#94a3b855;background:#94a3b81a}
.dshp-rt-modal{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center}
.dshp-rt-modal-box{width:min(560px,92vw);max-height:80vh;overflow:auto;background:var(--dsw-alias-bg-layer-1);
  border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:14px 16px;font-size:12.5px;line-height:1.7;
  box-shadow:0 18px 48px rgba(0,0,0,.35);color:var(--dsw-alias-label-primary)}
.dshp-rt-modal-box .dshp-rt-kv b{min-width:76px}
.dshp-rt-kb-check{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap;cursor:pointer}
.dshp-rt-kb{border:1px solid var(--dsw-alias-border-l1);border-radius:7px;margin:0 0 8px;overflow:hidden;
  background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-kb.open{border-color:var(--dsw-alias-brand-primary)}
.dshp-rt-kb-head{display:flex;align-items:center;gap:7px;padding:7px 9px;cursor:pointer;outline:none;flex-wrap:wrap}
.dshp-rt-kb-head:hover{background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-kb-head:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dshp-rt-kb-title{font-weight:600;font-size:12.5px;overflow-wrap:anywhere}
.dshp-rt-kb-kind{font-size:10px;font-weight:700;letter-spacing:.4px;padding:1px 5px;border-radius:4px;
  color:#fff;background:#64748b;flex:none}
.dshp-rt-kb-kind.k-exp{background:#ef4444}
.dshp-rt-kb-kind.k-poc{background:#f59e0b}
.dshp-rt-kb-kind.k-template{background:#8b5cf6}
.dshp-rt-kb-kind.k-script{background:#0ea5e9}
.dshp-rt-kb-kind.k-payload{background:#10b981}
.dshp-rt-kb-sub{font-size:11px;color:var(--dsw-alias-label-secondary);padding:0 9px 7px;overflow-wrap:anywhere}
.dshp-rt-kb-body{padding:0 9px 9px}
.dshp-rt-kb-actions{display:flex;gap:6px;margin:7px 0;flex-wrap:wrap}
.dshp-rt-kb-body .dshp-rt-kv span{overflow-wrap:anywhere;word-break:break-word}
.dshp-rt-kb-tpl{margin-top:12px;border-top:1px dashed var(--dsw-alias-border-l1);padding-top:8px}
.dshp-rt-kb-tpl-row{display:flex;align-items:center;gap:7px;font-size:11.5px;padding:3px 7px;border-radius:5px;
  background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);margin-bottom:3px}
.dshp-rt-kb-tpl-path{flex:0 1 auto;font-weight:600;overflow-wrap:anywhere}
.dshp-rt-kb-tpl-name{flex:1 1 auto;min-width:0;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
/* ── 当前测试卡 ─────────────────────────────────────────────────── */
.dshp-rt-atest{border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #10b981;border-radius:6px;
  padding:7px 10px;background:var(--dsw-alias-bg-layer-2);margin-bottom:6px}
.dshp-rt-atest.past{border-left-color:#94a3b8;opacity:.85}
.dshp-rt-atest-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dshp-rt-atest-ip{font-family:ui-monospace,Menlo,monospace;font-weight:600;font-size:12.5px;word-break:break-all}
.dshp-rt-atest-meta{font-size:11.5px;color:var(--dsw-alias-label-secondary);margin-top:3px;word-break:break-word}
.dshp-rt-atest-notes{font-family:ui-monospace,Menlo,monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;
  word-break:break-word;background:var(--dsw-alias-bg-base);border-radius:4px;padding:5px 7px;margin-top:4px;max-height:76px;overflow:auto}
/* ── 总览（作战总览） ───────────────────────────────────────────── */
.dshp-rt-ov-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;padding:10px 12px 0;align-items:stretch}
.dshp-rt-ov-tile{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:10px;background:var(--dsw-alias-bg-layer-2);
  min-width:0;overflow:hidden}
.dshp-rt-ov-title{font-weight:600;font-size:12.5px;margin-bottom:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.dshp-rt-ov-big{font-size:22px;font-weight:700;font-family:ui-monospace,Menlo,monospace;line-height:1.2}
.dshp-rt-ov-sub{font-size:11.5px;color:var(--dsw-alias-label-secondary);margin-top:3px}
.dshp-rt-stages{display:flex;align-items:stretch;gap:0;padding:10px 12px 0;overflow-x:auto}
.dshp-rt-stage-seg{flex:1 1 110px;min-width:96px;border-top:3px solid #64748b;background:var(--dsw-alias-bg-layer-2);
  padding:6px 8px;overflow:hidden}
.dshp-rt-stage-seg .dshp-rt-stage-nm{font-weight:600;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dshp-rt-stage-seg .dshp-rt-stage-cum{font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-ov-bar{height:6px;border-radius:3px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);
  overflow:hidden;margin-top:8px}
.dshp-rt-ov-bar>i{display:block;height:100%;background:var(--dsw-alias-brand-primary,#10b981)}
.dshp-rt-ov-hit{border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #10b981;border-radius:6px;
  padding:6px 9px;margin-bottom:5px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;outline:none}
.dshp-rt-ov-hit:hover{border-color:var(--dsw-alias-border-l2)}
.dshp-rt-ov-hit:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dshp-rt-ov-hit-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dshp-rt-ov-hit-name{font-weight:600;font-size:12px}
`
