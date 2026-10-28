export {
	version,
	name,
	homepage,
} from "../../../node_modules/@simplestack/store/package.json";
import { initialState, reduce } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import { store } from "@simplestack/store";
import { useStoreValue } from "@simplestack/store/react";
const state = store(initialState());
export default mount(
	hookWorkspace(() => {
		const current = useStoreValue(state);
		return [current, (action) => state.set(reduce(current, action))];
	}),
);
