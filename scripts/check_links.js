const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';
const htmlFiles = [];

function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.git', '.agent', '.gemini', 'backups', 'metadata', 'scripts'].includes(f)) walk(p);
        } else if (f.endsWith('.html')) {
            htmlFiles.push(p);
        }
    });
}

walk(baseDir);

let brokenCount = 0;

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const dir = path.dirname(file);
    
    // Simple regex for href and src (ignoring external links and hash links)
    const links = content.match(/(?:href|src)=["'](.*?)["']/g) || [];
    
    links.forEach(linkMatch => {
        let link = linkMatch.match(/["'](.*?)["']/)[1];
        
        // Skip external links, mailto, tel, and hashes
        if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#')) return;
        if (link === '') return;

        // Strip query params or hashes from local paths
        link = link.split('?')[0].split('#')[0];

        // Decode URL components (e.g. %20 -> space)
        try {
            link = decodeURIComponent(link);
        } catch (e) {
            // If decoding fails, keep the original link
        }

        const absolutePath = path.resolve(dir, link);
        if (!fs.existsSync(absolutePath)) {
            console.log(`BROKEN LINK in ${path.relative(baseDir, file)}: ${link} -> (Expected: ${absolutePath})`);
            brokenCount++;
        }
    });
});

if (brokenCount === 0) {
    console.log("All local links are valid!");
} else {
    console.log(`Found ${brokenCount} broken links.`);
}
