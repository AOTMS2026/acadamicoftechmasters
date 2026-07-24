const fs = require('fs');
const path = require('path');

function replaceInDir(dir, oldStr, newStr) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file.startsWith('.') || file === 'package-lock.json') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceInDir(fullPath, oldStr, newStr);
        } else {
            const ext = path.extname(file);
            if (['.ts', '.tsx', '.js', '.jsx', '.html', '.json', '.md', '.xml'].includes(ext)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                const rgx = new RegExp(oldStr, 'gi');
                if (rgx.test(content)) {
                    content = content.replace(rgx, newStr);
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('Updated:', fullPath);
                }
            }
        }
    }
}

replaceInDir('c:/Users/raman/Music/Aotms_2026/Frontend', 'aotms\\.in', 'academyoftechmasters.com');
replaceInDir('c:/Users/raman/Music/Aotms_2026/Backend', 'aotms\\.in', 'academyoftechmasters.com');
console.log('Domain replacement finished successfully.');
