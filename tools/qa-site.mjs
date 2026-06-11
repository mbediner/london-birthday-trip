import assert from "node:assert/strict";
import fs from "node:fs/promises";

const index = await fs.readFile("index.html", "utf8");
const app = await fs.readFile("app.js", "utf8");
const styles = await fs.readFile("styles.css", "utf8");
const worker = await fs.readFile("sw.js", "utf8");
const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const manifest = JSON.parse(await fs.readFile("site.webmanifest", "utf8"));
const tripPushWorkflow = await fs.readFile(".github/workflows/trip-push-reminders.yml", "utf8");
const pushReminders = await fs.readFile("tools/update-trip-push-reminders.mjs", "utf8");

assert.match(index, /<link rel="manifest" href="site\.webmanifest">/, "index should expose the PWA manifest");
assert.match(index, /assets\/london_eye\.webp/, "index should preload the optimized hero image");
assert.match(index, /styles\.css\?v=\d+/, "index should include a cache-busted stylesheet URL");
assert.match(index, /app\.js\?v=\d+/, "index should include a cache-busted app URL");
assert.match(index, /data-target="overview"/, "index should start from the itinerary panel");
assert.match(index, /London (Birthday Trip|Travel Guide)/, "site should present itself as a travel guide");
assert.match(index, /<button class="nav-item is-active"[\s\S]*?data-target="overview"[\s\S]*?Guide[\s\S]*?<\/button>/, "primary bottom nav item should be the guide");
assert.match(index, /London Itinerary|Day-by-day guide|Itinerary first/, "guide should keep itinerary first");
assert.match(index, /id="appSetupPanel"/, "index should include the app setup panel");
assert.match(index, /id="hotelActionPanel"/, "index should include the move panel hotel actions");
assert.match(index, /class="nav-item is-active"|class="tab-button is-active"/, "index should include a default active nav item");
assert.match(app, /serviceWorker\.register\("sw\.js"\)/, "app should register the service worker");
assert.match(app, /appLinks/, "app should define install targets for required apps");
assert.match(app, /data-open-day/, "app should support opening itinerary pockets directly");
assert.match(app, /setActivePanel/, "app should switch between compartment panels");
assert.match(app, /renderPhonePush/, "app should render push notification setup guidance");
assert.match(app, /App Store.*iPhone|Download for iPhone/s, "app should provide iPhone install guidance");
assert.match(app, /Google Play.*Android|Download for Android/s, "app should provide Android install guidance");
assert.doesNotMatch(index, /data-enable-flight-alerts|Browser Alerts|photoModal|photo-reminder\.ics/, "site should not expose browser or calendar reminder controls");
assert.doesNotMatch(app, /Notification\.requestPermission|new Notification|maybeNotifyFlightStatus|openPhotoReminder|photoMission/, "app should not use browser notification reminders");
assert.match(tripPushWorkflow, /ntfy\.sh\/\$NTFY_TOPIC/, "trip reminders should send through ntfy phone push");
assert.match(tripPushWorkflow, /update-trip-push-reminders\.mjs/, "trip reminder workflow should generate due push reminders");
assert.match(app, /Walk hotel to Pimlico Station/, "app should expose direct hotel-to-tube walking guidance");
assert.match(app, /nextMoveTimeline/, "app should define date-aware next-step guidance");
assert.match(app, /routeShortcuts/, "app should define one-tap direction shortcuts");
assert.match(app, /buildDirectionsUrl/, "app should build Google Maps direction URLs through shared helpers");
assert.match(app, /sameTabTravelLink\(directionsUrl\(day\.launchRoute/, "primary itinerary route launches should not use popup/new-tab behavior");
assert.match(app, /sameTabTravelLink\(directionsUrl\(route\.from/, "route shortcut launches should not use popup/new-tab behavior");
assert.doesNotMatch(app, /Launch day route<\/a>[\s\S]{0,80}target="_blank"/, "Launch day route should stay in the same browser context");
assert.match(app, /emergencyContacts/, "app should define emergency contact cards");
assert.match(app, /recoveryPlans/, "app should define lost-item recovery plans");
assert.match(app, /resolvePanelFromHash/, "app should resolve panel routing from the hash");
assert.match(app, /assets\/parental-travel-consent-letter\.pdf/, "wallet should link to the parental travel consent PDF");
assert.match(app, /assets\/hotel-booking-confirmation\.pdf/, "wallet should link to the hotel Booking.com PDF");
assert.match(app, /assets\/big-bus-ticket\.pdf/, "wallet should link to the Big Bus ticket PDF");
assert.match(app, /buttonLabel.*Open (Bus Ticket|Letter)|Open (Bus Ticket|Letter).*buttonLabel/s, "prominent wallet documents should use buttonLabel for a big tap button");
assert.match(app, /ticket-item__btn/, "prominent wallet buttons should use ticket-item__btn class");
assert.match(app, /renderAppSetup/, "wallet should render the app setup and alerts section");
assert.match(pushReminders, /big-bus-activate-2026-06-26/, "push reminders should include Big Bus activation on June 26");
assert.doesNotMatch(app, /Download JetBlue app|Download Big Bus Tours app|Download TfL Go|Download ntfy|Download Uber/, "pre-trip checklist should not contain dead-end download wording");
assert.match(styles, /\.panel-view/, "styles should define compartment panels");
assert.match(styles, /\.bottom-nav|\.tab-bar/, "styles should define the section navigation");
assert.match(styles, /\.pocket-card/, "styles should define tucked-away pocket cards");
assert.match(styles, /\.route-pocket/, "styles should define direct route pockets");
assert.match(styles, /\.overview-grid/, "styles should define summary grids");
assert.match(styles, /\.ref-chip/, "styles should define the wallet confirmation code chip");
assert.match(styles, /\.setup-section/, "styles should define the app setup section layout");
assert.match(index, /id="routeShortcutList"/, "index should include route shortcuts");
assert.match(index, /id="tubeBasicsPanel"/, "move panel should include transit rules at the bottom");
assert.match(index, /id="recoveryPanel"/, "index should include recovery guidance");
assert.match(index, /id="appSetupPanel"/, "wallet should include the app setup mount");
assert.match(worker, /networkFirst\(event\.request\)/, "flight status should use network-first caching");
assert.match(worker, /cacheFirst\(event\.request\)/, "static shell should use cache-first caching");
assert.match(worker, /const CACHE_NAME = "london-trip-v\d+"/, "service worker cache name should change per release");
assert.match(worker, /"\.\/styles\.css\?v=\d+"/, "service worker should cache-bust styles");
assert.match(worker, /"\.\/app\.js\?v=\d+"/, "service worker should cache-bust the app shell");
assert.match(worker, /"\.\/assets\/big-bus-ticket\.pdf"/, "service worker should cache the Big Bus ticket PDF");
assert.match(worker, /"\.\/assets\/hotel-booking-confirmation\.pdf"/, "service worker should cache the hotel confirmation PDF");
assert.match(worker, /"\.\/assets\/parental-travel-consent-letter\.pdf"/, "service worker should cache the parental travel consent PDF");
assert.equal(manifest.display, "standalone", "manifest should install as a standalone app");
assert.equal(manifest.start_url, "./", "manifest should start at the site root");
assert.match(packageJson.scripts["release:prepare"], /bust-cache/, "package should define a cache-busting release prep script");

for (const file of [
  "assets/icon.svg",
  "assets/london_eye.jpg",
  "assets/london_eye.webp",
  "assets/tower_bridge.jpg",
  "assets/tower_bridge.webp",
  "assets/camden_market.jpg",
  "assets/camden_market.webp",
  "assets/flight_itinerary.jpg",
  "assets/big-bus-ticket.pdf",
  "assets/hotel-booking-confirmation.pdf",
  "assets/parental-travel-consent-letter.pdf",
  "data/flight-status.json"
]) {
  await fs.access(file);
}

console.log("Site resilience QA passed.");
