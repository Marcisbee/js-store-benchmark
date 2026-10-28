export type Task = {
	id: number;
	title: string;
	project: number;
	assignee: number;
	status: string;
	labels: string[];
	checklist: { title: string; done: boolean }[];
};
export type State = {
	tasks: Task[];
	selected: number;
	query: string;
	status: string;
	assignee: string;
	sort: string;
};
export type Action = {
	type:
		| "edit"
		| "status"
		| "assignee"
		| "checklist"
		| "query"
		| "filterStatus"
		| "filterAssignee"
		| "sort"
		| "select"
		| "bulk"
		| "incoming";
	value?: string | number;
};
export function initialState(): State {
	return {
		tasks: Array.from({ length: 1000 }, (_, id) => ({
			id,
			title: `Task ${String(id + 1).padStart(4, "0")}`,
			project: id % 10,
			assignee: id % 8,
			status: ["todo", "doing", "done"][id % 3],
			labels: [`label-${id % 5}`, `label-${(id + 2) % 5}`],
			checklist: Array.from({ length: 3 }, (_, i) => ({
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
// The same domain operation can target immutable copies, observable objects or
// per-task stores. Store adapters own notification and transaction semantics.
export function applyAction(
	state: State,
	action: Action,
	updateTask: (id: number, change: (task: Task) => void) => void,
): void {
	const value = action.value;
	switch (action.type) {
		case "query":
			state.query = String(value);
			return;
		case "filterStatus":
			state.status = String(value);
			return;
		case "filterAssignee":
			state.assignee = String(value);
			return;
		case "sort":
			state.sort = String(value);
			return;
		case "select":
			state.selected = Number(value);
			return;
		case "bulk":
			for (const task of visible(state).slice(0, 20))
				updateTask(task.id, (task) => {
					task.status = "done";
				});
			return;
		case "incoming":
			for (const id of [
				...Array.from({ length: 10 }, (_, i) => i),
				...Array.from({ length: 10 }, (_, i) => 900 + i),
			])
				updateTask(id, (task) => {
					task.title += " synced";
					task.assignee = (task.assignee + 1) % 8;
					task.status = "doing";
				});
			return;
	}
	updateTask(state.selected, (task) => {
		if (action.type === "edit") task.title = String(value);
		else if (action.type === "status") task.status = String(value);
		else if (action.type === "assignee") task.assignee = Number(value);
		else if (action.type === "checklist") {
			const item = task.checklist[Number(value)];
			item.done = !item.done;
		}
	});
}
export function mutate(state: State, action: Action): void {
	applyAction(state, action, (id, change) => change(state.tasks[id]));
}
export function copyTask(task: Task): Task {
	return {
		id: task.id,
		title: task.title,
		project: task.project,
		status: task.status,
		assignee: task.assignee,
		labels: task.labels,
		checklist: task.checklist.map((item) => ({
			title: item.title,
			done: item.done,
		})),
	};
}
export function reduce(state: State, action: Action): State {
	const next = { ...state };
	applyAction(next, action, (id, change) => {
		if (next.tasks === state.tasks) next.tasks = state.tasks.slice();
		const task = (next.tasks[id] = copyTask(state.tasks[id]));
		change(task);
	});
	return next;
}
export function matching(state: State) {
	return state.tasks
		.filter(
			(t) =>
				t.title.toLowerCase().includes(state.query.toLowerCase()) &&
				(!state.status || t.status === state.status) &&
				(state.assignee === "" || t.assignee === Number(state.assignee)),
		)
		.sort((a, b) =>
			state.sort === "title"
				? a.title.localeCompare(b.title) || a.id - b.id
				: state.sort === "reverse"
					? b.id - a.id
					: a.id - b.id,
		);
}
export function visible(state: State) {
	return matching(state).slice(0, 50);
}
