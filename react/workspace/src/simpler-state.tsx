export {
	version,
	name,
	homepage,
} from "../../../node_modules/simpler-state/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { entity } from "simpler-state";
const state = entity(initialState());
export default mount(
	workspace(
		(select) => select(state.use()),
		(action) => state.set((s) => reduce(s, action)),
	),
);
