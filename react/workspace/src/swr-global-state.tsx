export {
	version,
	name,
	homepage,
} from "../../../node_modules/swr-global-state/package.json";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import { useStore } from "swr-global-state";
const config = { key: "workspace", initial: initialState() };
export default mount(
	workspace(
		(select) =>
			select(
				useStore(config, {
					compare: (a, b) =>
						a === undefined || b === undefined
							? Object.is(a, b)
							: Object.is(select(a), select(b)),
				})[0],
			),
		() => {},
		undefined,
		() => {
			const [, set] = useStore(config, {
				compare: (a, b) =>
					a === undefined || b === undefined ? Object.is(a, b) : true,
			});
			return (action) => set((s) => reduce(s, action));
		},
	),
);
