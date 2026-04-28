/**
 * Countries list from REST Countries API (industry standard).
 * https://restcountries.com/
 */

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
}

const REST_COUNTRIES_URL =
  'https://restcountries.com/v3.1/all?fields=name,cca2';

function getFlagEmoji(cca2: string): string {
  const code = String(cca2).toUpperCase().slice(0, 2);
  if (code.length !== 2) return '';
  return [...code]
    .map(c => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

let cached: CountryItem[] | null = null;
let cachePromise: Promise<CountryItem[]> | null = null;

/**
 * Fetch all countries from REST Countries API. Result is cached in memory.
 */
export async function fetchCountries(): Promise<CountryItem[]> {
  if (cached) return cached;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const res = await fetch(REST_COUNTRIES_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Array<{
        name: { common: string };
        cca2: string;
      }>;
      const list: CountryItem[] = data
        .filter(item => item.cca2 && item.name?.common)
        .map(item => ({
          code: item.cca2,
          name: item.name.common,
          flag: getFlagEmoji(item.cca2),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      cached = list;
      return list;
    } catch (e) {
      cachePromise = null;
      throw e;
    }
  })();

  return cachePromise;
}

/**
 * Clear in-memory cache (e.g. for testing or force refetch).
 */
export function clearCountriesCache(): void {
  cached = null;
  cachePromise = null;
}
