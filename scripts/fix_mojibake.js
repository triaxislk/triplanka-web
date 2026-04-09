const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (dirPath.includes('node_modules') || dirPath.includes('.git') || dirPath.includes('.gemini')) return;
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    const fixes = [
        { regex: /â€™/g, replace: '’' },
        { regex: /â€œ/g, replace: '“' },
        { regex: /â€\s?/g, replace: '”' }, // handle special case
        { regex: /â€/g, replace: '”' }, // generic backstop
        { regex: /â€“/g, replace: '–' },
        { regex: /â€”/g, replace: '—' },
        { regex: /â€¦/g, replace: '…' },
        { regex: /Ã¢â‚¬â€œ/g, replace: '–' }, 
        { regex: /Ã¢â‚¬â€/g, replace: '—' }, 
        { regex: /Ã‚Â\s?/g, replace: ' ' },
        { regex: /Â\s?/g, replace: ' ' }, 
        { regex: /Â/g, replace: ' ' }, 
        // Flags
        { regex: /ðŸ‡¬ðŸ‡§/g, replace: '🇬🇧' },
        { regex: /ðŸ‡©ðŸ‡ª/g, replace: '🇩🇪' },
        { regex: /ðŸ‡³ðŸ‡±/g, replace: '🇳🇱' },
        { regex: /ðŸ‡§ðŸ‡ª/g, replace: '🇧🇪' },
        { regex: /ðŸ‡ªðŸ‡¸/g, replace: '🇪🇸' },
        { regex: /ðŸ‡¦ðŸ‡º/g, replace: '🇦🇺' },
        { regex: /ðŸ‡µðŸ‡±/g, replace: '🇵🇱' },
        { regex: /ðŸ‡°ðŸ‡¿/g, replace: '🇰🇿' },
        { regex: /ðŸ‡¸ðŸ‡¦/g, replace: '🇸🇦' },
        { regex: /ðŸ‡¦ðŸ‡ª/g, replace: '🇦🇪' },
        { regex: /ðŸ‡³ðŸ‡µ/g, replace: '🇳🇵' },
        { regex: /ðŸ‡¨ðŸ‡³/g, replace: '🇨🇳' },
        { regex: /ðŸ‡®ðŸ‡³/g, replace: '🇮🇳' },
        { regex: /ðŸ‡®ðŸ‡©/g, replace: '🇮🇩' },
    ];
    
    let original = content;
    fixes.forEach(fix => {
        content = content.replace(fix.regex, fix.replace);
    });

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed ' + filePath);
    }
}

console.log("Starting mojibake fix...");
walkDir('.', processFile);
console.log("Done.");
