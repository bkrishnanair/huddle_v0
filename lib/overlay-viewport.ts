/** Pure geometry for fixed sheets above the software keyboard. */
export function overlayViewport(layoutHeight: number, height: number, offsetTop: number, scale = 1) {
  if (scale !== 1) return null; // Don't fight accessibility pinch zoom.
  return { bottom: Math.max(0, layoutHeight - height - offsetTop), height: Math.max(0, height - 16) };
}
