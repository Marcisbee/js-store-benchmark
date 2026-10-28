export {
	version,
	name,
	homepage,
} from "../../../node_modules/@stated-library/base/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import { StatedLibBase } from "@stated-library/base";
import { use as useObservable } from "@stated-library/react";
const stores = Object.fromEntries(
	Object.entries(initialKeys()).map(([key, value]) => [
		key,
		new StatedLibBase(value),
	]),
);
export default mount(
	workspace(
		(select) => select(useObservable(stores.state.state$)),
		(action) => {
			for (const [key, value] of Object.entries(
				keyPatch(stores.state.state, action),
			))
				stores[key].setState(value, action.type);
		},
		undefined,
		undefined,
		(id) => useObservable(stores[taskKey(id)].state$),
	),
);
