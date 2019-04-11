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



// Also if navigator.serviceWorker
if ('serviceWorker' in navigator) {
    console.log('ok');

    navigator.serviceWorker
        .getRegistration()
        .then(registration => {
            if (registration) {
                registration.unregister().then((boolean) => {
                    console.log('UnReg :', boolean)
                });
            }
        })
        .catch(error => {
            // Il y a eu un problème
            console.error(
                "App: Crash de Service Worker",
                error
            );
        });

}
