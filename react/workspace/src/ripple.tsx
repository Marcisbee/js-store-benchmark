export {
	version,
	name,
	homepage,
} from "../../../node_modules/@m-c2/ripple/package.json";
import { initialState, reduce } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import { createRipples } from "@m-c2/ripple";
const [{ useTasks }] = createRipples({ tasks: { state: initialState() } });
export default mount(
	hookWorkspace(() => {
		const [store, notify] = useTasks();
		return [
			store.state,
			(action) => {
				notify("replace", {
					state: reduce(JSON.parse(JSON.stringify(store.state)), action),
				});
			},
		];
	}),
);
