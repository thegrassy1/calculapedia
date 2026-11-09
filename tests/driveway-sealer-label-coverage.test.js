const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'driveway-sealer-calculator.html'), 'utf8');

assert.match(html, /id="coverage"/);
assert.match(html, /Label coverage per gallon/);
assert.match(html, /Enter the coverage printed on your sealer label for the selected coat count/);
assert.match(html, /var area=L\*W,coverage=num\('coverage'\),gal=coverage>0\?area\*coats\/coverage:0;/);
assert.match(html, /A label rated at 100 sq ft per gallon needs 4\.8 gallons, so buy 5 gallons for this same driveway/);
console.log('driveway sealer label-coverage input and purchase example verified');
