const fs = require('fs');
const path = require('path');

function updateHeaderGlobally() {
    const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';
    
    const folders = [
        { dir: baseDir, depth: 0 },
        { dir: path.join(baseDir, 'pages'), depth: 1 },
        { dir: path.join(baseDir, 'pages', 'guide'), depth: 2 },
        { dir: path.join(baseDir, 'pages', 'plans'), depth: 2 }
    ];

    folders.forEach(({ dir, depth }) => {
        if (!fs.existsSync(dir)) return;
        
        const rel = '../'.repeat(depth);
        const homePath = depth === 0 ? 'index.html' : rel + 'index.html';
        const pagesPath = depth === 0 ? 'pages' : (depth === 1 ? '.' : '..');
        const flagPath = rel + 'Images/Site Photos/Sri-Lanka-flag.jpg';
        const logoPath = rel + 'Images/Logos/Logo Without Background.png';
        const connectPath = depth === 0 ? 'pages/contact.html' : (depth === 1 ? 'contact.html' : '../contact.html');
        
        // Plans sub-menu paths
        let plansSubPath = '';
        if (depth === 0) plansSubPath = 'pages/plans';
        else if (depth === 1) plansSubPath = 'plans';
        else if (dir.includes('guide')) plansSubPath = '../plans';
        else if (dir.includes('plans')) plansSubPath = '.';

        const fullNavHtml = `
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
                        <li><a href="${plansSubPath}/solo-female.html">Solo Female Travel</a></li>
                        <li><a href="${plansSubPath}/solo-male.html">Solo Male Travel</a></li>
                        <li><a href="${plansSubPath}/leisure.html">Leisure & Relaxation</a></li>
                        <li><a href="${plansSubPath}/honeymoon.html">Honeymoon & Romance</a></li>
                        <li><a href="${plansSubPath}/wildlife.html">Wildlife Lovers</a></li>
                        <li><a href="${plansSubPath}/adventure.html">Adventure Lovers</a></li>
                        <li><a href="${plansSubPath}/surfing.html">Sea Surfing</a></li>
                    </ul>
                </li>
                <li><a href="${pagesPath}/gallery.html">Photo Gallery</a></li>
                <li><a href="${connectPath}" class="btn-primary">Connect</a></li>
                <li class="flag-item">
                    <img src="${flagPath}" alt="Sri Lanka Flag" class="flag-img">
                </li>
            </ul>
            <div class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>
        </nav>`;

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
        files.forEach(file => {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace the entire nav container
            const navRegex = /<nav class="container">[\s\S]*?<\/nav>/i;
            
            if (navRegex.test(content)) {
                const newContent = content.replace(navRegex, fullNavHtml);
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent);
                    console.log(`Updated nav in ${filePath}`);
                }
            } else {
                console.log(`Warning: Could not find nav container in ${filePath}`);
            }
        });
    });
}

updateHeaderGlobally();
