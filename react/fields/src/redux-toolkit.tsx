import { configureStore, createSlice } from "@reduxjs/toolkit";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/@reduxjs/toolkit/package.json";
import { Provider, useDispatch, useSelector } from "react-redux";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const fieldsSlice = createSlice({
	name: "fields",
	initialState: {
		fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
	},
	reducers: {
		rename: (state, action) => {
			state.fields[action.payload.index] = action.payload.value;
		},
	},
});

const store = configureStore({
	reducer: {
		fields: fieldsSlice.reducer,
	},
});

function Field({ index }: { index: number }) {
	const name = useSelector(
		(state: ReturnType<typeof store.getState>) => state.fields.fields[index],
	);
	const dispatch = useDispatch();

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input
				value={name}
				onChange={(e) =>
					dispatch(fieldsSlice.actions.rename({ index, value: e.target.value }))
				}
			/>
		</div>
	);
}

function App() {
	const length = useSelector(
		(state: ReturnType<typeof store.getState>) => state.fields.fields.length,
	);

	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{Array.from({ length }, (_, index) => (
				<Field key={index} index={index} />
			))}
			<h1>foot</h1>
		</div>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Provider store={store} key={key++}>
			<App />
		</Provider>,
	);

	return elementReady("h1");
}
