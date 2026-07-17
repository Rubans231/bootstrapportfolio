const TTL_MS = 60 * 60 * 1000; // 1 hour — long enough to avoid re-hammering GitHub
                                 // per session, short enough that edits show up soon.

export function cacheGet<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > TTL_MS) return null;
    return data as T;
  } catch {
    return null;
  }
}

export function cacheSet(key: string, data: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* sessionStorage full/unavailable — fine, just skip caching */
  }
}
