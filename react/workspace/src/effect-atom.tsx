export {
	version,
	name,
	homepage,
} from "../../../node_modules/@effect-atom/atom-react/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { Atom, useAtomValue, useAtomSet } from "@effect-atom/atom-react";
const state = Atom.make(initialState());
export default mount(
	workspace(
		(select) => useAtomValue(state, select),
		() => {},
		undefined,
		() => {
			const set = useAtomSet(state);
			return (action) => set((s) => reduce(s, action));
		},
	),
);
