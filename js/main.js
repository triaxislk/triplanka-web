// Reveal Reveal Animations
const reveals = document.querySelectorAll('.reveal');

function reveal() {
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        let elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Offset for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// System: Global Interface Controller
// System: Global Interface Controller
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle & Navigation Logic ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        const icon = mobileMenuBtn.querySelector('i');
        
        // Relocate elements to body root to avoid parent clipping/scrolling issues
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }
        
        // Add a dedicated close button inside the drawer
        if (!navLinks.querySelector('.drawer-close')) {
            const closeBtn = document.createElement('div');
            closeBtn.className = 'drawer-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            navLinks.prepend(closeBtn);
            closeBtn.addEventListener('click', () => toggleMenu(false));
        }
        
        const relocateNav = () => {
            const isMobile = window.matchMedia('(max-width: 992px)').matches;
            const navContainer = document.querySelector('header nav');
            if (!navContainer || !navLinks) return;

            const isAtBody = navLinks.parentElement === document.body;

            if (isMobile && !isAtBody) {
                document.body.appendChild(navLinks);
                console.log('Nav: Moved to Body (Mobile)');
            } else if (!isMobile && isAtBody) {
                navContainer.appendChild(navLinks);
                console.log('Nav: Restored to Header (Desktop)');
            }
        };

        // Execution
        relocateNav();
        window.addEventListener('resize', relocateNav);

        const toggleMenu = (forceState = null) => {
            const isOpen = navLinks.classList.contains('active');
            const shouldOpen = forceState === null ? !isOpen : forceState;
            
            if (shouldOpen) {
                navLinks.classList.add('active');
                overlay.classList.add('active');
                icon.classList.replace('fa-bars', 'fa-times');
                document.body.classList.add('menu-open');
            } else {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                icon.classList.replace('fa-times', 'fa-bars');
                document.body.classList.remove('menu-open');
                
                // Close all accordion items when closing the menu
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // CENTRALIZED Mobile Interaction Controller
        navLinks.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const parentLi = link.parentElement;
            const isDropdown = parentLi && (
                parentLi.classList.contains('dropdown') || 
                link.querySelector('.fa-chevron-down') ||
                link.classList.contains('dropdown-toggle')
            );

            if (isDropdown && window.innerWidth <= 992) {
                // Determine if the click is on the chevron icon specifically
                const isChevron = e.target.classList.contains('fa-chevron-down') || 
                                 e.target.closest('.fa-chevron-down') ||
                                 // Check if click was on the right side of the flex link (the arrow area)
                                 (e.offsetX > link.offsetWidth - 60);


                if (isChevron) {
                    // Toggle Accordion ONLY when clicking the arrow
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const alreadyOpen = parentLi.classList.contains('active');

                    // Accordion behavior: Close other dropdowns
                    navLinks.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== parentLi) d.classList.remove('active');
                    });

                    // Toggle current sub-menu
                    parentLi.classList.toggle('active', !alreadyOpen);
                    return;
                }
                
                // If clicked on text (NOT chevron), allow regular navigation
                // Close menu immediately so the user sees progress
                setTimeout(() => toggleMenu(false), 300);
                return;
            }


            // Close menu for all regular final links
            // Allow navigation by NOT preventing default
            toggleMenu(false);
        });

        // Close menu when clicking the overlay
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(false);
        });
    }

    // --- Global Photo Attribution Manager ---
    // Collect elements that commonly hold images (img tags and elements with inline background images)
    const elements = document.querySelectorAll('img, [style*="background-image"], .card-bg, .hero, .blog-hero, .article-header, .plans-hero, .info-hero, .contact-hero, .hotels-hero');

    elements.forEach(el => {
        // Prevent duplicate processing
        if (el.hasAttribute('data-photo-attributed')) return;
        el.setAttribute('data-photo-attributed', 'true');

        let src = '';
        if (el.tagName.toLowerCase() === 'img') {
            src = el.getAttribute('src');
        } else {
            const bgImage = el.style.backgroundImage || window.getComputedStyle(el).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                const match = bgImage.match(/url\(["']?(.*?)["']?\)/);
                if (match) src = match[1];
            }
        }

        if (src) {
            try { src = decodeURIComponent(src); } catch(e) {}
            
            // Extract photographer name based on "- Photo by Name.jpg" patterns
            const photoByMatch = src.match(/(?:-?\s*Photo\s*by\s*|©\s*)([^.\\/]+?)(?:\.(?:jpg|jpeg|png|webp|gif|avif|HEIC|JPG))/i);
            
            if (photoByMatch && photoByMatch[1]) {
                let authorName = photoByMatch[1].trim();
                // Clean up trailing hyphens
                authorName = authorName.replace(/[-\s]+$/, '');
                
                const attr = document.createElement('span');
                attr.className = 'photo-attribution';
                attr.textContent = `Photo by ${authorName}`;

                // Append intelligently based on structure
                if (el.tagName.toLowerCase() === 'img') {
                    const parent = el.parentElement;
                    if (window.getComputedStyle(parent).position === 'static') {
                        parent.style.position = 'relative';
                    }
                    if (!parent.querySelector('.photo-attribution')) {
                        parent.appendChild(attr);
                        parent.classList.add('img-container'); // for the hover trigger
                    }
                } else if (el.classList.contains('card-bg')) {
                    // If it's the background of a card wrapper, we append to parent
                    const parent = el.parentElement;
                    if (!parent.querySelector('.photo-attribution')) {
                        parent.appendChild(attr);
                    }
                } else {
                    // For inline styles like hero sections
                    if (window.getComputedStyle(el).position === 'static') {
                        el.style.position = 'relative';
                    }
                    if (!el.querySelector('.photo-attribution')) {
                        el.appendChild(attr);
                    }
                }
            }
        }
    });

    // Hover mechanics are now handled in main.css

    // === Blog Filter Controller ===
    const blogFilter = document.getElementById('blogFilter');
    if (blogFilter) {
        const currentFilter = document.getElementById('currentFilter');
        const options = blogFilter.querySelectorAll('.filter-options li');
        const cards = document.querySelectorAll('.blog-card');

        // Toggle Dropdown
        blogFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            blogFilter.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            blogFilter.classList.remove('active');
        });

        const applyFilter = (category, label) => {
            // Update UI
            currentFilter.textContent = label || 'Filter by Category';
            options.forEach(opt => opt.classList.remove('active'));
            const activeOpt = Array.from(options).find(opt => opt.getAttribute('data-value') === category);
            if (activeOpt) activeOpt.classList.add('active');

            // Filter Cards
            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.classList.remove('filtered-out');
                    // Small delay for staggered entrance effect
                    setTimeout(() => {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.classList.add('filtered-out');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (card.classList.contains('filtered-out')) {
                            card.style.display = 'none';
                        }
                    }, 500);
                }
            });
        };

        // Option selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                const category = option.getAttribute('data-value');
                const label = option.textContent;
                applyFilter(category, label);
            });
        });

        // Check URL for filter param (e.g. ?filter=nature)
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            const validCategories = {
                'guides': 'Travel Guides',
                'culture': 'Culture & Food',
                'nature': 'Nature & Wildlife'
            };
            if (validCategories[filterParam]) {
                applyFilter(filterParam, validCategories[filterParam]);
            }
        }
    }

    // === Visitor Counter & Milestone Animation ===
    const milestoneSection = document.querySelector('.trust-bar-section');
    const milestoneCounters = document.querySelectorAll('.counter-number:not(#live-visitor-count)');
    const liveCounter = document.getElementById('live-visitor-count');

    // Helper: Compact Number Formatter (12400 -> 12.4k)
    function formatCompactNumber(number) {
        if (number < 10000) {
            return number.toLocaleString(); // Keep full for < 10k for precision
        } else if (number < 1000000) {
            return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        } else {
            return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
        }
    }

    // 1. Fetch Real Visitor Count from CounterAPI
    const updateRealVisitorCount = async () => {
        const fallbackValue = 12408;
        try {
            // Using api.counterapi.dev for TripLanka namespace
            const response = await fetch('https://api.counterapi.dev/v1/triplanka.com/total-visits/up');
            const data = await response.json();
            
            if (data && data.count) {
                const target = data.count;
                const start = Math.max(0, target - 50);
                animateValue(liveCounter, start, target, 2000, true);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Visitor Counter Error:', error);
            // Even if API fails, animate to our last known fallback nicely
            if (liveCounter) {
                animateValue(liveCounter, 0, fallbackValue, 2000, true);
            }
        }
    };

    // Helper: Animate numbers
    function animateValue(obj, start, end, duration, isCompact = false) {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            
            if (isCompact) {
                obj.innerHTML = formatCompactNumber(current);
            } else {
                obj.innerHTML = current.toLocaleString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 2. Observer to trigger animations when scrolled into view
    if (milestoneSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger Milestone Counters
                    milestoneCounters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateValue(counter, 0, target, 2000);
                    });
                    
                    // Trigger Real Visitor Count
                    updateRealVisitorCount();
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(milestoneSection);
    }

    // --- FAQ Accordion Controller ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const header = item.querySelector('.faq-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Optional: Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                
                item.classList.toggle('active', !isActive);
            });
        });
    }

    // --- Travel Alert Bar Injection (News Ticker) ---
    const alertBar = document.createElement('div');
    alertBar.className = 'travel-alert-bar';
    alertBar.innerHTML = `
        <div class="alert-label"><i class="fas fa-exclamation-circle"></i> TRAVEL ALERT</div>
        <div class="alert-ticker-container">
            <div class="ticker-content">
                <strong>CRITICAL WATER SAFETY:</strong> Never swim or bathe in unknown rivers, lakes, waterfalls, or the sea without consulting local residents or guides. Recent incidents have reported sudden depths and strong currents. Stay safe and use only designated zones. 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <strong>TRAVEL ADVISORY:</strong> Upcountry train services are restricted due to 223 track breakages caused by <strong>Cyclone Ditwah</strong>. Restoration is underway. 
                Operational segments: <strong>Colombo–Rambukkana | Nawalapitiya–Kotagala | Ambewela–Badulla (Access to Ella & Nine Arch Bridge available only via this train segment or by road)</strong>.
            </div>
        </div>
    `;
    
    // Insert at the very top of body
    document.body.prepend(alertBar);

    // Toggle pause on click/touch for mobile & desktop
    alertBar.addEventListener('click', () => {
        alertBar.classList.toggle('paused');
    });

    // Dynamic header positioning logic
    const updateHeaderPos = () => {
        const height = alertBar.offsetHeight;
        document.documentElement.style.setProperty('--alert-height', `${height}px`);
    };

    // Initial set and update on resize
    updateHeaderPos();
    window.addEventListener('resize', updateHeaderPos);

    // --- GDPR Cookie Consent Implementation ---
    const showCookieConsent = () => {
        const consent = localStorage.getItem('triplanka_cookie_consent');
        if (consent) return;

        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <h3><i class="fas fa-cookie-bite"></i> Your Privacy & Cookies</h3>
                <p>We use essential cookies and analytical tools to ensure you get the best experience on TripLanka. By clicking "Accept All", you agree to our use of cookies to analyze site traffic and improve our services. </p>
            </div>
            <div class="cookie-btns">
                <button class="btn-accept">Accept All</button>
                <button class="btn-decline">Decline</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Trigger animation
        setTimeout(() => banner.classList.add('active'), 1000);

        const handleAction = (type) => {
            localStorage.setItem('triplanka_cookie_consent', type);
            banner.classList.remove('active');
            setTimeout(() => banner.remove(), 800);
        };

        banner.querySelector('.btn-accept').addEventListener('click', () => handleAction('accepted'));
        banner.querySelector('.btn-decline').addEventListener('click', () => handleAction('declined'));
    };

    showCookieConsent();
});

