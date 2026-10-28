import {
	createStore,
	action,
	StoreProvider,
	useStoreState,
	useStoreActions,
} from "easy-peasy";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/easy-peasy/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";
const store = createStore({
	count: 0,
	increment: action((s) => {
		s.count += 1;
	}),
});
function App() {
	const count = useStoreState((s) => s.count);
	const increment = useStoreActions((s) => s.increment);
	return <h1 onClick={clickAction(increment)}>{count}</h1>;
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
