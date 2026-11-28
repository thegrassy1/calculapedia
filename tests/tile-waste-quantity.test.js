const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'tile-calculator.html'), 'utf8');

assert.match(html, /id="wasteTile"/);
assert.match(html, /Extra tile for cuts and breakage/);
assert.match(html, /set\('wasteTile',\(area\*waste\/100\)\.toFixed\(1\)\+' sq ft'\)/);
console.log('tile waste quantity output verified');
