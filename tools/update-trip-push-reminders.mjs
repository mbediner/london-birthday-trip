import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const tripReminders = [
  {
    id: "jetblue-checkin-outbound-2026-06-24",
    sendAt: "2026-06-24T14:00:00-04:00",
    title: "Mom and Dad: check in on JetBlue",
    message: "Open the JetBlue app and check in for B6 2184 / B6 1620. Confirmation KDHSOU. Save boarding passes on both phones.",
    priority: "default",
    tags: "bell,airplane"
  },
  {
    id: "offline-london-maps-2026-06-24",
    sendAt: "2026-06-24T21:00:00-04:00",
    title: "Mom and Dad: download offline London maps",
    message: "Open Google Maps tonight and download offline London maps before travel day. Keep the trip guide link handy too.",
    priority: "default",
    tags: "world_map,iphone"
  },
  {
    id: "rdu-departure-2026-06-25",
    sendAt: "2026-06-25T10:00:00-04:00",
    title: "Mom and Dad: leave for RDU soon",
    message: "Target RDU by 12:30 PM EDT for B6 2184. Keep passports, consent letter, chargers, and JetBlue confirmation KDHSOU handy.",
    priority: "high",
    tags: "warning,airplane"
  },
  {
    id: "heathrow-egates-2026-06-26",
    sendAt: "2026-06-26T04:30:00+01:00",
    title: "Mom and Dad: use Heathrow eGates",
    message: "When you arrive at Heathrow, use passport control eGates / biometric line if available. Eligible biometric U.S. passports can use eGates for travelers 10+ with an adult.",
    priority: "high",
    tags: "passport_control,airplane"
  },
  {
    id: "london-arrival-2026-06-26",
    sendAt: "2026-06-26T06:45:00+01:00",
    title: "Mom and Dad: go to the hotel",
    message: "After immigration and bags, go straight to Holiday Inn Express London - Victoria and ask them to store luggage.",
    priority: "high",
    tags: "round_pushpin,hotel"
  },
  {
    id: "big-bus-activate-2026-06-26",
    sendAt: "2026-06-26T09:30:00+01:00",
    title: "Mom and Dad: activate your bus ticket now",
    message: "Open the Big Bus Tours app → tap your ticket → press Activate. Ticket countdown starts. Walk to Victoria Station / Buckingham Palace Road entrance and board. Booking ref VVXCH9SM. If needed, open Wallet → Big Bus ticket PDF.",
    priority: "high",
    tags: "bus,ticket"
  },
  {
    id: "day-1-start-2026-06-26",
    sendAt: "2026-06-26T10:00:00+01:00",
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
    message: "Fast Track window is being amended to 9:00-10:00 AM. At Terminal 2, follow Fast Track wayfinding next to main security entrances. Reference AHA2OC. Open Flights → Fast Track or the PDF.",
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
