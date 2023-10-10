// @ts-check
import * as esbuild from "esbuild";

import { commonEsbuildConfig } from "./common.mjs";

const ctx = await esbuild.context({
	...commonEsbuildConfig,

	entryPoints: ["./web/main.tsx"],
	outdir: "./web/www",
	write: false,
	define: {
		"process.env.NODE_ENV": '"development"',
	},
	metafile: false,
	minify: false,
	logLevel: "info",
});

await ctx.watch();
await ctx.serve({
	servedir: "./web/www",
});
