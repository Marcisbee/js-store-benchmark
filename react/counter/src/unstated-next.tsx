import { createContainer } from "unstated-next";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/unstated-next/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const Counter = createContainer(() => React.useState(0));
function App() {
	const [count, setCount] = Counter.useContainer();
	return <h1 onClick={clickAction(() => setCount((c) => c + 1))}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Counter.Provider>
			<App />
		</Counter.Provider>,
	);
	return elementReady("h1");
}
