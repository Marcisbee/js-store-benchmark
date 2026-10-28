export {
	version,
	name,
	homepage,
} from "../../../node_modules/remini/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { box, update } from "remini";
import { useBox } from "remini/react";
const state = box(initialState());
export default mount(
	workspace(
		(select) => select(useBox(state)),
		(action) => update(state, (s) => reduce(s, action)),
	),
);
