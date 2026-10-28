import createStore from "redux-zero";
import { Provider, useSelector, useAction } from "redux-zero/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/redux-zero/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const store = createStore({ count: 0 });
function App() {
	const count = useSelector((s) => s.count);
	const increment = useAction((s) => ({ count: s.count + 1 }));
	return <h1 onClick={() => increment()}>{count}</h1>;
}
export default async function (target) {
	ReactDom.createRoot(target).render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
	return elementReady("h1");
}
