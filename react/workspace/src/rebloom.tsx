export {
	version,
	name,
	homepage,
} from "../../../node_modules/rebloom/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import { getUse } from "rebloom";
const store = { ...initialKeys(), use: getUse() };
export default mount(
	workspace(
		(select) => select(store.use("state")),
		(action) => Object.assign(store, keyPatch(store.state, action)),
		undefined,
		undefined,
		(id) => store.use(taskKey(id)),
	),
);
