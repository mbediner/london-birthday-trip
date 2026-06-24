# HANDOFF — Current State

> Agents: read this at session start to catch up. Update the Current State block and prepend a Session Log entry at session end. See AGENTS.md §6 for instructions.

---

## Current State

**Last release commit:** `aee1579` - Rework wallet and flight travel docs
**Cache token:** `202606241512`
**Branch:** `main` - clean, deployed, CI green
**Live URL:** https://mbediner.github.io/london-birthday-trip/
**Cache-busted URL:** https://mbediner.github.io/london-birthday-trip/?v=202606241512

---
## Pending Fill-Ins (update in `app.js` when Marianna has the info)

| Item | Variable in app.js | Status |
|---|---|---|
| None | — | Current known fill-ins complete |

---

## Session Log

Newest first. Agents prepend a new entry here at the end of every session.

---

### Session - June 24, 2026 (Codex)

- **Wallet renamed and simplified** - bottom nav now says Wallet; completed app setup, pre-trip checklist, and packing list sections were removed.
- **Flight documents consolidated** - JetBlue confirmation, both UK ETA references, Heathrow eGates guidance, and Heathrow Fast Track now live in Flights with yellow reference chips and copy buttons.
- **Fast Track instructions amended** - Flights and Day 4 now show the 9:00-10:00 AM Fast Track window, 8:45 AM Terminal 2 target arrival, security entrance location, and airside buffer guidance.
- **Flight clutter removed** - per-leg "Before this leg" checklists and the four informational guardrail cards were deleted; flight status rows were rechecked at 375x812 with no abbreviation clipping.
- **Trip push reminders updated** - added JetBlue check-in, offline maps, Heathrow eGates, Big Bus, London Eye, return check-in, and Fast Track ntfy reminders; removed completed phone-setup reminder.
- **QA strengthened** - `tools/qa-site.mjs` and `tools/qa-trip-push-reminders.mjs` now assert the new Flights/Wallet structure and reminder schedule.
- **Release verified** - mobile Flights and Wallet UAT passed at 375x812, `npm run release:prepare` passed, pushed `aee1579`, GitHub Pages deploy `28108896360` was green, and live source checks confirmed cache token `202606241512`.

---

### Session - June 22, 2026 (Codex)

- **Heathrow Fast Track added** - Ticket Wallet now links the Terminal 2 Fast Track Departures confirmation PDF and shows booking reference `AHA2OC`.
- **Departure day updated** - Day 4 now includes Fast Track security in the snapshot and step-by-step route, with the 12:00 entry-time warning and departures-only limitation.
- **Arrival guidance added** - Day 1 and the arrival guardrail now point Tiffany and Collin toward passport control eGates for eligible biometric U.S. passports.
- **QA strengthened** - `tools/qa-site.mjs` now asserts the Fast Track PDF, booking reference, departures-only limitation, and eGate guidance remain present.
- **Release verified** - mobile Guide and Wallet UAT passed at 375x812, `npm run release:prepare` passed, pushed `01939f2`, GitHub Pages deploy `27970100220` was green, and final cache token refreshed to `202606221707`.

---

### Session - June 17, 2026 (Codex)

- **Best-next-tap cards removed** - Guide day cards now open directly into the day snapshot instead of the confusing "Best next tap" directions card.
- **Hotel map preserved** - top quick-action Hotel Map remains available while day snapshots and step-by-step map chips stay in place.
- **QA strengthened** - `tools/qa-site.mjs` now asserts the old best-next-tap card does not return.
- **Release verified** - mobile Guide UAT passed at 375x812, `npm run release:prepare` passed, pushed `5c57bc1`, GitHub Pages deploy `27716136218` was green, and final cache token refreshed to `202606172004`.

---

### Session - June 17, 2026 (Codex)

- **Daily snapshot stops linked** - each open Guide day snapshot now renders every stop as a tappable map row with a `Map` cue.
- **Snapshot destinations mapped** - added practical map targets for all 4 days, including hotel, Heathrow, Tower Hill, London Eye, Camden, JFK Terminal 5, and RDU.
- **QA strengthened** - `tools/qa-site.mjs` now asserts the snapshot stop map renderer remains present.
- **Release verified** - mobile Guide UAT passed at 375x812, `npm run release:prepare` passed, pushed `1bd0cc8`, GitHub Pages deploy `27715112703` was green, and cache token refreshed to `202606171939`.

---

### Session - June 17, 2026 (Codex)

- **Daily guide snapshots added** - each Guide day now has a compact closed-card route preview plus an open-card "Day snapshot" path showing the day flow before step-by-step details.
- **Snapshot copy added for all 4 days** - Day 1 arrival/London Eye flow, Day 2 Tower/Borough/West End flow, Day 3 palace/Camden flow, and Day 4 Heathrow/JFK/RDU travel flow.
- **QA strengthened** - `tools/qa-site.mjs` now asserts the day snapshot renderer remains present.
- **Release verified** - mobile Guide UAT passed at 375x812, `npm run release:prepare` passed, pushed `74525bb`, GitHub Pages deploy `27714339118` was green, and cache token refreshed to `202606171927`.

---

### Session - June 17, 2026 (Codex)

- **London Eye barcodes added** - Ticket Wallet now renders scannable Code 128 barcode graphics for adult `150018675054750217` and child `150018553500106457`, with printed numbers underneath.
- **Mobile UAT verified** - captured a 375x812 full-page wallet screenshot and confirmed both barcode panels display correctly.
- **Release verified** - `npm run release:prepare` passed, pushed `62c1b9c`, GitHub Pages deploy `27713723712` was green, and cache token refreshed to `202606171915`.

---

### Session - June 17, 2026 (Codex)

- **London Eye tickets confirmed** - Ticket Wallet now marks London Eye as set with order `605056784`, adult barcode `150018675054750217`, and child barcode `150018553500106457`.
- **Old ticket warning removed** - replaced the missing scannable ticket warning with the 6:00 PM queue arrival instruction from the tickets.
- **Release verified** - mobile Wallet UAT passed at 375x812, `npm run release:prepare` passed, pushed `0389369`, GitHub Pages deploy `27711147054` was green, and cache token refreshed to `202606171828`.

---

### Session - June 17, 2026 (Codex)

- **Tiffany ETA approved** - Ticket Wallet now shows Tiffany's UK ETA reference `2021-2606-1655-7845`, valid until June 17, 2028, linked to passport ending `1893`.
- **ETA requirements updated** - Pre-Trip checklist and packing list now say the linked passports are the travel requirement and printed ETA emails are not needed.
- **Release verified** - mobile Wallet UAT passed at 375x812, `npm run release:prepare` passed, pushed `8f252f7`, GitHub Pages deploy `27700837755` was green, and cache token refreshed to `202606171533`.

---

### Session - June 15, 2026 (Codex)

- **Pre-Trip missing-items banner removed** - deleted the top wallet progress/missing-items block (`docsProgressBar`) so Pre-Trip goes directly from the page heading into Ticket Wallet.
- **Dead CSS and renderer removed** - removed `renderDocsProgressBar()` plus `.docs-progress` and `.needed-alert` styles.
- **QA strengthened** - `tools/qa-site.mjs` now asserts the old Pre-Trip progress/missing-items block does not return.
- **Release verified** - `npm run release:prepare` passed, pushed `a19e86b`, GitHub Pages deploy `27545419792` was green, live cache token `202606151212` is served, and live source checks confirm the old progress mount/renderer are absent.
- **Note** - Browser MCP became unavailable after an interrupted browser session, so visual UAT was limited to source/live verification plus the existing automated release QA for this small static removal.

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
