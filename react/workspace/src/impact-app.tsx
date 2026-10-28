export {
	version,
	name,
	homepage,
} from "../../../node_modules/impact-app/package.json";
import { initialState, reduce } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import { globalStore } from "impact-app";
const useStore = globalStore({
	state: initialState(),
	apply(action) {
		this.state = reduce(this.state, action);
	},
});
export default mount(
	hookWorkspace(() => {
		const store = useStore();
		return [store.state, (action) => store.apply(action)];
	}),
);
