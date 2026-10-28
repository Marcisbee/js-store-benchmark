export {
	version,
	name,
	homepage,
} from "../../../node_modules/@bit-about/state/package.json";
import * as React from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { state } from "@bit-about/state";
const [Provider, useStore] = state(() => {
	const [value, set] = React.useState(initialState);
	return { value, set };
});
const App = workspace(
	(select) => useStore((s) => select(s.value)),
	() => {},
	undefined,
	() => {
		const set = useStore((s) => s.set);
		return (action) => set((s) => reduce(s, action));
	},
);
export default mount(() => (
	<Provider>
		<App />
	</Provider>
));
