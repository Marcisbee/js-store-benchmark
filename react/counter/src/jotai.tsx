import { atom, useAtom } from "jotai";
export { version, name, homepage } from "../../../node_modules/jotai/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const countAtom = atom(0);

function App() {
	const [count, setCount] = useAtom(countAtom);

	return (
		<h1 onClick={clickAction(() => setCount((state) => state + 1))}>{count}</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
