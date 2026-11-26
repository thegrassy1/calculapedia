const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'board-foot-calculator.html'), 'utf8');

assert.match(html, /How do I estimate board feet from a cut list\?/);
assert.match(html, /List every finished part, then group parts by the rough board thickness and width you will buy/);
assert.match(html, /Add the board feet for each stock group, apply your waste allowance once to the combined total, and round up to available board lengths/);
assert.match(html, /a 24-inch rail needs at least 24 inches of usable stock before trim or squaring cuts/);
assert.match(html, /When a hardwood yard sells random-width boards, use the board-foot total as a budget estimate but bring a cut list showing each part's finished width and length/);
assert.match(html, /A board-foot total alone does not guarantee that a narrow board will yield a wide panel or that the available lengths will yield every part/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/board-foot-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('board-foot cut-list planning guidance and metadata verified');
