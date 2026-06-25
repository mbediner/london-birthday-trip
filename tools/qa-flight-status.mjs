import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const node = process.execPath;
const script = path.resolve("tools", "update-flight-status.mjs");
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "flight-status-qa-"));
const output = path.join(tmpDir, "flight-status.json");
const notificationsOutput = path.join(tmpDir, "flight-notifications.json");

async function runAt(iso) {
  execFileSync(node, [script], {
    stdio: "inherit",
    env: {
      ...process.env,
      FLIGHT_STATUS_OUTPUT: output,
      FLIGHT_NOTIFICATIONS_OUTPUT: notificationsOutput,
      FLIGHT_STATUS_NOW: iso
    }
  });
  return {
    status: JSON.parse(await fs.readFile(output, "utf8")),
    notifications: JSON.parse(await fs.readFile(notificationsOutput, "utf8"))
  };
}

await fs.writeFile(output, JSON.stringify({
  updatedAt: "stable-outside-window",
  source: "scheduled-flightstats",
  flights: [
    { id: "ua-3520", statusKind: "inactive" },
    { id: "ua-924", statusKind: "inactive" },
    { id: "b6-20", statusKind: "inactive" },
    { id: "b6-585", statusKind: "inactive" }
  ]
}, null, 2));

const outsideRun = await runAt("2026-06-06T12:00:00Z");
const outside = outsideRun.status;
assert.equal(outside.updatedAt, "stable-outside-window", "outside windows should not churn updatedAt");
assert.equal(outside.flights.every(flight => flight.statusKind === "inactive"), true, "all flights should be inactive outside windows");
assert.equal(outsideRun.notifications.notifications.length, 0, "outside windows should not generate notifications");

const firstTravelWindowRun = await runAt("2026-06-25T19:00:00Z");
const firstTravelWindow = firstTravelWindowRun.status;
const outboundDomestic = firstTravelWindow.flights.find(flight => flight.id === "ua-3520");
const outboundInternational = firstTravelWindow.flights.find(flight => flight.id === "ua-924");
const returnInternational = firstTravelWindow.flights.find(flight => flight.id === "b6-20");
assert.notEqual(firstTravelWindow.updatedAt, "stable-outside-window", "active windows should update updatedAt");
assert.equal(outboundDomestic.carrier, "UA", "active RDU -> IAD should use United tracking");
assert.equal(outboundInternational.carrier, "UA", "active IAD -> LHR should use United tracking");
assert.ok(outboundDomestic.lastCheckedAt, "active RDU -> IAD should be checked");
assert.ok(outboundInternational.lastCheckedAt, "active IAD -> LHR should be checked");
assert.equal(returnInternational.statusKind, "inactive", "return flight should remain inactive during outbound window");
assert.ok(firstTravelWindowRun.notifications.notifications.length >= 1, "entering an active window should generate at least one phone notification");
assert.equal(
  firstTravelWindowRun.notifications.notifications.every(notification => notification.title.startsWith("Mom and Dad")),
  true,
  "phone notification titles should clearly say they are from Mom and Dad"
);

const duplicateOutboundRun = await runAt("2026-06-25T19:00:00Z");
assert.equal(duplicateOutboundRun.notifications.notifications.length, 0, "unchanged status should not repeat phone notifications");

const returnWindowRun = await runAt("2026-06-29T21:00:00Z");
const returnWindow = returnWindowRun.status;
const lhrToJfk = returnWindow.flights.find(flight => flight.id === "b6-20");
const jfkToRdu = returnWindow.flights.find(flight => flight.id === "b6-585");
assert.ok(lhrToJfk.lastCheckedAt, "active LHR -> JFK should be checked");
assert.ok(jfkToRdu.lastCheckedAt, "active JFK -> RDU should be checked");
assert.ok(returnWindowRun.notifications.notifications.length >= 1, "return active window should generate phone notifications");

console.log("Flight status QA passed.");
