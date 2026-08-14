(function() {
  function initOfflineHandler() {
    var btn = document.getElementById('static-offline-btn');
    if (btn) {
      // Clean cross-browser event listener replacing blocked onclick attribute
      btn.addEventListener('click', function() {
        window.location.reload();
      });
    }

    function updateNetworkStatus() {
      var titleEl = document.getElementById('static-offline-title');
      var msgEl = document.getElementById('static-offline-msg');
      var btnEl = document.getElementById('static-offline-btn');

      if (!navigator.onLine) {
        if (titleEl) titleEl.innerText = "You're Offline";
        if (msgEl) msgEl.innerText = "You're offline. Please check your connection and try again.";
        if (btnEl) btnEl.style.display = "inline-block";
      } else {
        if (titleEl) titleEl.innerText = "Loading Kalrav Jewels…";
        if (msgEl) msgEl.innerText = "Please wait while we connect to our fine 925 sterling silver collection.";
        if (btnEl) btnEl.style.display = "none";
      }
    }

    // Check status immediately on load
    updateNetworkStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOfflineHandler);
  } else {
    initOfflineHandler();
  }
})();
