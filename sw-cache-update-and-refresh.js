// https://serviceworke.rs/strategy-cache-update-and-refresh_service-worker_doc.html

var cacheName = 'v3';

console.log('SW: I am alive, the cache is [%s]', cacheName);

var cacheAssets = [
    'index.html',
    'style.css',
    'favicon.ico'
];

// On install, cache some resource.

self.addEventListener('install', function(evt) {
    console.log('The service worker is being installed.');

    // Open a cache and use addAll() with an array of assets to add all of them to the cache. Ask the service worker to keep installing until the returning promise resolves.

    evt.waitUntil(caches.open(cacheName).then(function (cache) {
        cache.addAll(cacheAssets);
    }));
});

// On fetch, use cache but update the entry with the latest contents from the server.

self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');

    // You can use respondWith() to answer ASAP…

    evt.respondWith(fromCache(evt.request));

    // …and waitUntil() to prevent the worker to be killed until the cache is updated.

    evt.waitUntil(
        update(evt.request)

        // Finally, send a message to the client to inform it about the resource is up to date.

        // .then(refresh)
    );
});

// Open the cache where the assets were stored and search for the requested resource. Notice that in case of no matching, the promise still resolves but it does with undefined as value.

function fromCache(request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request);
    });
}

// Update consists in opening the cache, performing a network request and storing the new response data.

function update(request) {
    return caches.open(cacheName).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response.clone()).then(function () {
                return response;
            });
        });
    });
}


function refresh(response) {
    return self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {


            console.log('REFRESH!!');

            // Sends a message to the clients.
            // Encode which resource has been updated. By including the ETag the client can check if the content has changed.
            // Notice not all servers return the ETag header. If this is not provided you should use other cache headers or rely on your own means to check if the content has changed.

            var message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };

            // Tell the client about the update.

            client.postMessage(JSON.stringify(message));
        });
    });
}
