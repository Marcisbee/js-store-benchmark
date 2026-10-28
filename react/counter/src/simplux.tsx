import { createSimpluxModule, createMutations } from "@simplux/core";
import { SimpluxProvider, useSimplux } from "@simplux/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@simplux/core/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const counter = createSimpluxModule("counter", { count: 0 });
const { increment } = createMutations(counter, {
	increment(s) {
		s.count += 1;
	},
});
function App() {
	const { count } = useSimplux(counter);
	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<SimpluxProvider>
			<App />
		</SimpluxProvider>,
	);
	return elementReady("h1");
}
