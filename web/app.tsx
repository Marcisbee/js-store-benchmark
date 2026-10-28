import "./livereload.ts";
import { results } from "@js-store-benchmark/results";
import { useEffect, useMemo, useRef, useState } from "react";
import { hexToColor, lerpMultipleColors } from "./utils/color-lerp.ts";

const heatColor = lerpMultipleColors({
	0: 0x5cbd7f,
	0.5: 0xfde681,
	1: 0xf36c75,
});

const metrics = {
	performance: {
		label: "Update",
		unit: "ms",
		divisor: 1,
		description: "Time to complete the update workload",
	},
	startup: {
		label: "Startup",
		unit: "ms",
		divisor: 1,
		description:
			"Startup timing for the selected run; see README for methodology",
	},
	memory: {
		label: "Memory",
		unit: "MB",
		divisor: 1024 * 1024,
		description: "Used JavaScript heap after the workload",
	},
	size: {
		label: "Transfer",
		unit: "KB",
		divisor: 1024,
		description: "Bytes transferred for the benchmark page",
	},
	score: {
		label: "Score",
		unit: "",
		divisor: 1,
		description:
			"Sum of each metric divided by its best value; lower is better",
	},
};
type Metric = keyof typeof metrics;
const metricKeys = Object.keys(metrics) as Metric[];
type Measurement = {
	stats: { mean: number; standardDeviation: number };
	result: {
		bytesSent: number;
		userAgent: string;
		browser: {
			extra?: { npm?: { homepage?: string }; stats?: { cpu?: string } };
		};
	};
};
type ResultRow = [
	string,
	Record<"performance" | "startup" | "memory", Measurement>,
];
type Suite = { type: string; name: string; content: ResultRow[] };
const dates = Object.keys(results).sort().reverse();
const cache = new Map<string, Promise<Suite[]>>();
function load(date: string): Promise<Suite[]> {
	if (!cache.has(date))
		cache.set(
			date,
			Promise.all(
				results[date].map(async ({ content, ...suite }) => ({
					...suite,
					content: await content(),
				})),
			).catch((error) => {
				cache.delete(date);
				throw error;
			}),
		);
	return cache.get(date)!;
}
function dateLabel(date: string) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(
		new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`),
	);
}
function prepare(rows: ResultRow[]) {
	const data = rows.map(([id, measurements]) => {
		const match = id.match(/^(.*)-v(.+)$/);
		return {
			id,
			name: match?.[1] || id,
			version: match?.[2],
			homepage: measurements.performance.result.browser.extra?.npm?.homepage,
			values: {
				performance: measurements.performance.stats.mean,
				startup: measurements.startup.stats.mean,
				memory: measurements.memory.stats.mean,
				size: measurements.performance.result.bytesSent,
				score: 0,
			},
			deviations: {
				performance: measurements.performance.stats.standardDeviation,
				startup: measurements.startup.stats.standardDeviation,
				memory: measurements.memory.stats.standardDeviation,
			},
		};
	});
	for (const key of metricKeys.filter((key) => key !== "score")) {
		const minimum = Math.min(...data.map((row) => row.values[key]));
		for (const row of data)
			row.values.score +=
				minimum > 0
					? row.values[key] / minimum
					: row.values[key] === 0
						? 1
						: Infinity;
	}
	return data;
}
function focusUrl(name: string) {
	const url = new URL(location.href);
	url.searchParams.set("focus", name);
	return `${url.pathname}${url.search}${url.hash}`;
}
export function App() {
	const [focus, setFocus] = useState(() =>
		new URLSearchParams(location.search).get("focus"),
	);
	const tableRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const syncFocus = () =>
			setFocus(new URLSearchParams(location.search).get("focus"));
		window.addEventListener("popstate", syncFocus);
		return () => window.removeEventListener("popstate", syncFocus);
	}, []);
	const [date, setDate] = useState(dates[0]);
	const [suite, setSuite] = useState("counter");
	const [metric, setMetric] = useState<Metric>("score");
	const [descending, setDescending] = useState(false);
	const [search, setSearch] = useState("");
	const [data, setData] = useState<Suite[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [retry, setRetry] = useState(0);
	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(false);
		if (!date) {
			setLoading(false);
			return;
		}
		load(date)
			.then((value) => {
				if (!cancelled) setData(value);
			})
			.catch(() => {
				if (!cancelled) setError(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [date, retry]);
	const source =
		data.find((item) => item.type === "react" && item.name === suite)
			?.content || [];
	const rows = useMemo(() => prepare(source), [source]);
	const ranges = useMemo(
		() =>
			Object.fromEntries(
				metricKeys.map((key) => {
					const values = rows
						.map((row) => row.values[key])
						.filter(Number.isFinite);
					return [key, { min: Math.min(...values), max: Math.max(...values) }];
				}),
			),
		[rows],
	);
	function cellColor(key: Metric, value: number) {
		if (!Number.isFinite(value)) return undefined;
		const { min, max } = ranges[key];
		return hexToColor(
			heatColor(
				max === min ? 0 : Math.max(0, Math.min(1, (value - min) / (max - min))),
			),
		);
	}
	const sorted = useMemo(
		() =>
			[...rows].sort(
				(a, b) =>
					(a.values[metric] - b.values[metric]) * (descending ? -1 : 1) ||
					a.name.localeCompare(b.name),
			),
		[rows, metric, descending],
	);
	const filtered = sorted.filter((row) =>
		row.id.toLowerCase().includes(search.trim().toLowerCase()),
	);
	useEffect(() => {
		const container = tableRef.current;
		const row = container?.querySelector<HTMLElement>("tr.focused");
		if (!container || !row) return;
		const headerHeight =
			container.querySelector("thead")?.getBoundingClientRect().height || 0;
		const top =
			row.getBoundingClientRect().top -
			container.getBoundingClientRect().top +
			container.scrollTop;
		container.scrollTop =
			top -
			headerHeight -
			(container.clientHeight - headerHeight - row.offsetHeight) / 2;
	}, [focus, sorted, search, loading]);
	const environment = source[0]?.[1].performance.result;
	function selectMetric(value: Metric) {
		setMetric(value);
		setDescending(false);
	}
	return (
		<main>
			<header className="page-header">
				<h1>
					JS Store Benchmark<span className="framework">React</span>
				</h1>
				<a
					className="source-link"
					href="https://github.com/Marcisbee/js-store-benchmark"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</header>
			<section className="results" aria-label="Benchmark results">
				<div className="toolbar">
					<div
						className="suite-switch"
						role="group"
						aria-label="Benchmark suite"
					>
						<button
							type="button"
							aria-pressed={suite === "counter"}
							onClick={() => setSuite("counter")}
						>
							Counter
						</button>
						<button
							type="button"
							aria-pressed={suite === "fields"}
							onClick={() => setSuite("fields")}
						>
							Fields
						</button>
					</div>
					<label className="date-control">
						<span className="sr-only">Result date</span>
						<select
							value={date}
							onChange={(event) => setDate(event.target.value)}
						>
							{dates.map((value) => (
								<option key={value} value={value}>
									{dateLabel(value)}
								</option>
							))}
						</select>
					</label>
				</div>
				<div className="table-tools">
					<div className="workload">
						<h2>
							{suite === "counter"
								? "1,000 increments"
								: "100 edits · 1,000 fields"}
						</h2>
						<span aria-live="polite">
							{!loading && !error ? `${filtered.length} targets` : "\u00a0"}
						</span>
					</div>
					<label className="search">
						<span className="sr-only">Filter libraries</span>
						<svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
							<circle cx="8.5" cy="8.5" r="5.5" />
							<path d="m13 13 4 4" />
						</svg>
						<input
							type="search"
							placeholder="Filter libraries"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
					</label>
				</div>
				<div
					ref={tableRef}
					className="table-wrap"
					aria-busy={loading}
					tabIndex={0}
					role="region"
					aria-label="Scrollable benchmark table"
				>
					<table>
						<caption className="sr-only">
							{suite === "counter" ? "Counter" : "Fields"} results,{" "}
							{date && dateLabel(date)}. Lower values are better.
						</caption>
						<thead>
							<tr>
								<th className="rank" scope="col">
									<span className="sr-only">Rank</span>#
								</th>
								<th className="library-heading" scope="col">
									Library
								</th>
								{metricKeys.map((key) => (
									<th
										scope="col"
										key={key}
										className={`metric ${metric === key ? "selected" : ""}`}
										aria-sort={
											metric === key
												? descending
													? "descending"
													: "ascending"
												: "none"
										}
									>
										<button
											type="button"
											title={metrics[key].description}
											onClick={() =>
												metric === key
													? setDescending(!descending)
													: selectMetric(key)
											}
										>
											{metrics[key].label}{" "}
											<span className="sort-arrow" aria-hidden="true">
												<svg
													viewBox="0 0 10 14"
													width="10"
													height="14"
													fill="none"
													stroke="currentColor"
													strokeWidth="1.2"
												>
													{(metric !== key || !descending) && (
														<path d="m2 5 3-3 3 3" />
													)}
													{(metric !== key || descending) && (
														<path d="m2 9 3 3 3-3" />
													)}
												</svg>
											</span>
											<span className="unit">
												{metrics[key].unit || "Relative"}
											</span>
										</button>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{!loading &&
								!error &&
								filtered.map((row) => (
									<tr
										key={row.id}
										className={
											focus === row.name || focus === row.id
												? "focused"
												: undefined
										}
									>
										<td className="rank">
											<a
												href={focusUrl(row.name)}
												aria-label={`Focus ${row.name}`}
												aria-current={
													focus === row.name || focus === row.id
														? "true"
														: undefined
												}
												onClick={(event) => {
													if (
														event.button !== 0 ||
														event.metaKey ||
														event.ctrlKey ||
														event.shiftKey ||
														event.altKey
													)
														return;
													event.preventDefault();
													if (focus !== row.name)
														history.pushState(null, "", focusUrl(row.name));
													setFocus(row.name);
												}}
											>
												{sorted.indexOf(row) + 1}
											</a>
										</td>
										<th scope="row" className="library">
											{row.homepage ? (
												<a href={row.homepage} target="_blank" rel="noreferrer">
													{row.name}
												</a>
											) : (
												<span>{row.name}</span>
											)}
											<span className="version">
												{row.version ? `v${row.version}` : "React built-in"}
											</span>
										</th>
										{metricKeys.map((key) => {
											const deviation =
												row.deviations[key as keyof typeof row.deviations];
											return (
												<td
													key={key}
													className={`metric ${metric === key ? "selected" : ""}`}
													style={{
														backgroundColor: cellColor(key, row.values[key]),
													}}
												>
													<span className="value">
														{Number.isFinite(row.values[key])
															? (
																	row.values[key] / metrics[key].divisor
																).toFixed(key === "score" ? 2 : 1)
															: "—"}
													</span>
													{deviation !== undefined && (
														<span className="deviation">
															± {(deviation / metrics[key].divisor).toFixed(1)}
														</span>
													)}
												</td>
											);
										})}
									</tr>
								))}
						</tbody>
					</table>
					{loading ? (
						<p className="empty" role="status">
							Loading results…
						</p>
					) : error ? (
						<div className="empty" role="alert">
							Results could not load.{" "}
							<button
								type="button"
								onClick={() => setRetry((value) => value + 1)}
							>
								Try again
							</button>
						</div>
					) : (
						filtered.length === 0 && (
							<p className="empty" role="status">
								{source.length
									? "No matching libraries."
									: "No results for this suite."}
							</p>
						)
					)}
				</div>
				<footer className="table-footer">
					<span>
						Lower is better <span aria-hidden="true">·</span> ± standard
						deviation
					</span>
					{!loading && environment && (
						<details>
							<summary>Run details</summary>
							<dl>
								<dt>CPU</dt>
								<dd>
									{environment.browser.extra?.stats?.cpu || "Not recorded"}
								</dd>
								<dt>Browser</dt>
								<dd>{environment.userAgent || "Not recorded"}</dd>
							</dl>
						</details>
					)}
				</footer>
			</section>
		</main>
	);
}
