export {
	version,
	name,
	homepage,
} from "../../../node_modules/xstate/package.json";
import * as React from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createMachine, assign } from "xstate";
import { createActorContext } from "@xstate/react";
const Tasks = createActorContext(
	createMachine({
		context: initialState(),
		on: {
			apply: {
				actions: assign(({ context, event }) => reduce(context, event.action)),
			},
		},
	}),
);
const App = workspace(
	(select) => Tasks.useSelector((snapshot) => select(snapshot.context)),
	() => {},
	React.memo,
	() => {
		const actor = Tasks.useActorRef();
		return (action) => actor.send({ type: "apply", action });
	},
);
export default mount(() => (
	<Tasks.Provider>
		<App />
	</Tasks.Provider>
));
