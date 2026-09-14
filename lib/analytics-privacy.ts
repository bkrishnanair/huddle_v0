/** Preserve aggregate page metrics without query strings or individual record IDs. */
export function redactAnalyticsUrl<T extends { url: string; route?: string }>(event: T): T | null {
  try {
    const url = new URL(event.url);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    url.search = '';
    url.hash = '';
    url.username = '';
    url.password = '';
    url.pathname = url.pathname.replace(/^\/(profile|event)\/[^/]+\/?$/, '/$1/[id]');
    const result = { ...event, url: url.toString() };
    if (event.route) result.route = event.route.split(/[?#]/)[0].replace(/^\/(profile|event)\/[^/]+\/?$/, '/$1/[id]');
    return result;
  } catch {
    return null;
  }
}
