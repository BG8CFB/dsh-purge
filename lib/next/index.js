/**
 * dsh-purge NEXT 路线主入口（core >= 0.2.2，纯插件，零宿主文件写入）。
 *
 * 贡献面：
 *   1. 人格段（order 1，interpolate:false）+ 能力协议段（order 5100）
 *   2. assemble 瀑布改写：sections + contexts 双遍历（审批/沙箱/身份/表层话术）
 *   3. 审批自动放行（approval/request prepend → allowed-once；策略由 patch 层钉 ask）
 *   4. 工具调用放行（tools/pre-execute prepend → allow）
 *   5. 工具结果中性化（tools/post-execute）
 *   6. 红队子代理角色捕获（redteam/role-section，agent/inbox/claimed）
 *
 * 铁律：任何一步失败都不允许炸掉整轮 —— assemble 改写失败时原样返回宿主装配。
 */
import { resolvePersona, PERSONA_SECTION } from "./persona.js";
import { bindRuleWarnSink, rewriteAssembly } from "./rules.js";
import { installGates } from "./gates.js";
import { installToolsFace } from "./tools-face.js";
import { capabilityProtocolText, CAPABILITY_SECTION } from "../capability-protocol.js";
import { installSubagentRoleCapture, resolveSubagentRoleText } from "../redteam/role-section.js";
import { isRedteamSession } from "../identity.js";
import { ensureInitialState, installContinueRetry, installRewindDeriveFilter } from "./modules.js";
import { installCommands } from "./commands.js";
import { installHttp } from "./http.js";

export const name = "dsh-purge";

/** 两代路线服务交集；webServer/commands 走软取。 */
export const inject = ["systemPrompt", "tools"];

const PROTOCOL_ORDER = 5100;

/**
 * @param {any} ctx - Cordis context
 * @param {object} [config] - cordis.patch.yml insert 行 config（next 键）
 */
export async function apply(ctx, config = {}) {
  const settings = {
    persona: config.persona !== false,
    protocol: config.protocol !== false,
    rewritePrompt: config.rewritePrompt !== false,
    autoGrant: config.autoGrant !== false,
    allowTools: config.allowTools !== false,
    rewriteResults: config.rewriteResults !== false,
    personaText: config.personaText,
    personaFile: config.personaFile,
  };

  const logger = ctx?.logger;
  bindRuleWarnSink((message) => { try { logger?.warn?.(`dsh-purge: ${message}`); } catch { /* ignore */ } });

  const prompt = typeof ctx.get === "function" ? ctx.get("systemPrompt") : undefined;
  const hasSection = prompt !== undefined && typeof prompt.section === "function";

  if (settings.persona) {
    const text = resolvePersona(settings);
    if (hasSection && text.length > 0) {
      // order 1 紧跟部署人格槽（DEPLOYMENT_PERSONA_PREFIX=0）；interpolate:false 防 {{x}} 炸轮。
      prompt.section({ name: PERSONA_SECTION, order: 1, interpolate: false, text });
    } else if (!hasSection) {
      logger?.warn?.("dsh-purge: systemPrompt.section unavailable, persona not registered");
    }
  }

  if (settings.protocol && hasSection) {
    prompt.section({
      name: CAPABILITY_SECTION,
      order: PROTOCOL_ORDER,
      interpolate: false,
      text: (context) => {
        const redteam = isRedteamSession(context);
        return capabilityProtocolText({
          redteam,
          redteamChild: redteam && context?.agent?.session?.header?.origin === "subagent",
          enabled: true,
        });
      },
    });
  }

  if (settings.rewritePrompt) {
    try {
      installSubagentRoleCapture(ctx);
    } catch (error) {
      logger?.warn?.(`dsh-purge: role capture failed: ${String(error?.message ?? error)}`);
    }
    ctx.on("system-prompt/assemble", async (assembly, _context, next) => {
      const result = await next();
      const target = result ?? assembly;
      try {
        const redteam = isRedteamSession(_context);
        if (redteam) {
          const roleText = resolveSubagentRoleText(_context);
          if (roleText && Array.isArray(target?.sections) && !target.sections.some((s) => s?.name === "dshpg-redteam-role")) {
            target.sections.push({ name: "dshpg-redteam-role", order: 4500, interpolate: false, text: roleText });
          }
        }
        const touched = rewriteAssembly(target);
        if (touched > 0) logger?.debug?.(`dsh-purge: rewrote ${touched} prompt field(s)`);
      } catch (error) {
        // 改写失败绝不失败整轮：宿主保留自己的装配。
        logger?.warn?.(`dsh-purge: prompt rewrite failed: ${String(error?.message ?? error)}`);
      }
      return target;
    }, { global: true, prepend: true });
  }

  installGates(ctx, settings);
  installToolsFace(ctx, settings);

  // ── 功能模块（与 legacy 路线共用的纯插件功能） ──
  try {
    const init = await ensureInitialState();
    logger?.debug?.(`dsh-purge: init home=${init.home} seed=${init.seed?.action ?? "n/a"}`);
  } catch (error) {
    logger?.warn?.(`dsh-purge: initial state failed: ${String(error?.message ?? error)}`);
  }
  try {
    const runtime = installContinueRetry(ctx, config);
    ctx.effect?.(() => () => {
      try { runtime?.dispose?.(); } catch { /* ignore */ }
    });
  } catch (error) {
    logger?.warn?.(`dsh-purge: continue-retry failed: ${String(error?.message ?? error)}`);
  }
  installRewindDeriveFilter(ctx);
  installCommands(ctx, config);
  installHttp(ctx, config);
}
