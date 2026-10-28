export {
	version,
	name,
	homepage,
} from "../../../node_modules/nanostores/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { useMemo } from "react";
import { atom, computed } from "nanostores";
import { useStore } from "@nanostores/react";
const state = atom(initialState());
export default mount(
	workspace(
		(select) => useStore(useMemo(() => computed(state, select), [select])),
		(action) => state.set(reduce(state.get(), action)),
	),
);
