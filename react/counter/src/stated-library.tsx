import { StatedLibBase } from "@stated-library/base";
import { use as useObservable } from "@stated-library/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@stated-library/base/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const store = new StatedLibBase({ count: 0 });
function App() {
	const { count } = useObservable(store.state$);
	return (
		<h1
			onClick={() =>
				store.updateState((s) => ({ count: s.count + 1 }), "increment")
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
