import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CATEGORY_COLORS, getAccentTokens, getCategoryColor } from '@/lib/utils';
import { Chip } from '@/components/ui/chip';

// WCAG relative luminance, independent of the token implementation.
function luminance(hex: string) {
  const rgb = hex.slice(1).match(/../g)!.map(c => parseInt(c, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe('category contrast and component parity', () => {
  it.each(Object.entries(CATEGORY_COLORS))('%s meets AA on filled chips and dark surfaces', (category, color) => {
    const tokens = getAccentTokens(getCategoryColor(category));
    expect(contrast(tokens.foreground, color)).toBeGreaterThanOrEqual(4.5);
    for (const surface of ['#0B101B', '#121B2B', tokens.surface]) {
      expect(contrast(tokens.text, surface)).toBeGreaterThanOrEqual(4.5);
    }
    const active = renderToStaticMarkup(React.createElement(Chip, {color, isActive: true}, category));
    const inactive = renderToStaticMarkup(React.createElement(Chip, {color, isActive: false}, category));
    expect(active).toContain(`color:${tokens.foreground}`);
    expect(active).toContain('aria-pressed="true"');
    expect(inactive).toContain(`color:${tokens.text}`);
    expect(inactive).toContain(`background-color:${tokens.surface}`);
  });
  it('uses the slate fallback for unknown categories', () => {
    expect(getCategoryColor('unknown')).toBe(CATEGORY_COLORS.default);
  });
  it('honors an explicitly supplied chip variant', () => {
    expect(renderToStaticMarkup(React.createElement(Chip, {variant: 'destructive'}, 'Remove')))
      .toContain('bg-destructive');
  });
});
