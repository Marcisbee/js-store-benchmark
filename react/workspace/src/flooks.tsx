export {
	version,
	name,
	homepage,
} from "../../../node_modules/flooks/package.json";
import { initialState, reduce } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import create from "flooks";
const useStore = create((store) => ({
	state: initialState(),
	apply(action) {
		store({ state: reduce(store().state, action) });
	},
}));
export default mount(
	hookWorkspace(() => {
		const { state, apply } = useStore();
		return [state, apply];
	}),
);
