const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'driveway-sealer-calculator.html'), 'utf8');

assert.match(html, /<title>Asphalt Driveway Sealer Calculator — Gallons, Coats & 5-Gal Pails<\/title>/);
assert.match(html, /Plan a second thin coat as a separate application after the first coat has dried for the label&rsquo;s stated recoat time/);
assert.match(html, /Do not seal concrete with an asphalt driveway sealer/);
assert.match(html, /If your label gives a different coverage rate, divide total coat-area by that label rate and round each container purchase up/);
assert.match(html, /href="\/asphalt-calculator"/);
assert.match(html, /Fill cracks with a compatible crack filler and let repairs cure as the label directs before sealing/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/driveway-sealer-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('driveway sealer search intent, practical guidance, canonical, internal links, and FAQ schema verified');
