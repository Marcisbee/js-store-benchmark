import { store } from "@simplestack/store";
import { useStoreValue } from "@simplestack/store/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@simplestack/store/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const counter = store(0);
function App() {
	const count = useStoreValue(counter);
	return <h1 onClick={clickAction(() => counter.set(count + 1))}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
