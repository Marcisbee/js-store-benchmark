import createStore from "unistore";
import { Provider, connect } from "unistore/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/unistore/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const store = createStore({ count: 0 });
const App = connect("count", { increment: (s) => ({ count: s.count + 1 }) })(
	function App({ count, increment }) {
		return <h1 onClick={increment}>{count}</h1>;
	},
);
export default async function (target) {
	ReactDom.createRoot(target).render(
		<Provider store={store}>
			<App />
		</Provider>,
	);
	return elementReady("h1");
}
