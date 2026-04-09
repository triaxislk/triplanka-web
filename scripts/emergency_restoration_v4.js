const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

// --- 1. FIND ALL HTML AND CSS FILES ---
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

let totalFixes = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // A. RESTORE BROKEN CSS SELECTORS & CLASSES
    // Fix space after period in technical context: ". plans" -> ".plans"
    // Regex matches . followed by space and then a letter (common for classes)
    content = content.replace(/\. ([a-zA-Z])/g, '.$1');
    
    // B. RESTORE PATHS
    content = content.replace(/\.\. \//g, '../');
    content = content.replace(/\. \//g, './');
    content = content.replace(/\. jpg/g, '.jpg');
    content = content.replace(/\. png/g, '.png');
    content = content.replace(/\. css/g, '.css');
    content = content.replace(/\. js/g, '.js');
    
    // C. RESTORE VALUES
    content = content.replace(/0\. (\d)/g, '0.$1');
    content = content.replace(/rgba\((\d+), (\d+), (\d+), (\d+\.?)\s+(\d+)\)/g, 'rgba($1, $2, $3, $4$5)');
    
    // D. RESTORE DOUBLE-SPACE-COMMA
    content = content.replace(/,  +/g, ', ');

    if (content !== original) {
        totalFixes++;
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Restored: ${path.relative(baseDir, file)}`);
    }
});

console.log(`\nRECOVERY COMPLETE: ${totalFixes} files restored to premium technical state.`);
