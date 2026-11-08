const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'stucco-calculator.html'), 'utf8');

assert.match(html, /Do I include wall returns and soffits in a stucco estimate\?/);
assert.match(html, /Measure each exposed return, parapet, soffit, or column face as its own length × height area and add it to the wall total before subtracting openings/);
assert.match(html, /Do not add an extra percentage for corners when their faces are already included in your measurement/);

console.log('stucco wall-return measurement guidance verified');
