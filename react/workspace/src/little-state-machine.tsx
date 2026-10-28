export {
	version,
	name,
	homepage,
} from "../../../node_modules/little-state-machine/package.json";
import { initialState, reduce } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import { createStore, useStateMachine } from "little-state-machine";
createStore(initialState(), { persist: "none" });
export default mount(
	hookWorkspace(() => {
		const { state, actions } = useStateMachine({ actions: { apply: reduce } });
		return [state, actions.apply];
	}),
);
