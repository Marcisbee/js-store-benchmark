export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-xs/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import $ from "react-xs";
const state = $(initialState());
export default mount(
	workspace(
		(select) => select(state.value),
		(action) => {
			state.value = reduce(state.value, action);
		},
		$,
	),
);
