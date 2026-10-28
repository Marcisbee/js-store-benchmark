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
export function reduce(state: State, action: Action): State {
	const value = action.value;
	switch (action.type) {
		case "query":
			return { ...state, query: String(value) };
		case "filterStatus":
			return { ...state, status: String(value) };
		case "filterAssignee":
			return { ...state, assignee: String(value) };
		case "sort":
			return { ...state, sort: String(value) };
		case "select":
			return { ...state, selected: Number(value) };
	}
	const bulkIds =
		action.type === "bulk"
			? new Set(
					visible(state)
						.slice(0, 20)
						.map((t) => t.id),
				)
			: null;
	return {
		...state,
		tasks: state.tasks.map((task) => {
			if (action.type === "bulk")
				return bulkIds!.has(task.id) ? { ...task, status: "done" } : task;
			// Ten currently visible tasks and ten far outside the rendered page.
			if (action.type === "incoming")
				return task.id < 10 || (task.id >= 900 && task.id < 910)
					? {
							...task,
							title: `${task.title} synced`,
							assignee: (task.assignee + 1) % 8,
							status: "doing",
						}
					: task;
			if (task.id !== state.selected) return task;
			if (action.type === "edit") return { ...task, title: String(value) };
			if (action.type === "status") return { ...task, status: String(value) };
			if (action.type === "assignee")
				return { ...task, assignee: Number(value) };
			if (action.type === "checklist")
				return {
					...task,
					checklist: task.checklist.map((item, i) =>
						i === Number(value) ? { ...item, done: !item.done } : item,
					),
				};
			return task;
		}),
	};
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
