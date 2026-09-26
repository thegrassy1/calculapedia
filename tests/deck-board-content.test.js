const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'deck-board-calculator.html'), 'utf8');

assert.match(html, /<title>Deck Board Calculator — How Many Deck Boards Do I Need\? \(With Spacing & Waste\)<\/title>/);
assert.match(html, /<meta name="description" content="Calculate how many deck boards you need from deck size, actual board width, board length, spacing, and a 10% waste allowance\. Includes linear feet and a purchase-planning example\.">/);
assert.match(html, /The formula is deck area ÷ covered board width, then × 1\.10 for waste/);
assert.match(html, /Use the board&rsquo;s actual face width—not the nominal label/);
assert.match(html, /For a 16 ft × 12 ft deck with 5\.5-inch boards and 1\/8-inch gaps, the covered width is 5\.625 inches/);
assert.match(html, /Choose board lengths from a layout or cut list, then round each length up separately instead of treating the linear-foot result as interchangeable boards/);
assert.match(html, /The optional price is your local per-board estimate; it does not include fasteners, framing, delivery, tax, or labor/);
assert.match(html, /href="\/board-foot-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/deck-board-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('deck board content, metadata, canonical, and FAQ schema verified');
