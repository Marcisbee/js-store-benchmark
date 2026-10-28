export {
	version,
	name,
	homepage,
} from "../../../node_modules/state-ref/package.json";
import * as React from "react";
import { initialState, reduce } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import { createStore } from "state-ref";
import { connectReact } from "@stateref/connect-react";
const useStore = connectReact(createStore({ state: initialState() }));
export default mount(
	hookWorkspace(() => {
		const { state } = useStore();
		return [
			state.value,
			(action) => {
				state.value = reduce(state.value, action);
			},
		];
	}),
);
