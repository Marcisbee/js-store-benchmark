import { useMutative } from "use-mutative";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/use-mutative/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

function App() {
	const [state, setState] = useMutative({ count: 0 });
	return (
		<h1
			onClick={clickAction(() =>
				setState((s) => {
					s.count += 1;
				}),
			)}
		>
			{state.count}
		</h1>
	);
}
export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App />);
	return elementReady("h1");
}
