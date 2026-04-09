const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

// --- 1. FIND ALL HTML FILES ---
const htmlFiles = [];
function walkFiles(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.git', 'metadata', 'scripts', 'backups'].includes(f)) walkFiles(p);
        } else if (f.endsWith('.html')) {
            htmlFiles.push(p);
        }
    });
}
walkFiles(baseDir);

let totalPolishCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // SURGICAL TEXT-ONLY POLISH (Between tags)
    content = content.replace(/>([^<]+)</g, (match, text) => {
        let fixed = text;

        // A. Capitalization Standardization
        fixed = fixed.replace(/sri lanka/gi, (m) => {
            if (m.toLowerCase() === "sri lanka") return "Sri Lanka";
            return m;
        });
        fixed = fixed.replace(/trip lanka/gi, "TripLanka");

        // B. Common Grammar/Spelling Fixes
        fixed = fixed.replace(/touring plans/gi, "Journey Hub"); // Site-wide consistency
        fixed = fixed.replace(/blueprint/gi, (m) => m === "Blueprint" ? "Signature Itinerary" : m);

        // C. Punctuation Spacing Fixes (Zero double spaces allowed)
        fixed = fixed.replace(/ ,/g, ',');         // remove space before comma
        fixed = fixed.replace(/ \./g, '.');        // remove space before period
        fixed = fixed.replace(/,/g, ', ');         // ensure space after comma (will collapse below)
        fixed = fixed.replace(/\./g, '. ');        // ensure space after period (will collapse below)
        
        // D. Collapse multiple spaces (very aggressive)
        fixed = fixed.replace(/  +/g, ' ');
        fixed = fixed.replace(/, +/g, ', ');
        fixed = fixed.replace(/\. +/g, '. ');
        
        // E. Special cases (fixing ellipses and multiple dots)
        fixed = fixed.replace(/\. \. \./g, '...');
        fixed = fixed.replace(/\. \./g, '. ');
        
        // F. Trim leading/trailing whitespace inside text nodes (if not critical)
        // We'll leave it to avoid breaking layouts.

        if (fixed !== text) {
            totalPolishCount++;
            return `>${fixed}<`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Polished: ${path.relative(baseDir, file)}`);
    }
});

console.log(`\nMASTER POLISH COMPLETE: ${totalPolishCount} text segments standardized.`);
