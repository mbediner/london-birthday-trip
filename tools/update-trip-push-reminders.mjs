import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const tripReminders = [
  {
    id: "offline-london-maps-2026-06-24",
    sendAt: "2026-06-24T21:00:00-04:00",
    title: "Mom and Dad: download offline London maps",
    message: "Open Google Maps tonight and download offline London maps before travel day. Keep the trip guide link handy too.",
    priority: "default",
    tags: "world_map,iphone"
  },
  {
    id: "united-leave-home-2026-06-25",
    sendAt: "2026-06-25T17:00:00-04:00",
    title: "Mom and Dad: leave home for RDU",
    message: "Leave home now for RDU Terminal 2. United confirmation I77CEV. UA 3520 departs 7:45 PM from Gate D15, then UA 924 departs IAD at 10:15 PM.",
    priority: "high",
    tags: "warning,airplane"
  },
  {
    id: "united-arrive-rdu-2026-06-25",
    sendAt: "2026-06-25T17:45:00-04:00",
    title: "Mom and Dad: arrive at RDU",
    message: "Arrive RDU Terminal 2 between 5:45 and 5:55 PM. Go inside and head straight to standard security. United confirmation I77CEV.",
    priority: "high",
    tags: "airplane,ticket"
  },
  {
    id: "united-security-2026-06-25",
    sendAt: "2026-06-25T18:00:00-04:00",
    title: "Mom and Dad: clear RDU security",
    message: "Go straight through standard security and aim to be clear by 6:30 PM. After security, walk to Gate D15 for UA 3520.",
    priority: "high",
    tags: "passport_control,airplane"
  },
  {
    id: "united-gate-d15-2026-06-25",
    sendAt: "2026-06-25T18:30:00-04:00",
    title: "Mom and Dad: go to Gate D15",
    message: "Walk to Gate D15 now and be at the gate by 6:45 PM. Boarding for UA 3520 is likely around 7:05 PM.",
    priority: "high",
    tags: "airplane,ticket"
  },
  {
    id: "united-boarding-2026-06-25",
    sendAt: "2026-06-25T19:05:00-04:00",
    title: "Mom and Dad: UA 3520 boarding",
    message: "Boarding for UA 3520 should be starting soon at Gate D15. Keep the IAD connection in mind: UA 924 leaves at 10:15 PM.",
    priority: "high",
    tags: "warning,airplane"
  },
  {
    id: "heathrow-egates-2026-06-26",
    sendAt: "2026-06-26T08:30:00+01:00",
    title: "Mom and Dad: use Heathrow eGates",
    message: "When you arrive at Heathrow, use passport control eGates / biometric line if available. Eligible biometric U.S. passports can use eGates for travelers 10+ with an adult.",
    priority: "high",
    tags: "passport_control,airplane"
  },
  {
    id: "london-arrival-2026-06-26",
    sendAt: "2026-06-26T10:50:00+01:00",
    title: "Mom and Dad: go to the hotel",
    message: "After UA 924 lands, clear immigration, collect bags, then go straight to Holiday Inn Express London - Victoria and ask them to store luggage.",
    priority: "high",
    tags: "round_pushpin,hotel"
  },
  {
    id: "big-bus-activate-2026-06-26",
    sendAt: "2026-06-26T13:00:00+01:00",
    title: "Mom and Dad: activate your bus ticket now",
    message: "Open the Big Bus Tours app → tap your ticket → press Activate. Ticket countdown starts. Walk to Victoria Station / Buckingham Palace Road entrance and board. Booking ref VVXCH9SM. If needed, open Wallet → Big Bus ticket PDF.",
    priority: "high",
    tags: "bus,ticket"
  },
  {
    id: "day-1-start-2026-06-26",
    sendAt: "2026-06-26T12:30:00+01:00",
    title: "Mom and Dad: Day 1 starts easy",
    message: "Open Day 1 in the trip guide. Keep it simple: Victoria, Westminster photos, South Bank, then Uber or black cab back.",
    priority: "default",
    tags: "cityscape,camera"
  },
  {
    id: "london-eye-2026-06-26",
    sendAt: "2026-06-26T15:00:00+01:00",
    title: "Mom and Dad: London Eye tickets at 6 PM",
    message: "London Eye is 6:00 PM. Open Wallet → London Eye for barcodes. Go to Riverside Building, County Hall, Westminster Bridge Rd and join the queue at the timeslot.",
    priority: "high",
    tags: "ferris_wheel,ticket"
  },
  {
    id: "photo-mission-2026-06-26",
    sendAt: "2026-06-26T20:00:00+01:00",
    title: "Mom and Dad: photo mission",
    message: "Send one selfie together, one London landmark or street view, and one food, market, or funny moment.",
    priority: "default",
    tags: "camera,heart"
  },
  {
    id: "day-2-start-2026-06-27",
    sendAt: "2026-06-27T08:30:00+01:00",
    title: "Mom and Dad: Day 2 route",
    message: "Open Day 2 in the trip guide. Tower Hill, Tower Bridge, Borough Market, then West End. If tired, take Uber back.",
    priority: "default",
    tags: "bridge_at_night,map"
  },
  {
    id: "photo-mission-2026-06-27",
    sendAt: "2026-06-27T20:00:00+01:00",
    title: "Mom and Dad: photo mission",
    message: "Send one selfie together, one landmark or street view, and one food, market, or funny moment.",
    priority: "default",
    tags: "camera,heart"
  },
  {
    id: "day-3-start-2026-06-28",
    sendAt: "2026-06-28T08:30:00+01:00",
    title: "Mom and Dad: Day 3 route",
    message: "Open Day 3 in the trip guide. Palace photos, St. James's Park, Camden in daylight, final dinner central.",
    priority: "default",
    tags: "crown,map"
  },
  {
    id: "return-checkin-2026-06-28",
    sendAt: "2026-06-28T11:55:00+01:00",
    title: "Mom and Dad: check in for return flights",
    message: "24 hours before B6 20. Open JetBlue app and check in for LHR→JFK and JFK→RDU. Confirmation KDHSOU. Save boarding passes.",
    priority: "high",
    tags: "airplane,ticket"
  },
  {
    id: "photo-mission-2026-06-28",
    sendAt: "2026-06-28T20:00:00+01:00",
    title: "Mom and Dad: photo mission",
    message: "Send one selfie together, one landmark or street view, and one food, market, or funny moment.",
    priority: "default",
    tags: "camera,heart"
  },
  {
    id: "heathrow-departure-2026-06-29",
    sendAt: "2026-06-29T06:45:00+01:00",
    title: "Mom and Dad: leave for Heathrow",
    message: "Leave the hotel around 7:00-7:15 AM BST and target Terminal 2 around 8:45 AM. Keep passports, boarding passes, and Fast Track reference AHA2OC handy.",
    priority: "high",
    tags: "warning,airplane"
  },
  {
    id: "heathrow-fast-track-2026-06-29",
    sendAt: "2026-06-29T09:00:00+01:00",
    title: "Mom and Dad: use Heathrow Fast Track",
    message: "Fast Track window is 9:30-10:30 AM. At Terminal 2, follow Fast Track wayfinding next to main security entrances. Reference AHA2OC. Open Flights → Fast Track or the PDF.",
    priority: "high",
    tags: "lock,ticket"
  },
  {
    id: "home-photo-wrap-2026-06-29",
    sendAt: "2026-06-29T21:00:00-04:00",
    title: "Mom and Dad: send favorite photos",
    message: "You should be back in Raleigh. Send Mom and Dad the best photos from the London birthday trip.",
    priority: "default",
    tags: "camera,house"
  }
];

const statePath = process.env.TRIP_PUSH_STATE_OUTPUT || path.join("data", "trip-push-state.json");
const notificationsPath = process.env.TRIP_PUSH_NOTIFICATIONS_OUTPUT || path.join("data", "trip-push-notifications.json");
const now = new Date(process.env.TRIP_PUSH_NOW || Date.now());

export async function readState(filePath = statePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { sent: {} };
    throw error;
  }
}

export function dueReminders(reminders, state, at = now) {
  return reminders.filter(reminder => {
    if (state.sent?.[reminder.id]) return false;
    return new Date(reminder.sendAt) <= at;
  });
}

export function markSent(state, reminders, sentAt = now) {
  const nextState = {
    sent: { ...(state.sent || {}) }
  };

  for (const reminder of reminders) {
    nextState.sent[reminder.id] = sentAt.toISOString();
  }

  return nextState;
}

async function build() {
  const state = await readState();
  const notifications = dueReminders(tripReminders, state, now);
  const nextState = markSent(state, notifications, now);

  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(nextState, null, 2) + "\n");
  await fs.writeFile(notificationsPath, JSON.stringify({
    generatedAt: now.toISOString(),
    notifications
  }, null, 2) + "\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await build();
}
