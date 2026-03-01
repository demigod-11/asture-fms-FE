import React, { useState } from 'react';
import { ChevronDown, Landmark } from 'lucide-react';

export const BANK_ACCOUNTS = [
  { id: 'zenith', name: 'Zenith PLC' },
  { id: 'uba', name: 'UBA' },
  { id: 'gtb', name: 'GTBank' },
];

interface BankAccountDropdownProps {
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

const BankAccountDropdown: React.FC<BankAccountDropdownProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const selected = BANK_ACCOUNTS.find(a => a.id === value) ?? BANK_ACCOUNTS[0];
  const displayName = selected?.name ?? 'Select account';

  return (
    <div className={`relative ${className}`}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 min-w-[200px] justify-between'
        aria-haspopup='listbox'
        aria-expanded={open}
      >
        <span className='flex items-center gap-2'>
          <Landmark className='h-4 w-4 text-gray-500' />
          {displayName}
        </span>
        <ChevronDown className='h-4 w-4 text-gray-400' />
      </button>
      {open && (
        <>
          <div
            className='fixed inset-0 z-10'
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <ul
            className='absolute top-full left-0 mt-1 z-20 w-full min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg py-1'
            role='listbox'
          >
            {BANK_ACCOUNTS.map(acc => (
              <li key={acc.id} role='option' aria-selected={value === acc.id}>
                <button
                  type='button'
                  onClick={() => {
                    onChange(acc.id);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${value === acc.id ? 'bg-primary-50 text-[#073E60] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
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
