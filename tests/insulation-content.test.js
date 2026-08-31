const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'insulation-calculator.html'), 'utf8');

assert.match(html, /<title>Insulation Calculator — Bags &amp; Batts by R-Value Coverage<\/title>/);
assert.match(html, /Measure each attic floor or wall section separately, subtract areas you will not insulate, then add the net square footage/);
assert.match(html, /Round up to whole bags or packs and allow a small cushion for cut batts, irregular bays, and settling/);
assert.match(html, /Choose the package coverage that matches both the insulation type and the installed R-value/);
assert.match(html, /href="\/drywall-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/insulation-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.equal(schema['@type'], 'FAQPage');
console.log('insulation content, metadata, canonical, and FAQ schema verified');
