export {
	version,
	name,
	homepage,
} from "../../../node_modules/nanostores/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
const state = atom(initialState());
export default mount(
	workspace(
		(select) => select(useStore(state)),
		(action) => state.set(reduce(state.get(), action)),
	),
);
