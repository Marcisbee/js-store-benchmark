import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const trashlyRequire = createRequire(require.resolve("trashly-core"));
const transportRequire = createRequire(require.resolve("data-transport"));
const set = trashlyRequire("lodash.set");
const uuid = transportRequire("uuid");

test("Trashly's setter preserves nested paths without polluting prototypes", () => {
  const state = {};
  assert.equal(set(state, "fields[0].value", "updated"), state);
  assert.deepEqual(state, { fields: [{ value: "updated" }] });
  for (const path of ["__proto__.benchmarkPolluted", "constructor.prototype.benchmarkPolluted"]) {
    try {
      set({}, path, true);
      assert.equal({}.benchmarkPolluted, undefined);
    } finally {
      delete Object.prototype.benchmarkPolluted;
    }
  }
});

for (const version of ["v3", "v5"]) {
  test(`Transport's UUID ${version} rejects undersized buffers`, () => {
    const namespace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    assert.throws(() => uuid[version]("benchmark", namespace, new Uint8Array(8)), RangeError);
    const buffer = new Uint8Array(16);
    assert.equal(uuid[version]("benchmark", namespace, buffer), buffer);
    assert.equal(uuid.stringify(buffer), uuid[version]("benchmark", namespace));
  });
}
