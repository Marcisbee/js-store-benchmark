export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-tracked/package.json";
import * as React from "react";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import { createContainer } from "react-tracked";
const { Provider, useTracked } = createContainer(() =>
	React.useState(initialState),
);
const App = stateWorkspace(useTracked);
export default mount(() => (
	<Provider>
		<App />
	</Provider>
));
