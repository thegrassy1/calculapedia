const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'driveway-sealer-calculator.html'), 'utf8');

assert.match(html, /<title>Driveway Sealer Calculator — How Many Gallons Do I Need\?<\/title>/);
assert.match(html, /<meta name="description" content="Estimate gallons of asphalt driveway sealer from length, width, and coats\. Plan about 80 sq ft per gallon per coat, 5-gallon buckets, and an estimated cost\.">/);
assert.match(html, /5-gallon pails to buy/);
assert.match(html, /Math\.ceil\(gal\/5\).*5-gallon pails/);
assert.match(html, /Coverage is a planning estimate: use the coverage and coat count on your exact product label/);
assert.match(html, /Fill cracks with a compatible crack filler and let repairs cure as the label directs before sealing/);
assert.match(html, /href="\/asphalt-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/driveway-sealer-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('driveway-sealer purchasing guidance, metadata, canonical, and FAQ schema verified');
