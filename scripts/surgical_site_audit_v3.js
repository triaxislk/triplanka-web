const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

// --- 1. FIND ALL HTML FILES ---
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
    technical: 0,
    text: 0,
    links: 0
};

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // A. RESTORE TECHNICAL INTEGRITY (Fix accidentally broken CSS/Inline-Styles)
    // Fix rgba spacing: "rgba(0, 0, 0, 0. 5)" or similar
    content = content.replace(/rgba\((\d+), (\d+), (\d+), (\d+\.?\s?\d*)\)/g, (match, r, g, b, a) => {
        const cleanA = a.replace(/\s/g, ''); // Fix "0. 5" -> "0.5"
        return `rgba(${r}, ${g}, ${b}, ${cleanA})`;
    });
    
    // Fix linear-gradient comma spacing: "),  url" -> "), url"
    content = content.replace(/\),  +url/g, '), url');

    // B. SURGICAL TEXT-ONLY POLISH (Between <tags>)
    content = content.replace(/>([^<]+)</g, (match, text) => {
        // Skip script/style content if somehow matched (unlikely with this regex)
        let fixed = text;
        
        // Fix Capitalization
        fixed = fixed.replace(/sri lanka/gi, (m) => m === "Sri Lanka" ? m : "Sri Lanka");
        fixed = fixed.replace(/Touring Plans/g, "Journey Hub"); // Site-wide consistency
        fixed = fixed.replace(/Blueprint/g, "Travel Blueprint"); // Premium terminology

        // Fix Spacing & Punctuation
        fixed = fixed.replace(/ ,/g, ',');
        fixed = fixed.replace(/ \./g, '.');
        fixed = fixed.replace(/,/g, ', ');     // Add space after comma
        fixed = fixed.replace(/\./g, '. ');    // Add space after period
        fixed = fixed.replace(/, +/g, ', ');   // Collapse multiple spaces after comma
        fixed = fixed.replace(/\. +/g, '. ');  // Collapse multiple spaces after period
        fixed = fixed.replace(/  +/g, ' ');    // Collapse all other multiple spaces
        
        // Clean up common bad punctuation patterns
        fixed = fixed.replace(/\. \. \./g, '...'); // Fix broken ellipses
        fixed = fixed.replace(/ \. /g, '. ');      // Fix solitary periods
        
        if (fixed !== text) {
            fixCount.text++;
            return `>${fixed}<`;
        }
        return match;
    });

    // C. FIX IMAGE REFERENCES WITH DOUBLE SPACES (from file renames)
    // We already renamed files on disk to single space. 
    // Now we must ensure HTML matches (especially in blog background-image)
    content = content.replace(/(?:href|src|url)\(['"]?([^'"\)]*?)['"]?\)/g, (match, link) => {
        if (link.includes('  ')) {
            fixCount.links++;
            return match.replace(/  +/g, ' ');
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Polished: ${path.relative(baseDir, file)}`);
    }
});

console.log("SURGICAL POLISH COMPLETE:");
console.log(`- Technical fixes (CSS/Code): ${fixCount.technical}`);
console.log(`- Text node fixes: ${fixCount.text}`);
console.log(`- Asset link fixes: ${fixCount.links}`);
