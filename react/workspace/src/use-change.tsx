export {
	version,
	name,
	homepage,
} from "../../../node_modules/use-change/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import useChange from "use-change";
const store = initialKeys();
export default mount(
	workspace(
		(select) => select(useChange(store, "state")[0]),
		(action) => Object.assign(store, keyPatch(store.state, action)),
		undefined,
		undefined,
		(id) => useChange(store, taskKey(id))[0],
	),
);
