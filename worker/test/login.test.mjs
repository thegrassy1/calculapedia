import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const env = {ADMIN_PASSWORD: 'correct-horse-battery-staple', SESSION_SECRET: 'test-session-secret'};

test('owner can sign in with a password and reopen the dashboard with its session cookie', async () => {
  const login = await worker.fetch(new Request('https://control.example/login'), env);
  assert.equal(login.status, 200);
  assert.match(await login.text(), /Sign in to Calculapedia/);

  const signedIn = await worker.fetch(new Request('https://control.example/login', {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    body: 'password=correct-horse-battery-staple'
  }), env);
  assert.equal(signedIn.status, 302);
  const cookie = signedIn.headers.get('set-cookie');
  assert.match(cookie, /admin_session=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);

  const dashboard = await worker.fetch(new Request('https://control.example/admin', {headers: {cookie}}), env);
  assert.equal(dashboard.status, 200);
  assert.match(await dashboard.text(), /Calculapedia Control Plane/);
});

test('dashboard remains unavailable without a valid session', async () => {
  const response = await worker.fetch(new Request('https://control.example/admin'), env);
  assert.equal(response.status, 401);
});
