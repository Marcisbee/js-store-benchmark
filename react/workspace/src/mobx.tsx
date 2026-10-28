import { observable, action } from "mobx";
import { observer } from "mobx-react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/mobx/package.json";
import { initialState, mutate, copyTask } from "../model";
import { workspace, mount } from "../view";
const store = observable({ state: initialState() });
export default mount(
	workspace(
		(select) => select(store.state),
		action((a) => {
			mutate(store.state, a);
		}),
		observer,
		undefined,
		(id) => copyTask(store.state.tasks[id]),
	),
);
