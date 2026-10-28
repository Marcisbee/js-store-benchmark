# Benchmark targets

Reviewed the 4,097 public repositories starred by Marcisbee on 28 October 2026.
The additions below have published packages and React integrations that run on
the shared React 18 runtime. Package versions are pinned in the lockfile; each
adapter exports the actual package metadata used for its result.

## Added from starred repositories

| Library | Workloads |
| --- | --- |
| [bit-about-state](https://github.com/oleystack/state) | Counter |
| [coaction](https://github.com/coactionjs/coaction) | Counter |
| [compostate](https://github.com/lxsmnsyc/compostate) | Counter |
| [easy-peasy](https://github.com/ctrlplusb/easy-peasy) | Counter |
| [effect-atom](https://github.com/tim-smart/effect-atom) | Counter and fields |
| [expressive](https://github.com/gabeklein/expressive-mvc) | Counter |
| [flooks](https://github.com/nanxiaobei/flooks) | Counter |
| [fluxx](https://github.com/AlexGalays/fluxx) | Counter |
| [hox](https://github.com/umijs/hox) | Counter |
| [legend-state](https://github.com/LegendApp/legend-state) | Counter and fields |
| [liquorstore](https://github.com/steveruizok/liquorstore) | Counter |
| [little-state-machine](https://github.com/bluebill1049/little-state-machine) | Counter |
| [onek](https://github.com/zheksoon/onek) | Counter and fields |
| [origami](https://github.com/azee-rajput/origami-state-manager) | Counter and fields |
| [react-hooks-global-state](https://github.com/dai-shi/react-hooks-global-state) | Counter |
| [react-signals-app](https://github.com/betula/react-signals-app) | Counter |
| [react-tracked](https://github.com/dai-shi/react-tracked) | Counter |
| [react-xs](https://github.com/linq2js/react-xs) | Counter and fields |
| [realar](https://github.com/realar-project/realar) | Counter and fields |
| [reatom](https://github.com/reatom/reatom) | Counter and fields |
| [rebloom](https://github.com/finom/rebloom) | Counter and fields |
| [redux-zero](https://github.com/redux-zero/redux-zero) | Counter |
| [rematch](https://github.com/rematch/rematch) | Counter |
| [simplestack](https://github.com/bholmesdev/simplestack-store) | Counter and fields |
| [simplux](https://github.com/MrWolfZ/simplux) | Counter |
| [state-ref](https://github.com/superlucky84/state-ref) | Counter |
| [stated-library](https://github.com/bradfordlemley/stated-library) | Counter |
| [statofu](https://github.com/statofu/statofu) | Counter |
| [statty](https://github.com/vesparny/statty) | Counter |
| [statux](https://github.com/franciscop/statux) | Counter |
| [swr-global-state](https://github.com/gadingnst/swr-global-state) | Counter |
| [syncedstore](https://github.com/YousefED/SyncedStore) | Counter |
| [unistore](https://github.com/developit/unistore) | Counter |
| [unstated-next](https://github.com/jamiebuilds/unstated-next) | Counter |
| [use-mutative](https://github.com/mutativejs/use-mutative) | Counter |
| [wana](https://github.com/alloc/wana) | Counter |
| [wire](https://github.com/wire-ts/wire) | Counter |

Zustand also gains a field workload. Existing adapters were reviewed for identical
initial values, DOM shape, event count, committed updates, production mode and
measurement boundaries. Startup now includes module initialization for every
adapter; see the README for the complete methodology.

## Candidates outside this run

| Candidate | Reason |
| --- | --- |
| Signalium 4.0.2, TinyBase 10.0.1 | Current releases require React 19. |
| Atomic State 1.0.2, Restater 0.0.12, use-immutable 0.3.0 | Published React peers exclude React 18. |
| State Designer 3.0.0 | Published React DOM peer excludes React 18. |
| Concave 0.2.0 | React 18 release-candidate API and React 17 type peer; not a supported match for this shared dependency tree. |
| EthanStandel/deepsignal 4.1.0 | Requires Preact Signals React 1.x; this suite uses 3.12.0. The unrelated `deepsignal` npm package is not substituted. |
| Awai, Groundstate | Published React packages are alpha/beta; this run uses stable releases. |
| use-atom, jotai-signal | Jotai integration variants; Jotai itself is included, rather than treating wrappers as independent stores. |
| Nori Store 2.1.5 | Current package exports the vanilla store but no React hook; README's older hook is not in the package. |
| Alien Signals, nano-signals, mini-signals, trkl, usignal, signal-polyfill, spred, RxJS, flyd, hyperactiv, maverick/signals, cont-signal, quel | Reactive primitives without the React integration used by this suite; a handwritten bridge would measure our adapter as well as the library. |
| MiniRx, rxjs-state, state-containers, mosx, thor-event, Kel, kossnocorp/superstate | Framework-neutral or other-framework APIs; no native React adapter added here. |
| onli-reducer, Structura, object-state-history, use-travel, zundo | Reducer, immutable-update or history utilities; not separate general-purpose React stores in this comparison. |
| DriftJS, realmorg/realm, littlebag, Fict, Qyavix, Lithent, TargetJS, Revolt, obsx, Reef, Signalize, ResonantJS, LemonadeJS, Rimmel, Pota, Hywer, Atomico, Voby/Oby, Bau, Van, Hydroxide, Sinuous | Alternative rendering frameworks; substituting their renderers would change the workload. |
| LiveStore, WarpDrive, SignalDB, nanostores/sql, PGlite, SQLSync, remote-storage | Database, persistence or synchronization-focused systems; this is an in-memory React state workload. |
| TanStack Query, reactish-query, nuqs, React Hook Form, Zag, nice-modal-react, boardgame.io | Specialized query, URL, form, component or game-state workloads are not exercised by these two suites. |

These exclusions describe the scope of this run, not claims about performance or
quality. In particular, vanilla signal benchmarks and React 19 comparisons need
separate cohorts, not mixed rankings under this React 18 table.
