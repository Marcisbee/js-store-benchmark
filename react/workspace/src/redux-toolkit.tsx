import * as React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@reduxjs/toolkit/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
const slice = createSlice({
	name: "workspace",
	initialState: initialState(),
	reducers: { apply: (state, action) => reduce(state, action.payload) },
});
const store = configureStore({ reducer: slice.reducer });
const App = workspace(useSelector, (action) => {
	store.dispatch(slice.actions.apply(action));
});
export default mount(() => (
	<Provider store={store}>
		<App />
	</Provider>
));
