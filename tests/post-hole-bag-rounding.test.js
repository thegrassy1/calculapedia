const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'post-hole-calculator.html'), 'utf8');

assert.match(html, /Should I round concrete bags for each post or for the whole project\?/);
assert.match(html, /Add the cubic feet for every hole, then round the final bag total up once/);
assert.match(html, /Ten 10-inch-diameter holes filled 30 inches deep need about 5\.45 cubic feet, or 15 50 lb bags/);
assert.match(html, /Rounding each hole separately would incorrectly turn that same example into 20 bags/);
console.log('post-hole whole-project bag rounding guidance verified');
