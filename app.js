// Register the ServiceWorker limiting its action to those URLs starting by controlled. The scope is not a path but a prefix. First, it is converted into an absolute URL, then used to determine if a page is controlled by testing it is a prefix of the request URL.

navigator.serviceWorker.register('sw-cache-update-and-refresh.js', {
    scope: '/'
});

// Load controlled pages once the worker is active.

navigator.serviceWorker.ready.then(reload);

// Reload on demand.
var reloadButton = document.querySelector('#reload');
reloadButton.onclick = reload;

function reload() {
    window.location.reload(true);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
            if (registration.active.scriptURL == 'sw.js') {
                console.log('UNREG scriptURL: [%s] scope: %s', registration.active.scriptURL, registration.scope);
                registration.unregister();
            }
        }
    });
}
