// @ts-check
import * as esbuild from "esbuild";
import { writeFileSync } from "node:fs";

import { commonEsbuildConfig } from "./common.mjs";

const result = await esbuild.build({
	...commonEsbuildConfig,

	target: ["es2016", "chrome69"],
	entryPoints: ["./web/main.tsx"],
	sourcemap: false,
	outdir: "./web/www",
	write: true,
	define: {
		"process.env.NODE_ENV": '"production"',
	},
	metafile: true,
	minify: true,
});

writeFileSync("meta.json", JSON.stringify(result.metafile));
