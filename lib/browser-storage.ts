/** Storage is optional: denied cookies/storage must not break basic browsing. */
export function readBrowserStorage(key: string, kind: 'local' | 'session' = 'local'): string | null {
  try { return (kind === 'local' ? window.localStorage : window.sessionStorage).getItem(key); }
  catch { return null; }
}
export function writeBrowserStorage(key: string, value: string, kind: 'local' | 'session' = 'local'): void {
  try { (kind === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value); }
  catch { /* Gracefully operate without persistence. */ }
}
