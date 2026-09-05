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

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
assert.ok(schema['@graph'].some(item => item['@type'] === 'FAQPage'));
console.log('concrete delivery planning, internal link, and schema verified');
