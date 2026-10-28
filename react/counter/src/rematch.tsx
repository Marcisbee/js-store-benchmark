import { init } from "@rematch/core";
import { Provider, useSelector, useDispatch } from "react-redux";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@rematch/core/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const store = init({
	models: { counter: { state: 0, reducers: { increment: (s) => s + 1 } } },
});
function App() {
	const count = useSelector((s) => s.counter);
	const dispatch = useDispatch();
	return <h1 onClick={() => dispatch.counter.increment()}>{count}</h1>;
}
export default async function (target) {
	ReactDom.createRoot(target).render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
	return elementReady("h1");
}
