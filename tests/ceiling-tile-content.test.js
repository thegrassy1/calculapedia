const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'ceiling-tile-calculator.html'), 'utf8');

assert.match(html, /<title>Drop Ceiling Tile Calculator — How Many 2×2 or 2×4 Tiles Do I Need\?<\/title>/);
assert.match(html, /Confirm tile, grid, and box coverage/);
assert.match(html, /Check that the tile edge detail matches your existing grid/);
assert.match(html, /Sketch the grid layout before ordering so you can confirm the border tiles will not leave an impractically narrow cut at either wall/);
assert.match(html, /For a few stained or damaged tiles, count the openings you will replace and buy a matching box rather than using the room-area estimate/);
assert.match(html, /This calculator estimates replacement tiles only; a new suspended ceiling also needs grid components sized from the room layout/);
assert.match(html, /href="\/tile-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/ceiling-tile-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('ceiling-tile content, metadata, canonical, and FAQ schema verified');
