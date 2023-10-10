import "./livereload.ts";

import { results } from "@js-store-benchmark/results";
import { Exome } from "exome";
import { useStore } from "exome/react";
import { Suspense, useMemo, useState } from "react";

import { hexToColor, lerpMultipleColors } from "./utils/color-lerp.ts";
import { useSuspense } from "./utils/use-suspense.ts";

type ResultDataContent = Awaited<
	ReturnType<typeof results[string][number]["content"]>
>;

interface ResultData extends Omit<typeof results[string][number], "content"> {
	content: ResultDataContent;
}

class ResultsStore extends Exome {
	private fetchedResults: Record<string, ResultData[]> = {};
	public keys: string[] = Object.keys(results).sort(
		(a, b) => Number(b) - Number(a),
	);
	public active: string = this.keys[0];

	public async getResults(key: string) {
		const target = results[key];

		// There are no unresolved data
		if (!target.find(({ content }) => typeof content === "function")) {
			return target;
		}

		return (this.fetchedResults[key] = await Promise.all(
			target.map(async ({ content, ...rest }) => ({
				...rest,
				content: await content(),
			})),
		));
	}

	public setActive(active: ResultsStore["active"]) {
		this.active = active;
	}
}

const resultsStore = new ResultsStore();

// const getColor = lerpMultipleColors({
//   0: 0x63bf7c,
//   0.25: 0xffe883,
//   0.75: 0xfdc47d,
//   1: 0xf9696c,
// });

// const getColor = lerpMultipleColors({
//   0: 0xa8cf8c,
//   0.5: 0xffe699,
//   1: 0xf4b184,
// });

const getColor = lerpMultipleColors({
	0: 0x5cbd7f,
	0.5: 0xfde681,
	1: 0xf36c75,
});

function prepareData(data: ResultDataContent) {
	return (data || [])
		.map(([name, original]) => ({
			name,
			data: {
				performance: {
					data: original.performance.stats.mean,
					standardDeviation: original.performance.stats.standardDeviation,
				},
				startup: {
					data: original.startup.stats.mean,
					standardDeviation: original.performance.stats.standardDeviation,
				},
				memory: {
					data: original.memory.stats.mean,
					standardDeviation: original.performance.stats.standardDeviation,
				},
				size: {
					data: original.performance.result.bytesSent,
				},
			},
		}))
		.map((current, index, all) => {
			const performance = all
				.slice()
				.sort((a, b) => a.data.performance.data - b.data.performance.data);
			const startup = all
				.slice()
				.sort((a, b) => a.data.startup.data - b.data.startup.data);
			const memory = all
				.slice()
				.sort((a, b) => a.data.memory.data - b.data.memory.data);
			const size = all
				.slice()
				.sort((a, b) => a.data.size.data - b.data.size.data);

			current.min = {
				performance: performance[0].data.performance.data,
				startup: startup[0].data.startup.data,
				memory: memory[0].data.memory.data,
				size: size[0].data.size.data,
			};

			current.max = {
				performance: performance[performance.length - 1].data.performance.data,
				startup: startup[startup.length - 1].data.startup.data,
				memory: memory[memory.length - 1].data.memory.data,
				size: size[size.length - 1].data.size.data,
			};

			current.data.performance.score =
				current.data.performance.data / current.min.performance;
			current.data.startup.score =
				current.data.startup.data / current.min.startup;
			current.data.memory.score = current.data.memory.data / current.min.memory;
			current.data.size.score = current.data.size.data / current.min.size;

			current.data.score = {
				data: Object.values(current.data).reduce((acc, d) => acc + d.score, 0),
			};

			return current;
		})
		.map((current, index, all) => {
			const score = all
				.slice()
				.sort((a, b) => a.data.score.data - b.data.score.data);

			current.min.score = score[0].data.score.data;
			current.max.score = score[score.length - 1].data.score.data;

			return current;
		});
}

