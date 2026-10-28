export {
	version,
	name,
	homepage,
} from "../../../node_modules/origami-state-manager/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import {
	createStore,
	useStateListener,
	stateValue,
} from "origami-state-manager";
const store = createStore({ state: initialState() });
export default mount(
	workspace(
		(select) => select(useStateListener("state", store)),
		(action) => stateValue("state", store, (s) => reduce(s, action)),
		undefined,
		undefined,
		(id) => useStateListener(`state.tasks.${id}`, store),
	),
);
