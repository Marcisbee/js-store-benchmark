# js-store-benchmark
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

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