function Bench({
	data,
	details,
	format,
}: {
	data: Record<string, any>[];
	details: Record<string, React.ReactNode>;
	format: Record<string, (value: number) => string>;
}) {
	const [sortBy, setSortBy] = useState("score");

	const sortedDataCount = data
		.slice()
		.sort((a, b) => a.data[sortBy].data - b.data[sortBy].data);

	return (
		<table>
			<thead>
				<tr>
					<th style={{ width: 120 }}>Name</th>
					{sortedDataCount.map(({ name }) => (
						<th
							key={`n-${name}`}
							style={{
								backgroundColor: !/\-v\d+\.\d+\.\d+$/.test(name)
									? "#f0f0f0"
									: undefined,
								color: /^exome/.test(name) ? "blue" : undefined,
							}}
						>
							{name}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{Object.entries(details).map(([key, detail]) => (
					<tr key={`n-${key}`}>
						<td
							style={{
								width: 120,
								padding: 5,
								cursor: "pointer",
								fontWeight: sortBy === key ? "bold" : undefined,
							}}
							onClick={() => setSortBy(key)}
						>
							{detail || key || null}
						</td>

						{sortedDataCount.map(({ data, min, max, name }) => {
							const formatData = format[key] || ((v: number) => v.toFixed(1));
							const slowdown =
								1 - (1 / (min[key] - max[key])) * (data[key].data - max[key]);
							const backgroundColor = hexToColor(getColor(slowdown));

							return (
								<th key={`n-${key}-${name}`} style={{ backgroundColor }}>
									{formatData(data[key].data)}
									{data[key].standardDeviation != null && (
										<small style={{ opacity: 0.6 }}>
											{" ± "}
											{data[key].standardDeviation.toFixed(1)}
										</small>
									)}
									{data[key].score != null && (
										<>
											<br />
											<small style={{ opacity: 0.6 }}>
												({data[key].score.toFixed(2)})
											</small>
										</>
									)}
								</th>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}

function ResultsSelector() {
	const { active, setActive, keys } = useStore(resultsStore);

	return (
		<select
			value={active}
			onChange={(e) => {
				setActive(e.target.value);
			}}
		>
			{keys.map((key) => (
				<option key={`r-${key}`} value={key}>
					{key
						.split(/(^\d{0,4}|\d{0,2}$)/g)
						.filter(Boolean)
						.reverse()
						.join(".")}
				</option>
			))}
		</select>
	);
}

function Results() {
	const { active, getResults } = useStore(resultsStore);

	const data = useSuspense(() => getResults(active), [active]);
	const dataReactCounter = useMemo(
		() =>
			prepareData(
				data?.find(({ name, type }) => name === "counter" && type === "react")
					?.content as ResultDataContent,
			),
		[data],
	);
	const dataReactFields = useMemo(
		() =>
			prepareData(
				data?.find(({ name, type }) => name === "fields" && type === "react")
					?.content as ResultDataContent,
			),
		[data],
	);

	return (
		<div>
			User-Agent:{" "}
			{(data?.[0].content as any)?.[0]?.[1]?.performance?.result?.userAgent ||
				"unknown"}
			<hr />
			React
			<hr />
			<Bench
				details={{
					performance: (
						<>
							Performance
							<br />
							<small>Counting to 1000</small>
						</>
					),
					startup: (
						<>
							Startup
							<br />
							<small>Starting up and reading initial state</small>
						</>
					),
					memory: (
						<>
							Memory
							<br />
							<small>Memory usage in (kB)</small>
						</>
					),
					size: (
						<>
							Size
							<br />
							<small>Network size (kB)</small>
						</>
					),
					score: (
						<>
							Score
							<br />
							<small>Overall score</small>
						</>
					),
				}}
				format={{
					memory(value) {
						return (value / 1024 / 1024).toFixed(1);
					},
					size(value) {
						return (value / 1024).toFixed(1);
					},
				}}
				data={dataReactCounter}
			/>
			<hr />
			<Bench
				details={{
					performance: (
						<>
							Performance
							<br />
							<small>Rendering 1000 input fields and updating 10th</small>
						</>
					),
					startup: (
						<>
							Startup
							<br />
							<small>Starting up and reading initial state</small>
						</>
					),
					memory: (
						<>
							Memory
							<br />
							<small>Memory usage in (kB)</small>
						</>
					),
					size: (
						<>
							Size
							<br />
							<small>Network size (kB)</small>
						</>
					),
					score: (
						<>
							Score
							<br />
							<small>Overall score</small>
						</>
					),
				}}
				format={{
					memory(value) {
						return (value / 1024 / 1024).toFixed(1);
					},
					size(value) {
						return (value / 1024).toFixed(1);
					},
				}}
				data={dataReactFields}
			/>
		</div>
	);
}

export function App() {
	return (
		<div>
			<h1>JS Store Benchmark</h1>
			<h4>
				<a
					href="https://github.com/Marcisbee/js-store-benchmark"
					target="_blank"
					rel="noreferrer"
				>
					github
				</a>
			</h4>
			<ResultsSelector />
			<br />
			<Suspense fallback="Loading..">
				<Results />
			</Suspense>
		</div>
	);
}
