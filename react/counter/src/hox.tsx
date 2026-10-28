import { createGlobalStore, HoxRoot } from "hox";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/hox/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const [useCounter] = createGlobalStore(() => React.useState(0));
function App() {
	const [count, setCount] = useCounter();
	return <h1 onClick={clickAction(() => setCount((c) => c + 1))}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<HoxRoot>
			<App />
		</HoxRoot>,
	);
	return elementReady("h1");
}
