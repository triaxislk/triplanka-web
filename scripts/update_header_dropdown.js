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
        const connectPath = depth === 0 ? 'pages/contact.html' : (depth === 1 ? 'contact.html' : '../contact.html');
        
        // Plans sub-menu paths
        let plansSubPath = '';
        if (depth === 0) plansSubPath = 'pages/plans';
        else if (depth === 1) plansSubPath = 'plans';
        else if (dir.includes('guide')) plansSubPath = '../plans';
        else if (dir.includes('plans')) plansSubPath = '.';

        const finalNavLinks = `
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
            </ul>`;

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
        files.forEach(file => {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            const navLinksRegex = /<ul class="nav-links">[\s\S]*?<\/ul>/i;
            
            if (navLinksRegex.test(content)) {
                const newContent = content.replace(navLinksRegex, finalNavLinks);
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent);
                    console.log(`Updated header in ${filePath}`);
                }
            }
        });
    });
}

updateHeaderGlobally();
