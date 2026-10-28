import { signal } from "react-signals-app";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-signals-app/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const count = signal(0);
function App() {
	return (
		<h1
			onClick={clickAction(() => {
				count.value += 1;
			})}
		>
			{count.value}
		</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
