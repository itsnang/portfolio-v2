// The Main Site used to be a PWA with a generated service worker at this path.
// Browsers that installed it keep checking /sw.js for updates, so this no-op
// replaces it: on install it takes over, unregisters itself and reloads open
// tabs so they stop being served from the old cache. Keep it until at least
// 12 months after it was first deployed.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) client.navigate(client.url);
    })()
  );
});
