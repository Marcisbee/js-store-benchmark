import { createContainer } from "react-tracked";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-tracked/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const { Provider, useTracked } = createContainer(() =>
	React.useState({ count: 0 }),
);
function App() {
	const [state, setState] = useTracked();
	return (
		<h1 onClick={clickAction(() => setState((s) => ({ count: s.count + 1 })))}>
			{state.count}
		</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Provider>
			<App />
		</Provider>,
	);
	return elementReady("h1");
}
