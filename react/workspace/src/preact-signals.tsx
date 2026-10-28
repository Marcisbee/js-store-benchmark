export {
	version,
	name,
	homepage,
} from "../../../node_modules/@preact/signals-react/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { useMemo } from "react";
import { signal, computed } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
const state = signal(initialState());
export default mount(
	workspace(
		(select) => {
			useSignals();
			return useMemo(() => computed(() => select(state.value)), [select]).value;
		},
		(action) => {
			state.value = reduce(state.value, action);
		},
	),
);
