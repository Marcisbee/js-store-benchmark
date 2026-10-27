// @ts-check
// @ts-ignore
import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

import { parseFlags } from "tachometer/lib/flags.js";
import { makeConfig } from "tachometer/lib/config.js";
import { Server } from "tachometer/lib/server.js";
import { manualMode } from "tachometer/lib/manual.js";
import { makeServerPlans } from "tachometer/lib/versions.js";
import { Runner } from "tachometer/lib/runner.js";
import { browserSignature } from "tachometer/lib/browser.js";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Selenium Manager selects a driver matching the installed Chrome. Tachometer's
// old launcher installs the latest chromedriver via npm while running a benchmark.
class ChromeRunner extends Runner {
	async launchBrowsers() {
		for (const { browser } of this.specs) {
			if (browser.name !== "chrome")
				throw new Error("These suites require Chrome");
			const signature = browserSignature(browser);
			if (this.browsers.has(signature)) continue;
			const options = new chrome.Options().addArguments(
				...browser.addArguments,
			);
			if (browser.headless) options.addArguments("--headless=new");
			options.windowSize(browser.windowSize);
			if (process.env.CHROME_BIN)
				options.setChromeBinaryPath(process.env.CHROME_BIN);
			const driver = await new Builder()
				.forBrowser("chrome")
				.setChromeOptions(options)
				.build();
			const [initialTabHandle] = await driver.getAllWindowHandles();
			this.browsers.set(signature, {
				name: browser.name,
				driver,
				initialTabHandle,
			});
		}
	}
	async closeBrowsers() {
		const browsers = [...this.browsers.values()];
		this.browsers.clear();
		await Promise.all(browsers.map(({ driver }) => driver.quit()));
	}
}

/**
 * @param {Partial<import('tachometer/src/config').Config>} extendConfig
 */
export async function tachometer(extendConfig) {
	const opts = parseFlags(["bench.html"]);
	const config = await makeConfig(opts);

	Object.assign(config, extendConfig);

	const { plans } = await makeServerPlans(
		config.root,
		opts["npm-install-dir"],
		config.benchmarks,
	);

	const servers = new Map();
	const promises = [];
	for (const { npmInstalls, mountPoints, specs } of plans) {
		promises.push(
			(async () => {
				const server = await Server.start({
					host: opts.host,
					ports: opts.port,
					root: config.root,
					npmInstalls,
					mountPoints,
					resolveBareModules: config.resolveBareModules,
					cache: true,
				});
				for (const spec of specs) {
					servers.set(spec, server);
				}
			})(),
		);
	}

	await Promise.all(promises);
	if (config.mode === "manual") {
		await manualMode(config, servers);
	} else {
		const runner = new ChromeRunner(config, servers);

		const log = console.log;
		try {
			console.log = () => {};
			return await runner.run();
		} finally {
			console.log = log;
			try {
				await runner.closeBrowsers();
			} finally {
				const allServers = new Set([...servers.values()]);
				await Promise.all([...allServers].map((server) => server.close()));
			}
		}
	}
}
