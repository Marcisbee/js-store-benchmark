export {
	version,
	name,
	homepage,
} from "../../../node_modules/recoil/package.json";
import { initialState } from "../model";
import { workspace, mount } from "../view";
import { stateWorkspace } from "../hooks";
import { atom, RecoilRoot, useRecoilState } from "recoil";
const state = atom({ key: "workspace", default: initialState() });
const App = stateWorkspace(() => useRecoilState(state));
export default mount(() => (
	<RecoilRoot>
		<App />
	</RecoilRoot>
));
