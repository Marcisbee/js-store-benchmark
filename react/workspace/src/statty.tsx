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
const connectView = (Component, select) => (props) => (
	<Subscription
		select={(state) => ({ value: select(state, props) })}
		render={({ value }, update) => (
			<Context.Provider value={[value, update]}>
				<Component {...props} />
			</Context.Provider>
		)}
	/>
);
const App = workspace(
	() => React.useContext(Context)[0],
	() => {},
	undefined,
	() => {
		const [, update] = React.useContext(Context);
		return (action) => update((s) => reduce(s, action));
	},
	undefined,
	connectView,
);
export default mount(() => (
	<Provider state={initial}>
		<App />
	</Provider>
));
