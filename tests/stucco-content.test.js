const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'stucco-calculator.html'), 'utf8');

assert.match(html, /<title>Stucco Calculator — Bags, Coverage & Waste Allowance<\/title>/);
assert.match(html, /Measure each wall section separately and subtract doors, windows, and other openings before entering the total wall area/);
assert.match(html, /A 60 ft × 9 ft wall is 540 sq ft; subtracting a 3 × 7 ft door and two 3 × 5 ft windows leaves 489 sq ft/);
assert.match(html, /Use the bag manufacturer&rsquo;s coverage for your exact mix, coat thickness, and substrate rather than treating the calculator&rsquo;s coverage figures as a product specification/);
assert.match(html, /href="\/paint-calculator"/);
assert.match(html, /href="\/vinyl-siding-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/stucco-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.equal(schema['@type'], 'FAQPage');
console.log('stucco content, metadata, canonical, internal links, and FAQ schema verified');
