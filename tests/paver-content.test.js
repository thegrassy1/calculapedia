const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
const html = fs.readFileSync(path.join(root, 'dist', 'paver-calculator.html'), 'utf8');

assert.match(html, /<title>Paver Calculator — How Many Pavers Do I Need\? \(Patios and Walkways\)<\/title>/);
assert.match(html, /<meta name="description" content="Paver calculator for patios and walkways\. Enter area and paver size to estimate pavers with a 5% cut allowance, then plan a compacted gravel base and 1-inch bedding layer\.">/);
assert.match(html, /For a simple rectangular layout, the calculator includes a 5% cut allowance; use 10% as a planning allowance for diagonal patterns, curves, or several small sections/);
assert.match(html, /A 12&nbsp;ft × 10&nbsp;ft patio needs 120 sq ft of pavers; at 5%, that is 126 sq ft of coverage before package rounding/);
assert.match(html, /Order the pavers by the manufacturer&rsquo;s stated square-foot coverage per pallet or bundle and round up to whole packages/);
assert.match(html, /href="\/gravel-calculator"/);
assert.match(html, /href="\/sand-calculator"/);
assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/paver-calculator">/);
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('paver purchase planning, metadata, internal links, canonical, and FAQ schema verified');
