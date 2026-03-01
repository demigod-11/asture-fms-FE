import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Landmark, Info } from 'lucide-react';

const BANK_ACCOUNTS = [
  { id: 'zenith', name: 'Zenith PLC' },
  { id: 'uba', name: 'UBA' },
  { id: 'gtb', name: 'GTBank' },
];

const DEFAULT_ACCOUNT = BANK_ACCOUNTS[0]!;

const BankReconciliation: React.FC = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState(DEFAULT_ACCOUNT.id);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [endingBalance, setEndingBalance] = useState('0.00');
  const [endingDate, setEndingDate] = useState('');
  const beginningBalance = '1,000,000.00';

  const selectedAccount =
    BANK_ACCOUNTS.find(a => a.id === accountId) ?? DEFAULT_ACCOUNT;

  const handleStartReconciling = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/transactions/reconcile', {
      state: { accountName: selectedAccount.name, accountId },
    });
  };

  return (
    <div className='max-w-2xl'>
      <h2 className='text-lg font-semibold text-gray-900 mb-2'>
        Which account do you want to reconcile?
      </h2>
      <p className='text-sm text-gray-600 mb-6'>
        Track fees, donations, and ensure every Naira aligns with your records.
      </p>

      <form onSubmit={handleStartReconciling} className='space-y-6'>
        <div>
          <label
            htmlFor='reconcile-account'
            className='form-label text-gray-900 block mb-1'
          >
            Account
          </label>
          <div className='relative'>
            <button
              type='button'
              id='reconcile-account'
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 flex items-center justify-between text-left'
            >
              <span className='flex items-center gap-2'>
                <Landmark className='h-4 w-4 text-gray-500' />
                {selectedAccount.name}
              </span>
              <ChevronDown className='h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2' />
            </button>
            {accountDropdownOpen && (
              <>
                <div
                  className='fixed inset-0 z-10'
                  aria-hidden
                  onClick={() => setAccountDropdownOpen(false)}
                />
                <ul
                  className='absolute top-full left-0 mt-1 z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1'
                  role='listbox'
                >
                  {BANK_ACCOUNTS.map(acc => (
                    <li key={acc.id} role='option'>
                      <button
                        type='button'
                        onClick={() => {
                          setAccountId(acc.id);
                          setAccountDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${accountId === acc.id ? 'bg-primary-50 text-[#073E60] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
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
          <a
            href='#'
            className='text-sm text-[#073E60] hover:underline mt-1.5 inline-block'
          >
            Last statement ending date shows here...
          </a>
        </div>

        <div>
          <label
            htmlFor='reconcile-beginning-balance'
            className='form-label text-gray-900 block mb-1'
          >
            Beginning Balance
          </label>
          <input
            id='reconcile-beginning-balance'
            type='text'
            value={beginningBalance}
            readOnly
            className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700'
          />
        </div>

        {/* Ending Balance and Ending Date on the same row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='reconcile-ending-balance'
              className='form-label text-gray-900 block mb-1'
            >
              Ending Balance <span className='text-error-500'>*</span>
              <Info
                className='inline-block w-3.5 h-3.5 text-gray-400 ml-1'
                aria-hidden
              />
            </label>
            <input
              id='reconcile-ending-balance'
              type='text'
              value={endingBalance}
              onChange={e => setEndingBalance(e.target.value)}
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
              required
            />
          </div>
          <div>
            <label
              htmlFor='reconcile-ending-date'
              className='form-label text-gray-900 block mb-1'
            >
              Ending Date <span className='text-error-500'>*</span>
              <Info
                className='inline-block w-3.5 h-3.5 text-gray-400 ml-1'
                aria-hidden
              />
            </label>
            <input
              id='reconcile-ending-date'
              type='date'
              value={endingDate}
              onChange={e => setEndingDate(e.target.value)}
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
              required
            />
          </div>
        </div>

        <button
          type='submit'
          className='w-full md:w-auto px-6 py-3 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors'
        >
          Start reconciling
        </button>
      </form>
    </div>
  );
};

export default BankReconciliation;
