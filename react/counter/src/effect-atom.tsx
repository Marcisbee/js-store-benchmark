import { Atom, useAtomValue, useAtomSet } from "@effect-atom/atom-react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@effect-atom/atom-react/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const counter = Atom.make(0);
function App() {
	const count = useAtomValue(counter);
	const setCount = useAtomSet(counter);
	return <h1 onClick={clickAction(() => setCount((c) => c + 1))}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
