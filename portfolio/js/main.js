// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        setTimeout(() => {
            loaderWrapper.style.opacity = '0';
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', function() {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active section in navbar
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navLinksContainer.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        }
    });

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
        body.classList.add(storedTheme);
        if (storedTheme === 'light-theme') {
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
        }
    } else {
        body.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.querySelector('i').classList.remove('fa-sun');
            themeToggle.querySelector('i').classList.add('fa-moon');
            localStorage.setItem('theme', 'dark-theme');
        }
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 100);
                } else {
                    card.classList.remove('visible');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize project cards as visible
    setTimeout(() => {
        projectCards.forEach(card => {
            card.classList.add('visible');
        });
    }, 100);

    // Initialize GSAP animations
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger plugin
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // About section animations
        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about-image',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: -100,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });

        gsap.from('.about-content', {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });

        // Skills animations
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out',
                onComplete: () => {
                    // Animate skill level
                    const skillLevel = item.querySelector('.skill-level');
                    if (skillLevel) {
                        const width = skillLevel.style.width;
                        skillLevel.style.width = '0%';
                        gsap.to(skillLevel, {
                            width: width,
                            duration: 1.5,
                            ease: 'power3.out'
                        });
                    }
                }
            });
        });

        // Contact animations
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'power3.out'
            });
        });

        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Text splitting and animation if SplitType is available
        if (typeof SplitType !== 'undefined') {
            const titles = document.querySelectorAll('.section-header h2');
            titles.forEach(title => {
                const splitTitle = new SplitType(title, { types: 'chars, words' });
                gsap.from(splitTitle.chars, {
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 20,
                    stagger: 0.05,
                    duration: 0.5,
                    ease: 'power3.out'
                });
            });
        }
    }

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                // Here you would normally send the form data to your server
                // For now, let's just show a success message
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    // Create success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success';
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>Your message has been sent successfully!</p>
                    `;
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                    
                    // Reset form after some time
                    setTimeout(() => {
                        contactForm.innerHTML = `
                            <div class="form-group">
                                <input type="text" id="name" name="name" placeholder="Your Name" required>
                                <label for="name">Your Name</label>
                            </div>
                            <div class="form-group">
                                <input type="email" id="email" name="email" placeholder="Your Email" required>
                                <label for="email">Your Email</label>
                            </div>
                            <div class="form-group">
                                <input type="text" id="subject" name="subject" placeholder="Subject" required>
                                <label for="subject">Subject</label>
                            </div>
                            <div class="form-group">
                                <textarea id="message" name="message" placeholder="Your Message" required></textarea>
                                <label for="message">Your Message</label>
                            </div>
                            <button type="submit" class="btn primary-btn">Send Message</button>
                        `;
                    }, 5000);
                }, 1500);
            }
        });
    }
});
