const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'board-foot-calculator.html'), 'utf8');

assert.match(html, /<title>Board Foot Calculator \(Lumber Cost & Hardwood Formula\)<\/title>/);
assert.match(html, /<meta name="description" content="Calculate board feet for hardwood lumber: use actual thickness, width, length, and quantity to estimate material and cost\.">/);
assert.match(html, /Use the lumberyard's actual surfaced dimensions, not a nominal label like 1×6/);
assert.match(html, /Add 10–15% when your cut list has defects, matching grain, or short offcuts/);
assert.match(html, /calculate each stock size as its own line and add the board-foot totals before applying the waste allowance/);
assert.match(html, /href="\/deck-board-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/board-foot-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('board-foot content, metadata, canonical, and FAQ schema verified');
