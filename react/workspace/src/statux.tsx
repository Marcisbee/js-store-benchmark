export {
	version,
	name,
	homepage,
} from "../../../node_modules/statux/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import Store, { useSelector, useActions } from "statux";
const initial = initialState();
const App = workspace(
	(select) => useSelector((s) => select(s.state)),
	() => {},
	undefined,
	() => {
		const set = useActions("state");
		return (action) => set((s) => reduce(s, action));
	},
);
export default mount(() => (
	<Store state={initial}>
		<App />
	</Store>
));
