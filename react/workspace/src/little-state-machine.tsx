export {
	version,
	name,
	homepage,
} from "../../../node_modules/little-state-machine/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createStore, useStateMachine } from "little-state-machine";
createStore(initialState(), { persist: "none" });
const actions = { apply: reduce };
export default mount(
	workspace(
		(select) => select(useStateMachine({ selector: select }).state),
		() => {},
		undefined,
		() => useStateMachine({ actions, selector: () => null }).actions.apply,
	),
);
