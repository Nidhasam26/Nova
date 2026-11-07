document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollspy();
    initProjectModal();
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

/* Project Details Data (Craft in Practice — Concept Studies) */
const PROJECT_DETAILS = {
    'digital-experience': {
        index: 'PRJ // 01',
        title: 'Digital Experience',
        category: 'Web Design',
        year: '2026',
        status: 'Studio Concept Study',
        disclaimer: 'This is an experimental studio design concept created by NOVA to explore editorial typography and fluid brand storytelling — not an active client commission.',
        overview: 'A digital experience designed to communicate a brand’s identity through a clear, editorial, and intuitive interface. Built around disciplined typography, asymmetrical grid alignment, and purposeful whitespace, the concept prioritizes effortless navigation and authentic brand presence without reliance on heavy frameworks.',
        features: [
            {
                title: 'Editorial Typography & Scale',
                desc: 'Carefully harmonized pairing of classical serif display headlines with crisp geometric sans-serif body copy for an authoritative, high-prestige aesthetic.'
            },
            {
                title: 'Zero-Framework Performance',
                desc: 'Authored in pure semantic HTML5, modern CSS3 variables, and vanilla JavaScript to deliver instantaneous render times and lightweight delivery.'
            },
            {
                title: 'Fluid Responsive Rhythm',
                desc: 'Calculated typographic clamp functions ensure proportional scaling across compact mobile screens, tablets, and wide desktop viewports.'
            },
            {
                title: 'Restrained Micro-Interactions',
                desc: 'Purposeful hover states, geometric axis shifts, and subtle CSS transitions that reward exploration without distracting from editorial content.'
            }
        ],
        technologies: ['HTML5 Semantic Elements', 'CSS3 Custom Properties', 'Vanilla JavaScript (ES6+)', 'Responsive Layout Design', 'WCAG 2.1 AA Standards'],
        geometryClass: 'preview-experience',
        geometrySvg: `
            <div class="geom-ring"></div>
            <div class="geom-axis"></div>
            <div class="geom-pill"><span>INTERFACE</span></div>
        `
    },
    'smart-dashboard': {
        index: 'PRJ // 02',
        title: 'Smart Dashboard',
        category: 'UI/UX Design',
        year: '2026',
        status: 'Studio Concept Study',
        disclaimer: 'This is a self-initiated UI/UX research concept exploring high-density telemetry visualization and calm interface design — not an active client commission.',
        overview: 'A dashboard concept focused on presenting information clearly and improving the overall user experience. The interface translates complex multi-stream data into immediate, digestible visual hierarchies through muted tonal layering, contrast thresholds, and contextual metric groupings.',
        features: [
            {
                title: 'Cognitive Load Reduction',
                desc: 'Calculated visual grouping directs operator attention to primary key performance indicators before progressively revealing secondary telemetry.'
            },
            {
                title: 'Design Token System',
                desc: 'Modular Figma tokens for spacing, typography, and color scales designed for seamless consistency and rapid design-to-code translation.'
            },
            {
                title: 'Accessible Data Contrast',
                desc: 'Certified WCAG 2.1 AA color contrast ratios across diagnostic charts, bar indicators, telemetry tags, and numeric metrics.'
            },
            {
                title: 'Adaptive Multi-Density Views',
                desc: 'Multi-column widescreen layout collapses into clean stacked metric cards on mobile screens without loss of key monitoring parameters.'
            }
        ],
        technologies: ['UI/UX Architecture', 'Figma', 'Design Systems', 'Responsive Data Grids', 'Information Hierarchy', 'WCAG 2.1 AA Standards'],
        geometryClass: 'preview-dashboard',
        geometrySvg: `
            <div class="geom-grid"></div>
            <div class="geom-bars">
                <span style="height: 38%"></span>
                <span style="height: 72%"></span>
                <span style="height: 52%"></span>
                <span style="height: 88%"></span>
            </div>
            <div class="geom-badge"><span>METRICS</span></div>
        `
    },
    'creative-platform': {
        index: 'PRJ // 03',
        title: 'Creative Platform',
        category: 'Web Development',
        year: '2026',
        status: 'Studio Concept Study',
        disclaimer: 'This is a studio prototype demonstrating modular layout composition, keyboard accessibility, and zero-framework engineering — not an active client commission.',
        overview: 'A responsive web platform concept built around usability, accessibility, and a clean visual experience. Designed as a flexible digital showcase for modern creative studios, it proves that rich, interactive media presentations can remain accessible, blazingly fast, and framework-free.',
        features: [
            {
                title: 'Modular Layout Canvas',
                desc: 'Flexible CSS grid containers adapting dynamically to varying aspect ratios, editorial text lockups, and geometric brand accents.'
            },
            {
                title: 'Comprehensive Keyboard Traversal',
                desc: 'Logical tab ordering, visible focus outlines, ARIA live regions, and screen-reader compatible semantic landmarks throughout.'
            },
            {
                title: 'Progressive Enhancement',
                desc: 'Core content and structural hierarchy remain completely navigable and readable even if JavaScript execution is delayed or unavailable.'
            },
            {
                title: 'Lightweight Asset Delivery',
                desc: 'Vector-first visual geometry and pure CSS compositions that render instantly without external image payload or network latency.'
            }
        ],
        technologies: ['HTML5 Semantic Architecture', 'CSS Grid & Flexbox', 'Vanilla JavaScript (ES6+)', 'Progressive Enhancement', 'ARIA 1.2 Specifications'],
        geometryClass: 'preview-platform',
        geometrySvg: `
            <div class="geom-frame">
                <div class="geom-frame-top"></div>
                <div class="geom-frame-body">
                    <div class="geom-line short"></div>
                    <div class="geom-line long"></div>
                    <div class="geom-dot"></div>
                </div>
            </div>
            <div class="geom-tag"><span>PLATFORM</span></div>
        `
    }
};

