export {
	version,
	name,
	homepage,
} from "../../../node_modules/impact-app/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import { globalStore } from "impact-app";
const useStore = globalStore({
	...initialKeys(),
	apply(action) {
		Object.assign(this, keyPatch(this.state, action));
	},
});
export default mount(
	workspace(
		(select) => select(useStore().state),
		() => {},
		undefined,
		() => useStore().apply,
		(id) => useStore()[taskKey(id)],
	),
);
