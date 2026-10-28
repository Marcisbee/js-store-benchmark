import { getUse } from "rebloom";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/rebloom/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
class Counter {
	use = getUse<Counter>();
	count = 0;
}
const store = new Counter();
function App() {
	const count = store.use("count");
	return (
		<h1
			onClick={clickAction(() => {
				store.count += 1;
			})}
		>
			{count}
		</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
