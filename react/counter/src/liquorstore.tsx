import { LiquorStore } from "liquorstore";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/liquorstore/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const store = new LiquorStore({ count: 0 });
store.pause();
function App() {
	const { count } = store.useStore();
	return (
		<h1
			onClick={() =>
				store.mutate((s) => {
					s.count += 1;
				})
			}
		>
			{count}
		</h1>
	);
}
export default async function (target) {
	ReactDom.createRoot(target).render(<App />);
	return elementReady("h1");
}
