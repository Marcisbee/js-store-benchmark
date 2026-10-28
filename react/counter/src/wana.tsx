import { o, withAuto } from "wana";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/wana/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const counter = o({ count: 0 });
const App = withAuto(function App() {
	return (
		<h1
			onClick={clickAction(() => {
				counter.count += 1;
			})}
		>
			{counter.count}
		</h1>
	);
});
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
