const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\koral\\OneDrive\\Documents\\TriAxis\\Github\\triplanka-web';

// 1. Get all assets on disk with their filenames
const assetMap = new Map(); // fileName -> absolutePath
function mapAssets(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.git'].includes(f)) mapAssets(p);
        } else {
            // Store by filename (normalized)
            assetMap.set(f.toLowerCase(), p);
        }
    });
}
mapAssets(path.join(baseDir, 'Images'));

// 2. Parse the broken links from metadata/broken_links_raw.txt
const report = fs.readFileSync(path.join(baseDir, 'metadata', 'broken_links_raw.txt'), 'utf8');
const lines = report.split('\n');
const brokenPairs = [];

lines.forEach(line => {
    if (line.startsWith('[BROKEN]')) {
        // [BROKEN] file -> "link"
        const match = line.match(/\[BROKEN\] (.*?) -> "(.*?)"/);
        if (match) {
            brokenPairs.push({ file: match[1], link: match[2] });
        }
    }
});

console.log(`Analyzing ${brokenPairs.length} broken links...`);

// 3. Repair each broken pair
brokenPairs.forEach(pair => {
    const htmlFile = path.join(baseDir, pair.file);
    if (!fs.existsSync(htmlFile)) return;
    
    let content = fs.readFileSync(htmlFile, 'utf8');
    const linkFileName = path.basename(pair.link).toLowerCase();
    
    // Find a replacement in our asset map
    if (assetMap.has(linkFileName)) {
        const targetAbs = assetMap.get(linkFileName);
        const fileDir = path.dirname(htmlFile);
        
        // Calculate new relative path
        let newRel = path.relative(fileDir, targetAbs).replace(/\\/g, '/');
        
        // Update content
        const escaped = pair.link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        content = content.replace(new RegExp(escaped, 'g'), newRel);
        
        fs.writeFileSync(htmlFile, content, 'utf8');
        console.log(`Repaired: ${pair.file} -> Fixed link to "${newRel}"`);
    } else {
        console.log(`Could not find replacement for: ${pair.link} in ${pair.file}`);
    }
});
