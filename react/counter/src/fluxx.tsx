import { GlobalStore, Action } from "fluxx";
import connect from "fluxx/lib/ReactConnector";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/fluxx/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const increment = Action("increment");
const store = GlobalStore({ count: 0 }, (on) =>
	on(increment, (s) => ({ count: s.count + 1 })),
);
const App = connect(
	function App({ count }) {
		return <h1 onClick={() => increment()}>{count}</h1>;
	},
	store,
	(s) => ({ count: s.count }),
);
export default async function (target) {
	ReactDom.createRoot(target).render(<App />);
	return elementReady("h1");
}
