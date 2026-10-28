import { create } from "zustand";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/zustand/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { elementReady } from "./utils/wait-for-element";
const fields = Array.from({ length: 1000 }, (_, i) => {
	const name = `Field #${i + 1}`;
	return create((set) => ({ name, rename: (name) => set({ name }) }));
});
function Field({ field }) {
	const { name, rename } = field();
	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}&nbsp;
			<input
				value={name}
				onChange={(e) => {
					rename(e.target.value);
				}}
			/>
		</div>
	);
}
function App() {
	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{fields.map((field, index) => (
				<Field key={index} field={field} />
			))}
			<h1>foot</h1>
		</div>
	);
}
export default async function (target) {
	ReactDom.createRoot(target).render(<App />);
	return elementReady("h1");
}
