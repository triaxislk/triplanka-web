const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

// --- 1. RENAME ALL ASSETS ON DISK (Recursive) ---
const renamedMap = new Map(); // Old name -> New name

function renameAssets(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        const stats = fs.statSync(p);
        
        if (stats.isDirectory()) {
            renameAssets(p);
        } else {
            // Check for double spaces or space-before-period
            if (f.includes('  ') || f.includes(' .')) {
                const newF = f.replace(/  +/g, ' ').replace(/ \./g, '.');
                const newP = path.join(dir, newF);
                
                // Track the rename for HTML updates
                renamedMap.set(f, newF);
                
                if (!fs.existsSync(newP)) {
                    console.log(`Renaming File: "${f}" -> "${newF}"`);
                    fs.renameSync(p, newP);
                } else if (p !== newP) {
                    // If target exists, just delete old one or assume it's same
                    console.log(`Conflict/Duplicate: Deleting old "${f}"`);
                    fs.unlinkSync(p);
                }
            }
        }
    });
}

console.log("Normalizing all filenames in Images folder...");
renameAssets(path.join(baseDir, 'Images'));

// --- 2. UPDATE ALL HTML AND CSS FILES ---
const filesToUpdate = [];
function walkFiles(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.git', 'metadata', 'scripts', 'backups'].includes(f)) walkFiles(p);
        } else if (f.endsWith('.html') || f.endsWith('.css')) {
            filesToUpdate.push(p);
        }
    });
}
walkFiles(baseDir);

let totalUpdates = 0;

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // A. Replace all tracked renames
    renamedMap.forEach((newVal, oldVal) => {
        if (content.includes(oldVal)) {
            // Use regex for all occurrences
            const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            content = content.replace(new RegExp(escaped, 'g'), newVal);
        }
    });

    // B. Fix common messy paths (double spaces in links)
    content = content.replace(/(?:href|src|url)\(['"]?([^'"\)]*?)['"]?\)/g, (match, link) => {
        if (link.includes('  ') || link.includes(' .')) {
            return match.replace(/  +/g, ' ').replace(/ \./g, '.');
        }
        return match;
    });

    if (content !== original) {
        totalUpdates++;
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed references in: ${path.relative(baseDir, file)}`);
    }
});

console.log(`\nFINAL REPAIR COMPLETE:`);
console.log(`- Files updated: ${totalUpdates}`);
console.log(`- Renamed assets: ${renamedMap.size}`);
