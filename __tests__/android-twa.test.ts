import { afterEach, describe, expect, it, vi } from 'vitest';
import { androidAssetLinks } from '@/lib/android-asset-links';
import { GET } from '@/app/.well-known/assetlinks.json/route';
import config from '@/android/twa/config.json';

const fingerprint = Array(32).fill('AB').join(':');
const rotated = Array(32).fill('CD').join(':');

afterEach(() => vi.unstubAllEnvs());

describe('Android domain association', () => {
  it('advertises no association before registration and signing are configured', () => {
    expect(androidAssetLinks()).toEqual([]);
    expect(androidAssetLinks('live.example.huddle')).toEqual([]);
  });
  it('normalizes and deduplicates certificates while supporting key rotation', () => {
    expect(androidAssetLinks('live.example.huddle', `${fingerprint.toLowerCase()}, ${fingerprint}, ${rotated}`)).toEqual([{
      relation: ['delegate_permission/common.handle_all_urls'],
      target: { namespace: 'android_app', package_name: 'live.example.huddle', sha256_cert_fingerprints: [fingerprint, rotated] },
    }]);
  });
  it('rejects malformed identity or any malformed certificate instead of trusting a subset', () => {
    expect(() => androidAssetLinks(undefined, fingerprint)).toThrow();
    expect(() => androidAssetLinks('https://example.com', fingerprint)).toThrow();
    expect(() => androidAssetLinks('live.example.huddle', `${fingerprint}, invalid`)).toThrow();
    expect(() => androidAssetLinks('live.example.huddle', 'AB:CD')).toThrow();
  });
  it('serves public JSON without authentication or redirects', async () => {
    vi.stubEnv('ANDROID_PACKAGE_ID', 'live.example.huddle');
    vi.stubEnv('ANDROID_SHA256_CERT_FINGERPRINTS', fingerprint);
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('location')).toBeNull();
    expect((await response.json())[0].target.package_name).toBe('live.example.huddle');
  });
  it('fails closed without exposing invalid configuration', async () => {
    vi.stubEnv('ANDROID_PACKAGE_ID', 'live.example.huddle');
    vi.stubEnv('ANDROID_SHA256_CERT_FINGERPRINTS', 'invalid');
    const response = GET();
    expect(response.status).toBe(503);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual([]);
  });
});

describe('TWA configuration', () => {
  it('launches on the canonical domain, uses browser fallback and keeps signing outside generated output', () => {
    expect(config.host).toBe('www.huddlemap.live');
    expect(new URL(config.startUrl, `https://${config.host}`).pathname).toBe('/map');
    expect(config.fallbackType).toBe('customtabs');
    expect(config.signingKey.path).toBe('../signing/huddle-upload.keystore');
    expect(config.additionalTrustedOrigins).toEqual([]);
    expect(config.features).toEqual({});
    expect(config.appVersion).toBeTruthy();
    expect(config.appVersionCode).toBeGreaterThan(0);
    for (const url of [config.iconUrl, config.maskableIconUrl, config.webManifestUrl]) {
      expect(new URL(url).origin).toBe(`https://${config.host}`);
    }
  });
});
