export {
	version,
	name,
	homepage,
} from "../../../node_modules/pullstate/package.json";
import { initialState, mutate } from "../model";
import { workspace, mount } from "../view";
import { Store, useStoreState } from "pullstate";
const store = new Store({ state: initialState() });
export default mount(
	workspace(
		(select) => useStoreState(store, (s) => select(s.state)),
		(action) =>
			store.update((s) => {
				mutate(s.state, action);
			}),
	),
);
