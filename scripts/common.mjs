// @ts-check
import { join } from "node:path";
import { readdirSync, statSync } from "node:fs";

const INCLUDE_DEFAULTS = [/\.json$/];
const EXCLUDE_DEFAULTS = [/node_modules\/.*$/];

const resultsList = regexGlob("./results").reduce((acc, path) => {
	const [date, fileName] = path.split("/").slice(-2);
	const [type, name] = fileName.split(".");

	return {
		...acc,
		[date]: [
			...(acc[date] || []),
			{
				path,
				type,
				name,
			},
		],
	};
}, {});

const resultsTs = `export const results = {\n${Object.entries(resultsList)
	.map(
		([date, bench]) =>
			`"${date}": [${bench.map(
				({ path, ...config }) =>
					`{${JSON.stringify(config).slice(
						1,
						-1,
					)},"content": () => import("../../${path}", { assert: { type: "json" }}).then((v) => v.default)}`,
			)}]`,
	)
	.join(",\n")}\n};`;

/** @type {import("esbuild").Plugin} */
const resultsPlugin = {
	name: "results-ns",
	setup(build) {
		build.onResolve({ filter: /^@js-store-benchmark\/results$/ }, (args) => ({
			path: args.path,
			namespace: "results-ns",
		}));
		build.onLoad({ filter: /.*/, namespace: "results-ns" }, (args) => ({
			contents: resultsTs,
			loader: "ts",
			resolveDir: args.path,
		}));
	},
};

/** @type {import("esbuild").BuildOptions} */
export const commonEsbuildConfig = {
	charset: "utf8",
	outExtension: {
		".js": ".mjs",
	},
	format: "esm",
	target: "es2016",
	bundle: true,
	sourcemap: "linked",
	plugins: [resultsPlugin],
	write: false,
	tsconfig: "./tsconfig.json",
	logLevel: "info",
	jsx: "automatic",
	jsxImportSource: "react",
	splitting: true,
};

/**
 * @param {string} filePath
 * @param {RegExp[]} rules
 * @returns {boolean}
 */
function isInRuleset(filePath, rules) {
	for (const rule of rules) {
		if (rule.test(filePath)) {
			return true;
		}
	}

	return false;
}

/**
 * List all files in a directory recursively in a synchronous fashion
 * @param {string} dir
 * @returns {IterableIterator<string>}
 */
function* walkSync(dir) {
	const files = readdirSync(dir);

	for (const file of files) {
		const pathToFile = join(dir, file);
		const isDirectory = statSync(pathToFile).isDirectory();
		if (isDirectory) {
			yield* walkSync(pathToFile);
		} else {
			yield pathToFile;
		}
	}
}

/**
 * Return files list in matched rules
 * @param {string} dirPath
 * @param {{ include?: RegExp[]; exclude?: RegExp[] }=} options
 */
function regexGlob(dirPath, options = {}) {
	const { include = INCLUDE_DEFAULTS, exclude = EXCLUDE_DEFAULTS } = options;
	/** @type {string[]} */
	const paths = [];

	for (const filePath of walkSync(dirPath)) {
		const excluded = isInRuleset(filePath, exclude);
		const included = isInRuleset(filePath, include);

		if (!excluded && included) {
			paths.push(filePath);
		}
	}

	return paths;
}
