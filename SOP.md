# Site Update SOP

Use this standard process every time the London Birthday Trip site changes.

## Git-First Source Of Truth

- GitHub is the source of truth for this project.
- Google Drive is only the sync and transport layer that mirrors this folder to disk.
- Codex should do the Git work automatically whenever it is safe to do so.
- The user should not need to manage Git manually unless there is a real blocker.
- Never manually edit anything inside `.git/`.
- Never rely on Google Drive version history as the project history.

## Codex Session Start

At the beginning of every session, Codex should do this automatically before editing:

1. Confirm this folder is a Git repository.
2. Inspect the repository state:
   - `git status --short --branch`
   - `git remote -v`
   - `git branch --show-current`
3. If the working tree is clean:
   - `git fetch origin`
   - pull the current branch from `origin`
4. If the working tree is not clean:
   - inspect what changed
   - do not overwrite local work
   - do not blindly pull over local changes
   - explain the situation in plain English before taking risk
5. After sync is complete or intentionally paused, continue with the requested task.

## Update Flow

1. At session start, perform the Git sync workflow above when safe.
2. Run the Drive preflight before editing when returning to the project:
   - `npm run drive:preflight`
3. Make the requested site or documentation edits.
4. For every new feature, add or update QA coverage that proves the feature works.
5. Run the relevant local checks.
   - `npm run release:prepare` before every production release so cache is busted before the live URL is shared.
   - `npm run check` for JavaScript syntax.
   - `npm run site:qa` for install/offline/site resilience changes.
   - Use browser or Playwright checks when layout or interaction changes.
   - Use feature-specific checks such as `npm run flight:qa` when touching flight tracking.
6. Run the Drive preflight again before committing:
   - `npm run drive:preflight`
7. Review the changed files before committing.
8. Commit the finished change.
9. Push to `main`.
10. Confirm the GitHub Pages deployment succeeds.
11. Email the release note to the family list with the new feature summary and live site URL.
12. Print the live site URL for review:

https://mbediner.github.io/london-birthday-trip/

## Non-Negotiable

Every time a commit is pushed, the final response must include the live site URL.
When adding a new feature, do not stop at implementation. QA it, commit it, push it, verify deployment, and print the live site URL.
Every new feature release must also send an email update after the production deployment succeeds.
Every production release must bust cache before the live URL is presented.
If Git state is risky or unclear, Codex must pause and explain the exact blocker in plain English instead of guessing.

## Production Promotion

- `main` is the production branch.
- GitHub Pages is production.
- Do not push feature work to production until the relevant QA commands pass locally.
- Run `npm run release:prepare` before every production push so the CSS, JavaScript, and service worker cache all move to a fresh release token.
- The GitHub Pages workflow runs validation before deploying, so production promotion only completes after CI succeeds.
- After the deployment succeeds, verify the live site when practical with a direct fetch or browser check.
- Do not present the live site URL until the new deploy and the cache-busting release token are both confirmed.

## End Of Session Behavior

When the requested work is complete, Codex should do this automatically when safe:

1. Review changed files.
2. Run the relevant checks and QA commands.
3. If this is a production release, make sure `npm run release:prepare` was run in this round of changes.
3. Summarize what changed in plain English.
4. Create a clear commit.
5. Push to the active remote branch.
6. Verify production deployment when the change is intended for production.
7. Include the live site URL in the final response only after deploy success and cache-busting are confirmed.

If push fails:

1. Inspect the cause.
2. Explain it plainly.
3. Attempt the safest obvious fix.
4. Stop and report the blocker if the fix is not clearly safe.

## Family Release Email

Send a release email after every successful feature deployment.

- To: `mbediner@gmail.com`
- CC: `rbediner@gmail.com`, `tbediner@gmail.com`, `collin.bediner@gmail.com`
- Subject format: `London Trip App Update: <short feature name>`
- Body must include:
  - What changed, in plain English.
  - Why it matters for the trip.
  - Any action Tiffany, Collin, Roman, or Marianna should take.
  - QA completed.
  - Production/live site URL: `https://mbediner.github.io/london-birthday-trip/`
- Send the email only after QA passes, the commit is pushed, and GitHub Pages deployment succeeds.
- If deployment or QA fails, do not send a feature email. Fix the issue first.

## Google Drive Drift Rules

- Treat Google Drive as a sync layer, not as a dependency workspace.
- Treat GitHub, not Drive, as the authoritative project history.
- Do not install `node_modules`, virtual environments, build caches, or package locks into this folder.
- Use repo scripts and global tools for checks.
- Check for Drive conflict files before committing.
- Fetch from `origin` before editing and before pushing so remote drift is visible.
- If local changes exist, inspect them before pulling and avoid overwriting them.
- Keep line endings stable through `.gitattributes`.
- Never hand-edit `.git` contents through Finder or Google Drive.

## Communication Style

- Keep explanations simple and calm.
- Avoid overwhelming the user with Git jargon unless it is necessary.
- Good examples:
  - “I pulled the latest changes before starting.”
  - “There were local changes, so I paused before syncing to avoid overwriting anything.”
  - “I finished the work, ran the checks, pushed it, and verified the live site.”
  - “Push is blocked because Git needs authentication on this machine.”

## Confirmation Screenshots

- Confirmation screenshots may be committed when the site owner explicitly approves making them public.
- Copy approved screenshots into `assets/` with clear names.
- Link the screenshot from the relevant itinerary section so it is easy to open on a phone.
- If exact confirmation numbers or PINs are not clearly legible, add fill-in fields instead of guessing.

## Pending Content

- Marianna still needs to add one more Sunday guide/itinerary pocket.
- Add that content as a real `days` array entry in `app.js`, with practical route buttons, food notes, photo notes, tired fallback, and rain fallback.
- Do not bury the extra Sunday material in safety, wallet, or loose notes; it belongs in the travel guide/itinerary flow.

## Flight Status Automation

- Flight status checks run from GitHub Actions every 30 minutes.
- Checks only fetch live status during each flight's active window: 24 hours before departure until 3 hours after scheduled arrival.
- The site reads `data/flight-status.json` and shows last updated / last checked times.
- `Update Now` refreshes the latest published JSON in the browser. It cannot secretly start a GitHub Actions run without a private token.
- For immediate human confirmation, use the Google Status and JetBlue buttons.
- Do not use browser notification prompts for this trip site.
- Flight alerts and trip reminders use ntfy.sh topic `london-birthday-trip-2026-a9x4m2q7`.
- Trip reminder send state lives in `data/trip-push-state.json`; do not manually mark reminders sent unless a push actually went out.
- Keep the ntfy topic hard to guess. It is public if someone has the topic name.
- Run `npm run flight:qa` after changing flight tracking logic.
- Run `npm run reminder:qa` after changing trip reminder logic.
- Run `npm run flight:update` outside the monitoring windows and confirm it does not create a `data/flight-status.json` diff.

## Installable / Offline App

- Keep `site.webmanifest`, `sw.js`, and `assets/icon.svg` in sync when changing the installable app experience.
- Static trip content should stay cache-first for speed.
- Flight status JSON should stay network-first so fresh status wins when online and cached status remains available when offline.
- For every release, rotate the cache token for `styles.css`, `app.js`, and the service worker cache name by running `npm run release:prepare`.
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
