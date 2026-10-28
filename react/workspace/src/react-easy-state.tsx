export {
	version,
	name,
	homepage,
} from "../../../node_modules/@risingstack/react-easy-state/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { store, view } from "@risingstack/react-easy-state";
const state = store({ value: initialState() });
export default mount(
	workspace(
		(select) => select(state.value),
		(action) => {
			state.value = reduce(state.value, action);
		},
		view,
	),
);
