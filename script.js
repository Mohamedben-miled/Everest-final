/**
 * Everest Consulting - Modern Business Website JavaScript
 * Inspired by MBC Expert Comptable functionality
 */

// ========================================
// 1. UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
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

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 * @param {Element} element - Target element
 * @param {number} offset - Offset from top
 */
function smoothScrollTo(element, offset = 0) {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ========================================
// 2. HEADER SCROLL EFFECT
// ========================================

class HeaderScrollEffect {
    constructor() {
        this.header = null;
        this.init();
    }

    init() {
        this.header = document.querySelector('.header');
        if (!this.header) return;

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 10));
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// ========================================
// 3. MOBILE MENU FUNCTIONALITY
// ========================================

class MobileMenu {
    constructor() {
        this.menuToggle = null;
        this.navList = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileMenuToggle();
        this.bindEvents();
    }

    createMobileMenuToggle() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navList = document.querySelector('.nav-list');
        
        if (this.menuToggle) {
            this.menuToggle.setAttribute('aria-expanded', 'false');
            this.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            console.log('Mobile menu toggle found and initialized');
        } else {
            console.error('Mobile menu toggle not found');
        }
        
        if (this.navList) {
            console.log('Nav list found');
        } else {
            console.error('Nav list not found');
        }
    }

    bindEvents() {
        if (!this.menuToggle) return;

        this.menuToggle.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.header-content')) {
                this.close();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Close menu when clicking on navigation links
        if (this.navList) {
            const navLinks = this.navList.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.close();
                });
            });
        }
    }

    toggle() {
        console.log('Toggle called, isOpen:', this.isOpen);
        this.isOpen ? this.close() : this.open();
    }

    open() {
        console.log('Opening mobile menu');
        this.isOpen = true;
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menuToggle.setAttribute('aria-label', 'Close menu');
        this.menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        this.menuToggle.classList.add('active');
        
        if (this.navList) {
            this.navList.classList.add('mobile-open');
            console.log('Added mobile-open class to nav-list');
        }
        
        // Prevent body scroll
        document.body.classList.add('mobile-menu-open');
    }

    close() {
        console.log('Closing mobile menu');
        this.isOpen = false;
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Open menu');
        this.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        this.menuToggle.classList.remove('active');
        
        if (this.navList) {
            this.navList.classList.remove('mobile-open');
            console.log('Removed mobile-open class from nav-list');
        }
        
        // Restore body scroll
        document.body.classList.remove('mobile-menu-open');
    }
}

// ========================================
// 4. SMOOTH SCROLLING
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                smoothScrollTo(targetElement);
            }
        });
    }
}

// ========================================
// 5. SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.setupScrollListener();
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements that should be animated
        const elementsToAnimate = document.querySelectorAll('.service-card, .solution-card, .feature-card, .stat-item, .contact-item');
        elementsToAnimate.forEach(el => observer.observe(el));
    }

    setupScrollListener() {
        const animateElements = () => {
            const elements = document.querySelectorAll('.service-card, .solution-card, .feature-card, .stat-item, .contact-item');
            elements.forEach(el => {
                if (isInViewport(el) && !this.animatedElements.has(el)) {
                    this.animateElement(el);
                }
            });
        };

        window.addEventListener('scroll', throttle(animateElements, 100));
    }

    animateElement(element) {
        this.animatedElements.add(element);
        element.classList.add('fade-in');
    }
}

// ========================================
// 6. CARD INTERACTIONS
// ========================================

class CardInteractions {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.service-card, .solution-card, .feature-card');
        
        cards.forEach(card => {
            this.addHoverEffects(card);
            this.addClickHandler(card);
        });
    }

    addHoverEffects(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    }

    addClickHandler(card) {
        card.addEventListener('click', () => {
            // Add click functionality here if needed
            console.log('Card clicked:', card.querySelector('h3')?.textContent);
        });
    }
}

// ========================================
// 7. FORM HANDLING
// ========================================

class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => this.setupForm(form));
    }

    setupForm(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });
    }

    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (this.validateForm(data)) {
            // Simulate form submission
            this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            this.showMessage('Please fill in all required fields correctly.', 'error');
        }
    }

    validateForm(data) {
        const requiredFields = ['name', 'email', 'message'];
        return requiredFields.every(field => data[field] && data[field].trim() !== '');
    }

    showMessage(message, type) {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// ========================================
// 8. SCROLL TO TOP BUTTON
// ========================================

class ScrollToTop {
    constructor() {
        this.button = null;
        this.init();
    }

    init() {
        this.button = document.querySelector('.scroll-to-top');
        if (!this.button) return;

        this.bindEvents();
    }

    bindEvents() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 100));

        // Scroll to top when clicked
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// ========================================
// 9. STATISTICS COUNTER
// ========================================

