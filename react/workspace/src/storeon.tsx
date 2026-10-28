export {
	version,
	name,
	homepage,
} from "../../../node_modules/storeon/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createStoreon } from "storeon";
import { StoreContext, useStoreon } from "storeon/react";
const store = createStoreon([
	(store) => {
		store.on("@init", () => ({ state: initialState() }));
		store.on("apply", (s, a) => ({ state: reduce(s.state, a) }));
	},
]);
const App = workspace(
	(select) => select(useStoreon("state").state),
	(action) => store.dispatch("apply", action),
);
export default mount(() => (
	<StoreContext.Provider value={store}>
		<App />
	</StoreContext.Provider>
));
