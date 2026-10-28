export {
	version,
	name,
	homepage,
} from "../../../node_modules/state-ref/package.json";
import * as React from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createStore } from "state-ref";
import { connectReact } from "@stateref/connect-react";
const watch = createStore({ state: initialState() });
const ref = watch();
const useStore = connectReact(watch);
export default mount(
	workspace(
		(select) => select(useStore().state.value),
		(action) => {
			ref.state.value = reduce(ref.state.value, action);
		},
		undefined,
		undefined,
		(id) => useStore().state.tasks[id].value,
	),
);
