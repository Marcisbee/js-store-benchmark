import { waitFor } from "../utils/wait-for.mjs";

export default async function run(target) {
	const input = target.querySelectorAll("input")[10];
	const setValue = Object.getOwnPropertyDescriptor(
		HTMLInputElement.prototype,
		"value",
	).set;
	for (let i = 0; i < 100; i++) {
		const value = `Updated field #${i + 1}`;
		// Setting the live value alone does not prove the store accepted the change.
		// React commits a controlled input's value to its defaultValue attribute.
		const updated = waitFor(
			input,
			() => input.defaultValue === value,
			`field update ${i + 1}`,
			{ attributes: true },
		);
		setValue.call(input, value);
		input.dispatchEvent(new Event("input", { bubbles: true }));
		await updated;
	}
}

export function validate(target) {
	const inputs = target.querySelectorAll("input");
	if (inputs.length !== 1000) throw new Error("Expected 1,000 fields");
	for (let index = 0; index < inputs.length; index++) {
		const expected =
			index === 10 ? "Updated field #100" : `Field #${index + 1}`;
		if (
			inputs[index].value !== expected ||
			inputs[index].defaultValue !== expected
		)
			throw new Error(`Incorrect committed value in field ${index + 1}`);
	}
}
