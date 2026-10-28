export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-hooks-global-state/package.json";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import { createGlobalState } from "react-hooks-global-state";
const { useGlobalState } = createGlobalState({ state: initialState() });
export default mount(stateWorkspace(() => useGlobalState("state")));
