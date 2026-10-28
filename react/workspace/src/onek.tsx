export {
	version,
	name,
	homepage,
} from "../../../node_modules/onek/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { observable } from "onek";
import { useObserver } from "onek/react";
const [state, set] = observable(initialState());
export default mount(
	workspace(
		(select) => select(state(useObserver())),
		(action) => set(reduce(state(), action)),
	),
);
