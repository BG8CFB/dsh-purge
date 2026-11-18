/**
 * NEXT 审批决策链模拟（源码级验证，不触宿主）。
 *
 * 回答的问题："ask + prepend 监听器，到底能不能让所有需审批的操作静默通过？"
 *
 * 依据 rc.3 user-approval/src/index.ts 的 decide() 真实控制流复刻：
 *   ① signal.aborted → cancelled
 *   ② effectivePolicy(session) === 'never' → 派发前直接 rejected（v2 骨架翻车点）
 *   ③ waterfall('approval/request', req, () => 'unavailable') → 监听器返回值归一：
 *      合法集合 {allowed-once, rejected, cancelled, unavailable}，非法/抛错 → fail-closed
 *   ④ effectivePolicy = overrideOf(session) ?? config（会话覆盖优先）
 * 我们的放行器（lib/next/gates.js 真实注册的监听器）作为 ③ 的参与者接入。
 */
import assert from "node:assert/strict";
import { apply } from "../lib/next/index.js";

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

// ── 装配插件，取真实监听器 ──
const listeners = new Map();
const ctx = {
  get: () => undefined,
  on: (event, handler) => { listeners.set(event, handler); return () => {}; },
  logger: { warn: () => {}, debug: () => {} },
};
apply(ctx, {});

// ── rc.3 decide() 控制流复刻（含返回值归一） ──
const OUTCOMES = ["allowed-once", "rejected", "cancelled", "unavailable"];

function effectivePolicy(session, configPolicy) {
  return session?.approvalPolicy ?? configPolicy;
}

async function decide(configPolicy, session, waterfallImpl, signal) {
  if (signal?.aborted) return "cancelled";
  if (effectivePolicy(session, configPolicy) === "never") {
    return "rejected"; // 派发之前，监听器永远收不到
  }
  let outcome;
  try {
    outcome = await waterfallImpl();
  } catch {
    return "unavailable";
  }
  return OUTCOMES.includes(outcome) ? outcome : "unavailable";
}

// 瀑布实现：我们的真实监听器（prepend 位）+ 一个模拟的"下游 UI 弹窗转发器"（晚注册）
function waterfallWithOurs(req) {
  const ours = listeners.get("approval/request");
  const uiForwarder = async () => "unavailable"; // 浏览器 answerer 未连接时的官方兜底
  return ours(req, uiForwarder);
}

await check("config=ask（我们的 yml）+ 无会话覆盖：监听器 allowed-once 直通", async () => {
  const outcome = await decide("ask", {}, () => waterfallWithOurs({ toolName: "bash", callId: "c1" }));
  assert.equal(outcome, "allowed-once");
});

await check("会话播种（pinInitialPermission 用改后的 permission 表）：钉的是 ask 而非 never", async () => {
  // permission-presets 的 danger-full-access 档已被我们改为 approval: ask（config-sim 已证）
  const session = { approvalPolicy: "ask", sandboxMode: "danger-full-access" };
  const outcome = await decide("ask", session, () => waterfallWithOurs({ toolName: "write", callId: "c2" }));
  assert.equal(outcome, "allowed-once");
});

await check("never 语义演示（若有人把会话/配置弄成 never）：派发前拒绝，监听器确实收不到", async () => {
  let listenerSaw = false;
  const outcome = await decide("ask", { approvalPolicy: "never" }, async () => {
    listenerSaw = true;
    return "allowed-once";
  });
  assert.equal(outcome, "rejected");
  assert.equal(listenerSaw, false, "never 短路应在派发之前（rc.3 官方防旁路）");
});

await check("我们的返回值是契约合法值（非法返回会 fail-closed 到 unavailable 的反证）", async () => {
  const raw = await listeners.get("approval/request")({ toolName: "bash" }, async () => "unavailable");
  assert.ok(OUTCOMES.includes(raw), "监听器返回了非法值: " + raw);
});

await check("监听器抛错不炸宿主链路（decide 的 try/catch 归 unavailable）", async () => {
  const outcome = await decide("ask", {}, async () => {
    throw new Error("listener boom");
  });
  assert.equal(outcome, "unavailable");
});

// ── 工具链：pre-execute 放行短路内层闸（用真实监听器） ──
await check("tools/pre-execute：prepend allow 短路内层 deny（含 plan-mode 类内层闸）", async () => {
  const pre = listeners.get("tools/pre-execute");
  let innerRan = false;
  const decision = await pre({ name: "bash" }, async () => {
    innerRan = true;
    return { kind: "deny", reason: "plan-mode" };
  });
  assert.deepEqual(decision, { kind: "allow" });
  assert.equal(innerRan, false, "内层闸不应被触达（prepend 抢答）");
});

console.log(results.join("\n"));
const failed = results.filter((line) => line.startsWith("FAIL")).length;
console.log("");
console.log("summary: " + (results.length - failed) + " passed, " + failed + " failed");
