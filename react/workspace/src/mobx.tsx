import { observable, action } from "mobx";
import { observer } from "mobx-react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/mobx/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
const store = observable({ state: initialState() });
export default mount(
	workspace(
		(select) => select(store.state),
		action((a) => {
			store.state = reduce(store.state, a);
		}),
		observer,
	),
);
