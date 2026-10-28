export {
	version,
	name,
	homepage,
} from "../../../node_modules/@coaction/react/package.json";
import { initialState, mutate, copyTask } from "../model";
import { workspace, mount } from "../view";
import { create, observer } from "@coaction/react";
const useStore = create((set) => ({
	state: initialState(),
	apply(action) {
		set(() => {
			mutate(this.state, action);
		});
	},
}));
const App = workspace(
	(select) => select(useStore().state),
	() => {},
	observer,
	() => useStore().apply,
	(id) => copyTask(useStore().state.tasks[id]),
);
export default mount(App);
