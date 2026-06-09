# London Birthday Trip — Handoff

Read this before touching anything. Repo is clean, on `main`, fully deployed.

**Live URL:** https://mbediner.github.io/london-birthday-trip/
**Repo:** https://github.com/mbediner/london-birthday-trip.git
**Last cache token:** `202606091519`

---

## Repo Rules (Non-Negotiable)

- **Never send a release email** after deploying. Requirement is dead.
- **Commit and push immediately** without asking for permission. Produce the live URL.
- **Run `npm run release:prepare`** before every push — bumps cache token, syntax check, unit tests, QA.
- **Always `gh run watch`** to confirm GitHub Pages CI is green before presenting the URL.
- Auth: `gh` CLI + osxkeychain. If push fails, run `gh auth login`.

---

## Release Workflow

```bash
npm run release:prepare   # bust-cache → syntax check → unit tests → site QA → reminder QA
git add <changed files>
git commit -m "..."
git push
gh run watch              # wait for green
```

---

## Architecture

- **Single-file ES module SPA** — all logic in `app.js`; no separate site-logic.js
- `styles.css` for all styling; `sw.js` service worker; `index.html` shell
- **5 panels:** Guide (`#overview`), Directions (`#move`), Flights (`#flights`), Docs (`#wallet`), Safety (`#safety`)
- Panel switching: `setActivePanel()` uses `history.pushState` (not `replaceState`) + `popstate` listener — swipe-back navigates between panels, does not exit the app
- `<details>`/`<summary>` pocket card pattern for all collapsible sections
- Cache-bust: `?v=YYYYMMDDHHNN` on `styles.css` and `app.js` in `index.html` + `sw.js` — bumped automatically by `release:prepare`
- Service worker: network-first for `data/flight-status.json`, cache-first for static shell

---

## Design System — Deep Navy

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0D1B2A` | Page background |
| `--bg-card` | `#162236` | Card background |
| `--bg-card-hover` | `#1E3047` | Card hover |
| `--accent` | `#4F9CF9` | JetBlue blue — CTAs, active nav |
| `--success` | `#2D9E6B` | Day 3 green |
| `--warning` | `#F59E0B` | Day 2 amber |
| `--danger` | `#E63946` | Day 1 red |
| `--purple` | `#8B5CF6` | Day 4 purple (departure day) |
| `--text-primary` | `#F8FAFC` | Body text |
| `--text-secondary` | `#94A3B8` | Subtext, labels |

Day badge colors:
- Day 1 FRI — red `rgba(230,57,70,0.25)` / text `#f87a84`
- Day 2 SAT — amber `rgba(245,158,11,0.25)` / text `#fbbf3a`
- Day 3 SUN — green `rgba(45,158,107,0.25)` / text `#45cc8b`
- Day 4 MON — purple `rgba(139,92,246,0.25)` / text `#c4b5fd`

---

## Itinerary — 4 Days

| ID | Date | Title | Hero Image |
|---|---|---|---|
| `day-1` | Friday, June 26 | Victoria, Westminster and South Bank | `assets/london_eye.webp` |
| `day-2` | Saturday, June 27 | Tower Bridge, Borough Market and West End | `assets/tower_bridge.webp` |
| `day-3` | Sunday, June 28 | Palace Morning and Camden Adventure | `assets/camden_market.webp` |
| `day-4` | Monday, June 29 | Departure Day — Fly Home | *(null — no hero, airport day)* |

Day 4 departure: leave hotel 7:00–7:15 AM BST → Heathrow T2 by 8:55 AM → B6 20 LHR→JFK (11:55 AM BST / arrives 3:25 PM EDT) → B6 585 JFK→RDU (6:30 PM EDT / arrives 8:33 PM EDT).

`renderItinerary` skips the `<picture>` media block when `day.image` is null.

Add new days in this shape:
```js
{
  id: "day-N",
  date: "Weekday, Month DD",        // e.g. "Monday, June 29"
  title: "...",
  image: "assets/photo.jpg",        // null = no hero image
  imageWebp: "assets/photo.webp",
  area: "...",
  transport: "...",
  food: "...",
  night: "...",
  launchRoute: ["From", "To", "walking|transit|driving"],
  steps: [["Title", "Description", ["MapName", ...]], ...],
  photo: "...",
  tired: "...",
  rain: "..."
}
```

