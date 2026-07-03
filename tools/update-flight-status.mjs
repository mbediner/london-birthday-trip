// Scheduled flight-status updater. Run by the "Update Flight Status" workflow
// every 30 minutes: it scrapes FlightStats for each leg that is inside its
// active monitoring window, writes data/flight-status.json (read by the app),
// and emits data/flight-notifications.json for the workflow to push via ntfy.
//
// Environment overrides (used by qa-flight-status.mjs):
//   FLIGHT_STATUS_OUTPUT        - where to write the status JSON
//   FLIGHT_NOTIFICATIONS_OUTPUT - where to write the pending-notifications JSON
//   FLIGHT_STATUS_NOW           - ISO timestamp to treat as "now" (deterministic tests)

import fs from "node:fs/promises";
import path from "node:path";

// The four trip legs. Times are stored in UTC (Z) so window math is timezone-safe.
const flights = [
  {
    id: "ua-3520",
    carrier: "UA",
    appName: "United app",
    number: "3520",
    route: "RDU -> IAD",
    departureIso: "2026-06-25T23:45:00Z",
    arrivalIso: "2026-06-26T01:06:00Z"
  },
  {
    id: "ua-924",
    carrier: "UA",
    appName: "United app",
    number: "924",
    route: "IAD -> LHR",
    departureIso: "2026-06-26T02:15:00Z",
    arrivalIso: "2026-06-26T09:40:00Z"
  },
  {
    id: "b6-20",
    carrier: "B6",
    appName: "JetBlue app",
    number: "20",
    route: "LHR -> JFK",
    departureIso: "2026-06-29T10:55:00Z",
    arrivalIso: "2026-06-29T19:25:00Z"
  },
  {
    id: "b6-585",
    carrier: "B6",
    appName: "JetBlue app",
    number: "585",
    route: "JFK -> RDU",
    departureIso: "2026-06-29T22:30:00Z",
    arrivalIso: "2026-06-30T00:33:00Z"
  }
];

const outputPath = process.env.FLIGHT_STATUS_OUTPUT || path.join("data", "flight-status.json");
const notificationsPath = process.env.FLIGHT_NOTIFICATIONS_OUTPUT || path.join("data", "flight-notifications.json");
const now = process.env.FLIGHT_STATUS_NOW ? new Date(process.env.FLIGHT_STATUS_NOW) : new Date();

// A flight is only checked inside its active window: 24h before scheduled
// departure through 3h after scheduled arrival. Outside it, no network calls.
function activeWindow(flight) {
  const departure = new Date(flight.departureIso);
  const arrival = new Date(flight.arrivalIso);
  const starts = new Date(departure.getTime() - 24 * 60 * 60 * 1000);
  const ends = new Date(arrival.getTime() + 3 * 60 * 60 * 1000);
  return { starts, ends, isActive: now >= starts && now <= ends };
}

// Collapse the many free-text status strings into a small, stable set of
// kinds the UI and notification logic branch on.
function statusKind(status = "") {
  const text = status.toLowerCase();
  if (text.includes("cancel")) return "cancelled";
  if (text.includes("delay") || text.includes("late")) return "delayed";
  if (text.includes("divert")) return "alert";
  if (text.includes("on time") || text.includes("scheduled") || text.includes("landed")) return "ok";
  return "unknown";
}

function pickAfter(lines, label, offset = 1) {
  const index = lines.findIndex(line => line.toLowerCase() === label.toLowerCase());
  return index >= 0 ? lines[index + offset] || null : null;
}

function parseTimeSection(lines, sectionLabel) {
  const start = lines.findIndex(line => line.toLowerCase() === sectionLabel.toLowerCase());
  const section = start >= 0 ? lines.slice(start, start + 24) : [];
  const date = section.find(line => /^\d{2}-[A-Za-z]{3}-\d{4}$/.test(line)) || null;
  return {
    date,
    scheduled: pickAfter(section, "Scheduled"),
    estimated: pickAfter(section, "Estimated"),
    terminal: pickAfter(section, "Terminal"),
    gate: pickAfter(section, "Gate")
  };
}

// FlightStats has no public API, so we parse the reader-mode text dump of the
// tracker page: find the flight header, then read the status word and the
// scheduled/estimated/terminal/gate values out of the surrounding lines.
function parseFlightStats(text, flight) {
  const lines = text
    .replace(/\r/g, "\n")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const flightIndex = lines.findIndex(line => line === `${flight.carrier} ${flight.number}`);
  const routeStart = flightIndex >= 0 ? lines.slice(flightIndex, flightIndex + 90) : lines;
  const statusWindowEnd = routeStart.findIndex(line => line === "Flight Departure Times");
  const statusWindow = statusWindowEnd >= 0 ? routeStart.slice(0, statusWindowEnd) : routeStart.slice(0, 40);
  const statusCandidates = statusWindow.filter(line =>
    /^(on time|delayed|cancelled|canceled|scheduled|landed|departed|in flight|diverted|unknown)$/i.test(line)
  );
  const status = statusCandidates.find(line => /delayed|cancelled|canceled|diverted/i.test(line))
    || statusCandidates.find(line => /on time/i.test(line))
    || statusCandidates.find(line => /landed|departed|in flight/i.test(line))
    || statusCandidates[0]
    || "Status unavailable";

  return {
    status,
    statusKind: statusKind(status),
    departure: parseTimeSection(routeStart, "Flight Departure Times"),
    arrival: parseTimeSection(routeStart, "Flight Arrival Times")
  };
}

