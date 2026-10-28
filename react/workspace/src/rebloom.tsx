export {
	version,
	name,
	homepage,
} from "../../../node_modules/rebloom/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { getUse } from "rebloom";
class Store {
	use = getUse<Store>();
	state = initialState();
}
const store = new Store();
export default mount(
	workspace(
		(select) => select(store.use("state")),
		(action) => {
			store.state = reduce(store.state, action);
		},
	),
);
