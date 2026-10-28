export {
	version,
	name,
	homepage,
} from "../../../node_modules/storeon/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import { createStoreon } from "storeon";
import { StoreContext, useStoreon } from "storeon/react";
const store = createStoreon([
	(store) => {
		store.on("@init", initialKeys);
		store.on("apply", (s, a) => keyPatch(s.state, a));
	},
]);
const App = workspace(
	(select) => select(useStoreon("state").state),
	(action) => store.dispatch("apply", action),
	undefined,
	undefined,
	(id) => useStoreon(taskKey(id))[taskKey(id)],
);
export default mount(() => (
	<StoreContext.Provider value={store}>
		<App />
	</StoreContext.Provider>
));
