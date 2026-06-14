# HANDOFF — Current State

> Agents: read this at session start to catch up. Update the Current State block and prepend a Session Log entry at session end. See AGENTS.md §6 for instructions.

---

## Current State

**Last release commit:** `d66b769` - Clarify hotel confirmation and clean setup UI
**Cache token:** `202606141827`
**Branch:** `main` - clean, deployed, CI green
**Live URL:** https://mbediner.github.io/london-birthday-trip/
**Cache-busted URL:** https://mbediner.github.io/london-birthday-trip/?v=202606141827

---
## Pending Fill-Ins (update in `app.js` when Marianna has the info)

| Item | Variable in app.js | Status |
|---|---|---|
| UK ETA — Tiffany | `tickets` array | ⏳ apply at gov.uk, add authorisation number |

---

## Session Log

Newest first. Agents prepend a new entry here at the end of every session.

---

### Session - June 14, 2026 (Codex)

- **Home guide simplified** - removed the Essentials/phone-setup strip from the Guide panel; the home page now opens straight into the day-by-day itinerary.
- **Hotel confirmation made obvious** - Ticket Wallet hotel card now uses a full-width `Open Hotel PDF` button, and Directions now starts with a Hotel confirmation card showing Booking.com confirmation `6945.109.446`, PIN `4412`, and an `Open confirmation PDF` action.
- **Download apps consolidated** - App Setup now begins with a single Download Apps block for JetBlue, Big Bus, TfL Go, ntfy, Google Maps, Uber, FREENOW / FreeNow taxis, and Booking.com with iPhone and Android links.
- **Stale install guidance removed** - deleted the unused home-screen/install-app prompt path and stale "Finish the phone setup" data so iPhone users are not pointed at the unavailable install option.
- **Flight mobile layout fixed** - flight status rows now split both `RDU -> BOS` and `RDU → BOS` route formats into separate airport codes and reserve mobile grid space so iPhone-width rows do not clip abbreviations.
- **QA strengthened** - `tools/qa-site.mjs` now asserts the hotel PDF, FreeNow app links, no stale install prompts, and the mobile flight-code parser/layout guardrails.
- **Release verified** - `npm run release:prepare` passed, mobile Browser UAT passed at 375x812, pushed `d66b769`, GitHub Pages deploy `27508087847` was green, live cache token `202606141827` is served, and the live hotel PDF returned `200` with `application/pdf`.

---

### Session — June 11, 2026 (Claude)

- **Docs tab fully reorganised** — 3 clear sections: Ticket Wallet (confirmations), App Setup & Alerts, Checklists. Old scattered phonePushPanel/bookingPanel/appDownloadList structure replaced.
- **Ticket Wallet redesign** — new `.ticket-item` layout with coloured `.ref-chip` chips: KDHSOU in red for JetBlue, VVXCH9SM in amber for Big Bus. Each has a one-tap Copy button. Big Bus shows numbered activation instructions inline.
- **App Setup pocket** — `renderAppSetup()` consolidates ntfy (topic + copy + install steps), JetBlue, TfL Go, Big Bus, and PWA install guide into one section in Docs.
- **Flights panel** — starts directly with "Status at a glance"; ntfy setup card removed.
- **Directions / On the Go** — resourceGroups slimmed to 5 utility links: Uber, FREENOW, TfL Journey Planner, Google Maps, Tube map PDF. Section renamed "On the Go / Ride and navigate".
- **Quick-actions strip** — 2-column grid (Hotel Map + Nearest Tube only, no horizontal scroll).
- **"Set up alerts" button** — now routes to Docs → #appSetupPanel instead of Flights.
- **Route shortcuts** — walking 🚶 / transit 🚇 / driving 🚗 mode icons added.
- **UAT passed** — visual UAT via Preview MCP confirmed all changes at 375×812 mobile.
- **Release verified** — `npm run release:prepare` passed, pushed `1e4d06f`, cache token `202606112041`.

---

### Session - June 11, 2026 (Codex)

- **Docs wallet reorganized** - hotel confirmation now appears first in the wallet and opens `assets/hotel-booking-confirmation.pdf`.
- **Hotel blanks filled** - Booking.com confirmation `6945.109.446`, lodging confirmation `88897847`, PIN `4412`, check-in/out, room, guest, and arrival-note details are now in the hotel panel.
- **Download Apps section added** - JetBlue, Big Bus, TfL Go, ntfy, Google Maps, Uber, FREENOW, and Booking.com now have dedicated iPhone and Android buttons instead of dead-end checklist text.
- **Directions/resources decluttered** - app download links moved out of Directions resources; Directions now stays focused on maps, routes, and reference links.
- **Release verified** - mobile Docs UAT passed at 375x812, `npm run release:prepare` passed, pushed `2403c66`, GitHub Pages deploy `27372920777` was green, and the live hotel PDF returned `200` with `application/pdf`.

---

### Session - June 11, 2026 (Codex)

- **Parent consent PDF added** - Docs wallet now links the Parent travel consent letter card to `assets/parental-travel-consent-letter.pdf` with an obvious `PDF` tap cue and a fully tappable card.
- **Offline support updated** - service worker now includes the parental travel consent PDF in the app shell cache.
- **Release verified** - mobile Docs UAT passed at 375x812, `npm run release:prepare` passed, pushed `a76938e`, GitHub Pages deploy `27371655848` was green, and the live PDF returned `200` with `application/pdf`.

---

### Session - June 11, 2026 (Codex)

