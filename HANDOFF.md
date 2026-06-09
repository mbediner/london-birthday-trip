# HANDOFF — Current State

> Update this file after every commit/push. It is the first thing an agent reads.

**Last commit:** `ff9028f` — Repo cleanup: remove legacy files, organise assets, fix docs
**Branch:** `main` — clean, fully deployed
**Cache token:** `202606091535`
**Live URL:** https://mbediner.github.io/london-birthday-trip/

---

## Pending Fill-Ins (update in `app.js` when Marianna has the info)

| Item | Where | Status |
|---|---|---|
| Big Bus hop-on hop-off confirmation | `tickets` array | ⏳ book and add number |
| London Eye confirmation | `tickets` array | ⏳ book and add number |
| UK ETA — Tiffany | `tickets` array | ⏳ apply at gov.uk, add authorisation number |
| UK ETA — Collin | `tickets` array | ⏳ apply at gov.uk, add authorisation number |
| Parent travel consent letter | `tickets` array | ⏳ add Google Doc link |
| Booking.com confirmation number | `booking.fillIns` | ⏳ from Booking.com email |
| Booking.com PIN | `booking.fillIns` | ⏳ from Booking.com email |
| Check-in time | `booking.fillIns` | ⏳ from Booking.com email |

---

## What Was Done (last session — June 9, 2026)

- Full **deep navy redesign** — replaced warm paper/forest theme; new design tokens, bottom nav, compact header
- **Day badges** — FRI/JUN 26 format, colored per day (red/amber/green/purple)
- **Day 4** — Monday June 29 departure day card added (purple, no hero image, 7-step departure route)
- **ntfy setup** — consolidated to single card at top of Flights panel; copy button; App Store + Google Play links; plain-text step 2 (no `<strong>` tag)
- **Back navigation** — `history.pushState` + `popstate` so swipe-back navigates panels
- **"Set up alerts"** — navigates to Flights panel and scrolls to ntfy card
- **Emergency grid** — 2-column at 375px; "Call Embassy" button width fixed
- **To-do list** — split by owner: Marianna tasks / Tiffany & Collin tasks
- **Portable chargers** — added to Marianna's to-do
- **Docs consolidation** — `README.md`, `AGENTS.md`, `HANDOFF.md` are now the only context files; `SOP.md` and `SESSION-START-CHECK.md` removed
- **Repo cleanup** — deleted 5 legacy print files + Python builder; moved 11 unreferenced images to `assets/unused/`; deleted stale `Claude Design Audit Files/` folder; updated `.gitignore`; fixed README architecture section (`site-logic.js` is still active)
