import { combineReducers, createStore } from "redux";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/redux/package.json";
import { Provider, useDispatch, useSelector } from "react-redux";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const rename = (index: number, value: string) => {
	return {
		type: "RENAME",
		index,
		value,
	};
};

const initialState = Array.from(Array(1000).keys()).map(
	(i) => `Field #${i + 1}`,
);

const counter = (state = initialState, action: any) => {
	switch (action.type) {
		case "RENAME":
			return state.map((value, index) => {
				if (action.index === index) {
					return action.value;
				}

				return value;
			});
		default:
			return state;
	}
};

const rootReducer = combineReducers({
	counter,
});

const store = createStore(rootReducer);

function Field({ index }: { index: number }) {
	const name = useSelector(
		(state: ReturnType<typeof store.getState>) => state.counter[index],
	);
	const dispatch = useDispatch();

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input
				value={name}
				onChange={(e) => dispatch(rename(index, e.target.value))}
			/>
		</div>
	);
}

function App() {
	const length = useSelector(
		(state: ReturnType<typeof store.getState>) => state.counter.length,
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
