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
const Context = React.createContext(null!);
const connectView = (Component, select) =>
	connect((s, props) => ({ value: select(s, props) }))(
		({ value, ...props }) => (
			<Context.Provider value={value}>
				<Component {...props} />
			</Context.Provider>
		),
	);
const apply = store.action(reduce);
const App = workspace(
	() => React.useContext(Context),
	(action) => apply(action),
	undefined,
	undefined,
	undefined,
	connectView,
);
export default mount(() => (
	<Provider store={store}>
		<App />
	</Provider>
));
