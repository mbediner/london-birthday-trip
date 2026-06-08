// Shared cache-version helpers used by the release prep script and unit tests.

export function buildCacheToken(date = new Date()) {
  return date.toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);
}

export function applyCacheTokenToIndex(indexContent, token) {
  let next = indexContent.replace(/styles\.css\?v=[^"]+/g, `styles.css?v=${token}`);
  next = next.replace(/app\.js\?v=[^"]+/g, `app.js?v=${token}`);
  return next;
}

export function applyCacheTokenToWorker(workerContent, token) {
  let next = workerContent.replace(/const CACHE_NAME = "london-trip-v[^"]+";/, `const CACHE_NAME = "london-trip-v${token}";`);
  next = next.replace(/"\.\/styles\.css\?v=[^"]+"/g, `"./styles.css?v=${token}"`);
  next = next.replace(/"\.\/app\.js\?v=[^"]+"/g, `"./app.js?v=${token}"`);
  return next;
}
