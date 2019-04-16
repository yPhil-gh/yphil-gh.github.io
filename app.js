// Cache details
var cacheDetails = document.getElementById('cacheDetails');
cacheDetails.innerHTML = "plip";

var sW = 'sw-cache-and-update.js';

// function reload() {
//     window.location.reload(true);
// }

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.getRegistrations().then((registrations) => {
//         for (let registration of registrations) {
//             console.log('REG scriptURL: [%s] scope: %s', registration.active.scriptURL, registration.scope);
//             // if (registration.active.scriptURL == 'sw.js') {
//             //     console.log('UNREG scriptURL: [%s] scope: %s', registration.active.scriptURL, registration.scope);
//             //     registration.unregister();
//             // }
//         }
//     });
// }

// Register the ServiceWorker limiting its action to those URLs starting by controlled. The scope is not a path but a prefix. First, it is converted into an absolute URL, then used to determine if a page is controlled by testing it is a prefix of the request URL.

navigator.serviceWorker.register(sW, {
    scope: '/'
});

function send_message_to_sw(msg){
    navigator.serviceWorker.controller.postMessage("Client 1 says '"+msg+"'");
}

if('serviceWorker' in navigator){
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('message', function(event){
        console.log("Client 1 Received Message: " + event.data);
        event.ports[0].postMessage("Client 1 Says 'Hello back!'");
    });
}
