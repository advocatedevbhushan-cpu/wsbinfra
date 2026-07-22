/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll listener
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

/* ===== SCROLL ANIMATIONS ===== */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-up, .animate-left, .animate-right').forEach(el => {
    observer.observe(el);
});

/* ===== COUNTER ANIMATION ===== */
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            animateCounter(el, target);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    counterObserver.observe(el);
});

function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 60);
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = current + (target === 98 ? '%' : '+');
    }, 25);
}

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.name || !data.email || !data.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate sending
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showFormMessage('Thank you! We\'ll get back to you shortly.', 'success');
        contactForm.reset();
    }, 1500);
});

function showFormMessage(msg, type) {
    // Remove existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `form-message form-message--${type}`;
    div.textContent = msg;
    div.style.cssText = `
        padding: 12px 18px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        margin-top: 4px;
        animation: fadeIn 0.3s ease;
    `;

    if (type === 'error') {
        div.style.background = '#fef2f2';
        div.style.color = '#b91c1c';
        div.style.border = '1px solid #fecaca';
    } else {
        div.style.background = '#f0fdf4';
        div.style.color = '#166534';
        div.style.border = '1px solid #bbf7d0';
    }

    contactForm.appendChild(div);

    // Auto-remove after 5s
    setTimeout(() => {
        if (div.parentNode) {
            div.style.opacity = '0';
            div.style.transition = 'opacity 0.3s ease';
            setTimeout(() => div.remove(), 300);
        }
    }, 5000);
}

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===== TESTIMONIALS SLIDER ===== */
const testimonialSlider = document.getElementById('testimonialSlider');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    const cards = testimonialSlider.querySelectorAll('.testimonial-card');
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
}

function nextTestimonial() {
    const total = dots.length;
    showTestimonial((currentTestimonial + 1) % total);
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        showTestimonial(parseInt(dot.dataset.index));
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 5000);
    });
});

// Auto-advance every 5s
testimonialInterval = setInterval(nextTestimonial, 5000);

/* ===== ADD NO-SCROLL STYLE ===== */
const style = document.createElement('style');
style.textContent = `
    .no-scroll { overflow: hidden; }
    .form-message { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

