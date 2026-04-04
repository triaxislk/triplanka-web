const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

// --- 1. FIND AND RENAME ASSETS WITH DOUBLE SPACES ---
function renameAssets(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            renameAssets(p);
        } else if (f.includes('  ')) {
            const newF = f.replace(/  /g, ' ');
            const newP = path.join(dir, newF);
            if (!fs.existsSync(newP)) {
                console.log(`Renaming: "${f}" -> "${newF}"`);
                fs.renameSync(p, newP);
            }
        }
    });
}
console.log("Renaming double-space assets...");
renameAssets(path.join(baseDir, 'Images'));

// --- 2. AUDIT AND FIX ALL HTML FILES ---
const htmlFiles = [];
function walkHtml(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.git', 'metadata', 'scripts', 'backups'].includes(f)) walkHtml(p);
        } else if (f.endsWith('.html')) {
            htmlFiles.push(p);
        }
    });
}
walkHtml(baseDir);

const fixCount = {
    links: 0,
    spacing: 0,
    capitalization: 0,
    punctuation: 0
};

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // A. Fix double space image references
    content = content.replace(/(?:href|src|url)\(["'](.*?)["']\)/g, (match, link) => {
        if (link.includes('  ')) {
            fixCount.links++;
            return match.replace(/  /g, ' ');
        }
        return match;
    });

    // B. Punctuation spacing (e.g., "word , " -> "word, ")
    content = content.replace(/ \./g, '.');
    content = content.replace(/ ,/g, ',');
    content = content.replace(/,/g, ', '); // Ensure space after comma
    content = content.replace(/,  /g, ', '); // Fix accidental double space
    
    // C. Capitalization
    content = content.replace(/sri lanka/gi, (match) => {
        if (match !== "Sri Lanka") {
            fixCount.capitalization++;
            return "Sri Lanka";
        }
        return match;
    });

    // D. Double spaces in text (caution not to break indentations)
    // We only target text between tags
    content = content.replace(/>([^<]+)</g, (match, text) => {
        if (text.includes('  ')) {
            fixCount.spacing++;
            return `>${text.replace(/  +/g, ' ')}<`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${path.relative(baseDir, file)}`);
    }
});

console.log("AUDIT COMPLETE:");
console.log(`- Fixed links: ${fixCount.links}`);
console.log(`- Fixed text spacing: ${fixCount.spacing}`);
console.log(`- Fixed capitalization: ${fixCount.capitalization}`);
