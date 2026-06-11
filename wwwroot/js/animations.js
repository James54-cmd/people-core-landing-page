window.initProcessScrollObserver = (dotnetHelper, elementsSelector) => {
    const elements = document.querySelectorAll(elementsSelector);
    if (!elements || elements.length === 0) return;

    // Intersection Observer for active step highlights
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.getAttribute('data-index'));
                if (!isNaN(index)) {
                    dotnetHelper.invokeMethodAsync('UpdateActiveStep', index);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Triggers when the item is in the middle of the screen
        threshold: 0
    });

    elements.forEach(el => observer.observe(el));

    // Smooth Scroll Progress for the Timeline Line
    const container = document.querySelector('.timeline-container');
    const progressBar = document.querySelector('.timeline-progress');
    
    if (container && progressBar && elements.length > 1) {
        const updateProgress = () => {
            const firstElement = elements[0];
            const lastElement = elements[elements.length - 1];
            
            const triggerY = window.innerHeight / 2;
            
            const firstRect = firstElement.getBoundingClientRect();
            const lastRect = lastElement.getBoundingClientRect();
            
            const startY = firstRect.top + 28; // Center of the 56px icon
            const endY = lastRect.top + 28;
            
            const totalDistance = endY - startY;
            const currentDistance = triggerY - startY;
            
            let progress = currentDistance / totalDistance;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            
            // Map the 0-1 progress to percentage height
            progressBar.style.height = (progress * 100) + '%';
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress(); // Initial call
    }
};

window.scrollToStep = (index) => {
    const elements = document.querySelectorAll('.timeline-item-scroll');
    if (elements && elements[index]) {
        elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Smart Navbar Hide/Show Logic
document.addEventListener("scroll", () => {
    const navbar = document.querySelector('.custom-nav');
    if (!navbar) return;

    if (typeof window.lastScrollY === 'undefined') {
        window.lastScrollY = window.scrollY;
    }

    const currentScrollY = window.scrollY;
    
    // Hide if scrolling down and past 100px. Show if scrolling up or near top.
    if (currentScrollY > window.lastScrollY && currentScrollY > 100) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }

    window.lastScrollY = currentScrollY;
}, { passive: true });
