const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'landscape-fabric-calculator.html'), 'utf8');

assert.match(html, /Should I put landscape fabric under mulch\?/);
assert.match(html, /Landscape fabric is most useful under inorganic stone or gravel, where it separates materials and limits weed growth/);
assert.match(html, /For planting beds with organic mulch, use a 2–3 inch mulch layer and refresh it as it breaks down instead of relying on fabric directly around plants/);
assert.match(html, /href="\/mulch-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/landscape-fabric-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('landscape fabric mulch guidance and metadata verified');
