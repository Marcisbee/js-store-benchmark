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
