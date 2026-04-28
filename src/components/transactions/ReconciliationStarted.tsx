import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Printer, AlertCircle, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import SelectableDataTable from '@/components/SelectableDataTable';
import PaginationFooter from '@/components/PaginationFooter';
import DateFilterDropdown, {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import {
  getReconciliation,
  addReconciliationMatch,
  removeReconciliationMatch,
  updateReconciliation,
} from '@/services/reconciliationsApi';
import {
  listBankTransactions,
  type BankTransactionResponse,
} from '@/services/bankTransactionsApi';

interface ReconcileRow {
  id: string;
  date: string;
  refNo: string;
  description: string;
  amount: string;
  cleared: boolean;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

const ReconciliationStarted: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const location = useLocation();
  const state = location.state as {
    reconciliationId?: string;
    accountName?: string;
    accountId?: string;
  } | null;
  const reconciliationId = state?.reconciliationId ?? '';
  const accountId = state?.accountId ?? '';
  const accountName = state?.accountName ?? 'Bank account';

  const [filter, setFilter] = useState<'all' | 'payments' | 'deposits'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const { data: recon, isLoading: reconLoading } = useQuery(
    ['reconciliation', organisationId, reconciliationId],
    () => getReconciliation(organisationId, reconciliationId),
    { enabled: Boolean(organisationId && reconciliationId) }
  );

  const { data: txnsData } = useQuery(
    ['bank-transactions', organisationId, accountId],
    () =>
      listBankTransactions(organisationId, {
        bank_account_id: accountId,
        page_size: 200,
      }),
    { enabled: Boolean(organisationId && accountId) }
  );

  const addMatchMutation = useMutation(
    (txnId: string) => {
      const txn = (txnsData?.items ?? []).find(t => t.id === txnId);
      if (!txn || !recon) throw new Error('Transaction not found');
      return addReconciliationMatch(organisationId, reconciliationId, {
        bank_transaction_id: txnId,
        amount: Number(txn.amount),
        matched_at: new Date().toISOString().slice(0, 10),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'reconciliation',
          organisationId,
          reconciliationId,
        ]);
      },
    }
  );

  const removeMatchMutation = useMutation(
    (txnId: string) =>
      removeReconciliationMatch(organisationId, reconciliationId, txnId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'reconciliation',
          organisationId,
          reconciliationId,
        ]);
      },
    }
  );

  const completeMutation = useMutation(
    () =>
      updateReconciliation(organisationId, reconciliationId, {
        status: 'completed',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'reconciliation',
          organisationId,
          reconciliationId,
        ]);
        navigate('/transactions/bank-transactions');
      },
    }
  );

  const matchedIds = useMemo(
    () => new Set((recon?.matches ?? []).map(m => m.bank_transaction_id)),
    [recon]
  );

  const rows: ReconcileRow[] = useMemo(() => {
    const items = (txnsData?.items ?? []) as BankTransactionResponse[];
    return items.map(t => ({
      id: t.id,
      date: formatDate(t.txn_date),
      refNo: t.reference ?? '',
      description: t.description ?? '',
      amount: formatCurrency(Number(t.amount ?? 0)),
      cleared: matchedIds.has(t.id),
    }));
  }, [txnsData, matchedIds, formatCurrency]);

  const filteredRows = useMemo(() => {
    if (filter === 'all') return rows;
    if (filter === 'payments')
      return rows.filter(r => {
        const t = (txnsData?.items ?? []).find(
          (x: { id: string }) => x.id === r.id
        ) as BankTransactionResponse | undefined;
        return t && Number(t.amount) < 0;
      });
    return rows.filter(r => {
      const t = (txnsData?.items ?? []).find(
        (x: { id: string }) => x.id === r.id
      ) as BankTransactionResponse | undefined;
      return t && Number(t.amount) >= 0;
    });
  }, [rows, filter, txnsData?.items]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortKey, sortDir]);

  const statementEndingBalance = Number(recon?.statement_ending_balance ?? 0);
  const clearedTotal = useMemo(() => {
    return (recon?.matches ?? []).reduce(
      (sum, m) => sum + Number(m.amount ?? 0),
      0
    );
  }, [recon?.matches]);
  const difference = statementEndingBalance - clearedTotal;
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / 10));
  const statementDate = recon?.statement_ending_date
    ? new Date(recon.statement_ending_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  if (!reconciliationId) {
    return (
      <div className='space-y-4'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          No reconciliation in progress. Start one from{' '}
          <Link
            to='/transactions/bank-reconciliation'
            className='text-[#073E60] dark:text-primary-400 hover:underline'
          >
            Bank reconciliation
          </Link>
          .
        </p>
      </div>
    );
  }

  if (reconLoading || !recon) {
    return (
      <div className='space-y-4'>
        <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        <div className='h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse' />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <nav
        className='flex items-center gap-1 text-sm text-gray-500'
        aria-label='Breadcrumb'
      >
        <Link to='/' className='hover:text-gray-700'>
          Dashboard
        </Link>
        <ChevronRight className='h-4 w-4' />
        <Link
          to='/transactions/bank-transactions'
          className='hover:text-gray-700'
        >
          Transactions
        </Link>
        <ChevronRight className='h-4 w-4' />
        <span className='text-gray-900 font-medium dark:text-gray-100'>
          Bank reconciliation
        </span>
      </nav>

      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
            Reconcile {accountName}
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            {statementDate}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Link
            to='/transactions/bank-reconciliation'
            className='text-sm font-medium text-[#073E60] dark:text-primary-400 hover:underline'
          >
            Edit info
          </Link>
          {recon.status !== 'completed' && (
            <button
              type='button'
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isLoading}
              className='px-4 py-2 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl disabled:opacity-50'
            >
              {completeMutation.isLoading ? 'Completing…' : 'Complete'}
            </button>
          )}
        </div>
      </div>

      <div className='card p-4 sm:p-6'>
        <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-sm'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500 dark:text-gray-400'>
              Statement ending balance
            </span>
            <span className='font-semibold text-gray-900 dark:text-gray-100'>
              {formatCurrency(statementEndingBalance)}
            </span>
          </div>
          <span className='text-gray-400' aria-hidden>
            −
          </span>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500 dark:text-gray-400'>
              Cleared total
            </span>
            <span className='font-semibold text-gray-900 dark:text-gray-100'>
              {formatCurrency(clearedTotal)}
            </span>
          </div>
          <span className='text-gray-400' aria-hidden>
            =
          </span>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500 dark:text-gray-400'>Difference</span>
            <span className='font-semibold text-gray-900 dark:text-gray-100'>
              {formatCurrency(difference)}
            </span>
            {difference !== 0 && (
              <AlertCircle className='h-4 w-4 text-amber-500' aria-hidden />
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <DateFilterDropdown state={dateFilter} onStateChange={setDateFilter} />
        <div className='flex rounded-lg border border-gray-200 dark:border-gray-600 p-0.5 bg-gray-50 dark:bg-gray-800'>
          {(['all', 'payments', 'deposits'] as const).map(f => (
            <button
              key={f}
              type='button'
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize ${
                filter === f
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <button
          type='button'
          className='p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg print:hidden'
          aria-label='Print'
          onClick={() => window.print()}
        >
          <Printer className='h-5 w-5' />
        </button>
      </div>

      <SelectableDataTable<ReconcileRow>
        data={sortedRows}
        getRowId={row => row.id}
        selectionLabel='reconciliation rows'
        tableMinWidth='700px'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
        footer={
          <PaginationFooter
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        }
        columns={[
          { id: 'date', header: 'Date' as const, cell: row => row.date },
          {
            id: 'refNo',
            header: 'Ref No.' as const,
            cell: row => row.refNo || '—',
          },
          {
            id: 'description',
            header: 'Description' as const,
            cell: row => row.description,
          },
          {
            id: 'amount',
            header: 'Amount' as const,
            headerClassName: 'text-right',
            cell: row => (
              <span className='text-right tabular-nums block'>
                {row.amount}
              </span>
            ),
          },
          {
            id: 'cleared',
            header: 'Cleared' as const,
            cell: row => (
              <div className='flex items-center gap-2'>
                {row.cleared ? (
                  <button
                    type='button'
                    onClick={() => removeMatchMutation.mutate(row.id)}
                    disabled={removeMatchMutation.isLoading}
                    className='p-1.5 text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                    aria-label='Unclear'
                    title='Mark uncleared'
                  >
                    <Check className='h-4 w-4' />
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={() => addMatchMutation.mutate(row.id)}
                    disabled={addMatchMutation.isLoading}
                    className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                    aria-label='Mark cleared'
                    title='Mark cleared'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ReconciliationStarted;
