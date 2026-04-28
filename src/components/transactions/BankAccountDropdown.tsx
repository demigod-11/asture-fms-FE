import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ChevronDown, Landmark } from 'lucide-react';
import { listBankAccounts } from '@/services/bankAccountsApi';

/** Fallback when API not used (e.g. BankReconciliation before org context). */
export const BANK_ACCOUNTS_FALLBACK = [
  { id: 'zenith', name: 'Zenith PLC' },
  { id: 'uba', name: 'UBA' },
  { id: 'gtb', name: 'GTBank' },
];

/** @deprecated Use list from API; kept for backwards compatibility. */
export const BANK_ACCOUNTS = BANK_ACCOUNTS_FALLBACK;

interface BankAccountDropdownProps {
  value: string;
  onChange: (id: string) => void;
  organisationId?: string;
  className?: string;
}

const BankAccountDropdown: React.FC<BankAccountDropdownProps> = ({
  value,
  onChange,
  organisationId = '',
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const { data: accountsData } = useQuery(
    ['bank-accounts', organisationId],
    () => listBankAccounts(organisationId, { page_size: 100 }),
    { enabled: Boolean(organisationId) }
  );

  const accounts = accountsData?.items ?? [];
  const list = organisationId
    ? accounts.map(a => ({ id: a.id, name: a.name }))
    : BANK_ACCOUNTS_FALLBACK;

  useEffect(() => {
    if (list.length > 0 && !list.some(a => a.id === value)) {
      onChange(list[0]!.id);
      return;
    }
    if (list.length === 0 && value) {
      onChange('');
    }
  }, [list, value, onChange]);

  const selected = list.find(a => a.id === value) ?? list[0];
  const displayName = selected?.name ?? 'Select account';

  return (
    <div className={`relative ${className}`}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 min-w-[200px] justify-between'
        aria-haspopup='listbox'
        aria-expanded={open}
      >
        <span className='flex items-center gap-2'>
          <Landmark className='h-4 w-4 text-gray-500 dark:text-gray-400' />
          {displayName}
        </span>
        <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500' />
      </button>
      {open && (
        <>
          <div
            className='fixed inset-0 z-10'
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <ul
            className='absolute top-full left-0 mt-1 z-20 w-full min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg py-1'
            role='listbox'
          >
            {list.map(acc => (
              <li key={acc.id} role='option' aria-selected={value === acc.id}>
                <button
                  type='button'
                  onClick={() => {
                    onChange(acc.id);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${value === acc.id ? 'bg-primary-50 dark:bg-primary-900/40 text-[#052d47] dark:text-primary-200 font-medium' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <Landmark className='h-4 w-4' />
                  {acc.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default BankAccountDropdown;
