const fs = require('fs');
const path = 'd:\\Documentos\\Proyectos ADSO\\origen_sierranevada\\web-page\\pages\\src\\pages\\OrderManager.tsx';
let content = fs.readFileSync(path, 'utf8');

// The issue is around line 730: an extra </div> inside the button block.
// Let's find the closing tag for the button (block span) and fix the following lines.

const target = /<span className="material-icons-outlined text-sm">block<\/span>\s+<\/button>\s+<\/div>\s+\)}/g;
const replacement = '<span className="material-icons-outlined text-sm">block</span>\n                                                                  </button>\n                                                              )}';

if (target.test(content)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content);
    console.log('Success: Final syntax fix applied to OrderManager.');
} else {
    // Try without counting spaces strictly
    const lines = content.split('\n');
    let found = false;
    for (let i = 0; i < lines.length - 3; i++) {
        if (lines[i].includes('block</span>') && lines[i + 1].includes('</button>') && lines[i + 2].includes('</div>') && lines[i + 3].includes(')}')) {
            lines.splice(i + 2, 1); // remove </div>
            found = true;
            break;
        }
    }
    if (found) {
        fs.writeFileSync(path, lines.join('\n'));
        console.log('Success: Manual line removal for syntax fix.');
    } else {
        console.log('Error: Could not find the problematic pattern.');
    }
}
