# Site Update SOP

Use this standard process every time the London Birthday Trip site changes.

## Update Flow

1. Run the Drive preflight before editing when returning to the project:
   - `npm run drive:preflight`
2. Make the requested site or documentation edits.
3. For every new feature, add or update QA coverage that proves the feature works.
4. Run the relevant local checks.
   - `npm run check` for JavaScript syntax.
   - `npm run site:qa` for install/offline/site resilience changes.
   - Use browser or Playwright checks when layout or interaction changes.
   - Use feature-specific checks such as `npm run flight:qa` when touching flight tracking.
5. Run the Drive preflight again before committing:
   - `npm run drive:preflight`
6. Commit the finished change.
7. Push to `main`.
8. Confirm the GitHub Pages deployment succeeds.
9. Print the live site URL for review:

https://mbediner.github.io/london-birthday-trip/

## Non-Negotiable

Every time a commit is pushed, the final response must include the live site URL.
When adding a new feature, do not stop at implementation. QA it, commit it, push it, verify deployment, and print the live site URL.

## Google Drive Drift Rules

- Treat Google Drive as a sync layer, not as a dependency workspace.
- Do not install `node_modules`, virtual environments, build caches, or package locks into this folder.
- Use repo scripts and global tools for checks.
- Check for Drive conflict files before committing.
- Fetch from `origin` before editing and before pushing so remote drift is visible.
- Keep line endings stable through `.gitattributes`.

## Confirmation Screenshots

- Confirmation screenshots may be committed when the site owner explicitly approves making them public.
- Copy approved screenshots into `assets/` with clear names.
- Link the screenshot from the relevant itinerary section so it is easy to open on a phone.
- If exact confirmation numbers or PINs are not clearly legible, add fill-in fields instead of guessing.

## Flight Status Automation

- Flight status checks run from GitHub Actions every 30 minutes.
- Checks only fetch live status during each flight's active window: 24 hours before departure until 3 hours after scheduled arrival.
- The site reads `data/flight-status.json` and shows last updated / last checked times.
- `Update Now` refreshes the latest published JSON in the browser. It cannot secretly start a GitHub Actions run without a private token.
- For immediate human confirmation, use the Google Status and JetBlue buttons.
- Browser notifications work while the site is open and notification permission is granted. Closed-phone push requires a real push service or airline app notifications.
- Closed-phone flight push uses ntfy.sh topic `london-birthday-trip-2026-a9x4m2q7`.
- Keep the ntfy topic hard to guess. It is public if someone has the topic name.
- Run `npm run flight:qa` after changing flight tracking logic.
- Run `npm run flight:update` outside the monitoring windows and confirm it does not create a `data/flight-status.json` diff.

## Installable / Offline App

- Keep `site.webmanifest`, `sw.js`, and `assets/icon.svg` in sync when changing the installable app experience.
- Static trip content should stay cache-first for speed.
- Flight status JSON should stay network-first so fresh status wins when online and cached status remains available when offline.
- Run `npm run site:qa` after changing app install, offline cache, critical travel assets, or departure guardrails.
- If adding a new must-have image, PDF, or local asset, add it to the service worker cache list so it is available when signal is poor.

## Calendar Writes

- Use Marianna's Google Calendar connection.
- Put travel reminders/events on the `Family` calendar, not the primary personal calendar.
- Family calendar ID: `family08208447051494281676@group.calendar.google.com`.
- Before creating real trip events, create and delete one short test event on the Family calendar to prove the connector can write there.
- Calendar write test passed after reauthentication on June 6, 2026:
  - Created `TEST - Codex Family Calendar Write Verification`
  - Monday, June 8, 2026, 9:00-9:05 AM Eastern
  - Read the event back from the Family calendar
  - Deleted the test event
- For future trip calendar work, use `family08208447051494281676@group.calendar.google.com` for every event and reminder unless Marianna explicitly says otherwise.
- If Google Calendar says reauthentication is required, stop calendar writes and ask Marianna to reconnect Google Calendar.
