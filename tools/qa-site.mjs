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
assert.match(index, /data-target="wallet"[\s\S]*?Wallet[\s\S]*?<\/button>/, "bottom nav should label the documents section as Wallet");
assert.match(index, /London Itinerary|Day-by-day guide|Itinerary first/, "guide should keep itinerary first");
assert.match(index, /id="hotelActionPanel"/, "index should include the move panel hotel actions");
assert.doesNotMatch(index, /docsProgressBar/, "wallet should not show the pre-trip missing-items progress block");
assert.match(index, /class="nav-item is-active"|class="tab-button is-active"/, "index should include a default active nav item");
assert.match(app, /serviceWorker\.register\("sw\.js"\)/, "app should register the service worker");
assert.match(app, /appLinks/, "app should define install targets for required apps");
assert.match(app, /data-open-day/, "app should support opening itinerary pockets directly");
assert.match(app, /setActivePanel/, "app should switch between compartment panels");
assert.match(app, /Day snapshot/, "guide day cards should include a quick daily flow snapshot");
assert.match(app, /day\.snapshot\.path/, "guide day snapshots should render the planned stop path");
assert.match(app, /renderSnapshotStop/, "guide day snapshot stops should render as map targets");
assert.doesNotMatch(index, /todaySummary|Essentials/, "guide home should stay itinerary-only");
assert.doesNotMatch(index, /Pre-Trip|Download Apps|App Setup|Pre-Trip Checklist|Packing List|data-enable-flight-alerts|Browser Alerts|photoModal|photo-reminder\.ics/, "site should not expose completed pre-trip setup/checklist sections");
assert.doesNotMatch(app, /Notification\.requestPermission|new Notification|maybeNotifyFlightStatus|openPhotoReminder|photoMission|beforeinstallprompt|data-install-app|renderPhonePush|renderAppSetup|renderChecklist|renderInlineChecklist|appDownloads|Install ntfy before travel|Works offline|Finish the phone setup|Download Apps|Pre-Trip Checklist|Packing List/, "app should not use browser notification reminders or stale install/checklist prompts");
assert.match(tripPushWorkflow, /ntfy\.sh\/\$NTFY_TOPIC/, "trip reminders should send through ntfy phone push");
assert.match(tripPushWorkflow, /update-trip-push-reminders\.mjs/, "trip reminder workflow should generate due push reminders");
assert.match(app, /Walk hotel to Pimlico Station/, "app should expose direct hotel-to-tube walking guidance");
assert.match(app, /routeShortcuts/, "app should define one-tap direction shortcuts");
assert.match(app, /buildDirectionsUrl/, "app should build Google Maps direction URLs through shared helpers");
assert.doesNotMatch(app, /Best next tap|Start with directions, not reading|day-command-card/, "guide day cards should not show the confusing best-next-tap card");
assert.match(app, /sameTabTravelLink\(directionsUrl\(route\.from/, "route shortcut launches should not use popup/new-tab behavior");
assert.doesNotMatch(app, /Launch day route<\/a>[\s\S]{0,80}target="_blank"/, "Launch day route should stay in the same browser context");
assert.match(app, /emergencyContacts/, "app should define emergency contact cards");
assert.match(app, /recoveryPlans/, "app should define lost-item recovery plans");
assert.match(app, /resolvePanelFromHash/, "app should resolve panel routing from the hash");
assert.match(app, /assets\/parental-travel-consent-letter\.pdf/, "wallet should link to the parental travel consent PDF");
assert.match(app, /assets\/hotel-booking-confirmation\.pdf/, "wallet should link to the hotel Booking.com PDF");
assert.match(app, /assets\/big-bus-ticket\.pdf/, "wallet should link to the Big Bus ticket PDF");
assert.match(app, /Heathrow Fast Track Departures/, "flights should include the Heathrow Fast Track booking");
assert.match(app, /AHA2OC/, "Heathrow Fast Track booking reference should be present");
assert.match(app, /9:30-10:30 AM/, "Heathrow Fast Track should show the booked one-hour window");
assert.doesNotMatch(app, /9:00-10:00 AM one-hour window|Photos and fallbacks|day\.photo|day\.tired|day\.rain/, "guide should not render old fallback pocket or stale Fast Track window");
assert.match(app, /Plan to arrive at Terminal 2 around 8:45 AM/, "Heathrow Fast Track should show the Terminal 2 arrival target");
assert.match(app, /own security entrance next to the main security entrances/, "Heathrow Fast Track should explain the Terminal 2 security entrance");
assert.match(app, /passport control eGates/, "arrival guide should include Heathrow passport control eGate guidance");
assert.match(app, /assets\/heathrow-fast-track-confirmation\.pdf/, "wallet should link to the Heathrow Fast Track PDF");
assert.match(app, /Booking\.com confirmation \$\{booking\.confirmation\}/, "hotel pocket should show the Booking.com confirmation number");
assert.match(app, /Open confirmation PDF/, "hotel pocket should expose a direct confirmation PDF button");
assert.match(app, /person: "Tiffany"[\s\S]*reference: "2021-2606-1655-7845"/, "flights should include Tiffany UK ETA data");
assert.match(app, /person: "Collin"[\s\S]*reference: "2021-2606-1009-0807"/, "flights should include Collin UK ETA data");
assert.match(app, /<span>UK ETA — \$\{eta\.person\}<\/span>/, "flights should render UK ETA cards");
assert.match(app, /2021-2606-1655-7845/, "Tiffany ETA reference should be present");
assert.match(app, /2021-2606-1009-0807/, "Collin ETA reference should be present");
assert.match(app, /ETA is passport-linked and should be automated at travel/, "ETA copy should explain no separate display is normally needed");
assert.doesNotMatch(app, /gov\.uk\/check-eta|gov\.uk\/apply-uk-visa/, "ETA cards should not link out to GOV.UK");
assert.match(app, /JetBlue B6 20 to JFK/, "Day 4 snapshot should include the return LHR to JFK flight number");
assert.match(app, /JetBlue B6 585 to RDU/, "Day 4 snapshot should include the return JFK to RDU flight number");
assert.match(app, /Tube%20station%20near%20me/, "top Nearest Tube action should use current-location map search");
assert.doesNotMatch(app, /nearest%20London%20Underground%20station/, "top Nearest Tube action should not use stale fixed-destination wording");
assert.doesNotMatch(app, /RDUBOS|replace\(" → ", ""\)/, "flight route display should not merge airport abbreviations on mobile");
assert.match(styles, /grid-template-columns: 8px minmax\(76px, auto\)/, "flight status rows should reserve mobile space for airport abbreviations");
assert.match(app, /buttonLabel.*Open (Hotel PDF|Bus Ticket|Letter)|Open (Hotel PDF|Bus Ticket|Letter).*buttonLabel/s, "prominent wallet documents should use buttonLabel for a big tap button");
assert.match(app, /ticket-item__btn/, "prominent wallet buttons should use ticket-item__btn class");
assert.doesNotMatch(app, /renderDocsProgressBar|needed-alert|items missing/, "app should not render the old wallet missing-items banner");
assert.doesNotMatch(app, /Before this leg|flightReadiness|departureGuardrails|renderDepartureGuard/, "flights should not show completed before-this-leg or guardrail cards");
assert.match(pushReminders, /big-bus-activate-2026-06-26/, "push reminders should include Big Bus activation on June 26");
for (const id of [
  "jetblue-checkin-outbound-2026-06-24",
  "offline-london-maps-2026-06-24",
  "heathrow-egates-2026-06-26",
  "london-eye-2026-06-26",
  "return-checkin-2026-06-28",
  "heathrow-fast-track-2026-06-29"
]) {
  assert.match(pushReminders, new RegExp(id), `${id} reminder should be scheduled`);
}
assert.doesNotMatch(app, /Download JetBlue app|Download Big Bus Tours app|Download TfL Go|Download ntfy|Download Uber/, "pre-trip checklist should not contain dead-end download wording");
assert.match(styles, /\.panel-view/, "styles should define compartment panels");
assert.match(styles, /\.bottom-nav|\.tab-bar/, "styles should define the section navigation");
assert.match(styles, /\.pocket-card/, "styles should define tucked-away pocket cards");
assert.match(styles, /\.route-pocket/, "styles should define direct route pockets");
assert.match(styles, /\.overview-grid/, "styles should define summary grids");
assert.match(styles, /\.ref-chip/, "styles should define the wallet confirmation code chip");
assert.match(styles, /\.flight-doc-card/, "styles should define the flight document cards");
assert.match(index, /id="routeShortcutList"/, "index should include route shortcuts");
assert.match(index, /id="tubeBasicsPanel"/, "move panel should include transit rules at the bottom");
assert.match(index, /id="recoveryPanel"/, "index should include recovery guidance");
assert.match(worker, /networkFirst\(event\.request\)/, "flight status should use network-first caching");
assert.match(worker, /cacheFirst\(event\.request\)/, "static shell should use cache-first caching");
assert.match(worker, /const CACHE_NAME = "london-trip-v\d+"/, "service worker cache name should change per release");
assert.match(worker, /"\.\/styles\.css\?v=\d+"/, "service worker should cache-bust styles");
assert.match(worker, /"\.\/app\.js\?v=\d+"/, "service worker should cache-bust the app shell");
assert.match(worker, /"\.\/assets\/big-bus-ticket\.pdf"/, "service worker should cache the Big Bus ticket PDF");
assert.match(worker, /"\.\/assets\/heathrow-fast-track-confirmation\.pdf"/, "service worker should cache the Heathrow Fast Track PDF");
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
  "assets/heathrow-fast-track-confirmation.pdf",
  "assets/hotel-booking-confirmation.pdf",
  "assets/parental-travel-consent-letter.pdf",
  "data/flight-status.json"
]) {
  await fs.access(file);
}

console.log("Site resilience QA passed.");
