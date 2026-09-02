const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'landscape-fabric-calculator.html'), 'utf8');

assert.match(html, /<title>Landscape Fabric Calculator — Weed Barrier Roll Coverage & Overlap<\/title>/);
assert.match(html, /Measure each bed or path separately; add those areas before entering the total/);
assert.match(html, /A 4 ft-wide roll needs 6 inches of overlap at each seam, so its effective coverage width is closer to 3\.5 ft/);
assert.match(html, /For a gravel path, install and compact the base first; then cut the fabric to follow the finished footprint/);
assert.match(html, /href="\/gravel-calculator"/);
assert.match(html, /href="\/landscape-edging-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/landscape-fabric-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('landscape-fabric content, metadata, canonical, and FAQ schema verified');
