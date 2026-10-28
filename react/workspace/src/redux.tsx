export {
	version,
	name,
	homepage,
} from "../../../node_modules/redux/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { createStore } from "redux";
import { Provider, useSelector } from "react-redux";
const store = createStore((s = initialState(), action) =>
	action.type === "apply" ? reduce(s, action.payload) : s,
);
const App = workspace(useSelector, (action) =>
	store.dispatch({ type: "apply", payload: action }),
);
export default mount(() => (
	<Provider store={store}>
		<App />
	</Provider>
));
