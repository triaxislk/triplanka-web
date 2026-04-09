const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

function walk(dir, bDir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== '.agent' && f !== '.gemini' && f !== '.system_generated') walk(p, bDir);
        } else if (f.endsWith('.html')) {
            updateFile(p, bDir);
        }
    });
}

function updateFile(filePath, bDir) {
    let depth = 0;
    const relative = path.relative(bDir, filePath);
    
    // Determine depth for relative links
    if (relative.includes('pages\\plans\\') || relative.includes('pages\\guide\\')) depth = 2;
    else if (relative.startsWith('pages\\')) depth = 1;
    else depth = 0;

    const pagesPath = depth === 0 ? 'pages' : (depth === 1 ? '.' : '..');
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Match the common "Information" navigation link
    const infoRegex = /<li><a href="[^"]*travel-info\.html">Information<\/a><\/li>/i;
    
    // Premium Dropdown HTML
    const dropdownHtml = `
                <li class="dropdown">
                    <a href="${pagesPath}/travel-info.html">Information <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="${pagesPath}/travel-info.html">Travel Information</a></li>
                        <li><a href="${pagesPath}/visa.html">Visa Details</a></li>
                    </ul>
                </li>`;

    if (infoRegex.test(content)) {
        const newContent = content.replace(infoRegex, dropdownHtml);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated: ${relative}`);
        }
    }
}

console.log('Starting Information dropdown update...');
walk(baseDir, baseDir);
console.log('Update complete.');
