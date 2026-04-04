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

const broken = [];

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const dir = path.dirname(file);
    const relFile = path.relative(baseDir, file);
    
    // Find href/src values
    const regex = /(?:href|src)=["'](.*?)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let link = match[1];
        
        // Skip irrelevant links
        if (!link || link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('whatsapp:') || link.startsWith('#') || link.startsWith('data:')) continue;
        
        // Clean path
        link = link.split('?')[0].split('#')[0];
        try { link = decodeURIComponent(link); } catch(e) {}
        
        // Resolve path
        let absolutePath;
        if (link.startsWith('/')) {
            // Treat as root-relative
            absolutePath = path.join(baseDir, link.replace(/\//g, path.sep));
        } else {
            // Treat as relative to current file
            absolutePath = path.resolve(dir, link.replace(/\//g, path.sep));
        }

        if (!fs.existsSync(absolutePath)) {
            broken.push({ file: relFile, link: link, target: absolutePath });
        }
    }
});

console.log("--- START AUDIT REPORT ---");
if (broken.length === 0) {
    console.log("ALL LINKS VALID");
} else {
    broken.forEach(b => {
        console.log(`[BROKEN] ${b.file} -> "${b.link}"`);
    });
    console.log(`TOTAL BROKEN: ${broken.length}`);
}
console.log("--- END AUDIT REPORT ---");
