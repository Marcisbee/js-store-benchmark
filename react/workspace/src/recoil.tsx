export {
	version,
	name,
	homepage,
} from "../../../node_modules/recoil/package.json";
import { useMemo } from "react";
import { initialState, reduce } from "../model";
import { workspace, mount } from "../view";
import {
	atom,
	selector,
	RecoilRoot,
	useRecoilValue,
	useSetRecoilState,
} from "recoil";
const state = atom({ key: "workspace", default: initialState() });
let key = 0;
const App = workspace(
	(select) =>
		useRecoilValue(
			useMemo(
				() =>
					selector({
						key: `selection-${key++}`,
						get: ({ get }) => select(get(state)),
					}),
				[select],
			),
		),
	() => {},
	undefined,
	() => {
		const set = useSetRecoilState(state);
		return (action) => set((s) => reduce(s, action));
	},
);
export default mount(() => (
	<RecoilRoot>
		<App />
	</RecoilRoot>
));
