// Dismiss the loader once Blazor's circuit is fully initialized
(function () {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    let dismissed = false;
    function dismissLoader() {
        if (dismissed) return;
        dismissed = true;
        // Small delay so the first paint is smooth
        setTimeout(function () {
            loader.classList.add('loaded');
            // Remove from DOM after transition
            setTimeout(function () {
                loader.remove();
            }, 700);
        }, 300);
    }

    // Blazor Server: listen for the circuit start event
    if (typeof Blazor !== 'undefined' && Blazor) {
        Blazor.addEventListener('enhancedload', dismissLoader);
    }

    // Fallback: dismiss after a reasonable timeout
    setTimeout(dismissLoader, 6000);
})();
