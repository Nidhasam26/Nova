document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollspy();
    initContactForm();
});

/* Mobile navigation drawer */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!toggle || !navLinks) return;

    function setMenuState(open) {
        toggle.setAttribute('aria-expanded', String(open));
        navLinks.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        setMenuState(!isOpen);
    });

    // Close on navigation link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (toggle.getAttribute('aria-expanded') === 'true') {
                setMenuState(false);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setMenuState(false);
            toggle.focus();
        }
    });

    // Close on click outside menu
    document.addEventListener('click', (e) => {
        if (
            toggle.getAttribute('aria-expanded') === 'true' &&
            !toggle.contains(e.target) &&
            !navLinks.contains(e.target)
        ) {
            setMenuState(false);
        }
    });
}

/* Scrollspy highlighting using IntersectionObserver */
function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const match = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('is-active', match);
                    if (match) {
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, {
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
}

/* Contact form validation and submission */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const serviceInput = document.getElementById('contact-service');
    const messageInput = document.getElementById('contact-message');
    const feedback = document.getElementById('form-feedback');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setFieldError(input, errorId, message) {
        input.setAttribute('aria-invalid', 'true');
        let errEl = document.getElementById(errorId);
        if (!errEl && input.closest('.form-field')) {
            errEl = document.createElement('span');
            errEl.id = errorId;
            errEl.className = 'field-error';
            errEl.setAttribute('aria-live', 'polite');
            input.closest('.form-field').appendChild(errEl);
        }
        if (errEl) errEl.textContent = message;
    }

    function clearFieldError(input, errorId) {
        input.removeAttribute('aria-invalid');
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = '';
    }

    // Clear errors on input
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) clearFieldError(nameInput, 'name-error');
    });

    emailInput.addEventListener('input', () => {
        if (emailRegex.test(emailInput.value.trim())) clearFieldError(emailInput, 'email-error');
    });

    serviceInput.addEventListener('change', () => {
        if (serviceInput.value) clearFieldError(serviceInput, 'service-error');
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length >= 10) clearFieldError(messageInput, 'message-error');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        let firstInvalid = null;

        feedback.innerHTML = '';

        // Validate name
        const nameVal = nameInput.value.trim();
        if (!nameVal) {
            setFieldError(nameInput, 'name-error', 'Please enter your name.');
            isValid = false;
            if (!firstInvalid) firstInvalid = nameInput;
        } else if (nameVal.length < 2) {
            setFieldError(nameInput, 'name-error', 'Name must be at least 2 characters.');
            isValid = false;
            if (!firstInvalid) firstInvalid = nameInput;
        } else {
            clearFieldError(nameInput, 'name-error');
        }

        // Validate email
        const emailVal = emailInput.value.trim();
        if (!emailVal) {
            setFieldError(emailInput, 'email-error', 'Please enter your email address.');
            isValid = false;
            if (!firstInvalid) firstInvalid = emailInput;
        } else if (!emailRegex.test(emailVal)) {
            setFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
            isValid = false;
            if (!firstInvalid) firstInvalid = emailInput;
        } else {
            clearFieldError(emailInput, 'email-error');
        }

        // Validate discipline
        const serviceVal = serviceInput.value;
        if (!serviceVal) {
            setFieldError(serviceInput, 'service-error', 'Please select a discipline.');
            isValid = false;
            if (!firstInvalid) firstInvalid = serviceInput;
        } else {
            clearFieldError(serviceInput, 'service-error');
        }

        // Validate message
        const messageVal = messageInput.value.trim();
        if (!messageVal) {
            setFieldError(messageInput, 'message-error', 'Please tell us about your project.');
            isValid = false;
            if (!firstInvalid) firstInvalid = messageInput;
        } else if (messageVal.length < 10) {
            setFieldError(messageInput, 'message-error', 'Please provide a bit more detail (minimum 10 characters).');
            isValid = false;
            if (!firstInvalid) firstInvalid = messageInput;
        } else {
            clearFieldError(messageInput, 'message-error');
        }

        if (!isValid) {
            firstInvalid.focus();
            return;
        }

        const formData = new FormData(form);
        const submitBtn = document.getElementById('contact-submit');
        if (submitBtn) submitBtn.disabled = true;

        // TODO: Replace YOUR_ID with your Formspree form ID (e.g. https://formspree.io/f/mqazknyz)
        fetch('https://formspree.io/f/YOUR_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            if (response.ok) {
                feedback.innerHTML = `
                    <div class="feedback-card">
                        <strong>Thank you, ${escapeHtml(nameVal)}.</strong>
                        <p>Your inquiry has been received. We’ll be in touch soon.</p>
                    </div>
                `;
                form.reset();
            } else {
                feedback.innerHTML = `
                    <div class="feedback-card">
                        <strong>Submission failed.</strong>
                        <p>There was a problem sending your message. Please try again or email directly.</p>
                    </div>
                `;
            }
        })
        .catch(() => {
            feedback.innerHTML = `
                <div class="feedback-card">
                    <strong>Submission failed.</strong>
                    <p>There was a network error sending your message. Please try again or email directly.</p>
                </div>
            `;
        })
        .finally(() => {
            if (submitBtn) submitBtn.disabled = false;
            feedback.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'nearest'
            });
        });
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
