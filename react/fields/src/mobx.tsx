import { action, observable } from "mobx";
export {
	version,
	name,
	homepage,
} from "../../../node_modules/mobx/package.json";
import { observer } from "mobx-react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const appState = observable({
	fields: Array.from(Array(1000).keys()).map((i) => ({
		name: `Field #${i + 1}`,
	})),
	rename: action(function (value: string, index: number) {
		appState.fields[index].name = value;
	}),
});

const Field = observer(function Field({
	field,
	index,
}: { field: { name: string }; index: number }) {
	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input
				value={field.name}
				onChange={(e) => appState.rename(e.target.value, index)}
			/>
		</div>
	);
});

const App = observer(() => {
	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{appState.fields.map((field, index) => (
				<Field key={index} index={index} field={field} />
			))}
			<h1>foot</h1>
		</div>
	);
});

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
