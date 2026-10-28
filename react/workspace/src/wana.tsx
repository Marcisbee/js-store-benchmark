export {
	version,
	name,
	homepage,
} from "../../../node_modules/wana/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { o, withAuto } from "wana";
const store = o({ state: initialState() });
export default mount(
	workspace(
		(select) => select(store.state),
		(action) => {
			store.state = reduce(store.state, action);
		},
		withAuto,
	),
);
