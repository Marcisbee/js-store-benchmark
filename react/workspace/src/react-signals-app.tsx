export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-signals-app/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { signal } from "react-signals-app";
const state = signal(initialState());
export default mount(
	workspace(
		(select) => select(state.value),
		(action) => {
			state.value = reduce(state.value, action);
		},
	),
);
