export {
	version,
	name,
	homepage,
} from "../../../node_modules/@simplux/core/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createSimpluxModule, createMutations } from "@simplux/core";
import { SimpluxProvider, useSimplux } from "@simplux/react";
const store = createSimpluxModule("workspace", { state: initialState() });
const { apply } = createMutations(store, {
	apply(s, action) {
		s.state = reduce(s.state, action);
	},
});
const App = workspace((select) => select(useSimplux(store).state), apply);
export default mount(() => (
	<SimpluxProvider>
		<App />
	</SimpluxProvider>
));
