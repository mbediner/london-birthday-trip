import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDirectionsUrl,
  buildMapsUrl,
  chooseNextMove,
  resolveActionHref,
  resolvePanelFromHash
} from "../site-logic.js";

const sampleQueries = {
  "Hotel": "Holiday Inn Express London - Victoria, 106-110 Belgrave Road, London SW1V 2BJ",
  "Pimlico Station": "Pimlico Station, Bessborough Street, London SW1V 2JA"
};

test("buildMapsUrl encodes a known map query", () => {
  const url = buildMapsUrl(sampleQueries, "Hotel");
  assert.match(url, /google\.com\/maps\/search/);
  assert.match(url, /Holiday%20Inn%20Express/);
});

test("buildDirectionsUrl encodes origin, destination, and travel mode", () => {
  const url = buildDirectionsUrl(sampleQueries, "Hotel", "Pimlico Station", "walking");
  assert.match(url, /origin=/);
  assert.match(url, /destination=/);
  assert.match(url, /travelmode=walking/);
});

test("chooseNextMove returns the active move when the date is in range", () => {
  const timeline = [
    {
      starts: "2026-06-01T00:00:00-04:00",
      ends: "2026-06-10T00:00:00-04:00",
      label: "Before departure",
      title: "Finish setup"
    },
    {
      starts: "2026-06-11T00:00:00-04:00",
      ends: "2026-06-20T00:00:00-04:00",
      label: "Travel week",
      title: "Pack"
    }
  ];

  const active = chooseNextMove(timeline, new Date("2026-06-05T12:00:00-04:00"));
  assert.equal(active.label, "Before departure");
  assert.equal(active.state, "active");
});

test("resolvePanelFromHash falls back when the hash is not a panel id", () => {
  const result = resolvePanelFromHash("#day-2", ["overview", "move", "flights"], "overview");
  assert.equal(result, "overview");
});

test("resolveActionHref converts map actions into map URLs", () => {
  const url = resolveActionHref(sampleQueries, ["Hotel map", "map:Hotel"]);
  assert.match(url, /maps\/search/);
  assert.match(url, /Holiday%20Inn%20Express/);
});
