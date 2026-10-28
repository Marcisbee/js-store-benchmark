import Store, { useStore } from "statux";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/statux/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

function App() {
	const [count, setCount] = useStore("count");
	return <h1 onClick={clickAction(() => setCount((c) => c + 1))}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Store count={0}>
			<App />
		</Store>,
	);
	return elementReady("h1");
}
