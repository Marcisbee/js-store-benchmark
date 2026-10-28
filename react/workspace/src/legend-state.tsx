export {
	version,
	name,
	homepage,
} from "../../../node_modules/@legendapp/state/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { observable } from "@legendapp/state";
import { observer, useSelector } from "@legendapp/state/react";
const state = observable(initialState());
export default mount(
	workspace(
		(select) => useSelector(() => select(state.get())),
		(action) => state.set((s) => reduce(s, action)),
		observer,
		undefined,
		(id) => useSelector(() => state.tasks[id].get()),
	),
);
