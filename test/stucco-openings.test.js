const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('stucco calculator subtracts standard door and window openings before adding waste', () => {
  const root = path.resolve(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'stucco-calculator.html'), 'utf8');

  assert.match(html, /id="doors"/);
  assert.match(html, /id="windows"/);
  assert.match(html, /Math\.max\(0,L\*H-doors\*21-win\*15\)/);
  assert.match(html, /Net wall area/);
});
