export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-hooks-global-state/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import { createStore } from "react-hooks-global-state";
const { useStoreState, dispatch } = createStore(
	(s, action) => ({ ...s, ...keyPatch(s.state, action) }),
	initialKeys(),
);
export default mount(
	workspace(
		(select) => select(useStoreState("state")),
		dispatch,
		undefined,
		undefined,
		(id) => useStoreState(taskKey(id)),
	),
);
