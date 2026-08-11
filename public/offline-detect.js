(function() {
  function checkOfflineStatus() {
    if (!navigator.onLine) {
      var titleEl = document.getElementById('static-offline-title');
      var msgEl = document.getElementById('static-offline-msg');
      var btnEl = document.getElementById('static-offline-btn');
      if (titleEl) titleEl.innerText = "You're Offline";
      if (msgEl) msgEl.innerText = "You're offline. Please check your connection and try again.";
      if (btnEl) btnEl.style.display = "inline-block";
    }
  }

  // Check network status immediately
  checkOfflineStatus();

  // Re-check on network status events
  window.addEventListener('offline', checkOfflineStatus);
})();
