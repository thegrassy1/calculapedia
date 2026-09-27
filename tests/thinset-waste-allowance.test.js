const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'thinset-calculator.html'), 'utf8');

assert.match(html, /<label for="waste">Waste allowance <span class="hint">\(optional\)<\/span><\/label>/);
assert.match(html, /id="waste"/);
assert.match(html, /var area=L\*W,orderArea=area\*\(1\+waste\/100\),bags=cov>0\?Math\.ceil\(orderArea\/cov\):0;/);
console.log('thinset waste allowance input and calculation verified');
