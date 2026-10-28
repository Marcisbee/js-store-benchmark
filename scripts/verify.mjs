import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { build } from "../build.mjs";
import { getSuite } from "../suites.mjs";

// A second, untimed route through the real UI guards against adapters that
// accidentally specialize updates or subscriptions to the measured sequence.
async function verifyAlternateWorkspace(driver, url) {
	await driver.get(`${url}&manual=true`);
	const wait = async (expression) =>
		driver.wait(
			() => driver.executeScript(`return Boolean(${expression})`),
			10000,
		);
	const set = async (control, value) =>
		driver.executeScript(
			`
  const input = document.querySelector('[data-control="'+arguments[0]+'"]');
  const prototype = input.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, arguments[1]);
  input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input', {bubbles:true}));
 `,
			control,
			value,
		);
	const click = async (selector) =>
		driver.executeScript(
			"document.querySelector(arguments[0]).click()",
			selector,
		);
	await wait("document.querySelector('[data-summary]')");
	await set("query", "Task 0737");
	await wait(
		"document.querySelectorAll('[data-task]').length === 1 && document.querySelector('[data-task=\"736\"]')",
	);
	await click('[data-task="736"] button');
	await wait("document.querySelector('[data-detail=\"736\"]')");
	await set("edit", "Review outside timed sequence");
	await wait(
		"document.querySelector('[data-detail] [data-field=title]').textContent === 'Review outside timed sequence' && document.querySelectorAll('[data-task]').length === 0",
	);
	await set("status", "done");
	await wait(
		"document.querySelector('[data-count=done]').textContent === 'done: 334' && document.querySelector('[data-count=doing]').textContent === 'doing: 332'",
	);
	await set("assignee", "6");
	await wait(
		"document.querySelector('[data-count=assigned]').textContent === 'assigned: 124'",
	);
	await click('[data-check="0"]');
	await wait(
		"document.querySelector('[data-detail] [data-field=checklist]').textContent === '1/3'",
	);
	await set("query", "outside timed");
	await wait(
		"document.querySelector('[data-task=\"736\"] [data-field=status]')?.textContent === 'done' && document.querySelector('[data-task=\"736\"] [data-field=assignee]')?.textContent === 'Person 7' && document.querySelector('[data-task=\"736\"] [data-field=checklist]')?.textContent === '1/3'",
	);
	await set("query", "Task 0001");
	await wait("document.querySelector('[data-task=\"0\"]')");
	await click('[data-task="0"] button');
	await wait("document.querySelector('[data-detail=\"0\"]')");
	await set("edit", "Another selected task");
	await wait(
		"document.querySelector('[data-detail] [data-field=title]').textContent === 'Another selected task'",
	);
	await set("query", "outside timed");
	await wait(
		"document.querySelector('[data-task=\"736\"] [data-field=title]')?.textContent === 'Review outside timed sequence'",
	);
	await set("query", "");
	await wait("document.querySelectorAll('[data-task]').length === 50");
	await set("sort", "reverse");
	await wait(
		"document.querySelector('[data-task]')?.getAttribute('data-task') === '999'",
	);
	await click("[data-action=bulk]");
	await wait(
		"document.querySelector('[data-count=done]').textContent === 'done: 347'",
	);
	const statuses = await driver.executeScript(
		"return [...document.querySelectorAll('[data-task]')].map(row => [Number(row.dataset.task), row.querySelector('[data-field=status]').textContent])",
	);
	assert.equal(statuses.length, 50);
	for (const [id, status] of statuses) {
		assert.equal(
			status,
			id >= 980 ? "done" : ["todo", "doing", "done"][id % 3],
		);
	}
}

