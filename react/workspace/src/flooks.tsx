export {
	version,
	name,
	homepage,
} from "../../../node_modules/flooks/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import create from "flooks";
const useStore = create((store) => ({
	...initialKeys(),
	apply(action) {
		store(keyPatch(store().state, action));
	},
}));
export default mount(
	workspace(
		(select) => select(useStore().state),
		() => {},
		undefined,
		() => useStore().apply,
		(id) => useStore()[taskKey(id)],
	),
);
