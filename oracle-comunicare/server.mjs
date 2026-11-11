import { createServer } from 'node:http';

const VERSION = '0.1.0';
const REPLIES = new Map([
  ['/healthz', { status: 'ok', service: 'pocketai-comunicare-internal', version: VERSION }],
  ['/readyz', { ready: true }],
]);

export function makeServer() {
  return createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const body = request.method === 'GET' && !url.search
      ? REPLIES.get(url.pathname)
      : undefined;

    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.statusCode = body ? 200 : 404;
    response.end(JSON.stringify(body ?? { error: 'not_found' }));
  });
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  if (!(port > 0 && port < 65536)) throw new Error('Invalid PORT');
  makeServer().listen(port, '0.0.0.0', () => {
    console.log(`PocketAI internal gateway listening on port ${port}`);
  });
}
