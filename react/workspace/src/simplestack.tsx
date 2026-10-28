export {
	version,
	name,
	homepage,
} from "../../../node_modules/@simplestack/store/package.json";
import { useMemo } from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { store } from "@simplestack/store";
import { useStoreValue } from "@simplestack/store/react";
const state = store(initialState());
export default mount(
	workspace(
		(select) => select(useStoreValue(state)),
		(action) => state.set((s) => reduce(s, action)),
		undefined,
		undefined,
		(id) => useStoreValue(useMemo(() => state.select("tasks", id), [id])),
	),
);
