if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' })
        .then(function(reg) {

            if(reg.installing) {
                console.log('Service worker installing');
            } else if(reg.waiting) {
                console.log('Service worker installed');
            } else if(reg.active) {
                console.log('Service worker active');
            }

    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}

// if ('serviceWorker' in navigator) {

//     navigator.serviceWorker
//         .getRegistration()
//         .then(registration => {
//             if (registration) {
//                 registration.unregister().then((boolean) => {
//                     console.log('UnReg :', boolean);
//                 });
//             } else {
//                 console.log('No SW registered');
//             }
//         })
//         .catch(error => {
//             console.log("App: Crash de Service Worker", error);
//         });

// }
