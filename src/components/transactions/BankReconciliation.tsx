import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useProfile } from '@/contexts/ProfileContext';
import BankAccountDropdown, {
  BANK_ACCOUNTS_FALLBACK,
} from '@/components/transactions/BankAccountDropdown';
import { listBankAccounts } from '@/services/bankAccountsApi';
import { startReconciliation } from '@/services/reconciliationsApi';

const BankReconciliation: React.FC = () => {
  const navigate = useNavigate();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';

  const [accountId, setAccountId] = useState('');
  const [endingBalance, setEndingBalance] = useState('0.00');
  const [endingDate, setEndingDate] = useState('');

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
    if (list.length > 0 && !list.some(a => a.id === accountId)) {
      setAccountId(list[0]!.id);
      return;
    }
    if (list.length === 0 && accountId) {
      setAccountId('');
    }
  }, [list, accountId]);

  const selectedAccount = list.find(a => a.id === accountId) ?? list[0];
  const accountName = selectedAccount?.name ?? '';

  const startMutation = useMutation(
    () =>
      startReconciliation(organisationId, {
        bank_account_id: accountId,
        statement_ending_date: endingDate,
        statement_ending_balance: parseFloat(endingBalance) || 0,
      }),
    {
      onSuccess: recon => {
        navigate('/transactions/reconcile', {
          state: {
            reconciliationId: recon.id,
            accountId,
            accountName,
          },
        });
      },
    }
  );

  const handleStartReconciling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId || !endingDate) return;
    startMutation.mutate();
  };

  return (
    <div className='max-w-2xl'>
      <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
        Which account do you want to reconcile?
      </h2>
      <p className='text-sm text-gray-600 dark:text-gray-300 mb-6'>
        Track fees, donations, and ensure every Naira aligns with your records.
      </p>

      <form onSubmit={handleStartReconciling} className='space-y-6'>
        <div>
          <label
            htmlFor='reconcile-account'
            className='form-label text-gray-900 dark:text-gray-200 block mb-1'
          >
            Account
          </label>
          <BankAccountDropdown
            value={accountId}
            onChange={setAccountId}
            organisationId={organisationId}
          />
        </div>

        <div>
          <label
            htmlFor='reconcile-ending-balance'
            className='form-label text-gray-900 dark:text-gray-200 block mb-1'
          >
            Statement ending balance <span className='text-error-500'>*</span>
          </label>
          <input
            id='reconcile-ending-balance'
            type='text'
            inputMode='decimal'
            value={endingBalance}
            onChange={e => setEndingBalance(e.target.value)}
            className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600'
            required
          />
        </div>
        <div>
          <label
            htmlFor='reconcile-ending-date'
            className='form-label text-gray-900 dark:text-gray-200 block mb-1'
          >
            Statement ending date <span className='text-error-500'>*</span>
          </label>
          <input
            id='reconcile-ending-date'
            type='date'
            value={endingDate}
            onChange={e => setEndingDate(e.target.value)}
            className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600'
            required
          />
        </div>

        {startMutation.isError && (
          <p className='text-sm text-red-600 dark:text-red-400'>
            {startMutation.error instanceof Error
              ? startMutation.error.message
              : String(startMutation.error ?? 'Failed to start reconciliation')}
          </p>
        )}

        <button
          type='submit'
          disabled={startMutation.isLoading || !accountId || !endingDate}
          className='w-full md:w-auto px-6 py-3 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors disabled:opacity-50'
        >
          {startMutation.isLoading ? 'Starting…' : 'Start reconciling'}
        </button>
      </form>
    </div>
  );
};

export default BankReconciliation;
