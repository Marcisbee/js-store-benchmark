export {
	version,
	name,
	homepage,
} from "../../../node_modules/@tanstack/store/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
const store = new Store(initialState());
export default mount(
	workspace(
		(select) => useStore(store, select),
		(action) => store.setState((s) => reduce(s, action)),
	),
);
