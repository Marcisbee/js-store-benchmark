import { readdirSync } from "node:fs";

export function getSuite(name) {
	if (!["counter", "fields", "workspace"].includes(name))
		throw new Error(`Unknown suite: ${name}`);
	const directory = `./react/${name}`;
	return {
		suite: `React ${name[0].toUpperCase()}${name.slice(1)}`,
		entryPoints: readdirSync(`${directory}/src`)
			.filter((file) => file.endsWith(".tsx"))
			.sort()
			.map((file) => `${directory}/src/${file}`),
		outdir: `${directory}/dist`,
		runPath: `react/${name}/index.mjs`,
		manual: false,
		interactions:
			name === "workspace"
				? [
						"edit",
						"checklist",
						"status",
						"assignee",
						"search",
						"filter",
						"sort",
						"bulk",
						"incoming",
						"selection",
					]
				: [],
	};
}
