// Cache details
var cacheDetails = document.getElementById('cacheDetails');
var sW = 'sw.js';
cacheDetails.innerHTML = sW;

navigator.serviceWorker.register(sW, {
    scope: '/'
});
