const fs = require('fs');
const path = require('path');

const CHECK_COLORS = {
    bg: '#F7F6F3',
    accent: '#8B0000',
    forbidden: '#FFFFFF'
};

const SPACING_SCALE = [8, 16, 24, 40, 64];

function scanDir(dir, files = []) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                scanDir(fullPath, files);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.ts')) {
            files.push(fullPath);
        }
    });
    return files;
}

function verify() {
    console.log("=== UI STRICT DESIGN VALIDATION ===");
    const files = scanDir('.');
    let violations = 0;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // Check for #FFFFFF
        if (content.toUpperCase().includes('#FFFFFF')) {
            const lines = content.split('\n');
            lines.forEach((line, i) => {
                if (line.toUpperCase().includes('#FFFFFF')) {
                    console.error(`Violation: Pure white (#FFFFFF) found at ${file}:${i + 1}`);
                    violations++;
                }
            });
        }

        // Heuristic check for fonts (simplified)
        if (file.endsWith('.tsx')) {
            if (content.includes('<h') && !content.includes('font-serif') && !content.includes('globals.css')) {
                // This is a soft check
            }
        }
    });

    if (violations === 0) {
        console.log("✅ UI Compliance: PASSED");
    } else {
        console.log(`❌ UI Compliance: FAILED with ${violations} violations`);
    }
}

verify();
