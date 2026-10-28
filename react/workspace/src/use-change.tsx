export {
	version,
	name,
	homepage,
} from "../../../node_modules/use-change/package.json";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import useChange from "use-change";
const store = { state: initialState() };
export default mount(stateWorkspace(() => useChange(store, "state")));
