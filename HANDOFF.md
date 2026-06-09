# HANDOFF — Current State

> Agents: read this at session start to catch up. Update the Current State block and prepend a Session Log entry at session end. See AGENTS.md §6 for instructions.

---

## Current State

**Last commit:** `de780d3` — Update HANDOFF.md after repo cleanup
**Cache token:** `202606091535`
**Branch:** `main` — clean, deployed, CI green
**Live URL:** https://mbediner.github.io/london-birthday-trip/
**Cache-busted URL:** https://mbediner.github.io/london-birthday-trip/?v=202606091535

---

## Pending Fill-Ins (update in `app.js` when Marianna has the info)

| Item | Variable in app.js | Status |
|---|---|---|
| Big Bus hop-on hop-off confirmation | `tickets` array | ⏳ book, then add number |
| London Eye confirmation | `tickets` array | ⏳ book, then add number |
| UK ETA — Tiffany | `tickets` array | ⏳ apply at gov.uk, add authorisation number |
| UK ETA — Collin | `tickets` array | ⏳ apply at gov.uk, add authorisation number |
| Parent travel consent letter | `tickets` array | ⏳ add Google Doc link |
| Booking.com confirmation number | `booking.fillIns` | ⏳ from Booking.com email |
| Booking.com PIN | `booking.fillIns` | ⏳ from Booking.com email |
| Check-in time | `booking.fillIns` | ⏳ from Booking.com email |

---

## Session Log

Newest first. Agents prepend a new entry here at the end of every session.

---

### Session — June 9, 2026 (Claude)

- **Repo cleanup** — deleted 5 legacy print files (`build_london_itinerary.py`, 4× `london_birthday_itinerary.*`); removed empty `rendered_docx/` and `rendered_pdf/` dirs; deleted `Claude Design Audit Files/` (had `node_modules` inside); moved 11 unreferenced images to `assets/unused/`; updated `.gitignore`
- **Fixed `README.md`** — added `site-logic.js` to architecture table (it IS active — imported by `app.js`, `sw.js`, and unit tests); fixed local dev commands
- **Context files consolidated** — deleted `SOP.md` and `SESSION-START-CHECK.md`; content merged into `AGENTS.md`; 3-file structure: `README.md` (architecture), `AGENTS.md` (all agent rules), `HANDOFF.md` (current state + session log)
- **`AGENTS.md` hardened** — added explicit session log protocol, CI watch requirement, auto-push-without-asking rule
- **Day 4** — Monday June 29 departure day card added (purple badge, no hero image, 7-step departure route)
- **To-do split by owner** — Marianna tasks / Tiffany & Collin tasks; `renderChecklist` detects sectioned format
- **Portable chargers** — new to-do item under Marianna
- **Full deep navy redesign** — replaced warm paper/forest theme; bottom nav, compact header, JetBlue blue accent
- **Day badges** — FRI/JUN 26 format, colored per day (red/amber/green/purple)
- **ntfy setup** — consolidated card at top of Flights panel; copy button; App Store + Google Play links
- **Back navigation** — `history.pushState` + `popstate` so swipe-back navigates panels
- **Emergency grid** — 2-column at 375px; "Call Embassy" button width fixed
- **UAT QA tool** — all 4 UAT bugs from screenshots verified and fixed before push
