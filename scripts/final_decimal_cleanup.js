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

let decimalFixes = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // A. FIX DECIMALS: "2. 5rem" or "0. 6" -> "2.5rem"
    content = content.replace(/(\d+)\.\s+(\d+)/g, '$1.$2');
    
    // B. FIX GOOGLE FONT RANGES: "400.. 900" -> "400..900"
    content = content.replace(/(\d+)\.\.\s+(\d+)/g, '$1..$2');
    
    // C. FIX ACCIDENTAL SPACES IN UNIT-LESS NUMBERS (if any)
    content = content.replace(/line-height:\s*(\d+)\.\s*(\d+)/g, 'line-height: $1.$2');

    if (content !== original) {
        decimalFixes++;
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Decimal Cleaned: ${path.relative(baseDir, file)}`);
    }
});

console.log(`\nFINAL DECIMAL CLEANUP COMPLETE: ${decimalFixes} files perfectly tuned.`);
