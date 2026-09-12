import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

function worker() {
  const listeners = new Map<string, (event: any) => void>();
  const stores = new Map<string, Map<string, Response>>();
  const key = (request: any) => typeof request === 'string' ? request : request.url;
  const fetcher = vi.fn(async () => new Response('public asset'));
  const cacheStorage = {
    keys: async () => [...stores.keys()],
    delete: vi.fn(async (name: string) => stores.delete(name)),
    open: async (name: string) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name)!;
      return {
        add: async (request: any) => { store.set(key(request), await fetcher()); },
        put: async (request: any, response: Response) => { store.set(key(request), response.clone()); },
        match: async (request: any) => store.get(key(request))?.clone(),
        keys: async () => [...store.keys()],
        delete: async (request: any) => store.delete(key(request)),
      };
    },
  };
  const skipWaiting = vi.fn(async () => {});
  runInNewContext(readFileSync('public/sw.js', 'utf8'), {
    self: { location: {origin: 'https://huddle.test'}, addEventListener: (name: string, fn: any) => listeners.set(name, fn), skipWaiting, clients: {claim: vi.fn()} },
    caches: cacheStorage, fetch: fetcher, URL, Response,
  });
  async function dispatch(name: string, data: Record<string, unknown> = {}) {
    const waits: Promise<any>[] = [];
    let response: Promise<Response> | undefined;
    listeners.get(name)!({...data, waitUntil: (p: Promise<any>) => waits.push(p), respondWith: (p: Promise<Response>) => {response = p;}});
    const result = await response;
    await Promise.all(waits);
    return result;
  }
  const request = (path: string, options = {}) => ({url: `https://huddle.test${path}`, method: 'GET', mode: 'cors', ...options});
  return {dispatch, request, stores, fetcher, skipWaiting, cacheStorage};
}

describe('PWA caching and upgrade lifecycle', () => {
  it('precaches an independent offline page and waits for user-approved activation', async () => {
    const w = worker();
    await w.dispatch('install');
    expect(w.stores.get('huddle-offline-v2')?.has('/offline.html')).toBe(true);
    expect(w.skipWaiting).not.toHaveBeenCalled();
    await w.dispatch('message', {data: {type: 'SKIP_WAITING'}});
    expect(w.skipWaiting).toHaveBeenCalledOnce();
  });
  it('purges legacy Huddle caches, never unrelated application caches', async () => {
    const w = worker();
    w.stores.set('huddle-v1-cache', new Map());
    w.stores.set('another-app', new Map());
    await w.dispatch('activate');
    expect(w.stores.has('huddle-v1-cache')).toBe(false);
    expect(w.stores.has('another-app')).toBe(true);
  });
  it.each(['/api/events', '/api/auth/me', '/profile?_rsc=secret', '/map?_rsc=secret', '/firebase-messaging-sw.js'])('does not intercept or cache %s', async path => {
    const w = worker();
    expect(await w.dispatch('fetch', {request: w.request(path)})).toBeUndefined();
    expect(w.fetcher).not.toHaveBeenCalled();
    expect(w.stores.size).toBe(0);
  });
  it('does not cache successful authenticated navigations', async () => {
    const w = worker();
    w.fetcher.mockResolvedValueOnce(new Response('private profile'));
    const response = await w.dispatch('fetch', {request: w.request('/profile', {mode: 'navigate'})});
    expect(await response!.text()).toBe('private profile');
    expect(w.stores.size).toBe(0);
  });
  it('serves the offline page on failed navigation, never a previous account document', async () => {
    const w = worker();
    await w.dispatch('install');
    w.fetcher.mockRejectedValueOnce(new Error('offline'));
    const response = await w.dispatch('fetch', {request: w.request('/profile', {mode: 'navigate'})});
    expect(await response!.text()).toBe('public asset');
  });
  it('returns an explicit offline response even when no fallback is cached', async () => {
    const w = worker();
    w.fetcher.mockRejectedValueOnce(new Error('offline'));
    expect((await w.dispatch('fetch', {request: w.request('/map', {mode: 'navigate'})}))!.status).toBe(503);
  });
  it('ignores third-party resources and mutations', async () => {
    const w = worker();
    await w.dispatch('fetch', {request: w.request('/icons/x.png', {url: 'https://external.test/icons/x.png'})});
    await w.dispatch('fetch', {request: w.request('/icons/x.png', {method: 'POST'})});
    expect(w.fetcher).not.toHaveBeenCalled();
  });
  it.each(['private', 'no-store'])('respects %s even on asset paths', async directive => {
    const w = worker();
    w.fetcher.mockResolvedValueOnce(new Response('secret', {headers: {'Cache-Control': directive}}));
    await w.dispatch('fetch', {request: w.request('/icons/x.png')});
    expect(w.stores.get('huddle-assets-v2')?.size).toBe(0);
  });
  it('bounds the asset cache and serves cache hits without fetching', async () => {
    const w = worker();
    for (let i = 0; i < 130; i++) await w.dispatch('fetch', {request: w.request(`/_next/static/${i}.js`)});
    expect(w.stores.get('huddle-assets-v2')?.size).toBe(128);
    await w.dispatch('fetch', {request: w.request('/_next/static/129.js')});
    expect(w.fetcher).toHaveBeenCalledTimes(130);
  });
  it('offline page has no build or third-party dependencies', () => {
    const html = readFileSync('public/offline.html', 'utf8');
    expect(html).toContain('location.reload()');
    expect(html).toContain('safe-area-inset-bottom');
    expect(html).not.toMatch(/<(script|link)\b|https:\/\//);
  });
});
