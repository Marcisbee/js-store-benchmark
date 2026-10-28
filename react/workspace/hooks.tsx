import * as React from "react";
import { reduce, type State, type Action } from "./model";
import { workspace } from "./view";

// Hook-only stores expose their updater through React. Keep each subscription
// in the row/detail/control that owns it, including its unmount cleanup.
export function hookWorkspace(
	useStore: () => [State, (action: Action) => void],
) {
	return workspace(
		(select) => select(useStore()[0]),
		() => {},
		React.memo,
		() => useStore()[1],
	);
}
export function stateWorkspace(
	useStore: () => [State, (update: (state: State) => State) => void],
) {
	return hookWorkspace(() => {
		const [state, set] = useStore();
		return [state, (action) => set((previous) => reduce(previous, action))];
	});
}
