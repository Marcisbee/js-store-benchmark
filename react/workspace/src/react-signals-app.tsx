export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-signals-app/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { useMemo } from "react";
import { signal, computed } from "react-signals-app";
const state = signal(initialState());
export default mount(
	workspace(
		(select) =>
			useMemo(() => computed(() => select(state.value)), [select]).value,
		(action) => {
			state.value = reduce(state.value, action);
		},
	),
);
