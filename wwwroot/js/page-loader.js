// Dismiss the loader once Blazor's circuit is fully initialized or page resources load
(function () {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    // If no-loader class is present, remove loader from DOM immediately
    if (document.documentElement.classList.contains('no-loader')) {
        loader.remove();
        return;
    }

    let dismissed = false;
    function dismissLoader() {
        if (dismissed) return;
        dismissed = true;

        try {
            sessionStorage.setItem('peoplecore-loaded', 'true');
        } catch (e) {
            console.error('Failed to set sessionStorage:', e);
        }

        // Small delay so the first paint is smooth
        setTimeout(function () {
            loader.classList.add('loaded');
            // Remove from DOM after transition
            setTimeout(function () {
                loader.remove();
            }, 700);
        }, 300);
    }

    // Dismiss when the window has fully loaded (fast initial load transition)
    if (document.readyState === 'complete') {
        dismissLoader();
    } else {
        window.addEventListener('load', dismissLoader);
    }

    // Blazor Server: listen for the circuit start / enhanced navigation events
    if (typeof Blazor !== 'undefined' && Blazor) {
        Blazor.addEventListener('enhancedload', dismissLoader);
    }

    // Fallback: dismiss after a reasonable timeout if load event doesn't fire
    setTimeout(dismissLoader, 2500);
})();
