'use strict';

const CACHE_NAME = 'naam-kv-v1';

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.match(event.request)
                    .then(response => {
                        return response || fetch(event.request)
                            .then(fetchResponse => {
                                if (fetchResponse.ok) {
                                    cache.put(event.request, fetchResponse.clone());
                                }
                                return fetchResponse;
                            });
                    });
            })
            .catch(() => fetch(event.request)) // Fallback to network
    );
});