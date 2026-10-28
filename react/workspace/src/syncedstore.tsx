export {
	version,
	name,
	homepage,
} from "../../../node_modules/@syncedstore/core/package.json";
import { initialState, reduce, type State, type Action } from "../model";
import { workspace, mount } from "../view";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
const store = syncedStore({ workspace: {} as State });
Object.assign(store.workspace, initialState());
function dispatch(action: Action) {
	const previous = store.workspace;
	const next = reduce(previous, action);
	// Shared Yjs objects cannot be reparented into replacement arrays. Apply the
	// domain transition as field writes in one native transaction instead.
	getYjsDoc(store).transact(() => {
		for (const key of [
			"selected",
			"query",
			"status",
			"assignee",
			"sort",
		] as const) {
			if (previous[key] !== next[key]) previous[key] = next[key] as never;
		}
		next.tasks.forEach((task, id) => {
			const current = previous.tasks[id];
			for (const key of ["title", "status", "assignee"] as const) {
				if (current[key] !== task[key]) current[key] = task[key] as never;
			}
			task.checklist.forEach((item, i) => {
				if (current.checklist[i].done !== item.done)
					current.checklist[i].done = item.done;
			});
		});
	});
}
export default mount(
	workspace((select) => select(useSyncedStore(store).workspace), dispatch),
);
