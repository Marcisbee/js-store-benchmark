# js-store-benchmark
I created a simple benchmark to get the gist of how this library performs.

Each update waits for committed DOM changes, including libraries that schedule updates asynchronously.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```sh
use-reducer ............ 137.2 ms/ops ±2.5 | 166.4 KB
use-state .............. 137.8 ms/ops ±2.3 | 166.4 KB
use-sync-external-store  142.5 ms/ops ±3.6 | 166.5 KB
constate-v3.3.2 ........ 142.5 ms/ops ±1.4 | 167.7 KB
use-context ............ 142.6 ms/ops ±2.6 | 166.6 KB
exome-v2.6.1 ........... 142.7 ms/ops ±4.8 | 168.2 KB
storeon-v3.1.5 ......... 145.4 ms/ops ±2.1 | 167.5 KB
nanostores-v0.8.1 ...... 145.8 ms/ops ±3.0 | 168.5 KB
zustand-v4.4.3 ......... 146.8 ms/ops ±1.9 | 170.1 KB
simpler-state-v1.2.1 ... 147.6 ms/ops ±1.0 | 169.8 KB
remini-v1.3.0 .......... 147.7 ms/ops ±1.9 | 172.4 KB
tanstack-store-v0.1.3 .. 148.1 ms/ops ±2.9 | 170.0 KB
use-change-v1.2.1 ...... 150.7 ms/ops ±2.7 | 171.8 KB
preact-signals-v1.3.6 .. 152.4 ms/ops ±4.9 | 175.4 KB
signia-v0.1.4 .......... 152.8 ms/ops ±4.3 | 173.7 KB
effector-v22.8.7 ....... 153.0 ms/ops ±2.9 | 183.3 KB
redux-v4.2.1 ........... 156.7 ms/ops ±5.3 | 181.1 KB
react-easy-state-v6.3.0  157.2 ms/ops ±2.5 | 177.3 KB
mobx-v6.10.2 ........... 157.7 ms/ops ±9.2 | 237.1 KB
trashly-v0.1.6 ......... 159.3 ms/ops ±5.0 | 194.1 KB
pullstate-v1.25.0 ...... 163.4 ms/ops ±2.4 | 187.9 KB
jotai-v1.13.1 .......... 169.8 ms/ops ±4.0 | 175.5 KB
redux-toolkit-v1.9.7 ... 174.4 ms/ops ±3.5 | 208.9 KB
valtio-v1.11.2 ......... 176.8 ms/ops ±2.9 | 174.8 KB
recoil-v0.7.7 .......... 185.3 ms/ops ±7.3 | 256.3 KB
resso-v0.14.0 .......... 192.6 ms/ops ±1.6 | 168.7 KB
xstate-v4.38.2 ......... 205.0 ms/ops ±2.2 | 238.8 KB
```

2. Triggered increment action and updated component view
```sh
exome-v2.6.1 ......... 76.0 ms/ops ±1.7 | 169.0 KB
signia-v0.1.4 ........ 79.3 ms/ops ±0.9 | 174.4 KB
simpler-state-v1.2.1 . 79.7 ms/ops ±1.2 | 170.5 KB
nanostores-v0.8.1 .... 80.0 ms/ops ±3.4 | 169.2 KB
preact-signals-v1.3.6  80.4 ms/ops ±0.9 | 176.1 KB
recoil-v0.7.7 ........ 91.9 ms/ops ±4.7 | 257.1 KB
jotai-v1.13.1 ........ 97.0 ms/ops ±1.2 | 176.3 KB
redux-v4.2.1 ......... 890.1 ms/ops ±52.6 | 181.9 KB
mobx-v6.10.2 ......... 907.8 ms/ops ±50.6 | 237.9 KB
redux-toolkit-v1.9.7 . 934.3 ms/ops ±71.0 | 209.7 KB
trashly-v0.1.6 ....... 1027.0 ms/ops ±47.3 | 194.8 KB
valtio-v1.11.2 ....... 3824.6 ms/ops ±36.6 | 175.6 KB
```

<!-- _Note: **Less is better**_ -->

Benchmarks are run on `darwin 24.1.0, Apple M1 (8 core) arm64`

Task workspace is now the default comparison. Counter and Fields remain smaller diagnostic workloads.

# Running benchmarks
There's a cli to run and return results. Tests run on top of `tachometer` library from Google via Chromium in browser environment.

Run commands from the repository root with Node.js 22 or newer and Chrome installed.

To prepare dependencies, run:
```
npm ci
```

And to run tests:
```
node run.react.workspace.mjs
node run.react.counter.mjs
node run.react.fields.mjs
```

## Current targets and verification

Use Node.js 22 or newer and an installed Chrome/Chromium browser. Install the
locked dependencies with `npm ci`, then run `npm test` before collecting timings.
Selenium Manager obtains a driver matching the installed browser on first use;
that first run needs network access. Set `CHROME_BIN` to select another Chrome
binary.

