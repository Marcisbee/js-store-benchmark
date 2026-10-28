import * as React from "react";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
const Context = React.createContext(null!);
const App = stateWorkspace(() => React.useContext(Context));
export default mount(function Root() {
	const pair = React.useState(initialState);
	return (
		<Context.Provider value={pair}>
			<App />
		</Context.Provider>
	);
});
