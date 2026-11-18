/**
 * NEXT 路线命令注册：/purge /rules /skills /rewind。
 * /rules 与 /skills 直接复用共享层实现（与 legacy 路线行为一致）；
 * /purge 在 NEXT 语义下没有磁盘补丁可打——状态展示 + 开关说明。
 */
import * as rules from "../rules.js";
import * as skills from "../skills.js";
import * as rewind from "../rewind.js";
import { gatherNextState } from "./modules.js";
import { hostCoreVersion } from "../shared/host-version.js";

function renderPurgeStatus(state) {
  const out = [];
  out.push("dsh-purge 状态 / Status（NEXT 纯插件路线 / pure-plugin route）");
  out.push(`  宿主 core / host    ${state.hostCoreVersion}`);
  out.push(`  DSH_HOME            ${state.dsh_home}`);
  out.push(`  注入文件 / inject   ${state.injectPath || "-"} exists=${state.injectExists}`);
  out.push(`  注入来源 / source   ${state.inject_source}${state.inject_rule_id ? ` (rule: ${state.inject_rule_id})` : ""} bytes=${state.inject_bytes}`);
  out.push("");
  out.push("  本路线无磁盘补丁：人格/审批/沙箱/话术由 cordis.patch.yml 配置层与运行时监听器生效，");
  out.push("  官方更新宿主后插件无需重新应用。开关见 profile 的 cordis.patch.yml（autoGrant/allowTools/rewritePrompt/persona/protocol）。");
  out.push("");
  out.push("规则集切换见 /rules；官方 Skill 安装见 /skills；会话回退见 /rewind。");
  return out.join("\n");
}

function renderRulesStatus(st) {
  const out = [];
  out.push("规则集 / Rule Sets");
  out.push(`  存储目录 / store  ${st.rules_dir}`);
  const targetLine = st.active
    ? `${st.agents_path} (${st.active_target})`
    : "(无激活)";
  out.push(`  目标文件 / target ${targetLine} — exists=${st.agents_exists}, synced=${st.agents_synced}`);
  out.push("");
  if (!st.rules || st.rules.length === 0) {
    out.push("  (暂无规则 / no rules — 用 /rules create <id> 或设置页新建)");
    return out.join("\n");
  }
  for (const r of st.rules) {
    const isActive = r.id === st.active;
    const label = r.name !== r.id ? `${r.name} (${r.id})` : r.id;
    out.push(`  ${isActive ? "▶" : "·"} ${label}${isActive ? " ★ 当前" : ""} [${r.target}] (${rules.formatSize(r.size)})`);
  }
  return out.join("\n");
}

function renderSkillsStatus(st) {
  const out = [];
  out.push("官方用户 Skill / $DSH_HOME/skills");
  out.push(`  ${st.skills_dir}`);
  out.push("");
  if (!st.skills.length) {
    out.push("  (暂无用户 Skill — 用 /skills import <压缩包或文件夹> 或设置页导入)");
    return out.join("\n");
  }
  for (const item of st.skills) {
    const mark = item.valid ? "·" : "!";
    const desc = item.description || "(无说明)";
    const how = item.valid
      ? [
        item.userInvocable ? `/${item.id}` : "不可 /名称",
        item.modelInvocable ? "模型可调" : "模型不可调",
      ].join(" · ")
      : "";
    out.push(`  ${mark} ${item.id}  ${desc}  (${skills.formatSize(item.size)})`);
    if (how) out.push(`      ${how}`);
    if (!item.valid && item.error) out.push(`      ${item.error}`);
  }
  return out.join("\n");
}

