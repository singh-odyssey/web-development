// ===== LOADING SCREEN FUNCTIONALITY =====
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading');
    const content = document.getElementById('content');
    const navbar = document.querySelector('.navbar');
    
    // Hide loading screen and show content after 2 seconds (reduced for testing)
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        
        // Show navbar
        if (navbar) {
            navbar.style.display = 'block';
        }
        
        // Show main content
        if (content) {
            content.style.display = 'block';
        }
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize other features
        initializeFeatures();
        }, 2000); // Reduced to 2 seconds for faster testing 
});

// ===== ANIMATION INITIALIZATION =====
function initializeAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.login-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
    
    // Add fade-in animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ===== ADDITIONAL FEATURES =====
function initializeFeatures() {
    // Navbar scroll effect
    initializeNavbarScroll();
    
    // Form validation
    initializeFormValidation();
    
    // Smooth scrolling
    initializeSmoothScrolling();
    
    // Typing effect for hero title
    initializeTypingEffect();
    
    // Particle background (optional)
    // initializeParticles();
}

// ===== NAVBAR SCROLL EFFECT =====
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        }
    });
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const formType = getFormType(form);
            
            // Basic validation
            if (validateForm(form)) {
                // Show success message
                showNotification('Login successful! Redirecting...', 'success');
                
                // Simulate login process
                setTimeout(() => {
                    // Close modal
                    const modal = form.closest('.modal');
                    if (modal) {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                    }
                    
                    // In a real app, redirect to dashboard
                    console.log(`${formType} login attempted`, Object.fromEntries(formData));
                }, 1500);
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    });
}

function getFormType(form) {
    const modal = form.closest('.modal');
    if (modal) {
        if (modal.id === 'studentLoginModal') return 'Student';
        if (modal.id === 'staffLoginModal') return 'Staff';
        if (modal.id === 'recoveryModal') return 'Recovery';
    }
    return 'Unknown';
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            
            // Email validation
            if (input.type === 'email' && !isValidEmail(input.value)) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1060;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    const words = originalText.split(' ');
    
    // Only apply typing effect on larger screens
    if (window.innerWidth > 768) {
        heroTitle.textContent = '';
        
        let wordIndex = 0;
        const typeWords = () => {
            if (wordIndex < words.length) {
                heroTitle.textContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                wordIndex++;
                setTimeout(typeWords, 300);
            }
        };
        
        setTimeout(typeWords, 1000);
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
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

// Throttle function for scroll events
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
    }
}

// ===== RESPONSIVE UTILITIES =====
function handleResize() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth <= 768) {
        // Reset title for mobile
        heroTitle.textContent = 'Welcome to EduBuddy';
    }
}

// Add resize listener with debounce
window.addEventListener('resize', debounce(handleResize, 250));

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation support
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && element.tagName === 'BUTTON') {
                element.click();
            }
        });
    });
    
    // Add focus management for modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        });
    });
});

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
`;
document.head.appendChild(style);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to a logging service
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

