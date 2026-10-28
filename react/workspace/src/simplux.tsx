export {
	version,
	name,
	homepage,
} from "../../../node_modules/@simplux/core/package.json";
import { initialState, mutate } from "../model";
import { workspace, mount } from "../view";
import { useMemo } from "react";
import {
	createSimpluxModule,
	createMutations,
	createSelectors,
} from "@simplux/core";
import { SimpluxProvider, useSimplux } from "@simplux/react";
const store = createSimpluxModule("workspace", { state: initialState() });
const { apply } = createMutations(store, {
	apply(s, action) {
		mutate(s.state, action);
	},
});
const App = workspace(
	(select) =>
		useSimplux(
			useMemo(
				() =>
					createSelectors(store, { selected: (s) => select(s.state) }).selected,
				[select],
			),
		),
	apply,
);
export default mount(() => (
	<SimpluxProvider>
		<App />
	</SimpluxProvider>
));
