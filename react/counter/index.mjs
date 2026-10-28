import { waitFor } from "../utils/wait-for.mjs";

export default async function run(target) {
	for (let i = 0; i < 1000; i++) {
		const heading = target.querySelector("h1");
		const updated = waitFor(
			target,
			() => target.querySelector("h1")?.textContent === String(i + 1),
			`counter ${i + 1}`,
			{
				characterData: true,
				childList: true,
				subtree: true,
			},
		);
		heading.click();
		await updated;
	}
}

export function validate(target) {
	if (target.querySelector("h1")?.textContent !== "1000")
		throw new Error("Counter did not commit all 1,000 increments");
}

export function validateInitial(target) {
	if (
		target.querySelectorAll("h1").length !== 1 ||
		target.querySelector("h1").textContent !== "0"
	)
		throw new Error("Expected one counter initialized to zero");
}
