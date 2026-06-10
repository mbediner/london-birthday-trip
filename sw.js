const CACHE_NAME = "london-trip-v202606101144";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./styles.css?v=202606101144",
  "./app.js",
  "./app.js?v=202606101144",
  "./site-logic.js",
  "./site.webmanifest",
  "./assets/icon.svg",
  "./assets/london_eye.webp",
  "./assets/london_eye.jpg",
  "./assets/tower_bridge.webp",
  "./assets/tower_bridge.jpg",
  "./assets/camden_market.webp",
  "./assets/camden_market.jpg",
  "./assets/flight_itinerary.jpg",
  "./data/flight-status.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || event.request.method !== "GET") return;

  if (requestUrl.pathname.endsWith("/data/flight-status.json")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Always fetch fresh HTML for navigation requests — ensures new releases appear
  // without the user needing to manually clear cache or close all tabs.
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match(request);
  }
}
