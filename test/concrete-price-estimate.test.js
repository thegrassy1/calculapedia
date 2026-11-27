const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

test('concrete calculator separates material estimate from supplier delivery charges', () => {
  const root = path.join(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'concrete-calculator.html'), 'utf8');

  assert.match(html, /material-only planning estimate/);
  assert.match(html, /delivery, short-load, or other supplier charges/);
});
