import * as React from "react";
import { createRoot } from "react-dom/client";
import { matching, visible, type State, type Action, type Task } from "./model";

const selected = (s: State) => s.selected;
const pageIds = (s: State) =>
	visible(s)
		.map((t) => t.id)
		.join(",");
const summaryText = (s: State) =>
	JSON.stringify({
		total: s.tasks.length,
		matching: matching(s).length,
		todo: s.tasks.filter((t) => t.status === "todo").length,
		doing: s.tasks.filter((t) => t.status === "doing").length,
		done: s.tasks.filter((t) => t.status === "done").length,
		assigned: s.tasks.filter((t) => t.assignee === 0).length,
	});
const queryValue = (s: State) => s.query;
const statusValue = (s: State) => s.status;
const assigneeValue = (s: State) => s.assignee;
const sortValue = (s: State) => s.sort;
type Selector = <T>(select: (state: State) => T) => T;
export function workspace(
	useSelect: Selector,
	dispatch: (action: Action) => void,
	wrap: (component: any) => any = React.memo,
) {
	const TaskContent = ({ task }: { task: Task }) => (
		<>
			<span data-field="title">{task.title}</span>
			<span data-field="project">Project {task.project + 1}</span>
			<span data-field="status">{task.status}</span>
			<span data-field="assignee">Person {task.assignee + 1}</span>
			<span data-field="labels">{task.labels.join(", ")}</span>
			<span data-field="checklist">
				{task.checklist.filter((i) => i.done).length}/3
			</span>
		</>
	);
	const Row = wrap(function Row({ id }: { id: number }) {
		const task = useSelect(React.useCallback((s: State) => s.tasks[id], [id]));
		return (
			<li data-task={id}>
				<button onClick={() => dispatch({ type: "select", value: id })}>
					Open {id + 1}
				</button>
				<TaskContent task={task} />
			</li>
		);
	});
	const Detail = wrap(function Detail({ id }: { id: number }) {
		const task = useSelect(React.useCallback((s: State) => s.tasks[id], [id]));
		return (
			<aside data-detail={id} aria-label="Task detail">
				<h2>Task detail</h2>
				<TaskContent task={task} />
				<label>
					Title
					<input
						data-control="edit"
						value={task.title}
						onChange={(e) => dispatch({ type: "edit", value: e.target.value })}
					/>
				</label>
				<label>
					Status
					<select
						data-control="status"
						value={task.status}
						onChange={(e) =>
							dispatch({ type: "status", value: e.target.value })
						}
					>
						{["todo", "doing", "done"].map((v) => (
							<option key={v}>{v}</option>
						))}
					</select>
				</label>
				<label>
					Assignee
					<select
						data-control="assignee"
						value={task.assignee}
						onChange={(e) =>
							dispatch({ type: "assignee", value: e.target.value })
						}
					>
						{Array.from({ length: 8 }, (_, i) => (
							<option key={i} value={i}>
								Person {i + 1}
							</option>
						))}
					</select>
				</label>
				{task.checklist.map((item, i) => (
					<label key={i}>
						<input
							data-check={i}
							type="checkbox"
							checked={item.done}
							onChange={() => dispatch({ type: "checklist", value: i })}
						/>
						{item.title}
					</label>
				))}
			</aside>
		);
	});
	const Selected = wrap(function Selected() {
		const id = useSelect(selected);
		return <Detail key={id} id={id} />;
	});
	const List = wrap(function List() {
		const ids = useSelect(pageIds);
		return (
			<ul aria-label="Tasks">
				{ids && ids.split(",").map((id) => <Row key={id} id={Number(id)} />)}
			</ul>
		);
	});
	const Summary = wrap(function Summary() {
		const summary = useSelect(summaryText);
		return (
			<output data-summary>
				{Object.entries(JSON.parse(summary)).map(([key, value]) => (
					<span key={key} data-count={key}>
						{key}: {String(value)}
					</span>
				))}
			</output>
		);
	});
	const Controls = wrap(function Controls() {
		const query = useSelect(queryValue),
			status = useSelect(statusValue),
			assignee = useSelect(assigneeValue),
			sort = useSelect(sortValue);
		return (
			<nav aria-label="Task filters">
				<label>
					Search
					<input
						data-control="query"
						value={query}
						onChange={(e) => dispatch({ type: "query", value: e.target.value })}
					/>
				</label>
				<label>
					Status filter
					<select
						data-control="filterStatus"
						value={status}
						onChange={(e) =>
							dispatch({ type: "filterStatus", value: e.target.value })
						}
					>
						<option value="">All statuses</option>
						{["todo", "doing", "done"].map((v) => (
							<option key={v}>{v}</option>
						))}
					</select>
				</label>
				<label>
					Assignee filter
					<select
						data-control="filterAssignee"
						value={assignee}
						onChange={(e) =>
							dispatch({ type: "filterAssignee", value: e.target.value })
						}
					>
						<option value="">All assignees</option>
						{Array.from({ length: 8 }, (_, i) => (
							<option key={i} value={i}>
								Person {i + 1}
							</option>
						))}
					</select>
				</label>
				<label>
					Sort
					<select
						data-control="sort"
						value={sort}
						onChange={(e) => dispatch({ type: "sort", value: e.target.value })}
					>
						<option value="id">Task number</option>
						<option value="title">Title</option>
						<option value="reverse">Newest first</option>
					</select>
				</label>
				<button data-action="bulk" onClick={() => dispatch({ type: "bulk" })}>
					Complete first 20
				</button>
				<button
					data-action="incoming"
					onClick={() => dispatch({ type: "incoming" })}
				>
					Apply incoming batch
				</button>
			</nav>
		);
	});
	return function Workspace() {
		return (
			<main className="workspace">
				<style>{`.workspace{font:14px/1.5 system-ui;max-width:1200px;margin:auto;color:#202124}.workspace nav{display:flex;flex-wrap:wrap;gap:12px}.workspace label{display:block}.workspace input,.workspace select,.workspace button{font:inherit}.workspace output{display:flex;gap:16px;margin:16px 0;flex-wrap:wrap}.workspace .panels{display:grid;grid-template-columns:minmax(0,2fr) minmax(220px,1fr);gap:24px}.workspace ul{padding:0;margin:0;list-style:none;max-height:600px;overflow:auto}.workspace li{display:flex;flex-wrap:wrap;gap:8px;padding:8px;border-bottom:1px solid #ddd}.workspace [data-field=title]{font-weight:600}.workspace aside [data-field]{display:block}.workspace aside label{margin-top:12px}.workspace button{cursor:pointer}@media(max-width:650px){.workspace .panels{grid-template-columns:1fr}}`}</style>
				<h1>Task workspace</h1>
				<p>1,000 tasks · 10 projects · 50 rows per page</p>
				<Controls />
				<Summary />
				<div className="panels">
					<List />
					<Selected />
				</div>
			</main>
		);
	};
}
export function mount(App: React.ComponentType) {
	return (target: HTMLElement) =>
		new Promise<void>((resolve) => {
			function Ready() {
				React.useEffect(() => resolve(), []);
				return <App />;
			}
			createRoot(target).render(<Ready />);
		});
}