async function handleRulesCommand(rawInput) {
  const args = (rawInput || "").trim().split(/\s+/).filter(Boolean);
  const sub = (args[0] || "list").toLowerCase();
  const home = (await import("../shared/home.js")).findDshHome();
  switch (sub) {
    case "list":
    case "ls":
    case "s":
      return { kind: "success", text: renderRulesStatus(await rules.rulesStatus(home)) };
    case "use":
    case "activate":
    case "u": {
      const id = args[1];
      if (!id) return { kind: "error", text: "用法: /rules use <id>" };
      try {
        const meta = await rules.activateRule(home, id);
        return {
          kind: "success",
          text: `✓ 已激活规则 ${meta.name}（${id}）→ 写入 ${rules.targetPath(home, meta.target)}，并注入 systemPrompt。新会话生效。`,
        };
      } catch (e) {
        return { kind: "error", text: `激活失败: ${e.message}` };
      }
    }
    case "create":
    case "new":
    case "c": {
      const id = args[1];
      if (!id) return { kind: "error", text: "用法: /rules create <id> [别名] [AGENTS.md|CLAUDE.md]" };
      const name = args[2] || id;
      const target = args[3] || "AGENTS.md";
      if (!rules.validTarget(target)) {
        return { kind: "error", text: `无效目标: ${target}（只能是 AGENTS.md 或 CLAUDE.md）` };
      }
      try {
        await rules.saveRule(home, id, "", { name, target });
        return { kind: "success", text: `✓ 已创建规则 ${name}（${id} → ${target}）。在设置页编辑内容后保存。` };
      } catch (e) {
        return { kind: "error", text: `创建失败: ${e.message}` };
      }
    }
    case "delete":
    case "rm":
    case "d": {
      const id = args[1];
      if (!id) return { kind: "error", text: "用法: /rules delete <id>" };
      try {
        await rules.deleteRule(home, id);
        return { kind: "success", text: `✓ 已删除规则 ${id}。` };
      } catch (e) {
        return { kind: "error", text: `删除失败: ${e.message}` };
      }
    }
    case "reset":
    case "restore":
    case "还原": {
      try {
        const r = await rules.resetToOriginal(home);
        const lines = [];
        if (r.removed.length > 0) lines.push(`✓ 已删除插件写入的目标文件: ${r.removed.join(", ")}`);
        if (r.skipped.length > 0) lines.push(`⚠ 跳过（文件内容与规则不一致，可能被手动修改）: ${r.skipped.join(", ")}`);
        lines.push("已清空激活状态。规则库内容保留，随时可重新激活。");
        return { kind: "success", text: lines.join("\n") };
      } catch (e) {
        return { kind: "error", text: `还原失败: ${e.message}` };
      }
    }
    case "help":
    case "h":
    default:
      return {
        kind: "success",
        text: "规则集命令：\n" +
          "  /rules list                         列出所有规则\n" +
          "  /rules use <id>                     激活规则（写入 AGENTS.md/CLAUDE.md，并注入 systemPrompt）\n" +
          "  /rules create <id> [别名] [目标]     新建规则\n" +
          "  /rules delete <id>                  删除规则\n" +
          "  /rules reset                        还原原始状态\n" +
          "  /rules help                         显示帮助",
      };
  }
}

