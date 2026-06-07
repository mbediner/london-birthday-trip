import assert from "node:assert/strict";
import fs from "node:fs/promises";

const index = await fs.readFile("index.html", "utf8");
const app = await fs.readFile("app.js", "utf8");
const styles = await fs.readFile("styles.css", "utf8");
const worker = await fs.readFile("sw.js", "utf8");
const manifest = JSON.parse(await fs.readFile("site.webmanifest", "utf8"));

assert.match(index, /<link rel="manifest" href="site\.webmanifest">/, "index should expose the PWA manifest");
assert.match(index, /assets\/london_eye\.webp/, "index should preload the optimized hero image");
assert.match(index, /data-install-app/, "index should include an install control");
assert.match(app, /serviceWorker\.register\("sw\.js"\)/, "app should register the service worker");
assert.match(app, /imageWebp/, "app should define optimized day image sources");
assert.match(app, /<picture>/, "day cards should render picture elements with WebP sources");
assert.match(app, /renderDepartureGuard/, "app should render departure guardrails");
assert.match(app, /flightReadiness/, "app should define per-flight readiness checklists");
assert.match(app, /renderInlineChecklist/, "app should render saved inline checklists");
assert.match(app, /flightReady:b6-/, "flight readiness checklist keys should be namespaced per flight");
assert.match(app, /nextMoveTimeline/, "app should define date-aware next-step guidance");
assert.match(app, /renderNextMove/, "app should render date-aware next-step guidance");
assert.match(app, /routeShortcuts/, "app should define one-tap direction shortcuts");
assert.match(app, /directionsUrl/, "app should build Google Maps direction URLs");
assert.match(app, /emergencyContacts/, "app should define emergency contact cards");
assert.match(app, /recoveryPlans/, "app should define lost-item recovery plans");
assert.match(app, /renderRecovery/, "app should render lost-item recovery guidance");
assert.match(styles, /\.departure-grid/, "departure guardrail styles should exist");
assert.match(styles, /\.flight-readiness/, "flight readiness styles should exist");
assert.match(styles, /\.next-move-card/, "next-step guidance styles should exist");
assert.match(styles, /\.route-shortcut/, "route shortcut styles should exist");
assert.match(styles, /\.recovery-card/, "recovery card styles should exist");
assert.match(styles, /image-set\(url\("assets\/london_eye\.webp"\)/, "hero should use optimized image-set source");
assert.match(index, /id="nextMovePanel"/, "index should include the next-step panel");
assert.match(index, /id="routeShortcutList"/, "index should include route shortcuts");
assert.match(index, /id="recoveryPanel"/, "index should include recovery guidance");
assert.match(worker, /networkFirst\(event\.request\)/, "flight status should use network-first caching");
assert.match(worker, /cacheFirst\(event\.request\)/, "static shell should use cache-first caching");
assert.equal(manifest.display, "standalone", "manifest should install as a standalone app");
assert.equal(manifest.start_url, "./", "manifest should start at the site root");

for (const file of [
  "assets/icon.svg",
  "assets/london_eye.jpg",
  "assets/london_eye.webp",
  "assets/tower_bridge.jpg",
  "assets/tower_bridge.webp",
  "assets/camden_market.jpg",
  "assets/camden_market.webp",
  "assets/flight_itinerary.jpg",
  "assets/booking_confirmation.jpg",
  "data/flight-status.json"
]) {
  await fs.access(file);
}

console.log("Site resilience QA passed.");
