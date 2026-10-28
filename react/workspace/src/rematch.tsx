export {
	version,
	name,
	homepage,
} from "../../../node_modules/@rematch/core/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { init } from "@rematch/core";
import { Provider, useSelector } from "react-redux";
const store = init({
	models: { tasks: { state: initialState(), reducers: { apply: reduce } } },
});
const App = workspace(
	(select) => useSelector((s) => select(s.tasks)),
	(action) => store.dispatch.tasks.apply(action),
);
export default mount(() => (
	<Provider store={store}>
		<App />
	</Provider>
));
