import {
	initialState,
	applyAction,
	copyTask,
	type State,
	type Task,
	type Action,
} from "./model";
// Libraries that subscribe by top-level key can normalize tasks in their own
// store. These are shared references, not a second store or notification layer.
export const taskKey = (id: number) => `task:${id}`;
export function initialKeys() {
	const state = initialState();
	return {
		state,
		...Object.fromEntries(state.tasks.map((task) => [taskKey(task.id), task])),
	};
}
export function keyPatch(previous: State, action: Action) {
	const state = { ...previous };
	const patch: Record<string, Task> = {};
	applyAction(state, action, (id, change) => {
		if (state.tasks === previous.tasks) state.tasks = previous.tasks.slice();
		const task = copyTask(previous.tasks[id]);
		change(task);
		state.tasks[id] = task;
		patch[taskKey(id)] = task;
	});
	return { state, ...patch };
}