/* Interactive Project Preview Modal */
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalBody = document.getElementById('modal-body');
    const modalFlag = document.getElementById('modal-project-flag');
    const closeBtn = document.getElementById('modal-close-btn');
    const dismissBtn = document.getElementById('modal-dismiss-btn');
    const contactLink = document.getElementById('modal-contact-link');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastFocusedElement = null;

    function openModal(projectId, triggerEl) {
        const project = PROJECT_DETAILS[projectId];
        if (!project) return;

        lastFocusedElement = triggerEl || document.activeElement;

        if (modalFlag) {
            modalFlag.textContent = `${project.index} // ${project.status}`;
        }

        modalBody.innerHTML = `
            <div class="modal-hero-split">
                <div class="modal-preview-canvas ${escapeHtml(project.geometryClass)}" aria-hidden="true">
                    <span class="preview-index">${escapeHtml(project.index)}</span>
                    <div class="preview-geometry">
                        ${project.geometrySvg}
                    </div>
                </div>
                <div class="modal-hero-content">
                    <div class="modal-meta">
                        <span class="modal-category">${escapeHtml(project.category)}</span>
                        <span class="modal-separator" aria-hidden="true">/</span>
                        <span class="modal-year">${escapeHtml(project.year)}</span>
                    </div>
                    <h2 id="modal-project-title" class="modal-title">${escapeHtml(project.title)}</h2>
                    <div class="modal-notice" id="modal-project-notice">
                        <span class="notice-badge">Studio Concept Notice</span>
                        <p>${escapeHtml(project.disclaimer)}</p>
                    </div>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-kicker"><span>01</span><span>Concept Overview</span></div>
                <p class="modal-overview-text">${escapeHtml(project.overview)}</p>
            </div>

            <div class="modal-section">
                <div class="modal-section-kicker"><span>02</span><span>Key Features &amp; Highlights</span></div>
                <div class="modal-features-grid">
                    ${project.features.map(f => `
                        <div class="modal-feature-card">
                            <h4>${escapeHtml(f.title)}</h4>
                            <p>${escapeHtml(f.desc)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-kicker"><span>03</span><span>Discipline &amp; Technologies</span></div>
                <ul class="modal-tech-list" aria-label="Technologies used">
                    ${project.technologies.map(t => `
                        <li class="modal-tech-tag">${escapeHtml(t)}</li>
                    `).join('')}
                </ul>
            </div>
        `;

        modal.removeAttribute('hidden');
        // Force reflow for CSS transition
        void modal.offsetWidth;
        modal.classList.add('is-open');
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');

        // Trap focus to close button
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    function closeModal() {
        if (!modal.classList.contains('is-open')) return;

        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');

        const delay = prefersReducedMotion ? 0 : 240;
        setTimeout(() => {
            modal.setAttribute('hidden', '');
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }, delay);
    }

    // Attach listeners to cards and trigger buttons
    const projectCards = document.querySelectorAll('.project-card[data-project-id]');
    projectCards.forEach(card => {
        const projectId = card.getAttribute('data-project-id');
        const triggerBtn = card.querySelector('[data-project-open]');

        // Click on entire card
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openModal(projectId, triggerBtn || card);
        });

        // Click on trigger button specifically
        if (triggerBtn) {
            triggerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(projectId, triggerBtn);
            });
        }
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Dismiss button in modal footer
    if (dismissBtn) {
        dismissBtn.addEventListener('click', closeModal);
    }

    // Contact link inside modal
    if (contactLink) {
        contactLink.addEventListener('click', () => {
            closeModal();
        });
    }

    // Click on backdrop outside dialog
    modal.addEventListener('click', (e) => {
        if (!e.target.closest('.project-modal-dialog')) {
            closeModal();
        }
    });

    // Escape key & Tab focus trapping
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusable = Array.from(modal.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    });
}

/* Safely escape user-supplied strings before inserting into innerHTML */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
