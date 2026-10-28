import { syncedStore } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@syncedstore/core/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const store = syncedStore({ counter: {} as { count: number } });
store.counter.count = 0;
function App() {
	const { counter } = useSyncedStore(store);
	return <h1 onClick={() => counter.count++}>{counter.count}</h1>;
}
export default async function (target) {
	ReactDom.createRoot(target).render(<App />);
	return elementReady("h1");
}
