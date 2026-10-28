export {
	version,
	name,
	homepage,
} from "../../../node_modules/statofu/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createStatofuStore } from "statofu";
import { StoreProvider, useSnapshot, useOperate } from "statofu-react";
const store = createStatofuStore();
const state = initialState();
const App = workspace(
	(select) => useSnapshot(state, select),
	() => {},
	undefined,
	() => useOperate(state, reduce),
);
export default mount(() => (
	<StoreProvider store={store}>
		<App />
	</StoreProvider>
));
