const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

test('board foot calculator identifies rough thickness and actual width', () => {
  const root = path.join(__dirname, '..');
  execFileSync(process.execPath, ['build.js'], { cwd: root, stdio: 'pipe' });
  const html = fs.readFileSync(path.join(root, 'dist', 'board-foot-calculator.html'), 'utf8');

  assert.match(html, /Thickness \(rough\)/);
  assert.match(html, /Width \(actual\)/);
});
