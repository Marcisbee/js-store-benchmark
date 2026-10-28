import { run } from "./run.mjs";
import { getSuite } from "./suites.mjs";
await run(getSuite("workspace"));
