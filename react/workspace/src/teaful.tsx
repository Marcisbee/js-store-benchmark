export {
	version,
	name,
	homepage,
} from "../../../node_modules/teaful/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import createStore from "teaful";
const { useStore, setStore } = createStore({ state: initialState() });
export default mount(
	workspace(
		(select) => select(useStore.state()[0]),
		(action) => setStore.state((s) => reduce(s, action)),
		undefined,
		undefined,
		(id) => useStore.state.tasks[id]()[0],
	),
);
