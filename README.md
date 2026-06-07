# London Birthday Trip Site

Mobile-first web guide for Tiffany and Collin's London birthday trip, June 26-29, 2026.

## Live Site

The public GitHub Pages URL is:

https://mbediner.github.io/london-birthday-trip/

Every time the site is pushed to `main`, GitHub Actions deploys the latest version.

## What Is Included

- `index.html` - site structure and page sections.
- `styles.css` - mobile-first styling.
- `app.js` - itinerary data, map links, saved checklists, ticket wallet, and resource rendering.
- `site.webmanifest` and `sw.js` - installable/offline app support.
- `assets/` - London photos used by the site.
- `.github/workflows/pages.yml` - GitHub Pages CI/CD workflow.
- `.nojekyll` - tells GitHub Pages to serve the static files exactly as-is.
- Legacy printable outputs remain in the folder: `.docx`, `.pdf`, and the original itinerary builder.

## Editing The Site

Most trip changes happen in `app.js`.

- Update the daily itinerary in the `days` array.
- Update Google Maps targets in `mapQueries`.
- Update one-tap Google Maps direction cards in `routeShortcuts`.
- Update pre-travel tasks in `todo`.
- Update packing items in `pack`.
- Update ticket reminders in `tickets`.
- Update app and safety links in `resources`.
- Update emergency and lost-item recovery guidance in `emergencyContacts` and `recoveryPlans`.
- Update flight departure rules in `departureGuardrails`.
- Update date-aware next-step guidance in `nextMoveTimeline`.

Design changes happen in `styles.css`. The site intentionally has no build dependency, so small edits are easy and fast.

## Publishing Workflow

1. Edit the site files.
2. Commit the changes.
3. Push to the `main` branch.
4. GitHub Actions runs validation and `Deploy GitHub Pages`.
5. The public site updates automatically only after the workflow succeeds.
6. Send a family release email for every new feature.
7. Print the public site URL.

The deployment workflow uses official GitHub Pages actions:

- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

## GitHub Pages Setup

For a new repository:

1. Create a public GitHub repo.
2. Push this folder to the repo's `main` branch.
3. In GitHub, open `Settings > Pages`.
4. Set the source to `GitHub Actions`.
5. Push again or run the `Deploy GitHub Pages` workflow manually.

## Local Preview

Open `index.html` in a browser, or run a local preview:

```powershell
npm run preview
```

Then open `http://localhost:4173/`.

Before pushing JavaScript changes, run:

```powershell
npm run check
```

For the site resilience checks, run:

```powershell
npm run site:qa
```

## Local Tools

The Windows workstation is set up with:

- Git and GitHub CLI for commits, pushes, repo management, and Pages checks.
- Node.js and npm for lightweight site validation.
- Python plus `pillow` and `python-docx` for regenerating the legacy printable itinerary files.
- ImageMagick for optimizing or resizing photos.
- VS Code for editing.
- Playwright Chromium for browser screenshots and visual checks.

Avoid installing local `node_modules` inside this Google Drive folder. The sync layer can interfere with large dependency folders, so project scripts stay dependency-light.

## Flight Tracking

The public site includes a no-paid flight status system:

- GitHub Actions runs `tools/update-flight-status.mjs` every 30 minutes.
- The script checks only flights inside their monitoring window: 24 hours before departure through 3 hours after scheduled arrival.
- The script writes `data/flight-status.json`.
- The site reads that JSON and shows each flight's status, last checked time, estimated departure/arrival, and gate when available.
- The `Update Now` button refreshes the latest status data already published to the site.
- Browser alerts can notify about status changes while the site is open and notification permission is granted.
- Real phone push notifications use ntfy.sh. Install the ntfy app and subscribe to the topic shown in the site.
- Google Status search for the free Google flight-status card.
- JetBlue flight tracker and app for the source of truth.
- FlightStats for public flight status pages.
- FlightAware for live tracking near departure/in-flight windows.

No paid flight API is required. Google does not provide a simple public flight-status API for this static site, so the free on-demand path is to open Google's flight-status result directly for each flight.

### Phone Push Alerts

The site uses ntfy for no-paid phone push alerts:

- Topic: `london-birthday-trip-2026-a9x4m2q7`
- App/web topic URL: `https://ntfy.sh/london-birthday-trip-2026-a9x4m2q7`
- Alerts are sent by the GitHub Actions flight-status workflow.
- Alerts are sent on the first active check for a flight and when meaningful flight status details change.

The ntfy topic is public but intentionally hard to guess. Anyone who knows the topic URL could subscribe or send messages, so this should be treated as a practical travel notifier, not a private medical/banking channel.

To test the status updater locally:

```powershell
npm run flight:update
```

To simulate an active window:

```powershell
$env:FLIGHT_STATUS_NOW="2026-06-25T19:00:00Z"; npm run flight:update
```

To run the flight tracker QA suite:

```powershell
npm run flight:qa
```

The QA suite verifies that inactive dates do not churn the status file, outbound flights are checked during the outbound window, and return flights are checked during the return window.

## Installable Offline App

The site can be added to a phone home screen using the browser's install/add-to-home-screen option.

- `site.webmanifest` supplies the app name, color, and icon.
- `sw.js` caches the app shell and key trip assets for offline use.
- Static content uses cache-first loading for speed.
- `data/flight-status.json` uses network-first loading so fresh flight information wins when a connection is available, with cached status as the fallback.
- `npm run site:qa` verifies that the manifest, service worker, offline shell, flight-status caching strategy, and departure guardrail rendering are wired.

This does not replace JetBlue app notifications or ntfy phone push. It makes the guide more reliable when cellular service is weak.

## Google Drive Sync Safety

This repo lives inside Google Drive, so use the preflight check before committing:

```powershell
npm run drive:preflight
```

The check looks for sync conflict files, generated dependency folders, whitespace issues, and remote drift from GitHub.

## Travel Details

Confirmation screenshots may be included in the public site when approved. Copy approved screenshots into `assets/`, link them from the relevant itinerary section, and keep fill-in fields when exact numbers are not clearly legible.

## Update Rule

After every push, print the live site URL so the newest version can be checked immediately.

See `SOP.md` for the standard update process. The live URL must be printed after every commit and push:

https://mbediner.github.io/london-birthday-trip/

Every new feature release must also email:

- To: `mbediner@gmail.com`
- CC: `rbediner@gmail.com`, `tbediner@gmail.com`, `collin.bediner@gmail.com`

The email should explain the new feature, why it matters, QA completed, any action needed, and the live site link. Send it only after QA passes and GitHub Pages deployment succeeds.

## Photo Sources

Photo credits are documented in the original itinerary README history and builder metadata. Current site images live in `assets/`.
