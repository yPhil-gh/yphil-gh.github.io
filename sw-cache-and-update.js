// Détails des fichiers à pre-cacher
var cacheName = 'v2';

console.log('SW: I am alive, the cache is [%s]', cacheName);

var cacheAssets = [
    'index.html',
    'app.js',
    'style.css',
    'favicon.ico'
];

// Pre-cache à l'installation du SW
self.addEventListener('install', function(evt) {
    console.log('The service worker is being installed.');

    // Le SW continue à installer jusqu'au return de la promise

    evt.waitUntil(precache());

});

// On renvoie une promise résolue quand tous les fichiers ont été pre-cachés
function precache() {
    return caches.open(cacheName).then(function (cache) {
        return cache.addAll(cacheAssets);
    });
}

// Dev helper: Suppression du vieux cache
self.addEventListener('activate', (e) => {
    console.log('Service worker: Activated');
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing old cache: %s', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

addEventListener('fetch', event => {

    // On intercepte la requete, et on la gere nous-mêmes.
    event.respondWith(async function() {

        // On regarde si elle est dans le cache
        const cachedResponse = await caches.match(event.request);

        // Si oui, on la returne
        if (cachedResponse) {
            console.log('Serving: [%s] from the CACHE', event.request.url);
            return cachedResponse;
        }

        // Sinon, on sert la requete à partir du réseau, et ensuite on la cache.
        console.log('Serving: [%s] from the NETWORK', event.request.url);
        return fetch(event.request).then(updateCache(event.request));
    }());
});

function updateCache(request) {
    return caches.open(cacheName).then(cache => {
        return fetch(request).then(response => {
            const resClone = response.clone();
            if (response.status < 400)
                return cache.put(request, resClone);
            return response;
        });
    });
}
