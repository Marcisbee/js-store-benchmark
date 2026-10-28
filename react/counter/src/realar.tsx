import { value, useValue } from "realar";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/realar/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const counter = value(0);
const increment = counter.updater((c) => c + 1);
function App() {
	const count = useValue(counter);
	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
