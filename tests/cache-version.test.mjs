import test from "node:test";
import assert from "node:assert/strict";

import {
  applyCacheTokenToIndex,
  applyCacheTokenToWorker,
  buildCacheToken
} from "../tools/cache-version.mjs";

test("buildCacheToken returns a compact release token", () => {
  const token = buildCacheToken(new Date("2026-06-08T21:57:44.000Z"));
  assert.equal(token, "202606082157");
});

test("applyCacheTokenToIndex updates both asset query strings", () => {
  const input = '<link rel="stylesheet" href="styles.css?v=old"><script type="module" src="app.js?v=old"></script>';
  const output = applyCacheTokenToIndex(input, "202606082157");
  assert.match(output, /styles\.css\?v=202606082157/);
  assert.match(output, /app\.js\?v=202606082157/);
});

test("applyCacheTokenToWorker updates the cache name and cached asset URLs", () => {
  const input = `const CACHE_NAME = "london-trip-vold";\n"./styles.css?v=old",\n"./app.js?v=old"`;
  const output = applyCacheTokenToWorker(input, "202606082157");
  assert.match(output, /london-trip-v202606082157/);
  assert.match(output, /\.\/styles\.css\?v=202606082157/);
  assert.match(output, /\.\/app\.js\?v=202606082157/);
});
