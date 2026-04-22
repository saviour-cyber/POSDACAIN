const CACHE_NAME = 'nexasync-pos-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A simple pass-through fetch event listener.
  // This satisfies the PWA requirements for Chrome/Android without aggressively caching Next.js server actions.
  event.respondWith(
    (async () => {
      try {
        return await fetch(event.request);
      } catch (error) {
        // If offline and trying to fetch a document (page), return a generic fallback or just let it fail.
        // For a full offline experience, you would use a pre-cached offline.html here.
        return new Response("Offline Mode: Please check your connection.", {
           status: 503,
           statusText: "Service Unavailable",
           headers: new Headers({ "Content-Type": "text/plain" }),
        });
      }
    })()
  );
});
