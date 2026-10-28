// @ts-check
import * as colorette from "colorette";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { basename, dirname, resolve } from "node:path";
import { build } from "./build.mjs";

import { tachometer } from "./tachometer.mjs";
import { getStats } from "./stats.mjs";

const cpuStats = getStats();

/**
 * @param {{ suite: string, entryPoints: string[], outdir: string, runPath: string, manual: boolean, interactions?: string[], unsupported?: {name: string, reason: string}[] }} config
 */
export async function run(config) {
	for (const entry of config.unsupported || [])
		console.warn(`Excluded ${entry.name}: ${entry.reason}`);
	const context = await build(config);
	const distPaths = Object.keys(context.metafile.outputs);

	/** @type {Partial<import('tachometer/src/config').Config>} */
	const tachometerConfig = {
		sampleSize: 20,
		timeout: 0,
		mode: config.manual ? "manual" : undefined,
		benchmarks: await Promise.all(
			distPaths.map(async (path) => {
				// Read package metadata without executing browser-only modules in Node.
				const entryPoint = context.metafile.outputs[path].entryPoint;
				const source = readFileSync(entryPoint, "utf8");
				const packagePath = source.match(
					/from\s+["']([^"']*node_modules\/[^"']+\/package\.json)["']/,
				)?.[1];
				const {
					version,
					name: npmName,
					homepage,
				} = packagePath
					? JSON.parse(
							readFileSync(resolve(dirname(entryPoint), packagePath), "utf8"),
						)
					: {};

				return {
					name: [basename(path).replace(/\..*$/, ""), version]
						.filter(Boolean)
						.join("-v"),
					url: {
						kind: "local",
						urlPath: "/bench.html",
						queryString: `?bench=${path}&run=${config.runPath}`,
					},
					browser: {
						extra: {
							methodology: {
								version: config.interactions?.length ? 6 : 3,
								react: JSON.parse(
									readFileSync("node_modules/react/package.json", "utf8"),
								).version,
								operations: config.suite.toLowerCase().includes("counter")
									? 1000
									: config.interactions?.length
										? 21
										: 100,
								sampleSize: 20,
								cpuThrottlingRate: 4,
								sourceRevision: execFileSync("git", ["rev-parse", "HEAD"], {
									encoding: "utf8",
								}).trim(),
								lockfileSha256: createHash("sha256")
									.update(readFileSync("package-lock.json"))
									.digest("hex"),
							},
							npm: {
								npmName,
								version,
								homepage,
							},
							stats: {
								cpu: cpuStats,
							},
						},
						name: "chrome",
						addArguments: [
							"--no-sandbox",
							"--no-first-run",
							"--enable-automation",
							"--disable-infobars",
							"--disable-background-networking",
							"--disable-background-timer-throttling",
							"--disable-cache",
							"--disable-translate",
							"--disable-sync",
							"--disable-extensions",
							"--disable-default-apps",
							"--js-flags=--expose-gc",
							"--enable-precise-memory-info",
						],
						headless: true,
						windowSize: {
							width: 800,
							height: 600,
						},
						cpuThrottlingRate: 4,
					},
					measurement: [
						...(config.interactions || []).map((name) => ({
							mode: "expression",
							name,
							expression: `(() => { if (window.tachometerError) throw new Error(window.tachometerError); return window.tachometerResultInteractions?.${name}; })()`,
						})),
						{
							mode: "expression",
							name: "performance",
							expression:
								"(() => { if (window.tachometerError) throw new Error(window.tachometerError); return window.tachometerResultPerformance; })()",
						},
						{
							mode: "expression",
							name: "startup",
							expression:
								"(() => { if (window.tachometerError) throw new Error(window.tachometerError); return window.tachometerResultStartup; })()",
						},
						{
							mode: "expression",
							name: "memory",
							expression:
								"(() => { if (window.tachometerError) throw new Error(window.tachometerError); return window.tachometerResultMemory; })()",
						},
					],
				};
			}),
		),
	};

	console.log(getStats());
	console.log(`Running ${colorette.bold(colorette.red(config.suite))}..`);

	const results = await tachometer(tachometerConfig);

	if (config.manual) {
		return;
	}

	if (!results) {
		throw new Error("Failed to get results");
	}

	// Clear console logs
	process.stdout.write("\x1Bc");

	console.log(getStats());
	console.log(`Results for ${colorette.bold(colorette.red(config.suite))}\n`);

	const maxNameWidth = results.reduce((acc, { result: { name } }) => {
		const length = name.replace(/ \[[^\]]+\]$/, "").length;

		return acc > length ? acc : length;
	}, 0);

	const groupedResults = results.reduce(
		/**
		 * @param {Record<string, Record<string, import('tachometer/src/stats').ResultStatsWithDifferences>>} acc
		 * @param {import('tachometer/src/stats').ResultStatsWithDifferences} result
		 * @returns
		 */
		(acc, result) => {
			const [name, type] = result.result.name.split(/ \[([^\]]+)\]$/);

			if (!acc[name]) {
				acc[name] = {
					[type]: result,
				};
			} else {
				acc[name][type] = result;
			}

			return acc;
		},
		{},
	);

	for (const measurements of Object.values(groupedResults))
		for (const measurement of Object.values(measurements))
			delete measurement.differences;

	const sortedResults = Object.entries(groupedResults).sort(
		([, a], [, b]) => a.performance.stats.mean - b.performance.stats.mean,
	);

	for (const [name, { performance, startup, memory }] of sortedResults) {
		const kb = (performance.result.bytesSent / 1024).toFixed(1);

		delete performance.differences;
		delete startup.differences;
		delete memory.differences;

		const nameWithPadding = name.padEnd(maxNameWidth, ".");
		const [nameOnly, paddingOnly = ""] = nameWithPadding.split(/(\.*)$/);

		process.stdout.write(
			[
				colorette.blue(colorette.bold(nameOnly)),
				colorette.dim(paddingOnly),
				colorette.yellow(`${performance.stats.mean.toFixed(1)} ms/batch`),
				`±${performance.stats.standardDeviation.toFixed(1)}`,
				// "|",
				// colorette.yellow(`${startup.stats.mean.toFixed(2)} ms`),
				"|",
				colorette.dim(`${kb} KB`),
				// "|",
				// colorette.dim(`${(memory.stats.mean / 1024 / 1024).toFixed(2)} MB`),
			].join(" ") + "\n",
		);
	}

	const now = new Date();
	const stamp = `${now.getFullYear()}${("0" + (now.getMonth() + 1)).slice(
		-2,
	)}${("0" + now.getDate()).slice(-2)}`;

	mkdirSync(`results/${stamp}`, { recursive: true });
	writeFileSync(
		`results/${stamp}/${config.suite
			.trim()
			.replace(/[A-Z]/g, (match) => match.toLowerCase())
			.replace(/[ ]+/g, ".")}.json`,
		JSON.stringify(sortedResults, null, 2),
	);
}
