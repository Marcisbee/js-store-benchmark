import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@reatom/core/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const count = atom(0);
const App = reatomComponent(function App() {
	return (
		<h1 onClick={clickAction(() => count.set((c) => c + 1))}>{count()}</h1>
	);
});
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
