const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'landscape-fabric-calculator.html'), 'utf8');

assert.match(html, /Run the roll along the longest straight dimension where practical, so you create fewer cross seams/);
assert.match(html, /Divide the bed width by the roll&rsquo;s effective width—not its printed width—to estimate how many parallel strips you need/);
assert.match(html, /round the roll count up after checking the product&rsquo;s length and coverage label/);
console.log('landscape fabric roll-layout guidance verified');
