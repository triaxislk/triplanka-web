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
// --- Global Visitor Counter Utilities ---

// Helper: Compact Number Formatter (100000 -> 100k)
function formatCompactNumber(number) {
    if (number < 100000) {
        return number.toLocaleString(); // Keep full for < 100k as requested
    } else if (number < 1000000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
        return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
}

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

// Firebase Real-Time Visitor UI Link (Global)
window.updateVisitorUI = (count) => {
    const liveCounter = document.getElementById('live-visitor-count');
    if (liveCounter && count) {
        // Animate from 0 to target in 2 seconds for a snappy feel
        animateValue(liveCounter, 0, count, 2000, true);
    } else if (count) {
        // Cache the count if the UI isn't ready
        window.pendingVisitorCount = count;
    }
};

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
                    
                    // Trigger Real Visitor Count if we had a pending update
                    if (window.pendingVisitorCount) {
                        window.updateVisitorUI(window.pendingVisitorCount);
                        delete window.pendingVisitorCount;
                    }
                    
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

    // --- Live Status Hub (Modern Replacement) ---
    const createStatusHub = () => {
        const hub = document.createElement('div');
        hub.className = 'status-hub-container';
        hub.innerHTML = `
            <div class="status-hub-trigger" id="status-hub-trigger">
                <span class="pulse-dot"></span>
                <i class="fas fa-bullhorn"></i>
                <span>Live Updates</span>
            </div>
            <div class="status-hub-panel" id="status-hub-panel">
                <div class="status-hub-header">
                    <h3><i class="fas fa-satellite-dish"></i> Status Hub</h3>
                    <i class="fas fa-times status-hub-close" id="status-hub-close"></i>
                </div>
                <div class="status-hub-content">
                    <div class="status-hub-section">
                        <span class="status-hub-section-title">Live Weather Hub</span>
                        <div class="weather-grid-hub" id="weather-grid-hub">
                            <div class="weather-card-hub">
                                <span class="city">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <div class="status-hub-section">
                        <span class="status-hub-section-title">Travel Advisories</span>
                        <div class="alert-hub-list">
                            <div class="alert-hub-item">
                                <strong>Critical Water Safety</strong>
                                <p>Never swim or bathe in unknown rivers, lakes, waterfalls, or the sea without consulting locals. Recent incidents report sudden depths and strong currents.</p>
                            </div>
                            <div class="alert-hub-item">
                                <strong>Selfie Safety Advisory</strong>
                                <p>Avoid taking selfies near cliff edges at Ella Rock or World's End. Stay within designated safe areas.</p>
                            </div>
                            <div class="alert-hub-item info">
                                <strong>Travel Advisory: Train Services</strong>
                                <p>Upcountry train services are restricted due to 223 track breakages caused by <strong>Cyclone Ditwah</strong>. Operational segments: Colombo–Rambukkana | Nawalapitiya–Kotagala. <strong>Restricted Rail: Ambewela–Badulla</strong> (Nine Arch Bridge is accessible via this train). Ella town access available via road.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(hub);

        const trigger = document.getElementById('status-hub-trigger');
        const panel = document.getElementById('status-hub-panel');
        const close = document.getElementById('status-hub-close');

        const togglePanel = (forceState = null) => {
            const isOpen = panel.classList.contains('active');
            const shouldOpen = forceState === null ? !isOpen : forceState;
            
            if (shouldOpen) {
                panel.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                panel.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        trigger.addEventListener('click', () => togglePanel());
        close.addEventListener('click', () => togglePanel(false));

        // Reset alert height since bar is removed
        document.documentElement.style.setProperty('--alert-height', '0px');

        // Fetch Weather for Hub
        const updateHubWeather = async (retryCount = 0) => {
            const locations = [
                { name: "Colombo", lat: 6.9271, lon: 79.8612 },
                { name: "Kandy", lat: 7.2906, lon: 80.6337 },
                { name: "Nuwara Eliya", lat: 6.9497, lon: 80.7891 },
                { name: "Ella", lat: 6.8667, lon: 81.0466 },
                { name: "Sigiriya", lat: 7.9570, lon: 80.7603 },
                { name: "Galle", lat: 6.0535, lon: 80.2210 },
                { name: "Mirissa", lat: 5.9483, lon: 80.4716 },
                { name: "Hikkaduwa", lat: 6.1395, lon: 80.1063 },
                { name: "Bentota", lat: 6.4217, lon: 80.0033 },
                { name: "Arugam Bay", lat: 6.8422, lon: 81.8286 },
                { name: "Trincomalee", lat: 8.5873, lon: 81.2152 },
                { name: "Anuradhapura", lat: 8.3122, lon: 80.4131 },
                { name: "Polonnaruwa", lat: 7.9403, lon: 81.0188 },
                { name: "Jaffna", lat: 9.6615, lon: 80.0255 },
                { name: "Hambantota", lat: 6.1246, lon: 81.1185 }
            ];

            try {
                const lats = locations.map(l => l.lat).join(',');
                const lons = locations.map(l => l.lon).join(',');
                
                // Simplified fetch to bypass strict security filters
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`);
                
                if (!res.ok) throw new Error("API_Response_Not_OK");
                const data = await res.json();
                
                const grid = document.getElementById('weather-grid-hub');
                if (!grid) return;
                grid.innerHTML = '';
                
                locations.forEach((loc, i) => {
                    const weather = Array.isArray(data) ? data[i].current_weather : data.current_weather;
                    if (!weather) return;
                    const temp = weather.temperature.toFixed(0);
                    const code = weather.weathercode;
                    const icon = code === 0 ? '☀️' : ([1,2,3].includes(code) ? '⛅' : ([61,63,65].includes(code) ? '🌧️' : '🌡️'));
                    
                    grid.innerHTML += `
                        <div class="weather-card-hub">
                            <span class="city">${loc.name}</span>
                            <span class="temp">${icon} ${temp}°C</span>
                        </div>
                    `;
                });
            } catch (e) {
                console.warn("Weather Sync Attempt Failed:", e.message);
                if (retryCount < 3) {
                    setTimeout(() => updateHubWeather(retryCount + 1), 5000); // Retry in 5s
                } else {
                    const grid = document.getElementById('weather-grid-hub');
                    if (grid) grid.innerHTML = '<div class="weather-card-hub" style="grid-column: span 2;"><span class="city">Weather system syncing...</span></div>';
                }
            }
        };

        updateHubWeather();
        setInterval(updateHubWeather, 1800000);
    };

    createStatusHub();

    // --- Cookie Consent System ---
    function showCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const banner = document.createElement('div');
            banner.className = 'cookie-banner';
            banner.innerHTML = `
                <div class="cookie-content">
                    <h3><i class="fas fa-cookie-bite"></i> Cookie Privacy</h3>
                    <p>We use essential cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our <a href="pages/privacy-policy.html">Privacy Policy</a>.</p>
                </div>
                <div class="cookie-actions">
                    <button class="cookie-btn accept" id="accept-cookies">Accept All</button>
                    <button class="cookie-btn decline" id="decline-cookies">Decline</button>
                </div>
            `;
            document.body.appendChild(banner);
            
            // Trigger animation
            setTimeout(() => banner.classList.add('active'), 100);

            document.getElementById('accept-cookies').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.classList.remove('active');
                setTimeout(() => banner.remove(), 600);
            });

            document.getElementById('decline-cookies').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                banner.classList.remove('active');
                setTimeout(() => banner.remove(), 600);
            });
        }
    }

    showCookieConsent();
});

