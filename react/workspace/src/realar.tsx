export {
	version,
	name,
	homepage,
} from "../../../node_modules/realar/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { value, useValue } from "realar";
const state = value(initialState());
const dispatch = state.updater(reduce);
export default mount(
	workspace(
		(select) => useValue(() => select(state.get()), [select]),
		dispatch,
	),
);
