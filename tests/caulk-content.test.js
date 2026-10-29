const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'caulk-calculator.html'), 'utf8');

assert.match(html, /<title>Caulk Calculator — Estimate 10 oz Tubes by Linear Feet & Bead Size<\/title>/);
assert.match(html, /<meta name="description" content="Caulk estimator for windows, doors, trim, and siding\. Enter linear feet and bead size to estimate 10 oz tubes, coverage, and project cost\. Includes backer-rod planning guidance\.">/);
assert.match(html, /When should I use backer rod before caulking\?/);
assert.match(html, /Use foam backer rod in a joint that is too wide or deep for the bead you need; it supports the sealant, sets the depth, and helps prevent three-sided adhesion/);
assert.match(html, /Choose a rod slightly wider than the joint so it stays in place, then follow the sealant manufacturer&rsquo;s stated joint-size and depth limits/);
assert.match(html, /href="\/paint-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/caulk-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('caulk estimator metadata, backer-rod guidance, internal link, canonical, and FAQ schema verified');
