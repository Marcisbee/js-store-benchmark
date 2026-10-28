export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-xs/package.json";
import { initialKeys, keyPatch, taskKey } from "../keyed";
import { workspace, mount } from "../view";
import $ from "react-xs";
const cells = Object.fromEntries(
	Object.entries(initialKeys()).map(([key, value]) => [key, $(value)]),
);
export default mount(
	workspace(
		(select) => select(cells.state.value),
		(action) =>
			$.mutate(() => {
				for (const [key, value] of Object.entries(
					keyPatch(cells.state.value, action),
				))
					cells[key].value = value;
			}),
		$,
		undefined,
		(id) => cells[taskKey(id)].value,
	),
);
