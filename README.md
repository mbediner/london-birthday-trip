# London Birthday Trip

Mobile-first travel guide and itinerary for Tiffany and Collin's birthday trip, June 26–29, 2026.

**Live site:** https://mbediner.github.io/london-birthday-trip/
**Repo:** https://github.com/mbediner/london-birthday-trip

---

## Architecture

Single-file ES module SPA. No framework, no build step.

| File | Purpose |
|---|---|
| `index.html` | App shell — 5 panel sections + bottom nav |
| `app.js` | All data + all rendering logic |
| `styles.css` | All styles — deep navy design system |
| `sw.js` | Service worker — offline caching |
| `site.webmanifest` | PWA manifest — installable as home screen app |
| `data/flight-status.json` | Written by GitHub Actions flight tracker |
| `assets/` | Hero images (JPG + WebP pairs) |
| `tools/` | QA scripts, cache buster, flight updater |
| `tests/` | Unit tests |

### 5 Panels

| Panel | ID | Contains |
|---|---|---|
| Guide | `#overview` | 4-day itinerary cards + essentials |
| Directions | `#move` | Route shortcuts, tube basics, map search |
| Flights | `#flights` | ntfy setup, flight status, departure guardrails |
| Docs | `#wallet` | Confirmations, pre-trip checklist, packing list |
| Safety | `#safety` | Emergency numbers, lost item recovery |

### Key patterns

- `<details>`/`<summary>` pocket cards for all collapsible sections
- `setActivePanel()` uses `history.pushState` + `popstate` listener — swipe-back navigates between panels, does not exit the app
- `[hidden] { display: none !important; }` in CSS reset — required, stops `display:flex` overriding the `hidden` attribute
- Cache-bust: `?v=YYYYMMDDHHNN` on `styles.css` and `app.js` — auto-bumped by `release:prepare`
- Service worker: network-first for `data/flight-status.json`, cache-first for static shell

---

## Design System — Deep Navy

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0D1B2A` | Page background |
| `--bg-card` | `#162236` | Card background |
| `--accent` | `#4F9CF9` | JetBlue blue — CTAs, active nav |
| `--success` | `#2D9E6B` | Day 3 green |
| `--warning` | `#F59E0B` | Day 2 amber |
| `--danger` | `#E63946` | Day 1 red |
| `--purple` | `#8B5CF6` | Day 4 purple (departure day) |
| `--text-primary` | `#F8FAFC` | Body text |
| `--text-secondary` | `#94A3B8` | Subtext, labels |

Day badges: Day 1 red / Day 2 amber / Day 3 green / Day 4 purple. Defined in `.day-badge--N` and `.itinerary-pocket[data-day="N"]` in `styles.css`.

---

## Itinerary Data (app.js — `days` array)

| ID | Date | Title | Hero |
|---|---|---|---|
| `day-1` | Friday, June 26 | Victoria, Westminster and South Bank | `assets/london_eye.webp` |
| `day-2` | Saturday, June 27 | Tower Bridge, Borough Market and West End | `assets/tower_bridge.webp` |
| `day-3` | Sunday, June 28 | Palace Morning and Camden Adventure | `assets/camden_market.webp` |
| `day-4` | Monday, June 29 | Departure Day — Fly Home | *(null — no image)* |

Set `image: null` on any day with no hero — `renderItinerary` skips the `<picture>` block automatically.

Day object shape:
```js
{
  id: "day-N",
  date: "Weekday, Month DD",
  title: "...",
  image: "assets/photo.jpg",   // null = no hero
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

## Other Data in app.js

| Variable | What to update |
|---|---|
| `flights` | Flight legs — number, route, times, terminal |
| `flightReadiness` | Per-leg checklist items |
| `departureGuardrails` | Departure day reminders |
| `nextMoveTimeline` | Date-aware "next step" cards on Guide tab |
| `todo` | Pre-trip checklist — sectioned by owner `[{section, items}]` |
| `pack` | Packing list |
| `tickets` | Wallet confirmations — add numbers when Marianna books |
| `booking` | Hotel booking details and fill-ins |
| `emergencyContacts` | Safety tab numbers |
| `recoveryPlans` | Lost passport/phone/wallet steps |
| `mapQueries` | Named map targets used by buttons throughout the site |
| `routeShortcuts` | One-tap direction shortcuts on Directions tab |
| `resourceGroups` | App download links on Directions tab |
| `ntfyTopic` | ntfy push topic string |

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

### Flight tracking

- GitHub Actions runs `tools/update-flight-status.mjs` every 30 minutes during active windows (24h before departure → 3h after arrival)
- Writes `data/flight-status.json`; site reads and displays it
- `npm run flight:update` to run locally; `npm run flight:qa` to test the logic
- Closed-phone alerts go via ntfy, not browser notifications

---

## Local Dev

```bash
npx serve -p 4321 .       # preview at http://localhost:4321
npm run check             # JS syntax check
npm run test:unit         # unit tests
npm run site:qa           # static assertions
npm run release:prepare   # bust-cache + check + test:unit + site:qa + reminder:qa
```

---

## Release Workflow

```bash
npm run release:prepare
git add <files>
git commit -m "..."
git push
gh run watch              # confirm GitHub Pages CI is green
```

`main` is production. GitHub Pages deploys automatically after CI passes. Never present the live URL before CI is green.

---

## UX Gotchas — Do Not Break

- `[hidden] { display: none !important; }` must stay in CSS reset
- `history.pushState` (not `replaceState`) in `setActivePanel` — back navigation
- `.topic-code { word-break: normal; overflow-wrap: break-word; }` — no mid-word break in ntfy topic
- `trip-facts article:last-child:nth-child(odd) { grid-column: 1/-1; }` — no orphan cell in 2-col grid
- `.emergency-card--embassy .call-btn { width: auto; }` — embassy button not clipped
- Bottom nav: `padding-bottom: env(safe-area-inset-bottom, 0px)` — iPhone home indicator
