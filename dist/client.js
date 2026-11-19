window.__ModuleLoader__.load({
	id: "dsh-purge",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		// client/locale.ts
		/**
		* dsh-purge 客户端词典（zh / en）。
		*
		* 全部 UI 文案集中在此，组件只按 key 取词；`{name}` 形式为插值占位，
		* 由宿主 locale 服务的 t(key, params) 替换。两份词典 key 集合必须一致。
		*/
		/** 词典命名空间，同时是右侧栏页签与设置分区的标识。 */
		const NS = "dsh-purge";
		/** 中文词典（基准语言）。 */
		const zh$1 = {
			"common.loading": "加载中…",
			"common.retry": "重试",
			"common.error": "出错了",
			"common.save": "保存",
			"common.saved": "已保存",
			"common.cancel": "取消",
			"common.confirm": "确认",
			"common.delete": "删除",
			"common.close": "关闭",
			"common.bytes": "{n} 字符",
			"settings.title": "破甲",
			"settings.persona": "人格",
			"settings.rules": "规则集",
			"settings.skills": "技能",
			"settings.update": "更新",
			"settings.hint": "破甲面板负责总览与演练台；这里是全局配置：人格、规则集、技能、更新。",
			"persona.title": "注入人格（prompt-inject.md）",
			"persona.hint": "此内容会作为最高优先级指令注入每个新会话的系统提示。",
			"persona.path": "文件：{path}",
			"persona.customized": "已自定义",
			"persona.usingDefault": "使用默认人格",
			"persona.emptyWarn": "内容为空：任何路径都不会注入人格。",
			"persona.reset": "恢复默认",
			"persona.resetConfirm": "用内置默认人格覆盖当前内容？",
			"persona.resetDone": "已恢复默认人格",
			"persona.loadFail": "人格内容加载失败",
			"persona.saveFail": "人格保存失败",
			"persona.unchanged": "无改动",
			"rules.title": "规则集（AGENTS.md / CLAUDE.md 模板）",
			"rules.dir": "规则目录：{path}",
			"rules.active": "当前生效",
			"rules.newId": "规则 ID（字母数字与 ._-）",
			"rules.newName": "显示名（可选）",
			"rules.target": "目标文件",
			"rules.content": "内容（Markdown）",
			"rules.create": "创建并编辑",
			"rules.edit": "编辑",
			"rules.activate": "激活",
			"rules.activated": "已激活「{id}」，新会话生效",
			"rules.save": "保存规则",
			"rules.delete": "删除",
			"rules.deleteConfirm": "删除规则「{id}」？",
			"rules.reset": "还原出厂",
			"rules.resetConfirm": "清空全局指令并还原出厂状态？规则库保留。",
			"rules.resetDone": "已还原出厂状态",
			"rules.deleted": "已删除规则「{id}」",
			"rules.empty": "还没有规则，点「新建规则」创建第一条。",
			"rules.invalidId": "ID 只能是字母/数字开头，仅含字母数字 . _ -，最长 64 字符",
			"rules.notSynced": "目标文件与规则内容不一致，可重新激活同步",
			"rules.policyTitle": "工作区策略（cwd 指令参与注入的方式）",
			"rules.policy.fallback": "兜底（仅无全局指令时生效）",
			"rules.policy.strict": "严格（发现即提示，不自动注入）",
			"rules.policy.always": "始终（工作区指令始终参与注入）",
			"rules.policySaved": "工作区策略已更新为「{policy}」",
			"skills.title": "技能管理（$DSH_HOME/skills）",
			"skills.dir": "技能目录：{path}",
			"skills.newId": "技能 ID（kebab-case，如 web-recon）",
			"skills.newDesc": "描述（SKILL.md 摘要，可选）",
			"skills.content": "SKILL.md 内容",
			"skills.create": "创建",
			"skills.deleteConfirm": "删除技能「{id}」？",
			"skills.empty": "还没有安装技能。",
			"skills.invalidId": "ID 必须是 kebab-case（小写字母数字与连字符）",
			"skills.importTitle": "导入技能包（.zip，base64 上传）",
			"skills.importing": "导入中…",
			"skills.imported": "已导入 {n} 个技能",
			"skills.importFail": "导入失败",
			"skills.deleted": "已删除技能「{id}」",
			"skills.invalid": "无效",
			"skills.loadFail": "技能列表加载失败",
			"update.title": "更新通道",
			"update.current": "当前版本：{version}",
			"update.channel": "当前通道：{channel}",
			"update.check": "检查更新",
			"update.checking": "检查中…（最长 3 分钟）",
			"update.hasUpdate": "有新版本：{version}（当前 {current}）",
			"update.noUpdate": "已是最新（{version}）",
			"update.switchTo": "切换到{channel}",
			"update.switching": "切换中…（下载应用最长 3 分钟）",
			"update.switchConfirm": "切换到{channel}并立即下载应用？完成后需手动重启宿主。",
			"update.restartNote": "更新完成；请手动重启宿主使新版本生效。",
			"update.localSha": "本地修订：{sha}",
			"update.error": "更新检查失败",
			"update.stable": "稳定版",
			"update.beta": "测试版",
			"panel.title": "dsh-purge",
			"panel.statusTitle": "状态总览",
			"panel.overrideMissing": "（文件不存在）",
			"panel.loadFail": "状态加载失败",
			"panel.rewind": "回退本会话一轮",
			"panel.rewindOk": "已回退到上一条用户消息",
			"panel.rewindFail": "回退失败",
			"panel.noSession": "当前无会话",
			"panel.drill": "红队演练台",
			"panel.drillHint": "在左侧「破甲」面板中全宽打开演练台",
			"input.newDrillTo": "新建红队对话（{name}）",
			"input.newDrillShort": "红队对话",
			"input.newDrillPick": "新建红队对话（当前 {name}，点击选择项目）",
			"input.newDrillMenu": "在哪个项目新建演练会话",
			"input.newDrillFail": "新建红队会话失败：宿主没有可用的工作区/会话服务（看宿主日志 dsh-purge 记录）",
			"input.convertDrillTo": "转为红队演练（{name}）",
			"rewind.tooltip": "回退到上一条用户消息",
			"rewind.checking": "检查可回退性…",
			"rewind.unavailable": "不可回退",
			"rewind.ok": "已回退",
			"rewind.fail": "回退失败",
			"header.label": "dsh-purge",
			"badge.unbound": "红队 · 未绑定",
			"badge.bound": "红队 · {name} · {points} 分",
			"badge.unboundTip": "本会话尚未绑定演练项目，点击打开破甲面板绑定",
			"badge.tip": "项目：{name}｜得分 {points}｜在跑智能体 {running}/{max}（点击打开破甲面板）",
			"main.title": "破甲",
			"main.subtitle": "人格注入 · 审批放行 · 红队演练",
			"main.tab.overview": "总览",
			"main.tab.redteam": "红队演练台",
			"main.tab.blueteam": "蓝队值守台",
			"main.quick.redteam": "进入红队演练台",
			"main.settingsLink": "打开设置：人格 / 规则集 / 技能 / 更新",
			"main.settingsUnavailable": "宿主没有可用的设置外壳：请从右下角头像 → 设置进入",
			"main.panelUnavailable": "宿主没有可用的面板控制器（layout 服务）：请在左侧栏切换",
			"main.closeHint": "关闭面板，回到对话",
			"main.closeUnavailable": "宿主没有可用的面板控制器，无法从面板关闭",
			"main.doc.loadFail": "开工检查失败",
			"main.doc.title": "开工检查",
			"main.doc.services": "会话/工作区服务",
			"main.doc.servicesOk": "可用",
			"main.doc.servicesBad": "未就绪：重启 DSH NEXT 后再试",
			"main.doc.preset": "红队模式预设",
			"main.doc.presetOk": "已注册，可在会话模式里选中",
			"main.doc.presetMissing": "未注册",
			"main.doc.presetBroken": "注册失败",
			"main.doc.repair": "修复并重新注册",
			"main.doc.repairing": "修复中…",
			"main.doc.repairOk": "已重新注册，看看状态是否变绿",
			"main.doc.repairFail": "重新注册失败",
			"main.doc.projects": "项目",
			"main.doc.skills": "红队技能",
			"main.doc.agents": "并发上限",
			"main.doc.store": "事实库",
			"main.doc.flow": "演练在对话里进行：点「进入演练」直接开一个红队模式会话，第一句话你自己说；面板只负责就绪检查与入口，项目增删改在演练台的项目中心。",
			"main.doc.roles": "角色链：信息收集 → 资产梳理 → 漏洞发现 → 漏洞利用 → 内网渗透",
			"rt.pj.namePh": "例：某某科技有限公司",
			"rt.pj.scopePh": "203.0.113.0/24",
			"rt.pj.note": "目标说明（可选，写进项目元信息）",
			"rt.pj.creating": "创建中…",
			"rt.pj.createFailed": "创建项目失败",
			"rt.pj.updateFailed": "保存失败",
			"rt.pj.workspace": "工作区",
			"rt.pj.workspaceReady": "已绑定",
			"rt.pj.workspacePending": "将自动创建",
			"main.enterTitle": "进入演练",
			"main.enter": "进入演练",
			"main.enterHint": "切到该项目的工作区并打开一个红队模式会话（可直接说话）",
			"main.newSession": "新建对话",
			"main.newSessionHint": "在同一项目工作区里再开一个红队模式会话",
			"main.deleteProject": "删除项目",
			"main.deleteConfirm": "删除「{name}」？会删除项目目录（资产库/报告全在内）并移除对应工作区，不可恢复。",
			"main.noProject": "还没有项目：到「红队演练台 → 项目中心」新建一个（名称 + 授权 CIDR）",
			"main.sessionUnavailable": "当前宿主没有可用的会话服务：请点左上「新建会话」，在模式里选「红队模式」",
			"main.doc.refresh": "重新检查",
			"main.doc.repairHint": "修复只改预设里宿主已移除的写法（list-agents 子入口 / toolFilter / backgroundMode），你改过的角色提示词不动。",
			"main.doc.projectLabel": "选择项目",
			"main.doc.workspaceHint": "每个项目都会在工作区里出现一个「攻防演练 · 项目名」的工作区，目录即项目数据目录；演练会话全部开在这个工作区下。",
			"panel.notDrillTitle": "这不是演练会话",
			"panel.notDrillHint": "红队状态、得分与资产只在「红队模式」会话或已绑定项目的会话里显示。要开始演练，点下面进入，或在工作区新建会话后点输入框旁的「红队对话」。",
			"panel.goDrill": "进入演练",
			"panel.progressTitle": "本会话演练",
			"panel.points": "得分",
			"panel.stages": "阶段数",
			"panel.agents": "在跑智能体",
			"panel.noHits": "还没有命中得分点",
			"panel.bindingTitle": "本会话绑定",
			"panel.bindingNone": "未绑定项目：本会话的红队工具会先要求绑定",
			"panel.bindingBound": "已绑定：{name}",
			"panel.bindingPick": "选择项目…",
			"panel.bind": "绑定",
			"panel.unbind": "解绑",
			"panel.bindingHint": "绑定后本会话（含它派出的智能体）只读写这一个项目。",
			"panel.bindOk": "已绑定到「{name}」",
			"panel.unbindOk": "已解绑本会话",
			"panel.bindingFail": "绑定失败",
			"panel.noProjects": "还没有项目，先在破甲面板的项目中心新建一个。",
			"panel.versionMissing": "未知",
			"field.route": "路线",
			"field.hostCore": "宿主 core",
			"field.injectSource": "注入来源",
			"field.injectBytes": "注入字节",
			"field.overridePath": "人格文件",
			"field.version": "当前版本",
			"field.rule": "生效规则"
		};
		/** 英文词典（key 与 zh 完全一致）。 */
		const en$1 = {
			"common.loading": "Loading…",
			"common.retry": "Retry",
			"common.error": "Something went wrong",
			"common.save": "Save",
			"common.saved": "Saved",
			"common.cancel": "Cancel",
			"common.confirm": "Confirm",
			"common.delete": "Delete",
			"common.close": "Close",
			"common.bytes": "{n} chars",
			"settings.title": "Purge",
			"settings.persona": "Persona",
			"settings.rules": "Rule sets",
			"settings.skills": "Skills",
			"settings.update": "Update",
			"settings.hint": "The Purge panel holds the overview and the drill console; global configuration lives here: persona, rule sets, skills, updates.",
			"persona.title": "Injected persona (prompt-inject.md)",
			"persona.hint": "Injected at the highest priority into the system prompt of every new session.",
			"persona.path": "File: {path}",
			"persona.customized": "Customized",
			"persona.usingDefault": "Using built-in default",
			"persona.emptyWarn": "Content is empty: no persona is injected on any path.",
			"persona.reset": "Reset to default",
			"persona.resetConfirm": "Overwrite the current content with the built-in default persona?",
			"persona.resetDone": "Reset to the default persona",
			"persona.loadFail": "Failed to load the persona",
			"persona.saveFail": "Failed to save the persona",
			"persona.unchanged": "No changes",
			"rules.title": "Rule sets (AGENTS.md / CLAUDE.md templates)",
			"rules.dir": "Rules directory: {path}",
			"rules.active": "Active",
			"rules.newId": "Rule id (alphanumerics and ._-)",
			"rules.newName": "Display name (optional)",
			"rules.target": "Target file",
			"rules.content": "Content (Markdown)",
			"rules.create": "Create and edit",
			"rules.edit": "Edit",
			"rules.activate": "Activate",
			"rules.activated": "Activated \"{id}\"; new sessions pick it up",
			"rules.save": "Save rule",
			"rules.delete": "Delete",
			"rules.deleteConfirm": "Delete rule \"{id}\"?",
			"rules.reset": "Factory reset",
			"rules.resetConfirm": "Clear global instructions and restore factory state? The rule library is kept.",
			"rules.resetDone": "Restored factory state",
			"rules.deleted": "Deleted rule \"{id}\"",
			"rules.empty": "No rules yet — create the first one with \"New rule\".",
			"rules.invalidId": "The id must start with a letter or digit, contain only alphanumerics . _ -, and be at most 64 chars",
			"rules.notSynced": "Target file differs from the rule content; activate again to sync",
			"rules.policyTitle": "Workspace policy (how cwd instructions join the injection)",
			"rules.policy.fallback": "Fallback (only when no global instruction exists)",
			"rules.policy.strict": "Strict (report, never inject automatically)",
			"rules.policy.always": "Always (workspace instructions always join)",
			"rules.policySaved": "Workspace policy set to \"{policy}\"",
			"skills.title": "Skills ($DSH_HOME/skills)",
			"skills.dir": "Skills directory: {path}",
			"skills.newId": "Skill id (kebab-case, e.g. web-recon)",
			"skills.newDesc": "Description (SKILL.md summary, optional)",
			"skills.content": "SKILL.md content",
			"skills.create": "Create",
			"skills.deleteConfirm": "Delete skill \"{id}\"?",
			"skills.empty": "No skills installed yet.",
			"skills.invalidId": "The id must be kebab-case (lowercase alphanumerics and hyphens)",
			"skills.importTitle": "Import a skill archive (.zip, uploaded as base64)",
			"skills.importing": "Importing…",
			"skills.imported": "Imported {n} skill(s)",
			"skills.importFail": "Import failed",
			"skills.deleted": "Deleted skill \"{id}\"",
			"skills.invalid": "invalid",
			"skills.loadFail": "Failed to load skills",
			"update.title": "Update channel",
			"update.current": "Current version: {version}",
			"update.channel": "Current channel: {channel}",
			"update.check": "Check for updates",
			"update.checking": "Checking… (up to 3 minutes)",
			"update.hasUpdate": "Update available: {version} (current {current})",
			"update.noUpdate": "Up to date ({version})",
			"update.switchTo": "Switch to {channel}",
			"update.switching": "Switching… (download and apply, up to 3 minutes)",
			"update.switchConfirm": "Switch to the {channel} channel and apply now? Restart the host manually afterwards.",
			"update.restartNote": "Update applied; restart the host manually to load the new version.",
			"update.localSha": "Local revision: {sha}",
			"update.error": "Update check failed",
			"update.stable": "Stable",
			"update.beta": "Beta",
			"panel.title": "dsh-purge",
			"panel.statusTitle": "Status",
			"panel.overrideMissing": " (file missing)",
			"panel.loadFail": "Failed to load status",
			"panel.rewind": "Rewind this session one turn",
			"panel.rewindOk": "Rewound to the previous user message",
			"panel.rewindFail": "Rewind failed",
			"panel.noSession": "No active session",
			"panel.drill": "Red-team drill",
			"panel.drillHint": "Open the drill full-width in the \"Purge\" panel",
			"input.newDrillTo": "New red-team session in \"{name}\"",
			"input.newDrillShort": "Red team",
			"input.newDrillPick": "New red-team session (current: {name}; click to pick a project)",
			"input.newDrillMenu": "Pick a project for the new drill session",
			"input.newDrillFail": "Failed to create the red-team session: no workspace/session service available",
			"input.convertDrillTo": "Convert to drill ({name})",
			"rewind.tooltip": "Rewind to the previous user message",
			"rewind.checking": "Checking rewind availability…",
			"rewind.unavailable": "Rewind unavailable",
			"rewind.ok": "Rewound",
			"rewind.fail": "Rewind failed",
			"header.label": "dsh-purge",
			"badge.unbound": "Red team · unbound",
			"badge.bound": "Red team · {name} · {points} pts",
			"badge.unboundTip": "This session is not bound to a drill project; click to open the Purge panel",
			"badge.tip": "Project: {name} | score {points} | running agents {running}/{max} (click to open the panel)",
			"main.title": "Purge",
			"main.subtitle": "Persona injection · approvals · red team",
			"main.tab.overview": "Overview",
			"main.tab.redteam": "Red-team drill",
			"main.tab.blueteam": "Blue-team console",
			"main.quick.redteam": "Open the red-team drill",
			"main.settingsLink": "Open settings: persona / rules / skills / update",
			"main.settingsUnavailable": "No settings shell in this host: open it from the avatar menu → Settings",
			"main.panelUnavailable": "No panel controller (layout service) in this host: switch from the left rail",
			"main.closeHint": "Close the panel and return to the conversation",
			"main.closeUnavailable": "No panel controller in this host: cannot close from here",
			"main.doc.loadFail": "Readiness check failed",
			"main.doc.title": "Readiness check",
			"main.doc.services": "Session / workspace services",
			"main.doc.servicesOk": "available",
			"main.doc.servicesBad": "not ready: restart DSH NEXT and retry",
			"main.doc.preset": "Red-team preset",
			"main.doc.presetOk": "Registered — pickable in a session",
			"main.doc.presetMissing": "Not registered",
			"main.doc.presetBroken": "Registration failed",
			"main.doc.repair": "Repair and re-register",
			"main.doc.repairing": "Repairing…",
			"main.doc.repairOk": "Re-registered — check the status now",
			"main.doc.repairFail": "Re-registration failed",
			"main.doc.projects": "Projects",
			"main.doc.skills": "Red-team skills",
			"main.doc.agents": "Concurrency",
			"main.doc.store": "Store",
			"main.doc.flow": "Drills happen in the conversation: Enter drill opens a 红队模式 session and you type the first line. This panel only does readiness and entry; create or edit projects in the drill console.",
			"main.doc.roles": "Role chain: recon → assess → vuln-scan → exploit → internal",
			"rt.pj.namePh": "e.g. Example Technology Ltd.",
			"rt.pj.scopePh": "203.0.113.0/24",
			"rt.pj.note": "Objective (optional, stored in project metadata)",
			"rt.pj.creating": "Creating…",
			"rt.pj.createFailed": "Failed to create the project",
			"rt.pj.updateFailed": "Failed to save",
			"rt.pj.workspace": "Workspace",
			"rt.pj.workspaceReady": "linked",
			"rt.pj.workspacePending": "auto on start",
			"main.enterTitle": "Enter drill",
			"main.enter": "Enter drill",
			"main.enterHint": "Switch to this project workspace and open a red-team session",
			"main.newSession": "New session",
			"main.newSessionHint": "Open another red-team session in the same project workspace",
			"main.deleteProject": "Delete project",
			"main.deleteConfirm": "Delete \"{name}\"? This removes the project folder (assets, reports) and its workspace. It cannot be undone.",
			"main.noProject": "No projects yet: create one in drill console → Projects (name + authorized CIDR)",
			"main.sessionUnavailable": "No session service here: use New Session and pick 红队模式",
			"main.doc.refresh": "Re-check",
			"main.doc.repairHint": "Repair only removes host-removed syntax (list-agents sub-entry / toolFilter / backgroundMode); your edited role prompts are untouched.",
			"main.doc.projectLabel": "Project",
			"main.doc.workspaceHint": "Every project appears in the sidebar as a workspace named \"攻防演练 · <project>\"; its folder is the project data directory and every drill session opens there.",
			"panel.notDrillTitle": "Not a drill session",
			"panel.notDrillHint": "Red-team status, score and assets appear only in a 红队模式 session or a session bound to a project.",
			"panel.goDrill": "Enter drill",
			"panel.progressTitle": "This session",
			"panel.points": "Score",
			"panel.stages": "Stages",
			"panel.agents": "Running agents",
			"panel.noHits": "No scored hits yet",
			"panel.bindingTitle": "Session binding",
			"panel.bindingNone": "No project bound: red-team tools will ask for one first",
			"panel.bindingBound": "Bound to: {name}",
			"panel.bindingPick": "Pick a project…",
			"panel.bind": "Bind",
			"panel.unbind": "Unbind",
			"panel.bindingHint": "Once bound, this session (and its subagents) only read and write that project.",
			"panel.bindOk": "Bound to \"{name}\"",
			"panel.unbindOk": "Session unbound",
			"panel.bindingFail": "Binding failed",
			"panel.noProjects": "No projects yet — create one in the Purge panel first.",
			"panel.versionMissing": "unknown",
			"field.route": "Route",
			"field.hostCore": "Host core",
			"field.injectSource": "Injection source",
			"field.injectBytes": "Injected bytes",
			"field.overridePath": "Persona file",
			"field.version": "Version",
			"field.rule": "Active rule"
		};
		// client/shared/ui.ts
		/**
		* 极简 UI 基础设施：createElement 助手、常用小组件、全局通知（shell.overlay 用）、
		* 异步加载 hook、样式表安装。
		*
		* 约束：不 import 官方 UI 组件包（ui-primitives 不在本插件 external 里），
		* 纯手写元素 + CSS；主题全走宿主 design-platform.css 里真实存在的 --dsw-alias-* 语义变量。
		*
		* token 踩坑记录（rc.3 / NEXT 2.0.24）：
		*   - --dsw-alias-brand-primary 在暗色主题是中性近白色（bluish-50），不是品牌蓝，
		*     拿它当按钮填充色会得到「白底白字」的隐形按钮；
		*     实心按钮用 --dsw-alias-button-info-fill（deepseek-400）+ --dsw-alias-label-on-color；
		*   - --dsw-alias-label-error / --dsw-alias-fill-l1 已不存在，错误色用
		*     --dsw-alias-state-error-primary，悬停底色用 --dsw-alias-interactive-bg-hover；
		*   - 卡片底色用 --dsw-alias-bg-layer-1，边框用 --dsw-alias-border-l1。
		*/
		/** createElement 别名，全插件统一用 h(...) 组元素（与旧 client.js 风格一致）。 */
		const h = react.createElement;
		/** 创建一个插件级通知源；一次 apply 一个，Toast 与各面板共享。 */
		function createNotices() {
			let current = null;
			const listeners = /* @__PURE__ */ new Set();
			let seq = 0;
			let timer;
			const publish = () => {
				for (const listener of [...listeners]) listener();
			};
			const source = {
				report(text, tone = "info") {
					if (timer !== void 0) clearTimeout(timer);
					seq += 1;
					current = {
						seq,
						text,
						tone
					};
					publish();
					timer = setTimeout(() => {
						current = null;
						publish();
					}, 4e3);
				},
				subscribe(listener) {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				getSnapshot: () => current,
				dismiss() {
					if (timer !== void 0) clearTimeout(timer);
					current = null;
					publish();
				},
				hooks: { notice: null }
			};
			source.hooks.notice = source.getSnapshot;
			return source;
		}
		/** shell.overlay 的 Toast 主体：右下角浮动通知，点击关闭。 */
		function Toast(props) {
			const notice = (0, react.useSyncExternalStore)(props.source.subscribe, props.source.getSnapshot);
			if (notice === null) return null;
			return h("div", {
				key: notice.seq,
				class: `dshp-toast dshp-toast-${notice.tone}`,
				onClick: () => {
					props.source.dismiss();
				}
			}, notice.text);
		}
		/**
		* 通用「加载 → 就绪/出错」hook：loader 返回 ApiResult，reload 手动重拉。
		* 组件卸载后到达的结果会被丢弃。
		*/
		function useAsyncData(loader) {
			const [revision, setRevision] = (0, react.useState)(0);
			const [state, setState] = (0, react.useState)({ phase: "loading" });
			const loaderRef = (0, react.useRef)(loader);
			loaderRef.current = loader;
			(0, react.useEffect)(() => {
				let cancelled = false;
				setState({ phase: "loading" });
				loaderRef.current().then((result) => {
					if (cancelled) return;
					if (result.ok) setState({
						phase: "ready",
						data: result.data
					});
					else setState({
						phase: "error",
						error: result.error
					});
				});
				return () => {
					cancelled = true;
				};
			}, [revision]);
			return {
				state,
				reload: (0, react.useCallback)(() => {
					setRevision((n) => n + 1);
				}, []),
				setData: (0, react.useCallback)((data) => {
					setState({
						phase: "ready",
						data
					});
				}, [])
			};
		}
		/** 加载态：一行居中的省略提示。 */
		function Loading(props) {
			return h("div", { class: "dshp-loading" }, props.text);
		}
		/** 错误态：错误原文 + 可选重试按钮。 */
		function ErrorLine(props) {
			return h("div", { class: "dshp-error" }, h("span", { class: "dshp-error-text" }, props.label + (props.message ? `：${props.message}` : "")), props.onRetry === void 0 ? null : h("button", {
				class: "dshp-btn dshp-btn-ghost",
				onClick: props.onRetry,
				type: "button"
			}, props.retryText ?? "↻"));
		}
		/** 空态提示行。 */
		function EmptyHint(props) {
			return h("div", { class: "dshp-empty" }, props.text);
		}
		/**
		* 安装插件样式（幂等：data-dshp-style 标记查重）。
		* @returns 卸载函数（移除 style 元素）。
		*/
		function installStyles() {
			if (typeof document === "undefined") return () => {};
			if (document.querySelector("style[data-dshp-style]") !== null) return () => {};
			const style = document.createElement("style");
			style.setAttribute("data-dshp-style", "1");
			style.textContent = CSS$1;
			document.head.append(style);
			return () => {
				style.remove();
			};
		}
		/** 全部样式。选择器统一 dshp- 前缀，避免与宿主冲突。 */
		const CSS$1 = `
/* ---- 基础 ---- */
.dshp-root { color: var(--dsw-alias-label-primary); font-size: 13px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.dshp-section { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.dshp-section-title { font-weight: 600; color: var(--dsw-alias-label-primary); }
.dshp-hint { color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.5; }
.dshp-row { display: flex; gap: 8px; align-items: baseline; min-width: 0; }
.dshp-row-label { color: var(--dsw-alias-label-secondary); flex: none; }
.dshp-row-value { color: var(--dsw-alias-label-primary); word-break: break-all; }
.dshp-loading { color: var(--dsw-alias-label-secondary); padding: 8px 0; }
.dshp-empty { color: var(--dsw-alias-label-secondary); padding: 12px; border: 1px dashed var(--dsw-alias-border-l2); border-radius: 8px; text-align: center; }
.dshp-spacer { flex: 1 1 auto; min-width: 0; }

/* ---- 按钮 ---- */
.dshp-btn {
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-button-elevated-fill);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 4px 12px; font-size: 12px; cursor: pointer; line-height: 20px;
  font-family: inherit; white-space: nowrap;
}
.dshp-btn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-btn:disabled { opacity: .45; cursor: default; }
.dshp-btn-primary {
  border-color: transparent;
  background: var(--dsw-alias-button-info-fill);
  color: var(--dsw-alias-label-on-color);
  font-weight: 500;
}
.dshp-btn-primary:hover:not(:disabled) { background: var(--dsw-alias-button-info-hover); }
.dshp-btn-danger { color: var(--dsw-alias-state-error-primary); }
.dshp-rt-btn-danger { color: var(--dsw-alias-state-error-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent); }
.dshp-rt-btn-danger:hover { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); }
.dshp-btn-ghost { border-color: transparent; background: transparent; padding: 4px 8px; }
.dshp-btn-ghost:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-btn-icon { padding: 4px 7px; line-height: 16px; }

/* ---- 错误 ---- */
.dshp-error {
  display: flex; gap: 8px; align-items: center; padding: 8px 10px; border-radius: 8px;
  color: var(--dsw-alias-state-error-primary);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, transparent);
}
.dshp-error-text { word-break: break-all; flex: 1; }

/* ---- 输入 ---- */
.dshp-input, .dshp-textarea, .dshp-select {
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 5px 9px; font-size: 12px; font-family: inherit;
  width: 100%; box-sizing: border-box;
}
.dshp-input:focus, .dshp-textarea:focus, .dshp-select:focus {
  outline: none; border-color: var(--dsw-alias-button-info-fill);
}
.dshp-textarea { min-height: 180px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre; }
.dshp-select { width: auto; }

/* ---- 列表与卡片 ---- */
.dshp-list { display: flex; flex-direction: column; gap: 6px; }
.dshp-list-item {
  display: flex; gap: 8px; align-items: center; padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1); min-width: 0;
}
.dshp-list-item-main { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.dshp-list-item-title { display: flex; gap: 6px; align-items: center; min-width: 0; }
.dshp-list-item-name { font-weight: 600; color: var(--dsw-alias-label-primary); word-break: break-all; }
.dshp-list-item-sub { color: var(--dsw-alias-label-secondary); font-size: 12px; word-break: break-all; }
.dshp-list-actions { display: flex; gap: 4px; flex: none; }

.dshp-card {
  display: flex; flex-direction: column; gap: 10px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1); padding: 14px 16px; min-width: 0;
}
.dshp-card-head { display: flex; align-items: center; gap: 8px; }
.dshp-card-title { font-weight: 600; font-size: 13px; color: var(--dsw-alias-label-primary); }
.dshp-actions { display: flex; flex-wrap: wrap; gap: 8px; }

/* ---- 键值网格 ---- */
.dshp-grid { display: grid; grid-template-columns: minmax(88px, max-content) 1fr; gap: 6px 16px; align-items: baseline; }
.dshp-grid-key { color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dshp-grid-value { color: var(--dsw-alias-label-primary); word-break: break-all; font-size: 12.5px; }

/* ---- 标签 ---- */
.dshp-tag {
  font-size: 11px; border-radius: 5px; padding: 0 6px; line-height: 17px;
  background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); flex: none;
}
.dshp-tag-active { background: var(--dsw-alias-button-info-fill); color: var(--dsw-alias-label-on-color); }
.dshp-tag-error { color: var(--dsw-alias-state-error-primary); }

/* ---- 旧页签（设置页内嵌） ---- */
.dshp-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--dsw-alias-border-l1); padding-bottom: 8px; flex-wrap: wrap; }
.dshp-tab {
  border: none; background: transparent; color: var(--dsw-alias-label-secondary);
  font-size: 13px; cursor: pointer; padding: 4px 12px; border-radius: 8px; font-family: inherit;
}
.dshp-tab:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-tab-active { color: var(--dsw-alias-label-primary); font-weight: 600; background: var(--dsw-alias-interactive-bg-active); }

/* ---- 输入框回退按钮 ---- */
.dshp-rewind-btn {
  border: 1px solid transparent; background: transparent; color: var(--dsw-alias-label-secondary);
  border-radius: 8px; width: 28px; height: 28px; cursor: pointer; font-size: 14px; line-height: 1; padding: 0;
}
.dshp-rewind-btn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dshp-rewind-btn:disabled { opacity: .4; cursor: default; }

/* ---- Toast ---- */
.dshp-toast {
  position: fixed; right: 16px; bottom: 16px; z-index: 60; max-width: 360px; padding: 10px 14px;
  border-radius: 10px; font-size: 13px; cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,.28);
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-primary); word-break: break-all;
}
.dshp-toast-success { border-color: var(--dsw-alias-button-info-fill); }
.dshp-toast-failure { color: var(--dsw-alias-state-error-primary); }

/* ---- 工具栏与表单 ---- */
.dshp-toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.dshp-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.dshp-form { display: flex; flex-direction: column; gap: 10px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 12px; background: var(--dsw-alias-bg-layer-1); }

/* ---- 全局主面板（main 槽位） ---- */
.dshp-main { height: 100%; min-height: 0; display: flex; flex-direction: column; background: var(--dsw-alias-bg-base); }
.dshp-main-head {
  display: flex; align-items: center; gap: 12px; padding: 10px 18px; flex-wrap: wrap;
  border-bottom: 1px solid var(--dsw-alias-border-l1); flex: none;
}
.dshp-main-brand { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.dshp-main-title { font-size: 15px; font-weight: 650; color: var(--dsw-alias-label-primary); }
.dshp-main-sub { font-size: 12px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dshp-main-tabs { display: flex; gap: 2px; align-items: center; }
.dshp-main-tab {
  border: none; background: transparent; color: var(--dsw-alias-label-secondary);
  font-size: 13px; padding: 5px 12px; border-radius: 8px; cursor: pointer; font-family: inherit;
}
.dshp-main-tab:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dshp-main-tab.on { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-interactive-bg-active); font-weight: 600; }
.dshp-main-body { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.dshp-main-scroll { flex: 1; min-height: 0; overflow: auto; padding: 16px 20px 28px; display: flex; flex-direction: column; gap: 14px; }
.dshp-main-fill { flex: 1; min-height: 0; display: flex; flex-direction: column; }

/* ---- 指挥台（就绪检查网格 / 内联新建） ---- */
.dshp-check-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; }
.dshp-check {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 8px 10px;
  background: var(--dsw-alias-bg-layer-2); display: flex; flex-direction: column; gap: 3px; min-width: 0;
}
.dshp-check.ok { border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #10b981) 55%, transparent); }
.dshp-check.bad { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 55%, transparent); }
.dshp-check-key { font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.dshp-check-val { font-size: 12.5px; color: var(--dsw-alias-label-primary); font-weight: 600; word-break: break-word; }
.dshp-check.ok .dshp-check-val { color: var(--dsw-alias-state-success-primary, #10b981); }
.dshp-check.bad .dshp-check-val { color: var(--dsw-alias-state-error-primary); }
.dshp-check-detail { font-size: 11px; color: var(--dsw-alias-label-secondary); word-break: break-all;
  max-height: 34px; overflow: hidden; }
.dshp-form-inline { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 6px; }
.dshp-pj-divider { font-size: 11.5px; color: var(--dsw-alias-label-tertiary); margin: 2px 0; }
.dshp-mono-ellipsis { font-family: ui-monospace, Consolas, monospace; font-size: 11.5px; font-weight: 400;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ---- 右栏折叠块 ---- */
.dshp-details { border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 6px 10px; }
.dshp-details > summary { cursor: pointer; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dshp-details[open] > summary { margin-bottom: 6px; }

/* ---- 会话头红队状态徽章 ---- */
.dshp-badge {
  border: 1px solid color-mix(in srgb, var(--dsw-alias-button-info-fill) 40%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 12%, transparent);
  color: var(--dsw-alias-label-primary);
  border-radius: 999px; font-size: 11.5px; line-height: 18px; padding: 1px 10px;
  cursor: pointer; font-family: inherit; white-space: nowrap; max-width: 240px;
  overflow: hidden; text-overflow: ellipsis;
}
.dshp-badge:hover { background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 24%, transparent); }
.dshp-badge-idle { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); }

/* ---- 输入框右侧「红队对话」胶囊按钮 ---- */
.dshp-drill-btn {
  border: 1px solid color-mix(in srgb, var(--dsw-alias-button-info-fill) 45%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 14%, transparent);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px; font-size: 11.5px; line-height: 18px; padding: 1px 9px;
  cursor: pointer; flex: none; font-family: inherit; white-space: nowrap;
}
.dshp-drill-btn:hover { background: color-mix(in srgb, var(--dsw-alias-button-info-fill) 26%, transparent); }
.dshp-drill-wrap { position: relative; display: inline-flex; align-items: center; }
.dshp-drill-menu {
  position: fixed; transform: translateY(calc(-100% - 8px)); z-index: 70;
  min-width: 200px; max-width: 320px; max-height: 320px; overflow: auto;
  background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px; padding: 6px; box-shadow: 0 10px 28px rgba(0,0,0,.32);
  display: flex; flex-direction: column; gap: 2px;
}
.dshp-drill-menu-title { font-size: 11px; color: var(--dsw-alias-label-secondary); padding: 4px 6px 6px; }
.dshp-drill-menu-item {
  display: flex; align-items: center; gap: 6px; width: 100%; text-align: left;
  border: none; background: transparent; color: var(--dsw-alias-label-primary);
  font-size: 12.5px; padding: 6px 8px; border-radius: 7px; cursor: pointer; font-family: inherit;
}
.dshp-drill-menu-item:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dshp-drill-menu-item.on { background: var(--dsw-alias-interactive-bg-active); }
.dshp-drill-menu-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dshp-drill-menu-mark { color: var(--dsw-alias-button-info-fill); font-size: 9px; flex: none; }
.dshp-drill-menu-sub { font-size: 10.5px; color: var(--dsw-alias-label-tertiary); flex: none; }

/* ---- 侧栏「新建会话」行里的红队按钮 ---- */
.dshp-sidebar-row { display: inline-flex; align-items: center; gap: 4px; min-width: 0; }
.dshp-sidebar-drill {
  border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-button-elevated-fill);
  color: var(--dsw-alias-label-primary); border-radius: 6px; font-size: 11px; line-height: 16px;
  padding: 1px 6px; cursor: pointer; flex: none; font-family: inherit;
}
.dshp-sidebar-drill:hover { background: var(--dsw-alias-interactive-bg-hover); }

/* ---- 会话绑定行（右栏） ---- */
.dshp-bindrow { display: flex; gap: 6px; align-items: center; min-width: 0; margin-top: 4px; }
.dshp-bindrow .dshp-select { flex: 1; min-width: 0; }
.dshp-bindname { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--dsw-alias-label-primary); font-size: 12.5px; }

/* ---- 全局确认框（shell.overlay 里的 DialogHost） ---- */
.dshp-modal-mask {
  position: fixed; inset: 0; z-index: 90; background: rgba(0, 0, 0, .42);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.dshp-modal {
  width: min(420px, 100%); box-sizing: border-box;
  background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px; padding: 16px; box-shadow: 0 18px 48px rgba(0, 0, 0, .4);
  display: flex; flex-direction: column; gap: 12px;
}
.dshp-modal-text { font-size: 13px; line-height: 1.6; color: var(--dsw-alias-label-primary); white-space: pre-wrap; }
.dshp-modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
`;
		// client/shared/dialogs.tsx
		/**
		* 全局确认框（替代 window.confirm）。
		*
		* window.confirm 会阻塞渲染线程、样式与宿主格格不入，在 Electron 里还会出现
		* "页面被遮住"的观感。这里做成模块级单例 + shell.overlay 里挂一个 DialogHost：
		* 调用方 `const ok = await confirmDialog(msg, { okText, cancelText, danger })`，
		* 不阻塞、可测、和插件自己的按钮样式一致。
		*
		* 单实例语义：新的确认把旧的按取消结算，避免队列里积压看不见的弹窗。
		*/
		let current = null;
		const listeners$1 = /* @__PURE__ */ new Set();
		let seq = 0;
		function publish() {
			for (const listener of [...listeners$1]) try {
				listener();
			} catch {}
		}
		/** 弹一个确认框，返回用户是否确认。 */
		function confirmDialog(message, options) {
			const previous = current;
			if (previous !== null) {
				current = null;
				previous.resolve(false);
			}
			return new Promise((resolve) => {
				seq += 1;
				current = {
					seq,
					message,
					resolve,
					okText: options.okText,
					cancelText: options.cancelText,
					danger: options.danger === true
				};
				publish();
			});
		}
		/** 结算当前确认框（幂等）。 */
		function settle(ok) {
			const request = current;
			if (request === null) return;
			current = null;
			request.resolve(ok);
			publish();
		}
		function getSnapshot() {
			return current;
		}
		/** shell.overlay 里挂的宿主；无弹窗时渲染 null。 */
		function DialogHost() {
			const state = (0, react.useSyncExternalStore)((listener) => {
				listeners$1.add(listener);
				return () => {
					listeners$1.delete(listener);
				};
			}, getSnapshot);
			if (state === null) return null;
			return h("div", {
				key: state.seq,
				class: "dshp-modal-mask",
				role: "presentation",
				onClick: () => {
					settle(false);
				}
			}, h("div", {
				class: "dshp-modal",
				role: "dialog",
				"aria-modal": "true",
				onClick: (event) => {
					event.stopPropagation();
				}
			}, h("div", { class: "dshp-modal-text" }, state.message), h("div", { class: "dshp-modal-actions" }, h("button", {
				class: "dshp-btn",
				type: "button",
				onClick: () => {
					settle(false);
				}
			}, state.cancelText), h("button", {
				class: state.danger ? "dshp-btn dshp-btn-danger" : "dshp-btn dshp-btn-primary",
				type: "button",
				onClick: () => {
					settle(true);
				}
			}, state.okText))));
		}
		// client/shared/api.ts
		/** 分路由超时表（毫秒）。key 取路径 /dsh-purge/<key> 的第二段。 */
		const TIMEOUT_BY_KEY = {
			"status": 6e4,
			"override": 3e4,
			"update": 18e4,
			"rewind": 3e4,
			"rules": 3e4,
			"skills": 3e4,
			"skill": 3e4,
			"last-user": 3e4,
			"continue": 3e4
		};
		/** 表外路由的默认超时。 */
		const DEFAULT_TIMEOUT$2 = 3e4;
		/** 从路径推导超时：/dsh-purge/update → 'update'。 */
		function timeoutOf(path) {
			const key = path.split("/")[2] ?? "";
			return TIMEOUT_BY_KEY[key] ?? DEFAULT_TIMEOUT$2;
		}
		/** 把任意异常 / 响应归一为 ApiErr。 */
		async function toApiError$2(response, cause) {
			if (response === null) return {
				ok: false,
				error: cause instanceof DOMException && cause.name === "AbortError" ? "timeout" : cause instanceof Error ? cause.message : String(cause)
			};
			let payload = null;
			try {
				payload = await response.json();
			} catch {}
			return {
				ok: false,
				error: payload !== null && typeof payload === "object" && typeof payload.error === "string" ? payload.error : `HTTP ${response.status}`
			};
		}
		/** 发起一次 JSON 请求并归一结果；绝不抛错。 */
		async function request(path, method, body) {
			const controller = new AbortController();
			const timer = setTimeout(() => {
				controller.abort();
			}, timeoutOf(path));
			let response = null;
			try {
				response = await fetch(path, {
					method,
					headers: body === void 0 ? { accept: "application/json" } : {
						accept: "application/json",
						"content-type": "application/json"
					},
					body: body === void 0 ? void 0 : JSON.stringify(body),
					credentials: "same-origin",
					signal: controller.signal
				});
				if (!response.ok) return await toApiError$2(response, null);
				const payload = await response.json();
				if (payload !== null && typeof payload === "object" && payload.ok === false) return {
					ok: false,
					error: typeof payload.error === "string" ? payload.error : "unknown"
				};
				return {
					ok: true,
					data: payload
				};
			} catch (cause) {
				return await toApiError$2(response, cause);
			} finally {
				clearTimeout(timer);
			}
		}
		/** GET 请求。 */
		function apiGet(path) {
			return request(path, "GET");
		}
		/** POST 请求，body 序列化为 JSON。 */
		function apiPost(path, body) {
			return request(path, "POST", body);
		}
		/** 拉取状态总览。 */
		function fetchStatus() {
			return apiGet("/dsh-purge/status");
		}
		/** 读取人格（override）。 */
		function fetchOverride() {
			return apiGet("/dsh-purge/override");
		}
		/** 保存人格（POST {content}）。 */
		function saveOverride(content) {
			return apiPost("/dsh-purge/override", { content });
		}
		/** 规则集操作（op 与 body 语义见 lib/next/http.js handleRulesOp）。 */
		function rulesOp(op, body = {}) {
			return apiPost("/dsh-purge/rules", {
				op,
				...body
			});
		}
		/** 技能操作（op 与 body 语义见 lib/next/http.js handleSkillsOp）。 */
		function skillsOp(op, body = {}) {
			return apiPost("/dsh-purge/skills", {
				op,
				...body
			});
		}
		/** 检查更新（GET /dsh-purge/update）。 */
		function checkUpdate() {
			return apiGet("/dsh-purge/update");
		}
		/** 更新操作（op: channel/switch/apply 等）。 */
		function updateOp(body) {
			return apiPost("/dsh-purge/update", body);
		}
		/** 查询某会话可回退性。 */
		function fetchRewindOptions(sessionId) {
			return apiGet(`/dsh-purge/rewind/options?sessionId=${encodeURIComponent(sessionId)}`);
		}
		/** 执行回退（mode: once | round）。 */
		function applyRewind(sessionId, mode) {
			return apiPost("/dsh-purge/rewind", {
				sessionId,
				mode
			});
		}
		// client/settings/PurgeSettings.tsx
		/**
		* settings.section（id: dsh-purge）的设置页主体 —— 全插件唯一的全局配置入口。
		*
		* 四个内嵌子页（顶部页签切换）：
		*   1. 人格：override 读 / 写 / 恢复默认（GET/POST /dsh-purge/override）；
		*   2. 规则集：列表 / 新建 / 编辑 / 激活 / 删除 / 还原出厂 + 工作区策略三档（/dsh-purge/rules）；
		*   3. 技能：列表 / 新建 / 删除 / 导入 base64 zip（/dsh-purge/skills）；
		*   4. 更新通道：当前版本 / 检查更新 / stable-beta 双通道切换（/dsh-purge/update）。
		*
		* 主面板曾经有第三个页签渲染同一个组件（一份表单挂两处），已删除：
		* 全局配置只在这里，破甲面板右上 ⚙ 负责深链过来。
		*/
		function PurgeSettings(props) {
			const [tab, setTab] = (0, react.useState)("persona");
			const t = props.t;
			const tabs = [
				["persona", t("settings.persona")],
				["rules", t("settings.rules")],
				["skills", t("settings.skills")],
				["update", t("settings.update")]
			];
			return h("div", { class: "dshp-root" }, h("div", { class: "dshp-hint" }, t("settings.hint")), h("div", { class: "dshp-tabs" }, tabs.map(([key, label]) => h("button", {
				key,
				type: "button",
				class: "dshp-tab" + (tab === key ? " dshp-tab-active" : ""),
				onClick: () => {
					setTab(key);
				}
			}, label))), tab === "persona" ? h(PersonaEditor, {
				t,
				notices: props.notices
			}) : null, tab === "rules" ? h(RulesManager, {
				t,
				notices: props.notices
			}) : null, tab === "skills" ? h(SkillsManager, {
				t,
				notices: props.notices
			}) : null, tab === "update" ? h(UpdateChannel, {
				t,
				notices: props.notices
			}) : null);
		}
		function PersonaEditor(props) {
			const t = props.t;
			const { state, setData, reload } = useAsyncData(fetchOverride);
			/** 本地草稿；null 表示"跟随服务端内容"。 */
			const [draft, setDraft] = (0, react.useState)(null);
			const [saving, setSaving] = (0, react.useState)(false);
			const persist = (0, react.useCallback)((next, doneText) => {
				if (saving) return;
				setSaving(true);
				saveOverride(next).then((result) => {
					setSaving(false);
					if (result.ok) {
						setData(result.data);
						setDraft(null);
						props.notices.report(doneText, "success");
					} else props.notices.report(t("persona.saveFail") + "：" + result.error, "failure");
				});
			}, [
				saving,
				setData,
				props.notices,
				t
			]);
			if (state.phase === "loading") return h(Loading, { text: t("common.loading") });
			if (state.phase === "error") return h(ErrorLine, {
				label: t("persona.loadFail"),
				message: state.error,
				retryText: t("common.retry"),
				onRetry: reload
			});
			const meta = state.data;
			const content = draft === null ? meta.content : draft;
			const unchanged = draft === null || draft === meta.content;
			return h("div", { class: "dshp-section" }, h("div", { class: "dshp-section-title" }, t("persona.title")), h("div", { class: "dshp-hint" }, t("persona.hint")), h("div", { class: "dshp-row" }, h("span", { class: "dshp-tag" + (meta.customized ? "" : " dshp-tag-active") }, meta.customized ? t("persona.customized") : t("persona.usingDefault")), h("span", { class: "dshp-hint" }, t("persona.path", { path: meta.path }))), h("textarea", {
				class: "dshp-textarea",
				value: content,
				spellCheck: false,
				"aria-label": t("persona.title"),
				onChange: (event) => {
					setDraft(event.target.value);
				}
			}), content.trim() === "" ? h("div", { class: "dshp-error" }, t("persona.emptyWarn")) : null, h("div", { class: "dshp-toolbar" }, h("span", { class: "dshp-hint" }, t("common.bytes", { n: String(content.length) })), h("span", { class: "dshp-spacer" }), h("button", {
				class: "dshp-btn",
				type: "button",
				disabled: saving || unchanged,
				title: unchanged ? t("persona.unchanged") : void 0,
				onClick: () => {
					persist(content, t("common.saved"));
				}
			}, saving ? t("common.loading") : t("common.save")), h("button", {
				class: "dshp-btn dshp-btn-danger",
				type: "button",
				disabled: saving || meta.content === meta.defaultContent && draft === null,
				onClick: () => {
					confirmDialog(t("persona.resetConfirm"), {
						okText: t("persona.reset"),
						cancelText: t("common.cancel"),
						danger: true
					}).then((ok) => {
						if (ok) persist(meta.defaultContent, t("persona.resetDone"));
					});
				}
			}, t("persona.reset"))));
		}
		/** 后端 lib/rules.js 的 RULE_ID_RE。 */
		const RULE_ID_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/;
		function RulesManager(props) {
			const t = props.t;
			const { state, reload, setData } = useAsyncData(() => apiGet("/dsh-purge/rules"));
			const [draft, setDraft] = (0, react.useState)(null);
			const [draftSaving, setDraftSaving] = (0, react.useState)(false);
			const [newId, setNewId] = (0, react.useState)("");
			const [idError, setIdError] = (0, react.useState)("");
			const [policyBusy, setPolicyBusy] = (0, react.useState)(false);
			const openRule = (0, react.useCallback)((id) => {
				rulesOp("read", { id }).then((result) => {
					if (result.ok) setDraft({
						id: result.data.id,
						name: result.data.name,
						target: result.data.target,
						content: result.data.content
					});
					else props.notices.report(result.error, "failure");
				});
			}, [props.notices]);
			const createRule = (0, react.useCallback)(() => {
				const id = newId.trim();
				if (!RULE_ID_RE.test(id)) {
					setIdError(t("rules.invalidId"));
					return;
				}
				setIdError("");
				rulesOp("save", {
					id,
					content: ""
				}).then((result) => {
					if (result.ok) {
						setNewId("");
						reload();
						openRule(id);
					} else props.notices.report(result.error, "failure");
				});
			}, [
				newId,
				t,
				reload,
				openRule,
				props.notices
			]);
			const saveDraft = (0, react.useCallback)(() => {
				if (draft === null || draftSaving) return;
				setDraftSaving(true);
				rulesOp("save", {
					id: draft.id,
					content: draft.content,
					name: draft.name,
					target: draft.target
				}).then((result) => {
					setDraftSaving(false);
					if (result.ok) {
						props.notices.report(t("common.saved"), "success");
						reload();
					} else props.notices.report(result.error, "failure");
				});
			}, [
				draft,
				draftSaving,
				props.notices,
				t,
				reload
			]);
			const activate = (0, react.useCallback)((id) => {
				rulesOp("activate", { id }).then((result) => {
					if (result.ok) {
						props.notices.report(t("rules.activated", { id }), "success");
						reload();
					} else props.notices.report(result.error, "failure");
				});
			}, [
				props.notices,
				t,
				reload
			]);
			const remove = (0, react.useCallback)((id) => {
				confirmDialog(t("rules.deleteConfirm", { id }), {
					okText: t("common.delete"),
					cancelText: t("common.cancel"),
					danger: true
				}).then((ok) => {
					if (!ok) return;
					rulesOp("delete", { id }).then((result) => {
						if (result.ok) {
							props.notices.report(t("rules.deleted", { id }), "success");
							setDraft((prev) => prev !== null && prev.id === id ? null : prev);
							reload();
						} else props.notices.report(result.error, "failure");
					});
				});
			}, [
				t,
				props.notices,
				reload
			]);
			const factoryReset = (0, react.useCallback)(() => {
				confirmDialog(t("rules.resetConfirm"), {
					okText: t("rules.reset"),
					cancelText: t("common.cancel"),
					danger: true
				}).then((ok) => {
					if (!ok) return;
					rulesOp("reset").then((result) => {
						if (result.ok) {
							props.notices.report(t("rules.resetDone"), "success");
							reload();
						} else props.notices.report(result.error, "failure");
					});
				});
			}, [
				t,
				props.notices,
				reload
			]);
			const setPolicy = (0, react.useCallback)((policy) => {
				if (state.phase !== "ready" || policyBusy) return;
				setPolicyBusy(true);
				rulesOp("set-policy", { policy }).then((result) => {
					setPolicyBusy(false);
					if (result.ok) {
						setData({
							...state.data,
							workspace_policy: policy
						});
						props.notices.report(t("rules.policySaved", { policy }), "success");
					} else props.notices.report(result.error, "failure");
				});
			}, [
				state,
				policyBusy,
				props.notices,
				t,
				setData
			]);
			if (state.phase === "loading") return h(Loading, { text: t("common.loading") });
			if (state.phase === "error") return h(ErrorLine, {
				label: t("common.error"),
				message: state.error,
				retryText: t("common.retry"),
				onRetry: reload
			});
			const status = state.data;
			const rules = status.rules ?? [];
			const policies = status.workspace_policies ?? [
				"fallback",
				"strict",
				"always"
			];
			return h("div", { class: "dshp-section" }, h("div", { class: "dshp-section-title" }, t("rules.title")), h("div", { class: "dshp-hint" }, t("rules.dir", { path: status.rules_dir })), h("div", { class: "dshp-form" }, h("div", { class: "dshp-field" }, h("span", { class: "dshp-hint" }, t("rules.newId")), h("div", { class: "dshp-row" }, h("input", {
				class: "dshp-input",
				value: newId,
				placeholder: "my-rule",
				onChange: (event) => {
					setNewId(event.target.value);
				}
			}), h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				disabled: newId.trim() === "",
				onClick: createRule
			}, t("rules.create"))), idError === "" ? null : h("span", { class: "dshp-error" }, idError))), draft !== null ? h("div", { class: "dshp-form" }, h("div", { class: "dshp-row" }, h("strong", null, draft.id), h("span", { class: "dshp-spacer" }), h("button", {
				class: "dshp-btn dshp-btn-ghost",
				type: "button",
				onClick: () => {
					setDraft(null);
				}
			}, t("common.close"))), h("div", { class: "dshp-field" }, h("span", { class: "dshp-hint" }, t("rules.newName")), h("input", {
				class: "dshp-input",
				value: draft.name,
				onChange: (event) => {
					setDraft({
						...draft,
						name: event.target.value
					});
				}
			})), h("div", { class: "dshp-field" }, h("span", { class: "dshp-hint" }, t("rules.target")), h("select", {
				class: "dshp-select",
				value: draft.target,
				onChange: (event) => {
					setDraft({
						...draft,
						target: event.target.value
					});
				}
			}, ["AGENTS.md", "CLAUDE.md"].map((target) => h("option", {
				key: target,
				value: target
			}, target)))), h("div", { class: "dshp-field" }, h("span", { class: "dshp-hint" }, t("rules.content")), h("textarea", {
				class: "dshp-textarea",
				value: draft.content,
				spellCheck: false,
				onChange: (event) => {
					setDraft({
						...draft,
						content: event.target.value
					});
				}
			})), h("div", { class: "dshp-toolbar" }, h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				disabled: draftSaving,
				onClick: saveDraft
			}, draftSaving ? t("common.loading") : t("rules.save")))) : null, rules.length === 0 ? h(EmptyHint, { text: t("rules.empty") }) : h("div", { class: "dshp-list" }, rules.map((rule) => {
				const isActive = status.active === rule.id;
				return h("div", {
					key: rule.id,
					class: "dshp-list-item"
				}, h("div", { class: "dshp-list-item-main" }, h("div", { class: "dshp-list-item-title" }, h("span", { class: "dshp-list-item-name" }, rule.name === "" ? rule.id : rule.name), isActive ? h("span", { class: "dshp-tag dshp-tag-active" }, t("rules.active")) : null, h("span", { class: "dshp-tag" }, rule.target)), h("div", { class: "dshp-list-item-sub" }, rule.id + " · " + rule.size + " B")), h("div", { class: "dshp-list-actions" }, isActive ? null : h("button", {
					class: "dshp-btn",
					type: "button",
					onClick: () => {
						activate(rule.id);
					}
				}, t("rules.activate")), h("button", {
					class: "dshp-btn",
					type: "button",
					onClick: () => {
						openRule(rule.id);
					}
				}, t("rules.edit")), h("button", {
					class: "dshp-btn dshp-btn-danger",
					type: "button",
					onClick: () => {
						remove(rule.id);
					}
				}, t("rules.delete"))));
			})), status.active !== null && status.agents_exists && !status.agents_synced ? h("div", { class: "dshp-hint" }, t("rules.notSynced")) : null, h("div", { class: "dshp-form" }, h("span", { class: "dshp-hint" }, t("rules.policyTitle")), policies.map((policy) => h("label", {
				key: policy,
				class: "dshp-row"
			}, h("input", {
				type: "radio",
				name: "dshp-policy",
				value: policy,
				disabled: policyBusy,
				checked: status.workspace_policy === policy,
				onChange: () => {
					setPolicy(policy);
				}
			}), h("span", null, t("rules.policy." + policy))))), h("div", { class: "dshp-toolbar" }, h("span", { class: "dshp-spacer" }), h("button", {
				class: "dshp-btn dshp-btn-danger",
				type: "button",
				onClick: factoryReset
			}, t("rules.reset"))));
		}
		/** 后端 lib/skills.js 的 SKILL_NAME_RE。 */
		const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		function SkillsManager(props) {
			const t = props.t;
			const { state, reload } = useAsyncData(() => apiGet("/dsh-purge/skills"));
			const [newId, setNewId] = (0, react.useState)("");
			const [newDesc, setNewDesc] = (0, react.useState)("");
			const [newContent, setNewContent] = (0, react.useState)("");
			const [creating, setCreating] = (0, react.useState)(false);
			const [idError, setIdError] = (0, react.useState)("");
			const [importing, setImporting] = (0, react.useState)(false);
			const create = (0, react.useCallback)(() => {
				const id = newId.trim();
				if (!SKILL_NAME_RE.test(id)) {
					setIdError(t("skills.invalidId"));
					return;
				}
				setIdError("");
				if (creating) return;
				setCreating(true);
				skillsOp("save", {
					id,
					content: newContent,
					description: newDesc
				}).then((result) => {
					setCreating(false);
					if (result.ok) {
						props.notices.report(t("common.saved"), "success");
						setNewId("");
						setNewDesc("");
						setNewContent("");
						reload();
					} else props.notices.report(result.error, "failure");
				});
			}, [
				newId,
				newDesc,
				newContent,
				creating,
				t,
				props.notices,
				reload
			]);
			const remove = (0, react.useCallback)((id) => {
				confirmDialog(t("skills.deleteConfirm", { id }), {
					okText: t("common.delete"),
					cancelText: t("common.cancel"),
					danger: true
				}).then((ok) => {
					if (!ok) return;
					skillsOp("delete", { id }).then((result) => {
						if (result.ok) {
							props.notices.report(t("skills.deleted", { id }), "success");
							reload();
						} else props.notices.report(result.error, "failure");
					});
				});
			}, [
				t,
				props.notices,
				reload
			]);
			const importArchive = (0, react.useCallback)((file) => {
				if (importing) return;
				setImporting(true);
				const reader = new FileReader();
				reader.onerror = () => {
					setImporting(false);
					props.notices.report(t("skills.importFail") + "：read error", "failure");
				};
				reader.onload = () => {
					const bytes = new Uint8Array(reader.result);
					let binary = "";
					const CHUNK = 32768;
					for (let i = 0; i < bytes.length; i += CHUNK) binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
					skillsOp("import", {
						data: btoa(binary),
						name: file.name
					}).then((result) => {
						setImporting(false);
						if (result.ok) {
							props.notices.report(t("skills.imported", { n: String(result.data.imported.length) }), "success");
							reload();
						} else props.notices.report(t("skills.importFail") + "：" + result.error, "failure");
					});
				};
				reader.readAsArrayBuffer(file);
			}, [
				importing,
				props.notices,
				t,
				reload
			]);
			if (state.phase === "loading") return h(Loading, { text: t("common.loading") });
			if (state.phase === "error") return h(ErrorLine, {
				label: t("skills.loadFail"),
				message: state.error,
				retryText: t("common.retry"),
				onRetry: reload
			});
			const status = state.data;
			const skills = status.skills ?? [];
			return h("div", { class: "dshp-section" }, h("div", { class: "dshp-section-title" }, t("skills.title")), h("div", { class: "dshp-hint" }, t("skills.dir", { path: status.skills_dir })), h("div", { class: "dshp-form" }, h("span", { class: "dshp-hint" }, t("skills.importTitle")), h("label", { class: "dshp-row" }, h("input", {
				class: "dshp-input",
				type: "file",
				accept: ".zip",
				disabled: importing,
				onChange: (event) => {
					const file = event.target.files !== null ? event.target.files[0] : void 0;
					if (file !== void 0) importArchive(file)(event.target).value = "";
				}
			}), importing ? h("span", { class: "dshp-hint" }, t("skills.importing")) : null)), h("div", { class: "dshp-form" }, h("div", { class: "dshp-field" }, h("span", { class: "dshp-hint" }, t("skills.newId")), h("input", {
				class: "dshp-input",
				value: newId,
				placeholder: "web-recon",
				onChange: (event) => {
					setNewId(event.target.value);
				}
			}), idError === "" ? null : h("span", { class: "dshp-error" }, idError)), h("div", { class: "dshp-field" }, h("span", { class: "dshp-hint" }, t("skills.newDesc")), h("input", {
				class: "dshp-input",
				value: newDesc,
				onChange: (event) => {
					setNewDesc(event.target.value);
				}
			})), h("div", { class: "dshp-field" }, h("span", { class: "dshp-hint" }, t("skills.content")), h("textarea", {
				class: "dshp-textarea",
				value: newContent,
				spellCheck: false,
				onChange: (event) => {
					setNewContent(event.target.value);
				}
			})), h("div", { class: "dshp-toolbar" }, h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				disabled: creating || newId.trim() === "" || newContent.trim() === "",
				onClick: create
			}, creating ? t("common.loading") : t("skills.create")))), skills.length === 0 ? h(EmptyHint, { text: t("skills.empty") }) : h("div", { class: "dshp-list" }, skills.map((skill) => h("div", {
				key: skill.id,
				class: "dshp-list-item"
			}, h("div", { class: "dshp-list-item-main" }, h("div", { class: "dshp-list-item-title" }, h("span", { class: "dshp-list-item-name" }, skill.id), skill.valid ? null : h("span", { class: "dshp-tag dshp-tag-error" }, t("skills.invalid")), h("span", { class: "dshp-tag" }, skill.kind)), h("div", { class: "dshp-list-item-sub" }, skill.description === "" ? skill.path : skill.description + " · " + skill.size + " B")), h("div", { class: "dshp-list-actions" }, h("button", {
				class: "dshp-btn dshp-btn-danger",
				type: "button",
				onClick: () => {
					remove(skill.id);
				}
			}, t("common.delete")))))));
		}
		function UpdateChannel(props) {
			const t = props.t;
			const { state, setData, reload } = useAsyncData(fetchStatus);
			const [check, setCheck] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(null);
			const runCheck = (0, react.useCallback)(() => {
				if (busy !== null) return;
				setBusy("check");
				checkUpdate().then((result) => {
					setBusy(null);
					if (result.ok) {
						setCheck(result.data);
						if (result.data.error !== "") props.notices.report(result.data.error, "failure");
					} else props.notices.report(t("update.error") + "：" + result.error, "failure");
				});
			}, [
				busy,
				props.notices,
				t
			]);
			const switchChannel = (0, react.useCallback)((channel) => {
				if (busy !== null) return;
				const label = channel === "stable" ? t("update.stable") : t("update.beta");
				confirmDialog(t("update.switchConfirm", { channel: label }), {
					okText: t("update.switchTo", { channel: label }),
					cancelText: t("common.cancel"),
					danger: true
				}).then((ok) => {
					if (!ok) return;
					setBusy("switch");
					updateOp({
						op: "channel",
						channel,
						apply: true
					}).then((result) => {
						setBusy(null);
						if (result.ok) {
							setCheck(result.data);
							if (state.phase === "ready") setData({
								...state.data,
								update: result.data
							});
							props.notices.report(result.data.note ?? t("update.restartNote"), "success");
						} else props.notices.report(result.error, "failure");
					});
				});
			}, [
				busy,
				t,
				props.notices,
				state,
				setData
			]);
			if (state.phase === "loading") return h(Loading, { text: t("common.loading") });
			if (state.phase === "error") return h(ErrorLine, {
				label: t("update.error"),
				message: state.error,
				retryText: t("common.retry"),
				onRetry: reload
			});
			const status = state.data;
			const info = check ?? status.update ?? null;
			const channelLabel = info === null ? "—" : info.channel === "beta" ? t("update.beta") : t("update.stable");
			return h("div", { class: "dshp-section" }, h("div", { class: "dshp-section-title" }, t("update.title")), h("div", { class: "dshp-row" }, h("span", { class: "dshp-row-value" }, t("update.current", { version: status.plugin_version }))), info === null ? null : h("div", { class: "dshp-row" }, h("span", { class: "dshp-row-value" }, t("update.channel", { channel: channelLabel }), info.localSha === "" ? "" : " · " + t("update.localSha", { sha: info.localSha }))), info !== null && info.hasUpdate ? h("div", { class: "dshp-row" }, h("span", { class: "dshp-row-value" }, t("update.hasUpdate", {
				version: info.remoteVersion,
				current: info.localVersion
			}))) : null, info !== null && !info.hasUpdate && info.error === "" && busy === null ? h("div", { class: "dshp-hint" }, t("update.noUpdate", { version: info.localVersion })) : null, info !== null && info.error !== "" ? h("div", { class: "dshp-hint" }, info.error) : null, h("div", { class: "dshp-toolbar" }, h("button", {
				class: "dshp-btn",
				type: "button",
				disabled: busy !== null,
				onClick: runCheck
			}, busy === "check" ? t("update.checking") : t("update.check")), h("button", {
				class: "dshp-btn",
				type: "button",
				disabled: busy !== null || info?.channel === "stable",
				onClick: () => {
					switchChannel("stable");
				}
			}, busy === "switch" ? t("update.switching") : t("update.switchTo", { channel: t("update.stable") })), h("button", {
				class: "dshp-btn",
				type: "button",
				disabled: busy !== null || info?.channel === "beta",
				onClick: () => {
					switchChannel("beta");
				}
			}, busy === "switch" ? t("update.switching") : t("update.switchTo", { channel: t("update.beta") }))));
		}
		// client/shared/status.tsx
		/**
		* 状态网格：路线 / 宿主 core / 注入来源 / 生效规则 / 字节 / 人格文件 / 版本。
		*
		* 全插件唯一实现。以前右栏页签的 renderStatus 与主面板的 StatusGrid 各写了一遍
		* 同样的七行键值（主面板那份还没有任何引用），文案与字段一改就漏一处。
		*/
		function StatusGrid(props) {
			const t = props.t;
			const status = props.status;
			const version = typeof status.plugin_version === "string" && status.plugin_version !== "" ? status.plugin_version : t("panel.versionMissing");
			const rows = [
				[t("field.route"), String(status.route ?? "")],
				[t("field.hostCore"), String(status.hostCoreVersion ?? "")],
				[t("field.injectSource"), String(status.inject_source ?? "")],
				[t("field.rule"), status.inject_rule_id === null || status.inject_rule_id === void 0 ? "—" : String(status.inject_rule_id)],
				[t("field.injectBytes"), String(status.inject_bytes ?? 0)],
				[t("field.overridePath"), String(status.override_path ?? "") + (status.override_exists ? "" : t("panel.overrideMissing"))],
				[t("field.version"), version]
			];
			return h("div", { class: "dshp-grid" }, rows.map(([key, value], index) => [h("div", {
				key: "k" + index,
				class: "dshp-grid-key"
			}, key), h("div", {
				key: "v" + index,
				class: "dshp-grid-value"
			}, value === "" ? "—" : value)]));
		}
		// client/redteam/api.ts
		/** SSE 事件端点（GET，EventSource 消费；服务端由后端阶段接入）。 */
		const RT_EVENTS_PATH = "/redteam/api/events";
		/** op 级超时表（毫秒）；表外默认 30s。 */
		const TIMEOUT_BY_OP$1 = {
			assets: 6e4,
			probeSessions: 3e4,
			platformAssignToolkit: 12e4,
			updateCheck: 18e4,
			updateApply: 6e5
		};
		const DEFAULT_TIMEOUT$1 = 3e4;
		/** 把异常 / 响应归一为 ApiErr（与 shared/api.ts 同构）。 */
		async function toApiError$1(response, cause) {
			if (response === null) return {
				ok: false,
				error: cause instanceof DOMException && cause.name === "AbortError" ? "timeout" : cause instanceof Error ? cause.message : String(cause)
			};
			let payload = null;
			try {
				payload = await response.json();
			} catch {}
			return {
				ok: false,
				error: payload !== null && typeof payload === "object" && typeof payload.error === "string" ? payload.error : `HTTP ${response.status}`
			};
		}
		/**
		* 发一个 redteam op。载荷与返回结构以 lib/redteam/ui.js 与旧 client.js 的用法为准；
		* 绝不 reject，失败一律归一为 { ok:false, error }。
		*/
		async function rtOp(op, body = {}) {
			const controller = new AbortController();
			const timer = setTimeout(() => {
				controller.abort();
			}, TIMEOUT_BY_OP$1[op] ?? DEFAULT_TIMEOUT$1);
			let response = null;
			try {
				response = await fetch("/redteam/api", {
					method: "POST",
					headers: {
						accept: "application/json",
						"content-type": "application/json"
					},
					body: JSON.stringify({
						op,
						...body
					}),
					credentials: "same-origin",
					signal: controller.signal
				});
				if (!response.ok) return await toApiError$1(response, null);
				const payload = await response.json();
				if (payload !== null && typeof payload === "object" && payload.ok === false) return {
					ok: false,
					error: typeof payload.error === "string" ? payload.error : "unknown"
				};
				return {
					ok: true,
					data: payload
				};
			} catch (cause) {
				return await toApiError$1(response, cause);
			} finally {
				clearTimeout(timer);
			}
		}
		// client/shared/data.ts
		/**
		* 客户端共享数据层：projects / session-bindings / 会话绑定动作。
		*
		* 同一份数据以前被五个组件各自 rtOp 拉一遍（主面板、右栏页签、会话头徽章、
		* 输入框按钮、项目中心），彼此不知道对方的写入，表现为"A 面板刚绑好，
		* B 面板还显示未绑定"。这里提供 5 秒 TTL 的模块级缓存 + 写后显式失效，
		* 消费方一律走 hook，读到的是同一份快照。
		*
		* 只缓存"读多写少的全局指针"（项目名册、绑定表）；资产/漏洞等大表仍由各页自取。
		*/
		/** 缓存有效期：全局指针类数据 5 秒足够新，又能挡住同一帧里的重复请求。 */
		const TTL_MS = 5e3;
		const cache = /* @__PURE__ */ new Map();
		/**
		* 全局修订号：任何写后失效都会 +1 并通知所有订阅者。
		* 组件不再各自维护 revision —— 右栏绑定会话时，会话头徽章与主面板同时刷新，
		* 不会出现"这里还显示未绑定"。
		*/
		let revision = 0;
		const listeners = /* @__PURE__ */ new Set();
		function subscribeData(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
		function readRevision() {
			return revision;
		}
		function bump() {
			revision += 1;
			for (const listener of [...listeners]) try {
				listener();
			} catch {}
		}
		function readCache(key) {
			const hit = cache.get(key);
			if (hit === void 0) return void 0;
			if (Date.now() - hit.at > TTL_MS) {
				cache.delete(key);
				return;
			}
			return hit.value;
		}
		function writeCache(key, value) {
			cache.set(key, {
				at: Date.now(),
				value
			});
			return value;
		}
		/** 项目集合变了（新建 / 删除 / 改名 / 归档）后调用。 */
		function invalidateProjects() {
			cache.delete("projects");
			bump();
		}
		/** 会话绑定变了（bind / unbind）后调用。 */
		function invalidateBindings() {
			cache.delete("bindings");
			bump();
		}
		async function loadProjects() {
			const hit = readCache("projects");
			if (hit !== void 0) return {
				ok: true,
				data: hit
			};
			const result = await rtOp("projects");
			if (!result.ok) return {
				ok: false,
				error: result.error
			};
			return {
				ok: true,
				data: writeCache("projects", {
					items: Array.isArray(result.data.items) ? result.data.items : [],
					current: typeof result.data.current === "string" ? result.data.current : ""
				})
			};
		}
		async function loadBindings() {
			const hit = readCache("bindings");
			if (hit !== void 0) return {
				ok: true,
				data: hit
			};
			const result = await rtOp("bindings");
			if (!result.ok) return {
				ok: false,
				error: result.error
			};
			return {
				ok: true,
				data: writeCache("bindings", Array.isArray(result.data.items) ? result.data.items : [])
			};
		}
		/** 从绑定表里取某会话绑定的项目 id。 */
		function boundOf(rows, sessionId) {
			const hit = rows.find((row) => row.session === sessionId);
			return hit !== void 0 && typeof hit.engagement === "string" && hit.engagement !== "" ? hit.engagement : null;
		}
		function useProjects() {
			const [state, setState] = (0, react.useState)(() => {
				const hit = readCache("projects");
				return hit !== void 0 ? {
					items: hit.items,
					current: hit.current,
					error: null
				} : {
					items: null,
					current: "",
					error: null
				};
			});
			const tick = (0, react.useSyncExternalStore)(subscribeData, readRevision);
			(0, react.useEffect)(() => {
				let cancelled = false;
				loadProjects().then((result) => {
					if (cancelled) return;
					if (!result.ok) {
						setState((prev) => ({
							...prev,
							error: result.error
						}));
						return;
					}
					setState({
						items: result.data.items,
						current: result.data.current,
						error: null
					});
				});
				return () => {
					cancelled = true;
				};
			}, [tick]);
			const reload = (0, react.useCallback)(() => {
				invalidateProjects();
			}, []);
			return {
				items: state.items,
				current: state.current,
				error: state.error,
				reload
			};
		}
		/** 本会话绑定的项目 id（共享缓存）。 */
		function useBindings(sessionId) {
			const [bound, setBound] = (0, react.useState)(null);
			const tick = (0, react.useSyncExternalStore)(subscribeData, readRevision);
			(0, react.useEffect)(() => {
				const id = sessionId ?? "";
				if (id === "") {
					setBound(null);
					return;
				}
				let cancelled = false;
				loadBindings().then((result) => {
					if (cancelled || !result.ok) return;
					setBound(boundOf(result.data, id));
				});
				return () => {
					cancelled = true;
				};
			}, [sessionId, tick]);
			return {
				bound,
				reload: (0, react.useCallback)(() => {
					invalidateBindings();
				}, [])
			};
		}
		function useSessionBinding(sessionId, t, notices, onChanged) {
			const { bound, reload } = useBindings(sessionId);
			const [busy, setBusy] = (0, react.useState)(false);
			const id = sessionId ?? "";
			return {
				bound,
				busy,
				bind: (0, react.useCallback)(async (engagement, name) => {
					if (id === "" || engagement === "") return false;
					setBusy(true);
					const result = await rtOp("bindSession", {
						sessionId: id,
						engagement
					});
					setBusy(false);
					if (!result.ok) {
						notices.report(t("panel.bindingFail") + "：" + result.error, "failure");
						return false;
					}
					reload();
					rtOp("activateEngagement", { engagement });
					notices.report(t("panel.bindOk", { name: name ?? engagement }), "success");
					if (onChanged !== void 0) onChanged();
					return true;
				}, [
					id,
					notices,
					t,
					reload,
					onChanged
				]),
				unbind: (0, react.useCallback)(async () => {
					if (id === "") return false;
					setBusy(true);
					const result = await rtOp("bindSession", {
						sessionId: id,
						engagement: ""
					});
					setBusy(false);
					if (!result.ok) {
						notices.report(t("panel.bindingFail") + "：" + result.error, "failure");
						return false;
					}
					reload();
					notices.report(t("panel.unbindOk"), "success");
					if (onChanged !== void 0) onChanged();
					return true;
				}, [
					id,
					notices,
					t,
					reload,
					onChanged
				]),
				reload
			};
		}
		// client/panel/PurgePanel.tsx
		/**
		* sidebar.right.pane.tab（key: dsh-purge）的面板主体 —— 会话内轻量控制台。
		*
		* 右侧栏默认 ~360px，放不下演练台的表格与报告，所以这里只放"跟本会话直接相关"的东西：
		*   1. 本会话演练进度（得分 / 阶段 / 在跑智能体 / 最近命中）；
		*   2. 状态总览（折叠；与主面板共用同一个 StatusGrid）；
		*   3. 本会话绑定：显示当前绑到哪个项目，可切换/解绑（与演练台项目头同一套 useSessionBinding）；
		*   4. 回退本会话一轮；
		*   5. 一个入口：全宽红队演练台（主面板由左栏图标与会话头徽章进入，不再重复摆一个按钮）。
		*
		* 绑定语义：项目（engagement）= 靶标工作区，会话通过 session-bindings.json 绑上去；
		* 绑定后本会话派出的智能体只读写该项目，不会串到别的项目库里。
		*/
		function PurgePanel(props) {
			const t = props.t;
			const status = useAsyncData(fetchStatus);
			const projects = useProjects();
			const binding = useSessionBinding(props.sessionId, t, props.notices);
			const bound = binding.bound;
			const [pick, setPick] = (0, react.useState)("");
			const [progress, setProgress] = (0, react.useState)(null);
			const [visible, setVisible] = (0, react.useState)(true);
			(0, react.useEffect)(() => {
				if (typeof document === "undefined") return void 0;
				const sync = () => {
					setVisible(document.visibilityState !== "hidden");
				};
				sync();
				document.addEventListener("visibilitychange", sync);
				return () => {
					document.removeEventListener("visibilitychange", sync);
				};
			}, []);
			(0, react.useEffect)(() => {
				if (bound === null || bound === "" || !visible) {
					if (bound === null || bound === "") setProgress(null);
					return;
				}
				let cancelled = false;
				const pull = () => {
					Promise.all([
						rtOp("scoreChain", { engagement: bound }),
						rtOp("agentsStatus"),
						rtOp("scores", { engagement: bound })
					]).then(([chain, agents, scores]) => {
						if (cancelled) return;
						const summary = chain.ok && chain.data.summary !== void 0 ? chain.data.summary : null;
						const stages = chain.ok && Array.isArray(chain.data.stages) ? chain.data.stages.length : 0;
						const hits = scores.ok && Array.isArray(scores.data.hits) ? scores.data.hits : [];
						setProgress({
							points: summary === null ? 0 : Number(summary.points || 0),
							total: summary === null ? 0 : Number(summary.totalPoints || 0),
							stages,
							running: agents.ok && typeof agents.data.used === "number" ? agents.data.used : 0,
							max: agents.ok && typeof agents.data.max === "number" ? agents.data.max : 0,
							recent: hits.slice(0, 3).map((hit) => ({
								name: String(hit.point_name || hit.code || ""),
								points: Number(hit.points || 0)
							}))
						});
					});
				};
				pull();
				const timer = setInterval(pull, 15e3);
				return () => {
					cancelled = true;
					clearInterval(timer);
				};
			}, [bound, visible]);
			const [rewindBusy, setRewindBusy] = (0, react.useState)(false);
			const rewind = (0, react.useCallback)(() => {
				const sessionId = props.sessionId;
				if (rewindBusy || sessionId === void 0 || sessionId === "") return;
				setRewindBusy(true);
				fetchRewindOptions(sessionId).then((options) => {
					if (!options.ok) {
						setRewindBusy(false);
						props.notices.report(t("panel.rewindFail") + "：" + options.error, "failure");
						return;
					}
					applyRewind(sessionId, "once").then((result) => {
						setRewindBusy(false);
						if (result.ok) props.notices.report(t("panel.rewindOk"), "success");
						else props.notices.report(t("panel.rewindFail") + "：" + result.error, "failure");
					});
				});
			}, [
				rewindBusy,
				props.sessionId,
				props.notices,
				t
			]);
			const items = projects.items;
			const boundName = bound === null ? void 0 : (items ?? []).find((row) => row.id === bound)?.name;
			const canBind = props.sessionId !== void 0 && props.sessionId !== "";
			if (!(props.isRedteam === void 0 ? false : props.isRedteam()) && bound === null) return h("div", { class: "dshp-root" }, h("div", { class: "dshp-section" }, h("div", { class: "dshp-section-title" }, t("panel.notDrillTitle")), h("div", { class: "dshp-hint" }, t("panel.notDrillHint")), h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				onClick: () => {
					if (props.openDrill !== void 0) props.openDrill();
				}
			}, t("panel.goDrill"))));
			const statusState = status.state;
			return h("div", { class: "dshp-root" }, progress !== null ? h("div", { class: "dshp-section" }, h("div", { class: "dshp-section-title" }, t("panel.progressTitle")), h("div", { class: "dshp-grid" }, h("div", { class: "dshp-grid-key" }, t("panel.points")), h("div", { class: "dshp-grid-value" }, progress.points + " / " + progress.total), h("div", { class: "dshp-grid-key" }, t("panel.stages")), h("div", { class: "dshp-grid-value" }, String(progress.stages)), h("div", { class: "dshp-grid-key" }, t("panel.agents")), h("div", { class: "dshp-grid-value" }, progress.running + " / " + progress.max)), progress.recent.length > 0 ? h("div", { class: "dshp-list" }, progress.recent.map((hit, index) => h("div", {
				key: "h" + index,
				class: "dshp-list-item"
			}, h("div", { class: "dshp-list-item-main" }, h("div", { class: "dshp-list-item-sub" }, hit.name)), h("span", { class: "dshp-tag dshp-tag-active" }, "+" + hit.points)))) : h("div", { class: "dshp-hint" }, t("panel.noHits"))) : null, h("details", { class: "dshp-details" }, h("summary", null, t("panel.statusTitle")), statusState.phase === "loading" ? h(Loading, { text: t("common.loading") }) : null, statusState.phase === "error" ? h(ErrorLine, {
				label: t("panel.loadFail"),
				message: statusState.error,
				retryText: t("common.retry"),
				onRetry: status.reload
			}) : null, statusState.phase === "ready" ? h(StatusGrid, {
				t,
				status: statusState.data
			}) : null), h("div", { class: "dshp-section" }, h("div", { class: "dshp-section-title" }, t("panel.bindingTitle")), canBind ? bound !== null ? h("div", { class: "dshp-bindrow" }, h("span", {
				class: "dshp-bindname",
				title: bound
			}, t("panel.bindingBound", { name: String(boundName ?? bound) })), h("button", {
				class: "dshp-btn dshp-btn-ghost",
				type: "button",
				disabled: binding.busy,
				onClick: () => {
					binding.unbind();
				}
			}, t("panel.unbind"))) : h("div", null, h("div", { class: "dshp-hint" }, t("panel.bindingNone")), h("div", { class: "dshp-bindrow" }, h("select", {
				class: "dshp-select",
				value: pick,
				onChange: (e) => {
					setPick(e.target.value);
				}
			}, h("option", { value: "" }, items !== null && items.length > 0 ? t("panel.bindingPick") : t("panel.noProjects")), (items ?? []).map((row) => h("option", {
				key: row.id,
				value: row.id
			}, String(row.name || row.id)))), h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				disabled: binding.busy || pick === "",
				onClick: () => {
					const name = (items ?? []).find((row) => row.id === pick)?.name;
					binding.bind(pick, name).then((ok) => {
						if (ok) setPick("");
					});
				}
			}, t("panel.bind")))) : h("div", { class: "dshp-hint" }, t("panel.noSession")), h("div", { class: "dshp-hint" }, t("panel.bindingHint"))), h("div", { class: "dshp-section" }, h("button", {
				class: "dshp-btn",
				type: "button",
				disabled: rewindBusy || props.sessionId === void 0,
				title: props.sessionId === void 0 ? t("panel.noSession") : t("panel.rewind"),
				onClick: rewind
			}, rewindBusy ? t("common.loading") : t("panel.rewind"))), h("div", { class: "dshp-actions" }, h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				title: t("panel.drillHint"),
				onClick: () => {
					if (props.openDrill !== void 0) props.openDrill();
					else props.notices.report(t("panel.drillHint"), "info");
				}
			}, t("panel.drill"))));
		}
		// client/panel/RewindSafe.tsx
		/**
		* conversation.input.right：输入框右侧的「安全回退」按钮（↩）。
		*
		* 交互：挂载时查 /dsh-purge/rewind/options 判断本会话可回退性；
		* 可回退才点亮，点击 POST /dsh-purge/rewind（mode: once）回退到上一条用户消息。
		*/
		function RewindSafe(props) {
			const [availability, setAvailability] = (0, react.useState)("checking");
			const [busy, setBusy] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let cancelled = false;
				setAvailability("checking");
				fetchRewindOptions(props.sessionId).then((result) => {
					if (cancelled) return;
					setAvailability(result.ok ? "available" : "unavailable");
				});
				return () => {
					cancelled = true;
				};
			}, [props.sessionId]);
			const run = (0, react.useCallback)(() => {
				if (busy || availability !== "available") return;
				setBusy(true);
				applyRewind(props.sessionId, "once").then((result) => {
					setBusy(false);
					if (result.ok) {
						props.notices.report(props.t("rewind.ok"), "success");
						fetchRewindOptions(props.sessionId).then((next) => {
							setAvailability(next.ok ? "available" : "unavailable");
						});
					} else {
						props.notices.report(`${props.t("rewind.fail")}：${result.error}`, "failure");
						setAvailability("unavailable");
					}
				});
			}, [
				busy,
				availability,
				props.sessionId,
				props.notices,
				props.t
			]);
			const title = availability === "available" ? props.t("rewind.tooltip") : availability === "checking" ? props.t("rewind.checking") : props.t("rewind.unavailable");
			return h("button", {
				class: "dshp-rewind-btn",
				type: "button",
				title,
				"aria-label": title,
				disabled: availability !== "available" || busy,
				onClick: run
			}, "↩");
		}
		// client/panel/DrillNewSession.tsx
		/**
		* conversation.input.right：会话内「红队对话」按钮 —— 一键开红队演练会话。
		*
		* 多项目时的交互：点按钮弹出项目列表（当前会话绑定的那个打勾），点哪个进哪个；
		* 只有一个项目时直接进入，不弹菜单。菜单用 fixed 定位，避免被输入框容器裁剪。
		*
		* 项目名册与绑定走 shared/data.ts 的共享缓存（与右栏页签、会话头徽章同源）。
		*/
		function DrillNewSession(props) {
			const t = props.t;
			const projects = useProjects();
			const { bound } = useBindings(props.sessionId);
			const [open, setOpen] = (0, react.useState)(false);
			const [anchor, setAnchor] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (!open) return void 0;
				const onDown = (event) => {
					const target = event.target;
					if (target !== null && typeof target.closest === "function" && target.closest(".dshp-drill-menu, .dshp-drill-btn") !== null) return;
					setOpen(false);
				};
				const onKey = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				document.addEventListener("mousedown", onDown);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDown);
					document.removeEventListener("keydown", onKey);
				};
			}, [open]);
			const rows = projects.items;
			if (rows === null || rows.length === 0) return null;
			const current = (bound === null ? void 0 : rows.find((row) => row.id === bound)) ?? rows[0];
			const isRedteam = bound !== null;
			const label = isRedteam ? rows.length === 1 ? t("input.newDrillTo", { name: String(current.name || current.id) }) : t("input.newDrillPick", { name: String(current.name || current.id) }) : t("input.convertDrillTo", { name: String(current.name || current.id) });
			const run = (id) => {
				setOpen(false);
				const task = isRedteam ? props.newDrillSession === void 0 ? void 0 : props.newDrillSession(id) : props.convertToDrill === void 0 || props.sessionId === "" ? void 0 : props.convertToDrill(props.sessionId, id);
				if (task === void 0) return;
				task.then((ok) => {
					if (ok) return;
					props.notices?.report(t("input.newDrillFail"), "failure");
				});
			};
			const toggle = (element) => {
				if (open) {
					setOpen(false);
					return;
				}
				const rect = element.getBoundingClientRect();
				setAnchor({
					left: Math.max(8, rect.left),
					top: rect.top
				});
				setOpen(true);
			};
			return h("span", { class: "dshp-drill-wrap" }, h("button", {
				class: "dshp-drill-btn",
				type: "button",
				title: label,
				onClick: (event) => {
					toggle(event.currentTarget);
				}
			}, t("input.newDrillShort")), open && anchor !== null ? h("div", {
				class: "dshp-drill-menu",
				style: {
					left: anchor.left + "px",
					top: anchor.top + "px"
				}
			}, h("div", { class: "dshp-drill-menu-title" }, t("input.newDrillMenu")), rows.map((row) => h("button", {
				key: row.id,
				class: "dshp-drill-menu-item" + (row.id === bound ? " on" : ""),
				type: "button",
				onClick: () => {
					run(row.id);
				}
			}, h("span", { class: "dshp-drill-menu-mark" }, row.id === bound ? "●" : ""), h("span", { class: "dshp-drill-menu-name" }, String(row.name || row.id)), row.workspace_id ? null : h("span", { class: "dshp-drill-menu-sub" }, t("rt.pj.workspacePending"))))) : null);
		}
		// client/panel/DrillBadge.tsx
		/**
		* conversation.session.header.utilities：会话头的「红队状态」徽章。
		*
		* 级别划分（本插件的约定）：
		*   - **会话级**（这里）：本会话绑了哪个项目、该项目当前得分/在跑智能体；点开进面板。
		*   - **全局级**（破甲面板）：项目中心、知识库、技能库、环境适配。
		* 未绑定项目时显示「红队 · 未绑定」，点击打开面板去绑定。
		*
		* 项目名册与本会话绑定走 shared/data.ts 的共享缓存：与右栏页签、输入框按钮同一份数据，
		* 不会出现"这里显示 A、那里显示 B"。
		*/
		const EMPTY = {
			points: 0,
			running: 0,
			max: 0
		};
		function DrillBadge(props) {
			const t = props.t;
			const { bound } = useBindings(props.sessionId);
			const projects = useProjects();
			const [state, setState] = (0, react.useState)(EMPTY);
			const [visible, setVisible] = (0, react.useState)(true);
			(0, react.useEffect)(() => {
				if (typeof document === "undefined") return void 0;
				const sync = () => {
					setVisible(document.visibilityState !== "hidden");
				};
				sync();
				document.addEventListener("visibilitychange", sync);
				return () => {
					document.removeEventListener("visibilitychange", sync);
				};
			}, []);
			(0, react.useEffect)(() => {
				if (bound === null) {
					setState(EMPTY);
					return;
				}
				let cancelled = false;
				const pull = () => {
					Promise.all([rtOp("scoreChain", { engagement: bound }), rtOp("agentsStatus")]).then(([chain, agents]) => {
						if (cancelled) return;
						const summary = chain.ok && chain.data.summary !== void 0 ? chain.data.summary : null;
						setState({
							points: summary === null ? 0 : Number(summary.points || 0),
							running: agents.ok && typeof agents.data.used === "number" ? agents.data.used : 0,
							max: agents.ok && typeof agents.data.max === "number" ? agents.data.max : 0
						});
					});
				};
				pull();
				if (!visible) return () => {
					cancelled = true;
				};
				const timer = setInterval(pull, 15e3);
				return () => {
					cancelled = true;
					clearInterval(timer);
				};
			}, [bound, visible]);
			const redteamPreset = props.isRedteam === void 0 ? false : props.isRedteam();
			if (bound === null && !redteamPreset) return null;
			const name = bound === null ? null : (projects.items ?? []).find((row) => row.id === bound)?.name ?? bound;
			const label = bound === null ? t("badge.unbound") : t("badge.bound", {
				name: String(name ?? bound),
				points: state.points
			});
			return h("button", {
				class: "dshp-badge" + (bound === null ? " dshp-badge-idle" : ""),
				type: "button",
				title: bound === null ? t("badge.unboundTip") : t("badge.tip", {
					name: String(name ?? ""),
					points: state.points,
					running: state.running,
					max: state.max
				}),
				"aria-label": label,
				onClick: props.openPanel
			}, label);
		}
		// client/redteam/live.ts
		/**
		* 实时化（C-3.1）：GET /redteam/api/events 的 SSE 订阅，失败自动退回 5s 轮询。
		*
		* 契约（服务端随后接入）：每条消息 `data: {"engagement":"<id>","kind":"asset|vuln|score|...","at":"<iso>"}`。
		* - 连上 → live：每条事件回调 onEvent(kind)；断开/出错 → polling：每 15s 回调一次
		*   onEvent('__poll')（语义为「用现有 op 刷新当前页签」），并每 30s 重试 SSE。
		* 角标状态经 subscribe/getSnapshot 暴露（useSyncExternalStore 消费）。
		*
		* 快照稳定性：getSnapshot 在状态未变时必须返回同一对象引用，否则 React 每次
		* 读取都判定「快照变了」→ 无限重渲染（表现为面板白屏、CPU 拉满）。
		* 这里所有状态改动都走 publish()，由它换一次快照再通知订阅者。
		*/
		/** 事件回调：kind 为契约里的 kind，或 '__poll'（轮询心跳，只刷新不打扰）。 */
		function createLive(onEvent, eventsPath = RT_EVENTS_PATH) {
			let status = "connecting";
			let events = 0;
			let eng = null;
			let es = null;
			let pollTimer;
			let retryTimer;
			const listeners = /* @__PURE__ */ new Set();
			const notify = () => {
				for (const f of [...listeners]) try {
					f();
				} catch {}
			};
			/** 当前快照；只在 publish 时替换引用。 */
			let snapshot = {
				status,
				events
			};
			/** 状态变化后换快照并通知（唯一出口，避免漏发或重复发）。 */
			const publish = () => {
				snapshot = {
					status,
					events
				};
				notify();
			};
			const clearPoll = () => {
				if (pollTimer !== void 0) {
					clearInterval(pollTimer);
					pollTimer = void 0;
				}
				if (retryTimer !== void 0) {
					clearTimeout(retryTimer);
					retryTimer = void 0;
				}
			};
			const startPolling = () => {
				if (pollTimer !== void 0) return;
				pollTimer = setInterval(() => {
					events += 1;
					onEvent("__poll", eng);
					publish();
				}, 15e3);
				if (retryTimer === void 0) retryTimer = setTimeout(() => {
					retryTimer = void 0;
					connect();
				}, 3e4);
			};
			const handle = (kind, engagement) => {
				if (engagement !== null && engagement !== void 0 && eng !== null && engagement !== eng) return;
				events += 1;
				onEvent(kind, engagement ?? eng);
				publish();
			};
			const connect = () => {
				if (typeof EventSource === "undefined" || eng === null) {
					status = "polling";
					publish();
					startPolling();
					return;
				}
				status = "connecting";
				publish();
				try {
					es = new EventSource(`${eventsPath}?engagement=${encodeURIComponent(eng)}`);
				} catch {
					status = "polling";
					publish();
					startPolling();
					return;
				}
				es.onopen = () => {
					status = "live";
					clearPoll();
					publish();
				};
				es.onmessage = (ev) => {
					try {
						const data = JSON.parse(ev.data);
						if (data.heartbeat === true || typeof data.kind !== "string") {
							if (status !== "live") {
								status = "live";
								publish();
							}
							return;
						}
						handle(data.kind, typeof data.engagement === "string" ? data.engagement : null);
					} catch {}
				};
				es.onerror = () => {
					try {
						es?.close();
					} catch {}
					es = null;
					status = "polling";
					publish();
					startPolling();
				};
			};
			const source = {
				start(nextEng) {
					eng = nextEng;
					try {
						es?.close();
					} catch {}
					es = null;
					clearPoll();
					if (eng === null) {
						status = "connecting";
						publish();
						return;
					}
					connect();
				},
				stop() {
					eng = null;
					try {
						es?.close();
					} catch {}
					es = null;
					clearPoll();
					status = "connecting";
					events = 0;
					publish();
				},
				subscribe(listener) {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				getSnapshot: () => snapshot,
				hooks: { snapshot: null }
			};
			source.hooks.snapshot = source.getSnapshot;
			return source;
		}
		// client/redteam/bits.tsx
		/**
		* 红队演练台共用底座：类型、枚举标签、小组件（徽章 / 折叠 / 长文本 / HTTP 证据块 /
		* 截图条）、剪贴板助手。自旧 client.js 对应片段迁移；只依赖 react 与本目录 api.ts。
		*/
		/** ISO → 「YYYY-MM-DD HH:mm」；空值为 —。 */
		const fmt = (s) => s ? String(s).replace("T", " ").slice(0, 16) : "—";
		/** 列表用短时间（MM-DD HH:mm），完整时间进悬浮提示。 */
		const fmtShort = (s) => {
			const t = String(s || "").replace("T", " ");
			return t.length >= 16 ? t.slice(5, 16) : t || "—";
		};
		/** 给「可点击但不是 button」的元素补 role/tabIndex/Enter/Space。 */
		function clickable(onActivate, options = {}) {
			const props = {
				role: "button",
				tabIndex: 0,
				onClick: onActivate,
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onActivate(e);
					}
				}
			};
			if (options.label !== void 0) props["aria-label"] = String(options.label);
			if (options.expanded !== void 0) props["aria-expanded"] = options.expanded ? "true" : "false";
			return props;
		}
		/** 复制文本；clipboard API 不可用时退回 execCommand。返回真实成功与否。 */
		async function copyText(text) {
			const value = text === void 0 || text === null ? "" : String(text);
			if (value === "") return false;
			try {
				if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
					await navigator.clipboard.writeText(value);
					return true;
				}
			} catch {}
			try {
				const doc = typeof document === "undefined" ? null : document;
				if (doc === null || doc.body === null) return false;
				const ta = doc.createElement("textarea");
				ta.value = value;
				ta.setAttribute("readonly", "");
				ta.style.position = "fixed";
				ta.style.left = "-9999px";
				doc.body.append(ta);
				ta.select();
				const ok = doc.execCommand("copy");
				ta.remove();
				return ok === true;
			} catch {
				return false;
			}
		}
		/** 复制 + 如实反馈：成功/失败文案统一走 locale。 */
		async function copyWithFeedback(t, text, label, onResult) {
			const ok = await copyText(text);
			const message = ok ? t("rt.copied", { label }) : t("rt.copyFail");
			if (onResult !== void 0) onResult(ok, message);
			return ok;
		}
		const COLLAPSE_KEY = "dshp-rt-collapse:";
		function collapseLoad(prefix) {
			try {
				const raw = window.localStorage.getItem(COLLAPSE_KEY + prefix);
				const parsed = raw === null ? null : JSON.parse(raw);
				return parsed !== null && typeof parsed === "object" ? parsed : {};
			} catch {
				return {};
			}
		}
		function collapseSave(prefix, value) {
			try {
				window.localStorage.setItem(COLLAPSE_KEY + prefix, JSON.stringify(value));
			} catch {}
		}
		/** 一个页签一个 hook：只记录用户显式点过的键，没点过的用默认值。 */
		function useCollapse(prefix) {
			const [state, setState] = (0, react.useState)(() => collapseLoad(prefix));
			(0, react.useEffect)(() => {
				setState(collapseLoad(prefix));
			}, [prefix]);
			const write = (next) => {
				collapseSave(prefix, next);
				setState(next);
			};
			const isOpen = (key, defaultOpen) => {
				const v = state[key];
				return v === void 0 ? defaultOpen !== false : v === true;
			};
			const toggle = (key, defaultOpen) => (e) => {
				if (e !== null && typeof e === "object" && typeof e.stopPropagation === "function") e.stopPropagation();
				write({
					...state,
					[key]: !isOpen(key, defaultOpen)
				});
			};
			const setAll = (keys, open) => {
				const next = { ...state };
				for (const k of keys) next[k] = open;
				write(next);
			};
			return {
				isOpen,
				toggle,
				setAll
			};
		}
		/** 统一折叠头：caret / 标题 / 计数 / 副题 / 右侧注；always=true 表示常显不可折叠。 */
		function Section(props) {
			const always = props.always === true;
			const open = always || props.open === true;
			const head = h("div", {
				class: "dshp-rt-sec t-" + (props.tone ?? "target") + (always ? " flat" : ""),
				role: always ? void 0 : "button",
				tabIndex: always ? void 0 : 0,
				"aria-expanded": always ? void 0 : open ? "true" : "false",
				onClick: always ? void 0 : props.onToggle,
				onKeyDown: always ? void 0 : (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						if (props.onToggle !== void 0) props.onToggle(e);
					}
				}
			}, h("span", { class: "dshp-rt-sec-caret" }, always ? "▍" : open ? "▾" : "▸"), props.title === void 0 ? null : h("span", { class: "dshp-rt-sec-title" }, props.title), props.count === void 0 ? null : h("span", { class: "dshp-rt-sec-count" }, String(props.count)), props.sub === void 0 ? null : h("span", { class: "dshp-rt-sec-sub" }, props.sub), props.right === void 0 ? null : h("span", { class: "dshp-rt-sec-right" }, props.right));
			return h("div", { class: "dshp-rt-sec-wrap" }, head, open && props.children !== void 0 ? h("div", { class: "dshp-rt-sec-body" }, props.children) : null);
		}
		/** 长文本折叠：默认预览两行并渐隐，展开后限高滚动；带复制。 */
		function Clip(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const text = String(props.text === void 0 || props.text === null ? "" : props.text);
			if (text.trim() === "") return null;
			return h("div", { class: "dshp-rt-clip" + (open ? " open" : "") }, h("div", { class: "dshp-rt-clip-head" }, props.label === void 0 ? null : h("span", { class: "dshp-rt-clip-label" }, props.label), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					copyText(text);
				}
			}, props.t("rt.copy")), h("button", {
				class: "dshp-rt-btn",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					setOpen((v) => !v);
				}
			}, open ? props.t("rt.clipCollapse") : props.t("rt.clipExpand"))), h("div", { class: "dshp-rt-clip-body" }, text));
		}
		/** 把原始 HTTP 报文按「请求行/状态行 + 头 + 体」着色。 */
		function HttpBlock(props) {
			const text = String(props.text || "");
			if (text === "") return null;
			const nodes = text.split(/\r?\n/).map((ln, i) => {
				let cls = null;
				if (i === 0 && /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|TRACE)\s/.test(ln)) cls = "dshp-rt-hl-req";
				else if (i === 0 && /^HTTP\//.test(ln)) cls = "dshp-rt-hl-res";
				else if (/^[A-Za-z0-9-]+:/.test(ln)) {
					const name = ln.split(":")[0].toLowerCase();
					if (name === "host" || name === "cookie" || name === "authorization" || name === "content-type") cls = "dshp-rt-hl-req";
				}
				return h("div", {
					key: "l" + i,
					class: cls === null ? void 0 : cls
				}, ln === "" ? "\xA0" : ln);
			});
			return h("pre", { class: "dshp-rt-evi-body" + (props.compact === true ? " req" : "") }, nodes);
		}
		function testLabel(t, s) {
			const key = "rt.test." + (s || "untested");
			return t(key) === key ? s || t("rt.test.untested") : t(key);
		}
		function priLabel(t, p) {
			const key = "rt.pri." + (p || "none");
			return t(key) === key ? p || t("rt.pri.none") : t(key);
		}
		function sevLabel(t, s) {
			const key = "rt.sev." + (s || "info");
			return t(key) === key ? s || t("rt.sev.info") : t(key);
		}
		function vulnStatusLabel(t, s) {
			const key = "rt.vulnstatus." + (s || "candidate");
			return t(key) === key ? s || t("rt.vulnstatus.candidate") : t(key);
		}
		function roleLabel(t, r) {
			if (r === void 0 || r === null || r === "") return "—";
			const key = "rt.role." + r;
			return t(key) === key ? r : t(key);
		}
		function fileKindLabel(t, k) {
			if (k === void 0 || k === "") return "—";
			const key = "rt.filekind." + k;
			return t(key) === key ? k : t(key);
		}
		function pocKindLabel(t, k) {
			const key = "rt.pockind." + (k || "poc");
			return t(key) === key ? k || "POC" : t(key);
		}
		function pocSourceLabel(t, s) {
			const key = "rt.pocsource." + (s || "");
			return t(key) === key ? s || "—" : t(key);
		}
		function provLabel(t, p) {
			const key = "rt.prov." + (p || "unknown");
			return t(key) === key ? p || t("rt.prov.unknown") : t(key);
		}
		/** 知识库归类 code（顺序与 core.js 的 POC_CATEGORIES 一致）。 */
		const POC_CAT_ORDER = [
			"rce",
			"deserialization",
			"file-upload",
			"sqli",
			"unauthorized",
			"auth-bypass",
			"weak-password",
			"ssrf",
			"xxe",
			"path-traversal",
			"info-leak",
			"privesc",
			"tunnel",
			"other"
		];
		function pocCatName(t, code) {
			const key = "rt.poccat." + code;
			return t(key) === key ? code : t(key);
		}
		function ProvTag(props) {
			if (props.p !== "passive" && props.p !== "active") return h("span", { class: "dshp-rt-tag" }, props.t("rt.prov.unknown"));
			return h("span", { class: "dshp-rt-tag dshp-rt-tag-" + props.p }, provLabel(props.t, props.p));
		}
		function PriTag(props) {
			if (props.p !== "high" && props.p !== "medium" && props.p !== "low") return h("span", { class: "dshp-rt-tag" }, props.t("rt.pri.none"));
			return h("span", {
				class: "dshp-rt-pri dshp-rt-pri-" + props.p,
				title: props.title || ""
			}, priLabel(props.t, props.p));
		}
		function TestTag(props) {
			const st = props.s || "untested";
			return h("span", { class: "dshp-rt-test dshp-rt-test-" + st }, testLabel(props.t, st));
		}
		function SevTag(props) {
			const known = [
				"critical",
				"high",
				"medium",
				"low",
				"info"
			].includes(props.s || "");
			return h("span", { class: "dshp-rt-sev dshp-rt-sev-" + (known ? props.s : "info") }, sevLabel(props.t, props.s));
		}
		/** 内外网小标（short=true 用单字「内 / 外」）。 */
		function ScopeTag(props) {
			const internal = props.scope === "internal";
			const key = internal ? props.short === true ? "rt.scope.inShort" : "rt.scope.internal" : props.short === true ? "rt.scope.outShort" : "rt.scope.external";
			return h("span", {
				class: "dshp-rt-scope dshp-rt-scope-" + (internal ? "internal" : "external"),
				title: props.title || ""
			}, props.t(key));
		}
		const shotCache = /* @__PURE__ */ new Map();
		const shotLoading = /* @__PURE__ */ new Set();
		const shotSubs = /* @__PURE__ */ new Set();
		function notifyShots() {
			for (const f of [...shotSubs]) try {
				f();
			} catch {}
		}
		function loadShot(eng, id) {
			const key = eng + ":" + String(id);
			if (shotCache.has(key) || shotLoading.has(key)) return;
			shotLoading.add(key);
			rtOp("shotData", {
				engagement: eng,
				id
			}).then((r) => {
				const d = r.ok ? r.data : null;
				shotCache.set(key, d !== null && d.base64 ? "data:" + (d.mime || "image/png") + ";base64," + d.base64 : "");
				shotLoading.delete(key);
				notifyShots();
			}).catch(() => {
				shotLoading.delete(key);
			});
		}
		function shotKindLabel(t, kind) {
			const key = "rt.shot." + (kind || "screenshot");
			return t(key) === key ? kind || t("rt.shot.screenshot") : t(key);
		}
		function ShotImage(props) {
			const [zoom, setZoom] = (0, react.useState)(false);
			const [, bump] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				const f = () => {
					bump((n) => n + 1);
				};
				shotSubs.add(f);
				return () => {
					shotSubs.delete(f);
				};
			}, []);
			const key = props.eng + ":" + String(props.shot.id);
			const src = shotCache.has(key) ? shotCache.get(key) : null;
			if (src === null) loadShot(props.eng, props.shot.id);
			const shot = props.shot;
			const card = shot.kind === "card";
			return h("div", { class: "dshp-rt-shot" }, src === null ? h("div", {
				class: "dshp-rt-shot-thumb dshp-rt-shot-loading",
				style: { height: (props.height ?? 96) + "px" }
			}, props.t("rt.loading")) : h("img", {
				class: "dshp-rt-shot-thumb",
				src,
				alt: shot.label || props.t("rt.shot.alt") + " " + String(shot.id),
				style: {
					height: (props.height ?? 96) + "px",
					cursor: "zoom-in"
				},
				onClick: () => {
					setZoom(true);
				}
			}), h("div", { class: "dshp-rt-shot-cap" }, h("span", {
				class: "dshp-rt-tag " + (card ? "dshp-rt-tag-warn" : "dshp-rt-tag-live"),
				title: card ? props.t("rt.shot.cardTitle") : props.t("rt.shot.screenshotTitle")
			}, shotKindLabel(props.t, shot.kind)), h("span", {
				class: "dshp-rt-shot-label",
				title: shot.label || shot.note || ""
			}, shot.label || shot.target || "#" + String(shot.id))), zoom ? h("div", {
				class: "dshp-rt-shot-zoom",
				onClick: () => {
					setZoom(false);
				}
			}, h("img", {
				src: src === null ? void 0 : src,
				alt: shot.label || ""
			}), h("div", { class: "dshp-rt-shot-zoom-cap" }, (shot.label || shot.target || "") + (card ? "　·　" + props.t("rt.shot.cardSuffix") : "") + (shot.captured_at ? "　·　" + fmt(shot.captured_at) : "") + "　·　" + props.t("rt.shot.zoomClose"))) : null);
		}
		function ShotStrip(props) {
			const list = props.shots || [];
			if (list.length === 0) return null;
			return h("div", { class: "dshp-rt-shots" }, h("div", { class: "dshp-rt-shots-head" }, h("b", null, props.title ?? props.t("rt.shot.title")), h("span", { class: "dshp-rt-shots-n" }, props.t("rt.shot.showing", { n: list.length }) + (props.total !== void 0 && props.total > list.length ? props.t("rt.shot.ofTotal", { n: props.total }) : ""))), h("div", { class: "dshp-rt-shot-row" }, list.map((sh) => h(ShotImage, {
				key: "sh" + String(sh.id),
				t: props.t,
				eng: props.eng,
				shot: sh
			}))));
		}
		// client/redteam/AssetsTab.tsx
		/**
		* 资产测绘页签：C 段侧栏 + 筛选工具条 + 结论条 + 列表 / 域名 / Web / 发现时间四视图。
		* 自旧 client.js AssetsTab / DiscoveryView 迁移；新增深链消费：jump('assets', { ip | cidr })。
		*/
		function AssetsTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [view, setView] = (0, react.useState)("list");
			const [cidr, setCidr] = (0, react.useState)(null);
			const [q, setQ] = (0, react.useState)("");
			const [qApplied, setQApplied] = (0, react.useState)("");
			const [service, setService] = (0, react.useState)("");
			const [port, setPort] = (0, react.useState)("");
			const [prov, setProv] = (0, react.useState)("");
			const [testStatus, setTestStatus] = (0, react.useState)("");
			const [priority, setPriority] = (0, react.useState)("");
			const [scope, setScope] = (0, react.useState)("");
			const [assetState, setAssetState] = (0, react.useState)("");
			const [sort, setSort] = (0, react.useState)("priority");
			const [showAll, setShowAll] = (0, react.useState)(null);
			const [state, setState] = (0, react.useState)({
				loading: false,
				error: null,
				total: 0,
				items: []
			});
			const [domains, setDomains] = (0, react.useState)(null);
			const [web, setWeb] = (0, react.useState)(null);
			const [openId, setOpenId] = (0, react.useState)(null);
			const [detail, setDetail] = (0, react.useState)(null);
			/** 展开资产时命中的已知漏洞（版本 → CVE）。 */
			const [cves, setCves] = (0, react.useState)([]);
			const sideCollapse = useCollapse("assets-side:" + String(eng));
			const seq = (0, react.useRef)(0);
			(0, react.useEffect)(() => {
				const p = props.params;
				if (p === null || p === void 0) return;
				setView("list");
				if (typeof p.ip === "string" && p.ip !== "") {
					setQ(p.ip);
					setQApplied(p.ip);
				}
				if (typeof p.cidr === "string" && p.cidr !== "") {
					setCidr(p.cidr);
					setView("list");
				}
			}, [props.params]);
			(0, react.useEffect)(() => {
				if (eng === null || eng === "") return;
				const my = ++seq.current;
				setState((s) => ({
					...s,
					loading: true,
					error: null
				}));
				rtOp("assets", {
					engagement: eng,
					cidr: cidr ?? void 0,
					q: qApplied || void 0,
					service: service || void 0,
					port: port || void 0,
					provenance: prov || void 0,
					test_status: testStatus || void 0,
					priority: priority || void 0,
					scope: scope || void 0,
					state: assetState || void 0,
					sort,
					limit: 400
				}).then((r) => {
					if (my !== seq.current) return;
					if (!r.ok) {
						setState({
							loading: false,
							error: r.error,
							total: 0,
							items: []
						});
						return;
					}
					const d = r.data;
					setState({
						loading: false,
						error: null,
						total: d.total ?? 0,
						items: d.items ?? []
					});
					props.onData();
				});
			}, [
				eng,
				cidr,
				qApplied,
				service,
				port,
				prov,
				testStatus,
				priority,
				scope,
				assetState,
				sort,
				props.refreshKey
			]);
			(0, react.useEffect)(() => {
				if (eng === null || eng === "" || view !== "domain") return;
				setDomains(null);
				rtOp("domains", {
					engagement: eng,
					cidr: cidr ?? void 0
				}).then((r) => {
					setDomains(r.ok ? r.data.items ?? [] : []);
				});
			}, [
				eng,
				view,
				cidr,
				props.refreshKey
			]);
			(0, react.useEffect)(() => {
				if (eng === null || eng === "" || view !== "web") return;
				setWeb(null);
				rtOp("web", {
					engagement: eng,
					cidr: cidr ?? void 0
				}).then((r) => {
					setWeb(r.ok ? r.data.items ?? [] : []);
				});
			}, [
				eng,
				view,
				cidr,
				props.refreshKey
			]);
			const toggleRow = (id) => {
				if (openId === id) {
					setOpenId(null);
					setDetail(null);
					setCves([]);
					return;
				}
				setOpenId(id);
				setDetail(null);
				setCves([]);
				if (eng === null) return;
				rtOp("asset", {
					engagement: eng,
					id
				}).then((r) => {
					if (r.ok && r.data.asset !== void 0) setDetail(r.data.asset);
				});
				rtOp("cveMatch", {
					assetId: id,
					engagement: eng,
					limit: 12
				}).then((r) => {
					setCves(r.ok && Array.isArray(r.data.items) ? r.data.items : []);
				});
			};
			const segs = props.snapshot !== null && props.snapshot.segments || [];
			const sideChildren = [];
			sideChildren.push(h("div", {
				...clickable(() => {
					setView("list");
					setCidr(null);
				}, {
					label: t("rt.a.allCidr"),
					expanded: cidr === null
				}),
				key: "all",
				class: "dshp-rt-seg" + (cidr === null ? " on" : "")
			}, h("div", { class: "dshp-rt-seg-cidr" }, t("rt.a.allCidr")), h("div", { class: "dshp-rt-seg-meta" }, t("rt.a.nSegs", { n: segs.length }))));
			sideChildren.push(h("div", {
				...clickable(() => {
					props.jump("overview");
				}, {
					label: t("rt.a.testingEntry"),
					expanded: false
				}),
				key: "testing",
				class: "dshp-rt-seg",
				title: t("rt.a.testingTitle")
			}, h("div", {
				class: "dshp-rt-seg-cidr",
				style: {
					display: "flex",
					alignItems: "baseline",
					gap: 5
				}
			}, h("span", {
				class: "dshp-rt-scope dshp-rt-scope-testing",
				title: t("rt.a.testingTitle")
			}, t("rt.a.testingShort")), h("span", { style: { flex: 1 } }, t("rt.a.testingEntry")), h("span", {
				class: "dshp-rt-seg-meta",
				style: {
					margin: 0,
					whiteSpace: "nowrap"
				}
			}, t("rt.a.testingGo")))));
			const segBlock = (titleKey, list, kind) => {
				const open = sideCollapse.isOpen("scope:" + kind, true);
				const toggle = sideCollapse.toggle("scope:" + kind, true);
				const out = [h("div", {
					key: "h" + kind,
					class: "dshp-rt-sidehead dshp-rt-sidehead-btn",
					role: "button",
					tabIndex: 0,
					"aria-expanded": open ? "true" : "false",
					title: open ? t("rt.a.collapseGroup") : t("rt.a.expandGroup"),
					onClick: () => {
						setView("list");
						toggle();
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setView("list");
							toggle();
						}
					}
				}, h("span", { class: "dshp-rt-sec-caret" }, open ? "▾" : "▸"), h("span", { class: "dshp-rt-scope dshp-rt-scope-" + kind }, kind === "internal" ? t("rt.scope.internal") : t("rt.scope.external")), h("span", null, t(titleKey) + " · " + t("rt.a.nCidr", { n: list.length })), h("span", { class: "dshp-rt-spacer" }), h("span", { style: { fontWeight: 400 } }, t("rt.a.nAssetsUnit", { n: list.reduce((n, x) => n + (x.assets ?? 0), 0) })))];
				if (!open) return out;
				for (const s of list) out.push(h("div", {
					...clickable(() => {
						setView("list");
						setCidr(s.cidr);
					}, {
						label: t("rt.a.filterCidr", { cidr: s.cidr }),
						expanded: cidr === s.cidr
					}),
					key: s.cidr,
					class: "dshp-rt-seg" + (cidr === s.cidr ? " on" : ""),
					title: (s.org || t("rt.a.unknownOrg")) + " · " + t("rt.a.liveOf", {
						live: s.live ?? 0,
						total: s.assets ?? 0
					})
				}, h("div", {
					class: "dshp-rt-seg-cidr",
					style: {
						display: "flex",
						alignItems: "baseline",
						gap: 5
					}
				}, h("span", { class: "dshp-rt-scope dshp-rt-scope-" + kind }, kind === "internal" ? t("rt.scope.inShort") : t("rt.scope.outShort")), h("span", { style: { flex: 1 } }, s.cidr), h("span", {
					class: "dshp-rt-seg-meta",
					style: {
						margin: 0,
						whiteSpace: "nowrap"
					}
				}, t("rt.a.nHosts", { n: s.assets ?? 0 })))));
				return out;
			};
			const segExternal = segs.filter((x) => x.scope !== "internal");
			const segInternal = segs.filter((x) => x.scope === "internal");
			if (segExternal.length > 0) sideChildren.push(...segBlock("rt.a.extAssets", segExternal, "external"));
			if (segInternal.length > 0) sideChildren.push(...segBlock("rt.a.intAssets", segInternal, "internal"));
			const side = h("div", { class: "dshp-rt-side" }, sideChildren);
			const toolbar = h("div", { class: "dshp-rt-toolbar" }, h("input", {
				class: "dshp-rt-input",
				style: { flex: "1 1 150px" },
				placeholder: t("rt.a.searchPh"),
				value: q,
				onChange: (e) => {
					setQ(e.target.value);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") setQApplied(q);
				}
			}), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					setQApplied(q);
				}
			}, t("rt.a.search")), h("input", {
				class: "dshp-rt-input",
				style: { width: "78px" },
				placeholder: t("rt.a.service"),
				value: service,
				onChange: (e) => {
					setService(e.target.value);
				}
			}), h("input", {
				class: "dshp-rt-input",
				style: { width: "60px" },
				placeholder: t("rt.a.port"),
				value: port,
				onChange: (e) => {
					setPort(e.target.value);
				}
			}), h("select", {
				class: "dshp-rt-input",
				value: scope,
				onChange: (e) => {
					setScope(e.target.value);
				}
			}, h("option", { value: "" }, t("rt.a.scopeAny")), h("option", { value: "external" }, t("rt.a.scopeExt")), h("option", { value: "internal" }, t("rt.a.scopeInt"))), h("select", {
				class: "dshp-rt-input",
				value: prov,
				title: t("rt.a.provTitle"),
				onChange: (e) => {
					setProv(e.target.value);
				}
			}, h("option", { value: "" }, t("rt.a.provAny")), h("option", { value: "passive" }, t("rt.a.provPassive")), h("option", { value: "active" }, t("rt.a.provActive"))), h("select", {
				class: "dshp-rt-input",
				value: priority,
				onChange: (e) => {
					setPriority(e.target.value);
				}
			}, h("option", { value: "" }, t("rt.a.priAny")), h("option", { value: "high" }, t("rt.pri.high")), h("option", { value: "medium" }, t("rt.pri.medium")), h("option", { value: "low" }, t("rt.pri.low"))), h("select", {
				class: "dshp-rt-input",
				value: testStatus,
				onChange: (e) => {
					setTestStatus(e.target.value);
				}
			}, h("option", { value: "" }, t("rt.a.testAny")), h("option", { value: "untested" }, t("rt.test.untested")), h("option", { value: "testing" }, t("rt.test.testing")), h("option", { value: "tested" }, t("rt.test.tested")), h("option", { value: "blocked" }, t("rt.test.blocked")), h("option", { value: "abandoned" }, t("rt.test.abandoned")), h("option", { value: "no_surface" }, t("rt.test.no_surface"))), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("rt.a.refreshTitle"),
				onClick: () => {
					props.onRefresh();
				}
			}, t("rt.refresh")), h("button", {
				class: "dshp-rt-btn" + (view === "list" ? " dshp-rt-btn-primary" : ""),
				type: "button",
				onClick: () => {
					setView("list");
				}
			}, t("rt.a.viewList")), h("button", {
				class: "dshp-rt-btn" + (view === "timeline" ? " dshp-rt-btn-primary" : ""),
				type: "button",
				title: t("rt.a.viewTimelineTitle"),
				onClick: () => {
					setView("timeline");
				}
			}, t("rt.a.viewTimeline")), h("button", {
				class: "dshp-rt-btn" + (view === "domain" ? " dshp-rt-btn-primary" : ""),
				type: "button",
				onClick: () => {
					setView("domain");
				}
			}, t("rt.a.viewDomain")), h("button", {
				class: "dshp-rt-btn" + (view === "web" ? " dshp-rt-btn-primary" : ""),
				type: "button",
				onClick: () => {
					setView("web");
				}
			}, t("rt.a.viewWeb")));
			const tests = props.snapshot !== null && props.snapshot.tests || {};
			const snapStats = props.snapshot !== null && props.snapshot.stats || {};
			const noFilter = testStatus === "" && priority === "" && scope === "" && prov === "" && assetState === "" && cidr === null;
			const conclItem = (key, label, value, active, onClick) => h("span", {
				...clickable(onClick, {
					label: t("rt.a.filterBy", {
						label,
						n: value || 0
					}),
					expanded: active
				}),
				key,
				class: "dshp-rt-concl-i" + (active ? " on" : ""),
				title: t("rt.a.filterHint")
			}, h("b", null, String(value || 0)), h("span", null, label));
			const toggleTest = (v) => {
				setTestStatus((cur) => cur === v ? "" : v);
				setAssetState("");
			};
			const conclusion = h("div", { class: "dshp-rt-concl" }, conclItem("all", t("rt.a.nAssets"), snapStats.assets ?? 0, noFilter, () => {
				setTestStatus("");
				setPriority("");
				setScope("");
				setProv("");
				setAssetState("");
				setCidr(null);
			}), conclItem("live", t("rt.a.nLive"), snapStats.liveAssets ?? 0, assetState === "live", () => {
				setAssetState((v) => v === "live" ? "" : "live");
				setTestStatus("");
			}), conclItem("untested", t("rt.a.nUntested"), tests.untested ?? 0, testStatus === "untested", () => {
				toggleTest("untested");
			}), conclItem("testing", t("rt.test.testing"), tests.testing ?? 0, testStatus === "testing", () => {
				toggleTest("testing");
			}), conclItem("tested", t("rt.test.tested"), tests.tested ?? 0, testStatus === "tested", () => {
				toggleTest("tested");
			}), conclItem("giveup", t("rt.a.nGiveup"), (tests.abandoned ?? 0) + (tests.blocked ?? 0), testStatus === "abandoned,blocked", () => {
				toggleTest("abandoned,blocked");
			}), h("div", { class: "dshp-rt-spacer" }), h("select", {
				class: "dshp-rt-input",
				value: sort,
				title: t("rt.a.sortTitle"),
				onChange: (e) => {
					setSort(e.target.value);
				}
			}, h("option", { value: "priority" }, t("rt.a.sortPriority")), h("option", { value: "todo" }, t("rt.a.sortTodo")), h("option", { value: "discovered" }, t("rt.a.sortDiscovered")), h("option", { value: "ports" }, t("rt.a.sortPorts")), h("option", { value: "ip" }, t("rt.a.sortIp"))));
			const head = h("div", { class: "dshp-rt-row head" }, h("span", null, t("rt.a.hIp")), h("span", null, t("rt.pri.title")), h("span", null, t("rt.a.hTest")), h("span", null, t("rt.a.hPorts")), h("span", null, t("rt.a.hFp")));
			const rowNodes = [];
			for (const it of state.items) {
				const openPorts = (it.ports ?? []).filter((p) => p.state === "open");
				const portText = openPorts.map((p) => p.port + (p.service ? "/" + p.service : "")).join(", ") || "—";
				const fpText = (it.fingerprints ?? []).map((f) => [
					f.vendor,
					f.product,
					f.version
				].filter(Boolean).join(" ")).join(" / ") || "—";
				const shownPorts = openPorts.slice(0, 3).map((p) => p.port + (p.service ? "/" + p.service : "")).join(", ");
				const morePorts = openPorts.length > 3 ? " +" + (openPorts.length - 3) : "";
				rowNodes.push(h("div", {
					...clickable(() => {
						toggleRow(it.id);
					}, {
						label: t("rt.a.expandAsset", { ip: it.ip }),
						expanded: openId === it.id
					}),
					key: "r" + it.id,
					class: "dshp-rt-row"
				}, h("span", {
					class: "dshp-rt-mono",
					style: {
						display: "flex",
						alignItems: "baseline",
						gap: 4,
						flexWrap: "wrap"
					}
				}, h("span", { class: "dshp-rt-scope dshp-rt-scope-" + (it.scope === "internal" ? "internal" : "external") }, it.scope === "internal" ? t("rt.scope.inShort") : t("rt.scope.outShort")), h("span", {
					title: it.state === "live" ? t("rt.a.stateLive") : String(it.state),
					style: {
						width: 7,
						height: 7,
						borderRadius: "50%",
						flex: "none",
						marginTop: 4,
						background: it.state === "live" ? "#10b981" : "#94a3b8"
					}
				}), h("span", { style: {
					overflow: "hidden",
					textOverflow: "ellipsis"
				} }, it.ip), h("span", {
					style: {
						fontSize: 10.5,
						color: "var(--dsw-alias-label-secondary)",
						whiteSpace: "nowrap"
					},
					title: t("rt.a.discoveredAt") + ":" + (it.discovered_at ? fmt(it.discovered_at) : t("rt.a.discoverUnknown")) + (it.last_seen ? "\n" + t("rt.a.lastSeen") + ":" + fmt(it.last_seen) : "")
				}, it.discovered_at ? fmtShort(it.discovered_at) : t("rt.a.discoverUnknown"))), h("span", null, h(PriTag, {
					t,
					p: it.priority,
					title: it.potential || ""
				})), h("span", null, h(TestTag, {
					t,
					s: it.test_status
				}), it.blocked_count ? h("span", {
					class: "dshp-rt-tag",
					style: {
						color: "#ef4444",
						borderColor: "#ef444455",
						marginLeft: 4
					}
				}, t("rt.a.blockedShort", { n: it.blocked_count })) : null), h("span", { title: portText }, (shownPorts || "—") + morePorts), h("span", { title: fpText }, fpText.length > 30 ? fpText.slice(0, 30) + "…" : fpText)));
				if (openId !== it.id) continue;
				const d = detail !== null && detail.id === it.id ? detail : null;
				const portRows = [];
				const fpRows = [];
				const obsRows = [];
				if (d !== null) {
					for (const p of d.ports ?? []) {
						if (p.state !== "open") continue;
						portRows.push(h("div", {
							key: "p" + p.port,
							class: "dshp-rt-kv"
						}, h("b", { class: "dshp-rt-mono" }, p.port + "/" + p.proto), h("span", null, [
							p.service,
							p.product,
							p.version
						].filter(Boolean).join(" ") || t("rt.a.unknownService")), p.url ? h("a", {
							class: "dshp-rt-link",
							href: p.url,
							target: "_blank",
							rel: "noreferrer",
							title: p.url
						}, p.title !== void 0 && p.title !== "" ? p.title : p.url) : null, h(ProvTag, {
							t,
							p: p.provenance
						})));
					}
					for (const f of d.fingerprints ?? []) fpRows.push(h("div", {
						key: "f" + (f.product || "") + (f.version || "") + (f.evidence || ""),
						class: "dshp-rt-kv"
					}, h("b", null, f.category || "—"), h("span", null, [
						f.vendor,
						f.product,
						f.version
					].filter(Boolean).join(" ") + (f.evidence ? "（" + f.evidence + "）" : "")), h(ProvTag, {
						t,
						p: f.provenance
					})));
					if (cves.length > 0) for (const c of cves) fpRows.push(h("div", {
						key: "cve" + (c.cve || c.title),
						class: "dshp-rt-kv"
					}, h("b", {
						class: "dshp-rt-mono",
						style: { color: c.severity === "critical" ? "var(--dsw-alias-state-error-primary)" : void 0 }
					}, (c.cve || t("rt.a.cveNoId")) + (c.exploit ? " ⚡" : "")), h("span", { title: String(c.title || "") }, String(c.title || "") + (c.matched_version ? "（" + c.matched_product + " " + c.matched_version + "）" : "")), h("span", { class: "dshp-rt-tag" }, String(c.severity || ""))));
					for (const o of (d.observations ?? []).slice(0, 8)) obsRows.push(h("div", {
						key: "o" + (o.attr || "") + (o.value || "") + (o.collected_at || ""),
						class: "dshp-rt-kv"
					}, h("b", null, o.attr || "—"), h("span", null, (o.value || "") + " · " + (o.tool || t("rt.a.unknownTool")) + " · " + fmt(o.collected_at)), h(ProvTag, {
						t,
						p: o.provenance
					})));
				}
				const all = showAll === it.id;
				const noteLines = d !== null && d.test_notes ? String(d.test_notes).split("\n").filter(Boolean) : [];
				const inner = d !== null ? h("div", null, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.a.dTest")), h("span", null, h(TestTag, {
					t,
					s: d.test_status
				}), d.blocked_count ? h("span", {
					class: "dshp-rt-tag",
					style: {
						marginLeft: 6,
						color: "#ef4444",
						borderColor: "#ef444455"
					}
				}, t("rt.a.blockedN", { n: d.blocked_count })) : null, h("span", { style: {
					marginLeft: 8,
					color: "var(--dsw-alias-label-secondary)"
				} }, (d.test_updated_at ? fmt(d.test_updated_at) : t("rt.a.notTested")) + (d.test_updated_by ? " · " + d.test_updated_by : "")))), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.pri.title")), h("span", null, h(PriTag, {
					t,
					p: d.priority
				}), h("span", { style: { marginLeft: 8 } }, d.potential || t("rt.a.priNone")), d.assess_reason ? h("span", { style: {
					marginLeft: 8,
					color: "var(--dsw-alias-label-secondary)"
				} }, d.assess_reason) : null)), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.a.dSurface")), h("span", null, d.test_surface || (portRows.length > 0 ? t("rt.a.surfaceUnrecorded") : t("rt.a.noPorts")), d.scope ? h("span", {
					class: "dshp-rt-scope dshp-rt-scope-" + (d.scope === "internal" ? "internal" : "external"),
					style: { marginLeft: 8 }
				}, d.scope === "internal" ? t("rt.scope.internalAsset") : t("rt.scope.externalAsset")) : null)), h("span", {
					...clickable(() => {
						setShowAll(all ? null : it.id);
					}, {
						label: all ? t("rt.a.less") : t("rt.a.more"),
						expanded: all
					}),
					class: "dshp-rt-more"
				}, all ? t("rt.a.less") : t("rt.a.more")), all ? h("div", null, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.a.hostnames")), h("span", null, (d.names ?? []).map((n) => n.name).join(", ") || "—")), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.a.discoveredAt")), h("span", { title: t("rt.a.discoveredTip") }, fmt(d.discovered_at)), h("b", { style: {
					minWidth: 0,
					marginLeft: 8
				} }, t("rt.a.lastSeen")), h("span", null, fmt(d.last_seen)), h("b", { style: {
					minWidth: 0,
					marginLeft: 8
				} }, t("rt.a.firstSeen")), h("span", null, fmt(d.first_seen))), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.a.dCidr")), h("span", null, d.segment_cidr)), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.pri.title")), h("span", null, (d.priority || t("rt.a.priNone")) + (d.potential ? " · " + t("rt.a.priExpect") + d.potential : "") + (d.assess_reason ? " · " + t("rt.a.priReason") + d.assess_reason : "") + (d.assessed_at ? "（" + fmt(d.assessed_at) + "）" : ""))), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.a.dSource")), h("span", null, t("rt.a.passivePorts", { n: d.passive ?? 0 }) + " · " + t("rt.a.activePorts", { n: d.active ?? 0 }))), h("div", { style: {
					margin: "6px 0 3px",
					fontWeight: 600
				} }, t("rt.a.openPorts")), h("div", null, portRows.length > 0 ? portRows : "—"), h("div", { style: {
					margin: "6px 0 3px",
					fontWeight: 600
				} }, t("rt.a.hFp")), h("div", null, fpRows.length > 0 ? fpRows : "—"), noteLines.length > 0 ? h(Clip, {
					key: "notes",
					t,
					label: t("rt.a.notes", { n: noteLines.length }),
					text: noteLines.join("\n")
				}) : null, h("div", { style: {
					margin: "6px 0 3px",
					fontWeight: 600
				} }, t("rt.a.observations")), h("div", null, obsRows.length > 0 ? obsRows : "—")) : null) : h("div", null, t("rt.loading"));
				rowNodes.push(h("div", {
					key: "d" + it.id,
					class: "dshp-rt-row",
					style: {
						cursor: "default",
						gridTemplateColumns: "1fr"
					}
				}, h("div", { class: "dshp-rt-expand" }, inner)));
			}
			const listPane = h("div", { class: "dshp-rt-table" }, head, rowNodes, !state.loading && state.items.length === 0 ? h("div", { class: "dshp-rt-empty" }, t("rt.a.noMatch")) : null);
			const domainPane = h("div", { class: "dshp-rt-table" }, domains === null ? h("div", { class: "dshp-rt-empty" }, t("rt.loading")) : domains.length === 0 ? h("div", { class: "dshp-rt-empty" }, cidr !== null ? t("rt.a.domainEmptyCidr") : t("rt.a.domainEmpty")) : domains.map((g) => h("div", { key: g.domain }, h("div", {
				class: "dshp-rt-section",
				style: { padding: "8px 10px 4px" }
			}, h("a", {
				class: "dshp-rt-link",
				href: "http://" + g.domain,
				target: "_blank",
				rel: "noreferrer"
			}, g.domain), h("span", {
				class: "dshp-rt-tag",
				style: { marginLeft: 8 }
			}, t("rt.a.nAssetsTag", { n: g.count }))), (g.assets ?? []).map((a) => h("div", {
				key: String(g.domain) + "\0" + a.id + "\0" + a.ip,
				class: "dshp-rt-row",
				style: {
					gridTemplateColumns: "150px 130px 70px 1fr",
					cursor: "pointer"
				},
				onClick: () => {
					setView("list");
					setQ("");
					setQApplied(a.ip);
				}
			}, h("span", { class: "dshp-rt-mono" }, a.ip), h("span", { class: "dshp-rt-mono" }, a.segment), h("span", null, h("span", { class: "dshp-rt-tag dshp-rt-tag-" + (a.state === "live" ? "live" : "dead") }, a.state === "live" ? t("rt.a.stateLive") : a.state)), h("span", { style: {
				fontSize: 11,
				color: "var(--dsw-alias-label-secondary)"
			} }, (a.names ?? []).join(", ")))))));
			const webPane = h("div", { class: "dshp-rt-table" }, h("div", {
				class: "dshp-rt-row head",
				style: { gridTemplateColumns: "1.6fr 1.2fr 130px 110px" }
			}, h("span", null, t("rt.a.webUrl")), h("span", null, t("rt.a.webTitle")), h("span", null, t("rt.a.webAsset")), h("span", null, t("rt.a.webService"))), (web ?? []).map((w) => {
				const url = w.url || "http" + (w.port === 443 || w.port === 8443 || w.port === 9443 ? "s" : "") + "://" + w.ip + (w.port === 80 || w.port === 443 ? "" : ":" + w.port);
				return h("div", {
					key: "w" + w.port_id,
					class: "dshp-rt-row",
					style: {
						gridTemplateColumns: "1.6fr 1.2fr 130px 110px",
						cursor: "default"
					}
				}, h("a", {
					class: "dshp-rt-link dshp-rt-mono",
					href: url,
					target: "_blank",
					rel: "noreferrer",
					title: url
				}, url), h("span", { title: w.title || "" }, w.title || "—"), h("span", { class: "dshp-rt-mono" }, w.ip + " · " + w.segment_cidr), h("span", { style: { fontSize: 11 } }, [
					w.service,
					w.product,
					w.version
				].filter(Boolean).join(" ")));
			}), web === null ? h("div", { class: "dshp-rt-empty" }, t("rt.loading")) : web.length === 0 ? h("div", { class: "dshp-rt-empty" }, cidr !== null ? t("rt.a.webEmptyCidr") : t("rt.a.webEmpty")) : null);
			let pane = listPane;
			if (view === "domain") pane = domainPane;
			else if (view === "web") pane = webPane;
			else if (view === "timeline") pane = h(DiscoveryView, {
				t,
				eng,
				refreshKey: props.refreshKey
			});
			return h("div", { class: "dshp-rt-split" }, side, h("div", { class: "dshp-rt-main" }, toolbar, conclusion, state.error !== null ? h("div", { class: "dshp-rt-err" }, state.error) : null, pane));
		}
		function DiscoveryView(props) {
			const t = props.t;
			const [data, setData] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [day, setDay] = (0, react.useState)("");
			(0, react.useEffect)(() => {
				if (props.eng === null || props.eng === "") return;
				setData(null);
				rtOp("discoveryTimeline", {
					engagement: props.eng,
					limit: 200
				}).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setData(r.data);
				});
			}, [props.eng, props.refreshKey]);
			if (err !== null) return h("div", { class: "dshp-rt-pane" }, h("div", { class: "dshp-rt-err" }, err));
			if (data === null) return h("div", { class: "dshp-rt-empty" }, t("rt.loading"));
			const recent = (data.recent ?? []).filter((a) => day === "" || String(a.discovered_at || "").slice(0, 10) === day);
			const span = data.span ?? {};
			return h("div", {
				class: "dshp-rt-pane",
				style: {
					flex: 1,
					minHeight: 0
				}
			}, h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.dt.title")), h("div", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.dt.span", {
				n: span.total ?? 0,
				first: span.first !== void 0 && span.first !== null ? fmt(span.first) : "—",
				last: span.last !== void 0 && span.last !== null ? fmt(span.last) : "—"
			}))), (data.days ?? []).length === 0 ? h("div", { class: "dshp-rt-empty" }, t("rt.dt.noAssets")) : null, h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.dt.byDay"), day !== "" ? h("span", {
				...clickable(() => {
					setDay("");
				}, { label: t("rt.dt.clearFilter", { day }) }),
				class: "dshp-rt-tag",
				style: {
					marginLeft: 6,
					cursor: "pointer"
				}
			}, t("rt.dt.clearFilterShort", { day })) : null), h("div", { style: {
				display: "flex",
				flexWrap: "wrap",
				gap: 8
			} }, (data.days ?? []).map((d) => h("div", {
				...clickable(() => {
					setDay(day === d.day ? "" : d.day);
				}, {
					label: t("rt.dt.filterDay", { day: d.day }),
					expanded: day === d.day
				}),
				key: d.day,
				class: "dshp-rt-seg" + (day === d.day ? " on" : ""),
				style: {
					marginBottom: 0,
					cursor: "pointer"
				},
				title: d.day + "：" + t("rt.dt.dayTitle", {
					n: d.assets,
					ni: d.internal,
					ne: d.external
				})
			}, h("div", { class: "dshp-rt-seg-cidr" }, d.day), h("div", { class: "dshp-rt-seg-meta" }, t("rt.dt.dayMeta", {
				n: d.assets,
				ni: d.internal,
				ne: d.external
			})))))), h("div", { class: "dshp-rt-card" }, h("h4", null, day !== "" ? t("rt.dt.recentOfDay", {
				day,
				n: recent.length
			}) : t("rt.dt.recent", { n: recent.length })), recent.length === 0 ? h("div", { class: "dshp-rt-empty" }, t("rt.dt.dayEmpty")) : null, recent.map((a) => h("div", {
				key: a.id,
				class: "dshp-rt-kv"
			}, h("b", {
				class: "dshp-rt-mono",
				style: { minWidth: 110 }
			}, h("span", {
				class: "dshp-rt-scope dshp-rt-scope-" + (a.scope === "internal" ? "internal" : "external"),
				style: { marginRight: 4 }
			}, a.scope === "internal" ? t("rt.scope.inShort") : t("rt.scope.outShort")), a.ip), h("span", { style: {
				minWidth: 132,
				fontSize: 11.5,
				color: "var(--dsw-alias-label-secondary)"
			} }, a.discovered_at ? fmt(a.discovered_at) : t("rt.dt.timeUnknown")), h("span", { style: { flex: 1 } }, (a.primary_name || "—") + (a.open_ports ? " · " + t("rt.dt.ports", { n: a.open_ports }) : "")), h(PriTag, {
				t,
				p: a.priority
			})))));
		}
		// client/redteam/AgentsTab.tsx
		/**
		* 作战智能体页签：并发名额（可调）+ 六个角色说明 + 角色提示词编辑器。
		* 自旧 client.js AgentsTab / ConcurrencyCard / PromptsTab 迁移合并。
		*/
		function AgentsTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [roles, setRoles] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [concurrency, setConcurrency] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const load = () => {
				setBusy(true);
				rtOp(eng !== null && eng !== "" ? "prompts" : "bootstrap", { engagement: eng ?? void 0 }).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					if (r.data.roles !== void 0) setRoles(r.data.roles);
				});
				rtOp("agentsStatus").then((r) => {
					if (r.ok) setConcurrency(r.data);
				});
			};
			(0, react.useEffect)(load, [eng, props.refreshKey]);
			const used = concurrency !== null ? concurrency.used : null;
			const max = concurrency !== null ? concurrency.max : 3;
			return h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.tab.agents")), h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, t("rt.ag.maxN", { n: max })), used === null ? h("span", { class: "dshp-rt-tag" }, t("rt.ag.usedUnknown")) : h("span", { class: "dshp-rt-tag" + (used >= max ? " dshp-rt-tag-warn" : " dshp-rt-tag-live") }, t("rt.ag.usedN", {
				used,
				free: Math.max(max - used, 0)
			})), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: load
			}, busy ? t("rt.loading") : t("rt.refresh"))), h("div", { class: "dshp-rt-pane" }, err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.ag.rulesTitle")), h("div", { style: {
				fontSize: 12,
				lineHeight: 1.7
			} }, h("div", null, t("rt.ag.rule1", { n: max })), h("div", null, t("rt.ag.rule2")), h("div", null, t("rt.ag.rule3")))), h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.ag.rolesTitle")), h("div", { style: {
				fontSize: 12,
				lineHeight: 1.8
			} }, h("div", null, t("rt.ag.role1")), h("div", null, t("rt.ag.role2")), h("div", null, t("rt.ag.role3")), h("div", null, t("rt.ag.role4")), h("div", null, t("rt.ag.role5")), h("div", null, t("rt.ag.role6")))), h(ConcurrencyCard, {
				t,
				concurrency,
				onSaved: load
			}), h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.ag.promptsTitle")), h("div", { style: {
				fontSize: 11.5,
				color: "var(--dsw-alias-label-secondary)",
				marginBottom: 6
			} }, t("rt.ag.promptsHint")), h(PromptsTab, {
				t,
				eng,
				refreshKey: props.refreshKey
			}))));
		}
		function ConcurrencyCard(props) {
			const t = props.t;
			const info = props.concurrency ?? {};
			const [draft, setDraft] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			const [msg, setMsg] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (info.max !== void 0) setDraft(String(info.max));
			}, [info.max]);
			const limit = info.limit ?? 10;
			const used = typeof info.used === "number" ? info.used : null;
			const source = info.source === "settings" ? t("rt.ag.srcSettings") : info.source === "env" ? t("rt.ag.srcEnv") : t("rt.ag.srcDefault");
			const n = Number(draft);
			const invalid = !Number.isFinite(n) || Math.floor(n) !== n || n < 1 || n > limit;
			const save = () => {
				if (invalid) return;
				setBusy(true);
				setMsg(null);
				rtOp("setAgentsMax", { max: n }).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setMsg({ ok: t("rt.ag.savedMax", { n: r.data.max }) });
					props.onSaved();
				});
			};
			return h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.ag.concurrencyTitle")), h("div", { style: {
				fontSize: 12,
				lineHeight: 1.8,
				marginBottom: 8
			} }, t("rt.ag.concurrencyLine", {
				max: info.max || "?",
				used: used === null ? "" : t("rt.ag.concurrencyUsed", {
					used,
					free: Math.max((info.max || 0) - used, 0)
				}),
				source
			})), h("div", { style: {
				display: "flex",
				gap: 8,
				alignItems: "center",
				flexWrap: "wrap"
			} }, h("input", {
				class: "dshp-rt-input",
				style: { width: 90 },
				type: "number",
				min: 1,
				max: limit,
				value: draft,
				onChange: (e) => {
					setDraft(e.target.value);
				}
			}), h("span", { style: {
				fontSize: 11.5,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.ag.rangeOf", { n: limit })), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: busy || invalid,
				onClick: save
			}, busy ? t("rt.saving") : t("rt.save")), msg !== null && msg.err !== void 0 ? h("span", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-state-error-primary, #d33)"
			} }, msg.err) : null, msg !== null && msg.ok !== void 0 ? h("span", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-label-secondary)"
			} }, msg.ok) : null), h("div", { style: {
				marginTop: 8,
				fontSize: 11.5,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.ag.concurrencyWarn")));
		}
		function PromptsTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [roles, setRoles] = (0, react.useState)([]);
			const [active, setActive] = (0, react.useState)(null);
			const [draft, setDraft] = (0, react.useState)("");
			const [msg, setMsg] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				rtOp("prompts", eng !== null && eng !== "" ? { engagement: eng } : {}).then((r) => {
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setRoles(r.data.roles ?? []);
					if ((r.data.roles ?? []).length > 0) setActive((cur) => cur ?? r.data.roles[0].role);
					if (r.data.builtin === true) setMsg({ ok: t("rt.p.builtinNote") });
				});
			}, [eng, props.refreshKey]);
			(0, react.useEffect)(() => {
				const r = roles.find((x) => x.role === active);
				if (r !== void 0) setDraft(r.content || "");
			}, [active, roles]);
			const save = () => {
				if (eng === null || eng === "") {
					setMsg({ err: t("rt.p.needEngagement") });
					return;
				}
				if (active === null) return;
				setBusy(true);
				setMsg(null);
				rtOp("savePrompt", {
					engagement: eng,
					role: active,
					content: draft
				}).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setRoles((list) => list.map((x) => x.role === active ? {
						...x,
						content: draft,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					} : x));
					setMsg({ ok: t("rt.saved") });
				});
			};
			const reset = (all) => {
				if (eng === null || eng === "") {
					setMsg({ err: t("rt.p.needEngagement") });
					return;
				}
				setBusy(true);
				setMsg(null);
				rtOp("resetPrompts", {
					engagement: eng,
					role: all ? void 0 : active ?? void 0
				}).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setMsg({ ok: t("rt.p.resetDone", { roles: (r.data.reset ?? []).join(t("rt.p.resetSep")) }) });
					rtOp("prompts", { engagement: eng }).then((rr) => {
						if (!rr.ok) return;
						setRoles(rr.data.roles ?? []);
						const cur2 = (rr.data.roles ?? []).find((x) => x.role === active);
						if (cur2 !== void 0) setDraft(cur2.content || "");
					});
				});
			};
			const cur = roles.find((x) => x.role === active);
			const items = roles.map((r) => h("div", {
				...clickable(() => {
					setActive(r.role);
					setMsg(null);
				}, {
					label: t("rt.p.viewPrompt", { role: r.title }),
					expanded: active === r.role
				}),
				key: r.role,
				class: "dshp-rt-item" + (active === r.role ? " on" : "")
			}, h("div", { class: "dshp-rt-item-name" }, r.title), h("div", { class: "dshp-rt-item-desc" }, (r.content || "").replace(/[#*`]/g, "").slice(0, 60) || t("rt.empty"))));
			return h("div", { class: "dshp-rt-split" }, h("div", { class: "dshp-rt-list" }, items), h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, cur !== void 0 ? cur.title : t("rt.p.promptsTitle")), h("span", { class: "dshp-rt-tag" }, t("rt.p.updated", { time: fmt(cur !== void 0 ? cur.updated_at : "") })), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy || active === null,
				title: t("rt.p.resetCurTitle"),
				onClick: () => {
					reset(false);
				}
			}, t("rt.p.resetCur")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				title: t("rt.p.resetAllTitle"),
				onClick: () => {
					reset(true);
				}
			}, t("rt.p.resetAll")), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: busy || active === null,
				onClick: save
			}, busy ? t("rt.saving") : t("rt.save"))), msg !== null ? h("div", { class: msg.err !== void 0 ? "dshp-rt-err" : "dshp-rt-foot" }, msg.err || msg.ok) : null, h("div", { class: "dshp-rt-pane" }, h("textarea", {
				class: "dshp-rt-textarea",
				value: draft,
				spellCheck: false,
				onChange: (e) => {
					setDraft(e.target.value);
				},
				placeholder: t("rt.p.placeholder")
			}), h("div", { style: {
				fontSize: 11,
				color: "var(--dsw-alias-label-secondary)",
				marginTop: 6
			} }, t("rt.p.saveHint", { role: active || "role" })))));
		}
		// client/redteam/ChainTab.tsx
		/**
		* 攻击链页签（五阶段）：A 竖向链（逐阶段细节）/ B 横向链（一屏看完）。
		* 自旧 client.js ChainTab 迁移；新增深链消费：jump('chain', { hitId }) 展开对应命中。
		*/
		const CIRCLED$1 = [
			"①",
			"②",
			"③",
			"④",
			"⑤",
			"⑥"
		];
		function ChainTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [data, setData] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [loading, setLoading] = (0, react.useState)(false);
			const [view, setView] = (0, react.useState)("A");
			const [openId, setOpenId] = (0, react.useState)(null);
			const load = () => {
				if (eng === null || eng === "") return;
				setLoading(true);
				rtOp("scoreChain", { engagement: eng }).then((r) => {
					setLoading(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setData(r.data);
				});
			};
			(0, react.useEffect)(load, [eng, props.refreshKey]);
			(0, react.useEffect)(() => {
				const p = props.params;
				if (p === null || p === void 0 || p.hitId === void 0) return;
				setOpenId(p.hitId);
			}, [props.params]);
			const stages = data !== null && data.stages || [];
			const summary = data !== null ? data.summary : null;
			const toggle = (id) => {
				setOpenId((cur) => cur === id ? null : id);
			};
			const hitDetail = (x) => h("div", { class: "dshp-rt-flow-detail" }, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.hTarget")), h("span", {
				class: "dshp-rt-mono",
				style: { wordBreak: "break-all" }
			}, x.target || "—")), x.asset_ip ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.asset")), h("span", { class: "dshp-rt-mono" }, x.asset_ip)) : null, x.vuln_title ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.c.usedVuln")), h("span", null, [x.vuln_cve, x.vuln_title].filter(Boolean).join(" "))) : null, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.c.nthOfPoint")), h("span", null, t("rt.c.nthOf", {
				n: x.nth_of_point,
				pts: x.points ?? 0
			}))), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.c.record")), h("span", null, fmt(x.recorded_at) + (x.recorded_by ? " · " + x.recorded_by : ""))), x.evidence ? h(Clip, {
				t,
				label: t("rt.c.resultEvidence"),
				text: x.evidence
			}) : null);
			const hitRow = (x) => h("div", {
				key: "h" + x.id,
				class: "dshp-rt-ap-hit" + (openId === x.id ? " open" : ""),
				role: "button",
				tabIndex: 0,
				onClick: () => {
					toggle(x.id);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						toggle(x.id);
					}
				}
			}, h("div", { class: "dshp-rt-ap-hit-head" }, h("span", {
				class: "dshp-rt-ap-pts" + (x.counted ? "" : " uncounted"),
				title: x.capped_reason || void 0
			}, "+" + (x.counted === true ? x.points ?? 0 : 0)), h("span", { class: "dshp-rt-ap-hit-name" }, x.point_name), x.capped === true ? h("span", {
				class: "dshp-rt-tag dshp-rt-tag-warn",
				title: x.capped_reason || t("rt.c.cappedDefault")
			}, t("rt.c.cappedTag")) : null, x.nth_of_point > 1 ? h("span", { class: "dshp-rt-ap-nth" }, t("rt.c.nth", { n: x.nth_of_point })) : null, h("span", { class: "dshp-rt-ap-hit-target" }, x.target || x.asset_ip || "—")), x.action ? h("div", { class: "dshp-rt-ap-act" + (x.action_inferred ? " inferred" : "") }, t("rt.c.action") + "：" + (x.action.title || t("rt.c.unnamedStep")) + (x.action_inferred ? t("rt.c.inferred") : "")) : null, openId === x.id ? hitDetail(x) : null);
			const assetRow = (a) => h("div", {
				key: "a" + a.id,
				class: "dshp-rt-ap-asset"
			}, h(ScopeTag, {
				t,
				scope: a.scope,
				short: true
			}), h("span", {
				class: "dshp-rt-mono",
				style: { fontWeight: 600 }
			}, a.ip), a.segment_cidr ? h("span", { class: "dshp-rt-ap-nth" }, a.segment_cidr) : null, h("span", { class: "dshp-rt-ap-nth" }, t("rt.a.dPorts", { n: a.open_ports ?? 0 })), a.vulns ? h("span", { class: "dshp-rt-ap-nth" }, t("rt.c.nVulns", { n: a.vulns })) : null, a.priority ? h("span", { class: "dshp-rt-tag" }, t("rt.c.easyN", { p: a.priority })) : null, h("div", { class: "dshp-rt-spacer" }), h("span", { class: "dshp-rt-ap-pts" }, "+" + (a.points ?? 0)), h("span", { class: "dshp-rt-ap-nth" }, t("rt.c.nHits", { n: a.hits ?? 0 })));
			const stageA = (st, i) => {
				const isRecon = st.code === "recon";
				const body = [];
				if (isRecon) {
					body.push(h("div", {
						key: "at",
						class: "dshp-rt-ap-sub"
					}, t("rt.c.scoredAssets", { n: st.assetCount })));
					body.push(h("div", {
						key: "al",
						class: "dshp-rt-ap-assets"
					}, (st.assets ?? []).length > 0 ? st.assets.map(assetRow) : h("div", { class: "dshp-rt-ap-none" }, t("rt.c.noScoredAssets"))));
				} else {
					body.push(h("div", {
						key: "ht",
						class: "dshp-rt-ap-sub"
					}, t("rt.c.stageHits", { n: st.hits }) + (st.points ? " · +" + st.points : "")));
					body.push(h("div", {
						key: "hl",
						class: "dshp-rt-ap-hits"
					}, (st.items ?? []).length > 0 ? st.items.map(hitRow) : h("div", { class: "dshp-rt-ap-none" }, t("rt.c.noStageScore"))));
					if (st.code === "boundary") {
						const selfOnly = (st.tunnels_self_only ?? []).length;
						body.push(h("div", {
							key: "tt",
							class: "dshp-rt-ap-sub"
						}, t("rt.c.tunnelsOf", { n: (st.tunnels ?? []).length }) + (selfOnly > 0 ? t("rt.c.tunnelsSelfOnly", { n: selfOnly }) : "")));
						if (selfOnly > 0 && (st.tunnels ?? []).length === 0) body.push(h("div", {
							key: "tw",
							class: "dshp-rt-ap-none"
						}, t("rt.c.tunnelsAllSelf")));
						body.push(h("div", {
							key: "tl",
							class: "dshp-rt-ap-tunnels"
						}, (st.tunnels ?? []).length > 0 ? st.tunnels.map((tr) => h("div", {
							key: "t" + tr.id,
							class: "dshp-rt-ap-tunnel"
						}, h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, tr.kind || "tunnel"), h("span", {
							class: "dshp-rt-mono",
							style: { fontWeight: 600 }
						}, tr.listen || "—"), h("span", {
							class: "dshp-rt-tag " + (tr.status === "active" ? "dshp-rt-tag-live" : ""),
							style: tr.status === "active" ? {} : { opacity: .7 }
						}, tr.status === "active" ? t("rt.c.usable") : tr.status || t("rt.unknown")), h("span", {
							class: "dshp-rt-ap-nth",
							style: {
								minWidth: 0,
								overflow: "hidden",
								textOverflow: "ellipsis"
							}
						}, t("rt.c.reach") + " " + (tr.reach || "—")))) : h("div", { class: "dshp-rt-ap-none" }, t("rt.c.noTunnels"))));
					}
					if ((st.assets ?? []).length > 0 && st.code !== "boundary") {
						body.push(h("div", {
							key: "at2",
							class: "dshp-rt-ap-sub"
						}, t("rt.c.involvedAssets", { n: st.assetCount })));
						body.push(h("div", {
							key: "al2",
							class: "dshp-rt-ap-assets"
						}, st.assets.map(assetRow)));
					}
				}
				return h("div", {
					key: "st" + st.code,
					class: "dshp-rt-ap-stage"
				}, h("div", {
					class: "dshp-rt-ap-head",
					style: { borderLeftColor: st.color }
				}, h("span", {
					class: "dshp-rt-ap-no",
					style: { background: st.color }
				}, CIRCLED$1[i] || "0" + (i + 1)), h("span", { class: "dshp-rt-ap-name" }, st.name), st.subtitle ? h("span", { class: "dshp-rt-ap-en" }, st.subtitle) : null, h("div", { class: "dshp-rt-spacer" }), st.points > 0 ? h("span", {
					class: "dshp-rt-ap-pts",
					style: {
						background: st.color + "22",
						color: st.color,
						borderColor: st.color + "66"
					}
				}, "+" + st.points) : null, h("span", { class: "dshp-rt-ap-cum" }, t("rt.c.cumulative", { n: st.cumulative }))), h("div", {
					class: "dshp-rt-ap-goal",
					style: { borderLeftColor: st.color }
				}, h("span", {
					class: "dshp-rt-ap-goal-tag",
					style: {
						color: st.color,
						borderColor: st.color + "66"
					}
				}, t("rt.c.stageGoal")), h("span", null, st.goal)), h("div", {
					class: "dshp-rt-ap-result",
					style: { borderLeftColor: st.color }
				}, body), i < stages.length - 1 ? h("div", { class: "dshp-rt-ap-trans" }, h("span", { class: "dshp-rt-sec-caret" }, "▼"), st.transition ? h("span", { class: "dshp-rt-ap-trans-t" }, st.transition) : null, h("span", {
					class: "dshp-rt-ap-trans-t",
					style: { marginLeft: "auto" }
				}, t("rt.c.cumulative", { n: st.cumulative }))) : h("div", { class: "dshp-rt-ap-trans" }, h("span", { class: "dshp-rt-sec-caret" }, "▼"), h("span", { class: "dshp-rt-ap-trans-t" }, t("rt.c.total", { n: summary !== null && summary.points || 0 }))));
			};
			const stageB = (st, i) => h("div", {
				key: "c" + st.code,
				class: "dshp-rt-ap-col"
			}, i > 0 ? h("span", { class: "dshp-rt-ap-col-arrow" }, "▶") : null, h("div", {
				class: "dshp-rt-hcol",
				style: { borderTopColor: st.color }
			}, h("div", {
				class: "dshp-rt-ap-head",
				style: {
					borderLeftColor: st.color,
					padding: "5px 8px"
				}
			}, h("span", {
				class: "dshp-rt-ap-no",
				style: {
					background: st.color,
					width: 16,
					height: 16,
					fontSize: 10
				}
			}, String(i + 1)), h("span", {
				class: "dshp-rt-ap-name",
				style: { fontSize: 12 }
			}, st.name), h("div", { class: "dshp-rt-spacer" }), h("span", {
				class: "dshp-rt-ap-cum",
				style: { fontWeight: 700 }
			}, st.cumulative)), h("div", {
				class: "dshp-rt-hcol-goal",
				title: st.goal
			}, st.goal), h("div", { class: "dshp-rt-hcol-body" }, st.code === "boundary" ? h("div", null, h("div", { class: "dshp-rt-hcol-hit" }, h("span", { class: "dshp-rt-hcol-pts" }, "+" + st.points), h("span", { class: "dshp-rt-hcol-name" }, t("rt.c.tunnelsN", { n: (st.tunnels ?? []).length }))), (st.tunnels ?? []).slice(0, 3).map((tr) => h("div", {
				key: "t" + tr.id,
				class: "dshp-rt-hcol-sub"
			}, "▸ " + (tr.kind || "") + " " + (tr.listen || "")))) : st.code === "recon" ? h("div", null, h("div", { class: "dshp-rt-hcol-hit" }, h("span", { class: "dshp-rt-hcol-pts" }, String(st.assetCount)), h("span", { class: "dshp-rt-hcol-name" }, t("rt.c.assetsScored"))), (st.assets ?? []).slice(0, 6).map((a) => h("div", {
				key: "a" + a.id,
				class: "dshp-rt-hcol-sub",
				title: a.ip + "  +" + a.points
			}, (a.scope === "internal" ? t("rt.scope.inShort") + " " : t("rt.scope.outShort") + " ") + a.ip + "  +" + a.points))) : h("div", null, h("div", { class: "dshp-rt-hcol-hit" }, h("span", { class: "dshp-rt-hcol-pts" }, "+" + st.points), h("span", { class: "dshp-rt-hcol-name" }, t("rt.c.hitsN", { n: st.hits }))), (st.items ?? []).slice(0, 6).map((x) => h("div", {
				key: "c" + x.id,
				class: "dshp-rt-hcol-sub",
				title: x.point_name + "  " + (x.target || "")
			}, h("span", { class: "dshp-rt-hcol-pts" }, "+" + x.points), h("span", { class: "dshp-rt-hcol-name" }, x.point_name))), (st.items ?? []).length > 6 ? h("div", { class: "dshp-rt-hcol-none" }, t("rt.c.moreN", { n: (st.items ?? []).length - 6 })) : null, st.assetCount ? h("div", { class: "dshp-rt-hcol-none" }, t("rt.c.involvedAssets", { n: st.assetCount })) : null))));
			return h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.tab.chain")), h("span", {
				class: "dshp-rt-tag",
				style: { fontSize: 10.5 }
			}, t("rt.c.flowHint")), summary !== null ? h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.c.totalScore", { n: summary.points })) : null, h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn" + (view === "A" ? " dshp-rt-btn-primary" : ""),
				type: "button",
				title: t("rt.c.viewATitle"),
				onClick: () => {
					setView("A");
				}
			}, t("rt.c.viewA")), h("button", {
				class: "dshp-rt-btn" + (view === "B" ? " dshp-rt-btn-primary" : ""),
				type: "button",
				title: t("rt.c.viewBTitle"),
				onClick: () => {
					setView("B");
				}
			}, t("rt.c.viewB")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: loading,
				onClick: load
			}, loading ? t("rt.loading") : t("rt.refresh"))), err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, stages.length === 0 && err === null && data !== null ? h("div", { class: "dshp-rt-empty" }, h("div", null, t("rt.c.empty")), h("div", { style: {
				marginTop: 6,
				fontSize: 12
			} }, t("rt.c.emptyHint"))) : view === "A" ? h("div", { class: "dshp-rt-ap" }, stages.map(stageA)) : h("div", { class: "dshp-rt-ap-h" }, stages.map(stageB)));
		}
		/** 报告页兜底分组用：host 只给平铺条目时按 scoreChain 的阶段信息分组。 */
		function groupByStage(reportItems, chain) {
			const byId = new Map((reportItems ?? []).map((x) => [x.id, x]));
			const groups = [];
			(chain !== null && chain.stages || []).forEach((st, si) => {
				const items = (st.items ?? []).map((x) => byId.get(x.id)).filter(Boolean);
				if (items.length === 0) return;
				groups.push({
					code: st.code,
					name: st.name,
					color: st.color || "#64748b",
					ordinal: st.ordinal || si + 1,
					points: st.points || 0,
					cumulative: st.cumulative || 0,
					items
				});
			});
			const grouped = new Set(groups.reduce((acc, g) => acc.concat(g.items.map((x) => x.id)), []));
			const rest = (reportItems ?? []).filter((x) => !grouped.has(x.id));
			if (rest.length > 0) groups.push({
				code: "other",
				name: "",
				color: "#64748b",
				ordinal: groups.length + 1,
				points: rest.reduce((n, x) => n + (x.counted === true ? x.points : 0), 0),
				cumulative: 0,
				items: rest
			});
			return groups;
		}
		// client/redteam/EnvTab.tsx
		/**
		* 环境适配页签：纯工具配置页（op: platformConfigGet / platformConfigSave /
		* platformAssignToolkit）。自旧 client.js EnvTab 迁移；授权门 / own-servers 面板
		* 等删除项不在此页复活。
		*/
		function EnvTab(props) {
			const t = props.t;
			const [data, setData] = (0, react.useState)(null);
			const [draft, setDraft] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [msg, setMsg] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [folderPath, setFolderPath] = (0, react.useState)("");
			const applyDraftFrom = (r) => {
				const c = r !== null && r.config || {};
				setDraft({
					platform: c.platform || "auto",
					toolkitDir: c.toolkitDir || "",
					nucleiTemplatesDir: c.nucleiTemplatesDir || "",
					binDirsText: (c.binDirs ?? []).join("\n"),
					tools: { ...c.tools ?? {} },
					env: {
						FOFA_KEY: "",
						REDTEAM_VPS_HOST: "",
						REDTEAM_VPS_KEY: "",
						...c.env ?? {}
					},
					notes: c.notes || ""
				});
				if (c.toolkitDir) setFolderPath(c.toolkitDir);
			};
			const load = () => {
				setBusy(true);
				setMsg(null);
				rtOp("platformConfigGet").then((r) => {
					setBusy(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setData(r.data);
					applyDraftFrom(r.data);
				});
			};
			(0, react.useEffect)(load, [props.refreshKey]);
			const save = () => {
				if (draft === null) return;
				setBusy(true);
				setMsg(null);
				rtOp("platformConfigSave", { config: {
					platform: draft.platform,
					toolkitDir: draft.toolkitDir,
					nucleiTemplatesDir: draft.nucleiTemplatesDir,
					binDirs: String(draft.binDirsText || "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean),
					tools: draft.tools,
					env: draft.env,
					notes: draft.notes
				} }).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setData(r.data);
					setMsg({ ok: t("rt.e.savedTo", { path: (r.data.config ?? {}).path ?? "$DSH_HOME/redteam/config.json" }) });
					applyDraftFrom(r.data);
				});
			};
			const assignFolder = () => {
				const dir = String(folderPath || (draft !== null ? draft.toolkitDir : "") || "").trim();
				if (dir === "") {
					setMsg({ err: t("rt.e.folderRequired") });
					return;
				}
				setBusy(true);
				setMsg(null);
				rtOp("platformAssignToolkit", { dir }).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setData(r.data);
					applyDraftFrom(r.data);
					setMsg({ ok: t("rt.e.assigned", {
						n: r.data.assignedCount ?? 0,
						tpl: r.data.nucleiTemplatesDir ? t("rt.e.assignedTpl") : ""
					}) });
				});
			};
			const setTool = (id, value) => {
				setDraft((d) => d === null ? d : {
					...d,
					tools: {
						...d.tools,
						[id]: value
					}
				});
			};
			const setEnv = (key, value) => {
				setDraft((d) => d === null ? d : {
					...d,
					env: {
						...d.env,
						[key]: value
					}
				});
			};
			const runtime = data !== null && data.runtime || {};
			const adapt = data !== null && data.adapt || {};
			const tools = data !== null && data.tools !== void 0 && data.tools.items || [];
			const found = tools.filter((x) => x.path).length;
			const defaultToolkit = data !== null && data.toolkitDir || "$DSH_HOME/redteam/toolkit";
			const defaultNuclei = data !== null && data.nucleiTemplatesDir || defaultToolkit + "/nuclei-templates";
			return h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.tab.env")), h("span", { class: "dshp-rt-tag" }, runtime.effective === "windows" ? "Windows" : "Linux/Kali"), adapt.kali ? h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, "Kali") : null, h("span", { class: "dshp-rt-tag" + (adapt.ready ? " dshp-rt-tag-live" : " dshp-rt-tag-warn") }, adapt.ready ? t("rt.e.ready", { reason: adapt.reason || "" }) : t("rt.e.pending")), h("span", { class: "dshp-rt-tag" + (found > 0 ? " dshp-rt-tag-live" : " dshp-rt-tag-warn") }, t("rt.e.toolsN", {
				found,
				total: tools.length
			})), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: load
			}, busy ? t("rt.loading") : t("rt.refresh")), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: busy || draft === null,
				onClick: save
			}, t("rt.save"))), h("div", {
				class: "dshp-rt-pane",
				style: { minHeight: 0 }
			}, err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, msg !== null ? h("div", { class: msg.err !== void 0 ? "dshp-rt-err" : "dshp-rt-foot" }, msg.err || msg.ok) : null, h("div", {
				class: "dshp-rt-card",
				style: {
					margin: "0 0 8px",
					fontSize: 12,
					lineHeight: 1.6
				}
			}, data !== null && data.adapt !== void 0 && data.adapt.message || t("rt.e.hintDefault")), h("div", {
				class: "dshp-rt-card",
				style: {
					margin: "0 0 8px",
					fontSize: 12,
					lineHeight: 1.6
				}
			}, h("div", { style: {
				fontWeight: 600,
				marginBottom: 6
			} }, t("rt.e.folderAssignTitle")), h("div", { style: {
				marginBottom: 8,
				opacity: .9
			} }, t("rt.e.folderAssignHint")), h("div", { style: {
				display: "flex",
				gap: 8,
				alignItems: "center"
			} }, h("input", {
				class: "dshp-rt-input",
				style: { flex: 1 },
				placeholder: t("rt.e.folderPh"),
				value: folderPath,
				onChange: (e) => {
					setFolderPath(e.target.value);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") assignFolder();
				}
			}), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: busy,
				onClick: assignFolder
			}, busy ? t("rt.e.scanning") : t("rt.e.assign")))), data !== null && data.hint !== void 0 ? h("div", {
				class: "dshp-rt-card",
				style: {
					margin: "0 0 8px",
					fontSize: 12,
					lineHeight: 1.6
				}
			}, data.hint) : null, data !== null && data.egress !== void 0 ? h("div", {
				class: "dshp-rt-card",
				style: {
					margin: "0 0 8px",
					fontSize: 12,
					lineHeight: 1.55
				}
			}, h("div", { style: {
				fontWeight: 600,
				marginBottom: 6
			} }, t("rt.e.egressTitle")), h("div", {
				class: "dshp-rt-mono",
				style: { fontSize: 11 }
			}, "HTTP_PROXY=" + (data.egress.http_proxy || t("rt.e.emptyParen"))), h("div", {
				class: "dshp-rt-mono",
				style: { fontSize: 11 }
			}, "HTTPS_PROXY=" + (data.egress.https_proxy || t("rt.e.emptyParen"))), h("div", {
				class: "dshp-rt-mono",
				style: { fontSize: 11 }
			}, "ALL_PROXY=" + (data.egress.all_proxy || t("rt.e.emptyParen"))), h("div", {
				class: "dshp-rt-mono",
				style: { fontSize: 11 }
			}, "NO_PROXY=" + (data.egress.no_proxy || t("rt.e.emptyParen"))), h("div", { style: {
				marginTop: 6,
				opacity: .85
			} }, data.egress.note || "")) : null, draft === null ? h("div", { class: "dshp-rt-empty" }, t("rt.loading")) : h("div", null, h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.e.platformDirTitle")), h("div", { style: {
				display: "grid",
				gap: 8
			} }, h("label", { style: { fontSize: 12 } }, t("rt.e.platformMode"), h("select", {
				class: "dshp-rt-input",
				style: {
					display: "block",
					width: "100%",
					marginTop: 4
				},
				value: draft.platform,
				onChange: (e) => {
					setDraft({
						...draft,
						platform: e.target.value
					});
				}
			}, h("option", { value: "auto" }, t("rt.e.platformAuto")), h("option", { value: "windows" }, "windows"), h("option", { value: "linux" }, "linux"))), h("label", { style: { fontSize: 12 } }, t("rt.e.toolkitDirLabel"), h("input", {
				class: "dshp-rt-input",
				style: {
					display: "block",
					width: "100%",
					marginTop: 4
				},
				placeholder: t("rt.e.defaultIs", { path: defaultToolkit }),
				value: draft.toolkitDir,
				onChange: (e) => {
					setDraft({
						...draft,
						toolkitDir: e.target.value
					});
				}
			})), h("label", { style: { fontSize: 12 } }, t("rt.e.nucleiDirLabel"), h("input", {
				class: "dshp-rt-input",
				style: {
					display: "block",
					width: "100%",
					marginTop: 4
				},
				placeholder: t("rt.e.defaultIs", { path: defaultNuclei }),
				value: draft.nucleiTemplatesDir,
				onChange: (e) => {
					setDraft({
						...draft,
						nucleiTemplatesDir: e.target.value
					});
				}
			})), h("label", { style: { fontSize: 12 } }, t("rt.e.binDirsLabel"), h("textarea", {
				class: "dshp-rt-input",
				rows: 4,
				style: {
					display: "block",
					width: "100%",
					marginTop: 4,
					fontFamily: "var(--dsw-font-mono, monospace)"
				},
				placeholder: t("rt.e.binDirsPh"),
				value: draft.binDirsText,
				onChange: (e) => {
					setDraft({
						...draft,
						binDirsText: e.target.value
					});
				}
			})))), h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.e.envTitle")), h("div", { style: {
				display: "grid",
				gap: 8
			} }, [
				"FOFA_KEY",
				"REDTEAM_VPS_HOST",
				"REDTEAM_VPS_KEY"
			].map((k) => h("label", {
				key: k,
				style: { fontSize: 12 }
			}, k + t("rt.e.optional"), h("input", {
				class: "dshp-rt-input",
				style: {
					display: "block",
					width: "100%",
					marginTop: 4
				},
				type: k === "FOFA_KEY" ? "password" : "text",
				placeholder: k === "REDTEAM_VPS_KEY" ? t("rt.e.vpsKeyPh") : k === "REDTEAM_VPS_HOST" ? t("rt.e.vpsHostPh") : t("rt.e.fofaPh"),
				value: (draft.env ?? {})[k] ?? "",
				onChange: (e) => {
					setEnv(k, e.target.value);
				}
			}))))), h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.e.toolsTitle")), h("div", { style: {
				fontSize: 11.5,
				color: "var(--dsw-alias-label-secondary)",
				marginBottom: 8
			} }, t("rt.e.toolsResolveOrder")), tools.map((tool) => h("div", {
				key: tool.id,
				style: { marginBottom: 8 }
			}, h("div", { style: {
				display: "flex",
				gap: 8,
				alignItems: "center",
				marginBottom: 4
			} }, h("span", { style: {
				fontWeight: 600,
				minWidth: 88
			} }, tool.label || tool.id), tool.path ? h("span", {
				class: "dshp-rt-tag dshp-rt-tag-live",
				title: tool.path
			}, tool.source + " · " + t("rt.e.found")) : h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.e.notFound"))), h("input", {
				class: "dshp-rt-input",
				style: { width: "100%" },
				placeholder: t("rt.e.autoFindPh", { names: (tool.names ?? []).slice(0, 3).join(" / ") }),
				value: (draft.tools ?? {})[tool.id] ?? "",
				onChange: (e) => {
					setTool(tool.id, e.target.value);
				}
			}), tool.path ? h("div", {
				class: "dshp-rt-mono",
				style: {
					fontSize: 10.5,
					marginTop: 2,
					opacity: .8
				}
			}, tool.path) : null))), h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.e.notesTitle")), h("textarea", {
				class: "dshp-rt-input",
				rows: 3,
				style: { width: "100%" },
				placeholder: t("rt.e.notesPh"),
				value: draft.notes,
				onChange: (e) => {
					setDraft({
						...draft,
						notes: e.target.value
					});
				}
			})), h("div", { class: "dshp-rt-foot" }, h("span", null, t("rt.e.configFile", { path: data !== null && data.config !== void 0 && data.config.path || "$DSH_HOME/redteam/config.json" }))))));
		}
		// client/redteam/FindingsTab.tsx
		/**
		* 漏洞战果页签：子页签（漏洞 / 攻击文件 / 凭据 / 访问会话）。
		* 自旧 client.js FindingsTab / AttackFilesTab / detailEvidence 迁移；
		* 新增深链：漏洞详情 → jump('assets', { ip })。
		* 凭据面板保留「明文直显」行为（secret_value 直接展示 + 复制）。
		*/
		/** 目标归并：按「scheme://host:port」聚合，避免带路径的 URL 把分组打散。 */
		function targetKeyOf(v) {
			const t = String(v.target || "").trim();
			if (t !== "") {
				const url = /^([a-z][a-z0-9+.-]*:\/\/[^/?#\s]+)/i.exec(t);
				if (url !== null) return url[1];
				const head = /^([^\s/?#]+)/.exec(t);
				if (head !== null) return head[1];
				return t;
			}
			return v.asset_ip || "(no target)";
		}
		function FindingsTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [sev, setSev] = (0, react.useState)("");
			const [status, setStatus] = (0, react.useState)("");
			const [q, setQ] = (0, react.useState)("");
			const [qApplied, setQApplied] = (0, react.useState)("");
			const [state, setState] = (0, react.useState)({
				loading: false,
				error: null,
				total: 0,
				items: [],
				stats: null
			});
			const [creds, setCreds] = (0, react.useState)([]);
			const [accesses, setAccesses] = (0, react.useState)([]);
			const [files, setFiles] = (0, react.useState)([]);
			const [openId, setOpenId] = (0, react.useState)(null);
			const [msg, setMsg] = (0, react.useState)(null);
			const [subTab, setSubTab] = (0, react.useState)("vulns");
			const [grouped, setGrouped] = (0, react.useState)(true);
			const collapse = useCollapse("findings:" + String(eng));
			const load = () => {
				if (eng === null || eng === "") return;
				rtOp("vulns", {
					engagement: eng,
					severity: sev || void 0,
					status: status || void 0,
					q: qApplied || void 0,
					limit: 200
				}).then((r) => {
					if (!r.ok) {
						setState({
							loading: false,
							error: r.error,
							total: 0,
							items: [],
							stats: null
						});
						return;
					}
					setState({
						loading: false,
						error: null,
						total: r.data.total ?? 0,
						items: r.data.items ?? [],
						stats: r.data.stats ?? null
					});
				});
				rtOp("credentials", { engagement: eng }).then((r) => {
					setCreds(r.ok ? r.data.items ?? [] : []);
				});
				rtOp("access", { engagement: eng }).then((r) => {
					setAccesses(r.ok ? r.data.items ?? [] : []);
				});
				rtOp("attackFiles", { engagement: eng }).then((r) => {
					setFiles(r.ok ? r.data.items ?? [] : []);
				});
			};
			(0, react.useEffect)(load, [
				eng,
				sev,
				status,
				qApplied,
				props.refreshKey
			]);
			const setVulnStatus = (id, next) => {
				setMsg(null);
				rtOp("updateVuln", {
					engagement: eng,
					id,
					patch: { status: next }
				}).then((r) => {
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setMsg({ ok: t("rt.f.updatedTo", { status: vulnStatusLabel(t, next) }) });
					load();
				});
			};
			const stats = state.stats !== null && state.stats.bySeverity !== void 0 ? state.stats : {
				bySeverity: {},
				byStatus: {}
			};
			const needRestart = state.error !== null && state.error.includes("unknown op");
			const allFiles = files.flatMap((g) => (g.files ?? []).map((f) => ({
				...f,
				target: g.target
			})));
			const filesByVuln = /* @__PURE__ */ new Map();
			const orphanFiles = [];
			for (const f of allFiles) {
				const vid = f.vuln_id === null || f.vuln_id === void 0 ? null : Number(f.vuln_id);
				if (vid === null) {
					orphanFiles.push(f);
					continue;
				}
				if (!filesByVuln.has(vid)) filesByVuln.set(vid, []);
				filesByVuln.get(vid).push(f);
			}
			const concl = (key, label, value, active, onClick) => h("span", {
				...clickable(onClick, {
					label: t("rt.a.filterBy", {
						label,
						n: value || 0
					}),
					expanded: active
				}),
				key,
				class: "dshp-rt-concl-i" + (active ? " on" : ""),
				title: t("rt.a.filterHint")
			}, h("b", null, String(value || 0)), h("span", null, label));
			const conclusion = h("div", { class: "dshp-rt-concl" }, concl("conf", t("rt.vulnstatus.confirmed"), (stats.byStatus ?? {}).confirmed ?? 0, status === "confirmed", () => {
				setStatus((v) => v === "confirmed" ? "" : "confirmed");
			}), concl("exp", t("rt.vulnstatus.exploited"), (stats.byStatus ?? {}).exploited ?? 0, status === "exploited", () => {
				setStatus((v) => v === "exploited" ? "" : "exploited");
			}), concl("crit", t("rt.sev.critical"), (stats.bySeverity ?? {}).critical ?? 0, sev === "critical", () => {
				setSev((v) => v === "critical" ? "" : "critical");
			}), concl("high", t("rt.sev.high"), (stats.bySeverity ?? {}).high ?? 0, sev === "high", () => {
				setSev((v) => v === "high" ? "" : "high");
			}), concl("med", t("rt.sev.medium"), (stats.bySeverity ?? {}).medium ?? 0, sev === "medium", () => {
				setSev((v) => v === "medium" ? "" : "medium");
			}), concl("gain", t("rt.f.gainedPerm"), stats.withGained ?? 0, false, () => {}), h("div", { class: "dshp-rt-spacer" }), h("span", { style: {
				fontSize: 11,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.f.groupedHint", { n: stats.targetGroups ?? 0 })));
			const head = h("div", { class: "dshp-rt-vrow head" }, h("span", null, t("rt.f.hSev")), h("span", null, t("rt.f.hVuln")), h("span", null, t("rt.f.hTarget")), h("span", null, t("rt.f.hGained")), h("span", null, t("rt.f.hStatus")), h("span", null, t("rt.f.hConf")));
			const vulnRows = (v, compact) => {
				const out = [];
				const gainedList = String(v.gained || "").split(/[、,;，；]/).map((x) => x.trim()).filter(Boolean);
				const open = openId === v.id;
				out.push(h("div", {
					key: "v" + v.id,
					class: "dshp-rt-vrow",
					role: "button",
					tabIndex: 0,
					style: compact === true ? {
						cursor: "pointer",
						gridTemplateColumns: "58px minmax(0,1fr) 104px 68px"
					} : { cursor: "pointer" },
					onClick: () => {
						setOpenId(open ? null : v.id);
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setOpenId(open ? null : v.id);
						}
					}
				}, h("span", null, h(SevTag, {
					t,
					s: v.severity
				})), h("span", { title: v.title || "" }, h("span", { class: "dshp-rt-sec-caret" }, open ? "▾" : "▸"), (v.cve ? v.cve + " " : "") + (v.title || "")), compact ? null : h("span", {
					class: "dshp-rt-mono",
					title: v.target || ""
				}, v.target || v.asset_ip || "—"), h("span", { title: v.gained || "" }, gainedList.length > 0 ? h("span", {
					class: "dshp-rt-gain",
					style: {
						maxWidth: "100%",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						display: "inline-block"
					}
				}, gainedList[0] + (gainedList.length > 1 ? " +" + (gainedList.length - 1) : "")) : h("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, "—")), h("span", null, h("span", { class: "dshp-rt-tag" }, vulnStatusLabel(t, v.status))), compact ? null : h("span", null, v.confidence === null || v.confidence === void 0 ? "—" : Math.round(v.confidence * 100) + "%")));
				if (openId !== v.id) return out;
				out.push(h("div", {
					key: "vd" + v.id,
					class: "dshp-rt-vrow",
					style: {
						cursor: "default",
						gridTemplateColumns: "1fr"
					}
				}, h("div", { class: "dshp-rt-vdetail" }, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.hGained")), gainedList.length > 0 ? h("span", null, gainedList.map((g, gi) => h("span", {
					key: "g" + gi,
					class: "dshp-rt-gain",
					style: { marginRight: 6 }
				}, g))) : h("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, t("rt.f.gainedMissing"))), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.hTarget")), h("span", {
					class: "dshp-rt-mono",
					style: { wordBreak: "break-all" }
				}, v.target || "—")), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.asset")), h("span", null, (v.asset_ip || "—") + " · " + (v.segment_cidr || "")), v.asset_ip ? h("button", {
					class: "dshp-rt-btn",
					type: "button",
					style: {
						marginLeft: 8,
						padding: "0 6px",
						fontSize: 11
					},
					title: t("rt.f.jumpAssetTitle", { ip: v.asset_ip }),
					onClick: (e) => {
						e.stopPropagation();
						props.jump("assets", { ip: v.asset_ip });
					}
				}, t("rt.f.jumpAsset")) : null), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.source")), h("span", null, (v.source || "—") + " · " + (v.found_by_agent || "—") + " · " + fmt(v.found_at))), detailEvidence(t, v), (() => {
					const mine = filesByVuln.get(Number(v.id)) ?? [];
					return h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.attackFiles")), mine.length > 0 ? h("span", null, mine.map((f, fi) => h("div", {
						key: "af" + fi,
						style: { marginBottom: 3 }
					}, "· " + (f.kind ? "[" + f.kind + "] " : "") + (f.name || "(?)") + (f.description ? " — " + f.description : ""), h("div", {
						class: "dshp-rt-mono",
						style: {
							fontSize: 11,
							marginLeft: 12,
							color: "var(--dsw-alias-label-secondary)",
							overflowWrap: "anywhere"
						}
					}, f.path || "")))) : h("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, t("rt.f.noAttackFiles")));
				})(), h("div", { class: "dshp-rt-actions" }, h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						setVulnStatus(v.id, "confirmed");
					}
				}, t("rt.vulnstatus.confirmed")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						setVulnStatus(v.id, "exploited");
					}
				}, t("rt.vulnstatus.exploited")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						setVulnStatus(v.id, "false-positive");
					}
				}, t("rt.vulnstatus.false-positive")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						setVulnStatus(v.id, "fixed");
					}
				}, t("rt.vulnstatus.fixed"))))));
				return out;
			};
			const rows = [];
			if (grouped) {
				const groups = /* @__PURE__ */ new Map();
				for (const v of state.items) {
					const key = targetKeyOf(v);
					if (!groups.has(key)) groups.set(key, []);
					groups.get(key).push(v);
				}
				const SEV_RANK = {
					critical: 0,
					high: 1,
					medium: 2,
					low: 3,
					info: 4
				};
				const list = [...groups.entries()].map(([key, vs]) => ({
					key,
					vulns: vs,
					top: [...vs].sort((a, b) => (SEV_RANK[a.severity] ?? 9) - (SEV_RANK[b.severity] ?? 9))[0],
					gained: [...new Set(vs.flatMap((v) => String(v.gained || "").split(/[、,;，；]/).map((x) => x.trim()).filter(Boolean)))],
					exploited: vs.filter((v) => v.status === "exploited").length
				})).sort((a, b) => (SEV_RANK[a.top.severity] ?? 9) - (SEV_RANK[b.top.severity] ?? 9) || b.vulns.length - a.vulns.length);
				for (const g of list) {
					const key = "target:" + g.key;
					rows.push(h(Section, {
						key: "sec:" + g.key,
						tone: "target",
						title: g.key,
						count: t("rt.f.nVulns", { n: g.vulns.length }),
						sub: [
							t("rt.sev." + ([
								"critical",
								"high",
								"medium",
								"low",
								"info"
							].includes(g.top.severity) ? g.top.severity : "info")),
							g.exploited > 0 ? t("rt.f.exploitedN", { n: g.exploited }) : null,
							g.top.asset_ip !== void 0 && g.top.asset_ip !== null && g.top.asset_ip !== g.key ? t("rt.f.assetIs", { ip: g.top.asset_ip }) : null
						].filter(Boolean).join(" · "),
						right: h("span", null, g.gained.length > 0 ? g.gained.slice(0, 2).join(" / ") + (g.gained.length > 2 ? " +" + (g.gained.length - 2) : "") : t("rt.f.gainedNone")),
						open: collapse.isOpen(key, false),
						onToggle: collapse.toggle(key, false)
					}, g.vulns.map((v) => vulnRows(v, true))));
				}
				if (list.length === 0 && !state.loading && state.error === null) rows.push(h("div", {
					key: "none",
					class: "dshp-rt-empty"
				}, t("rt.f.emptyVulns")));
			} else for (const v of state.items) rows.push(...vulnRows(v, false));
			const toolbar = h("div", { class: "dshp-rt-toolbar" }, h("input", {
				class: "dshp-rt-input",
				style: { flex: "1 1 140px" },
				placeholder: t("rt.f.searchPh"),
				value: q,
				onChange: (e) => {
					setQ(e.target.value);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") setQApplied(q);
				}
			}), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					setQApplied(q);
				}
			}, t("rt.a.search")), h("select", {
				class: "dshp-rt-input",
				value: sev,
				onChange: (e) => {
					setSev(e.target.value);
				}
			}, h("option", { value: "" }, t("rt.f.sevAny")), h("option", { value: "critical" }, t("rt.sev.critical")), h("option", { value: "high" }, t("rt.sev.high")), h("option", { value: "medium" }, t("rt.sev.medium")), h("option", { value: "low" }, t("rt.sev.low")), h("option", { value: "info" }, t("rt.sev.info"))), h("select", {
				class: "dshp-rt-input",
				value: status,
				onChange: (e) => {
					setStatus(e.target.value);
				}
			}, h("option", { value: "" }, t("rt.f.statusAny")), h("option", { value: "candidate" }, t("rt.vulnstatus.candidate")), h("option", { value: "confirmed" }, t("rt.vulnstatus.confirmed")), h("option", { value: "exploited" }, t("rt.vulnstatus.exploited")), h("option", { value: "false-positive" }, t("rt.vulnstatus.false-positive")), h("option", { value: "fixed" }, t("rt.vulnstatus.fixed"))));
			const credSection = h("div", null, h("div", { class: "dshp-rt-section" }, t("rt.f.credsOf", { n: creds.length }) + (creds.length > 0 ? t("rt.f.credsPlaintextNote") : "")), creds.length > 0 ? h("div", { style: { padding: "4px 10px 0" } }, creds.map((c) => h("div", {
				key: "c" + c.id,
				class: "dshp-rt-cred"
			}, h("div", { class: "dshp-rt-cred-head" }, h("span", { class: "dshp-rt-cred-host" }, c.host), c.username ? h("span", { class: "dshp-rt-tag" }, c.username) : null, h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, c.secret_type || "password"), c.privilege ? h("span", { class: "dshp-rt-tag dshp-rt-tag-active" }, c.privilege) : null, h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				onClick: (e) => {
					e.stopPropagation();
					copyText(String(c.secret_value || ""));
				}
			}, t("rt.copy"))), c.secret_value ? h("div", {
				class: "dshp-rt-secret",
				title: t("rt.f.secretSelectAll")
			}, c.secret_value) : h("div", { class: "dshp-rt-secret-none" }, t("rt.f.secretMissing")), h("div", { class: "dshp-rt-cred-meta" }, [
				c.source ? t("rt.f.cSource", { v: c.source }) : null,
				c.tool ? t("rt.f.cTool", { v: c.tool }) : null,
				c.secret_ref ? t("rt.f.cEvidence", { v: c.secret_ref }) : null,
				c.found_by_agent ? "by " + c.found_by_agent : null,
				c.found_at ? fmt(c.found_at) : null
			].filter(Boolean).join(" · ")), c.note ? h("div", { class: "dshp-rt-cred-meta" }, t("rt.f.cNote", { v: c.note })) : null))) : h("div", { class: "dshp-rt-empty" }, t("rt.f.credsEmpty")));
			const accessSection = h("div", null, h("div", { class: "dshp-rt-section" }, t("rt.f.accessOf", { n: accesses.length })), accesses.length > 0 ? accesses.map((a) => h("div", {
				key: "a" + a.id,
				class: "dshp-rt-vrow",
				style: {
					cursor: "default",
					gridTemplateColumns: "1fr 110px 80px 80px 1fr"
				}
			}, h("span", { class: "dshp-rt-mono" }, a.host), h("span", null, a.username || "—"), h("span", null, h("span", { class: "dshp-rt-tag dshp-rt-tag-active" }, a.method || "—")), h("span", null, a.privilege || "—"), h("span", {
				class: "dshp-rt-mono",
				title: a.session_ref || ""
			}, a.session_ref || "—"))) : h("div", { class: "dshp-rt-empty" }, t("rt.f.accessEmpty")));
			const subTabBtn = (key, label, n) => h("span", {
				...clickable(() => {
					setSubTab(key);
				}, {
					label: label + "（" + n + "）",
					expanded: subTab === key
				}),
				class: "dshp-rt-subtab" + (subTab === key ? " on" : "")
			}, label + " " + n);
			return h("div", { class: "dshp-rt-main" }, toolbar, conclusion, h("div", { class: "dshp-rt-subtabs" }, subTabBtn("vulns", t("rt.f.subVulns"), state.total || 0), subTabBtn("files", t("rt.f.subFiles"), allFiles.length), subTabBtn("creds", t("rt.f.subCreds"), creds.length), subTabBtn("access", t("rt.f.subAccess"), accesses.length), h("div", { class: "dshp-rt-spacer" }), grouped ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("rt.f.expandAllTitle"),
				onClick: () => {
					collapse.setAll(state.items.map((v) => "target:" + targetKeyOf(v)), true);
				}
			}, t("rt.f.expandAll")) : null, grouped ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("rt.f.collapseAllTitle"),
				onClick: () => {
					collapse.setAll(state.items.map((v) => "target:" + targetKeyOf(v)), false);
				}
			}, t("rt.f.collapseAll")) : null, h("button", {
				class: "dshp-rt-btn" + (grouped ? " dshp-rt-btn-primary" : ""),
				type: "button",
				title: grouped ? t("rt.f.groupedTitle") : t("rt.f.flatTitle"),
				onClick: () => {
					setGrouped((g) => !g);
				}
			}, grouped ? t("rt.f.grouped") : t("rt.f.flat"))), msg !== null ? h("div", { class: msg.err !== void 0 ? "dshp-rt-err" : "dshp-rt-foot" }, msg.err || msg.ok) : null, needRestart ? h("div", { class: "dshp-rt-empty" }, t("rt.needRestart")) : null, state.error !== null && !needRestart ? h("div", { class: "dshp-rt-err" }, state.error) : null, subTab === "files" ? h("div", {
				class: "dshp-rt-body",
				style: { overflow: "auto" }
			}, h("div", {
				class: "dshp-rt-hint",
				style: { marginBottom: 8 }
			}, t("rt.f.filesHint") + (orphanFiles.length > 0 ? t("rt.f.filesOrphan", { n: orphanFiles.length }) : "")), h(AttackFilesTab, {
				t,
				eng,
				refreshKey: props.refreshKey
			})) : subTab === "creds" ? h("div", {
				class: "dshp-rt-body",
				style: { overflow: "auto" }
			}, credSection) : subTab === "access" ? h("div", {
				class: "dshp-rt-body",
				style: { overflow: "auto" }
			}, accessSection) : h("div", { class: "dshp-rt-table" }, grouped ? null : head, rows, !state.loading && state.items.length === 0 && state.error === null ? h("div", { class: "dshp-rt-empty" }, t("rt.f.emptyVulns")) : null));
		}
		/** 漏洞详情的证据区：结构化证据文本 + 原始 HTTP 请求/响应记录。 */
		function detailEvidence(t, v) {
			const evi = String(v.evidence || "").trim();
			const looksHttp = /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|HTTP\/)/m.test(evi) || /\n[A-Za-z-]+: /.test(evi);
			const blocks = [];
			if (evi !== "") blocks.push(h("div", {
				key: "ev",
				class: "dshp-rt-evi"
			}, h("div", { class: "dshp-rt-evi-head" }, t("rt.f.evidenceSummary"), h("span", { class: "dshp-rt-tag" }, looksHttp ? t("rt.f.rawHttp") : t("rt.f.plainText")), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				onClick: (e) => {
					e.stopPropagation();
					copyText(evi);
				}
			}, t("rt.copy"))), looksHttp ? h(HttpBlock, { text: evi }) : h("pre", { class: "dshp-rt-evi-body" }, evi)));
			for (const e of v.http_evidence ?? []) blocks.push(h("div", {
				key: "h" + e.id,
				class: "dshp-rt-evi"
			}, h("div", { class: "dshp-rt-evi-head" }, e.label || t("rt.f.httpEvidence"), h("span", { class: "dshp-rt-tag" }, (e.method || "") + " " + (e.status === null || e.status === void 0 ? "" : e.status)), h("div", { class: "dshp-rt-spacer" }), h("span", { style: {
				fontWeight: 400,
				color: "var(--dsw-alias-label-secondary)"
			} }, fmt(e.captured_at || e.created_at))), e.request ? h("div", null, h("div", {
				class: "dshp-rt-evi-head",
				style: { borderTop: "none" }
			}, "▸ " + t("rt.f.requestBurp")), h(HttpBlock, {
				text: e.request,
				compact: true
			})) : null, e.response ? h("div", null, h("div", { class: "dshp-rt-evi-head" }, "▸ " + t("rt.f.response")), h(HttpBlock, { text: e.response })) : null, e.note ? h("pre", {
				class: "dshp-rt-evi-body",
				style: { maxHeight: 80 }
			}, e.note) : null));
			if (blocks.length === 0) blocks.push(h("div", {
				key: "none",
				class: "dshp-rt-kv"
			}, h("b", null, t("rt.f.evidenceSummary")), h("span", { style: { color: "var(--dsw-alias-state-error-primary)" } }, t("rt.f.evidenceMissing"))));
			return h("div", { key: "eviwrap" }, blocks);
		}
		function AttackFilesTab(props) {
			const t = props.t;
			const [folders, setFolders] = (0, react.useState)([]);
			const [err, setErr] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const collapse = useCollapse("files:" + String(props.eng));
			const [detail, setDetail] = (0, react.useState)(null);
			const load = () => {
				if (props.eng === null || props.eng === "") return;
				setBusy(true);
				rtOp("attackFiles", { engagement: props.eng }).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setFolders(r.data.items ?? []);
				});
			};
			(0, react.useEffect)(load, [props.eng, props.refreshKey]);
			const openFile = (f) => {
				if (detail !== null && detail.id === f.id) {
					setDetail(null);
					return;
				}
				setDetail(null);
				rtOp("readAttackFile", {
					engagement: props.eng,
					id: f.id
				}).then((r) => {
					if (r.ok) setDetail(r.data);
					else setErr(r.error);
				});
			};
			const rows = [];
			for (const folder of folders) {
				const fKey = "folder:" + folder.folder;
				const fileNodes = [];
				for (const f of folder.files ?? []) {
					fileNodes.push(h("div", {
						key: "a" + f.id,
						class: "dshp-rt-vrow",
						style: {
							gridTemplateColumns: "18px 1.2fr 60px 1.6fr",
							cursor: "pointer"
						},
						role: "button",
						tabIndex: 0,
						onClick: () => {
							openFile(f);
						},
						onKeyDown: (e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								openFile(f);
							}
						}
					}, h("span", { class: "dshp-rt-sec-caret" }, detail !== null && detail.id === f.id ? "▾" : "▸"), h("span", { class: "dshp-rt-mono" }, f.name), h("span", null, h("span", { class: "dshp-rt-tag dshp-rt-tag-active" }, fileKindLabel(t, f.kind))), h("span", {
						style: {
							fontSize: 11.5,
							color: "var(--dsw-alias-label-secondary)"
						},
						title: f.description || ""
					}, f.description || "—")));
					if (detail === null || detail.id !== f.id) continue;
					fileNodes.push(h("div", {
						key: "ad" + f.id,
						class: "dshp-rt-vrow",
						style: {
							cursor: "default",
							gridTemplateColumns: "1fr"
						}
					}, h("div", { class: "dshp-rt-vdetail" }, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.fileEffect")), h("span", null, detail.evidence || "—")), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.filePath")), h("span", {
						class: "dshp-rt-mono",
						style: { wordBreak: "break-all" }
					}, detail.path)), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.f.fileRecord")), h("span", null, fmt(detail.created_at) + (detail.created_by ? " · " + detail.created_by : ""))), h("pre", {
						class: "dshp-rt-md",
						style: {
							border: "1px solid var(--dsw-alias-border-l1)",
							borderRadius: 6,
							maxHeight: "40vh",
							padding: "10px 12px"
						}
					}, detail.content || t("rt.empty")))));
				}
				rows.push(h(Section, {
					key: "sec:" + folder.folder,
					tone: "folder",
					title: folder.folder + "/",
					count: t("rt.f.nFiles", { n: folder.count }),
					open: collapse.isOpen(fKey, true),
					onToggle: collapse.toggle(fKey, true)
				}, fileNodes.length > 0 ? fileNodes : h("div", { class: "dshp-rt-atest-meta" }, t("rt.empty"))));
			}
			const total = folders.reduce((n, f) => n + (f.count ?? 0), 0);
			return h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.f.subFiles")), h("span", { class: "dshp-rt-tag" }, t("rt.f.filesStat", {
				n: folders.length,
				m: total
			})), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: load
			}, busy ? t("rt.refreshing") : t("rt.refresh"))), err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, h("div", { class: "dshp-rt-table" }, rows, folders.length === 0 ? h("div", { class: "dshp-rt-empty" }, t("rt.f.filesEmpty")) : null), h("div", { class: "dshp-rt-foot" }, h("span", null, t("rt.f.filesFoot"))));
		}
		// client/redteam/KnowledgeTab.tsx
		/**
		* 知识库页签（POC/EXP，全局共享不随靶标）：检索、归类分组、详情、复用标记、
		* 本机 nuclei 模板分页。自旧 client.js KnowledgeTab 迁移。
		*/
		const TPL_PAGE_SIZE = 40;
		function KnowledgeTab(props) {
			const t = props.t;
			const [data, setData] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [msg, setMsg] = (0, react.useState)(null);
			const [q, setQ] = (0, react.useState)("");
			const [kind, setKind] = (0, react.useState)("");
			const [category, setCategory] = (0, react.useState)("");
			const [engagement, setEngagement] = (0, react.useState)("");
			const [assetTarget, setAssetTarget] = (0, react.useState)("");
			const [grouped, setGrouped] = (0, react.useState)(true);
			const [verifiedOnly, setVerifiedOnly] = (0, react.useState)(false);
			const [openId, setOpenId] = (0, react.useState)(null);
			const [detail, setDetail] = (0, react.useState)(null);
			const [detailBusy, setDetailBusy] = (0, react.useState)(false);
			const [tplOffset, setTplOffset] = (0, react.useState)(0);
			/** 知识库范围：project（随项目走）| global（跨项目）| all（合并） */
			const [scope, setScope] = (0, react.useState)("all");
			const query = (over = {}) => {
				const offset = Object.prototype.hasOwnProperty.call(over, "templateOffset") ? over.templateOffset : 0;
				setTplOffset(offset);
				const params = {
					scope,
					engagement: props.eng || void 0,
					q: q.trim() || void 0,
					kind: kind || void 0,
					category: category || void 0,
					engagement: engagement || void 0,
					asset_target: assetTarget.trim() || void 0,
					verified: verifiedOnly || void 0,
					templateOffset: offset || 0,
					templateLimit: TPL_PAGE_SIZE,
					...over
				};
				setBusy(true);
				setMsg(null);
				rtOp("pocSearch", params).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setData(r.data);
				});
			};
			(0, react.useEffect)(() => {
				query({
					q: void 0,
					kind: void 0,
					category: void 0,
					engagement: void 0,
					asset_target: void 0,
					verified: void 0
				});
			}, [props.refreshKey]);
			const open = (id) => {
				if (openId === id) {
					setOpenId(null);
					setDetail(null);
					return;
				}
				setOpenId(id);
				setDetail(null);
				setDetailBusy(true);
				const row = (data !== null && data.items || []).find((x) => x.id === id);
				rtOp("pocGet", {
					id,
					scope: row && row.scope || (scope === "project" ? "project" : "global")
				}).then((r) => {
					setDetailBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setDetail(r.data);
				});
			};
			const copy = (text, label) => {
				copyWithFeedback(t, text, label, (ok, message) => {
					setMsg(ok ? { ok: message } : { err: message });
				});
			};
			const useIt = (row) => {
				rtOp("pocUse", {
					id: row.id,
					used_on: t("rt.k.manualUse"),
					scope: row && row.scope || (scope === "project" ? "project" : "global")
				}).then(() => {
					setMsg({ ok: t("rt.k.usedMarked", { title: row.title }) });
					query();
				});
			};
			const stats = data !== null && data.stats || {
				total: 0,
				verified: 0,
				reused: 0,
				byKind: [],
				bySource: []
			};
			const items = data !== null && data.items || [];
			const tpl = data !== null && data.templates || {
				dir: null,
				total: 0,
				matched: 0,
				offset: 0,
				items: [],
				byCategory: []
			};
			const tplByCat = new Map((tpl.byCategory ?? []).map((c) => [String(c.code), Number(c.n ?? 0)]));
			const catShown = (c) => (c.n ?? 0) + (tplByCat.get(String(c.code)) ?? 0);
			const tplItems = tpl.items ?? [];
			const tplMatched = tpl.matched !== null && tpl.matched !== void 0 ? tpl.matched : tpl.total;
			const tplStart = Number(tpl.offset) || 0;
			const turnTpl = (next) => {
				const offset = Math.max(0, next);
				setTplOffset(offset);
				query({ templateOffset: offset });
			};
			const card = (x) => {
				const isOpen = openId === x.id;
				const d = isOpen && detail !== null && detail.id === x.id ? detail : null;
				return h("div", {
					key: "p" + x.id,
					class: "dshp-rt-kb" + (isOpen ? " open" : "")
				}, h("div", {
					class: "dshp-rt-kb-head",
					role: "button",
					tabIndex: 0,
					"aria-expanded": isOpen ? "true" : "false",
					onClick: () => {
						open(x.id);
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							open(x.id);
						}
					}
				}, h("span", { class: "dshp-rt-sec-caret" }, isOpen ? "▾" : "▸"), h("span", { class: "dshp-rt-kb-kind k-" + (x.kind || "poc") }, pocKindLabel(t, x.kind)), h("span", { class: "dshp-rt-kb-title" }, x.title), x.cve ? h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, x.cve) : null, x.component ? h("span", { class: "dshp-rt-tag" }, x.component) : null, x.verified === 1 ? h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.k.verified")) : h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.k.unverified")), h("div", { class: "dshp-rt-spacer" }), h("span", { class: "dshp-rt-tag" }, pocSourceLabel(t, x.source) || "—"), x.hit_count ? h("span", { class: "dshp-rt-tag" }, t("rt.k.reuseN", { n: x.hit_count })) : null), h("div", { class: "dshp-rt-kb-sub" }, [
					x.category ? t("rt.k.catOf", { v: pocCatName(t, x.category) }) : null,
					x.versions ? t("rt.k.versionsOf", { v: x.versions }) : null,
					x.language || null,
					x.tags || null,
					t("rt.k.createdAt", { time: fmt(x.created_at) }),
					x.engagement_name ?? x.engagement_id ? t("rt.k.srcEngagement", { v: x.engagement_name ?? x.engagement_id }) : null,
					x.asset_target ? t("rt.k.foundOn", { v: x.asset_target }) : null,
					x.found_by_agent ? t("rt.k.foundBy", { v: roleLabel(t, x.found_by_agent) }) : null,
					x.source_url ? t("rt.k.sourceIs", { v: x.source_url }) : null
				].filter(Boolean).join(" · ")), isOpen ? h("div", { class: "dshp-rt-kb-body" }, detailBusy && d === null ? h("div", { class: "dshp-rt-empty" }, t("rt.loading")) : null, d !== null ? h("div", null, d.usage ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.k.usage")), h("span", { class: "dshp-rt-mono" }, d.usage)) : null, d.description ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.k.desc")), h("span", null, d.description)) : null, d.verified_note ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.k.verifyNote")), h("span", null, d.verified_note)) : null, d.used_on ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.k.lastUsed")), h("span", null, d.used_on)) : null, d.path ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.k.path")), h("span", { class: "dshp-rt-mono" }, d.path)) : null, h("div", { class: "dshp-rt-kb-actions" }, h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: !d.content,
					onClick: () => {
						copy(d.content || "", t("rt.k.copyContent"));
					}
				}, t("rt.k.copyContent")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: () => {
						useIt(x);
					}
				}, t("rt.k.markUse")), d.source_url ? h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: () => {
						copy(d.source_url, t("rt.k.copySource"));
					}
				}, t("rt.k.copySource")) : null), d.content ? h("pre", { class: "dshp-rt-rep-http" }, d.content.length > 12e3 ? d.content.slice(0, 12e3) + "\n…" + t("rt.k.truncated") : d.content) : h("div", { class: "dshp-rt-empty" }, t("rt.k.metaOnly"))) : null) : null);
			};
			return h("div", { class: "dshp-rt-main" }, h("div", {
				class: "dshp-rt-hint",
				style: {
					padding: "6px 12px",
					margin: 0
				}
			}, t("rt.k.scopeHint")), h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.tab.knowledge")), [
				"project",
				"global",
				"all"
			].map((s) => h("button", {
				key: s,
				class: "dshp-rt-btn" + (scope === s ? " dshp-rt-btn-primary" : ""),
				type: "button",
				title: t("rt.k.scope." + s + "Tip"),
				onClick: () => {
					setScope(s);
					query({ scope: s });
				}
			}, t("rt.k.scope." + s))), h("span", { class: "dshp-rt-tag" }, t("rt.k.totalN", { n: stats.total })), h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.k.verifiedN", { n: stats.verified })), h("span", { class: "dshp-rt-tag" }, t("rt.k.reusedN", { n: stats.reused ?? 0 })), (stats.uncategorized ?? 0) > 0 && (stats.uncategorized ?? 0) !== stats.total ? h("span", {
				class: "dshp-rt-tag dshp-rt-tag-warn",
				title: t("rt.k.uncatTip")
			}, t("rt.k.uncatN", { n: stats.uncategorized })) : null, tpl.total ? h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, t("rt.k.localTplN", { n: tpl.total })) : null, h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn" + (grouped ? " dshp-rt-btn-primary" : ""),
				type: "button",
				title: t("rt.k.groupedTitle"),
				onClick: () => {
					setGrouped((g) => !g);
				}
			}, grouped ? t("rt.k.grouped") : t("rt.k.flat")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: () => {
					query();
				}
			}, busy ? t("rt.k.searching") : t("rt.refresh"))), h("div", { class: "dshp-rt-kb-cats" }, (stats.byCategory ?? []).filter((c) => catShown(c) > 0 || POC_CAT_ORDER.includes(String(c.code))).map((c) => h("span", {
				key: c.code,
				class: "dshp-rt-concl-i" + (category === c.code ? " on" : ""),
				title: (c.hint || pocCatName(t, String(c.code))) + t("rt.k.catStat", {
					tpl: tplByCat.get(String(c.code)) ?? 0,
					kb: c.n ?? 0,
					verified: c.verified ? t("rt.k.catVerified", { n: c.verified }) : ""
				}),
				onClick: () => {
					const next = category === c.code ? "" : String(c.code);
					setCategory(next);
					query({ category: next || void 0 });
				}
			}, h("b", null, String(catShown(c))), h("span", null, pocCatName(t, String(c.code)) + (c.verified ? t("rt.k.catVerified", { n: c.verified }) : ""))))), h("div", { class: "dshp-rt-kb-filter" }, h("input", {
				class: "dshp-rt-input",
				style: {
					flex: 1,
					minWidth: 140
				},
				placeholder: t("rt.k.searchPh"),
				value: q,
				onChange: (e) => {
					setQ(e.target.value);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") query();
				}
			}), h("select", {
				class: "dshp-rt-input",
				style: { maxWidth: 120 },
				value: category,
				onChange: (e) => {
					setCategory(e.target.value);
					query({ category: e.target.value || void 0 });
				}
			}, h("option", { value: "" }, t("rt.k.allCats")), POC_CAT_ORDER.map((k) => h("option", {
				key: k,
				value: k
			}, pocCatName(t, k)))), h("select", {
				class: "dshp-rt-input",
				style: { maxWidth: 120 },
				value: engagement,
				onChange: (e) => {
					setEngagement(e.target.value);
					query({ engagement: e.target.value || void 0 });
				}
			}, h("option", { value: "" }, t("rt.k.allEngagements")), (stats.byEngagement ?? []).map((e) => h("option", {
				key: e.engagement,
				value: e.engagement
			}, e.engagement + "（" + e.n + "）"))), h("input", {
				class: "dshp-rt-input",
				style: { width: 120 },
				placeholder: t("rt.k.assetFilter"),
				value: assetTarget,
				onChange: (e) => {
					setAssetTarget(e.target.value);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") query();
				}
			}), h("select", {
				class: "dshp-rt-input",
				style: { maxWidth: 110 },
				value: kind,
				onChange: (e) => {
					setKind(e.target.value);
					query({ kind: e.target.value || void 0 });
				}
			}, h("option", { value: "" }, t("rt.k.allKinds")), [
				"poc",
				"exp",
				"script",
				"template",
				"payload"
			].map((k) => h("option", {
				key: k,
				value: k
			}, pocKindLabel(t, k)))), h("label", { class: "dshp-rt-kb-check" }, h("input", {
				type: "checkbox",
				checked: verifiedOnly,
				onChange: (e) => {
					setVerifiedOnly(e.target.checked);
					query({ verified: e.target.checked || void 0 });
				}
			}), t("rt.k.verifiedOnly")), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				onClick: () => {
					query();
				}
			}, t("rt.k.search"))), msg !== null ? h("div", { class: msg.err !== void 0 ? "dshp-rt-err" : "dshp-rt-foot" }, msg.err || msg.ok) : null, err !== null ? h("div", { class: "dshp-rt-err" }, /engagement required|unknown op/i.test(err) ? t("rt.k.oldHostHint") : err) : null, err === null && data !== null && data.dbPath ? h("div", {
				class: "dshp-rt-foot",
				style: {
					marginBottom: 6,
					fontSize: 11
				}
			}, t("rt.k.dbAt", { path: data.dbPath }) + (data.root ? t("rt.k.rootAt", { path: data.root }) : "")) : null, h("div", { class: "dshp-rt-table" }, (() => {
				if (!grouped) return items.map(card);
				const buckets = /* @__PURE__ */ new Map();
				for (const x of items) {
					const code = POC_CAT_ORDER.includes(String(x.category)) && x.category !== void 0 ? String(x.category) : "other";
					if (!buckets.has(code)) buckets.set(code, []);
					buckets.get(code).push(x);
				}
				const order = POC_CAT_ORDER.filter((c) => buckets.has(c));
				for (const code of buckets.keys()) if (!order.includes(code)) order.push(code);
				const out = [];
				for (const code of order) {
					const list = buckets.get(code);
					out.push(h("div", {
						key: "g" + code,
						class: "dshp-rt-kb-cat"
					}, h("span", { class: "dshp-rt-kb-cat-name" }, pocCatName(t, code)), h("span", { class: "dshp-rt-tag" }, t("rt.k.nEntries", { n: list.length })), h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.k.verifiedN", { n: list.filter((x) => x.verified === 1).length })), h("span", { class: "dshp-rt-spacer" }), h("span", { style: {
						fontSize: 11,
						color: "var(--dsw-alias-label-secondary)"
					} }, t("rt.k.latestAt", { time: fmt(list.map((x) => x.created_at).filter(Boolean).sort().pop()) }))));
					for (const x of list) out.push(card(x));
				}
				return out;
			})(), tplItems.length > 0 ? h("div", { class: "dshp-rt-kb-tpl" }, h("div", { class: "dshp-rt-ap-sub" }, t("rt.k.tplRange", {
				from: tplStart + 1,
				to: tplStart + tplItems.length,
				total: tplMatched
			})), tplItems.map((tp, i) => h("div", {
				key: "t" + tplStart + "-" + i,
				class: "dshp-rt-kb-tpl-row"
			}, h("span", { class: "dshp-rt-tag" }, tp.severity || "—"), tp.category ? h("span", { class: "dshp-rt-tag" }, pocCatName(t, String(tp.category))) : null, h("span", {
				class: "dshp-rt-mono dshp-rt-kb-tpl-path",
				title: tp.path
			}, tp.path), h("span", {
				class: "dshp-rt-kb-tpl-name",
				title: tp.name
			}, tp.name || ""), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 10.5
				},
				onClick: () => {
					copy("nuclei -t " + tp.path + " -u <target>", t("rt.k.tplCmd"));
				}
			}, t("rt.k.copyCmd")))), h("div", { class: "dshp-rt-kb-actions" }, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy || tplStart <= 0,
				onClick: () => {
					turnTpl(tplStart - TPL_PAGE_SIZE);
				}
			}, t("rt.k.prevPage")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy || tplStart + tplItems.length >= tplMatched,
				onClick: () => {
					turnTpl(tplStart + TPL_PAGE_SIZE);
				}
			}, t("rt.k.nextPage"))), tpl.dir ? h("div", { class: "dshp-rt-foot" }, h("span", null, t("rt.k.tplDir", { path: tpl.dir }))) : null) : null, data === null ? h("div", { class: "dshp-rt-empty" }, t("rt.loading")) : null, data !== null && items.length === 0 && tplItems.length === 0 ? h("div", { class: "dshp-rt-empty" }, h("div", null, q !== "" || kind !== "" || verifiedOnly ? t("rt.k.noHitSearched") : tpl.total ? t("rt.k.emptyWithTpl", { n: tpl.total }) : tpl.dir ? t("rt.k.emptyTplNoYaml") : t("rt.k.emptyNoTpl")), h("div", { style: {
				marginTop: 6,
				fontSize: 12
			} }, t("rt.k.orderHint")), data.dbPath ? h("div", {
				style: {
					marginTop: 6,
					fontSize: 11
				},
				class: "dshp-rt-mono"
			}, t("rt.k.dbAt", { path: data.dbPath })) : null, tpl.dir ? h("div", {
				style: {
					marginTop: 6,
					fontSize: 11
				},
				class: "dshp-rt-mono"
			}, t("rt.k.tplDir", { path: String(tpl.dir) })) : null) : null), h("div", { class: "dshp-rt-foot" }, h("span", null, t("rt.k.footNote"))));
		}
		// client/redteam/OverviewTab.tsx
		/**
		* 作战总览首页（C-3.2）：一屏看清「打到哪了、谁在跑、最近拿了什么、缺什么证据」。
		*   - 阶段进度条 + 总分/满分（op: scoreChain 的 stages 与 summary）；
		*   - 在跑智能体卡（op: agentsStatus）；
		*   - 最近命中 5 条（op: scores 展平 hits，点击深链到得分点的命中列表）；
		*   - 缺证据警告（op: scoreReport 的 summary.missingRequests）；
		*   - 常驻「当前测试」卡（旧 TestingTab 升格迁入，5s 轮询保留）。
		*/
		function OverviewTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [chain, setChain] = (0, react.useState)(null);
			const [chainErr, setChainErr] = (0, react.useState)(null);
			const [agents, setAgents] = (0, react.useState)(null);
			const [scores, setScores] = (0, react.useState)(null);
			const [reportSummary, setReportSummary] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (eng === null || eng === "") return;
				setChain(null);
				setChainErr(null);
				rtOp("scoreChain", { engagement: eng }).then((r) => {
					if (r.ok) setChain(r.data);
					else setChainErr(r.error);
				});
				rtOp("agentsStatus").then((r) => {
					if (r.ok) setAgents(r.data);
				});
				rtOp("scores", { engagement: eng }).then((r) => {
					if (r.ok) setScores(r.data);
				});
				rtOp("scoreReport", { engagement: eng }).then((r) => {
					if (r.ok) setReportSummary(r.data.summary ?? null);
				});
			}, [eng, props.refreshKey]);
			const stages = chain !== null && chain.stages || [];
			const summary = chain !== null ? chain.summary : null;
			const totalPoints = summary !== null ? summary.totalPoints ?? 0 : 0;
			const points = summary !== null ? summary.points ?? 0 : 0;
			const pct = totalPoints > 0 ? Math.min(100, Math.round(points / totalPoints * 100)) : 0;
			const stageBar = h("div", { class: "dshp-rt-stages" }, stages.length === 0 && chainErr === null ? h("div", {
				class: "dshp-rt-ov-sub",
				style: { padding: "2px 0" }
			}, t("rt.ov.noStages")) : stages.map((st, i) => h("div", {
				key: "st" + i,
				class: "dshp-rt-stage-seg",
				style: { borderTopColor: st.color || "#64748b" },
				title: st.goal || ""
			}, h("div", { class: "dshp-rt-stage-nm" }, String(i + 1) + ". " + st.name), h("div", null, h("span", {
				class: "dshp-rt-ap-pts",
				style: st.points > 0 ? {
					background: (st.color || "#10b981") + "22",
					color: st.color || "#065f46",
					borderColor: (st.color || "#10b981") + "66"
				} : {}
			}, "+" + (st.points ?? 0))), h("div", { class: "dshp-rt-stage-cum" }, t("rt.c.cumulative", { n: st.cumulative ?? 0 })))));
			const scoreTile = h("div", { class: "dshp-rt-ov-tile" }, h("div", { class: "dshp-rt-ov-title" }, t("rt.ov.scoreTitle")), h("div", null, h("span", { class: "dshp-rt-ov-big" }, String(points)), h("span", { style: {
				fontSize: 13,
				color: "var(--dsw-alias-label-secondary)"
			} }, " / " + String(totalPoints))), h("div", { class: "dshp-rt-ov-bar" }, h("i", { style: { width: pct + "%" } })), h("div", { class: "dshp-rt-ov-sub" }, t("rt.ov.scoreSub", { pct })), summary !== null ? h("div", { class: "dshp-rt-ov-sub" }, t("rt.ov.hitCount", {
				hits: summary.countedHits ?? 0,
				capped: summary.serviceCappedHits ? t("rt.ov.cappedExtra", { n: summary.serviceCappedHits }) : ""
			})) : null, chainErr !== null ? h("div", { class: "dshp-rt-err" }, chainErr) : null);
			const agentsTile = h("div", { class: "dshp-rt-ov-tile" }, h("div", { class: "dshp-rt-ov-title" }, t("rt.tab.agents")), agents === null ? h("div", { class: "dshp-rt-ov-sub" }, t("rt.loading")) : h("div", null, h("div", null, h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, t("rt.ag.maxN", { n: agents.max ?? 3 })), h("span", {
				class: "dshp-rt-tag" + ((agents.used ?? 0) >= (agents.max ?? 3) ? " dshp-rt-tag-warn" : " dshp-rt-tag-live"),
				style: { marginLeft: 4 }
			}, t("rt.ag.usedN", {
				used: agents.used ?? 0,
				free: Math.max((agents.max ?? 3) - (agents.used ?? 0), 0)
			}))), (agents.running ?? []).length > 0 ? h("div", { style: {
				marginTop: 6,
				display: "flex",
				flexDirection: "column",
				gap: 3
			} }, (agents.running ?? []).slice(0, 6).map((r, i) => h("div", {
				key: "ag" + i,
				class: "dshp-rt-tag",
				style: {
					display: "block",
					whiteSpace: "normal",
					overflowWrap: "anywhere"
				},
				title: r.parent || ""
			}, h("span", {
				class: "dshp-rt-live-dot",
				style: {
					display: "inline-block",
					marginRight: 5
				}
			}), r.label))) : h("div", {
				class: "dshp-rt-ov-sub",
				style: { marginTop: 6 }
			}, t("rt.ov.noRunningAgents"))), h("div", { style: {
				marginTop: "auto",
				paddingTop: 6
			} }, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 8px",
					fontSize: 11
				},
				onClick: () => {
					props.jump("agents");
				}
			}, t("rt.ov.openAgents"))));
			const allHits = [];
			if (scores !== null) {
				for (const p of scores.items ?? []) for (const hh of p.hits ?? []) allHits.push({
					...hh,
					pointId: p.id,
					pointName: p.name
				});
				allHits.sort((a, b) => String(b.recorded_at || "").localeCompare(String(a.recorded_at || "")));
			}
			const recentHits = allHits.slice(0, 5);
			const hitsTile = h("div", { class: "dshp-rt-ov-tile" }, h("div", { class: "dshp-rt-ov-title" }, t("rt.ov.recentHits")), scores === null ? h("div", { class: "dshp-rt-ov-sub" }, t("rt.loading")) : recentHits.length === 0 ? h("div", { class: "dshp-rt-ov-sub" }, t("rt.ov.noHits")) : h("div", null, recentHits.map((hh, i) => h("div", {
				...clickable(() => {
					props.jump("scores", { pointId: hh.pointId });
				}, { label: t("rt.ov.hitJump", { point: hh.pointName }) }),
				key: "h" + i,
				class: "dshp-rt-ov-hit",
				title: t("rt.ov.hitJumpTitle")
			}, h("div", { class: "dshp-rt-ov-hit-head" }, h("span", { class: "dshp-rt-ov-hit-name" }, hh.pointName), hh.self_created ? h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.s.selfCreated")) : null, hh.capped ? h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.s.serviceCapped")) : null, h("span", { class: "dshp-rt-hit-time" }, fmt(hh.recorded_at))), h("div", {
				class: "dshp-rt-mono",
				style: {
					fontSize: 11.5,
					wordBreak: "break-all"
				}
			}, hh.asset_ip || hh.target || t("rt.s.noAsset")), hh.evidence ? h("div", {
				class: "dshp-rt-hit-txt",
				style: {
					flex: "none",
					maxHeight: 34,
					overflow: "hidden"
				},
				title: hh.evidence
			}, String(hh.evidence).replace(/\n+/g, " ")) : h("div", { class: "dshp-rt-hit-txt none" }, t("rt.s.noEvidence"))))));
			const missing = reportSummary !== null ? reportSummary.missingRequests ?? 0 : 0;
			const evidenceTile = h("div", { class: "dshp-rt-ov-tile" }, h("div", { class: "dshp-rt-ov-title" }, t("rt.ov.evidenceTitle")), reportSummary === null ? h("div", { class: "dshp-rt-ov-sub" }, t("rt.loading")) : missing > 0 ? h("div", {
				class: "dshp-rt-hint",
				style: { marginBottom: 0 }
			}, h("b", null, t("rt.ov.missingEvidence", { n: missing })), h("div", { style: { marginTop: 3 } }, t("rt.ov.missingEvidenceHow"))) : h("div", { class: "dshp-rt-ov-sub" }, (reportSummary.count ?? 0) > 0 ? t("rt.ov.evidenceOk", {
				n: reportSummary.withRequests ?? 0,
				m: reportSummary.count ?? 0
			}) : t("rt.ov.evidenceNoItems")), h("div", { style: {
				marginTop: "auto",
				paddingTop: 6
			} }, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 8px",
					fontSize: 11
				},
				onClick: () => {
					props.jump("report");
				}
			}, t("rt.tab.report"))));
			return h("div", {
				class: "dshp-rt-main",
				style: { overflow: "auto" }
			}, stageBar, h("div", { class: "dshp-rt-ov-grid" }, scoreTile, agentsTile, hitsTile, evidenceTile), h(TestingCard, {
				t,
				eng,
				refreshKey: props.refreshKey
			}));
		}
		function TestingCard(props) {
			const t = props.t;
			const eng = props.eng;
			const [data, setData] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [at, setAt] = (0, react.useState)(null);
			const [auto, setAuto] = (0, react.useState)(true);
			const collapse = useCollapse("testing:" + String(eng));
			const inflight = (0, react.useRef)(false);
			const seq = (0, react.useRef)(0);
			const load = () => {
				if (eng === null || eng === "" || inflight.current) return;
				inflight.current = true;
				const my = ++seq.current;
				rtOp("activeTests", {
					engagement: eng,
					limit: 20
				}).then((r) => {
					if (my !== seq.current) return;
					inflight.current = false;
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setData(r.data);
					setAt(/* @__PURE__ */ new Date());
				});
			};
			(0, react.useEffect)(() => {
				seq.current += 1;
				load();
			}, [eng, props.refreshKey]);
			(0, react.useEffect)(() => {
				if (eng === null || eng === "" || !auto) return void 0;
				const timer = setInterval(load, 5e3);
				return () => {
					clearInterval(timer);
				};
			}, [
				eng,
				auto,
				props.refreshKey
			]);
			const testing = data !== null && data.testing || [];
			const recent = data !== null && data.recent || [];
			const queue = data !== null && data.queue || [];
			const stats = data !== null && data.stats || {};
			const card = (a, past) => {
				const chips = [];
				chips.push(h("span", {
					key: "sc",
					class: "dshp-rt-scope dshp-rt-scope-" + (a.scope === "internal" ? "internal" : "external")
				}, a.scope === "internal" ? t("rt.scope.internal") : t("rt.scope.external")));
				if (a.segment_cidr) chips.push(h("span", {
					key: "seg",
					class: "dshp-rt-tag"
				}, a.segment_cidr));
				if (a.open_ports) chips.push(h("span", {
					key: "p",
					class: "dshp-rt-tag dshp-rt-tag-active"
				}, t("rt.t.openPorts", { n: a.open_ports })));
				if (a.vulns) chips.push(h("span", {
					key: "v",
					class: "dshp-rt-tag dshp-rt-tag-live"
				}, t("rt.c.nVulns", { n: a.vulns })));
				if (a.webshells) chips.push(h("span", {
					key: "w",
					class: "dshp-rt-tag dshp-rt-tag-passive"
				}, t("rt.t.webshells", { n: a.webshells })));
				if (a.tunnels) chips.push(h("span", {
					key: "t",
					class: "dshp-rt-tag dshp-rt-tag-passive"
				}, t("rt.se.tunnelsTitle") + " " + a.tunnels));
				if (a.priority) chips.push(h("span", {
					key: "pr",
					class: "dshp-rt-tag"
				}, t("rt.c.easyN", { p: a.priority })));
				if (a.blocked_count) chips.push(h("span", {
					key: "b",
					class: "dshp-rt-tag",
					style: {
						color: "#ef4444",
						borderColor: "#ef444455"
					}
				}, t("rt.a.blockedN", { n: a.blocked_count })));
				const noteLines = a.test_notes !== void 0 && a.test_notes !== null ? String(a.test_notes).split("\n").slice(-3).map((l) => l.length > 240 ? l.slice(0, 240) + " …" : l) : [];
				return h("div", {
					key: "at" + a.id,
					class: "dshp-rt-atest" + (past ? " past" : "")
				}, h("div", { class: "dshp-rt-atest-head" }, past ? null : h("span", { class: "dshp-rt-live-dot" }), h("span", { class: "dshp-rt-atest-ip" }, a.ip), h("span", null, h(TestTag, {
					t,
					s: a.test_status
				})), h("div", { class: "dshp-rt-spacer" }), h("span", { style: {
					fontSize: 11,
					color: "var(--dsw-alias-label-secondary)"
				} }, fmt(a.test_updated_at) + (a.test_updated_by ? " · " + a.test_updated_by : ""))), chips.length > 0 ? h("div", null, chips) : null, a.test_surface ? h("div", { class: "dshp-rt-atest-meta" }, t("rt.t.surface") + "：" + a.test_surface) : null, a.potential ? h("div", { class: "dshp-rt-atest-meta" }, t("rt.t.potential") + "：" + a.potential) : null, noteLines.length > 0 ? h(Clip, {
					t,
					label: t("rt.a.notesShort"),
					text: noteLines.join("\n")
				}) : null);
			};
			const concl = (label, value) => h("span", {
				key: label,
				class: "dshp-rt-concl-i",
				style: { cursor: "default" }
			}, h("b", null, String(value ?? 0)), h("span", null, label));
			const conclusion = h("div", { class: "dshp-rt-concl" }, concl(t("rt.test.testing"), stats.testing ?? 0), concl(t("rt.a.nUntested"), stats.untested ?? 0), concl(t("rt.test.tested"), stats.tested ?? 0), concl(t("rt.a.nGiveup"), (stats.abandoned ?? 0) + (stats.blocked ?? 0)), concl(t("rt.test.no_surface"), stats.no_surface ?? 0), h("div", { class: "dshp-rt-spacer" }), at !== null ? h("span", { style: {
				fontSize: 11,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.t.updatedAt", { time: at.toLocaleTimeString("zh-CN", { hour12: false }) })) : null, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 7px",
					fontSize: 11
				},
				title: t("rt.t.expandAllTitle"),
				onClick: () => {
					collapse.setAll([
						"testing",
						"recent",
						"queue"
					], true);
				}
			}, t("rt.f.expandAll")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 7px",
					fontSize: 11
				},
				title: t("rt.t.collapseAllTitle"),
				onClick: () => {
					collapse.setAll([
						"testing",
						"recent",
						"queue"
					], false);
				}
			}, t("rt.f.collapseAll")), h("button", {
				class: "dshp-rt-btn" + (auto ? " dshp-rt-btn-primary" : ""),
				type: "button",
				style: {
					padding: "0 7px",
					fontSize: 11
				},
				title: t("rt.t.autoTitle"),
				onClick: () => {
					setAuto((x) => !x);
				}
			}, auto ? t("rt.t.live5s") : t("rt.t.paused")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 7px",
					fontSize: 11
				},
				onClick: load
			}, t("rt.refresh")));
			const body = [];
			body.push(h(Section, {
				tone: "test",
				title: t("rt.t.testingNow"),
				count: t("rt.t.nHosts", { n: testing.length }),
				sub: testing.length > 0 ? t("rt.t.testingSub") : t("rt.t.testingEmptySub"),
				open: collapse.isOpen("testing", true),
				onToggle: collapse.toggle("testing", true)
			}, testing.length > 0 ? testing.map((a) => card(a, false)) : h("div", {
				class: "dshp-rt-atest-meta",
				style: { paddingBottom: 4 }
			}, t("rt.t.testingEmpty"))));
			body.push(h(Section, {
				tone: "past",
				title: t("rt.t.recent"),
				count: t("rt.t.nHosts", { n: recent.length }),
				sub: t("rt.t.recentSub"),
				open: collapse.isOpen("recent", false),
				onToggle: collapse.toggle("recent", false)
			}, recent.length > 0 ? recent.map((a) => card(a, true)) : h("div", { class: "dshp-rt-atest-meta" }, t("rt.empty"))));
			body.push(h(Section, {
				tone: "queue",
				title: t("rt.t.queue"),
				count: t("rt.t.nHosts", { n: data !== null ? data.untested ?? 0 : 0 }),
				sub: t("rt.t.queueSub"),
				open: collapse.isOpen("queue", false),
				onToggle: collapse.toggle("queue", false)
			}, queue.length > 0 ? [...queue.map((a) => card(a, true)), h("div", {
				key: "queueHint",
				class: "dshp-rt-atest-meta",
				style: { paddingTop: 4 }
			}, t("rt.t.queueHint"))] : h("div", { class: "dshp-rt-atest-meta" }, t("rt.t.queueEmpty"))));
			return h("div", {
				class: "dshp-rt-main",
				style: {
					borderTop: "1px solid var(--dsw-alias-border-l1)",
					marginTop: 10
				}
			}, h("div", { style: {
				padding: "8px 12px 0",
				fontWeight: 600
			} }, t("rt.t.cardTitle")), conclusion, err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, data === null && err === null ? h("div", { class: "dshp-rt-empty" }, t("rt.loading")) : null, h("div", {
				class: "dshp-rt-body",
				style: { overflow: "auto" }
			}, h("div", { style: { padding: "6px 12px 14px" } }, body)));
		}
		// client/redteam/ProjectsTab.tsx
		/**
		* 项目中心（projects 页签）：红队演练的第一个界面。
		*
		* 业务模型：**一个项目 = 一个靶标工作区**（store 的 engagement）——
		* 每个项目一个目录 + 一个 SQLite 库（资产/端口/指纹/漏洞/凭据/攻击链/得分/截图），
		* 项目之间互不共享数据；知识库、技能库、环境适配是全局的。
		* 会话（含它派出的子智能体）通过 session-bindings.json 绑到一个项目，
		* 面板顶部的「绑定本会话」与这里显示的「绑定会话 N」是同一份关系。
		*
		* 所以页面的第一性问题不是"看某个库"，而是「我有哪些项目、每个做到哪、最近谁在动」。
		*/
		function ProjectsTab(props) {
			const t = props.t;
			const [items, setItems] = (0, react.useState)(null);
			const [current, setCurrent] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [filter, setFilter] = (0, react.useState)("active");
			const [creating, setCreating] = (0, react.useState)(false);
			const [busy, setBusy] = (0, react.useState)("");
			const [form, setForm] = (0, react.useState)({
				name: "",
				scope: "",
				note: ""
			});
			const load = (0, react.useCallback)(() => {
				rtOp("projects").then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setItems(Array.isArray(r.data.items) ? r.data.items : []);
					setCurrent(typeof r.data.current === "string" ? r.data.current : null);
				});
			}, []);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			const open = (id, name) => {
				setBusy("open:" + id);
				rtOp("activateEngagement", { engagement: id }).then((r) => {
					setBusy("");
					if (!r.ok) {
						props.notices.report(props.t("rt.pj.openFailed") + "：" + r.error, "failure");
						return;
					}
					setCurrent(id);
					props.onOpen(id, name);
				});
			};
			const create = () => {
				const name = form.name.trim();
				if (name === "") return;
				const scope = form.scope.split(/[\n,，\s]+/).map((x) => x.trim()).filter(Boolean);
				setBusy("create");
				rtOp("openEngagement", {
					name,
					scope
				}).then((r) => {
					setBusy("");
					if (!r.ok) {
						props.notices.report(props.t("rt.pj.createFailed") + "：" + r.error, "failure");
						return;
					}
					const id = r.data.engagement !== void 0 ? r.data.engagement.id : "";
					setCreating(false);
					setForm({
						name: "",
						scope: "",
						note: ""
					});
					invalidateProjects();
					load();
					props.onChanged();
					if (typeof id === "string" && id !== "") {
						if (form.note.trim() !== "") rtOp("updateEngagement", {
							engagement: id,
							patch: { note: form.note.trim() }
						});
						open(id, name);
					}
				});
			};
			const update = (id, patch, done) => {
				setBusy("upd:" + id);
				rtOp("updateEngagement", {
					engagement: id,
					patch
				}).then((r) => {
					setBusy("");
					if (!r.ok) {
						props.notices.report(props.t("rt.pj.updateFailed") + "：" + r.error, "failure");
						return;
					}
					if (done !== void 0) props.notices.report(done, "success");
					invalidateProjects();
					load();
					props.onChanged();
				});
			};
			const visible = (items ?? []).filter((p) => {
				if (filter === "all") return true;
				if (filter === "archived") return p.status === "archived" || p.status === "closed";
				return p.status !== "archived" && p.status !== "closed";
			});
			const statusTag = (status) => status === "archived" ? h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, t("rt.pj.archived")) : status === "closed" ? h("span", { class: "dshp-rt-tag" }, t("rt.pj.closed")) : h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.pj.active"));
			return h("div", {
				class: "dshp-rt-main",
				style: { overflow: "auto" }
			}, h("div", { class: "dshp-pj-head" }, h("div", { class: "dshp-pj-titlebox" }, h("div", { class: "dshp-pj-title" }, t("rt.pj.title")), h("div", { class: "dshp-pj-sub" }, t("rt.pj.subtitle"))), h("div", { class: "dshp-rt-spacer" }), h("div", {
				class: "dshp-rt-subtabs",
				style: {
					borderBottom: "none",
					padding: 0
				}
			}, [
				"active",
				"archived",
				"all"
			].map((f) => h("button", {
				key: f,
				type: "button",
				class: "dshp-rt-subtab" + (filter === f ? " on" : ""),
				onClick: () => {
					setFilter(f);
				}
			}, t("rt.pj.filter." + f)))), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				onClick: () => {
					setCreating((v) => !v);
				}
			}, t("rt.pj.new"))), creating ? h("div", { class: "dshp-rt-card dshp-pj-create" }, h("div", { class: "dshp-rt-ov-title" }, t("rt.pj.new")), h("div", { class: "dshp-pj-field" }, h("div", { class: "dshp-pj-label" }, t("rt.pj.name")), h("input", {
				class: "dshp-rt-input",
				placeholder: t("rt.pj.namePh"),
				value: form.name,
				onChange: (e) => {
					setForm((s) => ({
						...s,
						name: e.target.value
					}));
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") create();
				}
			})), h("div", { class: "dshp-pj-field" }, h("div", { class: "dshp-pj-label" }, t("rt.pj.scope")), h("textarea", {
				class: "dshp-rt-textarea",
				style: {
					minHeight: 56,
					fontFamily: "ui-monospace, Consolas, monospace"
				},
				placeholder: t("rt.pj.scopePh"),
				value: form.scope,
				onChange: (e) => {
					setForm((s) => ({
						...s,
						scope: e.target.value
					}));
				}
			})), h("div", { class: "dshp-pj-field" }, h("div", { class: "dshp-pj-label" }, t("rt.pj.note")), h("input", {
				class: "dshp-rt-input",
				value: form.note,
				onChange: (e) => {
					setForm((s) => ({
						...s,
						note: e.target.value
					}));
				}
			})), h("div", { class: "dshp-pj-actions" }, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					setCreating(false);
				}
			}, t("rt.pj.cancel")), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: busy === "create" || form.name.trim() === "",
				onClick: create
			}, busy === "create" ? t("rt.pj.creating") : t("rt.pj.create")))) : null, err !== null ? h(ErrorLine, {
				label: t("rt.pj.title"),
				message: err,
				retryText: t("common.retry"),
				onRetry: load
			}) : null, items === null && err === null ? h(Loading, { text: t("rt.loading") }) : null, items !== null && visible.length === 0 ? h("div", { class: "dshp-rt-empty" }, t("rt.pj.empty")) : null, h("div", { class: "dshp-pj-grid" }, visible.map((p) => h(ProjectCard, {
				key: p.id,
				t,
				project: p,
				isCurrent: current === p.id,
				busy,
				statusTag,
				onOpen: open,
				onUpdate: update,
				notices: props.notices,
				onEnter: props.onEnter,
				onNewSession: props.onNewSession,
				onDelete: async (id, workspaceId) => {
					const ok = await props.onDelete(id, workspaceId);
					if (ok) {
						invalidateProjects();
						setItems((prev) => prev === null ? null : prev.filter((p) => p.id !== id));
						props.onChanged();
					}
					return ok;
				},
				onSetCurrent: (id) => {
					rtOp("activateEngagement", { engagement: id }).then((r) => {
						if (!r.ok) {
							props.notices.report(props.t("rt.pj.openFailed") + "：" + r.error, "failure");
							return;
						}
						setCurrent(id);
						props.onSetCurrent(id);
					});
				},
				confirmArchive: () => confirmDialog(t("rt.pj.archiveConfirm", { name: p.name }), {
					okText: t("rt.pj.archive"),
					cancelText: t("common.cancel")
				})
			}))), items !== null ? h("div", {
				class: "dshp-rt-foot",
				style: {
					borderTop: "none",
					paddingLeft: 0
				}
			}, t("rt.pj.count", { n: items.length })) : null);
		}
		/** 单个项目卡片：进度 + 统计 + 四个动作。 */
		function ProjectCard(props) {
			const t = props.t;
			const p = props.project;
			const [editing, setEditing] = (0, react.useState)(false);
			const [draft, setDraft] = (0, react.useState)({
				name: String(p.name || ""),
				scope: (p.scope || []).join(", "),
				note: String(p.note || "")
			});
			const stage = p.stage || {};
			const total = Number(stage.totalPoints || 0);
			const points = Number(stage.points || 0);
			const pct = total > 0 ? Math.min(100, Math.round(points / total * 100)) : 0;
			const stats = p.stats || {};
			const archived = p.status === "archived" || p.status === "closed";
			return h("div", { class: "dshp-pj-card" + (props.isCurrent ? " is-current" : "") + (archived ? " is-archived" : "") }, h("div", { class: "dshp-pj-card-head" }, h("div", {
				class: "dshp-pj-card-name",
				title: p.id
			}, String(p.name || p.id)), props.statusTag(String(p.status || "active")), props.isCurrent ? h("span", { class: "dshp-rt-tag dshp-rt-tag-active" }, t("rt.pj.current")) : null, p.bound_sessions > 0 ? h("span", { class: "dshp-rt-tag" }, t("rt.pj.boundSessions", { n: p.bound_sessions })) : null), h("div", { class: "dshp-pj-meta" }, h("span", { class: "dshp-rt-mono" }, String(p.id)), h("span", { class: "dshp-pj-dot" }, "·"), h("span", null, t("rt.pj.lastActivity") + "：" + (p.last_activity ? fmt(p.last_activity) : t("rt.pj.never")))), h("div", { class: "dshp-pj-meta" }, h("span", { class: "dshp-rt-tag" + (p.workspace_id ? " dshp-rt-tag-live" : "") }, t("rt.pj.workspace") + "：" + (p.workspace_id ? t("rt.pj.workspaceReady") : t("rt.pj.workspacePending"))), h("button", {
				class: "dshp-rt-linkbtn",
				type: "button",
				title: String(p.dir || ""),
				onClick: () => {
					copyText(String(p.dir || "")).then((ok) => {
						props.notices.report(ok ? t("rt.pj.dirCopied") : t("rt.pj.copyFail"), ok ? "success" : "failure");
					});
				}
			}, t("rt.pj.copyDir"))), (p.scope || []).length > 0 ? h("div", { class: "dshp-pj-chips" }, (p.scope || []).map((cidr, i) => h("span", {
				key: "c" + i,
				class: "dshp-rt-tag dshp-rt-mono"
			}, cidr))) : h("div", { class: "dshp-pj-chips" }, h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, t("rt.pj.noScope"))), p.note ? h("div", { class: "dshp-pj-note" }, String(p.note)) : null, h("div", { class: "dshp-pj-progress" }, h("div", { class: "dshp-rt-ov-bar" }, h("i", { style: { width: pct + "%" } })), h("div", { class: "dshp-pj-stats" }, h("span", null, t("rt.pj.stat.assets") + " " + Number(stats.assets || 0)), h("span", null, t("rt.pj.stat.vulns") + " " + Number(stats.vulns || 0)), h("span", null, t("rt.pj.stat.points") + " " + points + "/" + total))), editing ? h("div", { class: "dshp-pj-edit" }, h("input", {
				class: "dshp-rt-input",
				value: draft.name,
				onChange: (e) => {
					setDraft((s) => ({
						...s,
						name: e.target.value
					}));
				}
			}), h("input", {
				class: "dshp-rt-input",
				value: draft.scope,
				placeholder: t("rt.pj.editScope"),
				onChange: (e) => {
					setDraft((s) => ({
						...s,
						scope: e.target.value
					}));
				}
			}), h("input", {
				class: "dshp-rt-input",
				value: draft.note,
				placeholder: t("rt.pj.editNote"),
				onChange: (e) => {
					setDraft((s) => ({
						...s,
						note: e.target.value
					}));
				}
			}), h("div", { class: "dshp-pj-actions" }, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					setEditing(false);
				}
			}, t("rt.pj.cancel")), archived ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					props.onUpdate(String(p.id), { status: "active" }, t("rt.pj.saved"));
				}
			}, t("rt.pj.restore")) : h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					props.confirmArchive().then((ok) => {
						if (ok) props.onUpdate(String(p.id), { status: "archived" }, t("rt.pj.saved"));
					});
				}
			}, t("rt.pj.archive")), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				onClick: () => {
					props.onUpdate(String(p.id), {
						name: draft.name,
						scope: draft.scope.split(/[,，\s]+/).map((x) => x.trim()).filter(Boolean),
						note: draft.note
					}, t("rt.pj.saved"));
					setEditing(false);
				}
			}, t("rt.pj.save")))) : null, h("div", { class: "dshp-pj-actions" }, h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				title: t("main.enterHint"),
				disabled: props.busy !== "",
				onClick: () => {
					props.onEnter(String(p.id));
				}
			}, t("main.enter")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("main.newSessionHint"),
				disabled: props.busy !== "",
				onClick: () => {
					props.onNewSession(String(p.id));
				}
			}, t("main.newSession")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: props.busy !== "",
				onClick: () => {
					props.onOpen(String(p.id), String(p.name || p.id));
				}
			}, t("rt.pj.enter")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					setEditing((v) => !v);
				}
			}, t("rt.pj.edit")), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-danger",
				type: "button",
				disabled: props.busy !== "",
				onClick: () => {
					confirmDialog(t("main.deleteConfirm", { name: String(p.name || p.id) }), {
						okText: t("main.deleteProject"),
						cancelText: t("common.cancel"),
						danger: true
					}).then((ok) => {
						if (!ok) return;
						props.onDelete(String(p.id), p.workspace_id ?? null).then((done) => {
							props.notices.report(done ? t("rt.pj.deleted", { name: String(p.name || p.id) }) : t("rt.pj.updateFailed"), done ? "success" : "failure");
						});
					});
				}
			}, t("main.deleteProject"))));
		}
		// client/redteam/ReportTab.tsx
		/**
		* 攻击得分链路复现报告页签：按阶段折叠的交付报告。
		* 自旧 client.js ReportTab 迁移：md 复制/下载、复现步骤（动作/命令/凭据/隧道/WebShell）、
		* 证据缺口展示（无请求 / 无步骤 / gaps）；新增深链：每项 → jump('chain', { hitId })。
		*/
		const CIRCLED = [
			"①",
			"②",
			"③",
			"④",
			"⑤",
			"⑥",
			"⑦",
			"⑧",
			"⑨",
			"⑩",
			"⑪",
			"⑫",
			"⑬",
			"⑭",
			"⑮",
			"⑯",
			"⑰",
			"⑱",
			"⑲",
			"⑳"
		];
		function ReportTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [data, setData] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [msg, setMsg] = (0, react.useState)(null);
			const collapse = useCollapse("report:" + String(eng));
			const load = () => {
				if (eng === null || eng === "") return;
				setBusy(true);
				setMsg(null);
				rtOp("scoreReport", { engagement: eng }).then((r) => {
					if (!r.ok) {
						setBusy(false);
						setErr(r.error);
						return;
					}
					if ((r.data.stages ?? []).length === 0 && (r.data.items ?? []).length > 0) {
						rtOp("scoreChain", { engagement: eng }).then((c) => {
							setBusy(false);
							setErr(null);
							const stages = c.ok ? groupByStage(r.data.items, c.data) : groupByStage(r.data.items, null);
							for (const st of stages) if (st.code === "other" && !st.name) st.name = t("rt.r.otherGroup");
							setData({
								...r.data,
								stages
							});
						});
						return;
					}
					setBusy(false);
					setErr(null);
					setData(r.data);
				});
			};
			(0, react.useEffect)(load, [eng, props.refreshKey]);
			const copy = (text, label) => {
				copyWithFeedback(t, text, label, (ok, message) => {
					setMsg(ok ? { ok: message } : { err: message });
				});
			};
			const download = (text, label) => {
				try {
					const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = "report-" + String(label || "score").replace(/[^\w.-]/g, "_") + ".md";
					a.click();
					URL.revokeObjectURL(url);
					setMsg({ ok: t("rt.r.downloaded", { label }) });
				} catch (e) {
					setMsg({ err: t("rt.r.downloadFail", { msg: e instanceof Error ? e.message : String(e) }) });
				}
			};
			data !== null && data.items;
			const stages = data !== null && data.stages || [];
			const summary = data !== null ? data.summary : null;
			const mdText = data !== null && data.markdown || "";
			const card = (x) => h("div", {
				key: "r" + x.id,
				class: "dshp-rt-rep"
			}, h("div", { class: "dshp-rt-rep-head" }, h("span", { class: "dshp-rt-rep-idx" }, String(x.seq)), h("span", { class: "dshp-rt-rep-name" }, x.point_name), h("span", { class: "dshp-rt-flow-pts" }, "+" + x.points), x.nth_of_point > 1 ? h("span", { class: "dshp-rt-tag" }, t("rt.c.nth", { n: x.nth_of_point })) : null, h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				title: t("rt.r.jumpChainTitle"),
				onClick: () => {
					props.jump("chain", { hitId: x.id });
				}
			}, t("rt.r.jumpChain")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				onClick: () => {
					copy((x.requests ?? []).map((v) => v.request || "").filter(Boolean).join("\n\n"), t("rt.r.copyReqOf", { n: x.seq }));
				}
			}, t("rt.r.copyReq"))), h("div", { class: "dshp-rt-rep-meta" }, h("span", null, h("b", null, t("rt.f.hTarget") + " ")), h("span", { class: "dshp-rt-mono" }, x.target || x.asset_ip || "—")), x.gained ? h("div", { class: "dshp-rt-rep-meta" }, h("b", null, t("rt.f.hGained") + " "), h("span", null, x.gained)) : null, x.vuln ? h("div", { class: "dshp-rt-rep-meta" }, h("b", null, t("rt.c.usedVuln") + " "), h("span", null, [x.vuln.cve, x.vuln.title].filter(Boolean).join(" "))) : null, x.evidence ? h("div", { class: "dshp-rt-rep-meta" }, h("b", null, t("rt.c.resultShort") + " "), h("span", null, String(x.evidence).replace(/\n+/g, " "))) : null, x.recorded_at ? h("div", { class: "dshp-rt-rep-meta" }, h("b", null, t("rt.r.gotAt") + " "), h("span", null, fmt(x.recorded_at) + (x.recorded_by ? "（" + roleLabel(t, x.recorded_by) + "）" : ""))) : null, h(ShotStrip, {
				t,
				eng: eng ?? "",
				shots: x.shots,
				total: x.shot_total,
				title: t("rt.shot.title")
			}), h("details", {
				class: "dshp-rt-rep-trace",
				open: x.incomplete === true || (x.steps ?? []).length === 0
			}, h("summary", {
				class: "dshp-rt-rep-trace-head",
				style: { cursor: "pointer" }
			}, h("span", { class: "dshp-rt-rep-trace-title" }, t("rt.r.traceTitle")), (x.steps ?? []).length ? h("span", { class: "dshp-rt-tag" }, t("rt.r.nSteps", { n: (x.steps ?? []).length })) : null, (x.credentials ?? []).length ? h("span", { class: "dshp-rt-tag" }, t("rt.r.nCreds", { n: (x.credentials ?? []).length })) : null, (x.tunnels ?? []).length ? h("span", { class: "dshp-rt-tag" }, t("rt.r.nTunnels", { n: (x.tunnels ?? []).length })) : null, x.incomplete ? h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.r.incomplete")) : h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.r.reproducible"))), h("div", { style: { paddingTop: 6 } }, x.how ? h("div", { class: "dshp-rt-rep-trace-how" }, x.how) : null, (x.steps ?? []).length === 0 ? h("div", { class: "dshp-rt-rep-missing" }, t("rt.r.noSteps")) : x.steps.map((s, si) => h("div", {
				key: "s" + s.id,
				class: "dshp-rt-rep-step"
			}, h("div", { class: "dshp-rt-rep-step-head" }, h("span", { class: "dshp-rt-rep-step-no" }, String(si + 1)), h("span", { class: "dshp-rt-rep-step-title" }, s.title || t("rt.c.unnamedStep")), s.agent ? h("span", { class: "dshp-rt-tag" }, roleLabel(t, s.agent)) : null, s.stage_code ? h("span", { class: "dshp-rt-tag" }, s.stage_code) : null, s.inferred ? h("span", { class: "dshp-rt-tag" }, t("rt.r.inferred")) : null, h("div", { class: "dshp-rt-spacer" }), s.recorded_at ? h("span", { style: {
				fontSize: 11,
				color: "var(--dsw-alias-label-secondary)"
			} }, fmt(s.recorded_at)) : null), s.detail ? h("div", { class: "dshp-rt-rep-step-detail" }, s.detail) : null, h("div", { class: "dshp-rt-rep-step-cmd" }, h("b", null, t("rt.r.exec") + " "), s.tool ? h("span", { class: "dshp-rt-mono" }, s.tool) : h("span", { style: { color: "var(--dsw-alias-state-warn-primary, #f59e0b)" } }, t("rt.r.noTool"))), s.tool ? h("div", { style: { marginTop: 3 } }, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				onClick: () => {
					copy(String(s.tool), t("rt.r.stepCmdOf", { n: si + 1 }));
				}
			}, t("rt.r.copyCmd"))) : null, s.result ? h("div", { class: "dshp-rt-rep-step-result" }, h("b", null, t("rt.r.result") + " "), String(s.result).replace(/\n+/g, " ")) : null, s.evidence_ref ? h("div", { class: "dshp-rt-rep-step-result" }, h("b", null, t("rt.f.evidenceSummary") + " "), h("span", { class: "dshp-rt-mono" }, s.evidence_ref)) : null)), (x.credentials ?? []).length > 0 ? h("div", { class: "dshp-rt-rep-src" }, h("div", { class: "dshp-rt-rep-src-title" }, t("rt.r.credsSrc")), x.credentials.map((c) => h("div", {
				key: "c" + c.id,
				class: "dshp-rt-kv"
			}, h("b", {
				class: "dshp-rt-mono",
				style: { minWidth: 120 }
			}, c.host || "—"), h("span", null, t("rt.r.credLine", {
				user: c.username || t("rt.r.noUser"),
				type: c.secret_type || "password",
				priv: c.privilege ? t("rt.r.credPriv", { p: c.privilege }) : "",
				src: c.source || t("rt.r.unmarked"),
				tool: c.tool ? t("rt.r.credTool", { v: String(c.tool).replace(/\n+/g, " ").slice(0, 160) }) : ""
			}))))) : null, (x.tunnels ?? []).length > 0 ? h("div", { class: "dshp-rt-rep-src" }, h("div", { class: "dshp-rt-rep-src-title" }, t("rt.r.tunnelsUsed")), x.tunnels.map((tn) => h("div", {
				key: "t" + tn.id,
				class: "dshp-rt-kv"
			}, h("b", {
				class: "dshp-rt-mono",
				style: { minWidth: 120 }
			}, (tn.kind || "socks5") + " " + (tn.listen || "")), h("span", null, t("rt.r.tunnelLine", {
				entry: tn.entry || t("rt.r.unregistered"),
				reach: tn.reach ? t("rt.r.tunnelReach", { v: tn.reach }) : "",
				side: tn.entry_kind || t("rt.r.undeclared"),
				legit: tn.legit === false ? t("rt.r.notBoundary") : "",
				status: tn.status ? " · " + tn.status : "",
				cmd: tn.command ? t("rt.r.tunnelCmd", { v: String(tn.command).replace(/\n+/g, " ").slice(0, 160) }) : ""
			}))))) : null, (x.webshells ?? []).length > 0 ? h("div", { class: "dshp-rt-rep-src" }, h("div", { class: "dshp-rt-rep-src-title" }, t("rt.r.shellsUsed")), x.webshells.map((w) => h("div", {
				key: "w" + w.id,
				class: "dshp-rt-kv"
			}, h("b", {
				class: "dshp-rt-mono",
				style: { minWidth: 120 }
			}, w.shell_type || "shell"), h("span", null, (w.url || "") + (w.pass_key ? t("rt.r.shellPass", { v: w.pass_key }) : "") + (w.privilege ? t("rt.r.credPriv", { p: w.privilege }) : "") + (w.status ? " · " + w.status : ""))))) : null, (x.gaps ?? []).length > 0 ? h("div", { class: "dshp-rt-rep-missing" }, t("rt.r.gaps") + x.gaps.join("；")) : null), (x.requests ?? []).length === 0 ? h("div", { class: "dshp-rt-rep-missing" }, t("rt.r.noRequest")) : x.requests.map((r, ri) => h("div", {
				key: "q" + ri,
				class: "dshp-rt-rep-req"
			}, h("div", { class: "dshp-rt-rep-req-head" }, h("span", null, t("rt.r.requestN", { n: ri + 1 }) + (r.source === "auto" ? t("rt.r.requestAuto") : "")), h("span", { class: "dshp-rt-tag" }, (r.method || "GET") + " " + (r.status === null || r.status === void 0 ? "" : r.status)), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				onClick: () => {
					copy(String(r.request || ""), t("rt.r.requestOf", { n: ri + 1 }));
				}
			}, t("rt.r.copyYakit"))), h("pre", { class: "dshp-rt-rep-http" }, r.request || (r.method || "GET") + " " + (r.url || "") + " HTTP/1.1"), r.response ? h("div", null, h("div", { class: "dshp-rt-rep-req-head" }, h("span", null, t("rt.r.respSummary"))), h("pre", {
				class: "dshp-rt-rep-http",
				style: { maxHeight: 160 }
			}, String(r.response).slice(0, 1600))) : null))), x.note ? h("div", { class: "dshp-rt-rep-meta" }, h("b", null, t("rt.r.note") + " "), h("span", null, x.note)) : null);
			return h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.tab.report")), summary !== null ? h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.r.totalN", { n: summary.points })) : null, summary !== null ? h("span", { class: "dshp-rt-tag" }, t("rt.r.countN", { n: summary.count })) : null, summary !== null ? h("span", { class: "dshp-rt-tag" + (summary.missingRequests ? "" : " dshp-rt-tag-live") }, t("rt.r.withRequests", {
				n: summary.withRequests,
				m: summary.count
			})) : null, summary !== null ? h("span", {
				class: "dshp-rt-tag" + (summary.incomplete ? " dshp-rt-tag-warn" : " dshp-rt-tag-live"),
				title: t("rt.r.reproTitle")
			}, t("rt.r.reproN", {
				n: summary.count - (summary.incomplete || 0),
				m: summary.count
			})) : null, summary !== null && summary.serviceCappedExcluded ? h("span", {
				class: "dshp-rt-tag dshp-rt-tag-warn",
				title: (summary.serviceCapped ?? []).map((x) => (x.service || "") + "｜" + (x.point_name || "")).join("\n") || t("rt.r.serviceCappedTip")
			}, t("rt.r.serviceCappedN", { n: summary.serviceCappedExcluded })) : null, h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy || mdText === "",
				onClick: () => {
					copy(mdText, t("rt.r.wholeReport"));
				}
			}, t("rt.r.copyAll")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy || mdText === "",
				onClick: () => {
					download(mdText, data !== null && data.target || String(eng));
				}
			}, t("rt.r.downloadMd")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: load
			}, busy ? t("rt.r.generating") : t("rt.r.regenerate"))), msg !== null ? h("div", { class: msg.err !== void 0 ? "dshp-rt-err" : "dshp-rt-foot" }, msg.err || msg.ok) : null, err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, h("div", {
				class: "dshp-rt-body",
				style: { overflow: "auto" }
			}, stages.length > 0 ? h("div", { class: "dshp-rt-rep-list" }, h("div", { class: "dshp-rt-rep-tools" }, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					collapse.setAll(stages.map((s) => "st:" + s.code), true);
				}
			}, t("rt.f.expandAll")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					collapse.setAll(stages.map((s) => "st:" + s.code), false);
				}
			}, t("rt.f.collapseAll"))), stages.map((st) => {
				const open = collapse.isOpen("st:" + st.code, true);
				const toggle = collapse.toggle("st:" + st.code, true);
				return h("div", {
					key: "g" + st.code,
					class: "dshp-rt-rep-group"
				}, h("div", {
					class: "dshp-rt-rep-stage",
					role: "button",
					tabIndex: 0,
					style: { borderLeftColor: st.color },
					"aria-expanded": open ? "true" : "false",
					onClick: toggle,
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							toggle(e);
						}
					}
				}, h("span", { class: "dshp-rt-sec-caret" }, open ? "▾" : "▸"), h("span", {
					class: "dshp-rt-rep-no",
					style: { background: st.color }
				}, CIRCLED[st.ordinal - 1] || st.ordinal), h("span", { class: "dshp-rt-rep-stage-name" }, st.name), h("span", { class: "dshp-rt-rep-stage-n" }, t("rt.r.nItems", { n: (st.items ?? []).length })), h("div", { class: "dshp-rt-spacer" }), h("span", {
					class: "dshp-rt-rep-pts",
					style: {
						background: st.color + "22",
						color: st.color,
						borderColor: st.color + "66"
					}
				}, "+" + st.points), h("span", { class: "dshp-rt-ap-cum" }, t("rt.c.cumulative", { n: st.cumulative }))), open ? h("div", { class: "dshp-rt-rep-body" }, st.items.map(card)) : null);
			})) : data === null ? h("div", { class: "dshp-rt-empty" }, t("rt.loading")) : h("div", { class: "dshp-rt-empty" }, h("div", null, t("rt.r.empty")), h("div", { style: {
				marginTop: 6,
				fontSize: 12
			} }, t("rt.r.emptyHint")))), h("div", { class: "dshp-rt-foot" }, h("span", null, t("rt.r.footNote"))));
		}
		// client/redteam/ScoresTab.tsx
		/**
		* 得分目标页签：按 8 个类别分组、命中/上限/封顶展示、新增/编辑/停用/删除。
		* 自旧 client.js ScoreTab 迁移；新增深链消费：jump('scores', { pointId }) 直接展开该得分点的命中列表。
		*/
		function ScoresTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [data, setData] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [openId, setOpenId] = (0, react.useState)(null);
			const [form, setForm] = (0, react.useState)(null);
			const [msg, setMsg] = (0, react.useState)(null);
			const load = () => {
				if (eng === null || eng === "") return;
				setBusy(true);
				rtOp("scores", { engagement: eng }).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setData(r.data);
				});
			};
			(0, react.useEffect)(load, [eng, props.refreshKey]);
			(0, react.useEffect)(() => {
				const p = props.params;
				if (p === null || p === void 0 || p.pointId === void 0) return;
				setOpenId(p.pointId);
			}, [props.params]);
			const startEdit = (p) => {
				setForm({
					id: p.id,
					name: p.name,
					category: p.category || "",
					points: p.points,
					description: p.description || "",
					enabled: p.enabled,
					builtin: p.builtin === true,
					src: p.src,
					cap: p.cap,
					rule: p.rule
				});
			};
			const startNew = () => {
				setForm({
					name: "",
					category: "",
					points: 10,
					description: "",
					enabled: true,
					builtin: false
				});
				setMsg(null);
			};
			const setField = (k, v) => {
				setForm((f) => f === null ? f : {
					...f,
					[k]: v
				});
			};
			const save = () => {
				if (form === null || form.name === "") {
					setMsg({ err: t("rt.s.nameRequired") });
					return;
				}
				setBusy(true);
				setMsg(null);
				rtOp("saveScorePoint", {
					engagement: eng,
					point: form
				}).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					if (r.data.overridden === false) setMsg({ err: t("rt.s.builtinLocked") });
					else setMsg({ ok: r.data.note || t("rt.saved") });
					setForm(null);
					load();
				});
			};
			const remove = () => {
				if (form === null || form.id === void 0) {
					setForm(null);
					return;
				}
				setBusy(true);
				setMsg(null);
				rtOp("deleteScorePoint", {
					engagement: eng,
					id: form.id
				}).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						return;
					}
					setMsg({ ok: t("rt.deleted") });
					setForm(null);
					setOpenId(null);
					load();
				});
			};
			const summary = data !== null && data.summary || {
				achievedPoints: 0,
				pointCount: 0,
				hitPointCount: 0,
				hitCount: 0,
				selfCreatedHits: 0,
				serviceCappedHits: 0,
				countedHits: 0
			};
			const items = data !== null && data.items || [];
			const groups = data !== null && Array.isArray(data.ruleGroups) && data.ruleGroups.length > 0 ? data.ruleGroups : [{
				key: "all",
				name: "",
				capSum: 0,
				points: 0,
				counted: 0,
				tiers: items
			}];
			const rows = [];
			for (const g of groups) {
				if (g.name) rows.push(h("div", {
					key: "g-" + g.key,
					class: "dshp-rt-score-group"
				}, h("span", null, g.name), h("span", { class: "dshp-rt-sg-sub" }, t("rt.s.groupItems", { n: (g.tiers ?? []).length }) + (g.capSum > 0 ? t("rt.s.groupCap", { n: g.capSum }) : "")), h("div", { class: "dshp-rt-spacer" }), g.points > 0 ? h("span", { class: "dshp-rt-tag dshp-rt-tag-active" }, "+" + g.points) : null));
				for (const p of g.tiers ?? []) {
					const achieved = (p.hits ?? []).length > 0;
					const open = openId === p.id;
					rows.push(h("div", {
						key: "sp" + p.id,
						class: "dshp-rt-score-row",
						role: "button",
						tabIndex: 0,
						onClick: () => {
							setOpenId(open ? null : p.id);
						},
						onKeyDown: (e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								setOpenId(open ? null : p.id);
							}
						}
					}, h("span", { class: "dshp-rt-sec-caret" }, open ? "▾" : "▸"), h("span", null, h("span", {
						class: achieved ? "dshp-rt-pri dshp-rt-pri-high" : "dshp-rt-pri dshp-rt-pri-low",
						style: achieved ? {} : {
							background: "var(--dsw-alias-bg-layer-2)",
							color: "var(--dsw-alias-label-secondary)"
						}
					}, t("rt.s.pointsN", { n: p.points }))), h("span", { title: p.description || "" }, p.name, p.tier ? h("span", { class: "dshp-rt-scope" }, "　" + p.tier) : null), h("span", { title: p.capped > 0 ? t("rt.s.cappedTip", {
						counted: p.counted,
						capped: p.capped,
						scope: p.scope_label || t("rt.s.scopeLabel")
					}) : p.scope_label || "" }, h("span", { class: "dshp-rt-sec-count" }, (p.hits ?? []).length > 0 ? t("rt.s.nHits", { n: p.counted }) : t("rt.s.noHit")), p.cap > 0 ? h("span", { class: "dshp-rt-scope" }, "　" + t("rt.s.cap", {
						used: p.cap_used === null ? 0 : p.cap_used,
						cap: p.cap
					})) : null), h("span", { style: { textAlign: "right" } }, p.earned > 0 ? h("span", { class: "dshp-rt-tag dshp-rt-tag-active" }, "+" + p.earned) : h("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, "—"))));
					if (!open) continue;
					const hitNodes = (p.hits ?? []).map((hh, hi) => h("div", {
						key: "h" + hh.id,
						class: "dshp-rt-hit-row" + (hh.self_created ? " self-created" : "") + (hh.capped ? " service-capped" : "")
					}, h("span", { class: "dshp-rt-hit-idx" }, String(hi + 1)), h("span", {
						class: "dshp-rt-hit-asset",
						title: hh.target || hh.asset_ip || ""
					}, hh.asset_ip || hh.target || t("rt.s.noAsset")), hh.self_created ? h("span", {
						class: "dshp-rt-tag dshp-rt-tag-warn",
						title: t("rt.s.selfCreatedTip")
					}, t("rt.s.selfCreated")) : null, hh.capped ? h("span", {
						class: "dshp-rt-tag dshp-rt-tag-warn",
						title: hh.capped_reason || t("rt.c.cappedDefault")
					}, t("rt.s.serviceCapped") + (hh.service ? "（" + hh.service + "）" : "")) : null, hh.shot_count ? h("span", {
						class: "dshp-rt-tag",
						title: t("rt.s.shotCountTip")
					}, t("rt.s.shotN", { n: hh.shot_count })) : null, h("span", { class: "dshp-rt-hit-time" }, fmt(hh.recorded_at)), h("button", {
						class: "dshp-rt-btn",
						type: "button",
						style: {
							padding: "0 5px",
							fontSize: 10.5
						},
						title: t("rt.copyThis"),
						onClick: (e) => {
							e.stopPropagation();
							copyText((hh.asset_ip || hh.target || "") + "  " + (hh.evidence || ""));
						}
					}, t("rt.copy")), hh.evidence ? h("span", {
						class: "dshp-rt-hit-txt",
						title: hh.evidence
					}, String(hh.evidence).replace(/\n+/g, " ")) : h("span", { class: "dshp-rt-hit-txt none" }, t("rt.s.noEvidence"))));
					rows.push(h("div", {
						key: "spd" + p.id,
						class: "dshp-rt-score-row",
						style: {
							cursor: "default",
							gridTemplateColumns: "1fr"
						}
					}, h("div", { class: "dshp-rt-score-detail" }, p.description ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.s.condition")), h("span", null, p.description)) : null, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.s.status")), h("span", null, t("rt.s.statusLine", {
						enabled: p.enabled ? t("rt.s.enabled") : t("rt.s.disabled"),
						pts: p.points,
						n: (p.hits ?? []).length,
						earned: p.earned,
						self: p.self_created ? t("rt.s.selfExtra", { n: p.self_created }) : "",
						capped: p.capped ? t("rt.s.cappedExtra", { n: p.capped }) : ""
					}))), p.capped ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.s.serviceCap")), h("span", null, (p.service_summary || "") + t("rt.s.serviceCapRule"))) : null, (p.hits ?? []).length > 0 ? h("div", null, h(ShotStrip, {
						t,
						eng: eng ?? "",
						shots: p.shots,
						total: p.shot_total,
						title: t("rt.s.shotsTitle", { n: p.shot_total || (p.shots ?? []).length })
					}), h("div", {
						class: "dshp-rt-section",
						style: { padding: "6px 0 0" }
					}, t("rt.s.hitRecords", { n: (p.hits ?? []).length })), h("div", { class: "dshp-rt-hits" }, hitNodes)) : h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.s.hitRecords")), h("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, t("rt.s.hitRecordsEmpty"))), h("div", { class: "dshp-rt-actions" }, h("button", {
						class: "dshp-rt-btn",
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							startEdit(p);
						}
					}, t("rt.edit"))))));
				}
			}
			return h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.tab.scores")), h("span", { style: {
				fontSize: 13,
				color: "var(--dsw-alias-label-secondary)",
				marginLeft: 4
			} }, t("rt.s.total")), h("span", { class: "dshp-rt-total" }, String(summary.achievedPoints)), h("span", { style: {
				fontSize: 13,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.s.ptsUnit")), h("span", { class: "dshp-rt-tag" }, t("rt.s.nPoints", { n: summary.pointCount })), h("span", { class: "dshp-rt-tag" }, t("rt.s.nHitCount", { n: summary.countedHits })), summary.selfCreatedHits ? h("span", {
				class: "dshp-rt-tag dshp-rt-tag-warn",
				title: t("rt.s.selfCreatedTip")
			}, t("rt.s.selfNotCounted", { n: summary.selfCreatedHits })) : null, summary.serviceCappedHits ? h("span", {
				class: "dshp-rt-tag dshp-rt-tag-warn",
				title: t("rt.s.serviceCappedTip")
			}, t("rt.s.serviceNotCounted", { n: summary.serviceCappedHits })) : null, h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: startNew
			}, t("rt.s.newPoint")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: load
			}, busy ? t("rt.refreshing") : t("rt.refresh"))), msg !== null ? h("div", { class: msg.err !== void 0 ? "dshp-rt-err" : "dshp-rt-foot" }, msg.err || msg.ok) : null, err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, form !== null ? h("div", {
				class: "dshp-rt-pane",
				style: {
					flex: "none",
					borderBottom: "1px solid var(--dsw-alias-border-l1)"
				}
			}, form.builtin === true ? h("div", {
				class: "dshp-rt-hint",
				style: { marginBottom: 8 }
			}, h("b", null, t("rt.s.builtinTitle")), h("div", { style: { marginTop: 3 } }, t("rt.s.builtinHint")), form.src !== null && form.src !== void 0 ? h("div", { style: {
				marginTop: 3,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.s.builtinSrc", {
				src: form.src,
				rule: form.rule || "",
				cap: form.cap > 0 ? t("rt.s.builtinCap", { n: form.cap }) : t("rt.s.builtinNoCap")
			})) : null) : null, h("div", { class: "dshp-rt-score-form" }, h("input", {
				class: "dshp-rt-input",
				placeholder: t("rt.s.fName"),
				value: form.name,
				readonly: form.builtin === true,
				title: form.builtin ? t("rt.s.builtinNameLocked") : "",
				onChange: (e) => {
					setField("name", e.target.value);
				}
			}), h("input", {
				class: "dshp-rt-input",
				placeholder: t("rt.s.fCategory"),
				value: form.category,
				readonly: form.builtin === true,
				title: form.builtin ? t("rt.s.builtinCatLocked") : "",
				onChange: (e) => {
					setField("category", e.target.value);
				}
			}), h("input", {
				class: "dshp-rt-input",
				type: "number",
				placeholder: t("rt.s.fPoints"),
				readonly: form.builtin === true,
				title: form.builtin ? t("rt.s.builtinPointsLocked") : t("rt.s.fPointsTip"),
				value: form.points,
				onChange: (e) => {
					setField("points", Number(e.target.value));
				}
			}), h("select", {
				class: "dshp-rt-input",
				value: form.enabled ? "1" : "0",
				onChange: (e) => {
					setField("enabled", e.target.value === "1");
				}
			}, h("option", { value: "1" }, t("rt.s.enabled")), h("option", { value: "0" }, t("rt.s.disabled")))), h("input", {
				class: "dshp-rt-input",
				style: {
					width: "100%",
					marginBottom: 6,
					boxSizing: "border-box"
				},
				placeholder: t("rt.s.fDesc"),
				value: form.description,
				readonly: form.builtin === true,
				title: form.builtin ? t("rt.s.builtinDescLocked") : "",
				onChange: (e) => {
					setField("description", e.target.value);
				}
			}), h("div", { class: "dshp-rt-actions" }, h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: busy,
				onClick: save
			}, t("rt.save")), form.id !== void 0 ? form.builtin ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: true,
				title: t("rt.s.builtinNoDelete")
			}, t("rt.s.deleteBuiltin")) : h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: remove
			}, t("rt.delete")) : null, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					setForm(null);
				}
			}, t("rt.cancel")))) : null, h("div", { class: "dshp-rt-table" }, h("div", { class: "dshp-rt-score-row head" }, h("span", null, ""), h("span", null, t("rt.s.hPoints")), h("span", null, t("rt.s.hName")), h("span", null, t("rt.s.hHits")), h("span", { style: { textAlign: "right" } }, t("rt.s.hEarned"))), rows, items.length === 0 ? h("div", { class: "dshp-rt-empty" }, t("rt.s.empty")) : null));
		}
		// client/redteam/SessionsTab.tsx
		/**
		* 会话与入口页签：WebShell / 内网隧道集中展示，带连通状态与一键实测。
		* 自旧 client.js SessionTab 迁移；新增深链：卡片所在资产 → jump('assets', { ip })。
		*/
		function SessionsTab(props) {
			const t = props.t;
			const eng = props.eng;
			const [data, setData] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [msg, setMsg] = (0, react.useState)(null);
			const [copied, setCopied] = (0, react.useState)(null);
			const load = () => {
				if (eng === null || eng === "") return;
				rtOp("sessions", { engagement: eng }).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setData(r.data);
				});
			};
			(0, react.useEffect)(load, [eng, props.refreshKey]);
			const probe = () => {
				setBusy(true);
				setMsg(null);
				rtOp("probeSessions", {
					engagement: eng,
					timeoutMs: 6e3
				}).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setMsg({ err: r.error });
						load();
						return;
					}
					const on = (r.data.webshells ?? []).filter((x) => x.status === "online").length;
					const act = (r.data.tunnels ?? []).filter((x) => x.status === "active").length;
					setMsg({ ok: t("rt.se.probeDone", {
						on,
						n1: (r.data.webshells ?? []).length,
						act,
						n2: (r.data.tunnels ?? []).length
					}) });
					load();
				});
			};
			const copy = (key, text) => {
				copyWithFeedback(t, text, text, (ok, message) => {
					if (!ok) {
						setMsg({ err: message });
						return;
					}
					setCopied(key);
					setTimeout(() => {
						setCopied((c) => c === key ? null : c);
					}, 1500);
				});
			};
			const markTunnel = (tn, status) => {
				setMsg(null);
				rtOp("updateTunnel", {
					engagement: eng,
					id: tn.id,
					patch: {
						status,
						check_note: t("rt.se.manualMark")
					}
				}).then(load);
			};
			const markShell = (w, status) => {
				setMsg(null);
				rtOp("updateWebshell", {
					engagement: eng,
					id: w.id,
					patch: {
						status,
						check_note: t("rt.se.manualMark")
					}
				}).then(load);
			};
			const sessCollapse = useCollapse("sessions:" + String(eng));
			const totals = data !== null && data.totals || {};
			const shells = data !== null && data.webshells || [];
			const tunnels = data !== null && data.tunnels || [];
			const statusDot = (s) => h("span", { class: s === "online" || s === "active" ? "dshp-rt-dot-on" : s === "unknown" || s === void 0 || s === "" ? "dshp-rt-dot-unk" : "dshp-rt-dot-off" });
			const fact = (label, value) => h("div", { class: "dshp-rt-sess-fact" }, h("b", null, label), h("span", null, value));
			const isEncryptedShell = (x) => /behinder|godzilla|冰蝎|哥斯拉/i.test(String(x || ""));
			const isSuo5 = (x) => /suo5/i.test(String(x || ""));
			const hint = (key, title, detail) => h("div", {
				key,
				class: "dshp-rt-hint"
			}, h("b", null, title), h("details", {
				class: "dshp-rt-sess-fold",
				style: { marginTop: 3 }
			}, h("summary", null, t("rt.se.howTo")), h("div", { style: { marginTop: 4 } }, detail)));
			const hints = [];
			const badShells = shells.filter((w) => !isEncryptedShell(w.shell_type));
			const legitTunnels = tunnels.filter((tn) => tn.legit === true);
			if (badShells.length > 0) hints.push(hint("h1", t("rt.se.hintShell", { n: badShells.length }), t("rt.se.hintShellHow")));
			if (tunnels.length > 0 && legitTunnels.length === 0) hints.push(hint("h3", t("rt.se.hintTunnel", { n: tunnels.length }), t("rt.se.hintTunnelHow")));
			const activeSuo5 = tunnels.filter((tn) => isSuo5(tn.kind) && tn.status === "active");
			if (shells.length > 0 && activeSuo5.length === 0) hints.push(hint("h2", t("rt.se.hintSuo5"), t("rt.se.hintSuo5How")));
			const assetJump = (ip) => ip === void 0 || ip === null || ip === "" ? null : h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				title: t("rt.f.jumpAssetTitle", { ip }),
				onClick: (e) => {
					e.stopPropagation();
					props.jump("assets", { ip });
				}
			}, t("rt.f.jumpAsset"));
			const shellCards = shells.map((w) => h("div", {
				key: "w" + w.id,
				class: "dshp-rt-sess"
			}, h("div", { class: "dshp-rt-sess-head" }, statusDot(w.status), h("span", { class: "dshp-rt-sess-title" }, w.url), h("span", { class: "dshp-rt-tag dshp-rt-tag-active" }, w.shell_type || "webshell"), isEncryptedShell(w.shell_type) ? null : h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.se.userCantConnect")), w.privilege ? h("span", { class: "dshp-rt-tag" }, w.privilege) : null, h("div", { class: "dshp-rt-spacer" }), assetJump(w.asset_ip), copied === "cmd" + w.id ? h("span", {
				class: "dshp-rt-tag",
				style: { color: "#10b981" }
			}, t("rt.copiedShort")) : h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				onClick: () => {
					copy("cmd" + w.id, "curl -s \"" + w.url + "\"");
				}
			}, t("rt.se.copyUrl")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				style: {
					padding: "0 6px",
					fontSize: 11
				},
				onClick: () => {
					markShell(w, "offline");
				}
			}, t("rt.se.markOffline"))), h("div", { class: "dshp-rt-sess-facts" }, fact(t("rt.se.kind"), isEncryptedShell(w.shell_type) ? t("rt.se.encryptedShell") : t("rt.se.plainShell")), w.pass_key ? fact(t("rt.se.passKey"), h("span", { class: "dshp-rt-mono" }, w.pass_key)) : null, w.asset_ip ? fact(t("rt.f.asset"), w.asset_ip) : null, w.privilege ? fact(t("rt.se.privilege"), w.privilege) : null, w.secret_ref ? fact(t("rt.se.credRef"), h("span", { class: "dshp-rt-mono" }, w.secret_ref)) : null, fact(t("rt.se.lastCheck"), (w.last_check ? fmt(w.last_check) : t("rt.se.unchecked")) + (w.latency_ms !== null && w.latency_ms !== void 0 ? "（" + w.latency_ms + "ms）" : "")), w.check_note ? fact(t("rt.se.checkNote"), w.check_note) : null, w.note ? fact(t("rt.se.note"), w.note) : null)));
			const tunnelCards = tunnels.map((tn) => {
				const proxy = tn.listen ? "socks5://" + tn.listen : "";
				const gogoCmd = tn.listen ? "./gogo -i <CIDR> -m ss --ping -p top2,win,db --proxy " + proxy : "";
				const fscanCmd = tn.listen ? "./fscan -h <CIDR> -np -nobr -nopoc -socks5 " + tn.listen + " -o intranet.txt" : "";
				return h("div", {
					key: "t" + tn.id,
					class: "dshp-rt-sess"
				}, h("div", { class: "dshp-rt-sess-head" }, statusDot(tn.status), h("span", { class: "dshp-rt-sess-title" }, tn.listen || t("rt.se.noListen")), h("span", { class: "dshp-rt-tag dshp-rt-tag-passive" }, tn.kind || "tunnel"), isSuo5(tn.kind) ? null : h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.se.notSuo5")), tn.legit === true ? h("span", {
					class: "dshp-rt-tag dshp-rt-tag-live",
					title: tn.entry_kind_label || ""
				}, t("rt.se.targetSide")) : tn.legit === false ? h("span", {
					class: "dshp-rt-tag dshp-rt-tag-warn",
					title: t("rt.se.selfOnlyTip")
				}, t("rt.se.notBreakthrough")) : h("span", {
					class: "dshp-rt-tag",
					title: t("rt.se.entryKindTip")
				}, t("rt.se.pendingConfirm")), tn.reach ? h("span", { class: "dshp-rt-tag" }, t("rt.se.reachN", { v: tn.reach })) : null, h("div", { class: "dshp-rt-spacer" }), assetJump(tn.asset_ip), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					style: {
						padding: "0 6px",
						fontSize: 11
					},
					onClick: () => {
						copy("sock" + tn.id, tn.listen || "");
					}
				}, copied === "sock" + tn.id ? t("rt.copiedShort") : t("rt.se.copyAddr")), tn.status === "active" ? h("button", {
					class: "dshp-rt-btn",
					type: "button",
					style: {
						padding: "0 6px",
						fontSize: 11
					},
					onClick: () => {
						markTunnel(tn, "down");
					}
				}, t("rt.se.markOffline")) : h("button", {
					class: "dshp-rt-btn",
					type: "button",
					style: {
						padding: "0 6px",
						fontSize: 11
					},
					onClick: () => {
						markTunnel(tn, "active");
					}
				}, t("rt.se.markActive"))), h("div", { class: "dshp-rt-sess-facts" }, fact(t("rt.se.targetEntry"), tn.entry || t("rt.r.unregistered")), fact(t("rt.se.crossBoundary"), tn.legit === true ? h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, tn.entry_kind_label || tn.entry_kind || t("rt.se.confirmedTargetSide")) : tn.legit === false ? h("span", { class: "dshp-rt-tag dshp-rt-tag-warn" }, t("rt.se.notBreakthroughFact")) : h("span", { class: "dshp-rt-tag" }, t("rt.se.entryKindPending"))), tn.reach ? fact(t("rt.se.reachSeg"), tn.reach) : null, tn.asset_ip ? fact(t("rt.f.asset"), tn.asset_ip) : null, fact(t("rt.se.lastCheck"), (tn.last_check ? fmt(tn.last_check) : t("rt.se.unchecked")) + (tn.latency_ms !== null && tn.latency_ms !== void 0 ? "（" + tn.latency_ms + "ms）" : "")), tn.check_note ? fact(t("rt.se.checkNote"), tn.check_note) : null, tn.note ? fact(t("rt.se.note"), tn.note) : null), tn.command ? h("details", { class: "dshp-rt-sess-fold" }, h("summary", null, t("rt.se.buildCmd")), h("div", {
					...clickable(() => {
						copy("c" + tn.id, tn.command);
					}, { label: t("rt.r.copyCmd") }),
					class: "dshp-rt-code",
					title: t("rt.copyThis")
				}, copied === "c" + tn.id ? t("rt.copiedShort") : tn.command)) : null, tn.status === "active" && tn.listen ? h("details", { class: "dshp-rt-sess-fold" }, h("summary", null, t("rt.se.scanVia")), h("div", { class: "dshp-rt-sess-cmd" }, h("div", {
					...clickable(() => {
						copy("g" + tn.id, gogoCmd);
					}, { label: t("rt.se.copyGogo") }),
					class: "dshp-rt-code",
					title: t("rt.copyThis")
				}, copied === "g" + tn.id ? t("rt.copiedShort") : gogoCmd), h("div", {
					...clickable(() => {
						copy("f" + tn.id, fscanCmd);
					}, { label: t("rt.se.copyFscan") }),
					class: "dshp-rt-code",
					style: {
						display: "block",
						marginTop: 3
					},
					title: t("rt.copyThis")
				}, copied === "f" + tn.id ? t("rt.copiedShort") : fscanCmd))) : null);
			});
			return h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, t("rt.tab.sessions")), h("span", { class: "dshp-rt-tag" }, t("rt.se.shellStat", {
				on: totals.webshellsOnline ?? 0,
				n: totals.webshells ?? 0
			})), h("span", { class: "dshp-rt-tag" }, t("rt.se.tunnelStat", {
				on: totals.tunnelsActive ?? 0,
				n: totals.tunnels ?? 0
			})), h("span", { class: "dshp-rt-tag" }, t("rt.se.credStat", { n: totals.credentials ?? 0 })), h("span", { class: "dshp-rt-tag" }, t("rt.se.accessStat", { n: totals.access ?? 0 })), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: busy,
				onClick: probe
			}, busy ? t("rt.se.probing") : t("rt.se.probe")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: load
			}, t("rt.refresh"))), msg !== null ? h("div", { class: msg.err !== void 0 ? "dshp-rt-err" : "dshp-rt-foot" }, msg.err || msg.ok) : null, err !== null ? h("div", { class: "dshp-rt-err" }, err) : null, h("div", {
				class: "dshp-rt-body",
				style: { overflow: "auto" }
			}, shells.length === 0 && tunnels.length === 0 ? h("div", { class: "dshp-rt-empty" }, h("div", null, t("rt.se.empty")), h("div", { style: {
				marginTop: 6,
				fontSize: 12
			} }, t("rt.se.emptyHow"))) : null, hints.length > 0 ? h("div", { style: { padding: "8px 10px 0" } }, hints) : null, h(Section, {
				tone: "queue",
				title: "WebShell",
				count: t("rt.se.shellOnline", {
					on: totals.webshellsOnline ?? 0,
					n: totals.webshells ?? 0
				}),
				sub: t("rt.se.shellSub"),
				open: sessCollapse.isOpen("shells", true),
				onToggle: sessCollapse.toggle("shells", true)
			}, shells.length > 0 ? h("div", {
				class: "dshp-rt-sess-grid",
				style: { padding: 0 }
			}, shellCards) : h("div", { class: "dshp-rt-atest-meta" }, t("rt.se.shellsEmpty"))), h(Section, {
				tone: "test",
				title: t("rt.se.tunnelsTitle"),
				count: t("rt.se.tunnelActive", {
					on: totals.tunnelsActive ?? 0,
					n: totals.tunnels ?? 0
				}),
				sub: t("rt.se.tunnelSub"),
				open: sessCollapse.isOpen("tunnels", true),
				onToggle: sessCollapse.toggle("tunnels", true)
			}, tunnels.length > 0 ? h("div", {
				class: "dshp-rt-sess-grid",
				style: { padding: 0 }
			}, tunnelCards) : h("div", { class: "dshp-rt-atest-meta" }, t("rt.se.tunnelsEmpty")))));
		}
		// client/redteam/SkillsTab.tsx
		/**
		* 技能库页签（DSH 原生）：目录 / 可用性徽章 / 只看过滤 / 正文详情。
		* 自旧 client.js SkillsTab 迁移。
		*/
		function SkillsTab(props) {
			const t = props.t;
			const [items, setItems] = (0, react.useState)([]);
			const [meta, setMeta] = (0, react.useState)({});
			const [err, setErr] = (0, react.useState)(null);
			const [q, setQ] = (0, react.useState)("");
			const [srcOnly, setSrcOnly] = (0, react.useState)(false);
			const [active, setActive] = (0, react.useState)(null);
			const [detail, setDetail] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [brokenOnly, setBrokenOnly] = (0, react.useState)(false);
			const load = (force) => {
				setBusy(true);
				rtOp("skillCatalog", { refresh: force === true }).then((r) => {
					setBusy(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setMeta(r.data);
					setItems(r.data.items ?? []);
				});
			};
			(0, react.useEffect)(() => {
				load(false);
			}, [props.refreshKey]);
			const open = (skill) => {
				const name = skill !== null ? skill.name : void 0;
				const key = (skill !== null && skill.library ? skill.library : "redteam") + ":" + String(name);
				if (active === key) {
					setActive(null);
					setDetail(null);
					return;
				}
				setActive(key);
				setDetail(null);
				rtOp("skillRead", {
					name,
					library: skill.library || "redteam"
				}).then((r) => {
					if (r.ok) setDetail(r.data);
					else setErr(r.error);
				});
			};
			const needle = q.trim().toLowerCase();
			let filtered = needle !== "" ? items.filter((s) => (s.name + " " + s.description + " " + (s.whenToUse ?? "")).toLowerCase().includes(needle)) : items;
			if (srcOnly) filtered = filtered.filter((s) => s.library !== "official" && s.fromPlugin === true);
			if (brokenOnly) filtered = filtered.filter((s) => s.library !== "official" && (s.availability === "broken" || s.availability === "unknown"));
			const dirs = (meta.byDir ?? []).filter((d) => d.n > 0).slice(0, 6);
			const availSummary = meta.availability !== void 0 ? meta.availability.summary : null;
			const needRestart = err !== null && err.includes("unknown op");
			const renderSkill = (s) => {
				const key = (s.library || "redteam") + ":" + s.name;
				return h("div", {
					...clickable(() => {
						open(s);
					}, {
						label: t("rt.sk.viewSkill", { name: s.name }),
						expanded: active === key
					}),
					key,
					class: "dshp-rt-item" + (active === key ? " on" : "")
				}, h("div", { class: "dshp-rt-item-name" }, s.name, s.modelInvocable === false ? h("span", {
					class: "dshp-rt-tag",
					style: { marginLeft: 6 }
				}, t("rt.sk.manualOnly")) : null, s.library === "official" ? h("span", {
					class: "dshp-rt-tag",
					style: { marginLeft: 6 },
					title: t("rt.sk.officialTip")
				}, t("rt.sk.official")) : h("span", {
					class: "dshp-rt-avail dshp-rt-avail-" + (s.availability || "unknown"),
					style: { marginLeft: 6 },
					title: s.availability === "available" ? t("rt.sk.availableTip") : (s.problems ?? []).join("\n") || t("rt.unknown")
				}, s.availability === "available" ? t("rt.sk.available") : s.availability === "broken" ? t("rt.sk.broken") : t("rt.unknown"))), h("div", { class: "dshp-rt-item-desc" }, s.description || t("rt.sk.noDesc")), h("div", { class: "dshp-rt-kb-sub" }, [
					s.source ? t("rt.sk.srcOf", { v: s.source }) : null,
					s.fromPlugin ? t("rt.sk.fromPlugin") : null,
					s.provider || null,
					s.dir || null
				].filter(Boolean).join(" · ")), (s.problems ?? []).length > 0 && s.availability !== "available" && s.library !== "official" ? h("div", {
					class: "dshp-rt-kb-sub",
					style: { color: "var(--dsw-alias-state-warn-primary, #f59e0b)" }
				}, "! " + String(s.problems[0]).slice(0, 60)) : null);
			};
			const redteamRows = filtered.filter((s) => s.library !== "official").map(renderSkill);
			const officialRows = filtered.filter((s) => s.library === "official").map(renderSkill);
			const listItems = [];
			if (redteamRows.length > 0) {
				listItems.push(h("div", {
					key: "head-redteam",
					class: "dshp-rt-kb-sub",
					style: {
						margin: "8px 0 4px",
						fontWeight: 600
					}
				}, t("rt.sk.redteamSkills")));
				listItems.push(...redteamRows);
			}
			if (officialRows.length > 0) {
				listItems.push(h("div", {
					key: "head-official",
					class: "dshp-rt-kb-sub",
					style: {
						margin: "8px 0 4px",
						fontWeight: 600
					}
				}, t("rt.sk.officialSkills")));
				listItems.push(...officialRows);
			}
			return h("div", { class: "dshp-rt-split" }, h("div", { class: "dshp-rt-list" }, h("input", {
				class: "dshp-rt-input",
				style: {
					width: "100%",
					marginBottom: 8,
					boxSizing: "border-box"
				},
				placeholder: t("rt.sk.filterPh"),
				value: q,
				onChange: (e) => {
					setQ(e.target.value);
				}
			}), h("label", {
				class: "dshp-rt-kb-check",
				style: {
					display: "flex",
					margin: "0 0 6px"
				}
			}, h("input", {
				type: "checkbox",
				checked: srcOnly,
				onChange: (e) => {
					setSrcOnly(e.target.checked);
				}
			}), t("rt.sk.pluginOnly", { n: meta.fromPlugin ?? 0 })), availSummary !== null && (availSummary.broken > 0 || availSummary.unknown > 0) ? h("label", {
				class: "dshp-rt-kb-check",
				style: {
					display: "flex",
					margin: "0 0 8px"
				},
				title: t("rt.sk.brokenOnlyTip")
			}, h("input", {
				type: "checkbox",
				checked: brokenOnly,
				onChange: (e) => {
					setBrokenOnly(e.target.checked);
				}
			}), t("rt.sk.brokenOnly", { n: (availSummary.broken ?? 0) + (availSummary.unknown ?? 0) })) : null, availSummary !== null ? h("div", { style: {
				display: "flex",
				gap: 4,
				flexWrap: "wrap",
				marginBottom: 6
			} }, h("span", { class: "dshp-rt-avail dshp-rt-avail-available" }, t("rt.sk.availableN", { n: availSummary.available ?? 0 })), availSummary.broken > 0 ? h("span", { class: "dshp-rt-avail dshp-rt-avail-broken" }, t("rt.sk.brokenN", { n: availSummary.broken })) : null, availSummary.unknown > 0 ? h("span", { class: "dshp-rt-avail dshp-rt-avail-unknown" }, t("rt.sk.unknownN", { n: availSummary.unknown })) : null, h("span", {
				...clickable(() => {
					load(true);
				}, { label: t("rt.sk.recheck") }),
				class: "dshp-rt-tag",
				style: { cursor: "pointer" },
				title: t("rt.sk.recheckTip")
			}, t("rt.sk.recheck"))) : null, h("div", { style: {
				fontSize: 11,
				color: "var(--dsw-alias-label-secondary)",
				marginBottom: 6
			} }, t("rt.sk.libsStat", {
				rt: (meta.libraries ?? {}).redteam ?? 0,
				of: (meta.libraries ?? {}).official ?? 0
			}), items.length > 100 ? h("div", { style: { marginTop: 3 } }, t("rt.sk.manyNote", { n: meta.fromPlugin ?? 0 })) : null), listItems), h("div", { class: "dshp-rt-main" }, h("div", { class: "dshp-rt-toolbar" }, h("span", { style: { fontWeight: 600 } }, detail !== null ? detail.name : t("rt.sk.catalogTitle")), h("div", { class: "dshp-rt-spacer" }), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				disabled: busy,
				onClick: () => {
					load(true);
				}
			}, busy ? t("rt.refreshing") : t("rt.refresh"))), err !== null ? needRestart ? h("div", { class: "dshp-rt-empty" }, t("rt.needRestart")) : h("div", { class: "dshp-rt-err" }, err) : null, detail !== null ? h("div", { class: "dshp-rt-pane" }, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.k.desc")), h("span", null, detail.description || "—")), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.sk.whenToUse")), h("span", null, detail.whenToUse || "—")), h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.a.dSource")), h("span", null, (detail.provider || "—") + " / " + (detail.source || "—"))), (() => {
				const s2 = items.find((x) => (x.library || "redteam") + ":" + x.name === active);
				if (s2 === void 0) return null;
				if (s2.library === "official") return h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.sk.kindLabel")), h("span", null, t("rt.sk.officialKind")));
				const avail = s2.availability || "unknown";
				return h("div", null, h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.sk.availability")), h("span", { class: "dshp-rt-avail dshp-rt-avail-" + avail }, avail === "available" ? t("rt.sk.available") : avail === "broken" ? t("rt.sk.brokenDetail") : t("rt.sk.unknownDetail"))), (s2.problems ?? []).length > 0 ? h("div", { class: "dshp-rt-kv" }, h("b", null, avail === "available" ? t("rt.sk.missingTools") : t("rt.sk.gaps")), h("span", null, s2.problems.map((x, i) => h("div", { key: "p" + i }, "· " + x)))) : null, (s2.needs_user ?? []).length > 0 ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.sk.needsUser")), h("span", { style: { color: "var(--dsw-alias-state-warn-primary, #f59e0b)" } }, s2.needs_user.map((x, i) => h("div", { key: "n" + i }, "· " + x)))) : null);
			})(), detail.path ? h("div", { class: "dshp-rt-kv" }, h("b", null, t("rt.k.path")), h("span", {
				class: "dshp-rt-mono",
				style: { wordBreak: "break-all" }
			}, detail.path)) : null, h("pre", {
				class: "dshp-rt-md",
				style: {
					border: "1px solid var(--dsw-alias-border-l1)",
					borderRadius: 6,
					maxHeight: "52vh"
				}
			}, detail.content || t("rt.empty"))) : h("div", { class: "dshp-rt-pane" }, h("div", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-label-secondary)",
				marginBottom: 8
			} }, meta.note || t("rt.sk.noteDefault")), availSummary !== null ? h("div", { style: {
				fontSize: 12,
				marginBottom: 8,
				display: "flex",
				gap: 6,
				flexWrap: "wrap",
				alignItems: "center"
			} }, h("span", { class: "dshp-rt-avail dshp-rt-avail-available" }, t("rt.sk.availableN", { n: availSummary.available ?? 0 })), availSummary.broken > 0 ? h("span", { class: "dshp-rt-avail dshp-rt-avail-broken" }, t("rt.sk.brokenN", { n: availSummary.broken })) : null, availSummary.unknown > 0 ? h("span", { class: "dshp-rt-avail dshp-rt-avail-unknown" }, t("rt.sk.unknownN", { n: availSummary.unknown })) : null, h("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, t("rt.sk.checkedAt", {
				when: meta.availability.cached ? t("rt.sk.cachedAt") : t("rt.sk.checkedAtLabel"),
				time: meta.availability.checked_at ? fmt(meta.availability.checked_at) : "—"
			}))) : null, meta.availability !== void 0 && (meta.availability.broken ?? []).length > 0 ? h("div", { class: "dshp-rt-hint" }, h("div", { style: {
				fontWeight: 600,
				marginBottom: 4
			} }, t("rt.sk.brokenListTitle")), (meta.availability.broken ?? []).slice(0, 12).map((b) => h("div", { key: b.name }, "· " + b.name + (b.problems !== void 0 && b.problems.length > 0 ? " — " + b.problems[0] : "")))) : null, dirs.map((d) => h("div", {
				key: d.key,
				class: "dshp-rt-mono",
				style: {
					fontSize: 11,
					marginBottom: 2,
					overflowWrap: "anywhere"
				}
			}, t("rt.sk.dirN", {
				n: d.n,
				path: d.key
			}))), (meta.byDir ?? []).length > 6 ? h("div", { style: {
				fontSize: 11,
				color: "var(--dsw-alias-label-secondary)"
			} }, t("rt.sk.moreDirs", {
				n: (meta.byDir ?? []).length - 6,
				m: items.length
			})) : null, h("div", { class: "dshp-rt-empty" }, t("rt.sk.pickLeft")))));
		}
		// client/redteam/RedteamTab.tsx
		/**
		* 红队演练台根组件（sidebar.right.pane.tab / main 面板共用，key: dsh-purge-redteam）。
		*
		* 结构：项目头（当前项目 / 状态 / 范围 / 本会话绑定）+ 靶标选择 + SSE 角标 +
		* 分组子页签（项目组：项目中心 / 总览 / 资产测绘 / 智能体 / 会话隧道 / 漏洞战果 /
		* 攻击链 / 得分目标 / 报告；全局组：知识库 / 技能库 / 环境适配）+
		* 分页签错误边界 + 底部统计。
		*
		* 业务模型：一个项目（engagement）= 一个靶标工作区，各自的 SQLite 库；
		* 会话通过 session-bindings.json 绑到项目。项目中心是"有哪些项目"的入口，
		* 其余项目页签都在"当前项目"的上下文里取值。
		*/
		/** 项目组页签（都带当前项目上下文）。 */
		const PROJECT_TABS$1 = [
			"projects",
			"overview",
			"assets",
			"agents",
			"sessions",
			"findings",
			"chain",
			"scores",
			"report"
		];
		/** 全局组页签（跨项目共享）。 */
		const GLOBAL_TABS$1 = [
			"knowledge",
			"skills",
			"env"
		];
		const TAB_KEYS$1 = [...PROJECT_TABS$1, ...GLOBAL_TABS$1];
		function RedteamTab(props) {
			const t = props.t;
			const [tab, setTab] = (0, react.useState)(() => TAB_KEYS$1.includes(String(props.initialTab)) ? props.initialTab : "overview");
			const [params, setParams] = (0, react.useState)(null);
			const [engagements, setEngagements] = (0, react.useState)([]);
			const [eng, setEng] = (0, react.useState)(() => typeof props.initialEngagement === "string" && props.initialEngagement !== "" ? props.initialEngagement : null);
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [newName, setNewName] = (0, react.useState)("");
			const [creating, setCreating] = (0, react.useState)(false);
			const [refreshKey, setRefreshKey] = (0, react.useState)(0);
			const noticesRef = (0, react.useRef)(props.notices);
			noticesRef.current = props.notices;
			const tRef = (0, react.useRef)(t);
			tRef.current = t;
			const [live] = (0, react.useState)(() => createLive((kind) => {
				if (kind === "score") noticesRef.current.report(tRef.current("rt.toast.score"), "success");
				if (kind === "__poll") return;
				setRefreshKey((k) => k + 1);
			}));
			const liveSnap = (0, react.useSyncExternalStore)(live.subscribe, live.hooks.snapshot);
			(0, react.useEffect)(() => {
				live.start(eng);
				return () => {
					live.stop();
				};
			}, [eng, live]);
			const binding = useSessionBinding(props.sessionId, t, props.notices, () => {
				setRefreshKey((k) => k + 1);
			});
			/** 本会话绑定的项目 id（无会话上下文时为 null）。 */
			const boundEng = binding.bound;
			const reloadBindings = binding.reload;
			(0, react.useEffect)(() => {
				reloadBindings();
			}, [reloadBindings, refreshKey]);
			const loadSnapshot = (0, react.useCallback)((id) => {
				if (id === null || id === "") {
					setSnapshot(null);
					return;
				}
				rtOp("snapshot", { engagement: id }).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setSnapshot(r.data);
				});
			}, []);
			const refreshList = (0, react.useCallback)((selectId) => {
				rtOp("bootstrap").then((b) => {
					setEngagements(b.ok ? b.data.engagements ?? [] : []);
					if (selectId !== void 0) {
						setEng(selectId);
						loadSnapshot(selectId);
					}
				});
			}, [loadSnapshot]);
			(0, react.useEffect)(() => {
				rtOp("bootstrap").then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setEngagements(r.data.engagements ?? []);
					const id = r.data.current ?? ((r.data.engagements ?? [])[0] ?? {}).id ?? null;
					if (id !== null && id !== void 0) {
						setEng(id);
						loadSnapshot(id);
					} else setTab("projects");
				});
			}, [loadSnapshot]);
			/** 切换当前项目（下拉）。 */
			const pick = (id) => {
				setEng(id);
				loadSnapshot(id);
				rtOp("activateEngagement", { engagement: id });
				setRefreshKey((k) => k + 1);
			};
			const bindHere = (id, name) => {
				binding.bind(id, name);
			};
			const unbindHere = () => {
				binding.unbind();
			};
			/** 项目中心"进入工作台"：切当前 + 回到总览。 */
			const openProject = (id, name) => {
				setEng(id);
				loadSnapshot(id);
				setTab("overview");
				setParams(null);
				rtOp("activateEngagement", { engagement: id });
				if (props.sessionId !== void 0 && props.sessionId !== "") bindHere(id, name);
				setRefreshKey((k) => k + 1);
			};
			const openEngagement = () => {
				const name = String(newName).trim();
				if (name === "") return;
				setCreating(true);
				rtOp("openEngagement", { name }).then((r) => {
					setCreating(false);
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setNewName("");
					refreshList(r.data.engagement !== void 0 && r.data.engagement !== null ? r.data.engagement.id : void 0);
				});
			};
			/** 刷新：重拉名册/快照/绑定，并让当前子页签重新取数。 */
			const refreshAll = (0, react.useCallback)(() => {
				setRefreshKey((k) => k + 1);
				rtOp("bootstrap").then((b) => {
					if (b.ok) setEngagements(b.data.engagements ?? []);
					if (eng !== null) loadSnapshot(eng);
				});
				binding.reload();
			}, [
				eng,
				loadSnapshot,
				binding
			]);
			const tabProps = {
				t,
				eng,
				refreshKey,
				jump: (0, react.useCallback)((nextTab, nextParams) => {
					if (TAB_KEYS$1.includes(nextTab)) setTab(nextTab);
					setParams(nextParams ?? null);
					setRefreshKey((k) => k + 1);
				}, []),
				notices: props.notices,
				params
			};
			let body;
			if (err !== null) body = h("div", { class: "dshp-rt-err" }, err);
			else if (tab === "projects") body = h(ProjectsTab, {
				...tabProps,
				onEnter: async (id) => {
					const ok = props.enterDrill === void 0 ? false : await props.enterDrill(id);
					if (!ok) props.notices.report(t("main.sessionUnavailable"), "failure");
					return ok;
				},
				onNewSession: async (id) => {
					const ok = props.newDrillSession === void 0 ? false : await props.newDrillSession(id);
					if (!ok) props.notices.report(t("main.sessionUnavailable"), "failure");
					return ok;
				},
				onDelete: async (id, workspaceId) => {
					const ok = props.deleteProject === void 0 ? false : await props.deleteProject(id, workspaceId);
					if (!ok) props.notices.report(t("rt.pj.updateFailed"), "failure");
					return ok;
				},
				onOpen: openProject,
				onSetCurrent: (id) => {
					setEng(id);
					loadSnapshot(id);
					setRefreshKey((k) => k + 1);
				},
				onChanged: () => {
					refreshAll();
				}
			});
			else if (tab === "knowledge") body = h(KnowledgeTab, tabProps);
			else if (tab === "env") body = h(EnvTab, tabProps);
			else if (tab === "skills") body = h(SkillsTab, tabProps);
			else if (tab === "agents") body = h(AgentsTab, tabProps);
			else if (eng === null) body = h("div", { class: "dshp-rt-pane" }, h("div", { class: "dshp-rt-card" }, h("h4", null, t("rt.noEngTitle")), h("div", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-label-secondary)",
				marginBottom: 8
			} }, t("rt.noEngHint")), h("div", { style: {
				display: "flex",
				gap: 8
			} }, h("input", {
				class: "dshp-rt-input",
				style: { flex: 1 },
				placeholder: t("rt.noEngPh"),
				value: newName,
				onChange: (e) => {
					setNewName(e.target.value);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") openEngagement();
				}
			}), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				disabled: creating,
				onClick: openEngagement
			}, creating ? t("rt.creating") : t("rt.create")))), h("div", { class: "dshp-rt-empty" }, t("rt.noEngGlobalHint")));
			else if (tab === "overview") body = h(OverviewTab, tabProps);
			else if (tab === "assets") body = h(AssetsTab, {
				...tabProps,
				snapshot,
				onRefresh: refreshAll,
				onData: () => {
					loadSnapshot(eng);
				}
			});
			else if (tab === "sessions") body = h(SessionsTab, tabProps);
			else if (tab === "findings") body = h(FindingsTab, tabProps);
			else if (tab === "chain") body = h(ChainTab, tabProps);
			else if (tab === "report") body = h(ReportTab, tabProps);
			else if (tab === "scores") body = h(ScoresTab, tabProps);
			else body = h("div", { class: "dshp-rt-empty" }, t("rt.unknownTab"));
			const stats = snapshot !== null && snapshot.stats || {};
			const meta = snapshot !== null && snapshot.engagement || {};
			const isLive = liveSnap.status === "live";
			const canBind = props.sessionId !== void 0 && props.sessionId !== "";
			const isBoundHere = boundEng !== null && boundEng === eng;
			return h("div", { class: "dshp-rt-root" }, tab === "projects" ? null : h("div", { class: "dshp-rt-projhead" }, h("button", {
				class: "dshp-rt-btn dshp-rt-btn-ghost",
				type: "button",
				title: t("rt.head.backToProjects"),
				onClick: () => {
					setTab("projects");
					setParams(null);
					setRefreshKey((k) => k + 1);
				}
			}, "‹ " + t("rt.head.backToProjects")), h("span", { class: "dshp-rt-projname" }, meta.name ? String(meta.name) : t("rt.head.noProject")), meta.status === "archived" || meta.status === "closed" ? h("span", { class: "dshp-rt-tag" }, t("rt.pj." + (meta.status === "closed" ? "closed" : "archived"))) : null, meta.created_at ? h("span", { class: "dshp-rt-projmeta" }, t("rt.head.created") + " " + fmt(meta.created_at)) : null, (meta.scope ?? []).slice(0, 3).map((cidr, i) => h("span", {
				key: "sc" + i,
				class: "dshp-rt-tag dshp-rt-mono"
			}, cidr)), h("div", { class: "dshp-rt-spacer" }), eng !== null && props.enterDrill !== void 0 ? h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				title: t("main.enterHint"),
				onClick: () => {
					props.enterDrill?.(eng).then((ok) => {
						if (!ok) props.notices.report(t("main.sessionUnavailable"), "failure");
					});
				}
			}, t("main.enter")) : null, eng !== null && props.newDrillSession !== void 0 ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("main.newSessionHint"),
				onClick: () => {
					props.newDrillSession?.(eng).then((ok) => {
						if (!ok) props.notices.report(t("main.sessionUnavailable"), "failure");
					});
				}
			}, t("main.newSession")) : null, canBind ? isBoundHere ? h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, t("rt.head.boundHere"), h("button", {
				class: "dshp-rt-linkbtn",
				type: "button",
				title: t("rt.head.unbind"),
				onClick: unbindHere
			}, "×")) : eng !== null ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("rt.head.bindHint"),
				onClick: () => {
					bindHere(eng, meta.name ? String(meta.name) : void 0);
				}
			}, t("rt.head.bindHere")) : null : h("span", { class: "dshp-rt-projmeta" }, t("rt.head.noSession"))), h("div", { class: "dshp-rt-head" }, h("select", {
				class: "dshp-rt-input",
				style: {
					maxWidth: 190,
					flex: "1 1 150px"
				},
				value: eng ?? "",
				onChange: (e) => {
					pick(e.target.value);
				}
			}, h("option", {
				value: "",
				disabled: true
			}, engagements.length > 0 ? t("rt.pickEng") : t("rt.noEngYet")), engagements.map((x) => h("option", {
				key: x.id,
				value: x.id
			}, x.name || x.id || t("rt.unnamed")))), h("span", {
				class: "dshp-rt-livebadge" + (isLive ? " is-live" : ""),
				title: isLive ? t("rt.live.liveTip") : t("rt.live.pollingTip")
			}, h("b", null), isLive ? t("rt.live.live") : t("rt.live.polling")), h("div", { class: "dshp-rt-spacer" }), h(VersionBadge, {
				t,
				onOpenSettings: props.openSettings
			}), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("rt.refreshAllTitle"),
				onClick: refreshAll
			}, t("rt.refresh"))), h("div", {
				class: "dshp-rt-tabs",
				role: "tablist"
			}, PROJECT_TABS$1.map((k) => h("div", {
				key: k,
				class: "dshp-rt-tab" + (tab === k ? " on" : ""),
				role: "tab",
				tabIndex: 0,
				"aria-selected": tab === k ? "true" : "false",
				onClick: () => {
					setTab(k);
					setParams(null);
					setRefreshKey((n) => n + 1);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setTab(k);
						setParams(null);
						setRefreshKey((n) => n + 1);
					}
				}
			}, t("rt.tab." + k))), h("span", {
				class: "dshp-rt-tabsep",
				title: t("rt.group.globalHint")
			}, t("rt.group.global")), GLOBAL_TABS$1.map((k) => h("div", {
				key: k,
				class: "dshp-rt-tab dshp-rt-tab-global" + (tab === k ? " on" : ""),
				role: "tab",
				tabIndex: 0,
				"aria-selected": tab === k ? "true" : "false",
				onClick: () => {
					setTab(k);
					setParams(null);
					setRefreshKey((n) => n + 1);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setTab(k);
						setParams(null);
						setRefreshKey((n) => n + 1);
					}
				}
			}, t("rt.tab." + k)))), h("div", {
				class: "dshp-rt-body",
				key: "body-" + tab
			}, h(RtBoundary, {
				key: tab,
				t,
				onBack: () => {
					setTab("projects");
					setRefreshKey((n) => n + 1);
				}
			}, body)), h("div", { class: "dshp-rt-foot" }, h("span", null, t("rt.foot.segments", { n: stats.segments ?? 0 })), h("span", null, t("rt.foot.assets", {
				n: stats.assets ?? 0,
				live: stats.liveAssets ?? 0
			})), h("span", null, t("rt.foot.ports", { n: stats.openPorts ?? 0 })), h("span", null, t("rt.foot.fingerprints", { n: stats.fingerprints ?? 0 })), h("span", null, t("rt.foot.vulns", { n: stats.vulns ?? 0 })), h("span", null, t("rt.foot.signals", {
				p: stats.passiveSignals ?? 0,
				a: stats.activeSignals ?? 0
			})), h("div", { class: "dshp-rt-spacer" }), h("span", null, "SQLite · " + (meta.name ? String(meta.name) : ""))));
		}
		var RtBoundary = class extends react.Component {
			constructor(props) {
				super(props);
				this.state = { error: null };
			}
			static getDerivedStateFromError(error) {
				return { error };
			}
			componentDidCatch(error) {
				try {
					console.error("[dsh-purge redteam] tab render error:", error);
				} catch {}
			}
			render() {
				if (this.state.error !== null) {
					const t = this.props.t;
					return h("div", { class: "dshp-rt-pane" }, h("div", { class: "dshp-rt-err" }, t("rt.renderError") + (this.state.error.message !== void 0 ? this.state.error.message : String(this.state.error))), h("button", {
						class: "dshp-rt-btn",
						type: "button",
						onClick: () => {
							this.setState({ error: null });
							this.props.onBack();
						}
					}, t("rt.backToAssets")));
				}
				return this.props.children;
			}
		};
		function VersionBadge(props) {
			const t = props.t;
			const [version, setVersion] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				let cancelled = false;
				rtOp("version").then((result) => {
					if (cancelled || !result.ok) return;
					const current = result.data.current ?? (result.data.plugin !== void 0 ? result.data.plugin.version : null);
					setVersion(current === null || current === void 0 ? null : String(current));
				});
				return () => {
					cancelled = true;
				};
			}, []);
			const label = "v" + (version ?? "?");
			if (props.onOpenSettings === void 0) return h("span", { class: "dshp-rt-tag" }, label);
			return h("button", {
				class: "dshp-rt-btn",
				type: "button",
				title: t("rt.v.badgeTip", { v: version ?? "?" }),
				onClick: props.onOpenSettings
			}, label);
		}
		// client/blue/api.ts
		const BLUE_EVENTS_PATH = "/blueteam/api/events";
		const TIMEOUT_BY_OP = {
			assetImport: 6e4,
			alertIngest: 6e4,
			alerts: 6e4,
			reconcileRun: 12e4,
			report: 6e4
		};
		const DEFAULT_TIMEOUT = 3e4;
		async function toApiError(response, cause) {
			if (response === null) return {
				ok: false,
				error: cause instanceof DOMException && cause.name === "AbortError" ? "timeout" : cause instanceof Error ? cause.message : String(cause)
			};
			let payload = null;
			try {
				payload = await response.json();
			} catch {}
			return {
				ok: false,
				error: payload !== null && typeof payload === "object" && typeof payload.error === "string" ? payload.error : "HTTP " + response.status
			};
		}
		async function blueOp(op, body = {}) {
			const controller = new AbortController();
			const timer = setTimeout(() => {
				controller.abort();
			}, TIMEOUT_BY_OP[op] ?? DEFAULT_TIMEOUT);
			let response = null;
			try {
				response = await fetch("/blueteam/api", {
					method: "POST",
					headers: {
						accept: "application/json",
						"content-type": "application/json"
					},
					body: JSON.stringify({
						op,
						...body
					}),
					credentials: "same-origin",
					signal: controller.signal
				});
				if (!response.ok) return await toApiError(response, null);
				const payload = await response.json();
				if (payload !== null && typeof payload === "object" && payload.ok === false) return {
					ok: false,
					error: typeof payload.error === "string" ? payload.error : "unknown"
				};
				return {
					ok: true,
					data: payload
				};
			} catch (cause) {
				return await toApiError(response, cause);
			} finally {
				clearTimeout(timer);
			}
		}
		// client/blue/locale.ts
		/**
		* 蓝队值守台词典（中文为准；英文缺项回落到中文，避免出现裸 key）。
		*/
		const BLUE_NS = "dsh-purge-blue";
		const zhBlue = {
			"b.title": "蓝队值守台",
			"b.subtitle": "防守侧：资产与暴露面、检测、告警研判、事件处置、班次交接",
			"b.side": "蓝队",
			"b.mode.drill": "演练",
			"b.mode.live": "实战值守",
			"b.tab.projects": "项目中心",
			"b.tab.overview": "值守总览",
			"b.tab.alerts": "告警研判",
			"b.tab.incidents": "事件处置",
			"b.tab.assets": "资产测绘",
			"b.tab.skills": "技能库",
			"b.tab.env": "环境适配",
			"b.tab.vulns": "漏洞",
			"b.tab.detection": "检测覆盖",
			"b.tab.agents": "智能体",
			"b.tab.report": "报告与复盘",
			"b.noProject": "还没有防守项目",
			"b.noProjectHint": "新建一个防守项目（责任区）开始值守；它与红队项目是两个独立的库。",
			"b.create": "新建防守项目",
			"b.creating": "创建中…",
			"b.namePh": "防守单位 / 责任区名称",
			"b.scopePh": "责任 CIDR（可空，逗号分隔）",
			"b.defenderPh": "防守方 / 班组（可空）",
			"b.modePh": "模式",
			"b.slaPh": "SLA 档",
			"b.enter": "进入值守",
			"b.newSession": "再开一个值守会话",
			"b.delete": "删除项目",
			"b.deleteConfirm": "删除项目 {name}？目录、资产库、告警与事件都会一起删除，不可恢复。",
			"b.refresh": "刷新",
			"b.pickProject": "切换项目",
			"b.bindHere": "本会话绑定",
			"b.boundHere": "已绑定本会话",
			"b.unbound": "已解绑",
			"b.group.global": "全局",
			"b.foot.assets": "资产 {n}",
			"b.foot.ports": "开放端口 {n}",
			"b.foot.vulns": "漏洞 {n}",
			"b.foot.alerts": "未研判 {n}",
			"b.foot.incidents": "在处置 {n}",
			"b.foot.exposures": "暴露面 {n}",
			"b.foot.rules": "生效规则 {n}",
			"b.unbind": "解绑",
			"b.noSession": "（无会话上下文）",
			"b.created": "创建于",
			"b.back": "‹ 返回项目中心",
			"b.live": "实时",
			"b.polling": "轮询",
			"b.loading": "加载中…",
			"b.empty": "暂无数据",
			"b.save": "保存",
			"b.saved": "已保存",
			"b.cancel": "取消",
			"b.close": "关闭",
			"b.confirm": "确认",
			"b.reason": "理由",
			"b.note": "备注",
			"b.yes": "是",
			"b.no": "否",
			"b.severity": "级别",
			"b.status": "状态",
			"b.time": "时间",
			"b.target": "对象",
			"b.operator": "操作人",
			"b.open": "打开",
			"b.copy": "复制",
			"b.jumpAlerts": "去告警台",
			"b.jumpIncidents": "去事件处置",
			"b.ov.alerts": "未研判告警",
			"b.ov.overdue": "SLA 超时",
			"b.ov.p0": "P0 未闭环",
			"b.ov.incidents": "在处置事件",
			"b.ov.actions": "待批处置",
			"b.ov.unverified": "待验证动作",
			"b.ov.exposures": "未收敛暴露面",
			"b.ov.coverage": "检测覆盖",
			"b.ov.mttd": "MTTD（中位）",
			"b.ov.mttr": "MTTR（中位）",
			"b.ov.fp": "误报率",
			"b.ov.shift": "当前班次",
			"b.ov.noShift": "未开班",
			"b.ov.changes": "最近变更",
			"b.ov.next": "下一步建议",
			"b.ov.quick": "快捷入口",
			"b.ov.startShift": "开班",
			"b.ov.minutes": "分钟",
			"b.al.queue": "队列",
			"b.al.filterStatus": "状态",
			"b.al.filterSeverity": "级别",
			"b.al.search": "搜索标题 / 实体",
			"b.al.all": "全部",
			"b.al.pending": "未处理",
			"b.al.overdue": "超时",
			"b.al.detail": "告警详情",
			"b.al.pick": "从左侧选一条告警",
			"b.al.entity": "实体",
			"b.al.asset": "资产",
			"b.al.rule": "规则",
			"b.al.count": "合并条数",
			"b.al.ack": "认领",
			"b.al.triage": "研判",
			"b.al.true": "真警",
			"b.al.false": "误报",
			"b.al.dup": "重复",
			"b.al.pendingBtn": "待查",
			"b.al.toIncident": "升为事件",
			"b.al.incidentTitle": "事件标题",
			"b.al.cause": "误报原因",
			"b.al.cause.rule": "规则误报",
			"b.al.cause.unknown-asset": "未知资产",
			"b.al.cause.business-change": "业务变更",
			"b.al.cause.clock-skew": "时钟漂移",
			"b.al.cause.other": "其它",
			"b.al.suppress": "抑制",
			"b.al.needIncident": "确认真警前先升为事件",
			"b.al.noAlerts": "没有符合条件的告警（数据源没接？去「检测覆盖」看看）",
			"b.in.title": "事件",
			"b.in.phase.open": "待止血",
			"b.in.phase.contained": "已止血",
			"b.in.phase.eradicated": "已清源",
			"b.in.phase.recovered": "已恢复",
			"b.in.phase.closed": "已关闭",
			"b.in.timeline": "时间线",
			"b.in.actions": "处置动作",
			"b.in.alerts": "关联告警",
			"b.in.propose": "提处置动作",
			"b.in.kind": "动作",
			"b.in.impact": "影响面",
			"b.in.blast": "影响范围",
			"b.in.rollback": "回滚方案",
			"b.in.approve": "批准",
			"b.in.reject": "拒绝",
			"b.in.execute": "执行",
			"b.in.verify": "验证",
			"b.in.evidence": "验证证据",
			"b.in.rollbackBtn": "回滚",
			"b.in.advance": "推进到",
			"b.in.pending": "待批",
			"b.in.unverified": "待验证",
			"b.in.cooling": "冷静期",
			"b.in.noIncident": "还没有事件。告警台里「升为事件」会创建一条。",
			"b.in.summary": "复盘结论",
			"b.in.needSummary": "P0/P1 关闭必须写复盘结论",
			"b.in.addNote": "补时间线",
			"b.as.assets": "资产",
			"b.as.exposure": "暴露面",
			"b.as.baseline": "基线",
			"b.as.watchlist": "名单",
			"b.as.changes": "变更窗口",
			"b.as.criticality": "重要级",
			"b.as.owner": "责任人",
			"b.as.business": "业务",
			"b.as.env": "环境",
			"b.as.import": "导入资产（CSV/JSON）",
			"b.as.importHint": "每行一个对象：{\"ip\":\"10.0.0.10\",\"name\":\"oa\",\"owner\":\"行政部\",\"criticality\":\"P0\"}",
			"b.as.profile": "画像",
			"b.as.openExp": "未收敛",
			"b.as.openAlerts": "未研判告警",
			"b.as.fix": "标记已修复",
			"b.as.accept": "风险接受",
			"b.as.verifiedBy": "验证人",
			"b.as.evidence": "证据",
			"b.as.baselineHint": "fail 会自动生成暴露面（同一分母，不重复记账）",
			"b.as.runBaseline": "记一条基线核查",
			"b.as.category": "类别",
			"b.as.item": "检查项",
			"b.as.expected": "期望",
			"b.as.actual": "实际",
			"b.as.result": "结论",
			"b.as.wlAdd": "加名单",
			"b.as.wlValue": "值（IP/域名/正则）",
			"b.as.wlKind": "类型",
			"b.as.wlExpires": "过期时间",
			"b.as.cwAdd": "加变更窗口",
			"b.as.cwSystem": "系统/资产",
			"b.as.cwStart": "开始",
			"b.as.cwEnd": "结束",
			"b.dt.sources": "数据源台账",
			"b.dt.rules": "检测规则",
			"b.dt.matrix": "ATT&CK 覆盖矩阵",
			"b.dt.covered": "已覆盖",
			"b.dt.gap": "有日志无规则",
			"b.dt.blind": "无日志（盲区）",
			"b.dt.addSource": "登记数据源",
			"b.dt.addRule": "新增规则",
			"b.dt.verify": "验证规则",
			"b.dt.logic": "逻辑",
			"b.dt.ttp": "TTP",
			"b.dt.fpRate": "误报率",
			"b.dt.retention": "留存（天）",
			"b.dt.lastEvent": "最近事件",
			"b.dt.product": "产品",
			"b.ov.vulns": "待修漏洞",
			"b.ov.risk": "风险分布",
			"b.vu.all": "全部",
			"b.vu.search": "搜索标题 / CVE / 目标",
			"b.vu.empty": "还没有漏洞记录：自查扫描后把结果登记进来，修完标记 fixed。",
			"b.vu.title": "漏洞标题（如：Apache 2.4.49 路径穿越）",
			"b.vu.evidence": "修复证据（前后对比 / 截图路径）",
			"b.vu.markFixed": "标记已修复",
			"b.vu.fixed": "已修复",
			"b.vu.falsePositive": "复测不成立",
			"b.vu.add": "登记漏洞",
			"b.vu.status.candidate": "待确认",
			"b.vu.status.confirmed": "已确认",
			"b.vu.status.exploited": "已被利用",
			"b.vu.status.fixed": "已修复",
			"b.vu.status.false-positive": "误报",
			"b.ag.hint": "角色提示词是派活时注入子会话的系统提示；改完立即生效（新派发）。",
			"b.ag.reset": "恢复默认",
			"b.rp.title": "报告",
			"b.rp.generate": "生成报告",
			"b.rp.technical": "技术复盘",
			"b.rp.management": "管理层态势",
			"b.rp.reconcile": "红蓝对账（只读红队库）",
			"b.rp.reconcileHint": "选择红队项目 → 只读打开它的库 → 逐条判断蓝队有没有记录到。只在复盘时用。",
			"b.rp.redProject": "红队项目 id",
			"b.rp.redRoot": "红队数据根（默认 $DSH_HOME/redteam）",
			"b.rp.run": "开始对账",
			"b.rp.history": "对账历史",
			"b.rp.matched": "命中",
			"b.rp.late": "迟报",
			"b.rp.missed": "漏报",
			"b.rp.unverifiable": "不可判定",
			"b.rp.download": "复制报告"
		};
		const enBlue = {
			"b.title": "Blue team console",
			"b.side": "Blue",
			"b.tab.projects": "Projects",
			"b.tab.overview": "Overview",
			"b.tab.alerts": "Alerts",
			"b.tab.incidents": "Incidents",
			"b.tab.assets": "Assets & exposure",
			"b.tab.vulns": "Vulnerabilities",
			"b.tab.detection": "Detection",
			"b.tab.agents": "Agents",
			"b.tab.report": "Report",
			"b.create": "New project",
			"b.enter": "Enter shift",
			"b.refresh": "Refresh"
		};
		// client/redteam/styles.ts
		/**
		* 红队演练台样式：旧 lib/redteam/client.js 的 rt-* 样式全量迁入，
		* 统一改前缀 dshp-rt-（避免与宿主和 dsh-purge 主面板冲突）。
		*
		* 变化：去掉浮动窗（.rt-dock/拖拽条）与 #redteam-full 全屏窗形态（新骨架是右侧栏页签），
		* 新增面板根容器、SSE 连接角标与「总览」页样式；主题仍全走宿主 --dsw-alias-* 变量，暗亮自适应。
		*/
		/** 安装演练台样式（幂等：data-dshp-rt-style 标记查重）。@returns 卸载函数。 */
		function installRtStyles() {
			if (typeof document === "undefined") return () => {};
			if (document.querySelector("style[data-dshp-rt-style]") !== null) return () => {};
			const style = document.createElement("style");
			style.setAttribute("data-dshp-rt-style", "1");
			style.textContent = CSS;
			document.head.append(style);
			return () => {
				style.remove();
			};
		}
		const CSS = `
/* ── 面板根：右侧栏页签内铺满 ─────────────────────────────────────── */
.dshp-rt-root{--dshp-accent:var(--dsw-alias-button-info-fill,#4176e6);--dshp-on-accent:var(--dsw-alias-label-on-color,#fff);height:100%;min-height:0;display:flex;flex-direction:column;color:var(--dsw-alias-label-primary);
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
.dshp-rt-btn-primary{background:var(--dshp-accent);border-color:var(--dshp-accent);color:var(--dshp-on-accent)}
.dshp-rt-btn-primary:hover{opacity:.9}
.dshp-rt-btn:disabled{opacity:.5;cursor:default}
.dshp-rt-tabs{display:flex;flex-wrap:wrap;gap:2px;padding:6px 12px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dshp-rt-tab{padding:8px 10px 7px;border-radius:0;cursor:pointer;font-size:12.5px;color:var(--dsw-alias-label-secondary);
  display:inline-flex;align-items:center;gap:5px;border-bottom:2px solid transparent;margin-bottom:-1px;background:transparent}
.dshp-rt-tab:hover{color:var(--dsw-alias-label-primary)}
.dshp-rt-tab.on{color:var(--dsw-alias-label-primary);background:transparent;font-weight:600;border-bottom-color:var(--dshp-accent)}
.dshp-rt-body{flex:1;min-height:0;display:flex;flex-direction:column}
.dshp-rt-split{flex:1;min-height:0;display:flex}
.dshp-rt-side{width:200px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);overflow:auto;padding:8px}
.dshp-rt-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.dshp-rt-seg{padding:7px 8px;border-radius:6px;cursor:pointer;margin-bottom:4px;border:1px solid transparent}
.dshp-rt-seg:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-seg.on{background:var(--dsw-alias-bg-layer-2);border-color:var(--dshp-accent)}
.dshp-rt-seg-cidr{font-family:ui-monospace,Menlo,monospace;font-size:12.5px}
.dshp-rt-seg-meta{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px}
.dshp-rt-toolbar{display:flex;gap:6px;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;align-items:center}
.dshp-rt-input{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:inherit;
  border-radius:6px;padding:4px 8px;font-size:12px;font-family:inherit;outline:none;min-width:0}
.dshp-rt-input:focus{border-color:var(--dshp-accent)}
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
.dshp-rt-textarea:focus{border-color:var(--dshp-accent)}
.dshp-rt-list{width:210px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);overflow:auto;padding:8px}
.dshp-rt-item{padding:7px 8px;border-radius:6px;cursor:pointer;margin-bottom:4px;border:1px solid transparent}
.dshp-rt-item:hover{background:var(--dsw-alias-bg-layer-2)}
.dshp-rt-item.on{background:var(--dsw-alias-bg-layer-2);border-color:var(--dshp-accent)}
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
.dshp-rt-code:hover{border-color:var(--dshp-accent)}
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
.dshp-rt-link{color:var(--dshp-accent);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshp-rt-link:hover{text-decoration:underline}
.dshp-rt-more{color:var(--dshp-accent);font-size:11.5px;cursor:pointer;user-select:none;margin-top:4px;display:inline-block}
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
.dshp-rt-concl-i.on{border-color:var(--dshp-accent);background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-concl-i b{font-family:ui-monospace,Menlo,monospace;font-size:14px;font-weight:700}
.dshp-rt-concl-i>span{color:var(--dsw-alias-label-secondary);font-size:11.5px}
.dshp-rt-sec-wrap{margin:0}
.dshp-rt-sec{display:flex;align-items:center;gap:8px;padding:7px 12px 7px 9px;cursor:pointer;
  background:var(--dsw-alias-bg-layer-2);border-left:3px solid var(--dsw-alias-border-l2);
  border-top:1px solid var(--dsw-alias-border-l1);user-select:none;outline:none}
.dshp-rt-sec:hover{background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-sec:focus-visible{outline:2px solid var(--dshp-accent);outline-offset:-2px}
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
.dshp-rt-sidehead-btn:focus-visible{outline:2px solid var(--dshp-accent);outline-offset:-2px}
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
.dshp-rt-ap-hit:focus-visible{outline:2px solid var(--dshp-accent);outline-offset:-2px}
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
.dshp-rt-rep-stage:focus-visible{outline:2px solid var(--dshp-accent);outline-offset:-2px}
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
.dshp-rt-rep-step-no{width:17px;height:17px;border-radius:50%;background:var(--dshp-accent);color:var(--dshp-on-accent);
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
.dshp-rt-kb.open{border-color:var(--dshp-accent)}
.dshp-rt-kb-head{display:flex;align-items:center;gap:7px;padding:7px 9px;cursor:pointer;outline:none;flex-wrap:wrap}
.dshp-rt-kb-head:hover{background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-kb-head:focus-visible{outline:2px solid var(--dshp-accent);outline-offset:-2px}
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
.dshp-rt-ov-bar>i{display:block;height:100%;background:var(--dshp-accent)}
.dshp-rt-ov-hit{border:1px solid var(--dsw-alias-border-l1);border-left:3px solid #10b981;border-radius:6px;
  padding:6px 9px;margin-bottom:5px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;outline:none}
.dshp-rt-ov-hit:hover{border-color:var(--dsw-alias-border-l2)}
.dshp-rt-ov-hit:focus-visible{outline:2px solid var(--dshp-accent);outline-offset:-2px}
.dshp-rt-ov-hit-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dshp-rt-ov-hit-name{font-weight:600;font-size:12px}

/* ── 项目头（工作台顶部） ─────────────────────────────────────────── */
.dshp-rt-projhead{display:flex;align-items:center;gap:8px;padding:6px 12px;flex-wrap:wrap;
  border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dshp-rt-projname{font-weight:650;font-size:13px;color:var(--dsw-alias-label-primary);max-width:34ch;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshp-rt-projmeta{font-size:11.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dshp-rt-linkbtn{border:none;background:transparent;color:inherit;cursor:pointer;font-size:12px;
  line-height:1;padding:0 0 0 5px;opacity:.8}
.dshp-rt-linkbtn:hover{opacity:1}
.dshp-rt-tabsep{font-size:11px;color:var(--dsw-alias-label-tertiary);padding:0 6px;white-space:nowrap;
  border-left:1px solid var(--dsw-alias-border-l2);margin-left:4px}
.dshp-rt-tab-global{opacity:.92}

/* ── 项目中心（projects 页签） ────────────────────────────────────── */
.dshp-pj-head{display:flex;align-items:flex-start;gap:10px;padding:12px;flex-wrap:wrap;
  border-bottom:1px solid var(--dsw-alias-border-l1)}
.dshp-pj-titlebox{display:flex;flex-direction:column;gap:3px;min-width:0}
.dshp-pj-title{font-size:14px;font-weight:650;color:var(--dsw-alias-label-primary)}
.dshp-pj-sub{font-size:11.5px;color:var(--dsw-alias-label-secondary);max-width:78ch;line-height:1.5}
.dshp-pj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:10px;padding:12px}
.dshp-pj-card{display:flex;flex-direction:column;gap:7px;border:1px solid var(--dsw-alias-border-l1);
  border-radius:10px;padding:10px 12px;background:var(--dsw-alias-bg-layer-2);min-width:0}
.dshp-pj-card.is-current{border-color:var(--dshp-accent);box-shadow:inset 3px 0 0 var(--dshp-accent)}
.dshp-pj-card.is-archived{opacity:.72}
.dshp-pj-card-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-width:0}
.dshp-pj-card-name{font-weight:650;font-size:13px;color:var(--dsw-alias-label-primary);min-width:0;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.dshp-pj-meta{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--dsw-alias-label-secondary);
  flex-wrap:wrap;min-width:0}
.dshp-pj-dot{opacity:.5}
.dshp-pj-chips{display:flex;flex-wrap:wrap;gap:4px;min-width:0}
.dshp-pj-note{font-size:11.5px;color:var(--dsw-alias-label-secondary);line-height:1.5;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dshp-pj-progress{display:flex;flex-direction:column;gap:2px}
.dshp-pj-stats{display:flex;gap:10px;font-size:11.5px;color:var(--dsw-alias-label-secondary);flex-wrap:wrap}
.dshp-pj-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:2px}
.dshp-pj-create{margin:12px;background:var(--dsw-alias-bg-layer-2);display:flex;flex-direction:column;gap:8px}
.dshp-pj-field{display:flex;flex-direction:column;gap:3px;min-width:0}
.dshp-pj-label{font-size:11.5px;color:var(--dsw-alias-label-secondary)}
.dshp-pj-edit{display:flex;flex-direction:column;gap:5px;padding-top:4px;border-top:1px dashed var(--dsw-alias-border-l1)}
`;
		// client/blue/kit.tsx
		/**
		* 蓝队 UI 套件：**直接复用红队演练台的视觉语言**（同一批 dshp-* 类名），
		* 保证两边的卡片、标题、字牌（tag）、KPI、进度条、键值表长得一模一样。
		*
		* 这里只做"把类名封成组件"，不引入新的样式；新增样式一律加到 redteam/styles.ts。
		*/
		/** KPI 磁贴：大数字 + 副题。 */
		function Tile(props) {
			return h("div", {
				class: "dshp-rt-ov-tile",
				style: props.onClick === void 0 ? void 0 : { cursor: "pointer" },
				onClick: props.onClick
			}, props.title === void 0 ? null : h("div", { class: "dshp-rt-ov-title" }, props.title), props.big === void 0 ? null : h("div", {
				class: "dshp-rt-ov-big",
				style: props.tone === "bad" ? { color: "var(--dsw-alias-state-error-primary)" } : props.tone === "warn" ? { color: "var(--dsw-alias-state-warning-primary)" } : void 0
			}, props.big), props.sub === void 0 ? null : h("div", { class: "dshp-rt-ov-sub" }, props.sub), props.children);
		}
		/** 字牌：统一走 dshp-rt-tag 系列（live/warn/passive/active）。 */
		function Tag(props) {
			const cls = "dshp-rt-tag" + (props.tone === void 0 || props.tone === "passive" ? props.tone === "passive" ? " dshp-rt-tag-passive" : "" : " dshp-rt-tag-" + props.tone) + (props.mono === true ? " dshp-rt-mono" : "");
			return h("span", {
				class: cls,
				title: props.title
			}, props.children);
		}
		/** 键值行（设置/环境/详情页统一用它）。 */
		function KV(props) {
			return h("div", null, props.rows.map(([k, v]) => h("div", {
				key: k,
				class: "dshp-rt-kv"
			}, h("b", null, k), h("span", null, v))));
		}
		/** 表单字段（项目中心 create 卡同款）。 */
		function Field(props) {
			return h("div", { class: "dshp-pj-field" }, props.label === void 0 ? null : h("div", { class: "dshp-pj-label" }, props.label), props.children);
		}
		function Empty(props) {
			return h("div", { class: "dshp-rt-empty" }, props.children);
		}
		/** 带标题的分区卡片（红队 Section 组件，标题带计数与右侧操作）。 */
		function Block(props) {
			return h(Section, {
				title: props.title,
				count: props.count,
				sub: props.sub,
				right: props.right,
				always: true
			}, props.children);
		}
		// client/blue/OverviewPane.tsx
		/**
		* 防守总览：与红队「总览」同款 tile 网格（dshp-rt-ov-grid / ov-tile / ov-title / ov-big / ov-bar）。
		* 数字只作技术观测（不记分），磁贴可点直接跳到对应页。
		*/
		function OverviewPane$1(props) {
			const t = props.t;
			const [digest, setDigest] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				blueOp("digest", { engagement: props.eng }).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setDigest(r.data.digest ?? null);
				});
			}, [props.eng]);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			if (digest === null) return h(Loading, { text: t("b.loading") });
			const alerts = digest.alerts ?? {};
			const incidents = digest.incidents ?? {};
			const metrics = digest.metrics ?? {};
			const exposures = digest.exposures ?? {};
			const detection = digest.detection ?? {};
			const actions = digest.actions ?? {};
			const vulns = digest.vulns ?? {};
			const bySev = vulns.bySeverity ?? {};
			const vulnTotal = Number(vulns.total || 0);
			const fixed = Number((vulns.byStatus ?? {}).fixed || 0);
			const coveragePct = Number(detection.rulesActive || 0) > 0 ? Math.min(100, Math.round(Number(detection.rulesActive) / 17 * 100)) : 0;
			const alertTile = Tile({
				title: t("b.ov.alerts"),
				big: String(alerts.unhandled ?? 0),
				tone: Number(alerts.unhandled || 0) > 0 ? "warn" : void 0,
				sub: "超时 " + String(alerts.overdue ?? 0) + " · P0 " + String(alerts.p0 ?? 0),
				onClick: () => props.go("alerts"),
				children: h("div", { style: {
					display: "flex",
					gap: 4,
					marginTop: 6,
					flexWrap: "wrap"
				} }, [
					"P0",
					"P1",
					"P2",
					"P3"
				].map((s) => Tag({
					key: s,
					tone: s === "P0" ? "warn" : s === "P1" ? "active" : "passive",
					children: s + " " + String((alerts.bySeverity ?? {})[s] ?? 0)
				})), Tag({
					tone: "passive",
					children: "误报 " + String(alerts.fpRate ?? 0) + "%"
				}))
			});
			const incidentTile = Tile({
				title: t("b.ov.incidents"),
				big: String(incidents.open ?? 0),
				sub: "待批 " + String(actions.pending ?? 0) + " · 待验证 " + String(actions.unverified ?? 0),
				onClick: () => props.go("incidents"),
				children: (incidents.recent ?? []).slice(0, 4).map((row) => h("div", {
					key: String(row.id),
					class: "dshp-rt-ov-sub",
					style: {
						display: "flex",
						gap: 6,
						marginTop: 4
					}
				}, Tag({
					tone: String(row.severity) === "P0" ? "warn" : "passive",
					children: String(row.severity)
				}), h("span", { style: {
					flex: 1,
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap"
				} }, String(row.title)), h("span", null, String(row.status))))
			});
			const vulnTile = Tile({
				title: t("b.ov.vulns"),
				big: String(vulnTotal),
				tone: bySev.critical > 0 ? "bad" : vulnTotal > 0 ? "warn" : void 0,
				sub: "已修 " + fixed + " · 未收敛暴露 " + String(exposures.open ?? 0),
				onClick: () => props.go("vulns"),
				children: h("div", { style: {
					display: "flex",
					gap: 4,
					marginTop: 6,
					flexWrap: "wrap"
				} }, [
					"critical",
					"high",
					"medium",
					"low"
				].map((s) => Tag({
					key: s,
					tone: s === "critical" ? "warn" : "passive",
					children: s + " " + String(bySev[s] ?? 0)
				})))
			});
			const detectionTile = Tile({
				title: t("b.ov.coverage"),
				big: String(detection.rulesActive ?? 0) + " / 17",
				sub: "日志源 " + String(Object.values(detection.sources ?? {}).reduce((a, b) => a + Number(b), 0)) + " · MTTD " + (metrics.mttd ?? "—") + " / MTTR " + (metrics.mttr ?? "—"),
				onClick: () => props.go("detection"),
				children: h("div", { style: { marginTop: 6 } }, h("div", { class: "dshp-rt-ov-bar" }, h("i", { style: { width: coveragePct + "%" } })))
			});
			const next = [];
			if (alerts.unhandled > 0) next.push("清告警：未研判 " + alerts.unhandled + " 条（超时 " + alerts.overdue + "）");
			if (actions.pending > 0) next.push("待批处置 " + actions.pending + " 条：去「事件处置」批准");
			if (actions.unverified > 0) next.push("待验证动作 " + actions.unverified + " 条：验证后事件才能止血");
			if (vulnTotal > 0) next.push("待修漏洞 " + vulnTotal + " 条：去「漏洞」闭环");
			if (exposures.open > 0) next.push("暴露面待收敛 " + exposures.open + " 项");
			if (Number(detection.rulesActive || 0) === 0) next.push("还没有生效的检测规则：去「检测覆盖」补规则");
			return h("div", {
				class: "dshp-rt-main",
				style: { overflow: "auto" }
			}, h("div", { class: "dshp-rt-ov-grid" }, alertTile, incidentTile, vulnTile, detectionTile), Block({
				title: t("b.ov.next"),
				count: next.length,
				children: next.length === 0 ? Empty({ children: "当前没有待办：可以推进检测覆盖或跑一轮基线。" }) : h("div", null, next.map((line, i) => h("div", {
					key: "n" + i,
					class: "dshp-rt-ov-sub"
				}, "· " + line)))
			}), Block({
				title: t("b.ov.changes"),
				count: (digest.changes ?? []).length,
				children: (digest.changes ?? []).length === 0 ? Empty({ children: t("b.empty") }) : h("div", null, (digest.changes ?? []).slice(0, 12).map((c) => h("div", {
					key: String(c.id),
					class: "dshp-rt-ov-sub",
					style: {
						display: "flex",
						gap: 8
					}
				}, h("span", { class: "dshp-rt-mono" }, fmt(c.at)), h("span", null, String(c.kind)), h("span", { class: "dshp-rt-mono" }, c.ref_id === null ? "" : "#" + String(c.ref_id)))))
			}));
		}
		// client/blue/AlertsPane.tsx
		/**
		* 告警研判：左队列 + 右详情（红队「漏洞战果」同款分栏与字牌）。
		* j/k 选行，f 误报，p 待查，i 升事件。
		*/
		const CAUSES = [
			"rule",
			"unknown-asset",
			"business-change",
			"clock-skew",
			"other"
		];
		function AlertsPane(props) {
			const t = props.t;
			const [status, setStatus] = (0, react.useState)("new,triaging");
			const [severity, setSeverity] = (0, react.useState)("");
			const [q, setQ] = (0, react.useState)("");
			const [rows, setRows] = (0, react.useState)([]);
			const [counts, setCounts] = (0, react.useState)({});
			const [sel, setSel] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [cause, setCause] = (0, react.useState)("rule");
			const [incTitle, setIncTitle] = (0, react.useState)("");
			const [incSev, setIncSev] = (0, react.useState)("P2");
			const [note, setNote] = (0, react.useState)("");
			const [suppressUntil, setSuppressUntil] = (0, react.useState)("");
			const selRef = (0, react.useRef)(null);
			selRef.current = sel;
			const load = (0, react.useCallback)(() => {
				blueOp("alerts", {
					engagement: props.eng,
					status: status === "" ? void 0 : status,
					severity: severity || void 0,
					q: q || void 0,
					limit: 80
				}).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					const items = Array.isArray(r.data.items) ? r.data.items : [];
					setRows(items);
					setCounts(r.data.counts ?? {});
					if (selRef.current !== null && !items.some((x) => Number(x.id) === selRef.current)) setSel(items[0] !== void 0 ? Number(items[0].id) : null);
					else if (selRef.current === null && items[0] !== void 0) setSel(Number(items[0].id));
				});
			}, [
				props.eng,
				status,
				severity,
				q
			]);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			const selected = rows.find((r) => Number(r.id) === sel) ?? null;
			const report = (message, ok) => {
				props.notices.report(message, ok ? "success" : "failure");
			};
			const call = (op, body, okText) => {
				setBusy(true);
				blueOp(op, {
					engagement: props.eng,
					...body
				}).then((r) => {
					setBusy(false);
					if (!r.ok) {
						report(r.error, false);
						return;
					}
					report(okText, true);
					load();
				});
			};
			const triageFalse = () => {
				if (selected !== null) call("alertTriage", {
					alert_id: Number(selected.id),
					verdict: "false_positive",
					cause,
					note
				}, "已判误报");
			};
			const triagePending = () => {
				if (selected !== null) call("alertTriage", {
					alert_id: Number(selected.id),
					verdict: "pending",
					note
				}, "已标记待查");
			};
			const promote = () => {
				if (selected === null) return;
				const title = incTitle.trim() !== "" ? incTitle.trim() : String(selected.title || "事件");
				setBusy(true);
				blueOp("incidentOpen", {
					engagement: props.eng,
					title,
					severity: incSev,
					alertIds: [Number(selected.id)],
					category: "other"
				}).then((r) => {
					if (!r.ok) {
						setBusy(false);
						report(r.error, false);
						return;
					}
					const incidentId = Number(r.data.id);
					blueOp("alertTriage", {
						engagement: props.eng,
						alert_id: Number(selected.id),
						verdict: "confirmed",
						incident_id: incidentId,
						note
					}).then((r2) => {
						setBusy(false);
						if (!r2.ok) {
							report(r2.error, false);
							return;
						}
						report("已升为事件 #" + incidentId, true);
						setIncTitle("");
						load();
						props.jump("incidents", { incidentId });
					});
				});
			};
			const suppress = () => {
				if (selected !== null) call("alertSuppress", {
					alert_id: Number(selected.id),
					reason: note || "手动抑制",
					until: suppressUntil || void 0
				}, "已抑制");
			};
			const duplicate = () => {
				if (selected === null) return;
				const raw = typeof window !== "undefined" ? window.prompt("原告警 id") : null;
				if (raw === null || raw.trim() === "") return;
				call("alertTriage", {
					alert_id: Number(selected.id),
					verdict: "duplicate",
					dup_of: Number(raw),
					note
				}, "已标重复");
			};
			(0, react.useEffect)(() => {
				const onKey = (e) => {
					const tag = e.target !== null && e.target.tagName ? e.target.tagName : "";
					if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || rows.length === 0) return;
					const idx = rows.findIndex((r) => Number(r.id) === selRef.current);
					if (e.key === "j" || e.key === "ArrowDown") {
						const next = rows[Math.min(rows.length - 1, idx + 1)];
						if (next) setSel(Number(next.id));
					} else if (e.key === "k" || e.key === "ArrowUp") {
						const prev = rows[Math.max(0, idx - 1)];
						if (prev) setSel(Number(prev.id));
					} else if (e.key === "f") triageFalse();
					else if (e.key === "p") triagePending();
					else if (e.key === "i") promote();
				};
				window.addEventListener("keydown", onKey);
				return () => {
					window.removeEventListener("keydown", onKey);
				};
			});
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			const sevTag = (s) => Tag({
				tone: s === "P0" ? "warn" : s === "P1" ? "active" : "passive",
				children: s
			});
			const left = h("div", {
				class: "dshp-rt-pane",
				style: {
					width: "46%",
					minWidth: 320,
					display: "flex",
					flexDirection: "column",
					minHeight: 0
				}
			}, h("div", {
				class: "dshp-rt-actions",
				style: { marginBottom: 6 }
			}, h("select", {
				class: "dshp-rt-input",
				value: status,
				onChange: (e) => setStatus(e.target.value)
			}, h("option", { value: "new,triaging" }, t("b.al.pending") + " (" + String(counts.byStatus?.new ?? 0) + ")"), h("option", { value: "" }, t("b.al.all"))), h("select", {
				class: "dshp-rt-input",
				value: severity,
				onChange: (e) => setSeverity(e.target.value)
			}, h("option", { value: "" }, t("b.al.filterSeverity")), [
				"P0",
				"P1",
				"P2",
				"P3"
			].map((s) => h("option", {
				key: s,
				value: s
			}, s))), h("input", {
				class: "dshp-rt-input",
				style: { flex: "1 1 120px" },
				placeholder: t("b.al.search"),
				value: q,
				onChange: (e) => setQ(e.target.value)
			})), rows.length === 0 ? Empty({ children: t("b.al.noAlerts") }) : h("div", { style: {
				overflow: "auto",
				minHeight: 0
			} }, rows.map((r) => h("div", {
				key: String(r.id),
				class: "dshp-rt-row",
				style: {
					padding: "6px 8px",
					borderBottom: "1px solid var(--dsw-alias-border-l2)",
					cursor: "pointer",
					background: Number(r.id) === sel ? "var(--dsw-alias-interactive-bg-hover)" : "transparent"
				},
				onClick: () => setSel(Number(r.id))
			}, h("div", { style: {
				display: "flex",
				gap: 6,
				alignItems: "center"
			} }, sevTag(String(r.severity)), h("span", { style: {
				flex: 1,
				fontSize: 12,
				fontWeight: 500,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap"
			} }, String(r.title || "")), Tag({
				tone: "passive",
				children: String(r.count || 1) + "×"
			})), h("div", {
				class: "dshp-rt-ov-sub",
				style: {
					display: "flex",
					gap: 8
				}
			}, h("span", null, fmtShort(r.first_seen)), h("span", { class: "dshp-rt-mono" }, String(r.entity_id || "—")), h("span", null, String(r.rule_name || r.rule_code || "")), r.sla_due_at !== null ? h("span", null, "SLA " + fmtShort(r.sla_due_at)) : null)))));
			const triageBlock = Block({
				title: "研判",
				children: h("div", null, KV({ rows: [["首次出现", fmt(selected === null ? null : selected.first_seen)], ["SLA 截止", fmt(selected === null ? null : selected.sla_due_at)]] }), h("textarea", {
					class: "dshp-rt-textarea",
					style: {
						width: "100%",
						minHeight: 54,
						marginTop: 6
					},
					placeholder: t("b.note"),
					value: note,
					onChange: (e) => setNote(e.target.value)
				}), h("div", {
					class: "dshp-rt-actions",
					style: { marginTop: 6 }
				}, h("select", {
					class: "dshp-rt-input",
					value: cause,
					onChange: (e) => setCause(e.target.value)
				}, CAUSES.map((c) => h("option", {
					key: c,
					value: c
				}, t("b.al.cause." + c)))), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: triageFalse
				}, t("b.al.false")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: triagePending
				}, t("b.al.pendingBtn")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: duplicate
				}, t("b.al.dup"))))
			});
			const promoteBlock = Block({
				title: "升为事件",
				children: h("div", { class: "dshp-rt-actions" }, h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 160px" },
					placeholder: t("b.al.incidentTitle"),
					value: incTitle,
					onChange: (e) => setIncTitle(e.target.value)
				}), h("select", {
					class: "dshp-rt-input",
					value: incSev,
					onChange: (e) => setIncSev(e.target.value)
				}, [
					"P0",
					"P1",
					"P2",
					"P3"
				].map((s) => h("option", {
					key: s,
					value: s
				}, s))), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy,
					onClick: promote
				}, t("b.al.toIncident")))
			});
			const suppressBlock = Block({
				title: "抑制",
				children: h("div", { class: "dshp-rt-actions" }, h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 160px" },
					placeholder: "until (ISO，可空)",
					value: suppressUntil,
					onChange: (e) => setSuppressUntil(e.target.value)
				}), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: suppress
				}, t("b.al.suppress")))
			});
			const detail = selected === null ? Empty({ children: t("b.al.pick") }) : h("div", {
				class: "dshp-rt-pane",
				style: {
					flex: 1,
					minHeight: 0,
					overflow: "auto"
				}
			}, h("div", { class: "dshp-rt-ov-title" }, String(selected.title || "")), h("div", { style: {
				display: "flex",
				gap: 6,
				flexWrap: "wrap",
				margin: "6px 0"
			} }, Tag({
				tone: String(selected.severity) === "P0" ? "warn" : "active",
				children: String(selected.severity)
			}), Tag({
				tone: String(selected.status) === "confirmed" ? "live" : "passive",
				children: String(selected.status)
			}), Tag({ children: t("b.al.entity") + ": " + String(selected.entity_id || "—") }), Tag({ children: t("b.al.asset") + ": " + String(selected.asset_ip || "—") }), Tag({ children: t("b.al.rule") + ": " + String(selected.rule_name || selected.rule_code || "—") }), Tag({ children: t("b.al.count") + ": " + String(selected.count || 1) })), triageBlock, promoteBlock, suppressBlock, h("div", {
				class: "dshp-rt-foot",
				style: {
					borderTop: "none",
					paddingLeft: 0
				}
			}, "j/k 选行 · f 误报 · p 待查 · i 升事件"), selected.triage_note ? h("pre", { class: "dshp-rt-evi-body" }, String(selected.triage_note)) : null);
			return h("div", { class: "dshp-rt-split" }, left, detail);
		}
		// client/blue/IncidentsPane.tsx
		/**
		* 事件处置：左事件列表 + 右处置台（时间线 / 动作 / 状态推进），与红队「攻击链」同款分栏。
		* 审批只在这里（面板），模型没有 approve 工具。
		*/
		const KINDS = [
			"hunt",
			"kill_process",
			"remove_shell",
			"block_ip",
			"block_domain",
			"isolate_host",
			"disable_account",
			"rotate_credential",
			"revoke_ticket",
			"patch",
			"downgrade_exposure"
		];
		const NEXT = {
			open: "contained",
			contained: "eradicated",
			eradicated: "recovered",
			recovered: "closed",
			closed: null
		};
		function IncidentsPane(props) {
			const t = props.t;
			const [rows, setRows] = (0, react.useState)([]);
			const [sel, setSel] = (0, react.useState)(null);
			const [detail, setDetail] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [form, setForm] = (0, react.useState)({
				kind: "block_ip",
				target: "",
				impact: "",
				blast: "",
				rollback: ""
			});
			const [evidence, setEvidence] = (0, react.useState)("");
			const [summary, setSummary] = (0, react.useState)("");
			const [note, setNote] = (0, react.useState)("");
			const loadList = (0, react.useCallback)(() => {
				blueOp("incidents", { engagement: props.eng }).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					const items = Array.isArray(r.data.items) ? r.data.items : [];
					setRows(items);
					const wanted = props.params !== null && props.params !== void 0 && props.params.incidentId !== void 0 ? Number(props.params.incidentId) : null;
					if (wanted !== null && items.some((x) => Number(x.id) === wanted)) setSel(wanted);
					else if (sel === null && items[0] !== void 0) setSel(Number(items[0].id));
				});
			}, [
				props.eng,
				props.params,
				sel
			]);
			const loadDetail = (0, react.useCallback)((id) => {
				blueOp("incident", {
					engagement: props.eng,
					incidentId: id
				}).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setDetail(r.data);
				});
			}, [props.eng]);
			(0, react.useEffect)(() => {
				loadList();
			}, [loadList, props.refreshKey]);
			(0, react.useEffect)(() => {
				if (sel !== null) loadDetail(sel);
			}, [
				sel,
				loadDetail,
				props.refreshKey
			]);
			const report = (message, ok) => {
				props.notices.report(message, ok ? "success" : "failure");
			};
			const call = (op, body, okText) => {
				setBusy(true);
				blueOp(op, {
					engagement: props.eng,
					...body
				}).then((r) => {
					setBusy(false);
					if (!r.ok) {
						report(r.error, false);
						return;
					}
					report(okText, true);
					if (sel !== null) loadDetail(sel);
					loadList();
				});
			};
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			const incident = detail !== null ? detail.incident : null;
			const timeline = detail !== null ? detail.timeline : [];
			const actions = detail !== null ? detail.actions : [];
			const linked = detail !== null ? detail.alerts : [];
			const left = h("div", {
				class: "dshp-rt-pane",
				style: {
					width: "34%",
					minWidth: 260,
					overflow: "auto",
					minHeight: 0
				}
			}, rows.length === 0 ? Empty({ children: t("b.in.noIncident") }) : null, rows.map((r) => h("div", {
				key: String(r.id),
				class: "dshp-rt-row",
				style: {
					padding: "8px",
					borderBottom: "1px solid var(--dsw-alias-border-l2)",
					cursor: "pointer",
					background: Number(r.id) === sel ? "var(--dsw-alias-interactive-bg-hover)" : "transparent"
				},
				onClick: () => setSel(Number(r.id))
			}, h("div", { style: {
				display: "flex",
				gap: 6,
				alignItems: "center"
			} }, Tag({
				tone: String(r.severity) === "P0" ? "warn" : "active",
				children: String(r.severity)
			}), h("span", { style: {
				flex: 1,
				fontSize: 12
			} }, String(r.title || "")), Tag({
				tone: String(r.status) === "closed" ? "passive" : "live",
				children: t("b.in.phase." + String(r.status))
			})), h("div", { class: "dshp-rt-ov-sub" }, "#" + String(r.id) + " · " + fmt(r.detected_at) + " · 告警 " + String(r.alert_count ?? 0)))));
			const header = incident === null ? null : h("div", null, h("div", { class: "dshp-rt-ov-title" }, "#" + String(incident.id) + " " + String(incident.title)), h("div", { style: {
				display: "flex",
				gap: 6,
				flexWrap: "wrap",
				margin: "6px 0"
			} }, Tag({
				tone: String(incident.severity) === "P0" ? "warn" : "active",
				children: String(incident.severity)
			}), Tag({
				tone: String(incident.status) === "closed" ? "passive" : "live",
				children: t("b.in.phase." + String(incident.status))
			})), KV({ rows: [
				["发现", fmt(incident.detected_at)],
				["确认", fmt(incident.triaged_at)],
				["止血", fmt(incident.contained_at)],
				["恢复", fmt(incident.recovered_at)]
			] }));
			const advance = incident === null ? null : Block({
				title: "状态推进",
				children: h("div", null, h("div", { class: "dshp-rt-actions" }, NEXT[String(incident.status)] !== null && NEXT[String(incident.status)] !== void 0 ? h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy,
					onClick: () => call("incidentUpdate", {
						incidentId: Number(incident.id),
						status: NEXT[String(incident.status)],
						note
					}, "已推进")
				}, t("b.in.advance") + " " + t("b.in.phase." + String(NEXT[String(incident.status)]))) : Tag({
					tone: "passive",
					children: "已闭环"
				})), h("input", {
					class: "dshp-rt-input",
					style: {
						width: "100%",
						marginTop: 6
					},
					placeholder: t("b.in.summary"),
					value: summary,
					onChange: (e) => setSummary(e.target.value)
				}), h("div", {
					class: "dshp-rt-actions",
					style: { marginTop: 6 }
				}, h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: () => call("incidentUpdate", {
						incidentId: Number(incident.id),
						summary
					}, "已保存复盘结论")
				}, t("b.save")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: () => call("incidentNote", {
						incidentId: Number(incident.id),
						text: note || "补记",
						by: "user"
					}, "已补时间线")
				}, t("b.in.addNote"))))
			});
			const propose = incident === null ? null : Block({
				title: t("b.in.propose"),
				children: h("div", null, h("div", { class: "dshp-rt-actions" }, h("select", {
					class: "dshp-rt-input",
					value: form.kind,
					onChange: (e) => setForm((s) => ({
						...s,
						kind: e.target.value
					}))
				}, KINDS.map((k) => h("option", {
					key: k,
					value: k
				}, k))), h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 160px" },
					placeholder: t("b.target"),
					value: form.target,
					onChange: (e) => setForm((s) => ({
						...s,
						target: e.target.value
					}))
				})), h("div", {
					class: "dshp-rt-actions",
					style: { marginTop: 6 }
				}, h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 140px" },
					placeholder: t("b.in.impact"),
					value: form.impact,
					onChange: (e) => setForm((s) => ({
						...s,
						impact: e.target.value
					}))
				}), h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 110px" },
					placeholder: t("b.in.blast"),
					value: form.blast,
					onChange: (e) => setForm((s) => ({
						...s,
						blast: e.target.value
					}))
				}), h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 140px" },
					placeholder: t("b.in.rollback"),
					value: form.rollback,
					onChange: (e) => setForm((s) => ({
						...s,
						rollback: e.target.value
					}))
				}), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy,
					onClick: () => call("actionPropose", {
						incidentId: Number(incident.id),
						kind: form.kind,
						target: form.target,
						impact: form.impact,
						blastRadius: form.blast,
						rollbackPlan: form.rollback
					}, "已提交处置动作")
				}, t("b.in.propose"))))
			});
			const actionList = incident === null ? null : Block({
				title: t("b.in.actions"),
				count: actions.length,
				children: actions.length === 0 ? Empty({ children: t("b.empty") }) : h("div", null, actions.map((a) => h("div", {
					key: String(a.id),
					class: "dshp-rt-card",
					style: {
						margin: "6px 0",
						padding: "8px 10px"
					}
				}, h("div", { style: {
					display: "flex",
					gap: 6,
					alignItems: "center",
					flexWrap: "wrap"
				} }, h("span", { style: {
					fontWeight: 600,
					fontSize: 12
				} }, String(a.kind)), Tag({ children: "→ " + String(a.target) }), Tag({
					tone: String(a.risk) === "high" || String(a.risk) === "critical" ? "warn" : "passive",
					children: "risk " + String(a.risk)
				}), Tag({
					tone: String(a.approval_status) === "approved" ? "live" : String(a.approval_status) === "rejected" ? "passive" : "warn",
					children: String(a.approval_status)
				}), a.emergency === 1 ? Tag({
					tone: "warn",
					children: "emergency"
				}) : null, a.verify_at !== null ? Tag({
					tone: "live",
					children: "verified"
				}) : a.executed_at !== null ? Tag({
					tone: "warn",
					children: t("b.in.unverified")
				}) : null), h("div", {
					class: "dshp-rt-ov-sub",
					style: { margin: "2px 0" }
				}, (a.impact ? "影响：" + String(a.impact) + " " : "") + (a.rollback_plan ? "回滚：" + String(a.rollback_plan) : "")), h("div", {
					class: "dshp-rt-actions",
					style: { flexWrap: "wrap" }
				}, a.approval_status === "requested" ? h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy,
					onClick: () => call("actionApprove", {
						actionId: Number(a.id),
						approver: "user"
					}, "已批准")
				}, t("b.in.approve")) : null, a.approval_status === "requested" ? h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: () => call("actionReject", {
						actionId: Number(a.id),
						approver: "user"
					}, "已拒绝")
				}, t("b.in.reject")) : null, a.executed_at === null && (a.approval_status === "auto" || a.approval_status === "approved") ? h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: () => call("actionExecute", {
						actionId: Number(a.id),
						operator: "user"
					}, "已执行")
				}, t("b.in.execute")) : null, a.executed_at !== null && a.verify_at === null ? h("span", { style: {
					display: "flex",
					gap: 4,
					flex: "1 1 220px"
				} }, h("input", {
					class: "dshp-rt-input",
					style: { flex: 1 },
					placeholder: t("b.in.evidence"),
					value: evidence,
					onChange: (e) => setEvidence(e.target.value)
				}), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy,
					onClick: () => call("actionVerify", {
						actionId: Number(a.id),
						evidence: evidence || "见工单"
					}, "已验证")
				}, t("b.in.verify"))) : null, a.executed_at !== null && a.rolled_back_at === null ? h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy,
					onClick: () => call("actionRollback", {
						actionId: Number(a.id),
						note: "面板回滚"
					}, "已回滚")
				}, t("b.in.rollbackBtn")) : null))))
			});
			const timelineBlock = incident === null ? null : Block({
				title: t("b.in.timeline"),
				count: timeline.length,
				children: h("div", null, h("input", {
					class: "dshp-rt-input",
					style: {
						width: "100%",
						marginBottom: 6
					},
					placeholder: t("b.note"),
					value: note,
					onChange: (e) => setNote(e.target.value)
				}), timeline.length === 0 ? Empty({ children: t("b.empty") }) : null, timeline.map((row) => h("div", {
					key: String(row.id),
					class: "dshp-rt-ov-sub",
					style: {
						display: "flex",
						gap: 8
					}
				}, h("span", {
					class: "dshp-rt-mono",
					style: { whiteSpace: "nowrap" }
				}, fmt(row.at)), Tag({ children: String(row.kind || "") }), h("span", null, String(row.text || "")))))
			});
			const alertBlock = incident === null ? null : Block({
				title: t("b.in.alerts"),
				count: linked.length,
				children: linked.length === 0 ? Empty({ children: t("b.empty") }) : h("div", null, linked.map((a) => h("div", {
					key: String(a.id),
					class: "dshp-rt-ov-sub",
					style: {
						display: "flex",
						gap: 6
					}
				}, "#" + String(a.id), Tag({ children: String(a.severity) }), h("span", null, String(a.title)), Tag({ children: String(a.status) }))))
			});
			const right = incident === null ? Empty({ children: t("b.in.title") }) : h("div", {
				class: "dshp-rt-pane",
				style: {
					flex: 1,
					minWidth: 360,
					overflow: "auto",
					minHeight: 0
				}
			}, header, advance, propose, actionList, timelineBlock, alertBlock);
			return h("div", { class: "dshp-rt-split" }, left, right);
		}
		// client/blue/AssetsPane.tsx
		/**
		* 资产测绘（蓝队）：左侧按 外网/内网 + 网段 分组，右侧资产表，点行展开画像 / 暴露面 / 基线。
		* 与红队「资产测绘」同构：左边是地图，右边是账本，展开看细节。
		*/
		function AssetsPane(props) {
			const t = props.t;
			const [assets, setAssets] = (0, react.useState)([]);
			const [exposures, setExposures] = (0, react.useState)([]);
			const [summary, setSummary] = (0, react.useState)({});
			const [baseline, setBaseline] = (0, react.useState)({});
			const [group, setGroup] = (0, react.useState)("all");
			const [openId, setOpenId] = (0, react.useState)(null);
			const [profile, setProfile] = (0, react.useState)({});
			const [bl, setBl] = (0, react.useState)({
				category: "account",
				item: "",
				expected: "",
				actual: "",
				result: "fail"
			});
			const [err, setErr] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				blueOp("assets", { engagement: props.eng }).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setAssets(Array.isArray(r.data.items) ? r.data.items : []);
				});
				blueOp("exposures", { engagement: props.eng }).then((r) => {
					if (r.ok) {
						setExposures(Array.isArray(r.data.items) ? r.data.items : []);
						setSummary(r.data.summary ?? {});
					}
				});
				blueOp("baselineSummary", { engagement: props.eng }).then((r) => {
					if (r.ok) setBaseline(r.data);
				});
			}, [props.eng]);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			const call = (op, body, okText) => {
				blueOp(op, {
					engagement: props.eng,
					...body
				}).then((r) => {
					if (!r.ok) {
						props.notices.report(r.error, "failure");
						return;
					}
					props.notices.report(okText, "success");
					load();
				});
			};
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			const segments = (() => {
				const map = /* @__PURE__ */ new Map();
				for (const a of assets) {
					const cidr = String(a.segment_cidr || "—");
					const scope = String(a.scope || "external");
					const key = scope + "|" + cidr;
					const cur = map.get(key) || {
						cidr,
						scope,
						n: 0
					};
					cur.n += 1;
					map.set(key, cur);
				}
				return Array.from(map.values()).sort((x, y) => x.scope.localeCompare(y.scope) || x.cidr.localeCompare(y.cidr));
			})();
			const filtered = group === "all" ? assets : group === "external" || group === "internal" ? assets.filter((a) => String(a.scope || "external") === group) : assets.filter((a) => String(a.segment_cidr || "—") === group);
			const sideItem = (key, label, count, tone) => h("div", {
				key,
				style: {
					padding: "5px 8px",
					cursor: "pointer",
					fontSize: 12,
					borderRadius: 6,
					background: group === key ? "var(--dsw-alias-interactive-bg-hover)" : "transparent",
					color: tone === "external" ? "var(--dsw-alias-label-secondary)" : "inherit"
				},
				onClick: () => setGroup(key)
			}, label + " (" + count + ")");
			const detailOf = (a) => {
				const exps = exposures.filter((e) => Number(e.asset_id) === Number(a.id));
				const cur = {
					owner: a.owner || "",
					dept: a.dept || "",
					business: a.business || "",
					env: a.env || "prod",
					criticality: a.criticality || "P2",
					data_class: a.data_class || "internal"
				};
				return h("div", {
					class: "dshp-rt-card",
					style: { margin: "6px 0 10px" }
				}, h("div", { style: {
					display: "flex",
					gap: 8,
					flexWrap: "wrap",
					marginBottom: 6
				} }, h("span", { class: "dshp-rt-tag" }, "重要级 " + String(a.criticality || "P2")), h("span", { class: "dshp-rt-tag" }, String(a.env || "prod")), h("span", { class: "dshp-rt-tag" }, "暴露 " + String(a.open_exposures ?? 0)), h("span", { class: "dshp-rt-tag" }, "未研判 " + String(a.open_alerts ?? 0)), h("span", { class: "dshp-rt-tag dshp-rt-mono" }, String(a.ip))), h("div", { style: {
					display: "flex",
					gap: 6,
					flexWrap: "wrap"
				} }, [
					["owner", "责任人"],
					["dept", "部门"],
					["business", "业务"],
					["criticality", "重要级"],
					["env", "环境"],
					["data_class", "数据分级"]
				].map(([key, label]) => h("input", {
					key,
					class: "dshp-rt-input",
					style: { width: key === "business" ? 150 : 110 },
					placeholder: label,
					value: String(profile.__id === a.id ? profile[key] ?? cur[key] : cur[key]),
					onFocus: () => setProfile({
						__id: a.id,
						...cur
					}),
					onChange: (e) => setProfile((s) => ({
						__id: a.id,
						...s.__id === a.id ? s : cur,
						[key]: e.target.value
					}))
				})), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					onClick: () => {
						const p = profile.__id === a.id ? profile : cur;
						call("assetProfileSave", {
							assetId: Number(a.id),
							...p
						}, t("b.saved"));
					}
				}, t("b.save"))), exps.length > 0 ? h("div", { style: { marginTop: 8 } }, h("div", { style: {
					fontSize: 11,
					fontWeight: 600,
					marginBottom: 4
				} }, t("b.as.exposure")), exps.map((e) => h("div", {
					key: String(e.id),
					style: {
						fontSize: 11,
						display: "flex",
						gap: 6,
						padding: "2px 0"
					}
				}, h("span", { class: "dshp-rt-tag" }, String(e.severity)), h("span", null, String(e.title)), h("span", { class: "dshp-rt-tag" }, String(e.status)), h("div", { style: { flex: 1 } }), e.status === "fixed" ? null : h("button", {
					class: "dshp-rt-btn",
					type: "button",
					style: {
						padding: "0 6px",
						fontSize: 11
					},
					onClick: () => call("exposureUpdate", {
						id: Number(e.id),
						status: "fixed",
						verifiedBy: "user",
						evidenceRef: "资产页标记"
					}, t("b.saved"))
				}, t("b.as.fix"))))) : null, h("div", { style: {
					marginTop: 8,
					display: "flex",
					gap: 4,
					flexWrap: "wrap"
				} }, h("select", {
					class: "dshp-rt-input",
					value: bl.category,
					onChange: (e) => setBl((s) => ({
						...s,
						category: e.target.value
					}))
				}, [
					"account",
					"port",
					"patch",
					"config",
					"log",
					"backup"
				].map((c) => h("option", {
					key: c,
					value: c
				}, c))), h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 130px" },
					placeholder: t("b.as.item"),
					value: bl.item,
					onChange: (e) => setBl((s) => ({
						...s,
						item: e.target.value
					}))
				}), h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 110px" },
					placeholder: t("b.as.actual"),
					value: bl.actual,
					onChange: (e) => setBl((s) => ({
						...s,
						actual: e.target.value
					}))
				}), h("select", {
					class: "dshp-rt-input",
					value: bl.result,
					onChange: (e) => setBl((s) => ({
						...s,
						result: e.target.value
					}))
				}, [
					"pass",
					"fail",
					"unknown",
					"na"
				].map((x) => h("option", {
					key: x,
					value: x
				}, x))), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: () => call("baselineCheck", {
						assetId: Number(a.id),
						...bl
					}, t("b.saved"))
				}, t("b.as.runBaseline"))));
			};
			return h("div", { class: "dshp-rt-split" }, h("div", { style: {
				width: 190,
				minWidth: 150,
				overflow: "auto"
			} }, h("div", {
				class: "dshp-rt-hint",
				style: {
					fontSize: 11,
					marginBottom: 6
				}
			}, "资产 " + assets.length + " · 未收敛暴露 " + String(summary.open ?? 0) + " · 基线 fail " + String(baseline.fail ?? 0)), sideItem("all", t("b.al.all"), assets.length), sideItem("external", "外网", assets.filter((a) => String(a.scope || "external") === "external").length, "external"), sideItem("internal", "内网", assets.filter((a) => String(a.scope) === "internal").length, "external"), h("div", { style: { height: 8 } }), segments.map((s) => sideItem(s.cidr, (s.scope === "internal" ? "内 " : "外 ") + s.cidr, s.n))), h("div", { style: {
				flex: 1,
				minWidth: 320,
				overflow: "auto",
				minHeight: 0
			} }, filtered.length === 0 ? h("div", { class: "dshp-rt-empty" }, "还没有资产：用底部导入框贴 JSON 数组，或让 asset 角色导入 CMDB。") : null, filtered.map((a) => h("div", {
				key: String(a.id),
				style: { borderBottom: "1px solid var(--dsw-alias-border-l2)" }
			}, h("div", {
				style: {
					display: "flex",
					gap: 8,
					alignItems: "center",
					padding: "6px 8px",
					cursor: "pointer",
					fontSize: 12
				},
				onClick: () => setOpenId(openId === Number(a.id) ? null : Number(a.id))
			}, h("span", { style: {
				width: 12,
				color: "var(--dsw-alias-label-secondary)"
			} }, openId === Number(a.id) ? "▾" : "▸"), h("span", { class: "dshp-rt-tag" }, String(a.criticality || "P2")), h("span", { style: {
				fontWeight: 500,
				minWidth: 120
			} }, String(a.ip)), h("span", { style: {
				flex: 1,
				color: "var(--dsw-alias-label-secondary)"
			} }, String(a.primary_name || a.business || "—")), h("span", null, "暴露 " + String(a.open_exposures ?? 0)), h("span", null, "告警 " + String(a.open_alerts ?? 0)), h("span", { class: "dshp-rt-tag dshp-rt-mono" }, String(a.segment_cidr || ""))), openId === Number(a.id) ? detailOf(a) : null))), h("div", {
				class: "dshp-rt-card",
				style: {
					width: 280,
					marginTop: 0
				}
			}, h("div", { style: {
				fontSize: 11,
				marginBottom: 4
			} }, t("b.as.import")), h("textarea", {
				class: "dshp-rt-input",
				style: {
					width: "100%",
					minHeight: 80
				},
				id: "asset-import",
				placeholder: t("b.as.importHint")
			}), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					const raw = document.getElementById("asset-import")?.value || "[]";
					let rows = [];
					try {
						rows = JSON.parse(raw);
					} catch {
						props.notices.report("JSON 解析失败", "failure");
						return;
					}
					if (!Array.isArray(rows)) {
						props.notices.report("需要 JSON 数组", "failure");
						return;
					}
					call("assetImport", { rows }, "已导入 " + rows.length + " 条");
				}
			}, "导入")));
		}
		// client/blue/VulnsPane.tsx
		/**
		* 漏洞（蓝队待修清单）：左列表 + 右详情，与红队「漏洞战果」同构。
		* 红队记"打穿什么"，蓝队记"还剩什么没修"；修完必须留证据。
		*/
		const STATUSES = [
			"candidate",
			"confirmed",
			"exploited",
			"fixed",
			"false-positive"
		];
		const SEVERITIES = [
			"critical",
			"high",
			"medium",
			"low",
			"info"
		];
		function VulnsPane(props) {
			const t = props.t;
			const [items, setItems] = (0, react.useState)([]);
			const [total, setTotal] = (0, react.useState)(0);
			const [status, setStatus] = (0, react.useState)("");
			const [severity, setSeverity] = (0, react.useState)("");
			const [q, setQ] = (0, react.useState)("");
			const [sel, setSel] = (0, react.useState)(null);
			const [evidence, setEvidence] = (0, react.useState)("");
			const [form, setForm] = (0, react.useState)({
				ip: "",
				title: "",
				severity: "high",
				cve: ""
			});
			const [err, setErr] = (0, react.useState)(null);
			const [params, setParams] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				blueOp("vulns", {
					engagement: props.eng,
					status: status || void 0,
					severity: severity || void 0,
					q: q || void 0,
					limit: 300
				}).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					const list = Array.isArray(r.data.items) ? r.data.items : [];
					setItems(list);
					setTotal(Number(r.data.total || 0));
					if (sel === null && list[0] !== void 0) setSel(Number(list[0].id));
					if (props.params !== null && props.params !== void 0 && props.params.vulnId !== void 0) setSel(Number(props.params.vulnId));
				});
			}, [
				props.eng,
				status,
				severity,
				q,
				sel,
				props.params
			]);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			const call = (op, body, okText) => {
				blueOp(op, {
					engagement: props.eng,
					...body
				}).then((r) => {
					if (!r.ok) {
						props.notices.report(r.error, "failure");
						return;
					}
					props.notices.report(okText, "success");
					load();
				});
			};
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			const current = items.find((x) => Number(x.id) === sel) || null;
			const sevColor = (sev) => sev === "critical" ? "var(--dsw-alias-state-error-primary)" : sev === "high" ? "var(--dsw-alias-state-warning-primary)" : "var(--dsw-alias-interactive-bg-hover)";
			const left = h("div", { style: {
				width: "46%",
				minWidth: 300,
				display: "flex",
				flexDirection: "column",
				minHeight: 0
			} }, h("div", { style: {
				display: "flex",
				gap: 6,
				flexWrap: "wrap",
				marginBottom: 6
			} }, h("select", {
				class: "dshp-rt-input",
				value: status,
				onChange: (e) => setStatus(e.target.value)
			}, h("option", { value: "" }, t("b.vu.all") + " (" + total + ")"), STATUSES.map((s) => h("option", {
				key: s,
				value: s
			}, t("b.vu.status." + s)))), h("select", {
				class: "dshp-rt-input",
				value: severity,
				onChange: (e) => setSeverity(e.target.value)
			}, h("option", { value: "" }, t("b.ov.risk")), SEVERITIES.map((s) => h("option", {
				key: s,
				value: s
			}, s))), h("input", {
				class: "dshp-rt-input",
				style: { flex: "1 1 120px" },
				placeholder: t("b.vu.search"),
				value: q,
				onChange: (e) => setQ(e.target.value)
			})), h("div", { style: {
				overflow: "auto",
				minHeight: 0
			} }, items.length === 0 ? h("div", { class: "dshp-rt-empty" }, t("b.vu.empty")) : null, items.map((v) => h("div", {
				key: String(v.id),
				style: {
					padding: "6px 8px",
					borderBottom: "1px solid var(--dsw-alias-border-l2)",
					cursor: "pointer",
					background: sel === Number(v.id) ? "var(--dsw-alias-interactive-bg-hover)" : "transparent"
				},
				onClick: () => {
					setSel(Number(v.id));
					setEvidence("");
				}
			}, h("div", { style: {
				display: "flex",
				gap: 6,
				alignItems: "center"
			} }, h("span", { style: {
				fontSize: 11,
				fontWeight: 600,
				padding: "1px 6px",
				borderRadius: 4,
				background: sevColor(String(v.severity)),
				color: v.severity === "critical" ? "var(--dsw-alias-label-on-color)" : "inherit"
			} }, String(v.severity)), h("span", { style: {
				flex: 1,
				fontSize: 12,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap"
			} }, String(v.title)), h("span", { class: "dshp-rt-tag" }, t("b.vu.status." + String(v.status)))), h("div", { style: {
				fontSize: 10,
				color: "var(--dsw-alias-label-secondary)"
			} }, String(v.asset_ip || v.target || "—") + (v.cve ? " · " + String(v.cve) : "") + " · " + fmt(v.found_at))))));
			const right = h("div", { style: {
				flex: 1,
				minWidth: 300,
				overflow: "auto",
				minHeight: 0
			} }, current === null ? h("div", { class: "dshp-rt-empty" }, "左侧选一条漏洞；或在下方登记新的。") : h("div", null, h("h4", { style: { margin: "0 0 6px" } }, String(current.title)), h("div", { style: {
				display: "flex",
				gap: 8,
				flexWrap: "wrap",
				fontSize: 11,
				marginBottom: 8
			} }, h("span", { class: "dshp-rt-tag" }, String(current.severity)), h("span", { class: "dshp-rt-tag" }, String(current.status)), current.cve ? h("span", { class: "dshp-rt-tag dshp-rt-mono" }, String(current.cve)) : null, h("span", null, "资产：" + String(current.asset_ip || current.target || "—")), h("span", null, "来源：" + String(current.source || "—")), h("span", null, "发现：" + fmt(current.found_at))), h("div", { class: "dshp-rt-card" }, h("div", { style: {
				fontSize: 11,
				marginBottom: 4
			} }, t("b.vu.evidence")), h("textarea", {
				class: "dshp-rt-input",
				style: {
					width: "100%",
					minHeight: 60
				},
				value: evidence,
				onChange: (e) => setEvidence(e.target.value)
			}), h("div", { style: {
				display: "flex",
				gap: 6,
				marginTop: 6,
				flexWrap: "wrap"
			} }, h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				onClick: () => call("vulnUpdate", {
					vuln_id: Number(current.id),
					status: "fixed",
					evidence: evidence || "修复记录见工单"
				}, t("b.vu.fixed"))
			}, t("b.vu.markFixed")), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => call("vulnUpdate", {
					vuln_id: Number(current.id),
					status: "confirmed",
					evidence: evidence || void 0
				}, "已确认")
			}, "确认成立"), h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => call("vulnUpdate", {
					vuln_id: Number(current.id),
					status: "false-positive",
					evidence: evidence || "复测不成立"
				}, t("b.vu.falsePositive"))
			}, t("b.vu.falsePositive")))), h("div", { class: "dshp-rt-card" }, h("div", { style: {
				fontSize: 11,
				marginBottom: 4
			} }, "登记新漏洞"), h("div", { style: {
				display: "flex",
				gap: 6,
				flexWrap: "wrap"
			} }, h("input", {
				class: "dshp-rt-input",
				style: { width: 120 },
				placeholder: "IP",
				value: form.ip,
				onChange: (e) => setForm((s) => ({
					...s,
					ip: e.target.value
				}))
			}), h("input", {
				class: "dshp-rt-input",
				style: { flex: "1 1 160px" },
				placeholder: t("b.vu.title"),
				value: form.title,
				onChange: (e) => setForm((s) => ({
					...s,
					title: e.target.value
				}))
			}), h("input", {
				class: "dshp-rt-input",
				style: { width: 100 },
				placeholder: "CVE",
				value: form.cve,
				onChange: (e) => setForm((s) => ({
					...s,
					cve: e.target.value
				}))
			}), h("select", {
				class: "dshp-rt-input",
				value: form.severity,
				onChange: (e) => setForm((s) => ({
					...s,
					severity: e.target.value
				}))
			}, SEVERITIES.map((s) => h("option", {
				key: s,
				value: s
			}, s))), h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				onClick: () => {
					if (form.ip.trim() === "" || form.title.trim() === "") {
						props.notices.report("ip 与 title 必填", "failure");
						return;
					}
					call("vulnAdd", {
						ip: form.ip.trim(),
						title: form.title.trim(),
						severity: form.severity,
						cve: form.cve.trim() || void 0
					}, t("b.saved"));
					setForm({
						ip: "",
						title: "",
						severity: "high",
						cve: ""
					});
				}
			}, "登记")))));
			return h("div", { class: "dshp-rt-split" }, left, right);
		}
		// client/blue/DetectionPane.tsx
		/**
		* 检测覆盖：数据源台账 + 规则库 + ATT&CK 三色矩阵（covered / gap / blind）。
		*/
		function DetectionPane(props) {
			const t = props.t;
			const [sources, setSources] = (0, react.useState)([]);
			const [rules, setRules] = (0, react.useState)([]);
			const [cov, setCov] = (0, react.useState)({ items: [] });
			const [err, setErr] = (0, react.useState)(null);
			const [src, setSrc] = (0, react.useState)({
				kind: "host",
				product: "",
				status: "connected",
				retentionDays: "180"
			});
			const [rule, setRule] = (0, react.useState)({
				code: "",
				name: "",
				ttp: "T1059",
				sourceId: "",
				severity: "high",
				logic: ""
			});
			const load = (0, react.useCallback)(() => {
				blueOp("logSources", { engagement: props.eng }).then((r) => {
					if (r.ok) setSources(Array.isArray(r.data.items) ? r.data.items : []);
				});
				blueOp("detections", { engagement: props.eng }).then((r) => {
					if (r.ok) setRules(Array.isArray(r.data.items) ? r.data.items : []);
				});
				blueOp("coverage", { engagement: props.eng }).then((r) => {
					if (r.ok) setCov(r.data);
					else setErr(r.error);
				});
			}, [props.eng]);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			const call = (op, body, okText) => {
				blueOp(op, {
					engagement: props.eng,
					...body
				}).then((r) => {
					if (!r.ok) {
						props.notices.report(r.error, "failure");
						return;
					}
					props.notices.report(okText, "success");
					load();
				});
			};
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			const items = cov.items ?? [];
			const sourceBlock = Block({
				title: t("b.dt.sources"),
				count: sources.length,
				children: h("div", null, h("div", { class: "dshp-rt-actions" }, h("select", {
					class: "dshp-rt-input",
					value: src.kind,
					onChange: (e) => setSrc((s) => ({
						...s,
						kind: e.target.value
					}))
				}, [
					"network",
					"host",
					"app",
					"account",
					"honeypot"
				].map((k) => h("option", {
					key: k,
					value: k
				}, k))), h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 120px" },
					placeholder: t("b.dt.product"),
					value: src.product,
					onChange: (e) => setSrc((s) => ({
						...s,
						product: e.target.value
					}))
				}), h("select", {
					class: "dshp-rt-input",
					value: src.status,
					onChange: (e) => setSrc((s) => ({
						...s,
						status: e.target.value
					}))
				}, [
					"connected",
					"degraded",
					"planned",
					"offline"
				].map((k) => h("option", {
					key: k,
					value: k
				}, k))), h("input", {
					class: "dshp-rt-input",
					style: { width: 90 },
					placeholder: t("b.dt.retention"),
					value: src.retentionDays,
					onChange: (e) => setSrc((s) => ({
						...s,
						retentionDays: e.target.value
					}))
				}), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					onClick: () => call("logSourceAdd", {
						...src,
						retention_days: Number(src.retentionDays)
					}, t("b.saved"))
				}, t("b.dt.addSource"))), sources.length === 0 ? Empty({ children: t("b.empty") }) : null, sources.map((s) => h("div", {
					key: String(s.id),
					class: "dshp-rt-ov-sub",
					style: {
						display: "flex",
						gap: 6,
						padding: "2px 0"
					}
				}, Tag({
					tone: String(s.status) === "connected" ? "live" : String(s.status) === "offline" ? "warn" : "passive",
					children: String(s.status)
				}), h("span", null, String(s.kind) + " · " + String(s.product || "") + " · 留存 " + String(s.retention_days ?? "—") + " 天"), h("div", { style: { flex: 1 } }), h("span", { class: "dshp-rt-mono" }, fmt(s.last_event_at)))))
			});
			const ruleBlock = Block({
				title: t("b.dt.rules"),
				count: rules.length,
				children: h("div", null, h("div", { class: "dshp-rt-actions" }, h("input", {
					class: "dshp-rt-input",
					style: { width: 140 },
					placeholder: "code",
					value: rule.code,
					onChange: (e) => setRule((s) => ({
						...s,
						code: e.target.value
					}))
				}), h("input", {
					class: "dshp-rt-input",
					style: { flex: "1 1 140px" },
					placeholder: "name",
					value: rule.name,
					onChange: (e) => setRule((s) => ({
						...s,
						name: e.target.value
					}))
				}), h("input", {
					class: "dshp-rt-input",
					style: { width: 84 },
					placeholder: t("b.dt.ttp"),
					value: rule.ttp,
					onChange: (e) => setRule((s) => ({
						...s,
						ttp: e.target.value
					}))
				}), h("input", {
					class: "dshp-rt-input",
					style: { width: 92 },
					placeholder: "source_id",
					value: rule.sourceId,
					onChange: (e) => setRule((s) => ({
						...s,
						sourceId: e.target.value
					}))
				})), h("textarea", {
					class: "dshp-rt-textarea",
					style: {
						width: "100%",
						minHeight: 40,
						marginTop: 6
					},
					placeholder: t("b.dt.logic"),
					value: rule.logic,
					onChange: (e) => setRule((s) => ({
						...s,
						logic: e.target.value
					}))
				}), h("div", {
					class: "dshp-rt-actions",
					style: { marginTop: 6 }
				}, h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					onClick: () => call("detectionAdd", {
						...rule,
						source_id: rule.sourceId === "" ? void 0 : Number(rule.sourceId)
					}, t("b.saved"))
				}, t("b.dt.addRule"))), rules.length === 0 ? Empty({ children: t("b.empty") }) : null, rules.map((r) => h("div", {
					key: String(r.id),
					class: "dshp-rt-ov-sub",
					style: {
						display: "flex",
						gap: 6,
						padding: "2px 0"
					}
				}, Tag({
					tone: String(r.status) === "active" ? "live" : "passive",
					children: String(r.status)
				}), Tag({ children: String(r.ttp || "—") }), h("span", { style: { flex: 1 } }, String(r.code) + " · " + String(r.name)), h("span", null, r.fp_rate === null ? "" : "FP " + String(r.fp_rate)))))
			});
			const matrixBlock = Block({
				title: t("b.dt.matrix"),
				sub: t("b.dt.covered") + " " + String(cov.covered ?? 0) + " / " + String(cov.total ?? 0) + " · " + t("b.dt.gap") + " " + String(cov.gap ?? 0) + " · " + t("b.dt.blind") + " " + String(cov.blind ?? 0),
				children: h("div", { style: {
					display: "grid",
					gridTemplateColumns: "repeat(6, 1fr)",
					gap: 4
				} }, items.map((it) => h("div", {
					key: String(it.ttp),
					title: String(it.ttp) + " · " + String(it.state),
					class: "dshp-rt-tag" + (it.state === "covered" ? " dshp-rt-tag-live" : it.state === "gap" ? " dshp-rt-tag-warn" : " dshp-rt-tag-passive"),
					style: {
						justifyContent: "center",
						fontSize: 10
					}
				}, String(it.ttp))))
			});
			return h("div", {
				class: "dshp-rt-main",
				style: { overflow: "auto" }
			}, sourceBlock, ruleBlock, matrixBlock);
		}
		// client/blue/AgentsPane.tsx
		/**
		* 智能体：四个防守角色 + 提示词（可改可恢复），与红队「智能体」页同构。
		*/
		function AgentsPane(props) {
			const t = props.t;
			const [roles, setRoles] = (0, react.useState)([]);
			const [sel, setSel] = (0, react.useState)("plan");
			const [draft, setDraft] = (0, react.useState)("");
			const [err, setErr] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				blueOp("prompts", { engagement: props.eng }).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					const list = Array.isArray(r.data.roles) ? r.data.roles : [];
					setRoles(list);
					const cur = list.find((x) => x.role === sel) || list[0];
					if (cur !== void 0) {
						setSel(String(cur.role));
						setDraft(String(cur.content || ""));
					}
				});
			}, [props.eng, sel]);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			const pick = (role) => {
				setSel(role);
				const hit = roles.find((x) => x.role === role);
				setDraft(hit !== void 0 ? String(hit.content || "") : "");
			};
			const save = () => {
				blueOp("promptSave", {
					engagement: props.eng,
					role: sel,
					content: draft
				}).then((r) => {
					props.notices.report(r.ok ? t("b.saved") : r.error, r.ok ? "success" : "failure");
					if (r.ok) load();
				});
			};
			const reset = () => {
				blueOp("promptReset", {
					engagement: props.eng,
					role: sel
				}).then((r) => {
					props.notices.report(r.ok ? t("b.ag.reset") + " ✓" : r.error, r.ok ? "success" : "failure");
					if (r.ok) load();
				});
			};
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			const left = h("div", {
				class: "dshp-rt-pane",
				style: {
					width: 220,
					minWidth: 170
				}
			}, roles.length === 0 ? Empty({ children: t("b.empty") }) : null, roles.map((r) => h("div", {
				key: String(r.role),
				class: "dshp-rt-row",
				style: {
					padding: "6px 8px",
					cursor: "pointer",
					borderRadius: 6,
					background: sel === r.role ? "var(--dsw-alias-interactive-bg-hover)" : "transparent"
				},
				onClick: () => pick(String(r.role))
			}, h("div", { style: {
				display: "flex",
				gap: 6,
				alignItems: "center"
			} }, h("span", { style: {
				fontWeight: 600,
				fontSize: 12
			} }, String(r.title || r.role)), r.role === "plan" ? Tag({
				tone: "passive",
				children: "主会话"
			}) : Tag({
				tone: "live",
				children: "可派"
			})), h("div", { class: "dshp-rt-ov-sub" }, String(r.role)))), h("div", {
				class: "dshp-rt-foot",
				style: {
					borderTop: "none",
					paddingLeft: 0
				}
			}, t("b.ag.hint")));
			const right = h("div", {
				class: "dshp-rt-pane",
				style: {
					flex: 1,
					display: "flex",
					flexDirection: "column",
					minHeight: 0
				}
			}, Block({
				title: String((roles.find((x) => x.role === sel) || {}).title || sel),
				right: h("div", { class: "dshp-rt-actions" }, h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: reset
				}, t("b.ag.reset")), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					onClick: save
				}, t("b.save"))),
				children: h("textarea", {
					class: "dshp-rt-textarea",
					style: {
						width: "100%",
						minHeight: 380,
						fontFamily: "ui-monospace, Consolas, monospace"
					},
					value: draft,
					onChange: (e) => setDraft(e.target.value)
				})
			}));
			return h("div", { class: "dshp-rt-split" }, left, right);
		}
		// client/blue/ReportPane.tsx
		/**
		* 报告与复盘：技术复盘 / 管理层态势 + 红蓝只读对账（与红队「报告」页同构）。
		*/
		function ReportPane(props) {
			const t = props.t;
			const [text, setText] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)("");
			const [redRoot, setRedRoot] = (0, react.useState)("");
			const [redEng, setRedEng] = (0, react.useState)("");
			const [rec, setRec] = (0, react.useState)(null);
			const [history, setHistory] = (0, react.useState)([]);
			const [err, setErr] = (0, react.useState)(null);
			const loadHistory = (0, react.useCallback)(() => {
				blueOp("reconcileList", { engagement: props.eng }).then((r) => {
					if (r.ok) setHistory(Array.isArray(r.data.items) ? r.data.items : []);
				});
			}, [props.eng]);
			(0, react.useEffect)(() => {
				loadHistory();
			}, [loadHistory, props.refreshKey]);
			const gen = (kind) => {
				setBusy("report");
				blueOp("report", {
					engagement: props.eng,
					kind
				}).then((r) => {
					setBusy("");
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setText(String(r.data.text || ""));
				});
			};
			const runReconcile = () => {
				if (redEng.trim() === "") {
					setErr("请填红队项目 id");
					return;
				}
				setBusy("rec");
				blueOp("reconcileRun", {
					engagement: props.eng,
					redRoot: redRoot.trim() === "" ? void 0 : redRoot.trim(),
					redEngagement: redEng.trim()
				}).then((r) => {
					setBusy("");
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setRec(r.data);
					loadHistory();
				});
			};
			const left = h("div", {
				class: "dshp-rt-pane",
				style: {
					flex: 1,
					minWidth: 340,
					display: "flex",
					flexDirection: "column",
					minHeight: 0
				}
			}, Block({
				title: t("b.rp.title"),
				right: h("div", { class: "dshp-rt-actions" }, h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy !== "",
					onClick: () => gen("technical")
				}, t("b.rp.technical")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: busy !== "",
					onClick: () => gen("management")
				}, t("b.rp.management")), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					disabled: text === "",
					onClick: () => {
						copyText(text).then((ok) => props.notices.report(ok ? "已复制" : "复制失败", ok ? "success" : "failure"));
					}
				}, t("b.rp.download"))),
				children: text === "" ? Empty({ children: "生成一份报告试试：技术复盘给执行人，管理层态势给负责人。" }) : h("pre", {
					class: "dshp-rt-evi-body",
					style: {
						whiteSpace: "pre-wrap",
						maxHeight: "58vh",
						overflow: "auto"
					}
				}, text)
			}));
			const recBlock = Block({
				title: t("b.rp.reconcile"),
				children: h("div", null, h("div", {
					class: "dshp-rt-ov-sub",
					style: { marginBottom: 6 }
				}, t("b.rp.reconcileHint")), h("input", {
					class: "dshp-rt-input",
					style: {
						width: "100%",
						marginBottom: 6
					},
					placeholder: t("b.rp.redRoot"),
					value: redRoot,
					onChange: (e) => setRedRoot(e.target.value)
				}), h("div", { class: "dshp-rt-actions" }, h("input", {
					class: "dshp-rt-input",
					style: { flex: 1 },
					placeholder: t("b.rp.redProject"),
					value: redEng,
					onChange: (e) => setRedEng(e.target.value)
				}), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy !== "",
					onClick: runReconcile
				}, busy === "rec" ? t("b.loading") : t("b.rp.run"))), rec === null ? null : h("div", { style: { marginTop: 8 } }, h("div", { style: {
					display: "flex",
					gap: 6,
					flexWrap: "wrap"
				} }, Tag({
					tone: "live",
					children: t("b.rp.matched") + " " + String(rec.summary?.matched ?? 0)
				}), Tag({
					tone: "warn",
					children: t("b.rp.late") + " " + String(rec.summary?.late ?? 0)
				}), Tag({
					tone: "warn",
					children: t("b.rp.missed") + " " + String(rec.summary?.missed ?? 0)
				}), Tag({
					tone: "passive",
					children: t("b.rp.unverifiable") + " " + String(rec.summary?.unverifiable ?? 0)
				})), (rec.items ?? []).slice(0, 20).map((it) => h("div", {
					key: String(it.red_step_id) + String(it.verdict),
					class: "dshp-rt-ov-sub"
				}, "[" + String(it.verdict) + "] " + String(it.red_asset || "—") + " · " + String(it.red_title || "") + " · " + fmt(it.red_at)))))
			});
			const histBlock = Block({
				title: t("b.rp.history"),
				count: history.length,
				children: history.length === 0 ? Empty({ children: t("b.empty") }) : h("div", null, history.map((row) => h("div", {
					key: String(row.id),
					class: "dshp-rt-ov-sub"
				}, "#" + String(row.id) + " · " + fmt(row.at) + " · 红队 " + String(row.red_ref || "—") + " · 命中 " + String(row.summary?.matched ?? 0) + " / 漏 " + String(row.summary?.missed ?? 0))))
			});
			const right = h("div", {
				class: "dshp-rt-pane",
				style: { width: 380 }
			}, recBlock, histBlock, err !== null ? h("div", { class: "dshp-rt-err" }, err) : null);
			return h("div", { class: "dshp-rt-split" }, left, right);
		}
		// client/blue/SkillsPane.tsx
		/**
		* 技能库（全局）：随包蓝队技术技能，只读浏览（与红队「技能库」同构）。
		*/
		function SkillsPane(props) {
			const t = props.t;
			const [items, setItems] = (0, react.useState)([]);
			const [dir, setDir] = (0, react.useState)("");
			const [sel, setSel] = (0, react.useState)("");
			const [err, setErr] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				blueOp("skillCatalog").then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					const list = Array.isArray(r.data.items) ? r.data.items : [];
					setItems(list);
					setDir(String(r.data.dir || ""));
					if (list[0] !== void 0 && sel === "") setSel(String(list[0].id));
				});
			}, [sel]);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			if (items.length === 0) return h(Loading, { text: t("b.loading") });
			const current = items.find((x) => x.id === sel) || items[0];
			const left = h("div", {
				class: "dshp-rt-pane",
				style: {
					width: 240,
					minWidth: 180,
					overflow: "auto"
				}
			}, h("div", {
				class: "dshp-rt-ov-sub",
				style: { marginBottom: 6 }
			}, "目录：" + dir), items.map((s) => h("div", {
				key: String(s.id),
				class: "dshp-rt-row",
				style: {
					padding: "6px 8px",
					cursor: "pointer",
					borderRadius: 6,
					background: sel === s.id ? "var(--dsw-alias-interactive-bg-hover)" : "transparent"
				},
				onClick: () => setSel(String(s.id))
			}, h("div", { style: {
				display: "flex",
				gap: 6,
				alignItems: "center"
			} }, h("span", { style: {
				fontWeight: 600,
				fontSize: 12
			} }, String(s.title)), Tag({
				tone: "passive",
				children: String(s.bytes) + "B"
			})), h("div", { class: "dshp-rt-ov-sub" }, String(s.file)))));
			const right = h("div", {
				class: "dshp-rt-pane",
				style: {
					flex: 1,
					minHeight: 0
				}
			}, Block({
				title: String(current.title),
				children: h("pre", {
					class: "dshp-rt-evi-body",
					style: {
						whiteSpace: "pre-wrap",
						maxHeight: "66vh",
						overflow: "auto"
					}
				}, String(current.content || ""))
			}));
			return h("div", { class: "dshp-rt-split" }, left, right);
		}
		// client/blue/EnvPane.tsx
		/**
		* 环境适配（全局）：数据根 / 库路径 / 预设注册状态 / 版本（与红队「环境适配」同构）。
		*/
		function EnvPane(props) {
			const t = props.t;
			const [info, setInfo] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				blueOp("envInfo").then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setInfo(r.data);
				});
			}, []);
			(0, react.useEffect)(() => {
				load();
			}, [load, props.refreshKey]);
			if (err !== null) return h("div", { class: "dshp-rt-err" }, err);
			if (info === null) return h("div", { class: "dshp-rt-empty" }, t("b.loading"));
			const preset = info.preset || {};
			const stats = info.stats || {};
			const presetOk = preset.ok === true && !preset.broken;
			return h("div", {
				class: "dshp-rt-main",
				style: { overflow: "auto" }
			}, Block({
				title: t("b.tab.env"),
				right: Tag({
					tone: presetOk ? "live" : "warn",
					children: presetOk ? "预设已注册" : "预设未就绪"
				}),
				children: KV({ rows: [
					["侧别", "蓝队（防御）"],
					["数据根", h("span", { class: "dshp-rt-mono" }, String(info.root || "—"))],
					["项目数据目录", h("span", { class: "dshp-rt-mono" }, String(info.dataDir || "—"))],
					["SQLite 库", h("span", { class: "dshp-rt-mono" }, String(info.dbPath || "—"))],
					["项目数", String(info.projects ?? 0)],
					["插件版本", String(info.version || "—")],
					["预设阶段", String(preset.phase || "—") + (preset.broken ? "（broken: " + String(preset.broken) + "）" : "")],
					["技能目录", h("span", { class: "dshp-rt-mono" }, String(info.skillsDir || "—"))],
					["资产 / 端口 / 漏洞", String(stats.assets ?? 0) + " / " + String(stats.openPorts ?? 0) + " / " + String(stats.vulns ?? 0)],
					["告警 / 事件 / 规则", String(stats.alerts ?? 0) + " / " + String(stats.incidents ?? 0) + " / " + String(stats.rules ?? 0)]
				] })
			}), Block({
				title: "边界",
				children: h("div", { class: "dshp-rt-ov-sub" }, "蓝队与红队是两条平行线：这里只显示防守侧的数据根与库；红队的数据根与库不在此列，只在对账时以只读方式访问。")
			}));
		}
		// client/blue/BlueTab.tsx
		/**
		* 蓝队值守台根组件（main 面板第三个页签）。
		*
		* **与红队演练台同构**：项目头（名称/侧别/模式/SLA/范围/本会话绑定）→ 项目下拉 + 实时角标 +
		* 版本 + 刷新 → 分组页签（项目组：项目中心 / 总览 / 资产测绘 / 智能体 / 告警研判 / 漏洞 /
		* 事件处置 / 检测覆盖 / 报告；全局组：技能库 / 环境适配）→ 分页签错误边界 → 底部统计。
		*
		* 业务模型：一个防守项目 = 一个责任区工作区，各自的 SQLite 库；会话通过 session-bindings.json
		* 绑到项目。项目中心是"有哪些项目"的入口，其余页签都在"当前项目"上下文里取值。
		*/
		/** 项目组页签（都带当前项目上下文）。 */
		const PROJECT_TABS = [
			"projects",
			"overview",
			"assets",
			"agents",
			"alerts",
			"vulns",
			"incidents",
			"detection",
			"report"
		];
		/** 全局组页签（跨项目共享）。 */
		const GLOBAL_TABS = ["skills", "env"];
		const TAB_KEYS = [...PROJECT_TABS, ...GLOBAL_TABS];
		function BlueTab(props) {
			const t = props.t;
			const tt = (key, params) => {
				const value = t(key, params);
				if (value !== key) return value;
				const raw = zhBlue[key];
				if (raw === void 0) return key;
				if (params === void 0) return raw;
				return raw.replace(/\{(\w+)\}/g, (_m, k) => params[k] === void 0 ? "{" + k + "}" : String(params[k]));
			};
			const [tab, setTab] = (0, react.useState)(() => TAB_KEYS.includes(String(props.initialTab)) ? props.initialTab : "overview");
			const [params, setParams] = (0, react.useState)(null);
			const [projects, setProjects] = (0, react.useState)([]);
			const [eng, setEng] = (0, react.useState)(() => typeof props.initialEngagement === "string" && props.initialEngagement !== "" ? props.initialEngagement : null);
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			const [meta, setMeta] = (0, react.useState)(null);
			const [boundEng, setBoundEng] = (0, react.useState)(null);
			const [err, setErr] = (0, react.useState)(null);
			const [refreshKey, setRefreshKey] = (0, react.useState)(0);
			const [version, setVersion] = (0, react.useState)("");
			const [form, setForm] = (0, react.useState)({
				name: "",
				scope: "",
				mode: "drill",
				sla: "standard",
				defender: ""
			});
			const [busy, setBusy] = (0, react.useState)("");
			const [filter, setFilter] = (0, react.useState)("active");
			const [creating, setCreating] = (0, react.useState)(false);
			const liveRef = (0, react.useRef)(null);
			if (liveRef.current === null) liveRef.current = createLive((kind) => {
				if (kind === "__poll") return;
				setRefreshKey((k) => k + 1);
			}, BLUE_EVENTS_PATH);
			const live = liveRef.current;
			const liveSnap = (0, react.useSyncExternalStore)(live.subscribe, live.hooks.snapshot);
			const loadSnapshot = (0, react.useCallback)((id) => {
				if (id === null || id === "") {
					setSnapshot(null);
					setMeta(null);
					return;
				}
				blueOp("snapshot", { engagement: id }).then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setErr(null);
					setSnapshot(r.data.snapshot ?? null);
					setMeta(r.data.meta ?? null);
				});
			}, []);
			const loadBindings = (0, react.useCallback)(() => {
				if (props.sessionId === void 0 || props.sessionId === "") {
					setBoundEng(null);
					return;
				}
				blueOp("bindings").then((r) => {
					if (!r.ok) return;
					const hit = (r.data.items ?? []).find((x) => x.session === props.sessionId);
					setBoundEng(hit !== void 0 ? String(hit.engagement) : null);
				});
			}, [props.sessionId]);
			const refreshList = (0, react.useCallback)((selectId) => {
				blueOp("bootstrap").then((b) => {
					if (!b.ok) return;
					setProjects(Array.isArray(b.data.engagements) ? b.data.engagements : []);
					if (typeof b.data.version === "string") setVersion(b.data.version);
					if (selectId !== void 0) {
						setEng(selectId);
						loadSnapshot(selectId);
					}
				});
			}, [loadSnapshot]);
			(0, react.useEffect)(() => {
				installRtStyles();
			}, []);
			(0, react.useEffect)(() => {
				blueOp("bootstrap").then((r) => {
					if (!r.ok) {
						setErr(r.error);
						return;
					}
					setProjects(Array.isArray(r.data.engagements) ? r.data.engagements : []);
					if (typeof r.data.version === "string") setVersion(r.data.version);
					const id = typeof r.data.current === "string" && r.data.current !== "" ? r.data.current : null;
					if (eng === null && id !== null) {
						setEng(id);
						loadSnapshot(id);
					} else if (eng === null) setTab("projects");
				});
				loadBindings();
			}, [loadSnapshot, loadBindings]);
			(0, react.useEffect)(() => {
				live.start(eng);
				return () => {
					live.stop();
				};
			}, [eng, live]);
			const pick = (id) => {
				setEng(id);
				loadSnapshot(id);
				blueOp("activateEngagement", { engagement: id });
				setRefreshKey((k) => k + 1);
			};
			const create = () => {
				if (form.name.trim() === "") {
					props.notices.report(tt("b.namePh"), "failure");
					return;
				}
				setBusy("create");
				blueOp("openEngagement", {
					name: form.name.trim(),
					scope: form.scope.split(/[\n,，\s]+/).map((x) => x.trim()).filter(Boolean),
					mode: form.mode,
					slaProfile: form.sla,
					defender: form.defender.trim()
				}).then((r) => {
					setBusy("");
					if (!r.ok) {
						props.notices.report(r.error, "failure");
						return;
					}
					const id = r.data.engagement !== void 0 ? String(r.data.engagement.id) : "";
					setForm({
						name: "",
						scope: "",
						mode: "drill",
						sla: "standard",
						defender: ""
					});
					refreshList(id);
					if (id !== "") setTab("overview");
					props.notices.report(tt("b.create") + " ✓", "success");
				});
			};
			const bindHere = (id) => {
				if (props.sessionId === void 0 || props.sessionId === "") return;
				blueOp("bindSession", {
					sessionId: props.sessionId,
					engagement: id
				}).then((r) => {
					if (!r.ok) {
						props.notices.report(r.error, "failure");
						return;
					}
					setBoundEng(id);
					props.notices.report(tt("b.boundHere"), "success");
				});
			};
			const unbindHere = () => {
				if (props.sessionId === void 0 || props.sessionId === "") return;
				blueOp("bindSession", {
					sessionId: props.sessionId,
					engagement: ""
				}).then((r) => {
					if (!r.ok) {
						props.notices.report(r.error, "failure");
						return;
					}
					setBoundEng(null);
					props.notices.report(tt("b.unbound"), "success");
				});
			};
			const refreshAll = (0, react.useCallback)(() => {
				setRefreshKey((k) => k + 1);
				refreshList();
				if (eng !== null) loadSnapshot(eng);
				loadBindings();
			}, [
				eng,
				loadSnapshot,
				loadBindings,
				refreshList
			]);
			const jump = (0, react.useCallback)((next, nextParams) => {
				if (TAB_KEYS.includes(next)) setTab(next);
				setParams(nextParams ?? null);
				setRefreshKey((k) => k + 1);
			}, []);
			const go = (0, react.useCallback)((next) => {
				jump(next);
			}, [jump]);
			const paneProps = {
				t: tt,
				eng: eng ?? "",
				refreshKey,
				notices: props.notices,
				jump,
				params,
				go,
				snapshot
			};
			let body;
			if (tab === "projects") {
				const visible = projects.filter((p) => filter === "all" ? true : p.status !== "archived" && p.status !== "closed");
				const statusTag = (status) => status === "archived" || status === "closed" ? Tag({
					tone: "passive",
					children: status === "closed" ? "已关闭" : "已归档"
				}) : Tag({
					tone: "live",
					children: "进行中"
				});
				const projectCard = (p) => {
					const stats = p.stats || {};
					const vulnTotal = Number(stats.vulns || 0);
					const vulnFixed = Number(p.vulnFixed || 0);
					vulnTotal > 0 && Math.round(vulnFixed / vulnTotal * 100);
					return h("div", {
						key: String(p.id),
						class: "dshp-pj-card" + (eng === p.id ? " is-current" : "")
					}, h("div", { class: "dshp-pj-card-head" }, h("div", {
						class: "dshp-pj-card-name",
						title: String(p.id)
					}, String(p.name || p.id)), statusTag(String(p.status || "active")), Tag({
						tone: "live",
						children: tt("b.side")
					}), Tag({ children: p.mode === "live" ? tt("b.mode.live") : tt("b.mode.drill") }), eng === p.id ? Tag({
						tone: "active",
						children: "当前"
					}) : null), h("div", { class: "dshp-pj-meta" }, h("span", { class: "dshp-rt-mono" }, String(p.id)), h("span", { class: "dshp-pj-dot" }, "·"), h("span", null, "SLA " + String(p.sla_profile || "standard")), h("span", { class: "dshp-pj-dot" }, "·"), h("span", null, tt("b.created") + "：" + (p.created_at ? fmt(p.created_at) : "—"))), (p.scope || []).length > 0 ? h("div", { class: "dshp-pj-chips" }, (p.scope || []).map((c, i) => Tag({
						key: "c" + i,
						mono: true,
						children: c
					}))) : h("div", { class: "dshp-pj-chips" }, Tag({
						tone: "passive",
						children: "未填责任范围"
					})), h("div", { class: "dshp-pj-stats" }, h("span", null, "资产 " + Number(stats.assets || 0)), h("span", null, "漏洞 " + vulnTotal), h("span", null, "告警 " + Number(stats.alerts || 0)), h("span", null, "事件 " + Number(stats.incidents || 0))), h("div", { class: "dshp-pj-actions" }, props.enterShift !== void 0 ? h("button", {
						class: "dshp-rt-btn dshp-rt-btn-primary",
						type: "button",
						onClick: () => {
							props.enterShift?.(String(p.id)).then((ok) => {
								if (!ok) props.notices.report("会话创建失败", "failure");
							});
						}
					}, tt("b.enter")) : null, props.newShiftSession !== void 0 ? h("button", {
						class: "dshp-rt-btn",
						type: "button",
						onClick: () => {
							props.newShiftSession?.(String(p.id)).then((ok) => {
								if (!ok) props.notices.report("会话创建失败", "failure");
							});
						}
					}, tt("b.newSession")) : null, h("button", {
						class: "dshp-rt-btn",
						type: "button",
						onClick: () => {
							pick(String(p.id));
							setTab("overview");
						}
					}, tt("b.open")), props.deleteProject !== void 0 ? h("button", {
						class: "dshp-rt-btn dshp-rt-btn-danger",
						type: "button",
						onClick: () => {
							if (typeof window !== "undefined" && !window.confirm(tt("b.deleteConfirm", { name: String(p.name || p.id) }))) return;
							props.deleteProject?.(String(p.id)).then((ok) => {
								props.notices.report(ok ? "✓" : "删除失败", ok ? "success" : "failure");
								refreshList();
							});
						}
					}, tt("b.delete")) : null));
				};
				const head = h("div", { class: "dshp-pj-head" }, h("div", { class: "dshp-pj-titlebox" }, h("div", { class: "dshp-pj-title" }, tt("b.tab.projects")), h("div", { class: "dshp-pj-sub" }, tt("b.projectsSubtitle"))), h("div", { class: "dshp-rt-spacer" }), h("div", {
					class: "dshp-rt-subtabs",
					style: {
						borderBottom: "none",
						padding: 0
					}
				}, ["active", "all"].map((f) => h("button", {
					key: f,
					type: "button",
					class: "dshp-rt-subtab" + (filter === f ? " on" : ""),
					onClick: () => setFilter(f)
				}, f === "active" ? "进行中 (" + visible.length + ")" : "全部 (" + projects.length + ")"))), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					onClick: () => setCreating((v) => !v)
				}, creating ? tt("b.cancel") : tt("b.create")));
				const createCard = creating ? h("div", { class: "dshp-rt-card dshp-pj-create" }, h("div", { class: "dshp-rt-ov-title" }, tt("b.create")), Field({
					label: "名称 / 责任区",
					children: h("input", {
						class: "dshp-rt-input",
						placeholder: tt("b.namePh"),
						value: form.name,
						onChange: (e) => setForm((s) => ({
							...s,
							name: e.target.value
						})),
						onKeyDown: (e) => {
							if (e.key === "Enter") create();
						}
					})
				}), Field({
					label: "责任 CIDR",
					children: h("textarea", {
						class: "dshp-rt-textarea",
						style: {
							minHeight: 56,
							fontFamily: "ui-monospace, Consolas, monospace"
						},
						placeholder: tt("b.scopePh"),
						value: form.scope,
						onChange: (e) => setForm((s) => ({
							...s,
							scope: e.target.value
						}))
					})
				}), Field({
					label: "防守方 / 班组",
					children: h("input", {
						class: "dshp-rt-input",
						placeholder: tt("b.defenderPh"),
						value: form.defender,
						onChange: (e) => setForm((s) => ({
							...s,
							defender: e.target.value
						}))
					})
				}), Field({
					label: "模式 / SLA",
					children: h("div", { style: {
						display: "flex",
						gap: 6
					} }, h("select", {
						class: "dshp-rt-input",
						value: form.mode,
						onChange: (e) => setForm((s) => ({
							...s,
							mode: e.target.value
						}))
					}, h("option", { value: "drill" }, tt("b.mode.drill")), h("option", { value: "live" }, tt("b.mode.live"))), h("select", {
						class: "dshp-rt-input",
						value: form.sla,
						onChange: (e) => setForm((s) => ({
							...s,
							sla: e.target.value
						}))
					}, h("option", { value: "standard" }, "SLA standard"), h("option", { value: "strict" }, "SLA strict"), h("option", { value: "loose" }, "SLA loose")))
				}), h("div", { class: "dshp-pj-actions" }, h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: () => setCreating(false)
				}, tt("b.cancel")), h("button", {
					class: "dshp-rt-btn dshp-rt-btn-primary",
					type: "button",
					disabled: busy === "create" || form.name.trim() === "",
					onClick: create
				}, busy === "create" ? tt("b.creating") : tt("b.create")))) : null;
				body = h("div", {
					class: "dshp-rt-main",
					style: { overflow: "auto" }
				}, head, createCard, projects.length === 0 ? h("div", { class: "dshp-rt-empty" }, tt("b.noProjectHint")) : null, h("div", { class: "dshp-pj-grid" }, visible.map(projectCard)), projects.length > 0 ? h("div", {
					class: "dshp-rt-foot",
					style: {
						borderTop: "none",
						paddingLeft: 0
					}
				}, "共 " + projects.length + " 个项目") : null);
			} else if (err !== null) body = h("div", { class: "dshp-rt-err" }, err);
			else if (tab === "skills") body = h(SkillsPane, paneProps);
			else if (tab === "env") body = h(EnvPane, paneProps);
			else if (eng === null) body = h("div", { class: "dshp-rt-pane" }, h("div", { class: "dshp-rt-empty" }, tt("b.noProjectHint")));
			else if (tab === "overview") body = h(OverviewPane$1, paneProps);
			else if (tab === "alerts") body = h(AlertsPane, paneProps);
			else if (tab === "incidents") body = h(IncidentsPane, paneProps);
			else if (tab === "assets") body = h(AssetsPane, paneProps);
			else if (tab === "vulns") body = h(VulnsPane, paneProps);
			else if (tab === "detection") body = h(DetectionPane, paneProps);
			else if (tab === "agents") body = h(AgentsPane, paneProps);
			else if (tab === "report") body = h(ReportPane, paneProps);
			else body = h("div", { class: "dshp-rt-empty" }, tt("b.empty"));
			const isLive = liveSnap.status === "live";
			const canBind = props.sessionId !== void 0 && props.sessionId !== "";
			const isBoundHere = eng !== null && boundEng === eng;
			const stats = snapshot !== null && snapshot.stats || {};
			return h("div", { class: "dshp-rt-root" }, tab === "projects" ? null : h("div", { class: "dshp-rt-projhead" }, h("button", {
				class: "dshp-rt-btn dshp-rt-btn-ghost",
				type: "button",
				onClick: () => {
					setTab("projects");
					setParams(null);
				}
			}, "‹ " + tt("b.back")), h("span", { class: "dshp-rt-projname" }, meta !== null && meta.name ? String(meta.name) : tt("b.noProject")), h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, tt("b.side")), meta !== null ? h("span", { class: "dshp-rt-tag" }, meta.mode === "live" ? tt("b.mode.live") : tt("b.mode.drill")) : null, meta !== null ? h("span", { class: "dshp-rt-tag" }, "SLA " + String(meta.sla_profile || "standard")) : null, meta !== null && meta.created_at ? h("span", { class: "dshp-rt-projmeta" }, tt("b.created") + " " + fmt(meta.created_at)) : null, (meta !== null && meta.scope || []).slice(0, 3).map((cidr, i) => h("span", {
				key: "sc" + i,
				class: "dshp-rt-tag dshp-rt-mono"
			}, cidr)), h("div", { class: "dshp-rt-spacer" }), eng !== null && props.enterShift !== void 0 ? h("button", {
				class: "dshp-rt-btn dshp-rt-btn-primary",
				type: "button",
				onClick: () => {
					props.enterShift?.(eng).then((ok) => {
						if (!ok) props.notices.report("会话创建失败", "failure");
					});
				}
			}, tt("b.enter")) : null, eng !== null && props.newShiftSession !== void 0 ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => {
					props.newShiftSession?.(eng).then((ok) => {
						if (!ok) props.notices.report("会话创建失败", "failure");
					});
				}
			}, tt("b.newSession")) : null, canBind ? isBoundHere ? h("span", { class: "dshp-rt-tag dshp-rt-tag-live" }, tt("b.boundHere"), h("button", {
				class: "dshp-rt-linkbtn",
				type: "button",
				onClick: unbindHere
			}, "×")) : eng !== null ? h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: () => bindHere(eng)
			}, tt("b.bindHere")) : null : h("span", { class: "dshp-rt-projmeta" }, tt("b.noSession"))), h("div", { class: "dshp-rt-head" }, h("select", {
				class: "dshp-rt-input",
				style: {
					maxWidth: 190,
					flex: "1 1 150px"
				},
				value: eng ?? "",
				onChange: (e) => pick(e.target.value)
			}, h("option", {
				value: "",
				disabled: true
			}, projects.length > 0 ? tt("b.pickProject") : tt("b.noProject")), projects.map((p) => h("option", {
				key: String(p.id),
				value: String(p.id)
			}, String(p.name || p.id)))), h("span", { class: "dshp-rt-livebadge" + (isLive ? " is-live" : "") }, h("b", null), isLive ? tt("b.live") : tt("b.polling")), h("div", { class: "dshp-rt-spacer" }), version !== "" ? h("span", { class: "dshp-rt-tag" }, "v" + version) : null, h("button", {
				class: "dshp-rt-btn",
				type: "button",
				onClick: refreshAll
			}, tt("b.refresh"))), h("div", {
				class: "dshp-rt-tabs",
				role: "tablist"
			}, PROJECT_TABS.map((k) => h("div", {
				key: k,
				class: "dshp-rt-tab" + (tab === k ? " on" : ""),
				role: "tab",
				tabIndex: 0,
				"aria-selected": tab === k ? "true" : "false",
				onClick: () => {
					setTab(k);
					setParams(null);
					setRefreshKey((n) => n + 1);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setTab(k);
						setParams(null);
						setRefreshKey((n) => n + 1);
					}
				}
			}, tt("b.tab." + k))), h("span", { class: "dshp-rt-tabsep" }, tt("b.group.global")), GLOBAL_TABS.map((k) => h("div", {
				key: k,
				class: "dshp-rt-tab dshp-rt-tab-global" + (tab === k ? " on" : ""),
				role: "tab",
				tabIndex: 0,
				"aria-selected": tab === k ? "true" : "false",
				onClick: () => {
					setTab(k);
					setParams(null);
					setRefreshKey((n) => n + 1);
				},
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setTab(k);
						setParams(null);
						setRefreshKey((n) => n + 1);
					}
				}
			}, tt("b.tab." + k)))), h("div", {
				class: "dshp-rt-body",
				key: "body-" + tab
			}, h(BtBoundary, {
				key: tab,
				t: tt,
				onBack: () => {
					setTab("projects");
					setRefreshKey((n) => n + 1);
				}
			}, body)), h("div", { class: "dshp-rt-foot" }, h("span", null, tt("b.foot.assets", { n: stats.assets ?? 0 })), h("span", null, tt("b.foot.ports", { n: stats.openPorts ?? 0 })), h("span", null, tt("b.foot.vulns", { n: stats.vulns ?? 0 })), h("span", null, tt("b.foot.alerts", { n: stats.unhandledAlerts ?? 0 })), h("span", null, tt("b.foot.incidents", { n: stats.openIncidents ?? 0 })), h("span", null, tt("b.foot.exposures", { n: stats.openExposures ?? 0 })), h("span", null, tt("b.foot.rules", { n: stats.rules ?? 0 })), h("div", { class: "dshp-rt-spacer" }), h("span", null, "SQLite · " + (meta !== null && meta.name ? String(meta.name) : ""))));
		}
		var BtBoundary = class extends react.Component {
			constructor(props) {
				super(props);
				this.state = { error: null };
			}
			static getDerivedStateFromError(error) {
				return { error };
			}
			componentDidCatch(error) {
				try {
					console.error("[dsh-purge blueteam] tab render error:", error);
				} catch {}
			}
			render() {
				if (this.state.error !== null) return h("div", { class: "dshp-rt-pane" }, h("div", { class: "dshp-rt-err" }, "子页签渲染出错：" + (this.state.error.message || String(this.state.error))), h("button", {
					class: "dshp-rt-btn",
					type: "button",
					onClick: () => {
						this.setState({ error: null });
						this.props.onBack();
					}
				}, "返回项目中心"));
				return this.props.children;
			}
		};
		// client/main/PurgeMain.tsx
		/**
		* main 槽位（root 作用域，key: dsh-purge）的全局主面板。
		*
		* 版式分工（v2.18 去重后）：
		*   - 这里只有两页：**总览**（开工检查 + 进入演练）与 **红队演练台**（全宽工作台）；
		*   - 项目的新建 / 改名 / 归档 / 删除只在演练台「项目中心」——面板不再保留第二套表单；
		*   - 人格 / 规则集 / 技能 / 更新属于全局配置，只存在于「设置 → 破甲」，右上 ⚙ 一键直达
		*     （以前这里还有第三个页签渲染同一份设置页，等于把一张表单挂了两处）。
		*
		* 进入演练 = 切到该项目工作区并打开一个红队模式会话：进去就是一个能说话的对话，
		* 不写草稿、不要求回车；想再开一个点「新建对话」。
		*/
		const TABS = [
			"overview",
			"redteam",
			"blueteam"
		];
		const TAB_LABELS = {
			overview: "main.tab.overview",
			redteam: "main.tab.redteam",
			blueteam: "main.tab.blueteam"
		};
		function PurgeMain(props) {
			const t = props.t;
			const state = (0, react.useSyncExternalStore)(props.nav.subscribe, props.nav.getSnapshot);
			const tab = state.tab;
			const services = props.probeServices();
			/** 页签键盘导航：左右方向键在同一组 role=tab 之间移动。 */
			const move = (dir) => {
				const index = TABS.indexOf(tab);
				props.nav.select(TABS[(index + dir + TABS.length) % TABS.length]);
			};
			return h("div", { class: "dshp-main" }, h("div", { class: "dshp-main-head" }, h("div", { class: "dshp-main-brand" }, h("span", { class: "dshp-main-title" }, t("main.title")), h("span", { class: "dshp-main-sub" }, t("main.subtitle"))), h("div", {
				class: "dshp-main-tabs",
				role: "tablist"
			}, TABS.map((key) => h("button", {
				key,
				type: "button",
				role: "tab",
				"aria-selected": tab === key ? "true" : "false",
				class: "dshp-main-tab" + (tab === key ? " on" : ""),
				tabIndex: tab === key ? 0 : -1,
				onClick: () => {
					props.nav.select(key);
				},
				onKeyDown: (event) => {
					if (event.key === "ArrowRight") {
						event.preventDefault();
						move(1);
					} else if (event.key === "ArrowLeft") {
						event.preventDefault();
						move(-1);
					}
				}
			}, t(TAB_LABELS[key])))), h("div", { class: "dshp-spacer" }), h("button", {
				class: "dshp-btn dshp-btn-ghost",
				type: "button",
				title: services.layout ? t("main.closeHint") : t("main.closeUnavailable"),
				"aria-label": t("main.closeHint"),
				disabled: !services.layout,
				onClick: () => {
					props.closeMain();
				}
			}, "✕"), h("button", {
				class: "dshp-btn",
				type: "button",
				title: t("main.settingsLink"),
				"aria-label": t("main.settingsLink"),
				onClick: props.openSettings
			}, "⚙")), h("div", { class: "dshp-main-body" }, tab === "overview" ? h(OverviewPane, {
				t,
				notices: props.notices,
				nav: props.nav,
				enterDrill: props.enterDrill,
				newDrillSession: props.newDrillSession,
				probeServices: props.probeServices
			}) : tab === "blueteam" ? h("div", { class: "dshp-main-fill" }, h(BlueTab, {
				t: props.tb,
				notices: props.notices,
				sessionId: state.sessionId === null ? void 0 : state.sessionId,
				enterShift: props.enterShift,
				newShiftSession: props.newShiftSession,
				deleteProject: props.deleteBlueProject
			})) : h("div", { class: "dshp-main-fill" }, h(RedteamTab, {
				t: props.trt,
				notices: props.notices,
				sessionId: state.sessionId === null ? void 0 : state.sessionId,
				enterDrill: props.enterDrill,
				newDrillSession: props.newDrillSession,
				deleteProject: props.deleteProject,
				openSettings: props.openSettings
			}))));
		}
		function OverviewPane(props) {
			const t = props.t;
			const projects = useProjects();
			const [doctor, setDoctor] = (0, react.useState)(null);
			const [doctorError, setDoctorError] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)("");
			const [repairing, setRepairing] = (0, react.useState)(false);
			const [current, setCurrent] = (0, react.useState)("");
			const reloadProjects = projects.reload;
			const items = projects.items;
			const serverCurrent = projects.current;
			const loadDoctor = (0, react.useCallback)(() => {
				rtOp("drillDoctor").then((doc) => {
					if (!doc.ok) {
						setDoctorError(doc.error);
						return;
					}
					setDoctorError(null);
					setDoctor(doc.data);
				});
			}, []);
			(0, react.useEffect)(() => {
				loadDoctor();
			}, [loadDoctor]);
			(0, react.useEffect)(() => {
				if (items === null || items.length === 0) {
					setCurrent("");
					return;
				}
				setCurrent((prev) => {
					if (prev !== "" && items.some((row) => row.id === prev)) return prev;
					if (serverCurrent !== "" && items.some((row) => row.id === serverCurrent)) return serverCurrent;
					return String(items[0].id);
				});
			}, [items, serverCurrent]);
			const services = props.probeServices();
			const servicesOk = services.uiWorkspace && services.workspaces;
			const preset = doctor !== null && doctor.preset !== void 0 ? doctor.preset : null;
			const presetOk = preset !== null && preset.declared === true && (preset.broken === null || preset.broken === void 0);
			const presetBroken = preset !== null && (preset.declared !== true || preset.broken !== null && preset.broken !== void 0);
			const run = async (kind) => {
				if (current === "") {
					props.notices.report(t("main.noProject"), "failure");
					return;
				}
				setBusy(kind);
				try {
					if (!(kind === "enter" ? await props.enterDrill(current) : await props.newDrillSession(current))) props.notices.report(t("main.sessionUnavailable"), "failure");
				} finally {
					setBusy("");
				}
			};
			const picked = items === null ? void 0 : items.find((row) => row.id === current);
			const tile = (key, value, mod, title) => h("div", { class: "dshp-check" + (mod === void 0 ? "" : " " + mod) }, h("div", { class: "dshp-check-key" }, key), h("div", {
				class: "dshp-check-val" + (mod === "store" ? " dshp-mono-ellipsis" : ""),
				title
			}, value));
			return h("div", { class: "dshp-main-scroll" }, h("div", { class: "dshp-card" }, h("div", { class: "dshp-card-head" }, h("div", { class: "dshp-card-title" }, t("main.doc.title")), h("div", { class: "dshp-spacer" }), h("button", {
				class: "dshp-btn dshp-btn-ghost",
				type: "button",
				onClick: () => {
					loadDoctor();
					reloadProjects();
				}
			}, t("main.doc.refresh"))), doctor === null && doctorError === null ? h(Loading, { text: t("common.loading") }) : null, doctorError !== null ? h("div", { class: "dshp-hint" }, t("main.doc.loadFail") + "：" + doctorError) : null, h("div", { class: "dshp-check-grid" }, tile(t("main.doc.services"), servicesOk ? t("main.doc.servicesOk") : t("main.doc.servicesBad"), servicesOk ? "ok" : "bad")), doctor !== null ? h("div", { class: "dshp-check-grid" }, tile(t("main.doc.preset"), presetOk ? t("main.doc.presetOk") : preset === null || preset.declared !== true ? t("main.doc.presetMissing") : t("main.doc.presetBroken"), presetOk ? "ok" : "bad"), tile(t("main.doc.projects"), String(doctor.projects === null || doctor.projects === void 0 ? "—" : doctor.projects)), tile(t("main.doc.skills"), String(doctor.skills === null || doctor.skills === void 0 ? "—" : doctor.skills)), tile(t("main.doc.agents"), String(doctor.agents === void 0 || doctor.agents === null ? "—" : doctor.agents.max)), tile(t("main.doc.store"), String(doctor.root ?? "—"), "store", String(doctor.root ?? ""))) : null, presetBroken ? h("div", { class: "dshp-actions" }, h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				disabled: repairing,
				onClick: () => {
					setRepairing(true);
					rtOp("presetRepair").then((r) => {
						setRepairing(false);
						props.notices.report(r.ok ? t("main.doc.repairOk") : t("main.doc.repairFail") + "：" + r.error, r.ok ? "success" : "failure");
						loadDoctor();
					});
				}
			}, repairing ? t("main.doc.repairing") : t("main.doc.repair")), h("div", { class: "dshp-hint" }, t("main.doc.repairHint"))) : null, h("div", { class: "dshp-hint" }, t("main.doc.flow"))), h("div", { class: "dshp-card" }, h("div", { class: "dshp-card-title" }, t("main.enterTitle")), h("div", { class: "dshp-field" }, h("div", { class: "dshp-hint" }, t("main.doc.projectLabel")), h("select", {
				class: "dshp-select",
				style: { width: "100%" },
				value: current,
				onChange: (e) => {
					setCurrent(e.target.value);
				}
			}, current === "" ? h("option", { value: "" }, t("main.noProject")) : null, (items ?? []).map((row) => h("option", {
				key: row.id,
				value: row.id
			}, String(row.name || row.id)))), picked !== void 0 ? h("div", { class: "dshp-hint" }, t("rt.pj.workspace") + "：" + (picked.workspace_id ? t("rt.pj.workspaceReady") : t("rt.pj.workspacePending")) + " · " + String(picked.dir || "")) : null), h("div", { class: "dshp-actions" }, h("button", {
				class: "dshp-btn dshp-btn-primary",
				type: "button",
				disabled: busy !== "" || current === "",
				title: t("main.enterHint"),
				onClick: () => {
					run("enter");
				}
			}, busy === "enter" ? t("common.loading") : t("main.enter")), h("button", {
				class: "dshp-btn",
				type: "button",
				disabled: busy !== "" || current === "",
				title: t("main.newSessionHint"),
				onClick: () => {
					run("new");
				}
			}, busy === "new" ? t("common.loading") : t("main.newSession")), h("button", {
				class: "dshp-btn dshp-btn-ghost",
				type: "button",
				onClick: () => {
					props.nav.select("redteam");
				}
			}, t("main.quick.redteam"))), h("div", { class: "dshp-hint" }, t("main.doc.workspaceHint")), h("div", { class: "dshp-hint" }, t("main.doc.roles"))));
		}
		// client/main/PurgeIcon.tsx
		/**
		* 左侧栏导航图标（sidebar.panellist 项，id 与 main 面板 key 同名）。
		*
		* 纯 SVG + currentColor，随主题自适应；包内不带图片资产。
		* 图形：盾形轮廓 + 中间一道裂口，对应「破甲」语义。
		*/
		function PurgeIcon() {
			return h("svg", {
				width: 18,
				height: 18,
				viewBox: "0 0 24 24",
				fill: "none",
				"aria-hidden": "true",
				focusable: "false"
			}, h("path", {
				d: "M12 2.6 20 6v6.1c0 4.6-3.2 8.1-8 9.3-4.8-1.2-8-4.7-8-9.3V6z",
				stroke: "currentColor",
				"stroke-width": 1.5,
				"stroke-linejoin": "round"
			}), h("path", {
				d: "M12.4 6.8 10 12h3.2l-1.8 5.2",
				stroke: "currentColor",
				"stroke-width": 1.5,
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			}));
		}
		// client/main/nav.ts
		/** 创建导航状态（插件内单例，按 apply 生命周期持有）。 */
		function createMainNav(initial = "overview") {
			let state = {
				tab: initial,
				sessionId: null
			};
			const listeners = /* @__PURE__ */ new Set();
			const publish = (next) => {
				if (next.tab === state.tab && next.sessionId === state.sessionId) return;
				state = next;
				for (const listener of [...listeners]) listener();
			};
			return {
				select(tab, sessionId) {
					publish({
						tab,
						sessionId: sessionId === void 0 ? state.sessionId : sessionId
					});
				},
				getSnapshot: () => state,
				subscribe(listener) {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				}
			};
		}
		// client/redteam/locale.ts
		/**
		* 红队演练台词典（zh / en），命名空间 dsh-purge-redteam。
		*
		* 与主面板词典分开注册（index.ts 里 locale.register 两次）；两份词典 key 集合必须一致。
		* 枚举标签（rt.test.* / rt.sev.* / rt.role.* / rt.poccat.* 等）由 bits.tsx 的
		* label 帮助函数按 key 拼接取词，缺失时退回原始代码值。
		*/
		/** 演练台词典命名空间（同时是页签类型 id）。 */
		const RT_NS = "dsh-purge-redteam";
		/** 中文词典（基准语言）。 */
		const zh = {
			"rt.title": "红队演练台",
			"rt.loading": "加载中…",
			"rt.empty": "（空）",
			"rt.unknown": "未知",
			"rt.v.badgeTip": "当前版本 {v}；更新在「设置 → 破甲」",
			"rt.refresh": "刷新",
			"rt.refreshing": "刷新中…",
			"rt.refreshAllTitle": "刷新名册、快照与当前页面数据",
			"rt.save": "保存",
			"rt.saved": "已保存",
			"rt.saving": "保存中…",
			"rt.cancel": "取消",
			"rt.copy": "复制",
			"rt.copied": "已复制：{label}",
			"rt.copiedShort": "已复制",
			"rt.copyFail": "复制失败（浏览器未授权剪贴板）—— 请手动选中文本复制",
			"rt.copyThis": "复制这一条",
			"rt.edit": "编辑",
			"rt.delete": "删除",
			"rt.deleted": "已删除",
			"rt.needRestart": "该模块的宿主代码已更新，需重启一次当前宿主（官方 exe / 社区版 / dsh web）后生效",
			"rt.renderError": "该页面渲染出错：",
			"rt.backToAssets": "回到资产测绘",
			"rt.unknownTab": "未知页签",
			"rt.unnamed": "未命名",
			"rt.clipExpand": "展开",
			"rt.clipCollapse": "收起",
			"rt.creating": "创建中…",
			"rt.create": "创建靶标",
			"rt.noEngTitle": "还没有靶标",
			"rt.noEngHint": "输入攻防演练靶标单位名称，创建演练并开始资产测绘。",
			"rt.noEngPh": "例如：示例科技有限公司",
			"rt.noEngGlobalHint": "知识库 / 环境适配 / 技能库 / 智能体为全局页，无需靶标即可查看。",
			"rt.noEngYet": "暂无靶标",
			"rt.pickEng": "选择靶标",
			"rt.toast.score": "得分更新：战况有新变化",
			"rt.tab.overview": "总览",
			"rt.tab.assets": "资产测绘",
			"rt.tab.env": "环境适配",
			"rt.tab.agents": "智能体",
			"rt.tab.sessions": "会话隧道",
			"rt.tab.findings": "漏洞战果",
			"rt.tab.chain": "攻击链",
			"rt.tab.scores": "得分目标",
			"rt.tab.report": "报告",
			"rt.tab.knowledge": "知识库",
			"main.enter": "进入演练",
			"main.enterHint": "切到该项目的工作区并打开一个红队模式会话（可直接说话）",
			"main.newSession": "新建对话",
			"main.newSessionHint": "在同一项目工作区里再开一个红队模式会话",
			"main.deleteProject": "删除项目",
			"main.deleteConfirm": "删除「{name}」？会删除项目目录（资产库/报告全在内）并移除对应工作区，不可恢复。",
			"main.sessionUnavailable": "当前宿主没有可用的会话服务：请点左上「新建会话」，在模式里选「红队模式」",
			"common.retry": "重试",
			"common.cancel": "取消",
			"panel.bindOk": "已绑定到「{name}」",
			"panel.bindingFail": "绑定失败",
			"panel.unbindOk": "已解绑本会话",
			"rt.tab.skills": "技能库",
			"rt.tab.projects": "项目中心",
			"rt.pj.title": "项目中心",
			"rt.pj.subtitle": "一个项目 = 一个靶标工作区：资产、漏洞、攻击链、得分与报告各自独立，互不串写。",
			"rt.pj.new": "新建项目",
			"rt.pj.name": "项目名称（靶标单位）",
			"rt.pj.namePh": "例：某某科技有限公司",
			"rt.pj.scope": "授权范围（CIDR，每行一个，可留空）",
			"rt.pj.scopePh": "203.0.113.0/24",
			"rt.pj.note": "目标说明（可选，写进项目元信息）",
			"rt.pj.create": "创建项目",
			"rt.pj.creating": "创建中…",
			"rt.pj.cancel": "取消",
			"rt.pj.empty": "还没有项目。新建一个项目后，资产测绘、漏洞战果、攻击链与报告都会落在它自己的库里。",
			"rt.pj.workspace": "工作区",
			"rt.pj.workspaceReady": "已绑定",
			"rt.pj.workspacePending": "将自动创建",
			"rt.pj.copyDir": "复制目录",
			"rt.pj.dirCopied": "目录已复制",
			"rt.pj.copyFail": "复制失败",
			"rt.pj.drill": "开始演练",
			"rt.pj.drillHint": "新建一个跑「红队模式」预设的会话，开场白已写好预检→开靶→五角色派活，发出去即可让指挥智能体自己调人。",
			"rt.pj.noWorkspace": "当前工作区不支持一键建会话：请点右上「＋新建会话」，在模式下拉选「红队模式」",
			"rt.pj.enter": "进入工作台",
			"rt.pj.setCurrent": "设为当前项目",
			"rt.pj.current": "当前",
			"rt.pj.boundSessions": "绑定会话 {n}",
			"rt.pj.archive": "归档",
			"rt.pj.restore": "恢复",
			"rt.pj.archived": "已归档",
			"rt.pj.active": "进行中",
			"rt.pj.closed": "已收尾",
			"rt.pj.stat.assets": "资产",
			"rt.pj.stat.vulns": "漏洞",
			"rt.pj.stat.points": "得分",
			"rt.pj.lastActivity": "最近活动",
			"rt.pj.never": "尚无活动",
			"rt.pj.filter.all": "全部",
			"rt.pj.filter.active": "进行中",
			"rt.pj.filter.archived": "已归档",
			"rt.pj.edit": "编辑",
			"rt.pj.save": "保存",
			"rt.pj.saved": "已保存",
			"rt.pj.rename": "项目名称",
			"rt.pj.status": "项目状态",
			"rt.pj.editScope": "授权范围（CIDR，逗号分隔）",
			"rt.pj.editNote": "目标说明",
			"rt.pj.noScope": "未填授权范围",
			"rt.pj.archiveConfirm": "归档「{name}」？归档后仍可查看历史数据，但会从默认列表折叠。",
			"rt.pj.openFailed": "打开项目失败",
			"rt.pj.createFailed": "创建项目失败",
			"rt.pj.updateFailed": "保存失败",
			"rt.pj.deleted": "已删除项目「{name}」（含目录与工作区）",
			"rt.pj.count": "共 {n} 个项目",
			"rt.head.created": "创建于",
			"rt.head.noProject": "未选择项目",
			"rt.head.backToProjects": "项目中心",
			"rt.head.bindHere": "绑定本会话",
			"rt.head.boundHere": "本会话已绑定",
			"rt.head.unbind": "解绑本会话",
			"rt.head.bindHint": "绑定后，本会话里的红队智能体只读写这个项目。",
			"rt.head.noSession": "从会话内打开面板时可绑定本会话",
			"rt.group.global": "全局",
			"rt.group.globalHint": "知识库、技能库与环境适配跨项目共享。",
			"rt.live.live": "live",
			"rt.live.polling": "polling",
			"rt.live.liveTip": "已连接事件流（SSE）：资产 / 漏洞 / 得分变化实时刷新",
			"rt.live.pollingTip": "事件流不可用，已退回 5 秒轮询刷新当前页签",
			"rt.foot.segments": "C 段 {n}",
			"rt.foot.assets": "资产 {n}（存活 {live}）",
			"rt.foot.ports": "端口 {n}",
			"rt.foot.fingerprints": "指纹 {n}",
			"rt.foot.vulns": "漏洞 {n}",
			"rt.foot.signals": "被动/主动 {p}/{a}",
			"rt.test.untested": "未测试",
			"rt.test.testing": "测试中",
			"rt.test.tested": "已测试",
			"rt.test.blocked": "被封禁",
			"rt.test.abandoned": "已放弃",
			"rt.test.no_surface": "无攻击面",
			"rt.pri.title": "易打",
			"rt.pri.high": "易打（高）",
			"rt.pri.medium": "一般（中）",
			"rt.pri.low": "难打（低）",
			"rt.pri.none": "未评",
			"rt.sev.critical": "严重",
			"rt.sev.high": "高危",
			"rt.sev.medium": "中危",
			"rt.sev.low": "低危",
			"rt.sev.info": "信息",
			"rt.vulnstatus.candidate": "待验证",
			"rt.vulnstatus.confirmed": "已确认",
			"rt.vulnstatus.exploited": "已利用",
			"rt.vulnstatus.false-positive": "误报",
			"rt.vulnstatus.fixed": "已修复",
			"rt.prov.passive": "被动",
			"rt.prov.active": "主动",
			"rt.prov.unknown": "未知",
			"rt.scope.internal": "内网",
			"rt.scope.external": "外网",
			"rt.scope.inShort": "内",
			"rt.scope.outShort": "外",
			"rt.scope.internalAsset": "内网资产",
			"rt.scope.externalAsset": "外网资产",
			"rt.role.plan": "主会话（指挥）",
			"rt.role.recon": "信息收集",
			"rt.role.assess": "资产梳理",
			"rt.role.vuln-scan": "漏洞发现",
			"rt.role.exploit": "漏洞利用",
			"rt.role.internal": "内网渗透",
			"rt.filekind.poc": "POC",
			"rt.filekind.exp": "EXP",
			"rt.filekind.script": "脚本",
			"rt.filekind.wordlist": "字典",
			"rt.filekind.other": "其他",
			"rt.pockind.poc": "POC",
			"rt.pockind.exp": "EXP",
			"rt.pockind.script": "脚本",
			"rt.pockind.template": "模板",
			"rt.pockind.payload": "载荷",
			"rt.pocsource.web": "互联网",
			"rt.pocsource.self": "手搓",
			"rt.pocsource.manual": "人工",
			"rt.pocsource.nuclei-template": "nuclei 模板",
			"rt.pocsource.kb": "知识库",
			"rt.poccat.rce": "远程命令执行",
			"rt.poccat.deserialization": "反序列化",
			"rt.poccat.file-upload": "文件上传 getshell",
			"rt.poccat.sqli": "SQL 注入",
			"rt.poccat.unauthorized": "未授权访问",
			"rt.poccat.auth-bypass": "认证绕过 / 越权",
			"rt.poccat.weak-password": "弱口令 / 爆破",
			"rt.poccat.ssrf": "SSRF",
			"rt.poccat.xxe": "XXE",
			"rt.poccat.path-traversal": "目录穿越 / 任意文件读",
			"rt.poccat.info-leak": "信息泄露",
			"rt.poccat.privesc": "提权 / 横向",
			"rt.poccat.tunnel": "隧道 / 代理",
			"rt.poccat.other": "其它",
			"rt.shot.title": "证据截图",
			"rt.shot.alt": "证据",
			"rt.shot.showing": "显示 {n} 张",
			"rt.shot.ofTotal": "（该得分点共 {n} 张，取代表图）",
			"rt.shot.screenshot": "现场截图",
			"rt.shot.card": "记录生成的证据摘录",
			"rt.shot.screenshotTitle": "现场截图",
			"rt.shot.cardTitle": "由当日记录生成的证据摘录，不是现场截图 —— 报告里同样会标注",
			"rt.shot.cardSuffix": "由当日记录生成（非现场截图）",
			"rt.shot.zoomClose": "点击任意处关闭",
			"rt.a.searchPh": "搜索 IP / 域名 / 指纹（回车）",
			"rt.a.search": "搜索",
			"rt.a.service": "服务",
			"rt.a.port": "端口",
			"rt.a.scopeAny": "内外网不限",
			"rt.a.scopeExt": "仅外网资产",
			"rt.a.scopeInt": "仅内网资产",
			"rt.a.provTitle": "按端口来源过滤（列表已不再单列显示，详情里可见）",
			"rt.a.provAny": "来源不限",
			"rt.a.provPassive": "仅被动",
			"rt.a.provActive": "仅主动",
			"rt.a.priAny": "易打性不限",
			"rt.a.testAny": "测试状态不限",
			"rt.a.viewList": "列表",
			"rt.a.viewTimeline": "发现时间",
			"rt.a.viewTimelineTitle": "按发现时间看资产（什么时候发现、哪天收了多少）",
			"rt.a.viewDomain": "域名",
			"rt.a.viewWeb": "Web",
			"rt.a.refreshTitle": "重新拉取快照与当前视图数据",
			"rt.a.allCidr": "全部 C 段",
			"rt.a.nSegs": "{n} 个网段",
			"rt.a.testingEntry": "当前测试",
			"rt.a.testingShort": "测",
			"rt.a.testingTitle": "正在跑的扫描 / 探测与进度（在「总览」页常驻展示）",
			"rt.a.testingGo": "去总览",
			"rt.a.extAssets": "外网资产",
			"rt.a.intAssets": "内网资产",
			"rt.a.nCidr": "{n} 个 C 段",
			"rt.a.nAssetsUnit": "{n} 资产",
			"rt.a.nHosts": "{n} 台",
			"rt.a.collapseGroup": "收起本组（并切回资产列表）",
			"rt.a.expandGroup": "展开本组（并切回资产列表）",
			"rt.a.filterCidr": "筛选 C 段 {cidr}",
			"rt.a.unknownOrg": "未知归属",
			"rt.a.liveOf": "存活 {live}/{total} 台",
			"rt.a.sortTitle": "列表排序方式",
			"rt.a.sortPriority": "排序：易打性优先",
			"rt.a.sortTodo": "排序：待测优先",
			"rt.a.sortDiscovered": "排序：最近发现优先",
			"rt.a.sortPorts": "排序：端口多优先",
			"rt.a.sortIp": "排序：按 IP",
			"rt.a.filterHint": "点击筛选 / 再点取消",
			"rt.a.filterBy": "按「{label}」筛选（{n}）",
			"rt.a.nAssets": "台资产",
			"rt.a.nLive": "存活",
			"rt.a.nUntested": "待测",
			"rt.a.nGiveup": "放弃",
			"rt.a.hIp": "IP",
			"rt.a.hTest": "测试状态",
			"rt.a.hPorts": "开放端口 / 服务",
			"rt.a.hFp": "指纹",
			"rt.a.stateLive": "存活",
			"rt.a.discoverUnknown": "发现时间未知",
			"rt.a.discoveredAt": "发现时间",
			"rt.a.discoveredTip": "本条资产第一次进入资产库的时刻（重复采集只刷新「最近采集」）",
			"rt.a.lastSeen": "最近采集",
			"rt.a.blockedShort": "封{n}",
			"rt.a.expandAsset": "展开资产 {ip}",
			"rt.a.dTest": "测试",
			"rt.a.blockedN": "被封 {n} 次",
			"rt.a.notTested": "未测过",
			"rt.a.priNone": "未评估",
			"rt.a.dSurface": "攻击面",
			"rt.a.surfaceUnrecorded": "未记录（开放端口见下）",
			"rt.a.noPorts": "无开放端口",
			"rt.a.more": "展开全部（端口 · 指纹 · 采集溯源 · 测试记录）▼",
			"rt.a.less": "收起全部 ▲",
			"rt.a.hostnames": "主机名",
			"rt.a.firstSeen": "数据源首见",
			"rt.a.dCidr": "C 段",
			"rt.a.priExpect": "预期：",
			"rt.a.priReason": "依据：",
			"rt.a.dSource": "来源",
			"rt.a.passivePorts": "被动端口 {n}",
			"rt.a.activePorts": "主动端口 {n}",
			"rt.a.openPorts": "开放端口 / 服务",
			"rt.a.unknownService": "未知服务",
			"rt.a.cveNoId": "配置类",
			"rt.a.notes": "测试记录（{n} 条）",
			"rt.a.notesShort": "测试记录",
			"rt.a.observations": "采集溯源（最近 8 条）",
			"rt.a.unknownTool": "未知工具",
			"rt.a.noMatch": "没有匹配的资产",
			"rt.a.nAssetsTag": "{n} 个资产",
			"rt.a.domainEmptyCidr": "该 C 段下暂无域名（切换到「全部 C 段」看全量）",
			"rt.a.domainEmpty": "暂无域名数据（信息收集阶段会写入域名）",
			"rt.a.webUrl": "URL（可点击）",
			"rt.a.webTitle": "标题",
			"rt.a.webAsset": "资产",
			"rt.a.webService": "服务",
			"rt.a.webEmptyCidr": "该 C 段下暂无 Web 资产",
			"rt.a.webEmpty": "暂无 Web 资产（HTTP 探测后会写入 URL 与标题）",
			"rt.a.dPorts": "端口 {n}",
			"rt.dt.title": "资产发现时间线",
			"rt.dt.span": "共 {n} 台 · 最早 {first} · 最近 {last}（发现时间 = 第一次进入资产库的时刻；重复采集只刷新「最近采集」）",
			"rt.dt.noAssets": "还没有资产。",
			"rt.dt.byDay": "按天统计",
			"rt.dt.clearFilterShort": "清除筛选：{day}",
			"rt.dt.clearFilter": "清除按天筛选：{day}",
			"rt.dt.dayTitle": "{day}：新增 {n} 台（内网 {ni} / 外网 {ne}）",
			"rt.dt.dayMeta": "{n} 台 · 内 {ni} / 外 {ne}",
			"rt.dt.filterDay": "筛选 {day} 发现的资产",
			"rt.dt.recent": "最近发现的资产（{n}）",
			"rt.dt.recentOfDay": "{day} 发现的资产（{n}）",
			"rt.dt.dayEmpty": "这一天没有新增资产。",
			"rt.dt.timeUnknown": "时间未知",
			"rt.dt.ports": "{n} 端口",
			"rt.c.flowHint": "信息收集 → 互联网资产权限 → 边界突破 → 内网资产权限 → 靶标权限",
			"rt.c.totalScore": "总分 {n} 分",
			"rt.c.viewA": "链路 A",
			"rt.c.viewATitle": "竖向攻击链：逐阶段向下看细节",
			"rt.c.viewB": "链路 B",
			"rt.c.viewBTitle": "横向攻击链：一屏看完五个阶段",
			"rt.c.empty": "还没有得分记录。",
			"rt.c.emptyHint": "拿到成果后用 redteam_score_hit 记分，这条链才会长出来。",
			"rt.c.cumulative": "累计 {n} 分",
			"rt.c.total": "合计 {n} 分",
			"rt.c.stageGoal": "阶段目标",
			"rt.c.scoredAssets": "拿到分数的资产 · {n} 台",
			"rt.c.noScoredAssets": "还没有产生得分的资产",
			"rt.c.stageHits": "本阶段命中 {n} 次",
			"rt.c.noStageScore": "本阶段还没有得分",
			"rt.c.tunnelsOf": "跨越靶标边界的通道 · {n} 条",
			"rt.c.tunnelsSelfOnly": "（另有 {n} 条只在自己 VPS/自建服务器上，不算突破）",
			"rt.c.tunnelsAllSelf": "现有的通道都在自己的服务器上，没有碰到目标 —— 不计边界突破。需要目标侧发起的通道（反弹 shell 到我这 / 目标上跑 frp 客户端 / 经目标 WebShell 的 suo5）。",
			"rt.c.noTunnels": "还没有建立隧道（建好后用 redteam_tunnel_add 登记）",
			"rt.c.usable": "可用",
			"rt.c.reach": "可达",
			"rt.c.involvedAssets": "涉及资产 · {n} 台",
			"rt.c.nVulns": "漏洞 {n}",
			"rt.c.easyN": "易打 {p}",
			"rt.c.nHits": "{n} 次",
			"rt.c.usedVuln": "利用漏洞",
			"rt.c.nthOfPoint": "次数",
			"rt.c.nthOf": "同类第 {n} 次 · +{pts} 分",
			"rt.c.nth": "第 {n} 次",
			"rt.c.record": "记录",
			"rt.c.resultEvidence": "结果与证据",
			"rt.c.resultShort": "结果",
			"rt.c.action": "动作",
			"rt.c.unnamedStep": "（未命名步骤）",
			"rt.c.inferred": "（推断）",
			"rt.c.cappedTag": "服务已拿满 · 不计分",
			"rt.c.cappedDefault": "同一资产同一端口只算分值最高的一条",
			"rt.c.tunnelsN": "隧道 {n} 条",
			"rt.c.assetsScored": "台资产拿到分",
			"rt.c.hitsN": "{n} 次命中",
			"rt.c.moreN": "…另有 {n} 次",
			"rt.f.searchPh": "搜索标题 / CVE / 目标（回车）",
			"rt.f.sevAny": "全部等级",
			"rt.f.statusAny": "全部状态",
			"rt.f.gainedPerm": "拿到权限",
			"rt.f.groupedHint": "默认按目标聚合 · 共 {n} 个目标",
			"rt.f.hSev": "等级",
			"rt.f.hVuln": "漏洞 / 编号",
			"rt.f.hTarget": "目标",
			"rt.f.hGained": "拿到什么",
			"rt.f.hStatus": "状态",
			"rt.f.hConf": "置信",
			"rt.f.updatedTo": "已更新为「{status}」",
			"rt.f.gainedMissing": "未记录 —— 拿到权限/成果后请用 redteam_vuln_update 补 gained（例：服务器权限、内网隧道、后台管理员账号）",
			"rt.f.gainedNone": "未记录权限",
			"rt.f.asset": "资产",
			"rt.f.jumpAsset": "资产详情",
			"rt.f.jumpAssetTitle": "在资产测绘中查看 {ip}",
			"rt.f.source": "来源",
			"rt.f.evidenceSummary": "证据摘要",
			"rt.f.rawHttp": "原始报文",
			"rt.f.plainText": "文本",
			"rt.f.httpEvidence": "HTTP 证据",
			"rt.f.requestBurp": "▸ 请求（可直接粘进 Burp Repeater）",
			"rt.f.response": "▸ 响应",
			"rt.f.evidenceMissing": "缺失 —— 未验证/无证据的漏洞不计入报告，请补 redteam_http_evidence_add",
			"rt.f.attackFiles": "攻击文件",
			"rt.f.noAttackFiles": "（无）用 redteam_attack_file_add 把这条漏洞打通的脚本/马/EXP 归档，并带上 vuln_id",
			"rt.f.nVulns": "{n} 个漏洞",
			"rt.f.exploitedN": "已利用 {n}",
			"rt.f.assetIs": "资产 {ip}",
			"rt.f.emptyVulns": "暂无漏洞记录",
			"rt.f.subVulns": "漏洞",
			"rt.f.subFiles": "攻击文件",
			"rt.f.subCreds": "凭据",
			"rt.f.subAccess": "访问会话",
			"rt.f.expandAll": "全部展开",
			"rt.f.expandAllTitle": "展开所有目标",
			"rt.f.collapseAll": "全部收起",
			"rt.f.collapseAllTitle": "收起所有目标",
			"rt.f.grouped": "按目标聚合",
			"rt.f.flat": "平铺列表",
			"rt.f.groupedTitle": "当前：按目标聚合（先看哪台被打下什么）",
			"rt.f.flatTitle": "当前：平铺每条漏洞",
			"rt.f.filesHint": "攻击文件按靶标目录组织（原「攻击文件」页签）；每条漏洞的关联文件也能在该漏洞详情里直接看到。",
			"rt.f.filesOrphan": " 目前有 {n} 个文件没挂 vuln_id，建议补上以便与漏洞对应。",
			"rt.f.filesStat": "{n} 个目标 / {m} 个文件",
			"rt.f.filesEmpty": "暂无攻击文件（打通的脚本/POC/EXP 会按目标文件夹出现在这里）",
			"rt.f.filesFoot": "目录：attack-files/<IP|URL主机|C段>/ ｜ 只收录实际生效的文件",
			"rt.f.fileEffect": "效果",
			"rt.f.filePath": "路径",
			"rt.f.fileRecord": "记录",
			"rt.f.nFiles": "{n} 个文件",
			"rt.f.credsOf": "凭据 · {n}",
			"rt.f.credsPlaintextNote": "（明文直显，注意屏幕分享/录屏）",
			"rt.f.credsEmpty": "暂无凭据（拿到口令/密钥/Hash 后用 redteam_credential_add 落库，秒级可复用）",
			"rt.f.secretSelectAll": "点击可全选",
			"rt.f.secretMissing": "未记明文 —— 请用 redteam_credential_add 的 secret_value 补上，面板才能直显",
			"rt.f.cSource": "来源 {v}",
			"rt.f.cTool": "工具 {v}",
			"rt.f.cEvidence": "证据 {v}",
			"rt.f.cNote": "备注：{v}",
			"rt.f.accessOf": "已获得访问会话 · {n}",
			"rt.f.accessEmpty": "暂无",
			"rt.s.total": "总分",
			"rt.s.ptsUnit": "分",
			"rt.s.nPoints": "{n} 个得分点",
			"rt.s.nHitCount": "命中 {n} 次",
			"rt.s.selfNotCounted": "自建不计分 {n}",
			"rt.s.serviceNotCounted": "服务已拿满不计分 {n}",
			"rt.s.selfCreatedTip": "自己注册/自己创建的账号不算得分权限，只作过程记录（不计分、不占上限、不进报告）",
			"rt.s.serviceCappedTip": "账号权限与数据库权限按「同资产同端口」只算一次：该服务已拿满，这些重复命中不计分（只作留痕）",
			"rt.s.newPoint": "+ 新增得分点",
			"rt.s.nameRequired": "名称不能为空",
			"rt.s.builtinLocked": "已保存「启用/停用」。分值未改动：这是随《得分规则》分发的内置得分点，分值 / 上限 / 计分口径由规则锁定（同一条规则的上限按组内所有得分点累计，单独改分值会让一条命中吃掉整组上限）。要自定义分值时请「+ 新增得分点」。",
			"rt.s.builtinTitle": "内置得分点（来自《突破入侵类得分规则（合并版）》）",
			"rt.s.builtinHint": "分值、上限、计分口径与名称由规则锁定 —— 同一条规则的上限按组内所有得分点累计，单独改分值会让一条命中吃掉整组上限。这里可以改「启用 / 停用」；要自定义分值时请返回上一屏点「+ 新增得分点」。",
			"rt.s.builtinSrc": "规则原文序号 {src}　·　上限分组 rule={rule}",
			"rt.s.builtinCap": "　·　上限 {n} 分",
			"rt.s.builtinNoCap": "　·　不设上限",
			"rt.s.fName": "名称（必填）",
			"rt.s.builtinNameLocked": "内置得分点的名称由规则锁定",
			"rt.s.fCategory": "分类，如 账号权限",
			"rt.s.builtinCatLocked": "内置得分点的分类由规则锁定（决定它属于面板哪一组）",
			"rt.s.fPoints": "单次分值",
			"rt.s.builtinPointsLocked": "内置得分点的分值由《得分规则》锁定，不能在这里改",
			"rt.s.fPointsTip": "这一类的单次分值；每命中一次就按这个分值累加（受该条规则上限约束）",
			"rt.s.enabled": "启用",
			"rt.s.disabled": "停用",
			"rt.s.fDesc": "得分条件说明",
			"rt.s.builtinDescLocked": "内置得分点的条款正文由规则锁定",
			"rt.s.builtinNoDelete": "内置得分点不能删除：删掉会让面板缺一条规则、报告少一类成果（下次启动还会自动补回来）。要让它不参与计分请改用「停用」。",
			"rt.s.deleteBuiltin": "删除（内置项不可删）",
			"rt.s.hPoints": "分值",
			"rt.s.hName": "得分点（按分值从低到高）",
			"rt.s.hHits": "命中 / 上限",
			"rt.s.hEarned": "已得分",
			"rt.s.empty": "暂无得分点，点右上角「新增得分点」",
			"rt.s.pointsN": "{n}分",
			"rt.s.groupItems": "{n} 项",
			"rt.s.groupCap": " · 各项上限合计 {n} 分（各项独立，不跨项累加）",
			"rt.s.cappedTip": "已计入 {counted} 次，另有 {capped} 条因「{scope}」或已达上限不计分",
			"rt.s.scopeLabel": "计分口径",
			"rt.s.nHits": "{n} 次命中",
			"rt.s.noHit": "未命中",
			"rt.s.cap": "上限 {used}/{cap}",
			"rt.s.noAsset": "未指定资产",
			"rt.s.selfCreated": "自建 · 不计分",
			"rt.s.serviceCapped": "服务已拿满 · 不计分",
			"rt.s.shotN": "图 {n}",
			"rt.s.shotCountTip": "这条命中有证据截图（展开得分点即可看到代表图）",
			"rt.s.noEvidence": "未填账号密码/结果",
			"rt.s.condition": "得分条件",
			"rt.s.status": "状态",
			"rt.s.statusLine": "{enabled} · {pts} 分/次 · 命中 {n} 次 = {earned} 分{self}{capped}",
			"rt.s.selfExtra": "（另有 {n} 次自建不计分）",
			"rt.s.cappedExtra": "（另有 {n} 次同服务重复命中不计分）",
			"rt.s.serviceCap": "服务封顶",
			"rt.s.serviceCapRule": "；账号权限与数据库权限按「同资产同端口」只算一次，拿到最高权限账号即该服务拿满",
			"rt.s.hitRecords": "命中记录 · {n}（只记资产与账号密码，详细复现见报告）",
			"rt.s.hitRecordsEmpty": "还没有 —— 拿下成果后用 redteam_score_hit 记分：写明目标资产 + 拿到的账号密码/权限",
			"rt.s.shotsTitle": "证据截图 · {n} 张",
			"rt.r.totalN": "合计 {n} 分",
			"rt.r.countN": "{n} 项得分",
			"rt.r.withRequests": "{n}/{m} 项带原始请求",
			"rt.r.reproN": "可复现 {n}/{m}",
			"rt.r.reproTitle": "复现链是否完整：有攻击步骤、写了实际命令、关联了漏洞/凭据/隧道",
			"rt.r.serviceCappedN": "同服务已拿满不计分 {n}",
			"rt.r.serviceCappedTip": "同一资产同一端口的重复账号/数据库权限命中：服务已拿满，不计分、不进报告",
			"rt.r.copyAll": "复制全文",
			"rt.r.downloadMd": "下载 .md",
			"rt.r.wholeReport": "整份报告",
			"rt.r.downloaded": "已下载：{label}",
			"rt.r.downloadFail": "下载失败：{msg}",
			"rt.r.regenerate": "重新生成",
			"rt.r.generating": "生成中…",
			"rt.r.empty": "还没有可交付的成果。",
			"rt.r.emptyHint": "本报告只收录「拿到了分」的成果；没有得分的漏洞不进报告。拿到成果后用 redteam_score_hit 记分（目标资产 + 拿到的东西），并补 redteam_http_evidence_add 以便复现。",
			"rt.r.otherGroup": "其他得分",
			"rt.r.nItems": "{n} 项",
			"rt.r.jumpChain": "攻击链",
			"rt.r.jumpChainTitle": "在攻击链中查看这次得分的来龙去脉",
			"rt.r.copyReq": "复制请求",
			"rt.r.copyReqOf": "第 {n} 项请求",
			"rt.r.gotAt": "取得时间",
			"rt.r.traceTitle": "复现步骤（点击展开）",
			"rt.r.nSteps": "{n} 个动作",
			"rt.r.nCreds": "{n} 条凭据",
			"rt.r.nTunnels": "{n} 条隧道",
			"rt.r.incomplete": "复现材料待补",
			"rt.r.reproducible": "可复现",
			"rt.r.noSteps": "没有关联的攻击步骤：说不清这一步是怎么做的。请用 redteam_chain_add 补上动作（title / detail / tool / result），记分时也可以带 point_code + evidence 一次完成。",
			"rt.r.inferred": "按同资产推断",
			"rt.r.exec": "执行",
			"rt.r.noTool": "未记录实际命令（redteam_chain_add 的 tool）",
			"rt.r.copyCmd": "复制命令",
			"rt.r.stepCmdOf": "第 {n} 步命令",
			"rt.r.result": "结果",
			"rt.r.credsSrc": "拿到的凭据（来源可追溯）",
			"rt.r.credLine": "{user} / {type}{priv} · 来源 {src}{tool}",
			"rt.r.noUser": "(无用户名)",
			"rt.r.credPriv": " · 权限 {p}",
			"rt.r.unmarked": "未标注",
			"rt.r.credTool": " · 取得方式 {v}",
			"rt.r.tunnelsUsed": "用到的隧道 / 通道",
			"rt.r.tunnelLine": "入口 {entry}{reach} · 目标侧 {side}{legit}{status}{cmd}",
			"rt.r.unregistered": "未登记",
			"rt.r.tunnelReach": " · 可达 {v}",
			"rt.r.undeclared": "未声明",
			"rt.r.notBoundary": " · 不算跨越靶标边界",
			"rt.r.tunnelCmd": " · 命令 {v}",
			"rt.r.shellsUsed": "用到的 WebShell",
			"rt.r.shellPass": " · 口令/密钥 {v}",
			"rt.r.gaps": "复现缺口：",
			"rt.r.noRequest": "这一项没有原始请求记录，无法直接复现 —— 请用 redteam_http_evidence_add 补上",
			"rt.r.requestN": "复现请求 {n}",
			"rt.r.requestAuto": "（按目标路径自动匹配，请核对）",
			"rt.r.requestOf": "请求 {n}",
			"rt.r.copyYakit": "复制到 Yakit",
			"rt.r.respSummary": "响应摘要",
			"rt.r.note": "备注",
			"rt.r.footNote": "口径：只收录得分成果，每条附带可粘进 Yakit Repeater 的原始请求",
			"rt.se.shellStat": "WebShell {on}/{n} 在线",
			"rt.se.tunnelStat": "隧道 {on}/{n} 可用",
			"rt.se.credStat": "凭据 {n}",
			"rt.se.accessStat": "访问会话 {n}",
			"rt.se.probe": "检测连通性",
			"rt.se.probing": "检测中…",
			"rt.se.probeDone": "检测完成：WebShell 在线 {on}/{n1}，隧道可用 {act}/{n2}",
			"rt.se.empty": "还没有登记任何 WebShell 或隧道。",
			"rt.se.emptyHow": "拿到 WebShell 用 redteam_webshell_add；建好隧道用 redteam_tunnel_add（suo5 / socks5 / ssh -R）；之后智能体用 redteam_sessions 就能看到。",
			"rt.se.howTo": "怎么做（点击展开）",
			"rt.se.hintShell": "有 {n} 个入口不是冰蝎马/哥斯拉马（用户连不上，不算可交付入口）",
			"rt.se.hintShellHow": "用技能 webshell-toolkit 重新上传冰蝎马（behinder）或哥斯拉马（godzilla），并把 shell_type + pass_key 写进 redteam_webshell_add。只作临时中转的可在备注里写明。",
			"rt.se.hintTunnel": "现有 {n} 条通道都不算「跨越靶标边界」（不算边界/内网突破）",
			"rt.se.hintTunnelHow": "自己的 VPS / 自建服务器上开的 socks5、frp、代理不算隧道。必须是目标侧发起的通道：目标反弹 shell 到我方、目标上跑 frp/Stowaway 客户端、或经目标 WebShell 建的 suo5/HTTP 隧道；登记时用 entry_kind 说明。",
			"rt.se.hintSuo5": "还没有可用的 suo5 隧道（打进内网的标准通道）",
			"rt.se.hintSuo5How": "用技能 suo5-tunnel 通过上面的 WebShell 建 socks5 隧道，再 redteam_tunnel_add（kind=suo5、listen=127.0.0.1:1080、entry=WebShell URL、reach=可达网段）登记，最后点「检测连通性」确认 status=active。",
			"rt.se.shellOnline": "{on}/{n} 在线",
			"rt.se.shellSub": "已上线的可控入口",
			"rt.se.shellsEmpty": "暂无（拿到 WebShell 后用 redteam_webshell_add 登记）",
			"rt.se.userCantConnect": "用户连不上",
			"rt.se.copyUrl": "复制 URL",
			"rt.se.markOffline": "标记失效",
			"rt.se.kind": "类型",
			"rt.se.encryptedShell": "加密马（冰蝎/哥斯拉，用户可直连）",
			"rt.se.plainShell": "非加密马 —— 用户连不上，仅可作临时中转",
			"rt.se.passKey": "连接口令",
			"rt.se.privilege": "权限",
			"rt.se.credRef": "凭据引用",
			"rt.se.lastCheck": "最后检测",
			"rt.se.unchecked": "未检测",
			"rt.se.checkNote": "检测说明",
			"rt.se.note": "备注",
			"rt.se.tunnelsTitle": "内网隧道",
			"rt.se.tunnelActive": "{on}/{n} 可用",
			"rt.se.tunnelSub": "可直接给扫描器当代理用",
			"rt.se.tunnelsEmpty": "暂无（建好隧道后用 redteam_tunnel_add 登记）",
			"rt.se.noListen": "(未填监听地址)",
			"rt.se.notSuo5": "非 suo5 标准通道",
			"rt.se.targetSide": "目标侧通道",
			"rt.se.notBreakthrough": "不算突破",
			"rt.se.selfOnlyTip": "只在自己 VPS/自建服务器上开的通道，没有碰到目标 —— 不算边界突破/内网突破",
			"rt.se.pendingConfirm": "待确认",
			"rt.se.entryKindTip": "未声明 entry_kind：请说明目标侧的那一端是什么（target-outbound / target-http / target-agent）",
			"rt.se.reachN": "可达 {v}",
			"rt.se.copyAddr": "复制地址",
			"rt.se.markActive": "标记可用",
			"rt.se.targetEntry": "目标侧入口",
			"rt.se.crossBoundary": "跨越边界",
			"rt.se.confirmedTargetSide": "已确认目标侧",
			"rt.se.notBreakthroughFact": "不算突破（只在自己 VPS 上开代理）",
			"rt.se.entryKindPending": "未声明 entry_kind，待确认",
			"rt.se.reachSeg": "可达网段",
			"rt.se.buildCmd": "建立命令（点击展开 / 复制）",
			"rt.se.scanVia": "走这条隧道扫描（gogo / fscan 命令）",
			"rt.se.copyGogo": "复制 gogo 命令",
			"rt.se.copyFscan": "复制 fscan 命令",
			"rt.se.manualMark": "界面手动标记",
			"rt.ag.maxN": "并发上限 {n}",
			"rt.ag.usedUnknown": "占用未知",
			"rt.ag.usedN": "在跑 {used} / 剩余 {free}",
			"rt.ag.rulesTitle": "并发规则（硬约束）",
			"rt.ag.rule1": "· 同一靶标同时最多 {n} 个执行智能体；主会话派活前用 redteam_agent_slot 占位，满了直接拒绝。",
			"rt.ag.rule2": "· 默认一个一个派、按顺序推进；只有确实互不依赖的活才并行。",
			"rt.ag.rule3": "· 每个会话有自己的靶标绑定：多会话并行不会把报告写串（子智能体继承父会话的靶标）。",
			"rt.ag.rolesTitle": "六个角色",
			"rt.ag.role1": "① 信息收集 recon —— 只收集资产，把单位资产收集完整（含边缘与未备案资产）",
			"rt.ag.role2": "② 资产梳理 assess —— 一条一条过，评易打性并全部落库",
			"rt.ag.role3": "③ 漏洞发现 vuln-scan —— 先查库去重 → Nday/1day 优先 → 接口未授权探测",
			"rt.ag.role4": "④ 漏洞利用 exploit —— 先拿服务器权限（冰蝎/哥斯拉马）+ 建 suo5 隧道，再打其它得分项",
			"rt.ag.role5": "⑤ 内网渗透 internal —— 走隧道，依次拉起 ①②③④ 做内网",
			"rt.ag.role6": "⑥ 主会话 plan —— 只做计划、派活、汇总、汇报，不动手",
			"rt.ag.concurrencyTitle": "并发数量",
			"rt.ag.concurrencyLine": "同一靶标同时最多几个执行智能体。当前生效：{max}{used}，来源：{source}。改完立即生效，不用重启。",
			"rt.ag.concurrencyUsed": "（在跑 {used}，剩余 {free}）",
			"rt.ag.rangeOf": "范围 1 – {n}",
			"rt.ag.savedMax": "已保存：并发上限 {n}（立即生效，不用重启）",
			"rt.ag.srcSettings": "面板中设置",
			"rt.ag.srcEnv": "环境变量 REDTEAM_MAX_AGENTS",
			"rt.ag.srcDefault": "默认值",
			"rt.ag.concurrencyWarn": "调大不等于更快：同一个模型 API Key 的并发/速率上限是共享的，同时派太多会互相挤占，表现为排队等待、超时、返回被截断甚至限流报错 —— 反而让测试结果不稳定（漏测、半途而废）。建议从 2–3 开始，只有在确认 Key 的额度足够、任务之间确实互不依赖时才调大。",
			"rt.ag.promptsTitle": "角色提示词（按靶标存，可在这里编辑）",
			"rt.ag.promptsHint": "「智能体提示词」已并入本页；下面是完整编辑器（改完点保存，只影响当前靶标）。",
			"rt.p.promptsTitle": "提示词",
			"rt.p.builtinNote": "当前为内置默认提示词（创建靶标后可按靶标保存修改）",
			"rt.p.needEngagement": "请先创建靶标，再保存提示词",
			"rt.p.viewPrompt": "查看「{role}」提示词",
			"rt.p.updated": "更新 {time}",
			"rt.p.resetCur": "恢复默认为当前",
			"rt.p.resetCurTitle": "把当前角色恢复成内置最新版提示词",
			"rt.p.resetAll": "全部恢复默认",
			"rt.p.resetAllTitle": "四个角色全部恢复成内置最新版提示词",
			"rt.p.resetDone": "已恢复内置默认：{roles}",
			"rt.p.resetSep": "、",
			"rt.p.placeholder": "该角色的系统提示词（Markdown）",
			"rt.p.saveHint": "保存后写入 agents/{role}.md。子会话任务第一行写 redteamRole: recon、assess、vuln-scan、exploit 或 internal 后，对应文件进入系统提示词。",
			"rt.k.scopeHint": "两级知识库：项目级随项目走（删项目即删），全局级跨项目复用。默认「全部」= 先本项目、再全局。检索走 SQLite 全文索引（FTS5），不需要向量模型。",
			"rt.k.scope.project": "本项目",
			"rt.k.scope.global": "全局",
			"rt.k.scope.all": "全部",
			"rt.k.scope.projectTip": "只显示当前项目沉淀的 POC/EXP（随项目目录，删项目即删）",
			"rt.k.scope.globalTip": "只显示全局知识库（跨项目复用）",
			"rt.k.scope.allTip": "先本项目、再全局，按 code 去重",
			"rt.k.totalN": "{n} 条",
			"rt.k.verifiedN": "已验证 {n}",
			"rt.k.reusedN": "累计复用 {n}",
			"rt.k.uncatN": "未归类 {n}",
			"rt.k.uncatTip": "这些条目还没归类：智能体回填时用 redteam_poc_add 的 category 参数标一下",
			"rt.k.localTplN": "本机模板 {n}",
			"rt.k.grouped": "按归类分组",
			"rt.k.flat": "平铺显示",
			"rt.k.groupedTitle": "按归类分组显示 / 平铺显示",
			"rt.k.searching": "检索中…",
			"rt.k.search": "检索",
			"rt.k.searchPh": "搜 CVE / 组件 / 关键字（正文也会搜）",
			"rt.k.allCats": "全部归类",
			"rt.k.allEngagements": "全部来源靶标",
			"rt.k.assetFilter": "发现资产筛选",
			"rt.k.allKinds": "全部类型",
			"rt.k.verifiedOnly": "只看已验证",
			"rt.k.catStat": " · 本机模板 {tpl} · 知识库 {kb}{verified}",
			"rt.k.catVerified": "（已验证 {n}）",
			"rt.k.verified": "已验证",
			"rt.k.unverified": "未验证",
			"rt.k.reuseN": "复用 {n}",
			"rt.k.catOf": "归类 {v}",
			"rt.k.versionsOf": "影响版本 {v}",
			"rt.k.createdAt": "建立时间 {time}",
			"rt.k.srcEngagement": "来源靶标 {v}",
			"rt.k.foundOn": "发现资产 {v}",
			"rt.k.foundBy": "发现角色 {v}",
			"rt.k.sourceIs": "来源 {v}",
			"rt.k.usage": "用法",
			"rt.k.desc": "说明",
			"rt.k.verifyNote": "验证证据",
			"rt.k.lastUsed": "最近使用",
			"rt.k.path": "落盘",
			"rt.k.copyContent": "复制正文",
			"rt.k.markUse": "记一次复用",
			"rt.k.copySource": "复制来源",
			"rt.k.truncated": "（已截断，完整内容见落盘文件）",
			"rt.k.metaOnly": "这条只有元数据，没有正文 —— 拿到正文后用 redteam_poc_update 补上",
			"rt.k.manualUse": "控制台手动标记",
			"rt.k.usedMarked": "已记一次复用：{title}",
			"rt.k.nEntries": "{n} 条",
			"rt.k.latestAt": "最近建立 {time}",
			"rt.k.tplRange": "本机 nuclei 模板 · {from}–{to} / {total}（直接 nuclei -t <模板路径>）",
			"rt.k.tplCmd": "模板命令",
			"rt.k.copyCmd": "复制命令",
			"rt.k.prevPage": "上一页",
			"rt.k.nextPage": "下一页",
			"rt.k.tplDir": "模板目录：{path}",
			"rt.k.dbAt": "知识库：{path}",
			"rt.k.rootAt": "（根目录 {path}）",
			"rt.k.oldHostHint": "知识库接口由 host 侧提供，当前宿主还是旧进程 —— 请完全退出后重新打开（官方 exe / 社区版 / dsh web 任一），再刷新页面。",
			"rt.k.noHitSearched": "没有命中：换个关键字再试，或去互联网找 / 自己手搓后回填。",
			"rt.k.emptyWithTpl": "POC/EXP 库还是空的；本机已有 {n} 个 nuclei 模板，但这一页没有列出来。请完全退出后重新打开客户端。",
			"rt.k.emptyTplNoYaml": "知识库还是空的（本机模板目录存在但没有 yaml，请跑 nuclei -update-templates）。",
			"rt.k.emptyNoTpl": "知识库还是空的。本机也还没有 nuclei 模板库 —— 在演练机上跑 setup.sh 或 nuclei -update-templates，装好后这里会出现「本机模板 N」。",
			"rt.k.orderHint": "打 Nday/1day 的标准顺序：① redteam_poc_search 先查这里（顺带搜本机 nuclei 模板库）→ ② 都没有就互联网搜索（web_search / GitHub / ExploitDB / 厂商公告）或自己手搓 → ③ 在真实目标上验证有效后 redteam_poc_add 回填，后面的靶标直接就能用。",
			"rt.k.footNote": "全局共享（跨靶标）｜ 落盘：pocs/<code>/ ｜ 只收录通用可复用的 POC/EXP，靶标专用脚本走「攻击文件」",
			"rt.sk.filterPh": "过滤技能",
			"rt.sk.pluginOnly": "只看本插件自带（{n} 个）",
			"rt.sk.brokenOnly": "只看不可用/未知（{n} 个）",
			"rt.sk.brokenOnlyTip": "只看有明确缺口（缺 key / 缺本机路径 / 基础设施还是占位符）或判不了可用性的技能",
			"rt.sk.availableN": "可用 {n}",
			"rt.sk.brokenN": "不可用 {n}",
			"rt.sk.unknownN": "未知 {n}",
			"rt.sk.recheck": "重查可用性",
			"rt.sk.recheckTip": "技能正文或环境变量刚改过？点这里跳过 30 秒缓存重查",
			"rt.sk.libsStat": "红队 {rt} · 官方 {of}",
			"rt.sk.manyNote": "（技能多来自其它插件注册的根或你自己的技能目录；本插件只自带 {n} 个）",
			"rt.sk.redteamSkills": "红队技能",
			"rt.sk.officialSkills": "官方技能",
			"rt.sk.viewSkill": "查看技能 {name}",
			"rt.sk.manualOnly": "仅人工",
			"rt.sk.official": "官方",
			"rt.sk.officialTip": "官方技能目录，不按红队工具路径检查",
			"rt.sk.available": "可用",
			"rt.sk.availableTip": "可用：技能正文可以加载。缺的外部工具或密钥记在详情里，不阻止调用。",
			"rt.sk.broken": "不可用",
			"rt.sk.noDesc": "（无描述）",
			"rt.sk.srcOf": "来源 {v}",
			"rt.sk.fromPlugin": "本插件自带",
			"rt.sk.catalogTitle": "技能目录（DSH 原生）",
			"rt.sk.whenToUse": "何时使用",
			"rt.sk.kindLabel": "类型",
			"rt.sk.officialKind": "官方技能。由宿主按任务调用，不按红队工具路径检查。",
			"rt.sk.availability": "可用性",
			"rt.sk.brokenDetail": "不可用（有明确缺口）",
			"rt.sk.unknownDetail": "未知（正文读不到）",
			"rt.sk.missingTools": "未装上的外部工具",
			"rt.sk.gaps": "缺口",
			"rt.sk.needsUser": "需要你提供",
			"rt.sk.noteDefault": "技能由 DSH 原生 skill 体系管理，红队智能体通过 skill 工具调用。",
			"rt.sk.checkedAt": "{when}{time}",
			"rt.sk.cachedAt": "缓存于 ",
			"rt.sk.checkedAtLabel": "检查于 ",
			"rt.sk.brokenListTitle": "现在跑不起来的技能：",
			"rt.sk.dirN": "{n} 个 · {path}",
			"rt.sk.moreDirs": "…另有 {n} 个目录（共 {m} 个技能）",
			"rt.sk.pickLeft": "左侧选择技能查看内容",
			"rt.e.ready": "就绪 · {reason}",
			"rt.e.pending": "待配置",
			"rt.e.toolsN": "工具 {found}/{total}",
			"rt.e.hintDefault": "均可选填：留空则用默认路径/自动查找。填了的覆盖默认。密钥类只在需要测绘/反弹时才填。",
			"rt.e.folderAssignTitle": "整包文件夹 → 自动分配工具",
			"rt.e.folderAssignHint": "工具都在同一个文件夹（含子目录）时，填路径后点「自动分配」：会写入 toolkitDir，并按文件名匹配 nmap / nuclei / fscan 等填到下方。",
			"rt.e.folderPh": "例如 D:\\pentest-tools 或 /opt/toolkit",
			"rt.e.assign": "自动分配",
			"rt.e.scanning": "扫描中…",
			"rt.e.folderRequired": "请先填写工具所在文件夹路径",
			"rt.e.assigned": "已从文件夹分配 {n} 个工具{tpl}",
			"rt.e.assignedTpl": "，并识别 nuclei-templates",
			"rt.e.egressTitle": "出网状态（只读）",
			"rt.e.emptyParen": "(空)",
			"rt.e.platformDirTitle": "平台与目录",
			"rt.e.platformMode": "平台模式",
			"rt.e.platformAuto": "auto（跟随本机，默认）",
			"rt.e.toolkitDirLabel": "工具箱目录 toolkitDir（留空＝默认）",
			"rt.e.defaultIs": "默认：{path}",
			"rt.e.nucleiDirLabel": "nuclei 模板目录（留空＝自动：toolkit/nuclei-templates）",
			"rt.e.binDirsLabel": "工具搜索目录 binDirs（留空＝只搜 toolkit + PATH；每行一个）",
			"rt.e.binDirsPh": "可选。例如：\nD:\\tools\nD:\\pentest-bin",
			"rt.e.envTitle": "密钥与 VPS（留空＝不覆盖；进程环境变量优先）",
			"rt.e.optional": "（可选）",
			"rt.e.fofaPh": "留空；测绘时再填",
			"rt.e.vpsHostPh": "留空；需要时填 user@host",
			"rt.e.vpsKeyPh": "留空；需要时填私钥绝对路径",
			"rt.e.toolsTitle": "工具可执行文件（留空＝自动查找）",
			"rt.e.toolsResolveOrder": "解析顺序：本表绝对路径 → toolkitDir → binDirs → PATH。留空即走默认查找。",
			"rt.e.found": "已找到",
			"rt.e.notFound": "未找到（可留空等装好）",
			"rt.e.autoFindPh": "留空自动找：{names}",
			"rt.e.notesTitle": "备注",
			"rt.e.notesPh": "可选。例如：工具来自某某绿色包",
			"rt.e.configFile": "配置文件：{path} | 留空字段全部走默认",
			"rt.e.savedTo": "已保存到 {path}",
			"rt.ov.scoreTitle": "总分 / 满分",
			"rt.ov.scoreSub": "进度 {pct}%",
			"rt.ov.hitCount": "计入命中 {hits} 次{capped}",
			"rt.ov.cappedExtra": "（另 {n} 次服务已拿满不计分）",
			"rt.ov.noStages": "还没有得分记录，拿到成果后阶段进度会在这里长出来。",
			"rt.ov.noRunningAgents": "当前没有在跑的执行智能体。",
			"rt.ov.openAgents": "管理并发 / 提示词",
			"rt.ov.recentHits": "最近命中（5 条）",
			"rt.ov.noHits": "还没有命中记录。",
			"rt.ov.hitJump": "查看得分点「{point}」的命中列表",
			"rt.ov.hitJumpTitle": "点击跳到得分目标页并展开命中列表",
			"rt.ov.evidenceTitle": "证据缺口",
			"rt.ov.missingEvidence": "{n} 项得分缺原始请求证据",
			"rt.ov.missingEvidenceHow": "没有原始请求的成果无法直接复现 —— 用 redteam_http_evidence_add 补上后再交付。",
			"rt.ov.evidenceOk": "证据完整：{n}/{m} 项带原始请求。",
			"rt.ov.evidenceNoItems": "还没有可交付的得分成果。",
			"rt.t.cardTitle": "当前测试",
			"rt.t.testingNow": "正在测",
			"rt.t.nHosts": "{n} 台",
			"rt.t.testingSub": "agent 正在打这些资产",
			"rt.t.testingEmptySub": "agent 开始测某台资产后会实时出现在这里",
			"rt.t.testingEmpty": "当前没有资产处于「测试中」",
			"rt.t.recent": "最近动过",
			"rt.t.recentSub": "已测过的资产",
			"rt.t.queue": "待测队列",
			"rt.t.queueSub": "按易打性与端口数排出先打哪几台",
			"rt.t.queueHint": "完整清单（含筛选与排序）见「资产测绘」页",
			"rt.t.queueEmpty": "没有待测资产",
			"rt.t.updatedAt": "更新于 {time}",
			"rt.t.expandAllTitle": "展开最近动过与待测队列",
			"rt.t.collapseAllTitle": "只留正在测",
			"rt.t.autoTitle": "每 5 秒自动刷新",
			"rt.t.live5s": "实时 · 5s",
			"rt.t.paused": "已暂停",
			"rt.t.surface": "测试面",
			"rt.t.potential": "预期得分",
			"rt.t.openPorts": "开放 {n} 端口",
			"rt.t.webshells": "WebShell {n}"
		};
		/** 英文词典（key 与 zh 完全一致）。 */
		const en = {
			"rt.title": "Red-team drill",
			"rt.loading": "Loading…",
			"rt.empty": "(empty)",
			"rt.unknown": "Unknown",
			"rt.v.badgeTip": "Current version {v}; updates live in Settings → Purge",
			"rt.refresh": "Refresh",
			"rt.refreshing": "Refreshing…",
			"rt.refreshAllTitle": "Refresh roster, snapshot and the current tab",
			"rt.save": "Save",
			"rt.saved": "Saved",
			"rt.saving": "Saving…",
			"rt.cancel": "Cancel",
			"rt.copy": "Copy",
			"rt.copied": "Copied: {label}",
			"rt.copiedShort": "Copied",
			"rt.copyFail": "Copy failed (clipboard not granted) — select the text manually instead",
			"rt.copyThis": "Copy this row",
			"rt.edit": "Edit",
			"rt.delete": "Delete",
			"rt.deleted": "Deleted",
			"rt.needRestart": "The host-side code of this module changed; restart the host (official exe / community / dsh web) once to pick it up",
			"rt.renderError": "This view failed to render: ",
			"rt.backToAssets": "Back to assets",
			"rt.unknownTab": "Unknown tab",
			"rt.unnamed": "Unnamed",
			"rt.clipExpand": "Expand",
			"rt.clipCollapse": "Collapse",
			"rt.creating": "Creating…",
			"rt.create": "Create target",
			"rt.noEngTitle": "No target yet",
			"rt.noEngHint": "Enter the target organization name to start the drill and asset mapping.",
			"rt.noEngPh": "e.g. Example Tech Co., Ltd.",
			"rt.noEngGlobalHint": "Knowledge / environment / skills / agents are global pages and work without a target.",
			"rt.noEngYet": "No targets yet",
			"rt.pickEng": "Pick target",
			"rt.toast.score": "Score update: the board changed",
			"rt.tab.overview": "Overview",
			"rt.tab.assets": "Assets",
			"rt.tab.env": "Environment",
			"rt.tab.agents": "Agents",
			"rt.tab.sessions": "Sessions",
			"rt.tab.findings": "Findings",
			"rt.tab.chain": "Attack chain",
			"rt.tab.scores": "Score board",
			"rt.tab.report": "Report",
			"rt.tab.knowledge": "Knowledge",
			"main.enter": "Enter drill",
			"main.enterHint": "Switch to this project workspace and open a red-team session",
			"main.newSession": "New session",
			"main.newSessionHint": "Open another red-team session in the same project workspace",
			"main.deleteProject": "Delete project",
			"main.deleteConfirm": "Delete \"{name}\"? This removes the project folder (assets, reports) and its workspace. It cannot be undone.",
			"main.sessionUnavailable": "No session service here: use New Session and pick 红队模式",
			"common.retry": "Retry",
			"common.cancel": "Cancel",
			"panel.bindOk": "Bound to \"{name}\"",
			"panel.bindingFail": "Binding failed",
			"panel.unbindOk": "Session unbound",
			"rt.tab.skills": "Skills",
			"rt.tab.projects": "Projects",
			"rt.pj.title": "Projects",
			"rt.pj.subtitle": "One project = one target workspace: assets, findings, chain, score and report live in its own database.",
			"rt.pj.new": "New project",
			"rt.pj.name": "Project name (target organization)",
			"rt.pj.namePh": "e.g. Example Technology Ltd.",
			"rt.pj.scope": "Authorized scope (CIDR, one per line, optional)",
			"rt.pj.scopePh": "203.0.113.0/24",
			"rt.pj.note": "Objective (optional, stored in project metadata)",
			"rt.pj.create": "Create project",
			"rt.pj.creating": "Creating…",
			"rt.pj.cancel": "Cancel",
			"rt.pj.empty": "No projects yet. Create one and every asset, finding, chain step and report lands in its own database.",
			"rt.pj.workspace": "Workspace",
			"rt.pj.workspaceReady": "linked",
			"rt.pj.workspacePending": "auto on start",
			"rt.pj.copyDir": "Copy folder",
			"rt.pj.dirCopied": "Folder copied",
			"rt.pj.copyFail": "Copy failed",
			"rt.pj.drill": "Start drill",
			"rt.pj.drillHint": "Creates a new session on the \"红队模式\" preset with a ready-made opening prompt (preflight → bind → delegate).",
			"rt.pj.noWorkspace": "This workspace cannot create sessions from here: use New Session and pick the 红队模式 preset",
			"rt.pj.enter": "Open workspace",
			"rt.pj.setCurrent": "Set as current",
			"rt.pj.current": "Current",
			"rt.pj.boundSessions": "{n} session(s) bound",
			"rt.pj.archive": "Archive",
			"rt.pj.restore": "Restore",
			"rt.pj.archived": "Archived",
			"rt.pj.active": "Active",
			"rt.pj.closed": "Closed",
			"rt.pj.stat.assets": "Assets",
			"rt.pj.stat.vulns": "Findings",
			"rt.pj.stat.points": "Score",
			"rt.pj.lastActivity": "Last activity",
			"rt.pj.never": "No activity yet",
			"rt.pj.filter.all": "All",
			"rt.pj.filter.active": "Active",
			"rt.pj.filter.archived": "Archived",
			"rt.pj.edit": "Edit",
			"rt.pj.save": "Save",
			"rt.pj.saved": "Saved",
			"rt.pj.rename": "Project name",
			"rt.pj.status": "Status",
			"rt.pj.editScope": "Authorized scope (CIDR, comma separated)",
			"rt.pj.editNote": "Objective",
			"rt.pj.noScope": "No scope recorded",
			"rt.pj.archiveConfirm": "Archive \"{name}\"? History stays readable; it is folded out of the default list.",
			"rt.pj.openFailed": "Failed to open the project",
			"rt.pj.createFailed": "Failed to create the project",
			"rt.pj.updateFailed": "Failed to save",
			"rt.pj.deleted": "Deleted project \"{name}\" (folder and workspace removed)",
			"rt.pj.count": "{n} project(s)",
			"rt.head.created": "Created",
			"rt.head.noProject": "No project selected",
			"rt.head.backToProjects": "Projects",
			"rt.head.bindHere": "Bind this session",
			"rt.head.boundHere": "Session bound",
			"rt.head.unbind": "Unbind this session",
			"rt.head.bindHint": "Once bound, red-team agents in this session only read and write this project.",
			"rt.head.noSession": "Open the panel from a session to bind it",
			"rt.group.global": "Global",
			"rt.group.globalHint": "Knowledge, skills and environment are shared across projects.",
			"rt.live.live": "live",
			"rt.live.polling": "polling",
			"rt.live.liveTip": "Event stream connected (SSE): asset / vuln / score changes refresh in real time",
			"rt.live.pollingTip": "Event stream unavailable; fell back to 5s polling for the current tab",
			"rt.foot.segments": "CIDR {n}",
			"rt.foot.assets": "Assets {n} (live {live})",
			"rt.foot.ports": "Ports {n}",
			"rt.foot.fingerprints": "Fingerprints {n}",
			"rt.foot.vulns": "Vulns {n}",
			"rt.foot.signals": "Passive/active {p}/{a}",
			"rt.test.untested": "Untested",
			"rt.test.testing": "Testing",
			"rt.test.tested": "Tested",
			"rt.test.blocked": "Blocked",
			"rt.test.abandoned": "Abandoned",
			"rt.test.no_surface": "No surface",
			"rt.pri.title": "Ease",
			"rt.pri.high": "Easy (high)",
			"rt.pri.medium": "Medium",
			"rt.pri.low": "Hard (low)",
			"rt.pri.none": "Unrated",
			"rt.sev.critical": "Critical",
			"rt.sev.high": "High",
			"rt.sev.medium": "Medium",
			"rt.sev.low": "Low",
			"rt.sev.info": "Info",
			"rt.vulnstatus.candidate": "Candidate",
			"rt.vulnstatus.confirmed": "Confirmed",
			"rt.vulnstatus.exploited": "Exploited",
			"rt.vulnstatus.false-positive": "False positive",
			"rt.vulnstatus.fixed": "Fixed",
			"rt.prov.passive": "Passive",
			"rt.prov.active": "Active",
			"rt.prov.unknown": "Unknown",
			"rt.scope.internal": "Internal",
			"rt.scope.external": "External",
			"rt.scope.inShort": "Int",
			"rt.scope.outShort": "Ext",
			"rt.scope.internalAsset": "internal asset",
			"rt.scope.externalAsset": "external asset",
			"rt.role.plan": "Main session (commander)",
			"rt.role.recon": "Recon",
			"rt.role.assess": "Assess",
			"rt.role.vuln-scan": "Vuln scan",
			"rt.role.exploit": "Exploit",
			"rt.role.internal": "Internal pivot",
			"rt.filekind.poc": "POC",
			"rt.filekind.exp": "EXP",
			"rt.filekind.script": "Script",
			"rt.filekind.wordlist": "Wordlist",
			"rt.filekind.other": "Other",
			"rt.pockind.poc": "POC",
			"rt.pockind.exp": "EXP",
			"rt.pockind.script": "Script",
			"rt.pockind.template": "Template",
			"rt.pockind.payload": "Payload",
			"rt.pocsource.web": "Internet",
			"rt.pocsource.self": "Hand-crafted",
			"rt.pocsource.manual": "Manual",
			"rt.pocsource.nuclei-template": "nuclei template",
			"rt.pocsource.kb": "Knowledge base",
			"rt.poccat.rce": "RCE",
			"rt.poccat.deserialization": "Deserialization",
			"rt.poccat.file-upload": "File upload getshell",
			"rt.poccat.sqli": "SQL injection",
			"rt.poccat.unauthorized": "Unauth access",
			"rt.poccat.auth-bypass": "Auth bypass / privilege abuse",
			"rt.poccat.weak-password": "Weak cred / brute force",
			"rt.poccat.ssrf": "SSRF",
			"rt.poccat.xxe": "XXE",
			"rt.poccat.path-traversal": "Path traversal / arbitrary read",
			"rt.poccat.info-leak": "Info leak",
			"rt.poccat.privesc": "Privilege escalation / lateral",
			"rt.poccat.tunnel": "Tunnel / proxy",
			"rt.poccat.other": "Other",
			"rt.shot.title": "Evidence shots",
			"rt.shot.alt": "Evidence",
			"rt.shot.showing": "showing {n}",
			"rt.shot.ofTotal": " ({n} in total, representatives shown)",
			"rt.shot.screenshot": "Live screenshot",
			"rt.shot.card": "Excerpt generated from records",
			"rt.shot.screenshotTitle": "Live screenshot",
			"rt.shot.cardTitle": "Excerpt generated from the daily record, not a live screenshot — the report marks it as such",
			"rt.shot.cardSuffix": "generated from records (not a live screenshot)",
			"rt.shot.zoomClose": "click anywhere to close",
			"rt.a.searchPh": "Search IP / domain / fingerprint (Enter)",
			"rt.a.search": "Search",
			"rt.a.service": "Service",
			"rt.a.port": "Port",
			"rt.a.scopeAny": "Any scope",
			"rt.a.scopeExt": "External only",
			"rt.a.scopeInt": "Internal only",
			"rt.a.provTitle": "Filter by port provenance (shown in details)",
			"rt.a.provAny": "Any provenance",
			"rt.a.provPassive": "Passive only",
			"rt.a.provActive": "Active only",
			"rt.a.priAny": "Any ease",
			"rt.a.testAny": "Any test status",
			"rt.a.viewList": "List",
			"rt.a.viewTimeline": "Timeline",
			"rt.a.viewTimelineTitle": "Assets by discovery time",
			"rt.a.viewDomain": "Domains",
			"rt.a.viewWeb": "Web",
			"rt.a.refreshTitle": "Re-fetch snapshot and the current view",
			"rt.a.allCidr": "All CIDRs",
			"rt.a.nSegs": "{n} segments",
			"rt.a.testingEntry": "Active tests",
			"rt.a.testingShort": "T",
			"rt.a.testingTitle": "Running scans / probes with progress (lives on the Overview tab)",
			"rt.a.testingGo": "open overview",
			"rt.a.extAssets": "External assets",
			"rt.a.intAssets": "Internal assets",
			"rt.a.nCidr": "{n} CIDRs",
			"rt.a.nAssetsUnit": "{n} assets",
			"rt.a.nHosts": "{n} hosts",
			"rt.a.collapseGroup": "Collapse group (back to list)",
			"rt.a.expandGroup": "Expand group (back to list)",
			"rt.a.filterCidr": "Filter CIDR {cidr}",
			"rt.a.unknownOrg": "unknown org",
			"rt.a.liveOf": "{live}/{total} live",
			"rt.a.sortTitle": "Sort order",
			"rt.a.sortPriority": "Sort: easiest first",
			"rt.a.sortTodo": "Sort: untested first",
			"rt.a.sortDiscovered": "Sort: recently discovered",
			"rt.a.sortPorts": "Sort: most ports",
			"rt.a.sortIp": "Sort: by IP",
			"rt.a.filterHint": "Click to filter / click again to clear",
			"rt.a.filterBy": "Filter by \"{label}\" ({n})",
			"rt.a.nAssets": "assets",
			"rt.a.nLive": "live",
			"rt.a.nUntested": "untested",
			"rt.a.nGiveup": "given up",
			"rt.a.hIp": "IP",
			"rt.a.hTest": "Test status",
			"rt.a.hPorts": "Open ports / services",
			"rt.a.hFp": "Fingerprints",
			"rt.a.stateLive": "live",
			"rt.a.discoverUnknown": "discovery time unknown",
			"rt.a.discoveredAt": "Discovered",
			"rt.a.discoveredTip": "First time this asset entered the library (re-collection only refreshes \"last seen\")",
			"rt.a.lastSeen": "Last seen",
			"rt.a.blockedShort": "blk{n}",
			"rt.a.expandAsset": "Expand asset {ip}",
			"rt.a.dTest": "Test",
			"rt.a.blockedN": "blocked {n} times",
			"rt.a.notTested": "never tested",
			"rt.a.priNone": "unrated",
			"rt.a.dSurface": "Surface",
			"rt.a.surfaceUnrecorded": "not recorded (open ports below)",
			"rt.a.noPorts": "no open ports",
			"rt.a.more": "Expand all (ports · fingerprints · provenance · notes) ▼",
			"rt.a.less": "Collapse ▲",
			"rt.a.hostnames": "Hostnames",
			"rt.a.firstSeen": "First seen by source",
			"rt.a.dCidr": "CIDR",
			"rt.a.priExpect": "expected: ",
			"rt.a.priReason": "basis: ",
			"rt.a.dSource": "Source",
			"rt.a.passivePorts": "passive ports {n}",
			"rt.a.activePorts": "active ports {n}",
			"rt.a.openPorts": "Open ports / services",
			"rt.a.unknownService": "unknown service",
			"rt.a.cveNoId": "config issue",
			"rt.a.notes": "Test notes ({n})",
			"rt.a.notesShort": "Test notes",
			"rt.a.observations": "Provenance (latest 8)",
			"rt.a.unknownTool": "unknown tool",
			"rt.a.noMatch": "No matching assets",
			"rt.a.nAssetsTag": "{n} assets",
			"rt.a.domainEmptyCidr": "No domains under this CIDR (switch to All CIDRs for the full list)",
			"rt.a.domainEmpty": "No domain data yet (written during recon)",
			"rt.a.webUrl": "URL (clickable)",
			"rt.a.webTitle": "Title",
			"rt.a.webAsset": "Asset",
			"rt.a.webService": "Service",
			"rt.a.webEmptyCidr": "No web assets under this CIDR",
			"rt.a.webEmpty": "No web assets yet (URLs and titles appear after HTTP probing)",
			"rt.a.dPorts": "ports {n}",
			"rt.dt.title": "Asset discovery timeline",
			"rt.dt.span": "{n} assets · first {first} · latest {last} (discovery = first entering the library; re-collection only refreshes \"last seen\")",
			"rt.dt.noAssets": "No assets yet.",
			"rt.dt.byDay": "By day",
			"rt.dt.clearFilterShort": "Clear filter: {day}",
			"rt.dt.clearFilter": "Clear day filter: {day}",
			"rt.dt.dayTitle": "{day}: +{n} assets ({ni} internal / {ne} external)",
			"rt.dt.dayMeta": "{n} · int {ni} / ext {ne}",
			"rt.dt.filterDay": "Filter assets found on {day}",
			"rt.dt.recent": "Recently discovered ({n})",
			"rt.dt.recentOfDay": "Found on {day} ({n})",
			"rt.dt.dayEmpty": "No new assets on this day.",
			"rt.dt.timeUnknown": "time unknown",
			"rt.dt.ports": "{n} ports",
			"rt.c.flowHint": "Recon → internet foothold → boundary break → internal assets → target",
			"rt.c.totalScore": "Total {n} pts",
			"rt.c.viewA": "Chain A",
			"rt.c.viewATitle": "Vertical chain: stage-by-stage detail",
			"rt.c.viewB": "Chain B",
			"rt.c.viewBTitle": "Horizontal chain: all stages in one screen",
			"rt.c.empty": "No scored records yet.",
			"rt.c.emptyHint": "Record hits with redteam_score_hit and this chain will grow.",
			"rt.c.cumulative": "cumulative {n}",
			"rt.c.total": "total {n}",
			"rt.c.stageGoal": "Stage goal",
			"rt.c.scoredAssets": "Assets that scored · {n}",
			"rt.c.noScoredAssets": "No assets have scored yet",
			"rt.c.stageHits": "{n} hits this stage",
			"rt.c.noStageScore": "No scores in this stage yet",
			"rt.c.tunnelsOf": "Channels crossing the boundary · {n}",
			"rt.c.tunnelsSelfOnly": " ({n} more sit on our own VPS only and do not count)",
			"rt.c.tunnelsAllSelf": "All existing channels sit on our own servers and never touch the target — no boundary break. A target-side channel is required (reverse shell to us / frp client on target / suo5 via target webshell).",
			"rt.c.noTunnels": "No tunnels yet (register with redteam_tunnel_add once built)",
			"rt.c.usable": "usable",
			"rt.c.reach": "Reach",
			"rt.c.involvedAssets": "Assets involved · {n}",
			"rt.c.nVulns": "vulns {n}",
			"rt.c.easyN": "ease {p}",
			"rt.c.nHits": "{n} hits",
			"rt.c.usedVuln": "Via vuln",
			"rt.c.nthOfPoint": "Count",
			"rt.c.nthOf": "#{n} of this point · +{pts} pts",
			"rt.c.nth": "#{n}",
			"rt.c.record": "Record",
			"rt.c.resultEvidence": "Result & evidence",
			"rt.c.resultShort": "Result",
			"rt.c.action": "Action",
			"rt.c.unnamedStep": "(unnamed step)",
			"rt.c.inferred": " (inferred)",
			"rt.c.cappedTag": "service capped · not counted",
			"rt.c.cappedDefault": "Only the highest-scoring entry per asset:port counts",
			"rt.c.tunnelsN": "{n} tunnels",
			"rt.c.assetsScored": "assets scored",
			"rt.c.hitsN": "{n} hits",
			"rt.c.moreN": "…{n} more",
			"rt.f.searchPh": "Search title / CVE / target (Enter)",
			"rt.f.sevAny": "All severities",
			"rt.f.statusAny": "All statuses",
			"rt.f.gainedPerm": "gained access",
			"rt.f.groupedHint": "grouped by target · {n} targets",
			"rt.f.hSev": "Sev",
			"rt.f.hVuln": "Vuln / id",
			"rt.f.hTarget": "Target",
			"rt.f.hGained": "Gained",
			"rt.f.hStatus": "Status",
			"rt.f.hConf": "Conf",
			"rt.f.updatedTo": "Updated to \"{status}\"",
			"rt.f.gainedMissing": "Not recorded — after gaining access use redteam_vuln_update to fill gained (e.g. server access, tunnel, admin account)",
			"rt.f.gainedNone": "no access recorded",
			"rt.f.asset": "Asset",
			"rt.f.jumpAsset": "Asset detail",
			"rt.f.jumpAssetTitle": "Open {ip} in the assets tab",
			"rt.f.source": "Source",
			"rt.f.evidenceSummary": "Evidence",
			"rt.f.rawHttp": "raw HTTP",
			"rt.f.plainText": "text",
			"rt.f.httpEvidence": "HTTP evidence",
			"rt.f.requestBurp": "▸ Request (paste into Burp Repeater)",
			"rt.f.response": "▸ Response",
			"rt.f.evidenceMissing": "Missing — unverified/evidence-less vulns are excluded from the report; add redteam_http_evidence_add",
			"rt.f.attackFiles": "Attack files",
			"rt.f.noAttackFiles": "(none) Archive the script/shell/EXP behind this vuln with redteam_attack_file_add, with vuln_id",
			"rt.f.nVulns": "{n} vulns",
			"rt.f.exploitedN": "exploited {n}",
			"rt.f.assetIs": "asset {ip}",
			"rt.f.emptyVulns": "No findings yet",
			"rt.f.subVulns": "Vulns",
			"rt.f.subFiles": "Attack files",
			"rt.f.subCreds": "Credentials",
			"rt.f.subAccess": "Access",
			"rt.f.expandAll": "Expand all",
			"rt.f.expandAllTitle": "Expand all targets",
			"rt.f.collapseAll": "Collapse all",
			"rt.f.collapseAllTitle": "Collapse all targets",
			"rt.f.grouped": "Grouped by target",
			"rt.f.flat": "Flat list",
			"rt.f.groupedTitle": "Now: grouped by target (which host fell to what)",
			"rt.f.flatTitle": "Now: flat per-vuln list",
			"rt.f.filesHint": "Attack files are organized per-target folder (the former \"attack files\" tab); files linked to a vuln also show in that vuln's detail.",
			"rt.f.filesOrphan": " {n} files have no vuln_id yet; attach them for correlation.",
			"rt.f.filesStat": "{n} targets / {m} files",
			"rt.f.filesEmpty": "No attack files yet (working scripts/POC/EXP land here per-target)",
			"rt.f.filesFoot": "Layout: attack-files/<IP|URL host|CIDR>/ | only files that actually worked",
			"rt.f.fileEffect": "Effect",
			"rt.f.filePath": "Path",
			"rt.f.fileRecord": "Record",
			"rt.f.nFiles": "{n} files",
			"rt.f.credsOf": "Credentials · {n}",
			"rt.f.credsPlaintextNote": " (shown in plaintext — mind screen sharing)",
			"rt.f.credsEmpty": "No credentials yet (store passwords/keys/hashes with redteam_credential_add for instant reuse)",
			"rt.f.secretSelectAll": "click to select all",
			"rt.f.secretMissing": "No plaintext recorded — fill secret_value in redteam_credential_add so the panel can show it",
			"rt.f.cSource": "source {v}",
			"rt.f.cTool": "tool {v}",
			"rt.f.cEvidence": "evidence {v}",
			"rt.f.cNote": "Note: {v}",
			"rt.f.accessOf": "Gained access sessions · {n}",
			"rt.f.accessEmpty": "None",
			"rt.s.total": "Total",
			"rt.s.ptsUnit": "pts",
			"rt.s.nPoints": "{n} points",
			"rt.s.nHitCount": "{n} hits",
			"rt.s.selfNotCounted": "self-created {n}",
			"rt.s.serviceNotCounted": "service-capped {n}",
			"rt.s.selfCreatedTip": "Self-registered accounts never count as scored access (kept as process record only)",
			"rt.s.serviceCappedTip": "Account/db permissions count once per asset:port; the service is capped and later duplicates only leave a trace",
			"rt.s.newPoint": "+ New point",
			"rt.s.nameRequired": "Name is required",
			"rt.s.builtinLocked": "Enabled/disabled saved. Points unchanged: built-in points ship with the score rules and their value/cap/scope are locked (caps accumulate across the rule group). Use \"+ New point\" for custom values.",
			"rt.s.builtinTitle": "Built-in point (from the merged scoring rules)",
			"rt.s.builtinHint": "Value, cap, scope and name are locked by the rules — the cap of a rule accumulates across its points, so changing one value would let a single hit eat the group cap. Toggle enable/disable here; use \"+ New point\" for custom values.",
			"rt.s.builtinSrc": "rule clause #{src} · cap group rule={rule}",
			"rt.s.builtinCap": " · cap {n} pts",
			"rt.s.builtinNoCap": " · no cap",
			"rt.s.fName": "Name (required)",
			"rt.s.builtinNameLocked": "Name locked by the rules",
			"rt.s.fCategory": "Category, e.g. account access",
			"rt.s.builtinCatLocked": "Category locked by the rules (decides the panel group)",
			"rt.s.fPoints": "Points per hit",
			"rt.s.builtinPointsLocked": "Value locked by the scoring rules",
			"rt.s.fPointsTip": "Points per hit; accumulates per hit under the rule cap",
			"rt.s.enabled": "Enabled",
			"rt.s.disabled": "Disabled",
			"rt.s.fDesc": "Scoring condition",
			"rt.s.builtinDescLocked": "Clause text locked by the rules",
			"rt.s.builtinNoDelete": "Built-in points cannot be deleted (they come back on next start). Disable instead.",
			"rt.s.deleteBuiltin": "Delete (built-in)",
			"rt.s.hPoints": "Pts",
			"rt.s.hName": "Point (ascending)",
			"rt.s.hHits": "Hits / cap",
			"rt.s.hEarned": "Earned",
			"rt.s.empty": "No points yet — create one with \"+ New point\"",
			"rt.s.pointsN": "{n}p",
			"rt.s.groupItems": "{n} items",
			"rt.s.groupCap": " · caps total {n} (independent per item)",
			"rt.s.cappedTip": "{counted} counted, {capped} more skipped by \"{scope}\" or cap",
			"rt.s.scopeLabel": "scoring scope",
			"rt.s.nHits": "{n} hits",
			"rt.s.noHit": "no hit",
			"rt.s.cap": "cap {used}/{cap}",
			"rt.s.noAsset": "no asset",
			"rt.s.selfCreated": "self-created",
			"rt.s.serviceCapped": "service capped",
			"rt.s.shotN": "shots {n}",
			"rt.s.shotCountTip": "This hit carries evidence screenshots",
			"rt.s.noEvidence": "no account/result filled",
			"rt.s.condition": "Condition",
			"rt.s.status": "Status",
			"rt.s.statusLine": "{enabled} · {pts} pts/hit · {n} hits = {earned} pts{self}{capped}",
			"rt.s.selfExtra": " ({n} self-created not counted)",
			"rt.s.cappedExtra": " ({n} duplicate service hits not counted)",
			"rt.s.serviceCap": "Service cap",
			"rt.s.serviceCapRule": "; account/db permissions count once per asset:port — the highest account caps the service",
			"rt.s.hitRecords": "Hit records · {n} (assets and accounts only; see the report for reproduction)",
			"rt.s.hitRecordsEmpty": "None yet — record with redteam_score_hit after a win: target asset + account/password gained",
			"rt.s.shotsTitle": "Evidence shots · {n}",
			"rt.r.totalN": "Total {n} pts",
			"rt.r.countN": "{n} items",
			"rt.r.withRequests": "{n}/{m} with raw requests",
			"rt.r.reproN": "Reproducible {n}/{m}",
			"rt.r.reproTitle": "Reproduction completeness: steps present, real commands, vuln/creds/tunnel linked",
			"rt.r.serviceCappedN": "capped {n}",
			"rt.r.serviceCappedTip": "Duplicate account/db hits per asset:port: service capped, not scored, not in report",
			"rt.r.copyAll": "Copy all",
			"rt.r.downloadMd": "Download .md",
			"rt.r.wholeReport": "the whole report",
			"rt.r.downloaded": "Downloaded: {label}",
			"rt.r.downloadFail": "Download failed: {msg}",
			"rt.r.regenerate": "Regenerate",
			"rt.r.generating": "Generating…",
			"rt.r.empty": "No deliverables yet.",
			"rt.r.emptyHint": "Only scored wins enter this report. Record with redteam_score_hit (target asset + what you got) and add redteam_http_evidence_add for reproduction.",
			"rt.r.otherGroup": "Other scores",
			"rt.r.nItems": "{n} items",
			"rt.r.jumpChain": "Chain",
			"rt.r.jumpChainTitle": "Open this hit in the attack chain",
			"rt.r.copyReq": "Copy request",
			"rt.r.copyReqOf": "item #{n} requests",
			"rt.r.gotAt": "Achieved",
			"rt.r.traceTitle": "Reproduction steps (click to expand)",
			"rt.r.nSteps": "{n} actions",
			"rt.r.nCreds": "{n} creds",
			"rt.r.nTunnels": "{n} tunnels",
			"rt.r.incomplete": "materials missing",
			"rt.r.reproducible": "reproducible",
			"rt.r.noSteps": "No attack steps linked: how this was done is unclear. Add actions with redteam_chain_add (title / detail / tool / result); score_hit can also carry point_code + evidence in one call.",
			"rt.r.inferred": "inferred by asset",
			"rt.r.exec": "Ran",
			"rt.r.noTool": "actual command not recorded (redteam_chain_add tool)",
			"rt.r.copyCmd": "Copy command",
			"rt.r.stepCmdOf": "step #{n} command",
			"rt.r.result": "Result",
			"rt.r.credsSrc": "Credentials obtained (traceable)",
			"rt.r.credLine": "{user} / {type}{priv} · source {src}{tool}",
			"rt.r.noUser": "(no username)",
			"rt.r.credPriv": " · priv {p}",
			"rt.r.unmarked": "unmarked",
			"rt.r.credTool": " · obtained via {v}",
			"rt.r.tunnelsUsed": "Tunnels / channels used",
			"rt.r.tunnelLine": "entry {entry}{reach} · target side {side}{legit}{status}{cmd}",
			"rt.r.unregistered": "unregistered",
			"rt.r.tunnelReach": " · reaches {v}",
			"rt.r.undeclared": "undeclared",
			"rt.r.notBoundary": " · does not cross the boundary",
			"rt.r.tunnelCmd": " · command {v}",
			"rt.r.shellsUsed": "Webshells used",
			"rt.r.shellPass": " · pass/key {v}",
			"rt.r.gaps": "Reproduction gaps: ",
			"rt.r.noRequest": "No raw request for this item — cannot reproduce directly; add redteam_http_evidence_add",
			"rt.r.requestN": "Request {n}",
			"rt.r.requestAuto": " (matched by target path, verify)",
			"rt.r.requestOf": "request {n}",
			"rt.r.copyYakit": "Copy to Yakit",
			"rt.r.respSummary": "Response summary",
			"rt.r.note": "Note",
			"rt.r.footNote": "Scope: scored wins only, each with raw requests pasteable into Yakit Repeater",
			"rt.se.shellStat": "Webshells {on}/{n} online",
			"rt.se.tunnelStat": "Tunnels {on}/{n} usable",
			"rt.se.credStat": "Creds {n}",
			"rt.se.accessStat": "Access {n}",
			"rt.se.probe": "Probe connectivity",
			"rt.se.probing": "Probing…",
			"rt.se.probeDone": "Probe done: webshells online {on}/{n1}, tunnels usable {act}/{n2}",
			"rt.se.empty": "No webshells or tunnels registered yet.",
			"rt.se.emptyHow": "Register webshells with redteam_webshell_add; tunnels with redteam_tunnel_add (suo5 / socks5 / ssh -R); agents then see them via redteam_sessions.",
			"rt.se.howTo": "How (click to expand)",
			"rt.se.hintShell": "{n} entries are not Behinder/Godzilla shells (users cannot connect; not deliverable)",
			"rt.se.hintShellHow": "Re-upload an encrypted shell via the webshell-toolkit skill (behinder/godzilla) and record shell_type + pass_key in redteam_webshell_add. Note temporary relays in the note field.",
			"rt.se.hintTunnel": "All {n} channels do not cross the target boundary (no boundary/internal break)",
			"rt.se.hintTunnelHow": "socks5/frp/proxies on our own VPS do not count. The channel must originate from the target side: reverse shell to us, frp/Stowaway client on target, or suo5/HTTP via a target webshell; declare entry_kind when registering.",
			"rt.se.hintSuo5": "No usable suo5 tunnel yet (the standard channel into the intranet)",
			"rt.se.hintSuo5How": "Build a socks5 tunnel through a webshell above with the suo5-tunnel skill, register redteam_tunnel_add (kind=suo5, listen=127.0.0.1:1080, entry=webshell URL, reach=segments), then \"Probe connectivity\" until status=active.",
			"rt.se.shellOnline": "{on}/{n} online",
			"rt.se.shellSub": "controlled entries online",
			"rt.se.shellsEmpty": "None (register with redteam_webshell_add after landing one)",
			"rt.se.userCantConnect": "users cannot connect",
			"rt.se.copyUrl": "Copy URL",
			"rt.se.markOffline": "Mark offline",
			"rt.se.kind": "Kind",
			"rt.se.encryptedShell": "encrypted shell (Behinder/Godzilla, directly usable)",
			"rt.se.plainShell": "plain shell — users cannot connect; temporary relay only",
			"rt.se.passKey": "Pass key",
			"rt.se.privilege": "Privilege",
			"rt.se.credRef": "Cred ref",
			"rt.se.lastCheck": "Last check",
			"rt.se.unchecked": "unchecked",
			"rt.se.checkNote": "Check note",
			"rt.se.note": "Note",
			"rt.se.tunnelsTitle": "Internal tunnels",
			"rt.se.tunnelActive": "{on}/{n} usable",
			"rt.se.tunnelSub": "usable as scanner proxies",
			"rt.se.tunnelsEmpty": "None (register with redteam_tunnel_add once built)",
			"rt.se.noListen": "(no listen address)",
			"rt.se.notSuo5": "not the suo5 standard channel",
			"rt.se.targetSide": "target-side channel",
			"rt.se.notBreakthrough": "not a break",
			"rt.se.selfOnlyTip": "Channel on our own VPS only, never touches the target — not a boundary/internal break",
			"rt.se.pendingConfirm": "to confirm",
			"rt.se.entryKindTip": "entry_kind undeclared: describe the target-side end (target-outbound / target-http / target-agent)",
			"rt.se.reachN": "reaches {v}",
			"rt.se.copyAddr": "Copy address",
			"rt.se.markActive": "Mark usable",
			"rt.se.targetEntry": "Target-side entry",
			"rt.se.crossBoundary": "Crosses boundary",
			"rt.se.confirmedTargetSide": "target side confirmed",
			"rt.se.notBreakthroughFact": "not a break (own VPS proxy only)",
			"rt.se.entryKindPending": "entry_kind undeclared, to confirm",
			"rt.se.reachSeg": "Reachable segments",
			"rt.se.buildCmd": "Build command (expand / copy)",
			"rt.se.scanVia": "Scan via this tunnel (gogo / fscan)",
			"rt.se.copyGogo": "Copy gogo command",
			"rt.se.copyFscan": "Copy fscan command",
			"rt.se.manualMark": "marked manually in UI",
			"rt.ag.maxN": "Concurrency {n}",
			"rt.ag.usedUnknown": "usage unknown",
			"rt.ag.usedN": "running {used} / free {free}",
			"rt.ag.rulesTitle": "Concurrency rules (hard)",
			"rt.ag.rule1": "· At most {n} executor agents per target at once; claim a slot with redteam_agent_slot before dispatching.",
			"rt.ag.rule2": "· Dispatch sequentially by default; parallelize only truly independent work.",
			"rt.ag.rule3": "· Every session binds its own target: parallel sessions never mix reports (subagents inherit the parent target).",
			"rt.ag.rolesTitle": "Six roles",
			"rt.ag.role1": "1. recon — collect assets only, exhaustively (edge and unregistered included)",
			"rt.ag.role2": "2. assess — walk assets one by one, rate ease and store all",
			"rt.ag.role3": "3. vuln-scan — dedupe from the KB first → Nday/1day first → unauth API probing",
			"rt.ag.role4": "4. exploit — server access first (Behinder/Godzilla) + suo5 tunnel, then other points",
			"rt.ag.role5": "5. internal — via the tunnel, spin up 1-4 for the intranet",
			"rt.ag.role6": "6. plan — main session: plan, dispatch, summarize, report; hands off",
			"rt.ag.concurrencyTitle": "Concurrency",
			"rt.ag.concurrencyLine": "Max executor agents per target at once. Current: {max}{used}, source: {source}. Takes effect immediately, no restart.",
			"rt.ag.concurrencyUsed": " (running {used}, free {free})",
			"rt.ag.rangeOf": "Range 1 – {n}",
			"rt.ag.savedMax": "Saved: concurrency {n} (effective immediately)",
			"rt.ag.srcSettings": "panel setting",
			"rt.ag.srcEnv": "env REDTEAM_MAX_AGENTS",
			"rt.ag.srcDefault": "default",
			"rt.ag.concurrencyWarn": "Raising it is not faster: one model API key shares its rate limit; too many parallel agents queue, time out or get truncated. Start from 2–3 and raise only when quota suffices and tasks are truly independent.",
			"rt.ag.promptsTitle": "Role prompts (per target, editable here)",
			"rt.ag.promptsHint": "The prompts tab merged into this page; full editor below (save affects this target only).",
			"rt.p.promptsTitle": "Prompts",
			"rt.p.builtinNote": "Built-in defaults in effect (per-target edits after creating a target)",
			"rt.p.needEngagement": "Create a target before saving prompts",
			"rt.p.viewPrompt": "View the \"{role}\" prompt",
			"rt.p.updated": "updated {time}",
			"rt.p.resetCur": "Reset current",
			"rt.p.resetCurTitle": "Reset the current role to the latest built-in",
			"rt.p.resetAll": "Reset all",
			"rt.p.resetAllTitle": "Reset all roles to the latest built-in",
			"rt.p.resetDone": "Reset to built-in: {roles}",
			"rt.p.resetSep": ", ",
			"rt.p.placeholder": "System prompt for this role (Markdown)",
			"rt.p.saveHint": "Saves to agents/{role}.md. A subagent task whose first line has redteamRole: recon/assess/vuln-scan/exploit/internal picks up the file as its system prompt.",
			"rt.k.scopeHint": "Two-tier knowledge base: project scope travels with the project (deleted with it); global scope is shared across projects. Default \"All\" = project first, then global. Search uses SQLite FTS5; no embeddings needed.",
			"rt.k.scope.project": "Project",
			"rt.k.scope.global": "Global",
			"rt.k.scope.all": "All",
			"rt.k.scope.projectTip": "POCs saved in this project (deleted with the project folder)",
			"rt.k.scope.globalTip": "Global knowledge base shared across projects",
			"rt.k.scope.allTip": "Project first, then global, deduplicated by code",
			"rt.k.totalN": "{n} entries",
			"rt.k.verifiedN": "verified {n}",
			"rt.k.reusedN": "reused {n}",
			"rt.k.uncatN": "uncategorized {n}",
			"rt.k.uncatTip": "Not categorized yet: tag category in redteam_poc_add when backfilling",
			"rt.k.localTplN": "local templates {n}",
			"rt.k.grouped": "Grouped",
			"rt.k.flat": "Flat",
			"rt.k.groupedTitle": "Group by category / flat list",
			"rt.k.searching": "Searching…",
			"rt.k.search": "Search",
			"rt.k.searchPh": "Search CVE / component / keyword (full text too)",
			"rt.k.allCats": "All categories",
			"rt.k.allEngagements": "All source targets",
			"rt.k.assetFilter": "Found-on asset",
			"rt.k.allKinds": "All kinds",
			"rt.k.verifiedOnly": "verified only",
			"rt.k.catStat": " · local templates {tpl} · KB {kb}{verified}",
			"rt.k.catVerified": " (verified {n})",
			"rt.k.verified": "verified",
			"rt.k.unverified": "unverified",
			"rt.k.reuseN": "reused {n}",
			"rt.k.catOf": "category {v}",
			"rt.k.versionsOf": "versions {v}",
			"rt.k.createdAt": "created {time}",
			"rt.k.srcEngagement": "from target {v}",
			"rt.k.foundOn": "found on {v}",
			"rt.k.foundBy": "found by {v}",
			"rt.k.sourceIs": "source {v}",
			"rt.k.usage": "Usage",
			"rt.k.desc": "Description",
			"rt.k.verifyNote": "Verification note",
			"rt.k.lastUsed": "Last used",
			"rt.k.path": "Path",
			"rt.k.copyContent": "Copy content",
			"rt.k.markUse": "Mark reused",
			"rt.k.copySource": "Copy source",
			"rt.k.truncated": " (truncated; see the stored file)",
			"rt.k.metaOnly": "Metadata only — backfill the content with redteam_poc_update",
			"rt.k.manualUse": "marked manually in console",
			"rt.k.usedMarked": "Reuse recorded: {title}",
			"rt.k.nEntries": "{n} entries",
			"rt.k.latestAt": "latest {time}",
			"rt.k.tplRange": "local nuclei templates · {from}–{to} / {total} (run nuclei -t <path>)",
			"rt.k.tplCmd": "template command",
			"rt.k.copyCmd": "Copy command",
			"rt.k.prevPage": "Prev",
			"rt.k.nextPage": "Next",
			"rt.k.tplDir": "Templates: {path}",
			"rt.k.dbAt": "Knowledge base: {path}",
			"rt.k.rootAt": " (root {path})",
			"rt.k.oldHostHint": "The KB API comes from the host side and this host process is old — fully quit and reopen (official exe / community / dsh web), then reload.",
			"rt.k.noHitSearched": "No hits: try another keyword, or search the web / craft your own and backfill.",
			"rt.k.emptyWithTpl": "The POC/EXP library is empty; {n} nuclei templates exist locally but are not listed. Fully quit and reopen the client.",
			"rt.k.emptyTplNoYaml": "KB empty (template dir exists but has no yaml — run nuclei -update-templates).",
			"rt.k.emptyNoTpl": "KB empty and no local nuclei templates — run setup.sh or nuclei -update-templates on the drill machine.",
			"rt.k.orderHint": "Standard Nday/1day flow: 1) redteam_poc_search here (also searches local nuclei templates) → 2) else web search (web_search / GitHub / ExploitDB / advisories) or craft → 3) verify on the real target and backfill with redteam_poc_add for later targets.",
			"rt.k.footNote": "Global (cross-target) | stored: pocs/<code>/ | generic reusable POC/EXP only; target-specific scripts live in attack files",
			"rt.sk.filterPh": "Filter skills",
			"rt.sk.pluginOnly": "bundled only ({n})",
			"rt.sk.brokenOnly": "broken/unknown only ({n})",
			"rt.sk.brokenOnlyTip": "Only skills with concrete gaps (missing key/path or placeholder infra) or unknown availability",
			"rt.sk.availableN": "available {n}",
			"rt.sk.brokenN": "broken {n}",
			"rt.sk.unknownN": "unknown {n}",
			"rt.sk.recheck": "Recheck",
			"rt.sk.recheckTip": "Skill text or env just changed? Skip the 30s cache",
			"rt.sk.libsStat": "red-team {rt} · official {of}",
			"rt.sk.manyNote": "(most skills come from other plugins or your own dirs; this plugin bundles {n})",
			"rt.sk.redteamSkills": "Red-team skills",
			"rt.sk.officialSkills": "Official skills",
			"rt.sk.viewSkill": "View skill {name}",
			"rt.sk.manualOnly": "manual only",
			"rt.sk.official": "official",
			"rt.sk.officialTip": "Official catalog; not checked against red-team tool paths",
			"rt.sk.available": "available",
			"rt.sk.availableTip": "Available: body loads. Missing tools/keys are listed in the detail and do not block invocation.",
			"rt.sk.broken": "broken",
			"rt.sk.noDesc": "(no description)",
			"rt.sk.srcOf": "source {v}",
			"rt.sk.fromPlugin": "bundled",
			"rt.sk.catalogTitle": "Skill catalog (DSH native)",
			"rt.sk.whenToUse": "When to use",
			"rt.sk.kindLabel": "Kind",
			"rt.sk.officialKind": "Official skill, invoked by the host per task; not checked against red-team tool paths.",
			"rt.sk.availability": "Availability",
			"rt.sk.brokenDetail": "broken (concrete gaps)",
			"rt.sk.unknownDetail": "unknown (body unreadable)",
			"rt.sk.missingTools": "Missing external tools",
			"rt.sk.gaps": "Gaps",
			"rt.sk.needsUser": "Needs from you",
			"rt.sk.noteDefault": "Skills are managed by the DSH native skill system; red-team agents invoke them via the skill tool.",
			"rt.sk.checkedAt": "{when}{time}",
			"rt.sk.cachedAt": "cached ",
			"rt.sk.checkedAtLabel": "checked ",
			"rt.sk.brokenListTitle": "Skills that cannot run now:",
			"rt.sk.dirN": "{n} · {path}",
			"rt.sk.moreDirs": "…{n} more dirs ({m} skills total)",
			"rt.sk.pickLeft": "Pick a skill on the left to read it",
			"rt.e.ready": "ready · {reason}",
			"rt.e.pending": "pending",
			"rt.e.toolsN": "tools {found}/{total}",
			"rt.e.hintDefault": "All optional: empty means default paths / auto-detection; filled values override. Keys only for mapping/callback needs.",
			"rt.e.folderAssignTitle": "Toolkit folder → auto-assign tools",
			"rt.e.folderAssignHint": "If all tools sit in one folder (subdirs included), enter the path and click auto-assign: writes toolkitDir and matches nmap / nuclei / fscan etc. by filename below.",
			"rt.e.folderPh": "e.g. D:\\pentest-tools or /opt/toolkit",
			"rt.e.assign": "Auto-assign",
			"rt.e.scanning": "Scanning…",
			"rt.e.folderRequired": "Enter the toolkit folder path first",
			"rt.e.assigned": "Assigned {n} tools from the folder{tpl}",
			"rt.e.assignedTpl": ", nuclei-templates detected",
			"rt.e.egressTitle": "Egress (read-only)",
			"rt.e.emptyParen": "(empty)",
			"rt.e.platformDirTitle": "Platform & directories",
			"rt.e.platformMode": "Platform mode",
			"rt.e.platformAuto": "auto (follow the host, default)",
			"rt.e.toolkitDirLabel": "Toolkit dir (empty = default)",
			"rt.e.defaultIs": "default: {path}",
			"rt.e.nucleiDirLabel": "nuclei templates dir (empty = auto: toolkit/nuclei-templates)",
			"rt.e.binDirsLabel": "Search dirs binDirs (empty = toolkit + PATH only; one per line)",
			"rt.e.binDirsPh": "optional, e.g.\nD:\\tools\nD:\\pentest-bin",
			"rt.e.envTitle": "Keys & VPS (empty = no override; process env wins)",
			"rt.e.optional": " (optional)",
			"rt.e.fofaPh": "leave empty; fill when mapping",
			"rt.e.vpsHostPh": "leave empty; user@host when needed",
			"rt.e.vpsKeyPh": "leave empty; absolute path to the private key",
			"rt.e.toolsTitle": "Tool executables (empty = auto-detect)",
			"rt.e.toolsResolveOrder": "Resolution: table path → toolkitDir → binDirs → PATH. Empty means default lookup.",
			"rt.e.found": "found",
			"rt.e.notFound": "not found (may stay empty)",
			"rt.e.autoFindPh": "auto-find: {names}",
			"rt.e.notesTitle": "Notes",
			"rt.e.notesPh": "optional, e.g. tools from a portable bundle",
			"rt.e.configFile": "Config: {path} | empty fields fall back to defaults",
			"rt.e.savedTo": "Saved to {path}",
			"rt.ov.scoreTitle": "Score / max",
			"rt.ov.scoreSub": "{pct}% of max",
			"rt.ov.hitCount": "{hits} counted hits{capped}",
			"rt.ov.cappedExtra": " ({n} service-capped)",
			"rt.ov.noStages": "No scored records yet; stage progress appears here after the first hit.",
			"rt.ov.noRunningAgents": "No executor agents running.",
			"rt.ov.openAgents": "Manage concurrency / prompts",
			"rt.ov.recentHits": "Recent hits (5)",
			"rt.ov.noHits": "No hits yet.",
			"rt.ov.hitJump": "Open point \"{point}\" hit list",
			"rt.ov.hitJumpTitle": "Jump to the score board and expand the hit list",
			"rt.ov.evidenceTitle": "Evidence gaps",
			"rt.ov.missingEvidence": "{n} scored items lack raw requests",
			"rt.ov.missingEvidenceHow": "Wins without raw requests cannot be reproduced — add redteam_http_evidence_add before delivery.",
			"rt.ov.evidenceOk": "Evidence complete: {n}/{m} items carry raw requests.",
			"rt.ov.evidenceNoItems": "No deliverable wins yet.",
			"rt.t.cardTitle": "Active tests",
			"rt.t.testingNow": "Testing now",
			"rt.t.nHosts": "{n} hosts",
			"rt.t.testingSub": "agents are working these assets",
			"rt.t.testingEmptySub": "assets appear here live once an agent starts testing",
			"rt.t.testingEmpty": "No assets currently \"testing\"",
			"rt.t.recent": "Recently touched",
			"rt.t.recentSub": "already-tested assets",
			"rt.t.queue": "Queue",
			"rt.t.queueSub": "ordered by ease and port count",
			"rt.t.queueHint": "Full list (filters and sorting) on the Assets tab",
			"rt.t.queueEmpty": "No pending assets",
			"rt.t.updatedAt": "updated {time}",
			"rt.t.expandAllTitle": "Expand recent and queue",
			"rt.t.collapseAllTitle": "Keep testing only",
			"rt.t.autoTitle": "Auto refresh every 5s",
			"rt.t.live5s": "live · 5s",
			"rt.t.paused": "paused",
			"rt.t.surface": "Surface",
			"rt.t.potential": "Expected score",
			"rt.t.openPorts": "{n} open ports",
			"rt.t.webshells": "webshells {n}"
		};
		// client/index.ts
		/** 全局主面板 id（main 槽位 key 与 sidebar.panellist id 必须同名）。 */
		const PANEL_ID = NS;
		/** 右侧栏页签 kind（openTab 与页签登记共用；与 id 同名）。 */
		const TAB_KIND = NS;
		/** 红队演练台页签 kind（与类型 id 同名，keyed 槽位按 id 分发）。 */
		const REDTEAM_TAB_KIND = RT_NS;
		/**
		* 声明依赖的客户端服务。sidebarRightTabs 必须显式声明：
		* cordis 对未 inject 的服务访问必抛（cannot get property without inject），
		* try/catch 软取只会拿到 undefined，右侧栏页签会静默不注册。
		* 宿主模块预载由 package.json 的 dsh.client.inject 保证（含 ui-sidebar-right）。
		*/
		const inject = [
			"slots",
			"locale",
			"sidebarRightTabs"
		];
		function apply(ctx) {
			const sidebarRightTabs = (() => {
				try {
					return ctx.sidebarRightTabs;
				} catch {
					return;
				}
			})();
			const hasRightRail = sidebarRightTabs !== void 0;
			const layout = (() => {
				try {
					const injected = ctx.layout;
					if (injected !== void 0 && injected !== null && typeof injected === "object") return injected;
				} catch {}
				try {
					const value = typeof ctx.get === "function" ? ctx.get("layout") : void 0;
					return value !== void 0 && value !== null && typeof value === "object" ? value : void 0;
				} catch {
					return;
				}
			})();
			ctx.effect(() => ctx.locale.register(NS, {
				zh: zh$1,
				en: en$1
			}), "dsh-purge: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(RT_NS, {
				zh,
				en
			}), "dsh-purge: redteam dictionaries");
			const trt = ctx.locale.bind(RT_NS);
			ctx.effect(() => ctx.locale.register(BLUE_NS, {
				zh: zhBlue,
				en: enBlue
			}), "dsh-purge: blueteam dictionaries");
			const tb = ctx.locale.bind(BLUE_NS);
			ctx.effect(installStyles, "dsh-purge: styles");
			ctx.effect(installRtStyles, "dsh-purge: redteam styles");
			const notices = createNotices();
			const nav = createMainNav("overview");
			/**
			* 打开设置页（sidebar.settings 外壳），返回是否成功。
			* 宿主没有设置外壳时由调用方提示，不再降级渲染第二份设置页。
			*/
			const openSettingsSection = () => {
				try {
					for (const entry of ctx.slots.entries("sidebar.settings")) {
						const store = entry.store;
						if (typeof store?.create !== "function") continue;
						const shell = store.create();
						const actions = shell?.actions;
						if (typeof actions?.openSection !== "function" || store.create() !== shell) continue;
						actions.openSection(NS);
						return true;
					}
				} catch {}
				return false;
			};
			/** 破甲面板右上 ⚙：深链到「设置 → 破甲」（全局配置唯一的家）。 */
			const openSettings = () => {
				if (!openSettingsSection()) notices.report(t("main.settingsUnavailable"), "failure");
			};
			const openMainPanel = (tab = "overview", sessionId) => {
				nav.select(tab, sessionId === void 0 ? null : sessionId);
				if (layout !== void 0 && typeof layout.selectPanel === "function") try {
					layout.selectPanel(PANEL_ID);
					return;
				} catch {}
				if (!openSettingsSection()) notices.report(t("main.panelUnavailable"), "failure");
			};
			const openDrill = (sessionId) => {
				openMainPanel("redteam", sessionId);
			};
			/** 同步读服务（属性优先，其次 ctx.get）；没有就返回 undefined。 */
			const readService = (name) => {
				try {
					const injected = ctx[name];
					if (injected !== void 0 && injected !== null && typeof injected === "object") return injected;
				} catch {}
				try {
					const value = typeof ctx.get === "function" ? ctx.get(name) : void 0;
					return value !== void 0 && value !== null && typeof value === "object" ? value : void 0;
				} catch {
					return;
				}
			};
			/**
			* 惰性 + 短等待地取客户端服务。
			* 为什么不在 apply 时取一次：ui-workspace / workspace-controller 的服务由各自的插件
			* 在 apply 阶段 mint，加载顺序不保证；apply 时取不到就永远是 undefined（表现为"点了没反应"）。
			* 也不用把服务写进 inject：服务名一旦对不上，整个插件会 PENDING，破甲面板直接消失。
			*/
			const requireService = async (name, tries = 20) => {
				for (let i = 0; i < tries; i += 1) {
					const value = readService(name);
					if (value !== void 0) return value;
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			};
			let workspaces = readService("workspaces");
			/**
			* 当前会话是不是「红队模式」会话（客户端判定）。
			* 读 sessions 快照里的预设投影：byId[id].projectionValues.agentPreset，
			* 兜底读 projectionsBySession[id] 的两个可能形状。取不到就返回 false（宁可不显示）。
			*/
			const isRedteamSessionClient = (sessionId) => {
				if (sessionId === "") return false;
				try {
					const snap = readService("sessions")?.list?.getSnapshot?.();
					if (snap === void 0 || snap === null) return false;
					const row = snap.byId !== void 0 ? snap.byId[sessionId] : void 0;
					let preset = row !== void 0 && row.projectionValues !== void 0 ? row.projectionValues.agentPreset : void 0;
					if (typeof preset !== "string") {
						const proj = snap.projectionsBySession !== void 0 ? snap.projectionsBySession[sessionId] : void 0;
						const values = proj !== void 0 && proj !== null ? proj.values ?? proj.projectionValues : void 0;
						preset = values !== void 0 && values !== null ? values.agentPreset : void 0;
					}
					if (typeof preset === "string") {
						const id = preset.toLowerCase();
						if (id === "redteam" || id.endsWith("/redteam")) return true;
					}
					return (row !== void 0 && typeof row.cwd === "string" ? row.cwd : "").split(String.fromCharCode(92)).join("/").toLowerCase().includes("/redteam/engagements/");
				} catch {
					return false;
				}
			};
			/** 面板用的服务自检：一眼看出"点按钮没反应"是不是宿主服务没就绪。 */
			const probeServices = () => ({
				uiWorkspace: readService("uiWorkspace") !== void 0,
				workspaces: readService("workspaces") !== void 0,
				layout: readService("layout") !== void 0
			});
			/**
			* 确保项目已绑定一个 DSH 工作区：目录就是项目的数据目录（资产库同目录）。
			* 幂等：已绑定且工作区还在就直接返回；否则按目录创建/采纳并回写 engagement.yaml。
			* @param id - 项目 id。
			* @returns 工作区 id 与目录；无法创建时返回 null。
			*/
			const ensureWorkspace = async (id, api = rtOp) => {
				const listed = await api("projects");
				if (!listed.ok) return null;
				const project = (Array.isArray(listed.data.items) ? listed.data.items : []).find((row) => row.id === id);
				if (project === void 0) return null;
				const dir = typeof project.dir === "string" ? project.dir : "";
				const bound = typeof project.workspace_id === "string" && project.workspace_id !== "" ? project.workspace_id : "";
				const known = (() => {
					try {
						const snap = workspaces?.list?.getSnapshot?.();
						return snap !== void 0 && snap !== null && Array.isArray(snap.items) ? snap.items : [];
					} catch {
						return [];
					}
				})();
				const alive = bound !== "" && known.some((row) => row !== void 0 && (row.workspaceId === bound || row.id === bound));
				if (bound !== "" && (known.length === 0 || alive)) return {
					workspaceId: bound,
					dir
				};
				const live = (() => {
					if (workspaces !== void 0 && typeof workspaces.create === "function") return workspaces;
					for (let i = 0; i < 10; i += 1) try {
						const value = typeof ctx.get === "function" ? ctx.get("workspaces") : void 0;
						if (value !== void 0 && value !== null && typeof value.create === "function") return value;
					} catch {}
				})();
				if (dir === "" || live !== void 0 && typeof live.create !== "function") return null;
				const wsService = live !== void 0 && typeof live.create === "function" ? live : await requireService("workspaces");
				if (wsService === void 0 || typeof wsService.create !== "function") {
					try {
						notices.report("工作区服务不可用：宿主 ui-workspace 未就绪", "failure");
					} catch {}
					return null;
				}
				try {
					const view = await wsService.create({ path: dir });
					const workspaceId = typeof view.workspaceId === "string" ? view.workspaceId : "";
					if (workspaceId === "") return null;
					const title = "攻防演练 · " + String(project.name || id);
					try {
						if (typeof wsService.rename === "function") await wsService.rename(workspaceId, title);
					} catch {}
					await api("linkWorkspace", {
						engagement: id,
						workspaceId,
						title
					});
					return {
						workspaceId,
						dir
					};
				} catch (error) {
					const msg = error instanceof Error ? error.message : String(error);
					try {
						console.warn("[dsh-purge] 创建工作区失败：", error);
					} catch {}
					try {
						notices.report("工作区创建失败：" + msg, "failure");
					} catch {}
					return null;
				}
			};
			let uiWorkspace = readService("uiWorkspace");
			/**
			* 一键开始演练：把项目设为当前项目，再新建一个跑「红队模式」预设的会话，
			* 开场白把 preflight → 开靶 → 五角色派活写清楚（模型据此自动调用子智能体）。
			* 绑定由工具侧自动完成：全局当前指针刚被指到该项目，会话首个工具调用即绑定它。
			*/
			/**
			* 进入演练：切到项目对应的 DSH 工作区并打开一个「红队模式」会话（复用空白或新建）。
			* 不写草稿、不要求回车——进去就是一个可用的对话，用户直接说第一句。
			*/
			const enterDrill = async (id) => {
				try {
					await rtOp("activateEngagement", { engagement: id });
				} catch {}
				const space = await ensureWorkspace(id);
				if (space === null) return false;
				const wsApi = uiWorkspace !== void 0 && typeof uiWorkspace.openWorkspace === "function" ? uiWorkspace : await requireService("uiWorkspace");
				if (wsApi === void 0 || typeof wsApi.openWorkspace !== "function") return false;
				try {
					await wsApi.openWorkspace(space.workspaceId, void 0, { agentPreset: "redteam" });
				} catch (error) {
					try {
						console.warn("[dsh-purge] openWorkspace failed:", error);
					} catch {}
					return false;
				}
				closeMain();
				return true;
			};
			/**
			* 在同一项目工作区里再开一个新对话（红队模式）。
			* 走 openWorkspace + startSession 两次调用：openWorkspace 负责切工作区（这条路径已实测可用），
			* startSession 负责在该工作区建/复用空白会话并指定预设——比 connectWorkspace 单独一条稳。
			*/
			const newDrillSession = async (id) => {
				try {
					await rtOp("activateEngagement", { engagement: id });
				} catch {}
				const space = await ensureWorkspace(id);
				if (space === null) return false;
				const ws = uiWorkspace !== void 0 && typeof uiWorkspace.openWorkspace === "function" ? uiWorkspace : await requireService("uiWorkspace");
				if (ws === void 0 || typeof ws.openWorkspace !== "function") return false;
				if (typeof ws.startSession !== "function") return false;
				try {
					ws.startSession(space.workspaceId, { agentPreset: "redteam" });
				} catch (error) {
					try {
						console.warn("[dsh-purge] newDrillSession failed:", error);
					} catch {}
					return false;
				}
				closeMain();
				return true;
			};
			/**
			* 把普通会话"转成"红队演练：宿主不支持运行时改预设，所以新建一个红队会话，
			* 并把当前会话最后一条用户消息作为交接语带过去（不用重新描述需求）。
			* @param sessionId - 当前（普通）会话 id。
			* @param projectId - 目标项目。
			*/
			const convertToDrill = async (sessionId, projectId) => {
				const space = await ensureWorkspace(projectId);
				if (space === null) return false;
				const wsApi = uiWorkspace !== void 0 && typeof uiWorkspace.startSession === "function" ? uiWorkspace : await requireService("uiWorkspace");
				if (wsApi === void 0 || typeof wsApi.startSession !== "function") return false;
				try {
					await rtOp("activateEngagement", { engagement: projectId });
					wsApi.startSession(space.workspaceId, { agentPreset: "redteam" });
				} catch (error) {
					try {
						console.warn("[dsh-purge] convertToDrill failed:", error);
					} catch {}
					return false;
				}
				return true;
			};
			/** 删除项目：删目录 + 删工作区 + 清绑定（不可恢复，前端二次确认）。 */
			const deleteProject = async (id, workspaceId) => {
				const result = await rtOp("deleteEngagement", { engagement: id });
				if (!result.ok) return false;
				const wsId = workspaceId !== void 0 && workspaceId !== null && workspaceId !== "" ? workspaceId : result.data.deleted !== void 0 && result.data.deleted !== null ? result.data.deleted.workspace_id : null;
				if (typeof wsId === "string" && wsId !== "" && workspaces !== void 0 && typeof workspaces.delete === "function") try {
					await workspaces.delete(wsId);
				} catch {}
				return true;
			};
			/**
			* 蓝队值守：切到项目工作区并打开一个「蓝队模式」会话。
			* 与 enterDrill 是两条平行线：工具集/库/面板页签都不同，preset 名也不同。
			*/
			const enterShift = async (id) => {
				try {
					await blueOp("activateEngagement", { engagement: id });
				} catch {}
				const space = await ensureWorkspace(id, blueOp);
				if (space === null) return false;
				const wsApi = uiWorkspace !== void 0 && typeof uiWorkspace.openWorkspace === "function" ? uiWorkspace : await requireService("uiWorkspace");
				if (wsApi === void 0 || typeof wsApi.openWorkspace !== "function") return false;
				try {
					await wsApi.openWorkspace(space.workspaceId, void 0, { agentPreset: "blueteam" });
				} catch {
					return false;
				}
				closeMain();
				return true;
			};
			/** 在同一蓝队项目里再开一个值守会话。 */
			const newShiftSession = async (id) => {
				try {
					await blueOp("activateEngagement", { engagement: id });
				} catch {}
				const space = await ensureWorkspace(id, blueOp);
				if (space === null) return false;
				const ws = uiWorkspace !== void 0 && typeof uiWorkspace.openWorkspace === "function" ? uiWorkspace : await requireService("uiWorkspace");
				if (ws === void 0 || typeof ws.startSession !== "function") return false;
				try {
					ws.startSession(space.workspaceId, { agentPreset: "blueteam" });
				} catch {
					return false;
				}
				closeMain();
				return true;
			};
			/** 删除蓝队项目：删目录 + 删工作区 + 清绑定。 */
			const deleteBlueProject = async (id) => {
				const result = await blueOp("deleteEngagement", { engagement: id });
				if (!result.ok) return false;
				const wsId = result.data.deleted !== void 0 && result.data.deleted !== null ? result.data.deleted.workspace_id : null;
				if (typeof wsId === "string" && wsId !== "" && workspaces !== void 0 && typeof workspaces.delete === "function") try {
					await workspaces.delete(wsId);
				} catch {}
				return true;
			};
			/** 关闭全局面板回到对话：演练发生在会话里，面板只是发射台。 */
			const closeMain = () => {
				if (layout !== void 0 && typeof layout.selectPanel === "function") try {
					layout.selectPanel(null);
					return true;
				} catch {}
				return false;
			};
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: PANEL_ID,
				inject: () => ({
					t,
					trt,
					tb,
					notices,
					nav,
					openSettings,
					enterDrill,
					newDrillSession,
					deleteProject,
					closeMain,
					enterShift,
					newShiftSession,
					deleteBlueProject,
					probeServices
				})
			}, PurgeMain));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: PANEL_ID,
				order: 30,
				label: () => t("main.title")
			}, PurgeIcon));
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: NS,
				order: 90,
				label: () => t("settings.title"),
				inject: () => ({
					t,
					notices
				})
			}, PurgeSettings));
			if (hasRightRail && sidebarRightTabs !== void 0) {
				ctx.effect(() => sidebarRightTabs.register({
					id: TAB_KIND,
					kind: TAB_KIND,
					title: () => t("panel.title")
				}), "dsh-purge: sidebar tab type");
				ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
					name: "sidebar.right.pane.tab",
					key: TAB_KIND,
					inject: (sessionId) => ({
						t,
						sessionId,
						notices,
						isRedteam: () => isRedteamSessionClient(sessionId ?? ""),
						openDrill: () => {
							openDrill(sessionId);
						}
					})
				}, PurgePanel));
				ctx.effect(() => sidebarRightTabs.register({
					id: REDTEAM_TAB_KIND,
					kind: REDTEAM_TAB_KIND,
					title: () => trt("rt.title")
				}), "dsh-purge: redteam tab type");
				ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
					name: "sidebar.right.pane.tab",
					key: REDTEAM_TAB_KIND,
					inject: (sessionId) => ({
						t: trt,
						sessionId,
						notices,
						openSettings
					})
				}, RedteamTab));
			}
			ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
				name: "conversation.input.right",
				id: "dsh-purge.rewind",
				order: 100,
				inject: (sessionId) => ({
					t,
					sessionId: sessionId ?? "",
					notices
				})
			}, RewindSafe));
			ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
				name: "conversation.input.right",
				id: "dsh-purge.new-drill",
				order: 90,
				inject: (sessionId) => ({
					t,
					sessionId: sessionId ?? "",
					newDrillSession,
					convertToDrill,
					notices
				})
			}, DrillNewSession));
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: NS,
				order: -8,
				inject: (sessionId) => ({
					t,
					sessionId: sessionId ?? "",
					isRedteam: () => isRedteamSessionClient(sessionId ?? ""),
					openPanel: () => {
						openMainPanel("redteam", sessionId === void 0 ? null : sessionId);
					}
				})
			}, DrillBadge));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-purge.toast",
				inject: () => ({ source: notices })
			}, Toast));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-purge.dialog",
				inject: () => ({})
			}, DialogHost));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
