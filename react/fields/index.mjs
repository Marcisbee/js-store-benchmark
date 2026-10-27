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
