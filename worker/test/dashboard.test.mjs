import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import worker from '../src/index.js';

test('admin dashboard renders Search Console, revenue, and owner tasks', async () => {
  const gsc = {
    metric_date: '2026-08-18T00:00:00.000Z',
    clicks: 1,
    impressions: 493,
    ctr: 0.002,
    position: 59.9,
    period_start: '2026-05-21',
    period_end: '2026-08-18'
  };
  const revenue = {period_start: '2026-05-21', period_end: '2026-08-18', affiliate: 0, ads: 0, total: 0};
  const env = {
    ADMIN_TOKEN: 'test-token',
    DB: {
      prepare: () => ({
        all: async () => ({results: [{source: 'search_console', metric_date: gsc.metric_date, payload: JSON.stringify(gsc)}]})
      })
    }
  };
  const response = await worker.fetch(new Request('https://control.example/admin?token=test-token'), env);
  const dom = new JSDOM(await response.text(), {runScripts: 'outside-only', url: 'https://control.example/admin?token=test-token'});
  dom.window.fetch = async () => ({ok: true, json: async () => ({health: null, sources: {search_console: gsc, revenue}})});
  dom.window.eval(dom.window.document.querySelector('script').textContent);
  await new Promise(resolve => setTimeout(resolve, 0));
  const rendered = dom.window.document.querySelector('#app').textContent;

  assert.match(rendered, /Search performance/);
  assert.match(rendered, /493/);
  assert.match(rendered, /Average position/);
  assert.match(rendered, /Revenue/);
  assert.match(rendered, /\$0\.00/);
  assert.match(rendered, /Your to-do list/);
  assert.match(rendered, /affiliate program/);
});
