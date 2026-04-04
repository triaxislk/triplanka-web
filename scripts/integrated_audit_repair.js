const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

// 1. MAP ALL ASSETS ON DISK
const assetMap = new Map(); // fileName.toLowerCase() -> absolutePath
function mapAssets(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.git', 'scripts', 'metadata'].includes(f)) mapAssets(p);
        } else {
            assetMap.set(f.toLowerCase(), p);
        }
    });
}
mapAssets(path.join(baseDir, 'Images'));
console.log(`Mapped ${assetMap.size} unique assets.`);

// 2. FIND ALL HTML/CSS FILES
const files = [];
function walkFiles(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.git', 'metadata', 'scripts', 'backups'].includes(f)) walkFiles(p);
        } else if (f.endsWith('.html') || f.endsWith('.css')) {
            files.push(p);
        }
    });
}
walkFiles(baseDir);

let repairCount = 0;

// 3. AUDIT AND REPAIR
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    const dir = path.dirname(file);
    
    // Find all href and src that point to local files
    const regex = /(?:href|src|url)\(['"]?([^'"\)\s#\?]*?)['"]?\)/g;
    let match;
    let replacements = [];
    
    while ((match = regex.exec(content)) !== null) {
        let link = match[1];
        if (!link || link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('/') || link.startsWith('data:')) continue;
        
        // Check if file exists at that path
        let targetPath = path.resolve(dir, link.replace(/\//g, path.sep));
        if (!fs.existsSync(targetPath)) {
            // BROKEN! Try to find a replacement by name
            const fileName = path.basename(link).toLowerCase();
            if (assetMap.has(fileName)) {
                const actualAbs = assetMap.get(fileName);
                let newRel = path.relative(dir, actualAbs).replace(/\\/g, '/');
                replacements.push({ old: link, new: newRel });
            }
        }
    }
    
    // Apply replacements
    replacements.forEach(r => {
        if (r.old !== r.new) {
            repairCount++;
            // Surgical replace: only replace exact instances
            const escaped = r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            content = content.replace(new RegExp(escaped, 'g'), r.new);
        }
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Repaired: ${path.relative(baseDir, file)} (${replacements.length} links)`);
    }
});

console.log(`INTEGRATED REPAIR COMPLETE: ${repairCount} links fixed.`);
