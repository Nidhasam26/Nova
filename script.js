document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollspy();
    initFaqAccordion();
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
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
}

/* FAQ accordion interactive behavior */
function initFaqAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    if (!faqTriggers.length) return;

    function closeItem(trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) return;
        panel.classList.remove('is-open');
        panel.setAttribute('hidden', '');
    }

    function openItem(trigger) {
        trigger.setAttribute('aria-expanded', 'true');
        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) return;
        panel.removeAttribute('hidden');
        // Force reflow for layout calculation
        void panel.offsetHeight;
        panel.classList.add('is-open');
    }

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Close all other panels (single-open accordion behavior)
            faqTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
                    closeItem(otherTrigger);
                }
            });

            // Toggle current panel
            if (isExpanded) {
                closeItem(trigger);
            } else {
                openItem(trigger);
            }
        });
    });
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
    const submitBtn = document.getElementById('contact-submit');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Guard against duplicate in-flight submissions
    let isSubmitting = false;

    function setFieldError(input, errorId, message) {
        input.setAttribute('aria-invalid', 'true');
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = message;
    }

    function clearFieldError(input, errorId) {
        input.removeAttribute('aria-invalid');
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = '';
    }

    function resetFormState() {
        // Clear all aria-invalid attributes and error messages after a successful send
        clearFieldError(nameInput, 'name-error');
        clearFieldError(emailInput, 'email-error');
        clearFieldError(serviceInput, 'service-error');
        clearFieldError(messageInput, 'message-error');
    }

    // Clear errors dynamically as the user corrects each field
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

        // Prevent duplicate submissions while a request is in-flight
        if (isSubmitting) return;

        let isValid = true;
        let firstInvalid = null;

        feedback.innerHTML = '';
        feedback.className = 'form-feedback';

        // --- Validate name ---
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

        // --- Validate email ---
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

        // --- Validate discipline ---
        const serviceVal = serviceInput.value;
        if (!serviceVal) {
            setFieldError(serviceInput, 'service-error', 'Please select a discipline.');
            isValid = false;
            if (!firstInvalid) firstInvalid = serviceInput;
        } else {
            clearFieldError(serviceInput, 'service-error');
        }

        // --- Validate message ---
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

        // Lock submission and disable button
        isSubmitting = true;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
        }

        const formData = new FormData(form);
        const endpoint = form.getAttribute('action') || 'https://formspree.io/f/maeezojw';

        fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                if (response.ok) {
                    feedback.innerHTML = `
                    <div class="feedback-card feedback-card--success">
                        <strong>Thank you, ${escapeHtml(nameVal)}.</strong>
                        <p>Your inquiry has been received. We&rsquo;ll be in touch soon.</p>
                    </div>
                `;
                    form.reset();
                    resetFormState();
                    // Keep button disabled after a successful send to prevent re-submission
                    // of the same content. The form has been reset so a fresh submission
                    // is a genuinely new inquiry — re-enable after a brief pause.
                    setTimeout(() => {
                        isSubmitting = false;
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.removeAttribute('aria-busy');
                        }
                    }, 3000);
                } else {
                    return response.json().catch(() => ({})).then((data) => {
                        // Surface Formspree-specific error messages when available
                        const reason = (data && data.error) ? data.error : 'There was a problem sending your message. Please try again or email us directly.';
                        feedback.innerHTML = `
                        <div class="feedback-card feedback-card--error">
                            <strong>Submission failed.</strong>
                            <p>${escapeHtml(reason)}</p>
                        </div>
                    `;
                        isSubmitting = false;
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.removeAttribute('aria-busy');
                        }
                    });
                }
            })
            .catch(() => {
                feedback.innerHTML = `
                <div class="feedback-card feedback-card--error">
                    <strong>Network error.</strong>
                    <p>Your message could not be sent. Check your connection and try again, or email us directly.</p>
                </div>
            `;
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }
            })
            .finally(() => {
                feedback.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'nearest'
                });
            });
    });
}

/* Safely escape user-supplied strings before inserting into innerHTML */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
