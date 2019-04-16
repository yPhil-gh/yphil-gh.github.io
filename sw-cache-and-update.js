// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

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
        // send_message_to_all_clients('Hey yo!');
        return cache.addAll(cacheAssets);
    });
}

self.addEventListener('activate', (e) => {
    console.log('Service worker: Activated');
    // Remove unwanted caches
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

        const cachedResponse = await caches.match(event.request)
              .then(console.log('YUP, IN CACHE'))
              .catch(console.log('NOT IN CACHE'));

        // Si oui, on la returne
        if (cachedResponse) {
            console.log('Serving: [%s] from the CACHE', event.request.url);
            return cachedResponse;
        }
        // Sinon, on sert la requete à partir du réseau
        console.log('Serving: [%s] from the NETWORK', event.request.url);
        return fetch(event.request);
    }().then(console.log('Promised')));
});

// Envoi d'un MSG au client

function msgClient(text) {
    return self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            var message = {
                type: 'refresh',
                text: text
            };
            client.postMessage(JSON.stringify(message));
        });
    });
}

function send_message_to_client(client, msg){
    return new Promise(function(resolve, reject){
        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }else{
                resolve(event.data);
            }
        };

        client.postMessage("SW Says: '"+msg+"'", [msg_chan.port2]);
    });
}

function send_message_to_all_clients(msg){
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            send_message_to_client(client, msg).then(m => console.log("SW Received Message: "+m));
        });
    });
}

self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);
});
