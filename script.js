/**
 * =============================================
 * ANTIQUE ADDA — Main JavaScript
 * =============================================
 * Features:
 *  1. Sticky Navigation with scroll effect
 *  2. Mobile hamburger menu toggle
 *  3. Smooth scrolling for anchor links
 *  4. Dark / Light mode toggle (persisted)
 *  5. Scroll-reveal animations (IntersectionObserver)
 *  6. Contact form validation
 *  7. Back-to-top button
 *  8. Active nav link highlighting on scroll
 * =============================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── Element References ─── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    /* ===========================================
       1. STICKY NAVIGATION
    =========================================== */
    const handleScroll = () => {
        // Add 'scrolled' class when page is scrolled past 80px
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show / hide back-to-top button
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Highlight active nav link based on scroll position
        highlightActiveSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on load

    /* ===========================================
       2. MOBILE HAMBURGER MENU
    =========================================== */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a nav link is clicked
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ===========================================
       3. SMOOTH SCROLLING
    =========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back-to-top button
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===========================================
       4. DARK / LIGHT MODE TOGGLE
    =========================================== */
    const savedTheme = localStorage.getItem('antiqueAdda_theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('antiqueAdda_theme', next);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    /* ===========================================
       5. SCROLL REVEAL ANIMATIONS
    =========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ===========================================
       6. ACTIVE NAV LINK HIGHLIGHTING
    =========================================== */
    function highlightActiveSection() {
        let currentSection = '';
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    /* ===========================================
       7. CONTACT FORM VALIDATION
    =========================================== */
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const phoneInput = document.getElementById('formPhone');
    const messageInput = document.getElementById('formMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    // Real-time validation: clear error when user types
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorEl = document.getElementById(input.id.replace('form', '').toLowerCase() + 'Error');
                if (errorEl) errorEl.textContent = '';
            });
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate Name (required, min 2 chars)
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Please enter your full name (at least 2 characters).');
            isValid = false;
        }

        // Validate Email (required, valid format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, emailError, 'Email address is required.');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate Phone (optional, but if filled must match pattern)
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
        if (phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.trim())) {
            showError(phoneInput, phoneError, 'Please enter a valid phone number.');
            isValid = false;
        }

        // Validate Message (required, min 10 chars)
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            showError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
            isValid = false;
        }

        if (isValid) {
            // Show success message
            formSuccess.classList.add('show');
            contactForm.reset();

            // Hide success after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
        }
    });

    function showError(input, errorEl, message) {
        input.classList.add('error');
        errorEl.textContent = message;
    }

    /* ===========================================
       8. NEWSLETTER FORM (simple)
    =========================================== */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailField = newsletterForm.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            }
        });
    }

});
