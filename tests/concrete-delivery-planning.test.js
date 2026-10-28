const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'concrete-calculator.html'), 'utf8');

assert.match(html, /Order ready-mix by the calculator's “With 10% waste allowance” result/);
assert.match(html, /ask the supplier about its minimum-load charge and delivery timing before scheduling the pour/);
assert.match(html, /<a href="\/rebar-calculator">rebar calculator<\/a>/);
assert.match(html, /For a slab that slopes for drainage, calculate with the average thickness—not the thin edge or thick edge alone/);
assert.match(html, /Measure any thickened edges, steps, or separate footings as their own volumes and add them before the 10% allowance/);
assert.match(html, /How much concrete do I need for a 12×12 slab at 4 inches\?/);
assert.match(html, /144 sq ft × \(4 ÷ 12\) = 48 cubic feet, or 1\.78 cubic yards before waste/);
assert.match(html, /about 74 60 lb bags before waste; because bags are sold whole, buy 75 bags before waste or 82 bags with the calculator's 10% allowance/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/concrete-calculator">/);
assert.match(html, /<meta name="description" content="Concrete slab calculator for patios, sheds, and footings\. Estimate cubic yards, 60 lb and 80 lb bags, and planning cost with a 10% waste allowance\.">/);

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('concrete delivery planning, internal link, and schema verified');
