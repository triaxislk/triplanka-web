const fs = require('fs');
const path = require('path');

function updateHeaderGlobally() {
    const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';
    
    function findHtml(dir, depth = 0) {
        const files = fs.readdirSync(dir);
        files.forEach(f => {
            const p = path.join(dir, f);
            if (fs.statSync(p).isDirectory()) {
                if (f !== 'node_modules' && f !== '.git' && f !== '.agent' && f !== '.gemini') {
                    // Determine depth
                    let newDepth = depth;
                    if (p.includes('pages')) {
                        if (p.endsWith('pages')) newDepth = 1;
                        else newDepth = 2;
                    }
                    findHtml(p, newDepth);
                }
            } else if (f.endsWith('.html')) {
                updateFile(p, depth);
            }
        });
    }

    function updateFile(filePath, depth) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        const rel = '../'.repeat(depth);
        const homePath = depth === 0 ? 'index.html' : rel + 'index.html';
        const pagesPath = depth === 0 ? 'pages' : (depth === 1 ? '.' : '..');
        const flagPath = rel + 'Images/Site Photos/Sri-Lanka-flag.jpg';
        const logoPath = rel + 'Images/Logos/Logo_New.png';
        const connectPath = depth === 0 ? 'pages/contact.html' : (depth === 1 ? 'contact.html' : '../contact.html');
        
        let plansSubPath = '';
        if (depth === 0) plansSubPath = 'pages/plans';
        else if (depth === 1) plansSubPath = 'plans';
        else if (filePath.includes('guide')) plansSubPath = '../plans';
        else if (filePath.includes('plans')) plansSubPath = '.';

        const fullHeaderHtml = `
    <header>
        <nav class="container">
            <div class="logo">
                <a href="${homePath}">
                    <img src="${logoPath}" alt="TripLanka Logo" class="logo-img">
                </a>
            </div>
            
            <ul class="nav-links">
                <li><a href="${homePath}">Home</a></li>
                <li><a href="${pagesPath}/travel-info.html">Information</a></li>
                <li><a href="${pagesPath}/guide.html">Travel Guide</a></li>
                <li class="dropdown">
                    <a href="${pagesPath}/plans.html">Touring Plans <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="${plansSubPath}/solo-female.html">Solo Female Travel Plan</a></li>
                        <li><a href="${plansSubPath}/solo-male.html">Solo Male Travel Plan</a></li>
                        <li><a href="${plansSubPath}/leisure.html">Leisure & Relaxation Plan</a></li>
                        <li><a href="${plansSubPath}/honeymoon.html">Honeymoon & Romance Plan</a></li>
                        <li><a href="${plansSubPath}/wildlife.html">Wildlife Lovers Touring Plan</a></li>
                        <li><a href="${plansSubPath}/adventure.html">Adventure Lovers Touring Plan</a></li>
                        <li><a href="${plansSubPath}/surfing.html">Sea Surfing Touring Plan</a></li>
                    </ul>
                </li>
                <li><a href="${pagesPath}/gallery.html">Photo Gallery</a></li>
                <li><a href="${connectPath}" class="btn-primary">Connect</a></li>
                <li class="flag-item">
                    <img src="${flagPath}" alt="Sri Lanka Flag" class="flag-img">
                </li>
            </ul>
            <div class="mobile-menu-btn" style="display: none;">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </header>`;

        const headerRegex = /<header>[\s\S]*?<\/header>/i;
        if (headerRegex.test(content)) {
            const newContent = content.replace(headerRegex, fullHeaderHtml);
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent);
                console.log(`Updated header in ${filePath}`);
            }
        }
    }

    findHtml(baseDir);
}

updateHeaderGlobally();
