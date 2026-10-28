export {
	version,
	name,
	homepage,
} from "../../../node_modules/liquorstore/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { LiquorStore } from "liquorstore";
const store = new LiquorStore({ state: initialState() });
store.pause(); // Disable optional undo history, as in Counter.
export default mount(
	workspace(
		(select) => select(store.useStore().state),
		(action) =>
			store.mutate((s) => {
				s.state = reduce(s.state, action);
			}),
	),
);
