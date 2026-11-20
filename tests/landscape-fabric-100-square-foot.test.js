const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'landscape-fabric-calculator.html'), 'utf8');

assert.match(html, /How much landscape fabric do I need for 100 square feet\?/);
assert.match(html, /100 sq ft × 1\.10 = 110 sq ft/);
assert.match(html, /Choose a roll whose label covers at least 110 sq ft/);
assert.match(html, /a 4 ft-wide roll needs about 28 ft of length before allowing for end trimming/);
console.log('landscape fabric 100-square-foot purchase guidance verified');
