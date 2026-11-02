const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'stucco-calculator.html'), 'utf8');

assert.match(html, /How many bags of stucco do I need for 100 square feet\?/);
assert.match(html, /100 × 1\.10 ÷ 35 = 3\.14/);
assert.match(html, /round up to <strong>4 80 lb bags<\/strong>/);
assert.match(html, /25 sq ft per bag.*round up to <strong>5 bags<\/strong>/);
console.log('stucco 100-square-foot coverage guidance verified');
