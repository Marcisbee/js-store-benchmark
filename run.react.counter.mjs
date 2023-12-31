// @ts-check
import { run } from "./run.mjs";

await run({
	suite: "React Counter",
	entryPoints: [
		"./react/counter/src/use-state.tsx",
		"./react/counter/src/use-reducer.tsx",
		"./react/counter/src/use-context.tsx",
		"./react/counter/src/use-sync-external-store.tsx",
		"./react/counter/src/exome.tsx",
		"./react/counter/src/redux.tsx",
		"./react/counter/src/mobx.tsx",
		"./react/counter/src/jotai.tsx",
		"./react/counter/src/preact-signals.tsx",
		"./react/counter/src/recoil.tsx",
		"./react/counter/src/redux-toolkit.tsx",
		"./react/counter/src/trashly.tsx",
		"./react/counter/src/valtio.tsx",
		"./react/counter/src/pullstate.tsx",
		"./react/counter/src/constate.tsx",
		"./react/counter/src/remini.tsx",
		"./react/counter/src/signia.tsx",
		"./react/counter/src/zustand.tsx",
		"./react/counter/src/use-change.tsx",
		"./react/counter/src/react-easy-state.tsx",
		"./react/counter/src/effector.tsx",
		"./react/counter/src/storeon.tsx",
		"./react/counter/src/nanostores.tsx",
		"./react/counter/src/xstate.tsx",
		"./react/counter/src/simpler-state.tsx",
		"./react/counter/src/resso.tsx",
		"./react/counter/src/tanstack-store.tsx",
		// @TODO figure out why this test never resolves `elementUpdatedTo()`
		// "./react/counter/src/impact-app.tsx",
		// @TODO figure out why these are not interactive at mount time
		// "./react/counter/src/superstate.tsx",
		// "./react/counter/src/teaful.tsx",
		// "./react/counter/src/ripple.tsx",
	],
	outdir: "./react/counter/dist",
	runPath: "react/counter/index.mjs",
	manual: false,
});
