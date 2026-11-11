import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { makeServer } from './server.mjs';

const server = makeServer();
let base;
before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise((resolve) => server.close(resolve)); });

test('health returns a JSON status and is not cached', async () => {
  const response = await fetch(`${base}/healthz`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await response.json()).status, 'ok');
});

test('ready endpoint works', async () => {
  const response = await fetch(`${base}/readyz`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ready, true);
});

test('unknown routes and writes are not allowed', async () => {
  for (const [path, method] of [['/messages', 'GET'], ['/healthz', 'POST'], ['/healthz?debug=1', 'GET']]) {
    const response = await fetch(`${base}${path}`, { method });
    assert.equal(response.status, 404);
  }
});
