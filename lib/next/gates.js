/**
 * NEXT 路线放行闸（审批 + 工具调用）。
 *
 * rc.3 语义要点：
 *   - approval policy 'never' 在 decide() 派发瀑布之前就 return 'rejected'
 *     （user-approval/src/index.ts:296-301，官方防监听器旁路），所以策略必须是 ask，
 *     再由这里的 prepend 监听器在瀑布里抢答 'allowed-once' —— 先于浏览器 UI 转发器
 *     （remotes 注册晚于宿主启动），弹窗不会出现。官方先例：packages/acp/acp。
 *   - tools/pre-execute 返回 {kind:'allow'} 合法且位于外层会短路内层闸（含 plan-mode
 *     预置闸）；allow 之后仍有 checkGuards 单调拒绝层（liveshare 只读等），不可穿透。
 *   - 沙箱升级（sandbox_permissions + justification → approveEscalation）同样走
 *     approval/request 瀑布，ask 策略下被这里的监听器一并自动批准。
 */

/**
 * @param {any} ctx Cordis context
 * @param {{autoGrant?: boolean, allowTools?: boolean}} settings
 */
export function installGates(ctx, settings = {}) {
  if (settings.autoGrant !== false) {
    try {
      ctx.on("approval/request", async () => "allowed-once", { global: true, prepend: true });
    } catch (error) {
      warn(ctx, "approval gate", error);
    }
  }
  if (settings.allowTools !== false) {
    try {
      ctx.on("tools/pre-execute", async () => ({ kind: "allow" }), { global: true, prepend: true });
    } catch (error) {
      warn(ctx, "tool gate", error);
    }
  }
}

function warn(ctx, tag, error) {
  try {
    ctx.logger?.warn?.(`dsh-purge: ${tag} listener failed: ${String(error?.message ?? error)}`);
  } catch { /* 无 logger 时静默 */ }
}
