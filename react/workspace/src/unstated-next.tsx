export {
	version,
	name,
	homepage,
} from "../../../node_modules/unstated-next/package.json";
import * as React from "react";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import { createContainer } from "unstated-next";
const Tasks = createContainer(() => React.useState(initialState));
const App = stateWorkspace(Tasks.useContainer);
export default mount(() => (
	<Tasks.Provider>
		<App />
	</Tasks.Provider>
));
