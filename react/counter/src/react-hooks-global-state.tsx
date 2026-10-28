import { createGlobalState } from "react-hooks-global-state";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-hooks-global-state/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const { useGlobalState } = createGlobalState({ count: 0 });
function App() {
	const [count, setCount] = useGlobalState("count");
	return <h1 onClick={clickAction(() => setCount((c) => c + 1))}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
