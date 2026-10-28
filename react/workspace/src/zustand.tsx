import { create } from "zustand";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/zustand/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
const useStore = create(initialState);
export default mount(
	workspace(useStore, (action) =>
		useStore.setState((s) => reduce(s, action), true),
	),
);