// Exercise the same production bundles and browser entry point as tachometer.
const suites = (
	process.argv.slice(2).length
		? process.argv.slice(2)
		: ["counter", "fields", "workspace"]
).map(getSuite);
for (const suite of suites) {
	await build(suite);
	// Keep the public bundle paths identical to the timing runner. Combining
	// src/ and unsupported/ changes esbuild's inferred entry-point base.
	if (suite.unsupported.length)
		await build({
			...suite,
			entryPoints: suite.unsupported.map((entry) => entry.path),
		});
}
const root = resolve(".");
const server = createServer(async (request, response) => {
	try {
		const path = resolve(
			root,
			`.${new URL(request.url, "http://localhost").pathname}`,
		);
		if (!path.startsWith(root + sep)) throw new Error("Invalid path");
		response.setHeader(
			"Content-Type",
			path.endsWith(".html") ? "text/html" : "text/javascript",
		);
		response.end(await readFile(path));
	} catch {
		response.writeHead(404).end();
	}
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let driver;
let failed = 0;
try {
	const options = new chrome.Options().addArguments(
		"--headless=new",
		"--no-sandbox",
		"--js-flags=--expose-gc",
	);
	if (process.env.CHROME_BIN)
		options.setChromeBinaryPath(process.env.CHROME_BIN);
	driver = await new Builder()
		.forBrowser("chrome")
		.setChromeOptions(options)
		.build();
	// Observe the existing render timestamps without adding work to timed runs.
	await driver.sendDevToolsCommand("Page.addScriptToEvaluateOnNewDocument", {
		source: `window.unrelatedFieldUpdates = 0;
	 new MutationObserver(records => {
	  for (const record of records) {
	   const input = record.target.parentElement?.querySelector('input');
	   if (input?.value.startsWith('Field #')) window.unrelatedFieldUpdates++;
	  }
	 }).observe(document, {subtree: true, characterData: true});`,
	});
	for (const suite of suites) {
		await driver.sendDevToolsCommand("Emulation.setCPUThrottlingRate", {
			rate: suite.suite === "React Workspace" ? 4 : 1,
		});
		for (const entry of [
			...suite.entryPoints,
			...suite.unsupported.map((entry) => entry.path),
		]) {
			const name = entry
				.split("/")
				.at(-1)
				.replace(/\.tsx$/, "");
			const bench = `${suite.outdir}/${name}.mjs`;
			try {
				await driver.get(
					`http://127.0.0.1:${server.address().port}/bench.html?${new URLSearchParams({ bench, run: suite.runPath })}`,
				);
				await driver.wait(
					() =>
						driver.executeScript(
							"return Boolean(window.tachometerError) || Number.isFinite(window.tachometerResultMemory)",
						),
					30000,
				);
				const result = await driver.executeScript(`return {
     error: window.tachometerError,
     unrelatedFieldUpdates: window.unrelatedFieldUpdates,
     measurements: [window.tachometerResultStartup, window.tachometerResultPerformance, window.tachometerResultMemory],
     count: document.querySelector('h1')?.textContent,
     fields: [...document.querySelectorAll('input')].map(input => [input.value, input.defaultValue]),
    }`);
				const exclusion = suite.unsupported.find((item) => item.path === entry);
				if (exclusion) {
					assert.ok(
						result.error?.includes(exclusion.expectedError),
						`Expected documented failure: ${exclusion.expectedError}; received ${result.error}`,
					);
					assert.equal(
						result.measurements[2],
						null,
						"Excluded adapter must not produce a score",
					);
					console.log(
						`PASS documented exclusion ${name}: ${exclusion.expectedError}`,
					);
					continue;
				}
				assert.equal(result.error, null);
				assert.ok(
					result.measurements.every(
						(value) => Number.isFinite(value) && value >= 0,
					),
				);
				if (suite.suite === "React Counter") assert.equal(result.count, "1000");
				else if (suite.suite === "React Fields") {
					assert.equal(result.fields.length, 1000);
					assert.equal(
						result.unrelatedFieldUpdates,
						0,
						"Unedited fields changed their render timestamps",
					);
					for (const [index, [value, committed]] of result.fields.entries()) {
						assert.equal(
							value,
							index === 10 ? "Updated field #100" : `Field #${index + 1}`,
						);
						assert.equal(committed, value);
					}
				}
				if (suite.interactions.length) {
					const times = await driver.executeScript(
						"return window.tachometerResultInteractions",
					);
					assert.deepEqual(
						Object.keys(times).sort(),
						[...suite.interactions].sort(),
					);
					assert.ok(
						Object.values(times).every(
							(value) => Number.isFinite(value) && value > 0,
						),
					);
				}
				if (suite.suite === "React Workspace") {
					await verifyAlternateWorkspace(
						driver,
						`http://127.0.0.1:${server.address().port}/bench.html?${new URLSearchParams({ bench, run: suite.runPath })}`,
					);
				}
				console.log(`PASS ${suite.suite}: ${name}`);
			} catch (error) {
				failed++;
				console.error(`FAIL ${suite.suite}: ${name}: ${error.message}`);
				console.error(await driver.manage().logs().get("browser"));
			}
		}
	}
	if (suites.some((suite) => suite.suite === "React Workspace")) {
		// Model a delayed select-property commit after an incomplete mutation
		// notification. This uses the real app/store; only the DOM notification
		// ordering is controlled. Property writes emit no mutation records.
		const { identifier } = await driver.sendAndGetDevToolsCommand(
			"Page.addScriptToEvaluateOnNewDocument",
			{
				source: `const NativeObserver=MutationObserver;let injected=false;
                window.MutationObserver=class extends NativeObserver {constructor(callback){super((records,observer)=>{
                    const select=document.querySelector('[data-control="filterAssignee"]');
                    if(!injected && select?.value==='0') {
                        injected=true;window.propertyCommitInjected=true;select.value='';
                        callback(records,observer);setTimeout(()=>{select.value='0'},0);
                    } else callback(records,observer);
                })}};`,
			},
		);
		await driver.get(
			`http://127.0.0.1:${server.address().port}/bench.html?bench=react/workspace/dist/use-reducer.mjs&run=react/workspace/index.mjs`,
		);
		await driver.wait(
			() =>
				driver.executeScript(
					"return Boolean(window.tachometerError) || Number.isFinite(window.tachometerResultMemory)",
				),
			10000,
		);
		const completion = await driver.executeScript(
			"return {injected:window.propertyCommitInjected,error:window.tachometerError,score:window.tachometerResultPerformance}",
		);
		assert.equal(completion.injected, true);
		assert.equal(completion.error, null);
		assert.ok(Number.isFinite(completion.score));
		await driver.sendDevToolsCommand(
			"Page.removeScriptToEvaluateOnNewDocument",
			{ identifier },
		);
		console.log("PASS property-only select completion after a partial commit");

		await driver.sendDevToolsCommand("Page.addScriptToEvaluateOnNewDocument", {
			source: `document.addEventListener('click', event => { if (event.target.matches('[data-action="bulk"]')) event.stopImmediatePropagation(); }, true);`,
		});
		await driver.get(
			`http://127.0.0.1:${server.address().port}/bench.html?bench=react/workspace/dist/use-reducer.mjs&run=react/workspace/index.mjs`,
		);
		await driver.wait(
			() => driver.executeScript("return Boolean(window.tachometerError)"),
			10000,
		);
		assert.match(
			await driver.executeScript("return window.tachometerError"),
			/bulk: No DOM commit/,
		);
		assert.equal(
			await driver.executeScript(
				"return window.tachometerResultMemory ?? null",
			),
			null,
		);
		console.log(
			"PASS skipped bulk update is rejected without producing a score",
		);
	}
} finally {
	await driver?.quit();
	await new Promise((resolve) => server.close(resolve));
}
if (failed) throw new Error(`${failed} benchmark targets failed`);
