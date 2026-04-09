const fs = require('fs');
const path = require('path');

function checkConsistency() {
    const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';
    const filesToCheck = [];
    
    function findHtml(dir) {
        fs.readdirSync(dir).forEach(f => {
            const p = path.join(dir, f);
            if (fs.statSync(p).isDirectory()) {
                if (f !== 'node_modules' && f !== '.git') findHtml(p);
            } else if (f.endsWith('.html')) {
                filesToCheck.push(p);
            }
        });
    }
    
    findHtml(baseDir);
    
    filesToCheck.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const hasNav = content.includes('<nav class="container">');
        const hasMobileBtn = content.includes('mobile-menu-btn');
        const hasSoloFemale = content.includes('solo-female.html');
        const dropdownCount = (content.match(/dropdown-menu/g) || []).length;
        
        console.log(`${path.relative(baseDir, file)}: Nav=${hasNav}, MobileBtn=${hasMobileBtn}, SoloFemale=${hasSoloFemale}, DropdownCount=${dropdownCount}`);
    });
}

checkConsistency();
