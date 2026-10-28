import esbuild from "esbuild";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function build(config) {
	return esbuild.build({
		entryPoints: config.entryPoints,
		outdir: config.outdir,
		format: "esm",
		minify: true,
		bundle: true,
		outExtension: {
			".js": ".mjs",
		},
		// Legal comments should not be part of bundle as we compare raw size too
		legalComments: "none",
		sourcemap: false,
		define: {
			"process.env.NODE_ENV": '"production"',
		},
		platform: "browser",
		metafile: true,
		plugins: [
			{
				name: "package-json",
				setup({ onResolve, onLoad }) {
					onResolve({ filter: /\/package\.json$/ }, (args) => ({
						namespace: "package-json",
						path: join(args.resolveDir, args.path),
					}));

					onLoad({ filter: /./, namespace: "package-json" }, async (args) => {
						try {
							const { name, version, homepage } = JSON.parse(
								readFileSync(args.path, "utf-8"),
							);

							return {
								contents: JSON.stringify({ name, version, homepage }),
								loader: "json",
							};
						} catch (err) {
							// err = { errors, warnings }
							return err;
						}
					});
				},
			},
		],
	});
}
