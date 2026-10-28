export {
	version,
	name,
	homepage,
} from "../../../node_modules/use-mutative/package.json";
import * as React from "react";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import { useMutative } from "use-mutative";
const Context = React.createContext(null!);
const App = stateWorkspace(() => React.useContext(Context));
export default mount(function Root() {
	const pair = useMutative(initialState);
	return (
		<Context.Provider value={pair}>
			<App />
		</Context.Provider>
	);
});
