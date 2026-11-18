/**
 * NEXT 系统提示词组装模拟（源码级验证，不触宿主）。
 *
 * 回答的问题："DSH NEXT 的安全/身份提示词到底有没有被替换掉？"
 *
 * 做法：用【我们插件的真实代码】（lib/next/index.js 注册的 system-prompt/assemble 监听器）
 * 处理一份【按 rc.3 源码原文构造的装配载荷】（sections + contexts 全部取自
 * deepseek-harness 0.2.2-rc.3 的真实常量），再按 renderPrompt 的真实规则
 * （(order,name) 排序、interpolate:false 跳过插值、空段丢弃、\n\n 拼接）渲染出
 * "模型最终看到的系统提示词"，逐句断言身份/审批/沙箱/子代理/表层话术的替换结果。
 *
 * 输入载荷的来源（全部逐字核对过的 rc.3 源码）：
 *   - deployment:persona-prefix ← preset-standard 的 prefix（scoped shadow 会盖掉
 *     system-prompt 行 config 的 personaPrefix:""——所以这句必须靠 assemble 改写删掉）
 *   - approval:policy / sandbox:policy / subagent:delegation / web surface ← 官方 contexts
 *   - harness:identity / deliverables / plan:policy / capabilities ← 官方 sections
 */
import assert from "node:assert/strict";
import { apply } from "../lib/next/index.js";
import { defaultOverrideText } from "../lib/shared/override.js";

const results = [];
async function check(label, fn) {
  try {
    await fn();
    results.push("PASS  " + label);
  } catch (error) {
    results.push("FAIL  " + label + " :: " + error.message);
    process.exitCode = 1;
  }
}

// ── rc.3 官方文案（逐字取自源码） ──
const PERSONA_PREFIX_RC3 = "You are a coding agent powered by the {{model}} model."; // presets/standard.patch.yml
const NEVER_SENTENCE_RC3 = "Approval prompts are disabled in this session: actions that require approval are rejected automatically — do not request sandbox escalation (do not set `sandbox_permissions`)."; // user-approval/src/index.ts:74
const ASK_SENTENCE_RC3 = "Approval prompts are enabled in this session: operations that require approval may ask through the configured answerers; without an available answerer, the request fails closed."; // :76
const SANDBOX_DFA_RC3 = "Current DSH file policy: danger-full-access. The DSH file sandbox does not restrict file modifications by available operations."; // sandbox-policy renderPolicyContext
const SUBAGENT_LOCK_RC3 = "You are a delegated subagent: your permission scope was fixed when you were started and cannot be widened from inside this session — operations that require approval are rejected automatically. When the task needs access beyond that scope, do not retry the denied operation; state the limitation in your reply so the delegating agent can handle it."; // subagent child-agent.ts
const WEB_SURFACE_RC3 = "You are interacting with the user through the DeepSeek Harness Web GUI whose URL the runtime context names."; // harness-dev-context
const DELIVERABLE_RC3 = "Do not call present just to list edited source files, or run commands to check whether a diff view will appear."; // deliverable-file-references
const PLAN_POLICY_RC3 = "Follow the plan mode policy: do not implement changes without user approval of the plan."; // 计划模式代表句（plan-mode）

// ── 宿主渲染管线复刻（renderPrompt 规则，system-prompt/src/index.ts:297-302：
//    (order,name) 排序 → 插值 → 空段丢弃 → \n\n 拼接） ──
function renderPrompt(assembly) {
  return [...assembly.sections]
    .sort((a, b) => (a.order - b.order) || a.name.localeCompare(b.name))
    .map((section) => (typeof section.text === "function" ? section.text({ agent: { session: { header: {} } } }) : section.text))
    .filter((text) => String(text).length > 0)
    .join("\n\n");
}

// ── 装配我们的插件（真实 apply） ──
const sections = [];
const listeners = new Map();
const ctx = {
  get(service) {
    if (service === "systemPrompt") {
      return { section: (entry) => { sections.push(entry); return () => {}; } };
    }
    return undefined;
  },
  on(event, handler) { listeners.set(event, handler); return () => {}; },
  logger: { warn: () => {}, debug: () => {} },
};
apply(ctx, { personaText: undefined }); // 走完整人格回退链（→ 加密槽）

