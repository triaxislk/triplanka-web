const fs = require('fs');
const path = require('path');

function updateHeaderGlobally() {
    const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';
    
    const pages = [];
    function walk(dir) {
        fs.readdirSync(dir).forEach(f => {
            const p = path.join(dir, f);
            if (fs.statSync(p).isDirectory()) {
                if (f !== 'node_modules' && f !== '.git' && f !== '.agent' && f !== '.gemini' && f !== 'backups') walk(p);
            } else if (f.endsWith('.html')) {
                pages.push(p);
            }
        });
    }
    walk(baseDir);

    pages.forEach(filePath => {
        let depth = 0;
        const relative = path.relative(baseDir, filePath);
        
        // Depth calculation
        if (relative.includes('pages\\plans\\') || relative.includes('pages\\guide\\') || relative.includes('pages\\blog\\')) depth = 2;
        else if (relative.startsWith('pages\\')) depth = 1;
        else depth = 0;

        let content = fs.readFileSync(filePath, 'utf8');
        
        const rel = '../'.repeat(depth);
        const homePath = depth === 0 ? 'index.html' : rel + 'index.html';
        const pagesPath = depth === 0 ? 'pages' : (depth === 1 ? '.' : '..');
        const logoPath = rel + 'Images/Logos/Header_Logo_Isolated.png';
        const connectPath = depth === 0 ? 'pages/contact.html' : (depth === 1 ? 'contact.html' : '../contact.html');
        
        let plansSubPath = '';
        if (depth === 0) plansSubPath = 'pages/plans';
        else if (depth === 1) plansSubPath = 'plans';
        else if (relative.includes('pages\\guide\\') || relative.includes('pages\\blog\\')) plansSubPath = '../plans';
        else if (relative.includes('pages\\plans\\')) plansSubPath = '.';

        let guideSubPath = '';
        if (depth === 0) guideSubPath = 'pages/guide';
        else if (depth === 1) guideSubPath = 'guide';
        else if (relative.includes('pages\\guide\\')) guideSubPath = '.';
        else if (relative.includes('pages\\plans\\') || relative.includes('pages\\blog\\')) guideSubPath = '../guide';

        // Fix FAQ link
        const faqPath = depth === 0 ? 'pages/travel-info.html#faq' : (depth === 1 ? 'travel-info.html#faq' : '../travel-info.html#faq');

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
  
  <li class="dropdown">
  <a href="${pagesPath}/travel-info.html">Information <i class="fas fa-chevron-down"></i></a>
  <ul class="dropdown-menu">
  <li><a href="${pagesPath}/travel-info.html">Travel Information</a></li>
  <li><a href="${faqPath}">FAQ</a></li>
  <li><a href="${pagesPath}/visa.html">Visa Details</a></li>
  </ul>
  </li>
  <li class="dropdown">
  <a href="${pagesPath}/guide.html">Travel Guide <i class="fas fa-chevron-down"></i></a>
  <ul class="dropdown-menu">
  <li><a href="${guideSubPath}/negombo.html">Negombo, Mannar & Kalpitiya</a></li>
  <li><a href="${guideSubPath}/colombo.html">Colombo</a></li>
  <li><a href="${guideSubPath}/kandy.html">Pinnawala, Kandy & Gampola</a></li>
  <li><a href="${guideSubPath}/sigiriya.html">Sigiriya, Dambulla & Matale</a></li>
  <li><a href="${guideSubPath}/rathnapura.html">Ratnapura, Udawalawe & Adam's Peak</a></li>
  <li><a href="${guideSubPath}/nuwara-eliya.html">Kitulgala & Nuwara Eliya</a></li>
  <li><a href="${guideSubPath}/ella.html">Ella & Badulla</a></li>
  <li><a href="${guideSubPath}/ampara.html">Ampara & Dambana</a></li>
  <li><a href="${guideSubPath}/galle.html">Galle, Bentota & Hikkaduwa</a></li>
  <li><a href="${guideSubPath}/hambantota.html">Hambantota & Matara</a></li>
  <li><a href="${guideSubPath}/polonnaruwa.html">Habarana & Polonnaruwa</a></li>
  <li><a href="${guideSubPath}/anuradhapura.html">Anuradhapura & Mihintale</a></li>
  <li><a href="${guideSubPath}/batticaloa.html">Batticaloa</a></li>
  <li><a href="${guideSubPath}/trincomalee.html">Trincomalee</a></li>
  <li><a href="${guideSubPath}/jaffna.html">Jaffna</a></li>
  </ul>
  </li>
  <li class="dropdown">
  <a href="${pagesPath}/plans.html">Journey Hub <i class="fas fa-chevron-down"></i></a>
  <ul class="dropdown-menu">
  <li><a href="${plansSubPath}/solo-female.html">Solo Female Travel Plan</a></li>
  <li><a href="${plansSubPath}/solo-male.html">Solo Male Travel Plan</a></li>
  <li><a href="${plansSubPath}/leisure.html">Leisure & Relaxation Plan</a></li>
  <li><a href="${plansSubPath}/honeymoon.html">Honeymoon & Romance Plan</a></li>
  <li><a href="${plansSubPath}/wildlife.html">Wildlife Lovers Touring Plan</a></li>
  <li><a href="${plansSubPath}/adventure.html">Adventure Lovers Touring Plan</a></li>
  <li><a href="${plansSubPath}/surfing.html">Sea Surfing Touring Plan</a></li>
  <li><a href="${plansSubPath}/family-friendly.html">Family Friendly Plan</a></li>
  <li><a href="${plansSubPath}/cultural-heritage.html">Cultural Heritage Plan</a></li>
  <li><a href="${plansSubPath}/budget-backpacking.html">Budget Backpacking Plan</a></li>
  <li><a href="${plansSubPath}/beach-paradise.html">Beach & Coastal Paradise Plan</a></li>
  </ul>
  </li>
  <li class="dropdown">
  <a href="${pagesPath}/blog.html">Travel Blog <i class="fas fa-chevron-down"></i></a>
  <ul class="dropdown-menu">
  <li><a href="${pagesPath}/blog.html?filter=guides">Travel Guides</a></li>
  <li><a href="${pagesPath}/blog.html?filter=culture">Culture & Food</a></li>
  <li><a href="${pagesPath}/blog.html?filter=nature">Nature & Wildlife</a></li>
  </ul>
  </li>
  <li><a href="${pagesPath}/hotels.html">Hotels</a></li>
  <li><a href="${pagesPath}/rentals.html">Rentals</a></li>
  <li><a href="${pagesPath}/gallery.html">Cinematic Gallery</a></li>
  <li><a href="${connectPath}">Contact Us</a></li>
  </ul>
  <div class="mobile-menu-btn">
  <i class="fas fa-bars"></i>
  </div>
  </nav>
</header>`;

        const middleContentRegex = /<header>[\s\S]*?<\/header>/i;
        if (middleContentRegex.test(content)) {
            const newContent = content.replace(middleContentRegex, fullHeaderHtml);
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent);
                console.log(`Updated header in ${relative}`);
            }
        }
    });
}

updateHeaderGlobally();



