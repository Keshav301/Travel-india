/* =========================================================================
   Main Application Logic
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Navbar Scrolling
    const navbar = document.querySelector('.navbar');

    let lastScrollY = window.scrollY;

    // Function to check scroll position
    const checkScroll = () => {
        const currentScrollY = window.scrollY;

        // 1. Dynamic Background (White when scrolled > 50px)
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 2. Hide on Scroll Down, Show on Scroll Up
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            // Scrolling down and past threshold
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up or at the top
            navbar.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    };

    // Initial check and event listener
    if (navbar) {
        checkScroll();
        window.addEventListener('scroll', checkScroll);
    }

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle hamburger icon (optional: change to X)
            if (navLinks.classList.contains('active')) {
                hamburger.innerHTML = '&#10005;'; // X icon
            } else {
                hamburger.innerHTML = '&#9776;'; // Hamburger icon
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '&#9776;';
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '&#9776;';
            });
        });
    }

    // 3. Image Lazy Loading & Skeleton replacing
    // Removed because local images load instantly and sometimes leave the blur effect stuck by missing the onload event.
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.remove('img-loading'); // guarantee removal in case it was added in HTML
    });

    // 4. Contact Form Validation (if on contact page)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Assuming successful submission
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }
});
