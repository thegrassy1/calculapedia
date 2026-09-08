const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'compost-calculator.html'), 'utf8');

assert.match(html, /<title>Compost Calculator — Cubic Yards, Bags & Top-Dressing Depth<\/title>/);
assert.match(html, /Use the bag's printed volume—not its weight—to compare it with this calculator/);
assert.match(html, /For a 20 ft × 10 ft bed at 2 inches, the calculator uses 200 × \(2 ÷ 12\) = 33\.3 cubic feet/);
assert.match(html, /Bulk compost is commonly sold by the cubic yard, while bags list a cubic-foot volume/);
assert.match(html, /href="\/raised-bed-soil-calculator"/);
assert.match(html, /href="\/mulch-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/compost-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('compost content, metadata, canonical, internal links, and FAQ schema verified');
