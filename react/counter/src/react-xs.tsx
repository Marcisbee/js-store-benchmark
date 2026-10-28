import $ from "react-xs";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/react-xs/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const counter = $(0);
const App = $(function App() {
	return <h1 onClick={() => counter.value++}>{counter.value}</h1>;
});
export default async function (target) {
	ReactDom.createRoot(target).render(<App />);
	return elementReady("h1");
}
