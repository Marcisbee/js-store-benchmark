export {
	version,
	name,
	homepage,
} from "../../../node_modules/@legendapp/state/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
const state = observable(initialState());
export default mount(
	workspace(
		(select) => select(state.get()),
		(action) => state.set((s) => reduce(s, action)),
		observer,
	),
);
