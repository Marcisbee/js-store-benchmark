export {
	version,
	name,
	homepage,
} from "../../../node_modules/fluxx/package.json";
import * as React from "react";
import { initialState, reduce, type State, type Action } from "../model";
import { workspace, mount } from "../view";
import { GlobalStore, Action as event } from "fluxx";
import connect from "fluxx/lib/ReactConnector";
const apply = event("apply");
const store = GlobalStore(initialState(), (on) => on(apply, reduce));
const Context = React.createContext(null!);
// Fluxx's slicer has no props argument. Bind a connector to each row's id;
// its native HOC still owns subscription, equality checks and cleanup.
const connectView = (Component, select) => (props) => {
	const Connected = React.useMemo(
		() =>
			connect(
				({ value, ...props }) => (
					<Context.Provider value={value}>
						<Component {...props} />
					</Context.Provider>
				),
				store,
				(s) => ({ value: select(s, props) }),
			),
		[props.id],
	);
	return <Connected {...props} />;
};
export default mount(
	workspace(
		() => React.useContext(Context),
		(action) => apply(action),
		undefined,
		undefined,
		undefined,
		connectView,
	),
);
