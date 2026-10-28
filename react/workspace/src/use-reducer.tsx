import * as React from "react";
import { initialState, reduce, type State } from "../model";
import { workspace, mount } from "../view";
const Context = React.createContext<State>(null!);
function App() {
	const [state, dispatch] = React.useReducer(reduce, undefined, initialState);
	const View = React.useMemo(
		() => workspace((select) => select(React.useContext(Context)), dispatch),
		[dispatch],
	);
	return (
		<Context.Provider value={state}>
			<View />
		</Context.Provider>
	);
}
export default mount(App);
