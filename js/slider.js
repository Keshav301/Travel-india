/* =========================================================================
   Image Gallery Slider with Touch Support
   ========================================================================= */

class CustomSlider {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.slider-track');
        this.slides = Array.from(this.track.children);
        this.nextBtn = container.querySelector('.slider-btn.next');
        this.prevBtn = container.querySelector('.slider-btn.prev');
        this.dotsContainer = container.querySelector('.slider-dots');

        if (!this.track || this.slides.length === 0) return;

        this.currentIndex = 0;
        this.slideWidth = 0; // Will be calculated
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        this.setupSlides();
        this.setupDots();
        this.addEventListeners();
        this.updateButtons();
        this.startAutoplay();

        // Recalculate on resize
        window.addEventListener('resize', this.debounce(() => {
            this.setupSlides();
            this.goToSlide(this.currentIndex);
        }, 250));
    }

    setupSlides() {
        this.slideWidth = this.slides[0].getBoundingClientRect().width;
        this.slides.forEach((slide, index) => {
            slide.style.left = `${this.slideWidth * index}px`;
        });
    }

    setupDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
            this.dotsContainer.appendChild(dot);
        });
    }

    addEventListeners() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoplay();
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoplay();
            });
        }

        // Touch events
        this.track.addEventListener('touchstart', this.touchStart.bind(this));
        this.track.addEventListener('touchend', this.touchEnd.bind(this));
        this.track.addEventListener('touchmove', this.touchMove.bind(this));

        // Mouse events for modern drag interface
        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
    }

    nextSlide() {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
            this.goToSlide(this.currentIndex);
        } else {
            // Loop back to start
            this.currentIndex = 0;
            this.goToSlide(this.currentIndex);
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.goToSlide(this.currentIndex);
        } else {
            // Loop to end
            this.currentIndex = this.slides.length - 1;
            this.goToSlide(this.currentIndex);
        }
    }

    goToSlide(index) {
        this.track.style.transform = `translateX(-${this.slideWidth * index}px)`;
        this.track.style.transition = 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
        this.currentIndex = index;

        this.updateDots();
        this.updateButtons();
    }

    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    updateButtons() {
        // Optional logic to disable buttons
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.nextSlide();
            }
        }, 5000);
    }

    resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
    }

    // --- Touch / Mouse Drag Logic ---
    touchStart(e) {
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.track.style.transition = 'none'; // remove transition for smooth drag
        this.animationID = requestAnimationFrame(this.animation.bind(this));

        // pause autoplay
        clearInterval(this.autoplayInterval);
    }

    touchMove(e) {
        if (!this.isDragging) return;
        const currentPosition = this.getPositionX(e);
        const dragDistance = currentPosition - this.startPos;
        this.currentTranslate = this.prevTranslate + dragDistance;
    }

    touchEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);

        const movedBy = this.currentTranslate - this.prevTranslate;

        // threshold to slide (e.g. 100px)
        if (movedBy < -100 && this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
        }
        else if (movedBy > 100 && this.currentIndex > 0) {
            this.currentIndex--;
        }

        this.goToSlide(this.currentIndex);
        this.prevTranslate = -this.currentIndex * this.slideWidth;
        this.startAutoplay();
    }

    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    animation() {
        if (this.isDragging) {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            requestAnimationFrame(this.animation.bind(this));
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize sliders
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => new CustomSlider(slider));
});
