export {
	version,
	name,
	homepage,
} from "../../../node_modules/redux-zero/package.json";
import * as React from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import createStore from "redux-zero";
import { Provider, useSelector, useAction } from "redux-zero/react";
const store = createStore(initialState());
const App = workspace(
	useSelector,
	() => {},
	React.memo,
	() => useAction(reduce),
);
export default mount(() => (
	<Provider store={store}>
		<App />
	</Provider>
));
