export {
	version,
	name,
	homepage,
} from "../../../node_modules/effector/package.json";
import { initialState, reduce, type Action } from "../model";
import { workspace, mount } from "../view";
import { createStore, createEvent } from "effector";
import { useStoreMap } from "effector-react";
const dispatch = createEvent<Action>();
const store = createStore(initialState()).on(dispatch, reduce);
export default mount(
	workspace(
		(select) =>
			useStoreMap({ store, keys: [select], fn: (s, [select]) => select(s) }),
		dispatch,
	),
);
