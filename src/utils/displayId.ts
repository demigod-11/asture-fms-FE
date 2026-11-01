const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True when the value looks like a raw UUID. */
export function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

/**
 * Display helper for ID/name columns. Never show a raw UUID — fall back to '—'.
 */
export function displayPublicId(value?: string | null, fallback = '—'): string {
  const v = (value ?? '').trim();
  if (!v || isUuid(v)) return fallback;
  return v;
}
