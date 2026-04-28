/**
 * Get Unicode flag emoji from ISO 3166-1 alpha-2 country code.
 * Uses regional indicator symbols (e.g. US → 🇺🇸, NG → 🇳🇬).
 * Industry standard: no external assets, works in all modern browsers.
 */
export function getFlagEmoji(countryCode: string): string {
  const code = String(countryCode).toUpperCase().slice(0, 2);
  if (code.length !== 2) return '';
  return [...code]
    .map(char => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join('');
}
