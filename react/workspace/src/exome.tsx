import { Exome } from "exome";
import { useStore } from "exome/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/exome/package.json";
import { initialState, reduce, type Action } from "../model";
import { workspace, mount } from "../view";
class Store extends Exome {
	state = initialState();
	dispatch(action: Action) {
		this.state = reduce(this.state, action);
	}
}
const store = new Store();
export default mount(
	workspace(
		(select) => select(useStore(store).state),
		(action) => store.dispatch(action),
	),
);
