// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('sw.js', { scope: '/' }).then(function(reg) {

//         if(reg.installing) {
//             console.log('Service worker installing');
//         } else if(reg.waiting) {
//             console.log('Service worker installed');
//         } else if(reg.active) {
//             console.log('Service worker active');
//         }

//     }).catch(function(error) {
//         // registration failed
//         console.log('Registration failed with ' + error);
//     });
// }

if ('serviceWorker' in navigator) {

    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            console.log('reg scriptURL: [%s] scope: %s', registration.active.scriptURL, registration.scope);
            // registration.unregister();
        }
    });

}
