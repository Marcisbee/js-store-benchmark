export {
	version,
	name,
	homepage,
} from "../../../node_modules/liquorstore/package.json";
import { initialState, mutate } from "../model";
import { workspace, mount } from "../view";
import { LiquorStore } from "liquorstore";
const store = new LiquorStore({ state: initialState() });
store.pause(); // Disable optional undo history, as in Counter.
export default mount(
	workspace(
		(select) => store.useSelector((s) => select(s.state)),
		(action) =>
			store.mutate((s) => {
				mutate(s.state, action);
			}),
	),
);
