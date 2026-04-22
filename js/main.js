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

    // 1. Firebase Real-Time Visitor UI Link
    window.updateVisitorUI = (count) => {
        if (liveCounter && count) {
            const target = count;
            // Animate from 0 to target in 2 seconds for a snappy feel
            animateValue(liveCounter, 0, target, 2000, true);
        }
    };

    const updateRealVisitorCount = () => {
        // Now handled by Firebase listener in index.html
        console.log('Visitor count update handled by Firebase');
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
        <div class="weather-label"><i class="fas fa-cloud-sun"></i> WEATHER</div>
        <div class="alert-ticker-container">
            <div class="ticker-content" id="alert-ticker-content">
                <span class="ticker-section">
                    <strong>CRITICAL WATER SAFETY:</strong> Never swim or bathe in unknown rivers, lakes, waterfalls, or the sea without consulting local residents or guides. Recent incidents have reported sudden depths and strong currents. Stay safe and use only designated zones.
                </span>
                <span class="ticker-section">
                    <strong>TRAVEL ADVISORY:</strong> Upcountry train services are restricted due to 223 track breakages caused by <strong>Cyclone Ditwah</strong>. Restoration is underway. 
                    Operational segments: <strong>Colombo–Rambukkana | Nawalapitiya–Kotagala | Ambewela–Badulla (Access to Ella & Nine Arch Bridge available only via this train segment or by road)</strong>.
                </span>
                <span class="ticker-section weather-updates" id="weather-ticker-section">
                    <strong>WEATHER FORECAST:</strong> Loading live weather updates...
                </span>
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

    // --- Weather Forecast System ---
    const updateWeather = async () => {
        const weatherSection = document.getElementById('weather-ticker-section');
        if (!weatherSection) return;

        const cities = [
            { name: "Katunayaka (CMB)", lat: 7.1620, lon: 79.8831 },
            { name: "Negombo", lat: 7.2089, lon: 79.8355 },
            { name: "Colombo", lat: 6.9271, lon: 79.8612 },
            { name: "Kandy", lat: 7.2906, lon: 80.6337 },
            { name: "Nuwara Eliya", lat: 6.9497, lon: 80.7891 },
            { name: "Sigiriya", lat: 7.9570, lon: 80.7603 },
            { name: "Ella", lat: 6.8667, lon: 81.0466 },
            { name: "Hambanthota", lat: 6.1246, lon: 81.1185 },
            { name: "Matara", lat: 5.9549, lon: 80.5550 },
            { name: "Galle", lat: 6.0535, lon: 80.2210 },
            { name: "Anuradhpura", lat: 8.3122, lon: 80.4131 },
            { name: "Polonnaruwa", lat: 7.9403, lon: 81.0188 },
            { name: "Batticaloa", lat: 7.7102, lon: 81.6924 },
            { name: "Trincomalee", lat: 8.5873, lon: 81.2152 },
            { name: "Jaffna", lat: 9.6615, lon: 80.0255 }
        ];

        const getWeatherIcon = (code) => {
            if (code === 0) return '☀️';
            if ([1, 2, 3].includes(code)) return '⛅';
            if ([45, 48].includes(code)) return '🌫️';
            if ([51, 53, 55].includes(code)) return '🌦️';
            if ([61, 63, 65].includes(code)) return '🌧️';
            if ([71, 73, 75].includes(code)) return '🌨️';
            if ([80, 81, 82].includes(code)) return '🚿';
            if ([95, 96, 99].includes(code)) return '⛈️';
            return '🌡️';
        };

        try {
            const latQuery = cities.map(c => c.lat).join(',');
            const lonQuery = cities.map(c => c.lon).join(',');
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latQuery}&longitude=${lonQuery}&current_weather=true`);
            const data = await response.json();

            if (data && Array.isArray(data)) {
                let weatherHtml = '<strong>WEATHER FORECAST:</strong> ';
                data.forEach((loc, index) => {
                    const city = cities[index];
                    const temp = loc.current_weather.temperature.toFixed(1);
                    const icon = getWeatherIcon(loc.current_weather.weathercode);
                    weatherHtml += `${city.name} ${icon} ${temp}°C ${index < data.length - 1 ? ' | ' : ''} `;
                });
                weatherSection.innerHTML = weatherHtml;
            } else if (data && data.current_weather) {
                // Single result case (unlikely with our query but good for safety)
                const temp = data.current_weather.temperature.toFixed(1);
                const icon = getWeatherIcon(data.current_weather.weathercode);
                weatherSection.innerHTML = `<strong>WEATHER FORECAST:</strong> ${cities[0].name} ${icon} ${temp}°C`;
            }
        } catch (error) {
            console.error('Weather update failed:', error);
            weatherSection.innerHTML = '<strong>WEATHER FORECAST:</strong> Updates temporarily unavailable. Stay safe!';
        }
    };

    // Initial fetch and set interval (every 30 mins)
    updateWeather();
    setInterval(updateWeather, 600000);

    showCookieConsent();
});

