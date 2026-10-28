export {
	version,
	name,
	homepage,
} from "../../../node_modules/@risingstack/react-easy-state/package.json";
import { initialState, mutate, copyTask } from "../model";
import { workspace, mount } from "../view";
import { store, view } from "@risingstack/react-easy-state";
const state = store({ value: initialState() });
export default mount(
	workspace(
		(select) => select(state.value),
		(action) => {
			mutate(state.value, action);
		},
		view,
		undefined,
		(id) => copyTask(state.value.tasks[id]),
	),
);
