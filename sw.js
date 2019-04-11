const cacheName = 'v1';

console.log('SW: I am alive, the cache is [%s]', cacheName);

const cacheAssets = [
    'index.html',
    'style.css',
    'favicon.ico'
];

self.addEventListener('install', (e) => {
    console.log('SW: INSTALLED');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                return cache.addAll(cacheAssets);
            })
    );
});

self.addEventListener('activate', (e) => {
    console.log('SW: ACTIVATED');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('SW: CLEARING OLD (%s) CACHE', cache);
                        return caches.delete(cache);
                    }
                })
            );
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
            return fetch(event.request)
                .then((response) => {
                    let responseClone = response.clone();

                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                    return response;
                }).catch((err) => {
                    console.log('SW: Problem reading the file in cache [%s]', err);
                    return caches.match(event.request);
                });
        }
    }));
});
