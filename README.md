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

I know counter doesn't really show real world app performance, but I didn't want to waste much time re-creating real world app for each state so this will have to do.

# Running benchmarks
There's a cli to run and return results. Tests run on top of `tachometer` library from Google via Chromium in browser environment.

Run commands from the repository root with Node.js 22 or newer and Chrome installed.

To prepare dependencies, run:
```
npm ci
```

And to run tests:
```
node run.react.counter.mjs
node run.react.fields.mjs
```

## Current targets and verification

Use Node.js 22 or newer and an installed Chrome/Chromium browser. Install the
locked dependencies with `npm ci`, then run `npm test` before collecting timings.
Selenium Manager obtains a driver matching the installed browser on first use;
that first run needs network access. Set `CHROME_BIN` to select another Chrome
binary.

Both suites discover every `.tsx` target in their `src` directory, including
Impact, Superstate, Teaful, and Ripple. `npm test` builds the same production
bundles as the timing runner and checks all discovered counter and field targets in
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
