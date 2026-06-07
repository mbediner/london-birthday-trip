import assert from "node:assert/strict";
import fs from "node:fs/promises";

const index = await fs.readFile("index.html", "utf8");
const app = await fs.readFile("app.js", "utf8");
const styles = await fs.readFile("styles.css", "utf8");
const worker = await fs.readFile("sw.js", "utf8");
const manifest = JSON.parse(await fs.readFile("site.webmanifest", "utf8"));

assert.match(index, /<link rel="manifest" href="site\.webmanifest">/, "index should expose the PWA manifest");
assert.match(index, /data-install-app/, "index should include an install control");
assert.match(app, /serviceWorker\.register\("sw\.js"\)/, "app should register the service worker");
assert.match(app, /renderDepartureGuard/, "app should render departure guardrails");
assert.match(styles, /\.departure-grid/, "departure guardrail styles should exist");
assert.match(worker, /networkFirst\(event\.request\)/, "flight status should use network-first caching");
assert.match(worker, /cacheFirst\(event\.request\)/, "static shell should use cache-first caching");
assert.equal(manifest.display, "standalone", "manifest should install as a standalone app");
assert.equal(manifest.start_url, "./", "manifest should start at the site root");

for (const file of [
  "assets/icon.svg",
  "assets/london_eye.jpg",
  "assets/tower_bridge.jpg",
  "assets/camden_market.jpg",
  "assets/flight_itinerary.jpg",
  "assets/booking_confirmation.jpg",
  "data/flight-status.json"
]) {
  await fs.access(file);
}

console.log("Site resilience QA passed.");
