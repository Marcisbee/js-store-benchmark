export {
	version,
	name,
	homepage,
} from "../../../node_modules/@bit-about/state/package.json";
import * as React from "react";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import { state } from "@bit-about/state";
const [Provider, useStore] = state(() => React.useState(initialState));
const App = stateWorkspace(() => useStore((s) => s));
export default mount(() => (
	<Provider>
		<App />
	</Provider>
));
