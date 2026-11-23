const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'tile-calculator.html'), 'utf8');

assert.match(html, /How much tile do I need for a 12 × 12 room\?/);
assert.match(html, /A 12 × 12 ft room is 144 sq ft\. With a 10% allowance, buy for 158\.4 sq ft/);
assert.match(html, /If the box covers 12\.5 sq ft, round 12\.672 boxes up to 13/);
console.log('tile 12-by-12 room purchase guidance verified');
