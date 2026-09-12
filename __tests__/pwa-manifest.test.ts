import { describe, it, expect } from 'vitest';
import manifest from '@/app/manifest';
import { readFileSync } from 'node:fs';

describe('PWA Web App Manifest Configuration', () => {
  it('returns valid Dark/Vibrant design tokens and standalone display mode', () => {
    const config = manifest();

    expect(config.name).toBe('Huddle — The Live Campus Event Map');
    expect(config.short_name).toBe('Huddle');
    expect(config.start_url).toBe('/map?source=pwa');
    expect(config.scope).toBe('/');
    expect(config.id).toBe('/?source=pwa');
    expect(config.display).toBe('standalone');
    expect(config.display_override).toContain('standalone');
    expect(config.orientation).toBe('portrait');

    // Dark/Vibrant V2 background token (#0B101B)
    expect(config.background_color).toBe('#0B101B');
    expect(config.theme_color).toBe('#0B101B');
  });

  it('includes required 192px, 512px, and maskable icons', () => {
    const config = manifest();
    const icons = config.icons || [];

    expect(icons.length).toBeGreaterThanOrEqual(3);

    const icon192 = icons.find((i) => i.sizes === '192x192');
    const icon512 = icons.find((i) => i.sizes === '512x512' && !i.purpose);
    const maskable = icons.find((i) => i.purpose === 'maskable');

    expect(icon192).toBeDefined();
    expect(icon192?.src).toBe('/icons/icon-192x192.png');
    expect(icon512).toBeDefined();
    expect(icon512?.src).toBe('/icons/icon-512x512.png');
    expect(maskable).toBeDefined();
    expect(maskable?.src).toBe('/icons/icon-maskable-512x512.png');
    for (const icon of icons) {
      const png = readFileSync(`public${icon.src}`);
      expect(png.subarray(1, 4).toString()).toBe('PNG');
      expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`).toBe(icon.sizes);
    }
  });
});
