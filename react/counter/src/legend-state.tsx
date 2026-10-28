import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@legendapp/state/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const count = observable(0);
const App = observer(function App() {
	return (
		<h1 onClick={clickAction(() => count.set((c) => c + 1))}>{count.get()}</h1>
	);
});
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
