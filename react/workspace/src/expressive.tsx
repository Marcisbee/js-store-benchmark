export {
	version,
	name,
	homepage,
} from "../../../node_modules/@expressive/mvc/package.json";
import * as React from "react";
import { initialState, reduce, type Action } from "../model";
import { workspace, mount } from "../view";
import "@expressive/react";
import { Model, Component } from "@expressive/mvc";
class Tasks extends Model {
	state = initialState();
	apply = (action: Action) => {
		this.state = reduce(this.state, action);
	};
}
const App = workspace(
	(select) => Tasks.get((s) => select(s.state)),
	() => {},
	React.memo,
	() => Tasks.get((s) => s.apply),
);
export default mount(() => (
	<Component for={Tasks}>
		<App />
	</Component>
));
