# js-store-benchmark
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```sh
use-state .............. 137.0 ms/ops ±0.9 | 166.4 KB
use-reducer ............ 137.8 ms/ops ±3.5 | 166.4 KB
use-context ............ 141.6 ms/ops ±2.5 | 166.6 KB
exome-v2.3.3 ........... 142.0 ms/ops ±3.4 | 168.0 KB
constate-v3.3.2 ........ 143.6 ms/ops ±4.8 | 167.7 KB
use-sync-external-store  146.2 ms/ops ±1.1 | 166.5 KB
remini-v1.3.0 .......... 147.7 ms/ops ±3.5 | 172.4 KB
tanstack-store-v0.1.3 .. 149.2 ms/ops ±1.2 | 170.0 KB
simpler-state-v1.2.1 ... 149.4 ms/ops ±1.7 | 169.8 KB
nanostores-v0.8.1 ...... 149.8 ms/ops ±3.4 | 168.5 KB
storeon-v3.1.5 ......... 150.3 ms/ops ±22.4 | 167.5 KB
zustand-v4.4.3 ......... 150.9 ms/ops ±1.2 | 170.1 KB
signia-v0.1.4 .......... 153.4 ms/ops ±2.6 | 173.7 KB
react-easy-state-v6.3.0  153.9 ms/ops ±1.0 | 177.3 KB
use-change-v1.2.1 ...... 154.9 ms/ops ±1.2 | 171.8 KB
redux-v4.2.1 ........... 157.4 ms/ops ±1.0 | 181.1 KB
preact-signals-v1.3.6 .. 158.1 ms/ops ±7.4 | 175.4 KB
effector-v22.8.7 ....... 158.5 ms/ops ±2.3 | 183.3 KB
mobx-v6.10.2 ........... 158.6 ms/ops ±1.2 | 237.1 KB
trashly-v0.1.6 ......... 160.0 ms/ops ±1.1 | 194.1 KB
pullstate-v1.25.0 ...... 166.4 ms/ops ±1.5 | 187.9 KB
jotai-v1.13.1 .......... 169.0 ms/ops ±2.3 | 175.5 KB
valtio-v1.11.2 ......... 179.0 ms/ops ±1.3 | 174.8 KB
redux-toolkit-v1.9.7 ... 179.3 ms/ops ±1.9 | 208.9 KB
recoil-v0.7.7 .......... 182.0 ms/ops ±2.0 | 256.3 KB
resso-v0.14.0 .......... 190.8 ms/ops ±3.8 | 168.7 KB
xstate-v4.38.2 ......... 202.4 ms/ops ±1.6 | 238.8 KB
```

2. Triggered increment action and updated component view
```sh
exome-v2.3.3 ......... 69.9 ms/ops ±1.2 | 168.9 KB
signia-v0.1.4 ........ 74.0 ms/ops ±0.4 | 174.4 KB
simpler-state-v1.2.1 . 74.0 ms/ops ±0.7 | 170.5 KB
nanostores-v0.8.1 .... 74.2 ms/ops ±0.7 | 169.2 KB
preact-signals-v1.3.6  78.5 ms/ops ±7.8 | 176.1 KB
recoil-v0.7.7 ........ 90.1 ms/ops ±9.0 | 257.1 KB
jotai-v1.13.1 ........ 90.2 ms/ops ±0.9 | 176.3 KB
redux-v4.2.1 ......... 869.2 ms/ops ±12.4 | 181.9 KB
mobx-v6.10.2 ......... 887.7 ms/ops ±15.8 | 237.9 KB
redux-toolkit-v1.9.7 . 913.1 ms/ops ±39.2 | 209.7 KB
trashly-v0.1.6 ....... 994.1 ms/ops ±15.2 | 194.8 KB
valtio-v1.11.2 ....... 3689.9 ms/ops ±65.4 | 175.6 KB
```

<!-- _Note: **Less is better**_ -->

Benchmarks are run on `darwin 23.0.0, Apple M1 (8 core) arm64`

I know counter doesn't really show real world app performance, but I didn't want to waste much time re-creating real world app for each state so this will have to do.

# Running benchmarks
There's a cli to run and return results. Tests run on top of `tachometer` library from Google via Chromium in browser environment.

Before starting, make sure you're in `/benchmark` directory.

To prepare dependencies, run:
```
npm install
```

And to run tests:
```
node run.react.counter.mjs
node run.react.fields.mjs
```
