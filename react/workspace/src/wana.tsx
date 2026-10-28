export {
	version,
	name,
	homepage,
} from "../../../node_modules/wana/package.json";
import { initialState, mutate, copyTask } from "../model";
import { workspace, mount } from "../view";
import { o, withAuto } from "wana";
const initial = initialState();
// Wana's o() is shallow: make each mutable level observable explicitly.
initial.tasks = o(
	initial.tasks.map((task) =>
		o({
			...task,
			checklist: o(task.checklist.map((item) => o(item))),
		}),
	),
);
const store = { state: o(initial) };
export default mount(
	workspace(
		(select) => select(store.state),
		(action) => {
			mutate(store.state, action);
		},
		withAuto,
		undefined,
		(id) => copyTask(store.state.tasks[id]),
	),
);
