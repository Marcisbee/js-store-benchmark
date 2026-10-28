export {
	version,
	name,
	homepage,
} from "../../../node_modules/compostate/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { atom } from "compostate";
import { useCompostateSetup } from "compostate/react";
const state = atom(initialState());
export default mount(
	workspace(
		(select) =>
			useCompostateSetup((props) => () => props.select(state()), { select }),
		(action) => state(reduce(state(), action)),
	),
);
