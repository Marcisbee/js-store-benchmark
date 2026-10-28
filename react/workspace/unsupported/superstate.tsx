export {
	version,
	name,
	homepage,
} from "../../../node_modules/@superstate/core/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { superstate } from "@superstate/core";
import { useSuperState } from "@superstate/react";
const state = superstate(initialState());
export default mount(
	workspace(
		(select) => {
			useSuperState(state);
			return select(state.now());
		},
		(action) => state.set((s) => reduce(s, action)),
	),
);
