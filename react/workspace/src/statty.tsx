export {
	version,
	name,
	homepage,
} from "../../../node_modules/statty/package.json";
import * as React from "react";
import { initialState, reduce, type State } from "../model";
import { workspace, mount } from "../view";
import { Provider, State as Subscription } from "statty";
const initial = initialState();
const Context = React.createContext(null!);
const wrap = (Component) => (props) => (
	<Subscription
		render={(state, update) => (
			<Context.Provider value={[state, update]}>
				<Component {...props} />
			</Context.Provider>
		)}
	/>
);
const App = workspace(
	(select) => select(React.useContext(Context)[0]),
	() => {},
	wrap,
	() => {
		const [, update] = React.useContext(Context);
		return (action) => update((s) => reduce(s, action));
	},
);
export default mount(() => (
	<Provider state={initial}>
		<App />
	</Provider>
));
