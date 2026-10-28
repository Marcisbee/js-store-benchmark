export {
	version,
	name,
	homepage,
} from "../../../node_modules/@m-c2/ripple/package.json";
import { initialState, mutate, copyTask } from "../model";
import { workspace, mount } from "../view";
import { createRipples } from "@m-c2/ripple";
const [{ useTasks }, { updateTasks }] = createRipples({
	tasks: { state: initialState() },
});
const update = updateTasks();
export default mount(
	workspace(
		(select) => select(useTasks()[0].state),
		(action) =>
			update((store) => {
				mutate(store.state, action);
			}),
		undefined,
		undefined,
		(id) => copyTask(useTasks()[0].state.tasks[id]),
	),
);
