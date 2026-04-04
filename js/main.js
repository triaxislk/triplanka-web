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

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
}

// Dropdown Toggle for Mobile
document.querySelectorAll('.dropdown > a').forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        }
    });
});

// System: Automated Global Photo Attribution Manager
document.addEventListener('DOMContentLoaded', () => {
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

    // Ensure hover mechanics apply broadly
    if (!document.querySelector('#dynamic-attribution-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-attribution-styles';
        style.innerHTML = `
            .img-container:hover .photo-attribution,
            .hero:hover .photo-attribution,
            .blog-hero:hover .photo-attribution,
            .card-bg:hover .photo-attribution,
            .article-header:hover .photo-attribution,
            .plans-hero:hover .photo-attribution,
            .info-hero:hover .photo-attribution,
            .contact-hero:hover .photo-attribution,
            .hotels-hero:hover .photo-attribution,
            .dest-card:hover .photo-attribution { opacity: 1; transform: translate(-50%, -2px); }
        `;
        document.head.appendChild(style);
    }

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
});
