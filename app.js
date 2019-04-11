const debugDiv = document.getElementById('debugDiv');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' }).then((reg) => {

        if(reg.installing) {
            console.log('Service worker installing');
        } else if(reg.waiting) {
            console.log('Service worker waiting');
        } else if(reg.active) {
            console.log('Service worker active');
        }

    }).catch(function(error) {
        // registration failed
        console.log('Registration failed: %s ', error);
    });

    navigator.serviceWorker.addEventListener('message', event => {

        console.log('SW: MSG type: %s', JSON.stringify(event.data));

        // console.log('SW: MSG type: %s (%s : %s) cache: %s', event.data.type, event.data.msg, event.data.url, event.data.cache);
        // document.getElementById( 'debugDiv' ).innerHTML = 'cacheName: ' + event.data.cache;
    });

}

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.getRegistrations().then((registrations) => {
//         for (let registration of registrations) {
//             console.log('reg scriptURL: [%s] scope: %s', registration.active.scriptURL, registration.scope);
//             // registration.unregister();
//         }
//     });
// }
