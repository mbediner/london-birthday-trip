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
