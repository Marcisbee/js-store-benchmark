export {
	version,
	name,
	homepage,
} from "../../../node_modules/@stated-library/base/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { StatedLibBase } from "@stated-library/base";
import { use as useObservable } from "@stated-library/react";
const store = new StatedLibBase(initialState());
export default mount(
	workspace(
		(select) => select(useObservable(store.state$)),
		(action) => store.updateState((s) => reduce(s, action), action.type),
	),
);
