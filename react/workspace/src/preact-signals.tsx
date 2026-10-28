export {
	version,
	name,
	homepage,
} from "../../../node_modules/@preact/signals-react/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
const state = signal(initialState());
export default mount(
	workspace(
		(select) => {
			useSignals();
			return select(state.value);
		},
		(action) => {
			state.value = reduce(state.value, action);
		},
	),
);
