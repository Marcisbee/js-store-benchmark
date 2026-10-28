export {
	version,
	name,
	homepage,
} from "../../../node_modules/easy-peasy/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createStore, action, StoreProvider, useStoreState } from "easy-peasy";
const store = createStore({
	state: initialState(),
	apply: action((s, a) => {
		s.state = reduce(s.state, a);
	}),
});
const App = workspace(
	(select) => useStoreState((s) => select(s.state)),
	(a) => store.getActions().apply(a),
);
export default mount(() => (
	<StoreProvider store={store}>
		<App />
	</StoreProvider>
));
