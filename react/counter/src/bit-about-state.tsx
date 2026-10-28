import { state } from "@bit-about/state";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@bit-about/state/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const [Provider, useStore] = state(() => React.useState(0));
function App() {
	const [count, setCount] = useStore((s) => s);
	return <h1 onClick={clickAction(() => setCount((c) => c + 1))}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Provider>
			<App />
		</Provider>,
	);
	return elementReady("h1");
}
