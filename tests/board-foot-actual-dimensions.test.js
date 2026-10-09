const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

test('board foot calculator identifies thickness and width as actual dimensions', () => {
  const root = path.join(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'board-foot-calculator.html'), 'utf8');

  assert.match(html, /Thickness \(actual\)/);
  assert.match(html, /Width \(actual\)/);
});
