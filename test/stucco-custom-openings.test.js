const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('stucco calculator subtracts custom opening area in addition to standard openings', () => {
  const root = path.resolve(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'stucco-calculator.html'), 'utf8');

  assert.match(html, /id="custom"/);
  assert.match(html, /Other opening area/);
  assert.match(html, /custom=Math\.max\(0,num\('custom'\)\)/);
  assert.match(html, /L\*H-doors\*21-win\*15-custom/);
  assert.match(html, /For a garage door, sliding door, or unusually sized window, enter its actual area in Other opening area/);
});
