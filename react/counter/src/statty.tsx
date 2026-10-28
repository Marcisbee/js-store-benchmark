import { Provider, State } from "statty";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/statty/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const initialState = { count: 0 };
function App() {
	return (
		<State
			select={(s) => ({ count: s.count })}
			render={({ count }, update) => (
				<h1 onClick={() => update((s) => ({ count: s.count + 1 }))}>{count}</h1>
			)}
		/>
	);
}
export default async function (target) {
	ReactDom.createRoot(target).render(
		<Provider state={initialState}>
			<App />
		</Provider>,
	);
	return elementReady("h1");
}
