import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { Builder, By, Key } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const root = resolve("web/www");
const server = createServer(async (request, response) => {
	try {
		const url = new URL(request.url, "http://localhost");
		const path = resolve(
			root,
			`.${url.pathname === "/" ? "/index.html" : url.pathname}`,
		);
		if (!path.startsWith(root + sep)) throw new Error("Invalid path");
		response.setHeader(
			"Content-Type",
			path.endsWith(".html")
				? "text/html"
				: path.endsWith(".css")
					? "text/css"
					: "text/javascript",
		);
		response.end(await readFile(path));
	} catch {
		response.writeHead(404).end();
	}
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let driver;
const ready = () =>
	driver.wait(
		() =>
			driver.executeScript(
				'return document.querySelector(".table-wrap")?.getAttribute("aria-busy") === "false"',
			),
		10000,
	);
const choose = async (selector, value) => {
	const select = await driver.findElement(By.css(selector));
	await select.findElement(By.css(`option[value="${value}"]`)).click();
	await ready();
};
const rowCount = () =>
	driver.executeScript('return document.querySelectorAll("tbody tr").length');
try {
	const options = new chrome.Options().addArguments(
		"--headless=new",
		"--no-sandbox",
	);
	if (process.env.CHROME_BIN)
		options.setChromeBinaryPath(process.env.CHROME_BIN);
	driver = await new Builder()
		.forBrowser("chrome")
		.setChromeOptions(options)
		.build();
	await driver.manage().window().setRect({ width: 1280, height: 900 });
	await driver.get(`http://127.0.0.1:${server.address().port}/`);
	await ready();
	assert.equal(
		await driver
			.findElement(By.css('[data-suite="workspace"]'))
			.getAttribute("aria-pressed"),
		"true",
	);
	const dates = (await readdir("results"))
		.filter((date) => /^\d{8}$/.test(date))
		.sort()
		.reverse();
	for (const date of dates) {
		await choose(".date-control select", date);
		for (const suite of ["workspace", "counter", "fields"]) {
			await driver.findElement(By.css(`[data-suite="${suite}"]`)).click();
			let rows = [];
			try {
				rows = JSON.parse(
					await readFile(`results/${date}/react.${suite}.json`, "utf8"),
				);
			} catch (error) {
				if (error.code !== "ENOENT") throw error;
			}
			assert.equal(await rowCount(), rows.length, `${date}/${suite} row count`);
			if (rows.length) {
				const [id, measurements] = rows.find(([name]) =>
					name.startsWith("exome-v"),
				);
				const actual = await driver.executeScript(
					`const row = [...document.querySelectorAll('tbody tr')].find(row => row.querySelector('.library').textContent.replace('v', '-v') === arguments[0]); return row && [...row.querySelectorAll('.metric')].map(cell => cell.textContent);`,
					id,
				);
				assert.ok(actual, `${date}/${suite}: Exome row`);
				if (suite === "workspace") {
					for (const key of [
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
					]) {
						await choose('[aria-label="Update measurement"]', key);
						const value = await driver.executeScript(
							`return [...document.querySelectorAll('tbody tr')].find(row => row.querySelector('.library').textContent.replace('v', '-v') === arguments[0]).querySelector('.metric .value').textContent`,
							id,
						);
						assert.equal(
							value,
							measurements[key].stats.mean.toFixed(1),
							`${suite}: ${key}`,
						);
					}
					await choose('[aria-label="Update measurement"]', "performance");
				}
				assert.equal(
					actual[0],
					`${measurements.performance.stats.mean.toFixed(1)}± ${measurements.performance.stats.standardDeviation.toFixed(1)}`,
				);
				assert.equal(
					actual[1],
					`${measurements.startup.stats.mean.toFixed(1)}± ${measurements.startup.stats.standardDeviation.toFixed(1)}`,
				);
				assert.equal(
					actual[2],
					`${(measurements.memory.stats.mean / 1024 ** 2).toFixed(1)}± ${(measurements.memory.stats.standardDeviation / 1024 ** 2).toFixed(1)}`,
				);
			}
		}
	}
	const counterDates = [];
	for (const date of dates) {
		if ((await readdir(`results/${date}`)).includes("react.counter.json"))
			counterDates.push(date);
	}
	const counterDate = counterDates[0];
	await choose(".date-control select", counterDate);
	await driver.findElement(By.css('[data-suite="counter"]')).click();
	const search = await driver.findElement(By.css('input[type="search"]'));
	await search.sendKeys("EXOME");
	assert.equal(await rowCount(), 1);
	await search.sendKeys(Key.CONTROL, "a", Key.NULL, "no-such-library");
	assert.equal(await rowCount(), 0);
	assert.match(
		await driver.findElement(By.css(".empty")).getText(),
		/No matching libraries/,
	);
	await search.clear();
	await search.sendKeys(" ");
	assert.ok((await rowCount()) > 1);
	for (const width of [320, 390, 700, 768, 1280]) {
		await driver.manage().window().setRect({ width, height: 844 });
		const layout = await driver.executeScript(
			`return {overflow:document.documentElement.scrollWidth > innerWidth, metrics:[...document.querySelectorAll('tbody tr:first-child .metric')].filter(cell => getComputedStyle(cell).display !== 'none').length}`,
		);
		assert.equal(layout.overflow, false, `${width}px horizontal overflow`);
		assert.equal(
			await driver.executeScript(
				'const toolbar = document.querySelector(".toolbar"); return toolbar.scrollWidth > toolbar.clientWidth',
			),
			false,
			`${width}px clipped toolbar`,
		);
		assert.equal(layout.metrics, 5);
	}
	await driver.manage().window().setRect({ width: 390, height: 844 });
	for (const column of [3, 4, 5, 6, 7]) {
		const button = await driver.findElement(
			By.css(`thead th:nth-child(${column}) button`),
		);
		await button.click();
		const ascending = await driver.executeScript(
			`return [...document.querySelectorAll('tbody .selected .value')].map(cell => Number(cell.textContent))`,
		);
		assert.deepEqual(
			ascending,
			[...ascending].sort((a, b) => a - b),
		);
		await button.click();
		const descending = await driver.executeScript(
			`return [...document.querySelectorAll('tbody .selected .value')].map(cell => Number(cell.textContent))`,
		);
		assert.deepEqual(
			descending,
			[...descending].sort((a, b) => b - a),
		);
	}
	await driver.manage().window().setRect({ width: 1280, height: 900 });
	const startup = await driver.findElement(
		By.css("thead th:nth-child(4) button"),
	);
	await startup.sendKeys(Key.ENTER);
	assert.equal(
		await driver
			.findElement(By.css("thead th:nth-child(4)"))
			.getAttribute("aria-sort"),
		"ascending",
	);
	await startup.sendKeys(Key.ENTER);
	assert.equal(
		await driver
			.findElement(By.css("thead th:nth-child(4)"))
			.getAttribute("aria-sort"),
		"descending",
	);
	const focusLink = await driver.findElement(
		By.css('a[aria-label="Focus exome"]'),
	);
	await focusLink.sendKeys(Key.ENTER);
	assert.equal(
		new URL(await driver.getCurrentUrl()).searchParams.get("focus"),
		"exome",
	);
	const focusedName = () =>
		driver.findElement(By.css("tbody tr.focused .library")).getText();
	assert.match(await focusedName(), /^exome/);
	await driver.navigate().refresh();
	await ready();
	await choose(".date-control select", counterDate);
	await driver.findElement(By.css('[data-suite="counter"]')).click();
	assert.match(await focusedName(), /^exome/);
	await driver.manage().window().setRect({ width: 390, height: 844 });
	await driver.findElement(By.css("thead th:nth-child(3) button")).click();
	assert.equal(
		await driver.executeScript(`
		const row = document.querySelector('tr.focused').getBoundingClientRect();
		const wrap = document.querySelector('.table-wrap').getBoundingClientRect();
		const head = document.querySelector('thead').getBoundingClientRect();
		return row.top >= head.bottom && row.bottom <= wrap.bottom;
	`),
		true,
		"focused row stays visible after sorting on mobile",
	);
	await driver
		.findElement(By.css('a[aria-label="Focus zustand"]'))
		.sendKeys(Key.ENTER);
	assert.match(await focusedName(), /^zustand/);
	await driver.navigate().back();
	await driver.wait(
		async () => (await focusedName()).startsWith("exome"),
		5000,
	);
	const errors = (await driver.manage().logs().get("browser")).filter(
		(entry) =>
			entry.level.name === "SEVERE" && !entry.message.includes("favicon.ico"),
	);
	assert.deepEqual(errors, []);
	console.log(
		"PASS results page: all saved dates/suites, exact metrics, filtering, all mobile columns and sorting, keyboard sorting, 320–1280px layouts",
	);
} finally {
	try {
		await driver?.quit();
	} finally {
		await new Promise((resolve) => server.close(resolve));
	}
}
