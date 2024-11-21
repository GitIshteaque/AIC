document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const searchBox = document.querySelector('.search-box');
    const searchResults = document.querySelector('.search-results');
    const loader = document.querySelector('.loader');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    const modal = document.getElementById('caseStudyModal');

    // Initialize loading state
    window.addEventListener('load', () => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300); // Reduced from 500ms
    });

    // Mobile menu handling
    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Debounced search function
    let searchTimeout;
    searchBox.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            performSearch(searchTerm);
        }, 300);
    });

    // Scroll handling with throttle
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 100);
        }
    });

    // Combined scroll handler
    const handleScroll = () => {
        // Scroll to top button visibility
        scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);

        // Fade in elements
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            if ((elementTop < window.innerHeight - 100) && (elementBottom > 0)) {
                element.classList.add('visible');
            }
        });
    };

    // Event delegation for common interactions
    document.addEventListener('click', (e) => {
        // Handle service card flips
        if (e.target.closest('.service-card')) {
            handleServiceCardClick(e);
        }

        // Handle filter buttons
        if (e.target.classList.contains('filter-btn')) {
            handleFilterClick(e);
        }

        // Handle modal close
        if (e.target.classList.contains('close-modal') || e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission with minimal processing
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Add to your existing JavaScript
    function createSonicBoom() {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-transition-wrapper';
        
        const boom = document.createElement('div');
        boom.className = 'sonic-boom';
        
        wrapper.appendChild(boom);
        document.body.appendChild(wrapper);
        
        return { wrapper, boom };
    }

    function triggerSonicBoom(targetSection) {
        const { wrapper, boom } = createSonicBoom();
        
        boom.classList.add('active');
        
        setTimeout(() => {
            wrapper.remove();
            targetSection.scrollIntoView({ behavior: 'smooth' });
            targetSection.classList.add('visible');
        }, 300);
    }

    // Update your navigation click handlers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                triggerSonicBoom(targetSection);
            }
        });
    });

    // Add intersection observer for section animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Add this to your existing JavaScript
    function initializeServices() {
        const filterButtons = document.querySelectorAll('.tab-trigger');
        const serviceCards = document.querySelectorAll('.service-card');
        const learnMoreButtons = document.querySelectorAll('.learn-more');
        const closeButtons = document.querySelectorAll('.close-details');

        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const category = button.getAttribute('data-filter');
                
                // Filter cards with smooth animation
                serviceCards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        if (category === 'all' || card.getAttribute('data-category') === category) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });

        // Card flip functionality
        learnMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.service-card');
                card.classList.add('flipped');
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.service-card');
                card.classList.remove('flipped');
            });
        });
    }

    // Call the function when the document is loaded
    document.addEventListener('DOMContentLoaded', initializeServices);

    // Service and Portfolio filtering functionality
    function initializeFiltering(filterButtonsClass, cardsClass) {
        const filterButtons = document.querySelectorAll(filterButtonsClass);
        const cards = document.querySelectorAll(cardsClass);

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                
                // Show all cards if 'all' is selected, otherwise filter by category
                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    // First hide all cards with a fade out effect
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || filterValue === cardCategory) {
                            card.style.display = 'block';
                            // Show relevant cards with a fade in effect
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
    }

    // Initialize filtering for both sections
    initializeFiltering('.services-tabs .tab-button', '.service-card');
    initializeFiltering('.portfolio-filters .tab-button', '.case-study-card');
});

// Utility functions moved outside main event listener
function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
    // Add your form submission logic here
    showSuccessMessage(e.target);
    e.target.reset();
}

function showSuccessMessage(form) {
    let successMessage = form.querySelector('.success-message');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        form.insertBefore(successMessage, form.firstChild);
    }
    successMessage.style.display = 'block';
    successMessage.textContent = 'Thank you for your message. We will get back to you soon!';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); // Reduced from 5000ms
} 