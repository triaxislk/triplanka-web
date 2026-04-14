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
        // Scripts removals (Wrong code)
        { regex: /<script nowprocket data-noptimize="1" data-cfasync="false" data-wpfc-render="false" seraph-accel-crit="1" data-no-defer="1">[\s\S]*?https:\/\/emrldco\.com\/NTE1OTE1\.js[\s\S]*?<\/script>/g, replace: '' },
        
        // Punctuation
        { regex: /â€™/g, replace: "’" },
        { regex: /â€œ/g, replace: '“' },
        { regex: /â€\s?â€˜/g, replace: '-' }, // Special case for "visa-free" found in visa.html
        { regex: /â€\s?/g, replace: '”' }, 
        { regex: /â€/g, replace: '”' }, 
        { regex: /â€“/g, replace: '–' },
        { regex: /â€”/g, replace: '—' },
        { regex: /â€¦/g, replace: '…' },
        { regex: /Ã¢â‚¬â€œ/g, replace: '–' }, 
        { regex: /Ã¢â‚¬â€/g, replace: '—' }, 
        { regex: /Ã‚Â\s?/g, replace: ' ' },
        { regex: /Â\s?/g, replace: ' ' }, 
        { regex: /Â/g, replace: ' ' }, 
        
        // Flags (Commonly encountered mojibake for flag emojis)
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
        { regex: /ðŸ‡·ðŸ‡º/g, replace: '🇷🇺' },
        { regex: /ðŸ‡¹ðŸ‡­/g, replace: '🇹🇭' },
        { regex: /ðŸ‡²ðŸ‡¾/g, replace: '🇲🇾' },
        { regex: /ðŸ‡¯ðŸ‡µ/g, replace: '🇯🇵' },
        { regex: /ðŸ‡«ðŸ‡·/g, replace: '🇫🇷' },
        { regex: /ðŸ‡ºðŸ‡¸/g, replace: '🇺🇸' },
        { regex: /ðŸ‡¨ðŸ‡¦/g, replace: '🇨🇦' },
        { regex: /ðŸ‡¨ðŸ‡¿/g, replace: '🇨🇿' },
        { regex: /ðŸ‡®ðŸ‡¹/g, replace: '🇮🇹' },
        { regex: /ðŸ‡¨ðŸ‡­/g, replace: '🇨🇭' },
        { regex: /ðŸ‡¦ðŸ‡¹/g, replace: '🇦🇹' },
        { regex: /ðŸ‡®ðŸ‡±/g, replace: '🇮🇱' },
        { regex: /ðŸ‡§ðŸ‡¾/g, replace: '🇧🇾' },
        { regex: /ðŸ‡®ðŸ‡·/g, replace: '🇮🇷' },
        { regex: /ðŸ‡¸ðŸ‡ª/g, replace: '🇸🇪' },
        { regex: /ðŸ‡«ðŸ‡®/g, replace: '🇫🇮' },
        { regex: /ðŸ‡©ðŸ‡°/g, replace: '🇩🇰' },
        { regex: /ðŸ‡°ðŸ‡·/g, replace: '🇰🇷' },
        { regex: /ðŸ‡¶ðŸ‡¦/g, replace: '🇶🇦' },
        { regex: /ðŸ‡´ðŸ‡²/g, replace: '🇴🇲' },
        { regex: /ðŸ‡§ðŸ‡­/g, replace: '🇧🇭' },
        { regex: /ðŸ‡³ðŸ‡¿/g, replace: '🇳🇿' },
        { regex: /ðŸ‡°ðŸ‡¼/g, replace: '🇰🇼' },
        { regex: /ðŸ‡³ðŸ‡´/g, replace: '🇳🇴' },
        { regex: /ðŸ‡¹ðŸ‡·/g, replace: '🇹🇷' },
        { regex: /ðŸ‡µðŸ‡°/g, replace: '🇵🇰' },
        
        // Misc Icons
        { regex: /ðŸš£/g, replace: '🚣' },
        { regex: /ðŸŒ³/g, replace: '🌳' },
        { regex: /ðŸŒ‰/g, replace: '🌉' },
        
        // Accented Characters
        { regex: /Ã¼/g, replace: 'ü' },
        { regex: /Ã©/g, replace: 'é' },
        { regex: /Ã¡/g, replace: 'á' },
        { regex: /Ã­/g, replace: 'í' },
        { regex: /Ã³/g, replace: 'ó' },
        { regex: /Ãº/g, replace: 'ú' },
        { regex: /Ã±/g, replace: 'ñ' },
        { regex: /Ã“/g, replace: 'Ó' },
        { regex: /faÃƒ\s?§ades/g, replace: 'façades' },
        { regex: /faÃƒÂ§ades/g, replace: 'façades' },
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
