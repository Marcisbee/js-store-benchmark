import {
	createStore,
	useStateListener,
	stateValue,
} from "origami-state-manager";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/origami-state-manager/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const store = createStore({ count: 0 });
function App() {
	const count = useStateListener("count", store);
	return (
		<h1 onClick={clickAction(() => stateValue("count", store, (c) => c + 1))}>
			{count}
		</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
