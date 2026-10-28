import { proxy, useSnapshot } from "valtio";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/valtio/package.json";
import { initialState, mutate, type State } from "../model";
import { workspace, mount } from "../view";
const store = proxy({ state: initialState() });
export default mount(
	workspace(
		(select) => select(useSnapshot(store).state as State),
		(action) => {
			mutate(store.state, action);
		},
		undefined,
		undefined,
		(id) => useSnapshot(store.state.tasks[id]),
	),
);
