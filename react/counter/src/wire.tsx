import { store, rootStore } from "@wire-ts/wire";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@wire-ts/wire/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const counter = store({ count: 0 }).actions({
	increment: (s) => ({ count: s.count + 1 }),
});
const rootStoreInstance = rootStore({ counter });
function App() {
	const count = rootStoreInstance.useStore((s) => s.counter.state.count);
	return (
		<h1 onClick={clickAction(() => counter.actions.increment())}>{count}</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
