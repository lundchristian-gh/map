const CACHE_NAME = "map-app-cache";

const urlsToCache = [
    "/",
    "/static/style.css",
    "/static/script.js",
    "/static/const.js",
    "/static/utils.js",
    "/static/favicon.ico",
    "/data",
    "/token",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return (
                cachedResponse ||
                fetch(event.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
            );
        })
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// use this in main script
function addServiceWorkers() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register(Endpoint.Worker)
            .then((registration) => {
                console.log(registration.scope);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}
