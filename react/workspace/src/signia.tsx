export {
	version,
	name,
	homepage,
} from "../../../node_modules/signia/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { useMemo } from "react";
import { atom, computed } from "signia";
import { track } from "signia-react";
const state = atom("workspace", initialState());
export default mount(
	workspace(
		(select) =>
			useMemo(() => computed("selection", () => select(state.value)), [select])
				.value,
		(action) => state.set(reduce(state.value, action)),
		track,
	),
);
