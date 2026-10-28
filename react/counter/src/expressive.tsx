import "@expressive/react";
import { Model, Component } from "@expressive/mvc";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@expressive/mvc/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
class Counter extends Model {
	count = 0;
	increment = () => this.count++;
}
function App() {
	const { count, increment } = Counter.use();
	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Component for={Counter}>
			<App />
		</Component>,
	);
	return elementReady("h1");
}
