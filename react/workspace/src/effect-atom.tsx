export {
	version,
	name,
	homepage,
} from "../../../node_modules/@effect-atom/atom-react/package.json";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import { Atom, useAtomValue, useAtomSet } from "@effect-atom/atom-react";
const state = Atom.make(initialState());
export default mount(
	stateWorkspace(() => [useAtomValue(state), useAtomSet(state)]),
);
