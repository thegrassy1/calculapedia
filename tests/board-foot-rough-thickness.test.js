const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('board foot calculator distinguishes rough thickness from surfaced dimensions', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'dist', 'board-foot-calculator.html'), 'utf8');

  assert.match(html, /Thickness \(rough\)/);
  assert.match(html, /Hardwood yards commonly calculate board feet from the rough thickness before surfacing/);
  assert.match(html, /A 4\/4 board is billed as 1 inch thick even though surfacing makes its finished thickness smaller/);
});
