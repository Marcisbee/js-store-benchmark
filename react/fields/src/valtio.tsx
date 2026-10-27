import { proxy, useSnapshot } from "valtio";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/valtio/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const state = proxy({
	fields: Array.from(Array(1000).keys()).map((i) => ({
		name: `Field #${i + 1}`,
	})),
});

function Field({ field }: { field: { name: string } }) {
	const { name } = useSnapshot(field);

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input value={name} onChange={(e) => (field.name = e.target.value)} />
		</div>
	);
}

function App() {
	const length = useSnapshot(state).fields.length;

	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{Array.from({ length }, (_, index) => (
				<Field key={index} field={state.fields[index]} />
			))}
			<h1>foot</h1>
		</div>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
