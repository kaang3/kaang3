const VERSION = 'blok-dunyasi-v4-hardness';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      try { await client.navigate(client.url); } catch (_) {}
    }
  })());
});

function applyHardness(html) {
  const harderTimes = `const breakTimes = {
    leaves: 0.35,
    sand: 0.70,
    dirt: 1.10,
    grass: 1.50,
    wood: 2.60,
    stone: 4.50
  };`;

  return html.replace(
    /const breakTimes = \{[\s\S]*?\n\s*\};/,
    harderTimes
  );
}

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;

  event.respondWith((async () => {
    const response = await fetch(event.request, { cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const html = applyHardness(await response.text());
    const headers = new Headers(response.headers);
    headers.set('content-type', 'text/html; charset=utf-8');
    headers.set('x-blok-dunyasi-version', VERSION);
    headers.delete('content-length');

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  })());
});