async function handleSkillsCommand(rawInput) {
  const args = (rawInput || "").trim().split(/\s+/).filter(Boolean);
  const sub = (args[0] || "list").toLowerCase();
  const home = (await import("../shared/home.js")).findDshHome();
  switch (sub) {
    case "list":
    case "ls":
    case "s":
      return { kind: "success", text: renderSkillsStatus(await skills.skillsStatus(home)) };
    case "create":
    case "new":
    case "c": {
      const id = args[1];
      if (!id) return { kind: "error", text: "用法: /skills create <id> [说明]" };
      if (!skills.validSkillName(id)) {
        return { kind: "error", text: "id 必须是 kebab-case，例如 code-review" };
      }
      const description = args.slice(2).join(" ").trim() || id;
      try {
        const saved = skills.toPublicSkill(home, await skills.saveSkill(home, id, "", description));
        return { kind: "success", text: `✓ 已写入官方目录 ${saved.path}\n任务对上或输入 /${id} 时由官方加载。` };
      } catch (e) {
        return { kind: "error", text: `安装失败: ${e.message}` };
      }
    }
    case "import":
    case "i": {
      const src = args.slice(1).join(" ").trim();
      if (!src) return { kind: "error", text: "用法: /skills import <压缩包或文件夹>" };
      try {
        const packed = await skills.importFromPath(home, src);
        const names = packed.imported.map((item) => item.id).join(", ");
        return { kind: "success", text: `✓ 已导入到官方 $DSH_HOME/skills：${names}` };
      } catch (e) {
        return { kind: "error", text: `导入失败: ${e.message}` };
      }
    }
    case "delete":
    case "rm":
    case "d": {
      const id = args[1];
      if (!id) return { kind: "error", text: "用法: /skills delete <id>" };
      try {
        const removed = skills.toPublicSkill(home, await skills.deleteSkill(home, id));
        return { kind: "success", text: `✓ 已从官方目录删除 ${id}${removed.backup ? `\n备份：${removed.backup}` : ""}` };
      } catch (e) {
        return { kind: "error", text: `删除失败: ${e.message}` };
      }
    }
    case "help":
    case "h":
    default:
      return {
        kind: "success",
        text: "官方 Skill 安装：\n" +
          "  /skills list                 列出 $DSH_HOME/skills\n" +
          "  /skills create <id> [说明]   写入 <id>/SKILL.md\n" +
          "  /skills import <路径>        导入压缩包或文件夹到官方目录\n" +
          "  /skills delete <id>          删除该目录\n" +
          "  也可自己删 $DSH_HOME/skills/<id>",
      };
  }
}

/** @param {any} ctx @param {object} cfg 插件 config */
export function installCommands(ctx, cfg) {
  const commands = typeof ctx.get === "function" ? ctx.get("commands") : undefined;
  if (!commands) return;
  commands.register({
    name: "purge",
    description: "dsh-purge 状态（NEXT 纯插件路线：注入来源/宿主版本/开关说明）",
    input: { hint: "status | help" },
    handler: async () => ({ kind: "success", text: renderPurgeStatus(await gatherNextState()) }),
  });
  commands.register({
    name: "rules",
    description: "规则集切换（写入 AGENTS.md/CLAUDE.md）: list | use <id> | create <id> [别名] [目标] | delete <id> | reset | help",
    input: { hint: "list | use <id> | create | delete <id> | reset" },
    handler: async (invocation) => handleRulesCommand(invocation.rawInput ?? ""),
  });
  commands.register({
    name: "skills",
    description: "官方用户 Skill（$DSH_HOME/skills）：list | import <路径> | create <id> [说明] | delete <id> | help",
    input: { hint: "list | import <路径> | create <id> | delete <id>" },
    handler: async (invocation) => handleSkillsCommand(invocation.rawInput ?? ""),
  });
  commands.register({
    name: "rewind",
    description: "回退：子代理直接回退一次；主代理 /rewind once 或 /rewind round",
    input: { hint: "once | round" },
    handler: async (invocation) => {
      const sessionId = rewind.invocationSessionId(invocation);
      const arg = String(invocation.rawInput || "").trim().split(/\s+/)[0]?.toLowerCase() || "";
      const info = await rewind.analyzeRewind(ctx, sessionId);
      if (info.ok && info.kind === "main" && arg !== "once" && arg !== "round") {
        return {
          kind: "success",
          text: "主代理请选择：/rewind once 回退一次，/rewind round 回退上一轮（含本轮子代理）。",
        };
      }
      const mode = arg === "round" ? "round" : "once";
      const result = await rewind.applyRewind(ctx, sessionId, mode);
      if (!result.ok) return { kind: "error", text: result.error };
      return { kind: "success", text: mode === "round" ? "已回退上一轮。上一句已放回输入框。" : "已回退一次。上一句已放回输入框。" };
    },
  });
}
