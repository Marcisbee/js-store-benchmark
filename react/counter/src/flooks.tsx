import create from "flooks";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/flooks/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const useCounter = create((store) => ({
	count: 0,
	increment() {
		store({ count: store().count + 1 });
	},
}));
function App() {
	const { count, increment } = useCounter();
	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
