export {
	version,
	name,
	homepage,
} from "../../../node_modules/resso/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import resso from "resso";
const store = resso({ state: initialState() });
export default mount(
	workspace(
		(select) => select(store.useStore().state),
		(action) => store("state", (s) => reduce(s, action)),
	),
);