All suites discover every `.tsx` target in their `src` directory, including
Impact, Superstate, Teaful, and Ripple. `npm test` builds the same production
bundles as the timing runner and checks all discovered workspace, counter and field targets in
Chrome. It requires each counter to reach 1,000 and each field target to commit
100 edits while preserving the other 999 fields. A stalled mount or update
fails with a deadline instead of leaving the benchmark waiting indefinitely.

`npm run bench:counter` and `npm run bench:fields` collect twenty measured samples
per target after warmup, with the existing 4× CPU throttling. They write dated
results under `results/`. Run them separately on an otherwise idle machine for
meaningful timings. The tables above are historical results, not results from
the updated targets or measurement harness.

Targets use the current stable library releases available when updated, with
React and React DOM fixed at 18.3.1 so every library shares the same runtime.
Signia React and Superstate still declare React 18 peers. Pullstate remains on
its latest stable 1.25.0 release; its `latest` npm tag points to a React 19-only
2.0 prerelease. Packages without newer releases remain at their published
versions. Exact target versions are recorded in `package.json` and
`package-lock.json`; npm is also used by the website deployment.

Preact Signals uses its explicit `useSignals` integration; XState uses v5 event
objects and context arguments; Resso uses `useStore` and its setter API. The
harness waits for mount subscriptions before timing interactions and verifies
committed input attributes without accessing React's private value tracker.
These measurement changes mean new timings should not be directly compared
with historical runs.

Build the results website with `npm run build`. Start its development server
with `node scripts/dev.mjs` (loopback port 8080, configurable with `PORT`).

## Measurement methodology (version 3)

New runs measure a complete batch of 1,000 counter increments or 100 edits to
one of 1,000 fields. Each operation waits for its committed DOM update. Initial state is validated
before the first operation and final state afterward. Field
adapters subscribe at field level so untouched fields do not rerender. Browser
verification checks this using the existing render timestamps.

Startup includes target module loading, parsing, evaluation, store initialization,
and mounting the initial DOM. This prevents module-scope stores from doing setup
outside the timer while hook/provider stores pay that cost inside it. The shared
workload module loads before the timer starts. The old fixed 10 ms field delay
has been removed; subscription settling happens after startup timing and before
interaction timing. Every timed run validates the final counter or all field
values outside the measured interval and rejects incorrect results.

Memory is total used JavaScript heap after garbage collection, not incremental
store memory. Transfer size includes the benchmark page and runtime. Results
include target versions, browser and CPU details, shared React version, source
revision, lockfile hash, sample count, and CPU throttle. Standard deviations
show run variation; small differences should not be treated as a ranking of
real-world application performance. Historical runs use different workloads,
adapters, hardware, and timing boundaries and are not directly comparable.

## Comparable workloads and target coverage

All targets use the same production React 18.3.1 build, root API, browser,
viewport, throttling, warmup and sample count. Counter adapters render one `h1`
starting at zero, handle 1,000 clicks through React, and commit every increment.
Field adapters render the same 1,000 controlled inputs and render timestamps;
100 distinct input events edit field 11, with a committed attribute update awaited
after each. All other values must remain unchanged. No adapter writes the DOM
itself, batches away intermediate updates, or receives special timing treatment.
Signals are read as values in React renders, rather than inserted as special
DOM-bound signal nodes. Update timing excludes initial/final validation.

Store shape follows the library's idioms: atoms can use one atom per field,
proxy libraries can use nested objects, and reducers can use immutable collections.
These are equivalent observable workloads, not identical internal algorithms.
Providers, subscription costs, immutability and mandatory library bookkeeping
remain part of the cost. Optional persistence and undo history are disabled
(Little State Machine and Liquorstore respectively); no network synchronization
is configured for SyncedStore. It still pays for its CRDT representation.

The counter suite has wider library coverage than the field suite. A missing field
adapter is not a zero result or a claim that the library cannot support fields.
Scores are equal-weight sums of normalized metrics, not statistical proof of a
winner. Compare raw metrics and their variation for the workload you care about.

The starred-repository selection and exclusions are documented in
[benchmark targets](BENCHMARKS.md). No framework, database, or custom React bridge
is substituted for a library's supported React integration.

## Security overrides

