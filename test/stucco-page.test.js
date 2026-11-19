const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('stucco calculator publishes intent-focused metadata with canonical and structured data', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'dist', 'stucco-calculator.html'), 'utf8');

  assert.match(html, /<title>Stucco Calculator: How Many 80 lb Bags Do I Need\? \| Coverage<\/title>/);
  assert.match(html, /<meta name="description" content="Estimate 80 lb stucco bags from net wall area, coat coverage, openings, and a 10% waste allowance before ordering material\.">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/calculapedia\.com\/stucco-calculator">/);

  const jsonLd = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1];
  const schema = JSON.parse(jsonLd);
  const app = schema['@graph'].find((item) => item['@type'] === 'WebApplication');
  assert.equal(app.url, 'https://calculapedia.com/stucco-calculator');
  assert.equal(app.name, 'Stucco Calculator');
});
