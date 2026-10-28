import { createStatofuStore } from "statofu";
import { StoreProvider, useSnapshot, useOperate } from "statofu-react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/statofu/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const store = createStatofuStore();
const counter = { count: 0 };
function App() {
	const { count } = useSnapshot(counter);
	const increment = useOperate(counter, (s) => ({ count: s.count + 1 }));
	return <h1 onClick={clickAction(() => increment())}>{count}</h1>;
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<StoreProvider store={store}>
			<App />
		</StoreProvider>,
	);
	return elementReady("h1");
}
