import { atom, createStore, useAtomValue } from "jotai";
import { useMemo } from "react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/jotai/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
const state = atom(initialState());
const store = createStore();
export default mount(
	workspace(
		(select) =>
			useAtomValue(
				useMemo(() => atom((get) => select(get(state))), [select]),
				{ store },
			),
		(action) => store.set(state, (s) => reduce(s, action)),
	),
);
