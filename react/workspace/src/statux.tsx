export {
	version,
	name,
	homepage,
} from "../../../node_modules/statux/package.json";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import Store, { useStore } from "statux";
const initial = initialState();
const App = stateWorkspace(() => useStore("state"));
export default mount(() => (
	<Store state={initial}>
		<App />
	</Store>
));
