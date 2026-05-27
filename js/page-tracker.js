/**
 * page-tracker.js
 * Lightweight page view tracker for Varad Portfolio
 * Usage: <script src="../js/page-tracker.js" data-page="cricket"></script>
 *   OR   window.trackPageView('home');
 */
(function () {
  'use strict';

  const API_ENDPOINT = '/api/track-page';

  function trackPageView(pageName) {
    if (!pageName) return;
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pageName })
    }).catch(() => {
      // Silently fail — tracking should never break the page
    });
  }

  // Auto-detect page name from script data attribute
  const scriptTag = document.currentScript;
  if (scriptTag) {
    const autoPage = scriptTag.getAttribute('data-page');
    if (autoPage) {
      // Track after a short delay so page load is not affected
      setTimeout(() => trackPageView(autoPage), 500);
    }
  }

  // Expose globally for manual use if needed
  window.trackPageView = trackPageView;
})();