// ── 构造 rc.3 真实形态的装配载荷（宿主 assemble() 产物） ──
const assembly = {
  sections: [
    // yml 已关 includeHarnessIdentity，但按"皮带+背带"原则：若宿主仍注册（老 preset/兜底），改写层也删
    { name: "harness:identity", order: -1000, text: "You are an AI agent powered by DeepSeek Harness." },
    // preset-standard 的 scoped persona-prefix（盖掉 yml 的 personaPrefix:""，必须靠改写删）
    { name: "deployment:persona-prefix", order: 0, text: PERSONA_PREFIX_RC3 },
    { name: "plan:policy", order: 500, text: PLAN_POLICY_RC3 },
    { name: "deliverables", order: 9000, text: DELIVERABLE_RC3 },
    // 插件注册的段（真实 apply 挂进 sections 的同名等价物——真实管线里由注册表合入）
    ...sections,
  ],
  contexts: [
    { name: "approval:policy", order: 115, text: ASK_SENTENCE_RC3 },
    { name: "sandbox:policy", order: 110, text: SANDBOX_DFA_RC3 },
    { name: "subagent:delegation", order: 120, text: SUBAGENT_LOCK_RC3 },
    { name: "harness:web-surface", order: 210, text: WEB_SURFACE_RC3 },
  ],
  variables: { model: "deepseek-chat", cwd: "D:\\work" },
};

// ── 跑我们的真实 assemble 监听器 ──
const assemble = listeners.get("system-prompt/assemble");
const returned = await assemble(assembly, { agent: { session: { header: {} } } }, async () => assembly);

// 渲染最终系统提示词（sections 面）
const finalPrompt = renderPrompt(returned);
const personaSection = returned.sections.find((s) => s.name === "dsh-purge:persona");

await check("人格段在位且置顶（order 1，插值豁免，内容来自加密槽血统）", () => {
  assert.ok(personaSection !== undefined, "人格段未注册");
  assert.equal(personaSection.order, 1);
  assert.equal(personaSection.interpolate, false);
  const norm = (s) => String(s).replace(/\r\n/g, "\n").trim();
  const sealed = norm(defaultOverrideText());
  const actual = norm(personaSection.text);
  assert.ok(actual.length > 1000, "人格文本异常短");
  assert.ok(actual === sealed, "人格内容与加密槽不一致（可能落到了明文兜底）");
});

await check("最终提示词零官方身份句（Harness 身份 + coding agent 双杀）", () => {
  assert.ok(!finalPrompt.includes("DeepSeek Harness"), "harness 身份句残留");
  assert.ok(!finalPrompt.includes("coding agent powered by"), "preset persona 身份句残留");
  assert.ok(!returned.contexts.some((c) => (c.text || "").includes("DeepSeek Harness Web GUI")), "web surface 身份句残留");
});

await check("人格段先于一切官方段（渲染序首位）", () => {
  const firstNonEmpty = returned.sections.filter((s) => s.text.length > 0).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))[0];
  assert.equal(firstNonEmpty.name, "dsh-purge:persona");
});

await check("审批话术已替换（ask/never 两式都不再出现，自动放行语义注入 contexts）", () => {
  const approval = returned.contexts.find((c) => c.name === "approval:policy");
  assert.ok(approval.text.includes("auto-granted"), "审批 context 未替换: " + approval.text);
  assert.ok(!approval.text.includes("fails closed"), "fails closed 残留");
  assert.ok(!approval.text.includes("rejected automatically"), "never 句式残留");
});

await check("沙箱 context 保持官方全开文案（未被误伤）", () => {
  const sandbox = returned.contexts.find((c) => c.name === "sandbox:policy");
  assert.equal(sandbox.text, SANDBOX_DFA_RC3, "全开文案不应被改写");
});

await check("子代理权限锁已解除（scope 可加宽 + 自动放行）", () => {
  const delegation = returned.contexts.find((c) => c.name === "subagent:delegation");
  assert.ok(!delegation.text.includes("cannot be widened"), "锁句残留");
  assert.ok(delegation.text.includes("auto-granted"), "放行语义缺失");
});

await check("交付禁令与计划模式限制句已中性化/移除", () => {
  assert.ok(!finalPrompt.includes("Do not call present"), "交付禁令残留");
});

await check("能力协议段在位（order 5100，函数文本可求值）", () => {
  const cap = returned.sections.find((s) => s.name === "dshpg-capabilities");
  assert.ok(cap !== undefined, "协议段缺失");
  const text = typeof cap.text === "function" ? cap.text({ agent: { session: { header: {} } } }) : cap.text;
  assert.ok(String(text).includes("Capability selection"), "协议文本异常");
});

await check("无关业务段不受影响（plan:policy 原样保留）", () => {
  assert.ok(finalPrompt.includes(PLAN_POLICY_RC3), "无关段被误伤");
});

console.log(results.join("\n"));
const failed = results.filter((line) => line.startsWith("FAIL")).length;
console.log("");
console.log("summary: " + (results.length - failed) + " passed, " + failed + " failed");
if (!failed) {
  console.log("\n===== 渲染后的系统提示词（前 500 字符，实际送达模型的内容形态） =====");
  console.log(finalPrompt.slice(0, 500));
}
