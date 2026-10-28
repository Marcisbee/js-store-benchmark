export {
	version,
	name,
	homepage,
} from "../../../node_modules/@coaction/react/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { create, observer } from "@coaction/react";
const useStore = create((set) => ({
	state: initialState(),
	apply(action) {
		set(() => {
			this.state = reduce(this.state, action);
		});
	},
}));
const App = workspace(
	(select) => select(useStore().state),
	() => {},
	observer,
	() => useStore().apply,
);
export default mount(App);
