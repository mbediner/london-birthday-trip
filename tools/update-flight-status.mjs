import fs from "node:fs/promises";
import path from "node:path";

const flights = [
  {
    id: "b6-2184",
    number: "2184",
    route: "RDU -> BOS",
    departureIso: "2026-06-25T18:34:00Z",
    arrivalIso: "2026-06-25T20:34:00Z"
  },
  {
    id: "b6-1620",
    number: "1620",
    route: "BOS -> LHR",
    departureIso: "2026-06-25T22:39:00Z",
    arrivalIso: "2026-06-26T05:30:00Z"
  },
  {
    id: "b6-20",
    number: "20",
    route: "LHR -> JFK",
    departureIso: "2026-06-29T10:55:00Z",
    arrivalIso: "2026-06-29T19:25:00Z"
  },
  {
    id: "b6-585",
    number: "585",
    route: "JFK -> RDU",
    departureIso: "2026-06-29T22:30:00Z",
    arrivalIso: "2026-06-30T00:33:00Z"
  }
];

const outputPath = process.env.FLIGHT_STATUS_OUTPUT || path.join("data", "flight-status.json");
const now = process.env.FLIGHT_STATUS_NOW ? new Date(process.env.FLIGHT_STATUS_NOW) : new Date();

function activeWindow(flight) {
  const departure = new Date(flight.departureIso);
  const arrival = new Date(flight.arrivalIso);
  const starts = new Date(departure.getTime() - 24 * 60 * 60 * 1000);
  const ends = new Date(arrival.getTime() + 3 * 60 * 60 * 1000);
  return { starts, ends, isActive: now >= starts && now <= ends };
}

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

function parseFlightStats(text, flight) {
  const lines = text
    .replace(/\r/g, "\n")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const flightIndex = lines.findIndex(line => line === `B6 ${flight.number}`);
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

async function fetchFlight(flight) {
  const url = `https://www.flightstats.com/v2/flight-tracker/B6/${flight.number}`;
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
      : "Check JetBlue app, Google Status, and airport screens before acting."
  };
}

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
        message: `${error.message}. Use JetBlue app or Google Status for live status.`
      });
    }
  }

  const hasActiveFlight = results.some(flight => flight.statusKind !== "inactive");
  const existingHadActiveFlight = existing?.flights?.some(flight => flight.statusKind !== "inactive") || false;
  const updatedAt = hasActiveFlight || existingHadActiveFlight
    ? now.toISOString()
    : existing?.updatedAt || null;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify({
    updatedAt,
    source: "scheduled-flightstats",
    note: "Automated checks run only inside each flight's active window: 24 hours before departure through 3 hours after scheduled arrival.",
    flights: results
  }, null, 2) + "\n");
}

await build();
