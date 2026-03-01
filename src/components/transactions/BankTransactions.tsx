import React, { useState, useMemo } from 'react';
import { Calendar, Receipt, MoreHorizontal } from 'lucide-react';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import BankAccountDropdown, {
  BANK_ACCOUNTS,
} from '@/components/transactions/BankAccountDropdown';

interface TransactionRow {
  id: string;
  date: string;
  description: string;
  customer: string;
  reference: string;
  debit: string;
  credit: string;
}

/** Transaction data (includes receipt-style entries). */
const SAMPLE_TRANSACTIONS: TransactionRow[] = [
  {
    id: '1',
    date: '15 Mar 2025',
    description: 'Tuition payment',
    customer: 'ABC School',
    reference: 'BR-001',
    debit: '',
    credit: '₦45,000.00',
  },
  {
    id: '2',
    date: '16 Mar 2025',
    description: 'Donation',
    customer: 'John Doe',
    reference: 'BR-002',
    debit: '',
    credit: '₦12,500.00',
  },
  {
    id: '3',
    date: '18 Mar 2025',
    description: 'Office supplies',
    customer: 'XYZ Ltd',
    reference: 'INV-101',
    debit: '₦8,200.00',
    credit: '',
  },
];

const DEFAULT_ACCOUNT = BANK_ACCOUNTS[0]!;

const BankTransactions: React.FC = () => {
  const [accountId, setAccountId] = useState(DEFAULT_ACCOUNT.id);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const dateRangeLabel = 'May 7, 2024 - Apr 14, 2025';

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_TRANSACTIONS;
    return [...SAMPLE_TRANSACTIONS].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const handleSort = (key: string, dir: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDir(dir);
  };

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        leftSlot={
          <BankAccountDropdown value={accountId} onChange={setAccountId} />
        }
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel='All Transactions'
        rightSlot={
          <span className='inline-flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 rounded-xl border border-gray-200 bg-white'>
            <Calendar className='h-4 w-4 text-gray-400' />
            {dateRangeLabel}
          </span>
        }
      />
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
            cell: (row: TransactionRow) => row.customer,
          },
          {
            id: 'reference',
            header: 'Reference' as const,
            cell: (row: TransactionRow) => row.reference,
          },
          {
            id: 'debit',
            header: 'Debit' as const,
            cell: (row: TransactionRow) => (
              <span className='text-right tabular-nums block'>{row.debit}</span>
            ),
          },
          {
            id: 'credit',
            header: 'Credit' as const,
            cell: (row: TransactionRow) => (
              <span className='text-right tabular-nums block'>
                {row.credit}
              </span>
            ),
          },
        ]}
        selectionLabel='transactions'
        tableMinWidth='640px'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        renderRowActions={_row => (
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
      />
    </div>
  );
};

export default BankTransactions;
