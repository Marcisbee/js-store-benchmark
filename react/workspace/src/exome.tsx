import { Exome } from "exome";
import { useStore } from "exome/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/exome/package.json";
import {
	initialState,
	applyAction,
	copyTask,
	type Action,
	type Task,
} from "../model";
import { workspace, mount } from "../view";
class TaskStore extends Exome {
	constructor(public value: Task) {
		super();
	}
	update(change: (task: Task) => void) {
		const next = copyTask(this.value);
		change(next);
		this.value = next;
	}
}
class Store extends Exome {
	state = initialState();
	tasks = this.state.tasks.map((task) => new TaskStore(task));
	dispatch(action: Action) {
		applyAction(this.state, action, (id, change) => {
			this.tasks[id].update(change);
			this.state.tasks[id] = this.tasks[id].value;
		});
	}
}
const store = new Store();
export default mount(
	workspace(
		(select) => select(useStore(store).state),
		(action) => store.dispatch(action),
		undefined,
		undefined,
		(id) => useStore(store.tasks[id]).value,
	),
);
