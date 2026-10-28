export {
	version,
	name,
	homepage,
} from "../../../node_modules/statofu/package.json";
import { initialState, reduce } from "../model";
import { mount } from "../view";
import { hookWorkspace } from "../hooks";
import { createStatofuStore } from "statofu";
import { StoreProvider, useSnapshot, useOperate } from "statofu-react";
const store = createStatofuStore();
const state = initialState();
const App = hookWorkspace(() => [
	useSnapshot(state),
	useOperate(state, reduce),
]);
export default mount(() => (
	<StoreProvider store={store}>
		<App />
	</StoreProvider>
));
