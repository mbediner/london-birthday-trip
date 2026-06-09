# Session Handoff — June 9, 2026

Read this before touching anything. The repo is clean, on `main`, and fully deployed.

## Current State

- Branch: `main`
- Working tree: clean
- Last commit: `1fb7688` — "UAT fixes: stale screenshot copy, badge contrast, ntfy stray period"
- Live URL: https://mbediner.github.io/london-birthday-trip/
- Cache token: `?v=202606090301`

Do **not** run `git restore`, `git reset`, or `git rm`. The repo is healthy.

---

## What Was Done This Session

A full redesign pass was completed. Key changes (all pushed and live):

1. **Redesign** — New masthead, tab bar, card system. Avenir Next font, `--forest` (#173f3d) primary, `--paper` (#f4efe7) background.
2. **Hero chips removed** — The three pill labels (Hotel Victoria / Nearest Tube / June 26-29) were removed from the masthead.
3. **Tab bar (mobile)** — Changed from a 3-col grid to `flex / overflow-x: auto` so all 5 tabs fit in one scrollable row.
4. **Wallet redesign** — Ticket Wallet, Before Leaving, What to Bring, and Booking are now collapsible `<details class="pocket-card">` sections.
5. **Ticket cards** — Each ticket is a rich object with real data, status badge (✓ Set / NEEDED / To do), and a reason. JetBlue links to Manage Trips. UK ETA explains what it is and links to gov.uk.
6. **Booking section** — Hotel phone (+44 20 7630 8888) added. Screenshot image and "Open screenshot" button removed entirely.
7. **Downloads (Directions tab)** — Each resource now shows a reason WHY to download/open it.
8. **Emergency contacts (Safety tab)** — Full-width tappable cards with a "Call →" badge.
9. **Day route label** — "Launch day route" renamed to "Directions → [destination]" per day.
10. **Flight display** — Stray pipe between terminal and arrival time fixed.
11. **Stale copy** — All "screenshot" references removed from copy (Before Departure card, departure morning card, flight readiness checklists).
12. **ntfy setup** — Stray period after ntfy topic fixed by using inline `<code>` instead of `<strong>`.
13. **SOP** — Post-release email requirement removed. SOP updated.

---

## Architecture Quick Reference

- **Static GitHub Pages** site — `index.html` + `app.js` + `styles.css` + `site-logic.js`
- **ES module SPA** — `app.js` imports from `./site-logic.js`
- **5 tab panels**: `overview` (Guide) · `move` (Directions) · `flights` (Alerts) · `wallet` · `safety`
- Panels are shown/hidden via the `hidden` attribute + `.is-active` class
- **Day cards** use `<details class="pocket-card">` / `<summary>` collapsible pattern
- **Cache busting**: version query param in `index.html` on BOTH `styles.css` and `app.js` links — must bump on every production release. Run `npm run release:prepare` before pushing.
- **itinerary data** lives in the `days` array in `app.js` (~line 70)
- **flights data** lives in the `flights` array (~line 209)
- **ticket wallet data** lives in the `tickets` array (~line 537)
- **booking data** lives in the `booking` object (~line 548)

---

## What Is Still Pending (Needs Real Data)

These items are marked **NEEDED** in the Wallet tab. Update them in `app.js` when the info is available:

| Item | Where in app.js | What's needed |
|---|---|---|
| Big Bus London hop-on hop-off | `tickets` array, index 2 | Confirmation number — add when Marianna books |
| London Eye | `tickets` array, index 3 | Confirmation number — add when Marianna books |
| UK ETA — Tiffany | `tickets` array, index 4 | ETA authorisation number from gov.uk |
| UK ETA — Collin | `tickets` array, index 5 | ETA authorisation number from gov.uk |
| Parent travel consent letter | `tickets` array, index 6 | Google Doc link — ask Marianna |
| Booking confirmation number | `booking.fillIns` | From Booking.com email |
| Booking PIN | `booking.fillIns` | From Booking.com email |
| Check-in time | `booking.fillIns` | From Booking.com email |
| Sunday itinerary (Day 3 extra) | `days` array | Marianna still needs to add one more Sunday guide pocket per SOP |

---

## Repo Rules (Non-Negotiable)

- **Never send a release email** after deploying. This requirement is dead.
- **Commit and push immediately** without asking for permission. Produce the live URL.
- **Bump the cache version** (`?v=YYYYMMDDHHNN`) in `index.html` on every production release.
- Run `npm run release:prepare` before every push to production.
- Always confirm GitHub Pages deploy succeeded before presenting the live URL.
- GitHub remote: `https://github.com/mbediner/london-birthday-trip.git` (HTTPS, rbediner is collaborator)
- Auth: `gh` CLI + osxkeychain. If push fails auth, run `gh auth login` via browser.
