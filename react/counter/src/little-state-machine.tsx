import { createStore, useStateMachine } from "little-state-machine";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/little-state-machine/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
createStore({ count: 0 }, { persist: "none" });
function increment(s) {
	return { ...s, count: s.count + 1 };
}
function App() {
	const { state, actions } = useStateMachine({ actions: { increment } });
	return (
		<h1 onClick={clickAction(() => actions.increment())}>{state.count}</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
