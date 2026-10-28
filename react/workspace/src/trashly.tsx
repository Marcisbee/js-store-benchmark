export {
	version,
	name,
	homepage,
} from "../../../node_modules/trashly-react/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { Trashly } from "trashly-react";
const store = new Trashly({ state: initialState() });
export default mount(
	workspace(
		(select) => store.useSelector((s) => select(s.state)),
		(action) =>
			store.mutate((s) => {
				s.state = reduce(s.state, action);
			}),
	),
);
