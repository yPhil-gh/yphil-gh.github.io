const cacheName = 'v1';

console.log('SW: I am alive, the cache is [%s]', cacheName);

const cacheAssets = [
    'index.html',
    'style.css',
    'favicon.ico'
];

self.addEventListener('install', (e) => {
    console.log('Service worker installed');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                return cache.addAll(cacheAssets);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then((response) => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then((response) => {
                // response may be used only once
                // we need to save clone to put one copy in cache
                // and serve second one
                let responseClone = response.clone();

                caches.open(cacheName).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                return caches.match(event.request);
            });
        }
    }));
});
