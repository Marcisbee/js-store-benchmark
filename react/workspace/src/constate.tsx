export {
	version,
	name,
	homepage,
} from "../../../node_modules/constate/package.json";
import * as React from "react";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import constate from "constate";
const [Provider, useStore] = constate(() => React.useState(initialState));
const App = stateWorkspace(useStore);
export default mount(() => (
	<Provider>
		<App />
	</Provider>
));
