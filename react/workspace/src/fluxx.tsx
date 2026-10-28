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
const Context = React.createContext<State>(null!);
// The library's native HOC owns each component subscription.
const wrap = (Component) =>
	connect(
		({ snapshot, ...props }) => (
			<Context.Provider value={snapshot}>
				<Component {...props} />
			</Context.Provider>
		),
		store,
		(s) => ({ snapshot: s }),
	);
export default mount(
	workspace(
		(select) => select(React.useContext(Context)),
		(action) => apply(action),
		wrap,
	),
);
