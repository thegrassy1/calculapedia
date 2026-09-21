const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'post-hole-calculator.html'), 'utf8');

assert.match(html, /Enter only the depth you plan to fill with concrete/);
assert.match(html, /For a 36-inch-deep hole with a 6-inch gravel base, enter 30 inches/);
assert.match(html, /href="\/gravel-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/post-hole-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('post-hole concrete-depth guidance, internal link, canonical, and FAQ schema verified');
