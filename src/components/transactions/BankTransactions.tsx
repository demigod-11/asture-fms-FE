import React, { useState, useMemo } from 'react';
import { Receipt, MoreHorizontal } from 'lucide-react';
import { useQuery } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import BankAccountDropdown from '@/components/transactions/BankAccountDropdown';
import DateFilterDropdown, {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';
import {
  listBankTransactions,
  type BankTransactionResponse,
} from '@/services/bankTransactionsApi';

interface TransactionRow {
  id: string;
  date: string;
  description: string;
  customer: string;
  reference: string;
  debit: string;
  credit: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function txnToRow(
  t: BankTransactionResponse,
  formatCurrency: (n: number) => string
): TransactionRow {
  const amount = Number(t.amount ?? 0);
  return {
    id: t.id,
    date: formatDate(t.txn_date),
    description: t.description ?? '',
    customer: '',
    reference: t.reference ?? '',
    debit: amount < 0 ? formatCurrency(Math.abs(amount)) : '',
    credit: amount >= 0 ? formatCurrency(amount) : '',
  };
}

const BankTransactions: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';

  const [accountId, setAccountId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const { date_from, date_to } = getDateRangeForPreset(
    dateFilter.preset,
    dateFilter.customFrom,
    dateFilter.customTo
  );

  const { data, isLoading, error } = useQuery(
    ['bank-transactions', organisationId, accountId, page, date_from, date_to],
    () =>
      listBankTransactions(organisationId, {
        page,
        page_size: 20,
        bank_account_id: accountId || undefined,
        from_date: date_from,
        to_date: date_to,
      }),
    { enabled: Boolean(organisationId) }
  );

  const totalPages = data?.total_pages ?? 0;
  const rows = useMemo(
    () => (data?.items ?? []).map(t => txnToRow(t, formatCurrency)),
    [data, formatCurrency]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        leftSlot={
          <BankAccountDropdown
            value={accountId}
            onChange={setAccountId}
            organisationId={organisationId}
          />
        }
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel='All Transactions'
        rightSlot={
          <DateFilterDropdown
            state={dateFilter}
            onStateChange={setDateFilter}
          />
        }
      />
      {error ? (
        <p className='text-sm text-red-600 dark:text-red-400'>
          {error instanceof Error
            ? error.message
            : 'Failed to load transactions'}
        </p>
      ) : null}
      <SelectableDataTable<TransactionRow>
        data={sortedData}
        getRowId={row => row.id}
        columns={[
          {
            id: 'date',
            header: 'Date' as const,
            cell: (row: TransactionRow) => row.date,
          },
          {
            id: 'description',
            header: 'Description' as const,
            cell: (row: TransactionRow) => row.description,
          },
          {
            id: 'customer',
            header: 'Customer' as const,
            cell: (row: TransactionRow) => row.customer || '—',
          },
          {
            id: 'reference',
            header: 'Reference' as const,
            cell: (row: TransactionRow) => row.reference || '—',
          },
          {
            id: 'debit',
            header: 'Debit' as const,
            headerClassName: 'text-right',
            cellClassName: 'text-right tabular-nums',
            cell: (row: TransactionRow) => (
              <span
                className={
                  row.debit
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                {row.debit || '—'}
              </span>
            ),
          },
          {
            id: 'credit',
            header: 'Credit' as const,
            headerClassName: 'text-right',
            cellClassName: 'text-right tabular-nums',
            cell: (row: TransactionRow) => (
              <span
                className={
                  row.credit
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                {row.credit || '—'}
              </span>
            ),
          },
        ]}
        selectionLabel='transactions'
        tableMinWidth='640px'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
        renderRowActions={() => (
          <div className='flex items-center gap-0.5'>
            <button
              type='button'
              className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 rounded'
              aria-label='View receipt'
              title='View receipt'
            >
              <Receipt className='h-4 w-4' />
            </button>
            <button
              type='button'
              className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded'
              aria-label='More options'
            >
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </div>
        )}
        footer={
          <PaginationFooter
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        }
        isLoading={isLoading}
        emptyMessage={
          isLoading ? 'Loading transactions…' : 'No transactions found.'
        }
      />
    </div>
  );
};

export default BankTransactions;
