const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'tile-calculator.html'), 'utf8');

assert.match(html, /<title>Tile Overage Calculator — How Many Tiles Do I Need\? \(Boxes & Square Feet\)<\/title>/);
assert.match(html, /<meta name="description" content="Tile overage calculator for floors, walls, bathrooms, and showers\. Calculate tiles, square feet, whole boxes, and 10%, 15%, or 20% extra for cuts and breakage\.">/);
assert.match(html, /id="coverage"/);
assert.match(html, /Box coverage/);
assert.match(html, /Math\.ceil\(area\*\(1\+waste\/100\)\/coverage\)/);
assert.match(html, /Enter the square-foot coverage printed on the box/);
assert.match(html, /Compare the calculator's tile count with the coverage printed on the box/);
assert.match(html, /If the package coverage differs from the nominal tile size, use the package coverage to make the purchase decision/);
assert.match(html, /Buy all visible-field tile from the same dye lot when possible/);
assert.match(html, /href="\/thinset-calculator"/);
assert.match(html, /href="\/grout-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/tile-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('tile content, metadata, canonical, internal links, and FAQ schema verified');
