const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'thinset-calculator.html'), 'utf8');

assert.match(html, /<title>Thinset Calculator — Bags Needed per Square Foot & Cost<\/title>/);
assert.match(html, /Round up to a whole bag after dividing your measured area by the bag&rsquo;s stated coverage/);
assert.match(html, /Mix only what you can spread and tile within the product&rsquo;s pot life/);
assert.match(html, /href="\/tile-calculator"/);
assert.match(html, /href="\/grout-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/thinset-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.equal(schema['@type'], 'FAQPage');
console.log('thinset content, metadata, canonical, internal links, and FAQ schema verified');
