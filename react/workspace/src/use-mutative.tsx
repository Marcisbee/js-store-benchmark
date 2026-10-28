export {
	version,
	name,
	homepage,
} from "../../../node_modules/use-mutative/package.json";
import * as React from "react";
import { initialState, mutate } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import { useMutative } from "use-mutative";
const Context = React.createContext(null!);
const App = hookWorkspace(() => {
	const [state, set] = React.useContext(Context);
	return [
		state,
		(action) =>
			set((draft) => {
				mutate(draft, action);
			}),
	];
});
export default mount(function Root() {
	const pair = useMutative(initialState);
	return (
		<Context.Provider value={pair}>
			<App />
		</Context.Provider>
	);
});
