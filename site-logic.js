// Pure trip-site helpers shared by the browser app and unit tests.

export function buildMapsUrl(mapQueries, name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueries[name] || name)}`;
}

export function buildDirectionsUrl(mapQueries, from, to, mode = "transit") {
  return [
    "https://www.google.com/maps/dir/?api=1",
    `origin=${encodeURIComponent(mapQueries[from] || from)}`,
    `destination=${encodeURIComponent(mapQueries[to] || to)}`,
    `travelmode=${encodeURIComponent(mode)}`
  ].join("&");
}

export function chooseNextMove(nextMoveTimeline, date = new Date()) {
  const now = date.getTime();
  const active = nextMoveTimeline.find(item => now >= new Date(item.starts).getTime() && now <= new Date(item.ends).getTime());
  if (active) return { ...active, state: "active" };

  const upcoming = nextMoveTimeline.find(item => now < new Date(item.starts).getTime());
  if (upcoming) return { ...upcoming, state: "upcoming" };

  return { ...nextMoveTimeline[nextMoveTimeline.length - 1], state: "complete" };
}

export function resolvePanelFromHash(hash, panelIds, fallback = "overview") {
  const cleanHash = (hash || "").replace(/^#/, "");
  if (!cleanHash) return fallback;
  return panelIds.includes(cleanHash) ? cleanHash : fallback;
}

export function resolveActionHref(mapQueries, action) {
  const target = action[1];
  if (target.startsWith("map:")) return buildMapsUrl(mapQueries, target.slice(4));
  return target;
}
