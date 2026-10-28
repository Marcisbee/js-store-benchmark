export {
	version,
	name,
	homepage,
} from "../../../node_modules/@wire-ts/wire/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { store, rootStore } from "@wire-ts/wire";
const tasks = store(initialState()).actions({ apply: reduce });
const root = rootStore({ tasks });
export default mount(
	workspace(
		(select) => root.useStore((s) => select(s.tasks.state)),
		(action) => tasks.actions.apply(action),
	),
);