---

## Flights

All on confirmation **KDHSOU**:

| Flight | Route | Date | Departs | Arrives |
|---|---|---|---|---|
| B6 2184 | RDU → BOS | Thu Jun 25 | 2:34 PM EDT (T2) | 4:34 PM EDT |
| B6 1620 | BOS → LHR | Thu Jun 25 | 6:39 PM EDT (T-C) | Fri Jun 26, 6:30 AM BST |
| B6 20 | LHR → JFK | Mon Jun 29 | 11:55 AM BST (T2) | 3:25 PM EDT |
| B6 585 | JFK → RDU | Mon Jun 29 | 6:30 PM EDT (T5) | 8:33 PM EDT |

ntfy push topic: `london-birthday-trip-2026-a9x4m2q7`

---

## Pre-Trip To-Do (Docs → Pre-Trip Checklist)

Grouped by owner. `renderChecklist` auto-detects `[{section, items}]` format vs flat string array.

**Marianna:**
- Order British pounds from Chase
- Apply for UK ETA for Tiffany and Collin at gov.uk
- Buy Big Bus London hop-on hop-off tickets and add confirmation here
- Buy London Eye tickets and add confirmation here
- Buy portable chargers for Tiffany and Collin's phones
- Confirm hotel can store bags on arrival morning before check-in

**Tiffany & Collin:**
- Download JetBlue app and confirm KDHSOU booking appears
- Download TfL Go for Tube routes
- Download ntfy and subscribe to the trip alert topic
- Download offline Google Maps for London
- Download Uber and FREENOW — set up payment before leaving
- Save hotel address in Uber and Google Maps before leaving home
- Save parent travel consent letter as PDF on both phones

---

## Wallet Confirmations — Pending Fill-Ins

Update in the `tickets` array and `booking` object in `app.js`:

| Item | Status |
|---|---|
| JetBlue KDHSOU | ✅ confirmed |
| Hotel — Holiday Inn Express Victoria, 106-110 Belgrave Rd SW1V 2BJ | ✅ confirmed |
| Big Bus London hop-on hop-off | ⏳ add confirmation number when Marianna books |
| London Eye | ⏳ add confirmation number when Marianna books |
| UK ETA — Tiffany | ⏳ add authorisation number (gov.uk) |
| UK ETA — Collin | ⏳ add authorisation number (gov.uk) |
| Parent travel consent letter | ⏳ add Google Doc link |
| Booking.com confirmation number | ⏳ fill in |
| Booking.com PIN | ⏳ fill in |
| Check-in time | ⏳ fill in |

---

## Key UX Rules and Gotchas

- **`[hidden] { display: none !important; }`** — must stay in CSS reset or `#dayIndicator` shows incorrectly (`display:flex` overrides the attribute)
- **Bottom nav safe area** — `position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom, 0px)` for iPhone home indicator
- **Day badge parsing** — `parseDayBadge("Friday, June 26")` → `{abbr: "FRI", short: "Jun 26"}`
- **Trip-facts orphan fix** — `trip-facts article:last-child:nth-child(odd) { grid-column: 1/-1; }` — prevents empty cell when day has odd number of fact items in 2-col grid
- **ntfy topic display** — `.topic-code { word-break: normal; overflow-wrap: break-word; font-size: 0.75rem; }` — prevents mid-word break in topic string
- **Embassy button** — `.emergency-card--embassy .call-btn { width: auto; }` — prevents "Call Embassy" clipping in flex row
- **ntfy Step 2 text** — plain text only inside `<li>`, no `<strong>` tags (inherit oversized bold styles)
- **"Set up alerts" button** — `data-open-push-setup` attribute → switches to `#flights` and scrolls to `#phonePushPanel` after 60ms timeout
- **Back navigation** — `history.pushState` (not `replaceState`); `popstate` listener handles back

---

## QA

- `tools/qa-site.mjs` — static assertions on HTML/JS/CSS; runs inside `release:prepare`
- `tests/*.test.mjs` — unit tests for cache token, URL builders, panel routing
- Always UAT visually at **375×812 mobile viewport** before pushing
- Local preview: `npx serve -p 4321`
