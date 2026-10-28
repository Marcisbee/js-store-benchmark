export {
	version,
	name,
	homepage,
} from "../../../node_modules/@reatom/core/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/react";
const state = atom(initialState());
export default mount(
	workspace(
		(select) => select(state()),
		(action) => state.set((s) => reduce(s, action)),
		reatomComponent,
	),
);
