import { useState, useEffect, useCallback } from 'react';
import { fetchCountries } from '@/services/countriesApi';
import { COUNTRIES } from '@/constants/countries';
import { getFlagEmoji } from '@/utils/flagEmoji';

export interface CountryWithFlag {
  code: string;
  name: string;
  flag: string;
}

function fallbackCountries(): CountryWithFlag[] {
  return COUNTRIES.map(c => ({
    code: c.code,
    name: c.name,
    flag: getFlagEmoji(c.code),
  }));
}

/**
 * Fetch countries (with flags) from REST Countries API. Falls back to static list on error.
 */
export function useCountries(): {
  countries: CountryWithFlag[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [countries, setCountries] =
    useState<CountryWithFlag[]>(fallbackCountries);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchCountries();
      setCountries(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load countries');
      setCountries(fallbackCountries());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { countries, loading, error, refetch: load };
}
