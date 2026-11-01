import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import ListPage from '@/components/ListPage';
import BankAccountDropdown from '@/components/transactions/BankAccountDropdown';
import {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';
import {
  listBankTransactions,
  type BankTransactionResponse,
} from '@/services/bankTransactionsApi';
import { getApiErrorMessage } from '@/utils/apiError';

interface TransactionRow {
  id: string;
  date: string;
  description: string;
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
  const [pageSize, setPageSize] = useState(20);
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
    [
      'bank-transactions',
      organisationId,
      accountId,
      page,
      pageSize,
      date_from,
      date_to,
    ],
    () =>
      listBankTransactions(organisationId, {
        page,
        page_size: pageSize,
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

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(
      r =>
        r.description.toLowerCase().includes(q) ||
        r.reference.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const sortedData = useMemo(() => {
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

  return (
    <ListPage<TransactionRow>
      leftSlot={
        <BankAccountDropdown
          value={accountId}
          onChange={id => {
            setAccountId(id);
            setPage(1);
          }}
          organisationId={organisationId}
        />
      }
      search={{ value: search, onChange: setSearch }}
      dateFilter={{ state: dateFilter, onChange: setDateFilter }}
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
      sort={{
        key: sortKey,
        dir: sortDir,
        onSort: (key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        },
      }}
      pagination={{
        page,
        totalPages,
        pageSize,
        onPageChange: setPage,
        onPageSizeChange: n => {
          setPageSize(n);
          setPage(1);
        },
      }}
      isLoading={isLoading}
      errorMessage={
        error ? getApiErrorMessage(error, 'Failed to load transactions') : null
      }
      emptyMessage='No transactions found.'
    />
  );
};

export default BankTransactions;
