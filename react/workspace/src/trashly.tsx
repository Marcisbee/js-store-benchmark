export {
	version,
	name,
	homepage,
} from "../../../node_modules/trashly-react/package.json";
import { initialState, mutate } from "../model";
import { workspace, mount } from "../view";
import { Trashly } from "trashly-react";
const store = new Trashly({ state: initialState() });
export default mount(
	workspace(
		(select) => store.useSelector((s) => select(s.state)),
		(action) =>
			store.mutate((s) => {
				mutate(s.state, action);
			}),
	),
);
