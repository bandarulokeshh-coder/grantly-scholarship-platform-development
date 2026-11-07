/**
 * Grantly Service Worker
 * Provides offline shell caching so the app loads instantly on repeat visits
 * and works without a network for core navigation.
 */

const CACHE_NAME = "grantly-v1";
const STATIC_ASSETS = [
  "/",
  "/discover",
  "/dashboard",
  "/documents",
  "/compare",
  "/manifest.json",
  "/icon.svg",
];

// Install: cache the static shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, network-first for pages
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external domains
  if (request.method !== "GET" || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Cache-first for static assets
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith("/_next")) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        }),
      ),
    );
    return;
  }

  // Network-first for pages and API routes
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request)),
  );
});