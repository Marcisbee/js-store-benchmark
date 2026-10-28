import { createStore } from "state-ref";
import { connectReact } from "@stateref/connect-react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/state-ref/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const useCounter = connectReact(createStore({ count: 0 }));
function App() {
	const { count } = useCounter();
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
