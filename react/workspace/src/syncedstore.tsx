export {
	version,
	name,
	homepage,
} from "../../../node_modules/@syncedstore/core/package.json";
import {
	initialState,
	mutate,
	copyTask,
	type State,
	type Action,
} from "../model";
import { workspace, mount } from "../view";
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
const store = syncedStore({ workspace: {} as State });
Object.assign(store.workspace, initialState());
function dispatch(action: Action) {
	getYjsDoc(store).transact(() => mutate(store.workspace, action));
}
export default mount(
	workspace(
		(select) => select(useSyncedStore(store).workspace),
		dispatch,
		undefined,
		undefined,
		(id) => copyTask(useSyncedStore(store).workspace.tasks[id]),
	),
);
