(function() {
    const script = document.currentScript;
    if (!script) return;
    
    const pageName = script.getAttribute('data-page');
    if (!pageName) return;

    fetch('http://localhost:3000/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pageName })
    }).catch(e => {
        // Silently fail if server is not running
    });
})();
