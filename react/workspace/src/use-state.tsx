import * as React from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
// Lift local state to the workspace root; the entire view rerenders.
export default mount(function Root() {
	const [state, set] = React.useState(initialState);
	const current = React.useRef(state);
	current.current = state;
	const App = React.useMemo(
		() =>
			workspace(
				(select) => select(current.current),
				(action) => set((s) => reduce(s, action)),
				(component) => component,
			),
		[],
	);
	return <App />;
});
