export {
	version,
	name,
	homepage,
} from "../../../node_modules/hox/package.json";
import * as React from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createGlobalStore, HoxRoot } from "hox";
const [useStore] = createGlobalStore(() => React.useState(initialState));
const App = workspace(
	(select) => select(useStore(([state]) => [select(state)])[0]),
	() => {},
	undefined,
	() => {
		const [, set] = useStore(([, set]) => [set]);
		return (action) => set((s) => reduce(s, action));
	},
);
export default mount(() => (
	<HoxRoot>
		<App />
	</HoxRoot>
));