class StatisticsCounter {
    constructor() {
        this.counters = [];
        this.init();
    }

    init() {
        this.counters = document.querySelectorAll('.stat-number');
        if (this.counters.length === 0) return;

        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                displayValue = (displayValue / 1000).toFixed(1) + 'K+';
            } else if (target >= 100) {
                displayValue = displayValue + '%';
            } else {
                displayValue = displayValue + '+';
            }
            
            element.textContent = displayValue;
        }, 16);
    }
}

// ========================================
// 10. PERFORMANCE MONITORING
// ========================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.logPerformanceMetrics();
        });
    }

    logPerformanceMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            console.log(`Everest website loaded in ${loadTime}ms`);
        }
    }
}

// ========================================
// 11. LAZY LOADING
// ========================================

class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        } else {
            this.loadAllImages();
        }
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    }

    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }
}

// ========================================
// 12. MOBILE MENU STYLES
// ========================================

class MobileMenuStyles {
    constructor() {
        this.init();
    }

    init() {
        // Add mobile menu styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav-list {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease-in-out;
                    z-index: 1000;
                }
                
                .nav-list.mobile-open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-list li {
                    margin: 10px 0;
                }
                
                .nav-link {
                    display: block;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-size: 18px;
                }
                
                .mobile-menu-open {
                    overflow: hidden;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// 13. SERVICES CAROUSEL
// ========================================

class ServicesCarousel {
    constructor() {
        this.track = null;
        this.cards = [];
        this.currentIndex = 0;
        this.cardsPerView = 3;
        this.totalCards = 0;
        this.maxIndex = 0;
        this.init();
    }

    init() {
        this.track = document.getElementById('servicesTrack');
        if (!this.track) return;

        this.cards = Array.from(this.track.querySelectorAll('.service-card'));
        this.totalCards = this.cards.length;
        this.cardsPerView = this.getCardsPerView();
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        
        this.bindEvents();
        this.updateIndicators();
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    bindEvents() {
        // Arrow buttons
        const prevBtn = document.querySelector('.carousel-btn-prev');
        const nextBtn = document.querySelector('.carousel-btn-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        // Indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch/swipe support
        this.addTouchSupport();
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Auto-resize on window resize
        window.addEventListener('resize', debounce(() => {
            this.cardsPerView = this.getCardsPerView();
            this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updateTrack();
            this.updateIndicators();
        }, 250));
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
        });
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateTrack();
            this.updateIndicators();
        }
    }

    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateTrack();
            this.updateIndicators();
        }
    }

    goToSlide(index) {
        this.currentIndex = Math.min(index, this.maxIndex);
        this.updateTrack();
        this.updateIndicators();
    }

    updateTrack() {
        const cardWidth = this.cards[0]?.offsetWidth || 350;
        const gap = 24; // 1.5rem gap
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
        this.track.style.transform = `translateX(${translateX}px)`;
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        const totalIndicators = Math.ceil(this.totalCards / this.cardsPerView);
        
        // Update indicator count if needed
        if (indicators.length !== totalIndicators) {
            this.createIndicators(totalIndicators);
            return;
        }
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    createIndicators(count) {
        const container = document.querySelector('.carousel-indicators');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const indicator = document.createElement('button');
            indicator.className = `indicator ${i === this.currentIndex ? 'active' : ''}`;
            indicator.setAttribute('data-slide', i);
            indicator.addEventListener('click', () => this.goToSlide(i));
            container.appendChild(indicator);
        }
    }
}

// ========================================
// 14. INITIALIZATION
// ========================================

class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            new HeaderScrollEffect();
            new MobileMenu();
            new SmoothScroll();
            new ScrollAnimations();
            new CardInteractions();
            new FormHandler();
            new ScrollToTop();
            new StatisticsCounter();
            new PerformanceMonitor();
            new LazyLoader();
            new MobileMenuStyles();
            new ServicesCarousel();

            console.log('Everest Consulting website loaded successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
}

// ========================================
// 14. START THE APPLICATION
// ========================================

// Start the application
new App();