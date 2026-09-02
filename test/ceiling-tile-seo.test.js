const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('ceiling tile page explains how package quantities affect the order', () => {
  const root = path.resolve(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'ceiling-tile-calculator.html'), 'utf8');

  assert.match(html, /How many ceiling tiles come in a box\?/);
  assert.match(html, /package quantity/i);
  assert.match(html, /perimeter tiles/i);

  const structuredData = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1];
  const schema = JSON.parse(structuredData);
  assert.equal(schema['@context'], 'https://schema.org');
});
