import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAndRegisterPushToken, requestPushPermission, syncPushPermissionState } from '@/lib/push-client';
import { readBrowserStorage, writeBrowserStorage } from '@/lib/browser-storage';

const messaging = vi.hoisted(() => ({ supported: vi.fn(), token: vi.fn() }));
vi.mock('firebase/messaging', () => ({ getMessaging: () => ({}), getToken: messaging.token, isSupported: messaging.supported }));
vi.mock('@/lib/firebase', () => ({ app: {} }));

describe('push enrollment and optional browser storage', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('window', { Notification: {}, localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) } });
    vi.stubGlobal('Notification', { permission: 'granted', requestPermission: vi.fn().mockResolvedValue('granted') });
    vi.stubGlobal('navigator', { serviceWorker: { register: vi.fn().mockResolvedValue({}) } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', {status: 200})));
    messaging.supported.mockResolvedValue(true);
    messaging.token.mockResolvedValue('test-token');
    for (const name of ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID']) vi.stubEnv(name, 'test-config');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it('requests native permission synchronously within the user gesture', async () => {
    const result = requestPushPermission();
    expect(Notification.requestPermission).toHaveBeenCalledOnce();
    expect(await result).toBe(true);
  });
  it('does not report enrollment success when the backend rejects a token', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', {status: 401}));
    expect(await getAndRegisterPushToken()).toBeNull();
  });
  it('keeps the messaging worker in its separate scope', async () => {
    expect(await getAndRegisterPushToken()).toBe('test-token');
    expect(navigator.serviceWorker.register).toHaveBeenCalledWith(expect.stringContaining('/firebase-messaging-sw.js?'), {scope: '/firebase-cloud-messaging-push-scope'});
  });
  it('handles unsupported browsers without requesting a token', async () => {
    messaging.supported.mockRejectedValueOnce(new Error('IndexedDB unavailable'));
    expect(await getAndRegisterPushToken()).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('syncs permission per account instead of sharing a global sentinel', async () => {
    await syncPushPermissionState('alice');
    await syncPushPermissionState('alice');
    await syncPushPermissionState('bob');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it('does not throw when privacy settings deny storage', () => {
    vi.stubGlobal('window', { get localStorage() { throw new Error('SecurityError'); }, get sessionStorage() { throw new Error('SecurityError'); } });
    expect(readBrowserStorage('key')).toBeNull();
    expect(readBrowserStorage('key', 'session')).toBeNull();
    expect(() => writeBrowserStorage('key', 'value')).not.toThrow();
    expect(() => writeBrowserStorage('key', 'value', 'session')).not.toThrow();
  });
});

function pushWorker() {
  const listeners = new Map<string, (event: any) => void>();
  let onMessage: (payload: any) => unknown;
  const showNotification = vi.fn();
  const clients = {matchAll: vi.fn().mockResolvedValue([]), openWindow: vi.fn()};
  const importScripts = vi.fn(() => expect(listeners.has('notificationclick')).toBe(true));
  runInNewContext(readFileSync('public/firebase-messaging-sw.js', 'utf8'), {
    self: { location: {origin: 'https://huddle.test'}, registration: {showNotification}, addEventListener: (name: string, handler: any) => listeners.set(name, handler) },
    location: 'https://huddle.test/firebase-messaging-sw.js?apiKey=test', clients, importScripts, URL,
    firebase: {initializeApp: vi.fn(), messaging: () => ({onBackgroundMessage: (fn: any) => { onMessage = fn; }})},
  });
  const click = async (data: unknown) => {
    const event = {notification: {data, close: vi.fn()}, stopImmediatePropagation: vi.fn(), waitUntil: vi.fn()};
    listeners.get('notificationclick')!(event);
    await event.waitUntil.mock.calls[0][0];
    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
  };
  return {clients, click, showNotification, message: (payload: unknown) => onMessage(payload)};
}

describe('FCM worker notification lifecycle', () => {
  it('does not display a duplicate SDK notification', () => {
    const w = pushWorker();
    w.message({notification: {title: 'Already displayed'}});
    expect(w.showNotification).not.toHaveBeenCalled();
    w.message({data: {title: 'Data-only event', body: 'Update', url: '/map?eventId=test'}});
    expect(w.showNotification).toHaveBeenCalledOnce();
  });
  it.each(['https://external.test/phishing', 'javascript:alert(1)'])('rejects notification navigation to %s', async url => {
    const w = pushWorker();
    await w.click({url});
    expect(w.clients.openWindow).toHaveBeenCalledWith('https://huddle.test/map');
  });
  it('focuses an existing deep link for SDK-wrapped payloads', async () => {
    const w = pushWorker();
    const focus = vi.fn();
    w.clients.matchAll.mockResolvedValueOnce([{url: 'https://huddle.test/map?eventId=test', focus}]);
    await w.click({FCM_MSG: {data: {url: '/map?eventId=test'}}});
    expect(focus).toHaveBeenCalledOnce();
    expect(w.clients.openWindow).not.toHaveBeenCalled();
  });
});
