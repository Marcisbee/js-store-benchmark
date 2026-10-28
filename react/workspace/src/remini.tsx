export {
	version,
	name,
	homepage,
} from "../../../node_modules/remini/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { useMemo } from "react";
import { box, update, wrap, get } from "remini";
import { useBox } from "remini/react";
const state = box(initialState());
export default mount(
	workspace(
		(select) => useBox(useMemo(() => wrap(() => select(get(state))), [select])),
		(action) => update(state, (s) => reduce(s, action)),
	),
);
