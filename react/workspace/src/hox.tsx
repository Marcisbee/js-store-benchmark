export {
	version,
	name,
	homepage,
} from "../../../node_modules/hox/package.json";
import * as React from "react";
import { initialState } from "../model";
import { mount } from "../view";
import { stateWorkspace } from "../hooks";
import { createGlobalStore, HoxRoot } from "hox";
const [useStore] = createGlobalStore(() => React.useState(initialState));
const App = stateWorkspace(useStore);
export default mount(() => (
	<HoxRoot>
		<App />
	</HoxRoot>
));
