/* =========================================================================
   Scroll Animations using Intersection Observer
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // Select elements to animate
    const revealElements = document.querySelectorAll('.reveal-up, .fade-in, .card');

    if (!revealElements.length) return;

    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // trigger slightly before it enters the viewport
        threshold: 0.1
    };

    // The observer callback function
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Add staggered animation dynamically if it's part of a grid/list
                // Alternatively, CSS classes .stagger-1, .stagger-2 can be handled in HTML

                // Unobserve after animating (clean up)
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the observer
    const animationObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Start observing
    revealElements.forEach(el => {
        // By default, cards are added a reveal up effect
        if (el.classList.contains('card') && !el.classList.contains('reveal-up')) {
            el.classList.add('reveal-up');
        }
        animationObserver.observe(el);
    });

});
