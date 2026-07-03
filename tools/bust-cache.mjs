// Cache-busting step of `release:prepare`. Stamps a fresh release token onto
// the ?v= query strings in index.html and onto the service worker's CACHE_NAME
// plus its cached asset URLs, so returning visitors pick up the new release.
// Pass a token as argv[2] to override the auto-generated timestamp.

import fs from "node:fs/promises";

import {
  applyCacheTokenToIndex,
  applyCacheTokenToWorker,
  buildCacheToken
} from "./cache-version.mjs";

const token = process.argv[2] || buildCacheToken();

const indexPath = new URL("../index.html", import.meta.url);
const workerPath = new URL("../sw.js", import.meta.url);

const [indexContent, workerContent] = await Promise.all([
  fs.readFile(indexPath, "utf8"),
  fs.readFile(workerPath, "utf8")
]);

const nextIndex = applyCacheTokenToIndex(indexContent, token);
const nextWorker = applyCacheTokenToWorker(workerContent, token);

await Promise.all([
  fs.writeFile(indexPath, nextIndex),
  fs.writeFile(workerPath, nextWorker)
]);

console.log(`Cache token updated to ${token}`);
