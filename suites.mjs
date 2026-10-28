import { readdirSync, readFileSync } from "node:fs";

export function getSuite(name) {
	if (!["counter", "fields", "workspace"].includes(name))
		throw new Error(`Unknown suite: ${name}`);
	const directory = `./react/${name}`;
	const unsupported =
		name === "workspace"
			? JSON.parse(readFileSync(`${directory}/unsupported.json`, "utf8"))
			: [];
	if (name === "workspace") {
		const candidates = readdirSync("./react/counter/src").filter((file) =>
			file.endsWith(".tsx"),
		);
		const covered = new Set(
			readdirSync(`${directory}/src`).filter((file) => file.endsWith(".tsx")),
		);
		for (const entry of unsupported) {
			if (
				!entry.reason ||
				!entry.expectedError ||
				covered.has(`${entry.name}.tsx`)
			)
				throw new Error(`Invalid workspace exclusion: ${entry.name}`);
			covered.add(`${entry.name}.tsx`);
		}
		const missing = candidates.filter((file) => !covered.has(file));
		if (missing.length)
			throw new Error(`Workspace coverage missing: ${missing.join(", ")}`);
	}
	return {
		suite: `React ${name[0].toUpperCase()}${name.slice(1)}`,
		entryPoints: readdirSync(`${directory}/src`)
			.filter((file) => file.endsWith(".tsx"))
			.sort()
			.map((file) => `${directory}/src/${file}`),
		outdir: `${directory}/dist`,
		runPath: `react/${name}/index.mjs`,
		manual: false,
		unsupported: unsupported.map((entry) => ({
			...entry,
			path: `${directory}/unsupported/${entry.name}.tsx`,
		})),
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
