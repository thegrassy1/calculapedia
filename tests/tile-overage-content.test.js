const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('tile overage page explains the purchase formula and preserves SEO metadata', () => {
  const root = path.resolve(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'tile-calculator.html'), 'utf8');

  assert.match(html, /<title>Tile Overage Calculator — How Much Extra Tile Do I Need\? \(Boxes\)<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/tile-calculator">/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /Tile overage formula: measured area × \(1 \+ waste allowance\), then divide by box coverage and round up\./);
});
