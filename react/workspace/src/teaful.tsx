export {
	version,
	name,
	homepage,
} from "../../../node_modules/teaful/package.json";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import createStore from "teaful";
const { useStore } = createStore({ state: initialState() });
export default mount(stateWorkspace(() => useStore.state()));
