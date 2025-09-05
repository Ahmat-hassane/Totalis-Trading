// Ensure GSAP and ScrollTrigger are loaded
gsap.registerPlugin(ScrollTrigger);

// Hero Slider Functionality
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.nav-dot');
        this.prevBtn = document.querySelector('.slider-arrow.prev');
        this.nextBtn = document.querySelector('.slider-arrow.next');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Start auto-play
        this.startAutoPlay();
        
        // Pause on hover
        const heroSection = document.querySelector('.hero-section');
        heroSection.addEventListener('mouseenter', () => this.stopAutoPlay());
        heroSection.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add class to indicate GSAP is loaded
    document.body.classList.add('gsap-loaded');
    
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNavigation = document.getElementById('primary-navigation');

    menuToggle.addEventListener('click', () => {
        const visibility = primaryNavigation.getAttribute('data-visible');
        if (visibility === 'false') {
            primaryNavigation.setAttribute('data-visible', 'true');
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            primaryNavigation.setAttribute('data-visible', 'false');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close nav when a link is clicked (for mobile)
    primaryNavigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) { // Only close if on mobile
                primaryNavigation.setAttribute('data-visible', 'false');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // GSAP Animations
    // Hero section initial load animation
    gsap.from(".hero-title", { duration: 1, y: 50, opacity: 0, ease: "power3.out" });
    gsap.from(".hero-subtitle", { duration: 1, y: 50, opacity: 0, ease: "power3.out", delay: 0.3 });
    // Commented out to ensure buttons are always visible
    // gsap.from(".hero-content .primary-btn", { duration: 1, y: 50, opacity: 0, ease: "power3.out", delay: 0.6 });

    // Staggered fade-in on scroll for sections with 'reveal' class
    gsap.utils.toArray(".reveal").forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // When top of section is 80% down the viewport
                end: "bottom 20%",
                toggleActions: "play none none reverse", // Play on scroll in, reverse on scroll out
                // markers: true, // Uncomment for debugging scroll trigger
            }
        });
    });

    // Optional: Staggered animation for service items
    gsap.utils.toArray(".service-item").forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.1, // Stagger effect
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse",
            }
        });
    });
    
    // Initialize hero slider
    new HeroSlider();
});

// Add contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formMessages = document.getElementById('form-messages');
        
        // Disable submit button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        try {
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            // Show message
            formMessages.style.display = 'block';
            formMessages.className = 'form-messages ' + (result.success ? 'success' : 'error');
            formMessages.textContent = result.message;
            
            if (result.success) {
                contactForm.reset();
            }
        } catch (error) {
            formMessages.style.display = 'block';
            formMessages.className = 'form-messages error';
            formMessages.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le Message';
        }
    });
}