Trashly Core 0.1.6 depends on the unpatched standalone `lodash.set` package
([advisory](https://github.com/advisories/GHSA-p6mc-m468-83gw)). Its scoped npm
override uses `vendor/lodash-set`, a callable compatibility entry point for the
maintained `lodash/set.js` implementation. It does not change the Trashly adapter.
Data Transport 5.0.3 (used by Coaction) is scoped to UUID 11.1.1, which retains
CommonJS support and fixes the
[buffer bounds advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq).
Remove these overrides when the upstream packages adopt safe dependencies.
`npm test` checks both security regressions before running all browser targets.

## Task workspace (methodology version 5)

The default category is an in-memory issue tracker: 1,000 deterministic tasks
across 10 projects, eight assignees, five labels, three statuses and three nested
checklist items per task. It renders the first 50 matching tasks (or fewer if the
filter has fewer matches), a selected-task detail panel, filters and live counts.
There is no network activity, animation or virtualization in the workload.

Run `npm run bench:workspace` for 20 measured samples per adapter after warmup,
with the same 4× CPU throttle as the diagnostics. `node scripts/verify.mjs workspace`
checks this category alone. Workspace covers 67 of the 68 existing Counter adapters, including React
baselines. Superstate is excluded for a reproduced subscription-cleanup failure;
see the coverage notes below. A missing or excluded adapter is never a zero result.

Every adapter uses the same React view and immutable domain transitions. Native
hooks, selectors, derived atoms, observers, HOCs, render props and providers
handle subscriptions. Hook-only updaters are obtained inside their consuming
components. These implementations deliberately share the domain model; they do not claim
to be each library's optimal normalized or per-task store design. Alternate
idiomatic structures can be added while preserving the observable contract.

A run contains 21 sequential user actions: two title edits, one nested checklist
toggle, two status changes, one assignee change, four searches, four filter
changes, two sorts, one bulk update, one incoming batch and three selections.
Bulk updates complete the first 20 visible tasks in one action. The incoming
batch updates tasks 0–9 and 900–909; a subsequent search brings all incoming
records into view. Status and assignee changes run with matching filters active,
so the edited task leaves the list while the detail panel and counts update.
Selections unmount the old detail subscriber, mount the new one, edit it, and
return to an earlier task. Global status counts and the count assigned to Person
1 are displayed alongside the current matching count.

Startup includes module loading, store creation and initial DOM mount. Each
interaction starts immediately before its DOM event and ends at the mutation
observer callback that sees the complete expected DOM. If a partial commit is
observed, frame callbacks also check for completion: select-value property writes
do not emit mutation records. Ordinary complete commits need no frame wait. The callback timestamps
before checking the DOM; successful validation is excluded. Partial commits do
not end the timer. An independent oracle checks row identities/order, every
rendered task field, controls, checklist, selected detail and summary counts at
each checkpoint. Missing or stale updates time out and invalidate the run. The
browser verifier also suppresses a bulk action to prove no score is produced.
These are observed DOM-commit timings, not paint or input-to-next-paint measurements.

The Update measurement selector shows the sum for all interactions or one action
type. Counts in parentheses are occurrences per run; values are totals, not
per-event averages. The aggregate is the sum of those measured intervals,
excluding between-action oracle work. Startup, memory and transfer stay separate.
The score uses the displayed Update metric plus startup, memory and transfer.
Version 5 workspace scores are not comparable with diagnostic or historical scores.

To explore an adapter manually after building it, serve the repository and open
`/bench.html?bench=react/workspace/dist/zustand.mjs&run=react/workspace/index.mjs&manual=true`.
The results page starts on the newest date containing workspace data; older
dates without this category show an explicit empty state.

### Workspace coverage and exclusions

All existing Counter targets are accounted for: 67 runnable workspace adapters
and one explicit exclusion. Suite discovery rejects a newly added Counter target
unless Workspace has an adapter or a documented exclusion. `npm test` runs every
supported adapter and reruns the excluded adapter, requiring its documented
failure and verifying it cannot produce a score. If that failure disappears,
the check fails so the adapter can be reconsidered for inclusion.

| Excluded target | Reproduced limitation |
| --- | --- |
| Superstate (`@superstate/core` 0.1.0, `@superstate/react` 0.1.0) | Filtering unmounts multiple row subscriptions. Core unsubscribe callbacks retain array indexes; earlier removals shift those indexes, so subsequent cleanup removes still-mounted subscribers. The next status change leaves the selected detail stale. |

The runnable reproduction is in `react/workspace/unsupported/superstate.tsx`;
`unsupported.json` records the reason and expected DOM-validation failure.
It remains available in Counter, whose single subscriber does not exercise
this lifecycle. No custom subscription bridge or package patch hides the failure.

The wider cohort preserves the same data, actions, DOM and measurement boundaries.
Native integration differences remain measurable: SyncedStore applies the shared
transition through field writes in one Yjs transaction because shared Yjs objects
cannot be reparented into replacement arrays. Ripple serializes its proxy state
before applying the immutable reducer and uses its native replacement API;
serialization cost stays inside the timed interaction. Fluxx and Unistore use
native connector HOCs; Statty uses its native render-prop subscription. These
provide state through component-local React contexts to the common view.
Optional LiquorStore history and Little State Machine persistence remain disabled.
