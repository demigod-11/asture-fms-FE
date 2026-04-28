import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getOrganisation } from '@/services/authApi';
import { useProfile } from '@/contexts/ProfileContext';

const DEFAULT_CURRENCY = 'NGN';

interface CurrencyContextValue {
  /** ISO 4217 currency code (e.g. NGN, USD) */
  currencyCode: string;
  /** Symbol for the currency (e.g. ₦, $) - from Intl */
  symbol: string;
  /** Format a number as currency string using the organisation's currency */
  formatCurrency: (
    value: number,
    options?: { minFractionDigits?: number; maxFractionDigits?: number }
  ) => string;
  loading: boolean;
  /** Refetch organisation to update currency (e.g. after editing company details) */
  refetch: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/** Fallback symbols when Intl returns the code instead (e.g. NGN → ₦). */
const CURRENCY_SYMBOL_FALLBACKS: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
  JPY: '¥',
  ZAR: 'R',
  KES: 'KSh',
  GHS: '₵',
};

function getSymbol(currencyCode: string): string {
  const upper = currencyCode.toUpperCase();
  if (CURRENCY_SYMBOL_FALLBACKS[upper]) {
    return CURRENCY_SYMBOL_FALLBACKS[upper];
  }
  try {
    const fromIntl = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find(p => p.type === 'currency')?.value;
    if (fromIntl && fromIntl !== upper) {
      return fromIntl;
    }
  } catch {
    // fall through to code
  }
  return currencyCode;
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? null;
  const [currencyCode, setCurrencyCode] = useState<string>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);

  const fetchOrganisation = useCallback(async () => {
    if (!organisationId) {
      setCurrencyCode(DEFAULT_CURRENCY);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const org = await getOrganisation(organisationId);
      if (org?.currency_code) {
        setCurrencyCode(org.currency_code);
      } else {
        setCurrencyCode(DEFAULT_CURRENCY);
      }
    } catch {
      setCurrencyCode(DEFAULT_CURRENCY);
    } finally {
      setLoading(false);
    }
  }, [organisationId]);

  useEffect(() => {
    fetchOrganisation();
  }, [fetchOrganisation]);

  const formatCurrency = useCallback(
    (
      value: number,
      options?: { minFractionDigits?: number; maxFractionDigits?: number }
    ) => {
      const min = options?.minFractionDigits ?? 2;
      const max = options?.maxFractionDigits ?? 2;
      const symbol = getSymbol(currencyCode);
      const formatted = value.toLocaleString('en', {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      });
      return `${symbol}${formatted}`;
    },
    [currencyCode]
  );

  const symbol = getSymbol(currencyCode);

  const value: CurrencyContextValue = {
    currencyCode,
    symbol,
    formatCurrency,
    loading,
    refetch: fetchOrganisation,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
