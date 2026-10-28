import * as React from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
let state = initialState();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};
const getSnapshot = () => state;
export default mount(
	workspace(
		(select) =>
			React.useSyncExternalStore(subscribe, () => select(getSnapshot())),
		(action) => {
			state = reduce(state, action);
			for (const listener of listeners) listener();
		},
	),
);
