const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'thinset-calculator.html'), 'utf8');

assert.match(html, /<title>Thinset Mortar Calculator — 50 lb Bags Needed by Trowel Size<\/title>/);
assert.match(html, /<meta name="description" content="Calculate 50 lb thinset mortar bags for tile floors, walls, and showers\. Choose a trowel size, check coverage, and plan material cost\.">/);
assert.match(html, /Use the coverage printed on your exact thinset bag as the purchase check/);
assert.match(html, /Measure floors, walls, niches, and shower benches separately, then add their areas together/);
assert.match(html, /A 10% planning cushion can help on uneven substrates or when back-buttering large-format tile/);
assert.match(html, /Does thinset coverage include back-buttering\?/);
assert.match(html, /The coverage on the bag is a planning guide for the stated trowel, so confirm the manufacturer guidance and allow more material when the installation calls for back-buttering/);
assert.match(html, /Do not use a single bag estimate for both floor and wall work: measure and purchase for each trowel size separately, then round each material order up to whole bags/);
assert.match(html, /For shower walls, measure each wall, niche, bench, and curb as separate surfaces before totaling them/);
assert.match(html, /Do not subtract a small plumbing opening when the surrounding cuts will still use most of a tile/);
assert.match(html, /Use a mortar that the tile and waterproofing-system manufacturers approve for the installation/);
assert.match(html, /href="\/tile-calculator"/);
assert.match(html, /href="\/grout-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/thinset-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('thinset content, metadata, canonical, internal links, and FAQ schema verified');
