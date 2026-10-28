import { create, observer } from "@coaction/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@coaction/react/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const useCounter = create((set) => ({
	count: 0,
	increment() {
		set(() => {
			this.count += 1;
		});
	},
}));
const App = observer(function App() {
	const store = useCounter();
	return <h1 onClick={clickAction(store.increment)}>{store.count}</h1>;
});
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
