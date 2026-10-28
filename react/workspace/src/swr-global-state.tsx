export {
	version,
	name,
	homepage,
} from "../../../node_modules/swr-global-state/package.json";
import { initialState } from "../model";
import { workspace, mount } from "../view";
import { stateWorkspace } from "../hooks";
import { createStore } from "swr-global-state";
const useStore = createStore({ key: "workspace", initial: initialState() });
export default mount(stateWorkspace(useStore));
