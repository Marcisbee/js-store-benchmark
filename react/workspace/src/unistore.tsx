export {
	version,
	name,
	homepage,
} from "../../../node_modules/unistore/package.json";
import * as React from "react";
import { initialState, reduce, type State } from "../model";
import { workspace, mount } from "../view";
import createStore from "unistore";
import { Provider, connect } from "unistore/react";
const store = createStore(initialState());
const Context = React.createContext<State>(null!);
const wrap = (Component) =>
	connect((s) => ({ snapshot: s }))(({ snapshot, ...props }) => (
		<Context.Provider value={snapshot}>
			<Component {...props} />
		</Context.Provider>
	));
const apply = store.action(reduce);
const App = workspace(
	(select) => select(React.useContext(Context)),
	(action) => apply(action),
	wrap,
);
export default mount(() => (
	<Provider store={store}>
		<App />
	</Provider>
));
