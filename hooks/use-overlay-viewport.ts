"use client";

import { useEffect, useState, type CSSProperties } from 'react';
import { overlayViewport } from '@/lib/overlay-viewport';

/** Vaul input repositioning is disabled so only one mechanism moves sheets. */
export function useOverlayViewport(): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({});
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = overlayViewport(window.innerHeight, viewport.height, viewport.offsetTop, viewport.scale);
        if (!next) return;
        setStyle({ '--overlay-bottom': `${next.bottom}px`, '--overlay-height': `${next.height}px` } as CSSProperties);
      });
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return style;
}
