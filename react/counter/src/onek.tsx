import { observable } from "onek";
import { useObserver } from "onek/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/onek/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const [count, setCount] = observable(0);
function App() {
	const observe = useObserver();
	return (
		<h1 onClick={clickAction(() => setCount(count() + 1))}>{count(observe)}</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
