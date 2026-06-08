import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { dueReminders, markSent, tripReminders } from "./update-trip-push-reminders.mjs";

const node = process.execPath;
const script = path.resolve("tools", "update-trip-push-reminders.mjs");
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "trip-push-reminders-qa-"));
const stateOutput = path.join(tmpDir, "trip-push-state.json");
const notificationsOutput = path.join(tmpDir, "trip-push-notifications.json");

function runAt(iso) {
  execFileSync(node, [script], {
    stdio: "inherit",
    env: {
      ...process.env,
      TRIP_PUSH_STATE_OUTPUT: stateOutput,
      TRIP_PUSH_NOTIFICATIONS_OUTPUT: notificationsOutput,
      TRIP_PUSH_NOW: iso
    }
  });
}

assert.ok(tripReminders.length >= 10, "trip push should cover setup, travel, day, photo, and return reminders");
assert.equal(
  tripReminders.every(reminder => reminder.title.startsWith("Mom and Dad")),
  true,
  "every reminder should clearly come from Mom and Dad"
);

const beforeTrip = dueReminders(tripReminders, { sent: {} }, new Date("2026-06-24T12:00:00-04:00"));
assert.equal(beforeTrip.length, 0, "nothing should send before the first reminder time");

const firstDue = dueReminders(tripReminders, { sent: {} }, new Date("2026-06-24T20:05:00-04:00"));
assert.deepEqual(firstDue.map(reminder => reminder.id), ["phone-setup-2026-06-24"]);

const stateAfterFirst = markSent({ sent: {} }, firstDue, new Date("2026-06-24T20:05:00-04:00"));
assert.equal(
  dueReminders(tripReminders, stateAfterFirst, new Date("2026-06-24T20:10:00-04:00")).length,
  0,
  "already-sent reminders should not repeat"
);

runAt("2026-06-26T20:05:00+01:00");
const firstRun = JSON.parse(await fs.readFile(notificationsOutput, "utf8"));
assert.ok(firstRun.notifications.some(reminder => reminder.id === "photo-mission-2026-06-26"), "photo mission should use ntfy push");
assert.equal(
  firstRun.notifications.every(reminder => reminder.priority && reminder.tags),
  true,
  "notifications should include ntfy priority and tags"
);

runAt("2026-06-26T20:10:00+01:00");
const duplicateRun = JSON.parse(await fs.readFile(notificationsOutput, "utf8"));
assert.equal(duplicateRun.notifications.length, 0, "same reminders should not repeat after state is written");

console.log("Trip push reminder QA passed.");
