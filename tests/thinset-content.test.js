const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'thinset-calculator.html'), 'utf8');

assert.match(html, /<title>Thinset Mortar Calculator — 50 lb Bags Needed by Trowel Size<\/title>/);
assert.match(html, /Use the coverage printed on your exact thinset bag as the purchase check/);
assert.match(html, /Measure floors, walls, niches, and shower benches separately, then add their areas together/);
assert.match(html, /A 10% planning cushion can help on uneven substrates or when back-buttering large-format tile/);
assert.match(html, /href="\/tile-calculator"/);
assert.match(html, /href="\/grout-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/thinset-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.equal(schema['@type'], 'FAQPage');
console.log('thinset content, metadata, canonical, internal links, and FAQ schema verified');
