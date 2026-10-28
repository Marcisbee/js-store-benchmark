export {
	version,
	name,
	homepage,
} from "../../../node_modules/resso/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import resso from "resso";
const store = resso(initialKeys());
export default mount(
	workspace(
		(select) => select(store.useStore().state),
		(action) => store(keyPatch(store.state, action)),
		undefined,
		undefined,
		(id) => store.useStore()[taskKey(id)],
	),
);
