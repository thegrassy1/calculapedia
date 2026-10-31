const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('landscape fabric page explains why roll length matters as well as roll coverage', () => {
  const root = path.resolve(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'landscape-fabric-calculator.html'), 'utf8');

  assert.match(html, /Does roll length matter when buying landscape fabric\?/);
  assert.match(html, /4 ft × 100 ft roll/i);
  assert.match(html, /run each strip the full 100 ft/i);
});
