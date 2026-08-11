(function() {
  if (navigator.onLine) {
    var titleEl = document.getElementById('static-offline-title');
    var msgEl = document.getElementById('static-offline-msg');
    var btnEl = document.getElementById('static-offline-btn');
    if (titleEl) titleEl.innerText = "Loading Kalrav Jewels…";
    if (msgEl) msgEl.innerText = "Please wait while we connect to our fine 925 sterling silver collection.";
    if (btnEl) btnEl.style.display = "none";
  }
})();