// Fetch one flight's status. Try the r.jina.ai reader proxy first (clean text,
// less likely to be bot-blocked), then fall back to the raw tracker page.
async function fetchFlight(flight) {
  const url = `https://www.flightstats.com/v2/flight-tracker/${flight.carrier}/${flight.number}`;
  const readerUrl = `https://r.jina.ai/${url}`;
  let response = await fetch(readerUrl, {
    headers: { "user-agent": "london-birthday-trip flight status checker" }
  });
  if (!response.ok) {
    response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 london-birthday-trip flight status checker"
      }
    });
  }
  if (!response.ok) throw new Error(`FlightStats ${response.status}`);
  const text = await response.text();
  const parsed = parseFlightStats(text, flight);
  return {
    ...flight,
    ...parsed,
    trackerUrl: url,
    lastCheckedAt: now.toISOString(),
    message: parsed.statusKind === "ok"
      ? "FlightStats currently reports this flight as okay."
      : `Check ${flight.appName}, Google Status, and airport screens before acting.`
  };
}

// Main entry: check every active flight, preserve a stable updatedAt when
// nothing is in-window, and persist both the status file and pending pushes.
async function build() {
  const results = [];
  let existing = null;

  try {
    existing = JSON.parse(await fs.readFile(outputPath, "utf8"));
  } catch {
    existing = null;
  }

  for (const flight of flights) {
    const window = activeWindow(flight);
    if (!window.isActive) {
      results.push({
        ...flight,
        status: "Not in monitoring window",
        statusKind: "inactive",
        activeWindow: {
          starts: window.starts.toISOString(),
          ends: window.ends.toISOString()
        },
        lastCheckedAt: null,
        message: "Checks start 24 hours before departure."
      });
      continue;
    }

    try {
      results.push({
        ...(await fetchFlight(flight)),
        activeWindow: {
          starts: window.starts.toISOString(),
          ends: window.ends.toISOString()
        }
      });
    } catch (error) {
      results.push({
        ...flight,
        status: "Could not update",
        statusKind: "unknown",
        activeWindow: {
          starts: window.starts.toISOString(),
          ends: window.ends.toISOString()
        },
        lastCheckedAt: now.toISOString(),
        message: `${error.message}. Use ${flight.appName} or Google Status for live status.`
      });
    }
  }

  const hasActiveFlight = results.some(flight => flight.statusKind !== "inactive");
  const existingHadActiveFlight = existing?.flights?.some(flight => flight.statusKind !== "inactive") || false;
  const updatedAt = hasActiveFlight || existingHadActiveFlight
    ? now.toISOString()
    : existing?.updatedAt || null;
  const notifications = buildNotifications(existing?.flights || [], results);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify({
    updatedAt,
    source: "scheduled-flightstats",
    note: "Automated checks run only inside each flight's active window: 24 hours before departure through 3 hours after scheduled arrival.",
    flights: results
  }, null, 2) + "\n");
  await fs.writeFile(notificationsPath, JSON.stringify({
    generatedAt: now.toISOString(),
    notifications
  }, null, 2) + "\n");
}

await build();

// Decide which flights warrant a phone push this run. Fires when a flight
// first enters its window, or when its status "signature" (status + estimated
// times + gate) changes — so unchanged statuses never re-notify.
function buildNotifications(previousFlights, nextFlights) {
  const previousById = new Map(previousFlights.map(flight => [flight.id, flight]));
  const notifications = [];

  for (const next of nextFlights) {
    const previous = previousById.get(next.id);
    if (next.statusKind === "inactive") continue;

    const previousSignature = previous
      ? `${previous.statusKind}|${previous.status}|${previous.departure?.estimated || ""}|${previous.arrival?.estimated || ""}|${previous.departure?.gate || ""}`
      : "";
    const nextSignature = `${next.statusKind}|${next.status}|${next.departure?.estimated || ""}|${next.arrival?.estimated || ""}|${next.departure?.gate || ""}`;

    const enteringWindow = !previous || previous.statusKind === "inactive";
    const importantChange = previousSignature !== nextSignature;
    const alert = ["delayed", "cancelled", "alert", "unknown"].includes(next.statusKind);

    if (!enteringWindow && !importantChange) continue;

    notifications.push({
      id: next.id,
      title: alert ? `Mom and Dad alert: ${next.carrier} ${next.number}` : `Mom and Dad check: ${next.carrier} ${next.number}`,
      message: [
        `${next.route}: ${next.status}.`,
        `Departure: ${next.departure?.estimated || next.departure?.scheduled || "not available"}.`,
        `Arrival: ${next.arrival?.estimated || next.arrival?.scheduled || "not available"}.`,
        `Gate: ${next.departure?.gate || "not available"}.`
      ].join(" "),
      priority: alert ? "high" : "default",
      tags: alert ? "warning,airplane" : "airplane"
    });
  }

  return notifications;
}
