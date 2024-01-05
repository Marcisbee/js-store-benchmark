import { globalStore } from "impact-app";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/impact-app/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const useAppStore = globalStore({
	count: 0,
	increment() {
		this.count += 1;
	},
});

function App() {
	const appStore = useAppStore();

	return (
		<h1 onClick={clickAction(() => appStore.increment())}>{appStore.count}</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
