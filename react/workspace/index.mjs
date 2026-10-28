// Independent expected-state oracle: no imports from adapter reducers or selectors.
function initial() {
	return {
		tasks: Array.from({ length: 1000 }, (_, id) => ({
			id,
			title: `Task ${String(id + 1).padStart(4, "0")}`,
			project: id % 10,
			assignee: id % 8,
			status: ["todo", "doing", "done"][id % 3],
			labels: [`label-${id % 5}`, `label-${(id + 2) % 5}`],
			checklist: [0, 1, 2].map((i) => ({
				title: `Step ${i + 1}`,
				done: (id + i) % 2 === 0,
			})),
		})),
		selected: 0,
		query: "",
		status: "",
		assignee: "",
		sort: "id",
	};
}
function rows(state) {
	const filtered = state.tasks.filter(
		(t) =>
			(!state.query ||
				t.title.toLowerCase().includes(state.query.toLowerCase())) &&
			(!state.status || t.status === state.status) &&
			(state.assignee === "" || t.assignee === Number(state.assignee)),
	);
	filtered.sort(
		state.sort === "reverse"
			? (a, b) => b.id - a.id
			: state.sort === "title"
				? (a, b) => a.title.localeCompare(b.title) || a.id - b.id
				: (a, b) => a.id - b.id,
	);
	return filtered;
}
function assert(ok, message) {
	if (!ok) throw new Error(message);
}
function checkTask(element, task) {
	assert(element, `Missing task ${task.id}`);
	const fields = {
		title: task.title,
		project: `Project ${task.project + 1}`,
		status: task.status,
		assignee: `Person ${task.assignee + 1}`,
		labels: task.labels.join(", "),
		checklist: `${task.checklist.filter((i) => i.done).length}/3`,
	};
	for (const [field, value] of Object.entries(fields))
		assert(
			element.querySelector(`[data-field="${field}"]`)?.textContent === value,
			`Task ${task.id}: incorrect ${field}`,
		);
}
function check(target, state) {
	const expected = rows(state),
		actual = [...target.querySelectorAll("[data-task]")];
	assert(
		actual.length === Math.min(expected.length, 50),
		"Incorrect page length",
	);
	actual.forEach((element, i) => {
		assert(
			Number(element.dataset.task) === expected[i].id,
			"Incorrect row order",
		);
		checkTask(element, expected[i]);
	});
	const task = state.tasks[state.selected],
		detail = target.querySelector("[data-detail]");
	assert(Number(detail?.dataset.detail) === task.id, "Incorrect selection");
	checkTask(detail, task);
	const counts = {
		total: 1000,
		matching: expected.length,
		todo: 0,
		doing: 0,
		done: 0,
		assigned: 0,
	};
	for (const task of state.tasks) {
		counts[task.status]++;
		if (task.assignee === 0) counts.assigned++;
	}
	for (const [key, value] of Object.entries(counts))
		assert(
			target.querySelector(`[data-count="${key}"]`)?.textContent ===
				`${key}: ${value}`,
			`Incorrect ${key} count`,
		);
	const controls = {
		edit: task.title,
		status: task.status,
		assignee: String(task.assignee),
		query: state.query,
		filterStatus: state.status,
		filterAssignee: state.assignee,
		sort: state.sort,
	};
	for (const [key, value] of Object.entries(controls)) {
		const input = target.querySelector(`[data-control="${key}"]`);
		assert(input?.value === value, `Incorrect ${key} control`);
		if (input.tagName === "INPUT")
			assert(input.defaultValue === value, `Uncommitted ${key} input`);
	}
	task.checklist.forEach((item, i) =>
		assert(
			detail.querySelector(`[data-check="${i}"]`)?.checked === item.done,
			`Incorrect checklist ${i}`,
		),
	);
}
export function validateInitial(target) {
	check(target, initial());
}
let finalState;
export function validate(target) {
	check(target, finalState);
}
function input(target, key, value) {
	const el = target.querySelector(`[data-control="${key}"]`);
	if (el.tagName === "INPUT")
		Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			"value",
		).set.call(el, value);
	else el.value = value;
	el.dispatchEvent(
		new Event(el.tagName === "INPUT" ? "input" : "change", { bubbles: true }),
	);
}
// Each checkpoint waits for the whole observable result, not an adapter-written
// revision flag. Timestamp before validation keeps oracle work out of the metric.
async function measure(target, state, trigger, label) {
	return new Promise((resolve, reject) => {
		let lastError;
		const timer = setTimeout(() => {
			observer.disconnect();
			reject(new Error(`${label}: ${lastError?.message || "No DOM commit"}`));
		}, 5000);
		const observer = new MutationObserver(() => {
			const committed = performance.now();
			try {
				check(target, state);
			} catch (error) {
				lastError = error;
				return;
			}
			observer.disconnect();
			clearTimeout(timer);
			resolve(committed - start);
		});
		observer.observe(target, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
		});
		const start = performance.now();
		try {
			trigger();
		} catch (error) {
			observer.disconnect();
			clearTimeout(timer);
			reject(error);
		}
	});
}
export default async function run(target) {
	const s = initial();
	const times = Object.fromEntries(
		[
			"edit",
			"checklist",
			"status",
			"assignee",
			"search",
			"filter",
			"sort",
			"bulk",
			"incoming",
			"selection",
		].map((k) => [k, 0]),
	);
	async function step(metric, change, trigger) {
		change();
		times[metric] += await measure(target, s, trigger, metric);
	}
	const control = (metric, key, value, change) =>
		step(metric, change, () => input(target, key, value));
	await control("edit", "edit", "Updated task 0001", () => {
		s.tasks[0].title = "Updated task 0001";
	});
	await step(
		"checklist",
		() => {
			s.tasks[0].checklist[1].done = true;
		},
		() => target.querySelector('[data-check="1"]').click(),
	);
	await control("filter", "filterStatus", "todo", () => {
		s.status = "todo";
	});
	await control("status", "status", "doing", () => {
		s.tasks[0].status = "doing";
	});
	await control("filter", "filterStatus", "", () => {
		s.status = "";
	});
	await control("filter", "filterAssignee", "0", () => {
		s.assignee = "0";
	});
	await control("assignee", "assignee", "1", () => {
		s.tasks[0].assignee = 1;
	});
	await control("filter", "filterAssignee", "", () => {
		s.assignee = "";
	});
	await control("search", "query", "Task 00", () => {
		s.query = "Task 00";
	});
	await control("sort", "sort", "reverse", () => {
		s.sort = "reverse";
	});
	await control("search", "query", "", () => {
		s.query = "";
	});
	await control("sort", "sort", "id", () => {
		s.sort = "id";
	});
	await step(
		"bulk",
		() => {
			for (const task of rows(s).slice(0, 20)) task.status = "done";
		},
		() => target.querySelector('[data-action="bulk"]').click(),
	);
	await step(
		"incoming",
		() => {
			for (const task of s.tasks.filter(
				(t) => t.id < 10 || (t.id >= 900 && t.id < 910),
			)) {
				task.title += " synced";
				task.assignee = (task.assignee + 1) % 8;
				task.status = "doing";
			}
		},
		() => target.querySelector('[data-action="incoming"]').click(),
	);
	await step(
		"selection",
		() => {
			s.selected = 1;
		},
		() => target.querySelector('[data-task="1"] button').click(),
	);
	await control("edit", "edit", "Second selected task", () => {
		s.tasks[1].title = "Second selected task";
	});
	// Expose every off-screen incoming record, then replace the detail subscription.
	await control("search", "query", "synced", () => {
		s.query = "synced";
	});
	await step(
		"selection",
		() => {
			s.selected = 900;
		},
		() => target.querySelector('[data-task="900"] button').click(),
	);
	await control("status", "status", "done", () => {
		s.tasks[900].status = "done";
	});
	await control("search", "query", "", () => {
		s.query = "";
	});
	await step(
		"selection",
		() => {
			s.selected = 0;
		},
		() => target.querySelector('[data-task="0"] button').click(),
	);
	finalState = s;
	window.tachometerResultInteractions = times;
	return Object.values(times).reduce((a, b) => a + b, 0);
}
