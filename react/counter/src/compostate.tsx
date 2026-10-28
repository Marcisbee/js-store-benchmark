import { atom } from "compostate";
import { defineComponent } from "compostate/react";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/compostate/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const count = atom(0);
const App = defineComponent(() => () => (
	<h1 onClick={() => count(count() + 1)}>{count()}</h1>
));
export default async function (target) {
	ReactDom.createRoot(target).render(<App />);
	return elementReady("h1");
}
