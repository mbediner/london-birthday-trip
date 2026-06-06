import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const node = process.execPath;
const script = path.resolve("tools", "update-flight-status.mjs");
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "flight-status-qa-"));
const output = path.join(tmpDir, "flight-status.json");

async function runAt(iso) {
  execFileSync(node, [script], {
    stdio: "inherit",
    env: {
      ...process.env,
      FLIGHT_STATUS_OUTPUT: output,
      FLIGHT_STATUS_NOW: iso
    }
  });
  return JSON.parse(await fs.readFile(output, "utf8"));
}

await fs.writeFile(output, JSON.stringify({
  updatedAt: "stable-outside-window",
  source: "scheduled-flightstats",
  flights: [
    { id: "b6-2184", statusKind: "inactive" },
    { id: "b6-1620", statusKind: "inactive" },
    { id: "b6-20", statusKind: "inactive" },
    { id: "b6-585", statusKind: "inactive" }
  ]
}, null, 2));

const outside = await runAt("2026-06-06T12:00:00Z");
assert.equal(outside.updatedAt, "stable-outside-window", "outside windows should not churn updatedAt");
assert.equal(outside.flights.every(flight => flight.statusKind === "inactive"), true, "all flights should be inactive outside windows");

const firstTravelWindow = await runAt("2026-06-25T19:00:00Z");
const outboundDomestic = firstTravelWindow.flights.find(flight => flight.id === "b6-2184");
const outboundInternational = firstTravelWindow.flights.find(flight => flight.id === "b6-1620");
const returnInternational = firstTravelWindow.flights.find(flight => flight.id === "b6-20");
assert.notEqual(firstTravelWindow.updatedAt, "stable-outside-window", "active windows should update updatedAt");
assert.ok(outboundDomestic.lastCheckedAt, "active RDU -> BOS should be checked");
assert.ok(outboundInternational.lastCheckedAt, "active BOS -> LHR should be checked");
assert.equal(returnInternational.statusKind, "inactive", "return flight should remain inactive during outbound window");

const returnWindow = await runAt("2026-06-29T21:00:00Z");
const lhrToJfk = returnWindow.flights.find(flight => flight.id === "b6-20");
const jfkToRdu = returnWindow.flights.find(flight => flight.id === "b6-585");
assert.ok(lhrToJfk.lastCheckedAt, "active LHR -> JFK should be checked");
assert.ok(jfkToRdu.lastCheckedAt, "active JFK -> RDU should be checked");

console.log("Flight status QA passed.");