- **Top Safety shortcut removed** - Safety is now available only in the bottom navigation.
- **Passport recovery simplified** - removed the obvious first passport-search instruction from the Safety page.
- **Collin ETA marked complete** - Docs wallet now shows Collin's UK ETA approval reference `2021-2606-1009-0807`, valid until March 7, 2028, linked to passport ending `1892`; Tiffany ETA remains pending.
- **Release verified** - mobile UAT passed at 375x812, `npm run release:prepare` passed, pushed `16cb49c`, GitHub Pages deploy `27354685082` was green, and handoff cache token was refreshed to `202606111441`.

---

### Session - June 11, 2026 (Codex)

- **Nearest Tube shortcut fixed** - top quick action now opens Google Maps walking directions to the nearest London Underground station from the phone's current location, without using the hotel as origin.
- **Safety page simplified** - removed generic quick rules and redundant obvious guidance; added a merged U.S. Embassy card with address, phone, call button, map, and Travel.State.gov.
- **Practical recovery actions added** - passport, phone, wallet/card, and lost property cards now include Find My Phone links, Transport for London lost property, Chase card services, American Express overseas support, and police report links.
- **Release verified** - mobile UAT passed at 375x812, `npm run release:prepare` passed, pushed `71304fb`, GitHub Pages deploy `27353241976` was green, and handoff cache token was refreshed to `202606111418`.

---

### Session - June 10, 2026 (Codex)

- **London Eye wallet link fixed** - Docs wallet London Eye card now opens Google Maps for Riverside Building, County Hall, Westminster Bridge Rd, London SE1 7PB.
- **Release verified** - mobile Docs UAT confirmed the London Eye card renders as an `<a>` link with the correct address, `npm run release:prepare` passed, pushed `357e14d`, GitHub Pages deploy `27304473129` was green, and handoff cache token was refreshed to `202606102034`.

---

### Session - June 10, 2026 (Codex)

- **Big Bus booking added** - Docs wallet now confirms Friday, June 26 hop-on hop-off booking `VVXCH9SM` for 1 adult and 1 child.
- **Big Bus setup added** - Day 1, Docs, checklist, and Resources now tell the kids to download Big Bus Tours, add booking `VVXCH9SM`, and activate only when ready to board.
- **London Eye address added** - Day 1 and map links now use Riverside Building, County Hall, Westminster Bridge Rd, London SE1 7PB for the 6:00 PM excursion.
- **Release verified** - mobile Day 1, Docs, and Resources UAT passed at 375x812, `npm run release:prepare` passed, pushed `3626046`, GitHub Pages deploy `27302786506` was green, and handoff cache token was refreshed to `202606102005`.

---

### Session - June 10, 2026 (Codex)

- **Second London Eye ticket added** - Docs wallet now shows the shared 6:00 PM London Eye excursion with adult ticket `150018675054750217` and child ticket `150018553500106457`.
- **Release verified** - mobile Docs UAT passed at 375x812, `npm run release:prepare` passed, pushed `00b22b6`, GitHub Pages deploy `27302127124` was green, and handoff cache token was refreshed to `202606101954`.

---

### Session - June 10, 2026 (Codex)

- **London Eye ticket added** - Day 1 now shows the Friday, June 26 at 6:00 PM London Eye timed entry with queue guidance.
- **Docs wallet updated** - London Eye is confirmed with Order ID `605056784` and ticket number `150018675054750217`.
- **Release verified** - mobile UAT checked at 375x812, `npm run release:prepare` passed, pushed `8aacfc5`, GitHub Pages deploy `27301025095` was green, and handoff cache token was refreshed to `202606101936`.

---

### Session - June 10, 2026 (Codex)

- **Startup sync completed** - removed Google Drive/Windows `desktop.ini` noise files, including invalid `desktop.ini` Git ref files that were breaking fetch; verified clean fetch from `origin`.
- **Repo ready** - confirmed local `main` matches `origin/main`, working tree clean, and CI/CD workflows healthy.
- **Cache refreshed** - ran `npm run release:prepare`, bumped cache token to `202606101152`, pushed `52609e0`, and verified GitHub Pages CI green.
- **SOP confirmed** - `AGENTS.md` requires `HANDOFF.md` updates after pushes for future agents; no release emails should be sent.

---
### Session — June 9, 2026 (Claude) — Part 2

- **SW cache bug fixed** — `booking_confirmation.jpg` was still in sw.js APP_SHELL pre-cache list after being moved to `assets/unused/`; `cache.addAll` fails the entire SW install if any file is missing, meaning new SWs never activated (root cause of "mobile cache never clears"). Removed the file from the list.
- **SW navigation-first** — HTML navigation requests now use network-first so new releases appear immediately without manual cache clearing
- **"Set up alerts" scroll fixed** — added `window.scrollTo(0,0)` before the panel transition so the button always lands on the ntfy setup card (not "Status at a glance")
- **Deep links** — `#day-1` through `#day-4` URL anchors now open the correct itinerary day directly; shareable URLs for each day
- **Status at a glance — clickable** — each flight row now has a "Details ›" link; clicking opens and scrolls to the corresponding flight detail card (`id="flight-{number}"` added to each `<details>`)
- **FlightAware removed** — `flightTrackers()` now returns only Live Status (Google search); no duplicate tracker
- **JetBlue app links** — all "JetBlue app" text in flight cards now links to App Store (iPhone) and Google Play (Android) with inline styled links
- **Add to Home Screen cleanup** — removed out-of-place TfL Go download buttons; removed Safari instructions; Chrome-only wording; cleaner summary text
- **Directions — alphabetized + icons** — all 36 map locations sorted A→Z; `mapIcons` object added with per-location emoji (🚇 stations, ✈️ airports, 🏰 landmarks, 🛒 markets, etc.)
- **TfL spelled out** — `resourceGroups` now says "Transport for London app" in the description; JetBlue split into iPhone and Android entries
- **Token fix** — `var(--forest)` in `renderResources` corrected to `var(--accent)` (was an alias anyway, now semantically correct)

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
