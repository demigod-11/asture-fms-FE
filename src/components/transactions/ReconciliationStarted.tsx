import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Printer,
  Calendar,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import SelectableDataTable from '@/components/SelectableDataTable';
import PaginationFooter from '@/components/PaginationFooter';

const formatNaira = (n: number) =>
  `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface ReconcileRow {
  id: string;
  date: string;
  clearedDate: string;
  type: string;
  customer: string;
  refNo: string;
  description: string;
  amount: string;
  outstanding: string;
  cleared: boolean;
}

const SAMPLE_RECONCILE_ROWS: ReconcileRow[] = [
  {
    id: '1',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Check',
    customer: 'John Doe',
    refNo: 'INV-1001',
    description: 'Tuition Fee',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: false,
  },
  {
    id: '2',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Expense',
    customer: 'John Doe',
    refNo: 'PAYROLL-1',
    description: 'Staff Salaries',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: false,
  },
  {
    id: '3',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Check',
    customer: 'John Doe',
    refNo: 'INV-1001',
    description: 'Tuition Fee',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: false,
  },
  {
    id: '4',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Check',
    customer: 'John Doe',
    refNo: 'INV-1001',
    description: 'Tuition Fee',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: true,
  },
  {
    id: '5',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Expense',
    customer: 'John Doe',
    refNo: 'PAYROLL-1',
    description: 'Staff Salaries',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: true,
  },
  {
    id: '6',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Check',
    customer: 'John Doe',
    refNo: 'INV-1001',
    description: 'Tuition Fee',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: true,
  },
  {
    id: '7',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Check',
    customer: 'John Doe',
    refNo: 'INV-1001',
    description: 'Tuition Fee',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: false,
  },
  {
    id: '8',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Expense',
    customer: 'John Doe',
    refNo: 'PAYROLL-1',
    description: 'Staff Salaries',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: false,
  },
  {
    id: '9',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Check',
    customer: 'John Doe',
    refNo: 'INV-1001',
    description: 'Tuition Fee',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: false,
  },
  {
    id: '10',
    date: '03/05/25',
    clearedDate: '04/05/25',
    type: 'Expense',
    customer: 'John Doe',
    refNo: 'PAYROLL-1',
    description: 'Staff Salaries',
    amount: '₦500.00',
    outstanding: '₦500.00',
    cleared: false,
  },
];

const ReconciliationStarted: React.FC = () => {
  const location = useLocation();
  const state = location.state as {
    accountName?: string;
    accountId?: string;
  } | null;
  const accountName = state?.accountName ?? 'Zenith PLC';
  const statementDate = 'April 28, 2024';

  const [filter, setFilter] = useState<'all' | 'payments' | 'deposits'>('all');
  const [dateRangeLabel] = useState('May 7, 2024 - Apr 14, 2025');
  const [statementEndOpen, setStatementEndOpen] = useState(false);
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedRows = useMemo(() => {
    if (!sortKey) return SAMPLE_RECONCILE_ROWS;
    return [...SAMPLE_RECONCILE_ROWS].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const statementEndingBalance = 15000;
  const clearedBalance = 11000;
  const difference = 4000;
  const bookEndingBalance = 13000;
  const clearedDeposits = 4000;
  const clearedWithdrawals = 6000;

  return (
    <div className='space-y-4'>
      {/* Breadcrumbs */}
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
        <span className='text-gray-900 font-medium'>Bank reconciliation</span>
      </nav>

      {/* Title row */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            Reconcile {accountName}
          </h2>
          <p className='text-sm text-gray-500 mt-0.5'>{statementDate}</p>
        </div>
        <Link
          to='/transactions/bank-reconciliation'
          className='text-sm font-medium text-[#073E60] hover:underline'
        >
          Edit info
        </Link>
      </div>

      {/* Summary section */}
      <div className='card p-4 sm:p-6'>
        <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-sm'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500'>Statement Ending Balance</span>
            <span className='font-semibold text-gray-900'>
              {formatNaira(statementEndingBalance)}
            </span>
          </div>
          <span className='text-gray-400' aria-hidden>
            −
          </span>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500'>Cleared Balance</span>
            <span className='font-semibold text-gray-900'>
              {formatNaira(clearedBalance)}
            </span>
          </div>
          <span className='text-gray-400' aria-hidden>
            =
          </span>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500'>Difference</span>
            <span className='font-semibold text-gray-900'>
              {formatNaira(difference)}
            </span>
            <AlertCircle className='h-4 w-4 text-amber-500' aria-hidden />
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-sm mt-4 pt-4 border-t border-gray-200'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500'>Book Ending Balance</span>
            <span className='font-semibold text-gray-900'>
              {formatNaira(bookEndingBalance)}
            </span>
          </div>
          <span className='text-gray-400'>+</span>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500'>Cleared Deposits</span>
            <span className='font-semibold text-gray-900'>
              {formatNaira(clearedDeposits)}
            </span>
          </div>
          <span className='text-gray-400'>−</span>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gray-500'>Cleared Withdrawals</span>
            <span className='font-semibold text-gray-900'>
              {formatNaira(clearedWithdrawals)}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative'>
          <button
            type='button'
            onClick={() => setStatementEndOpen(!statementEndOpen)}
            className='inline-flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-700'
          >
            Statement end...
            <ChevronDown className='h-4 w-4 text-gray-400' />
          </button>
          {statementEndOpen && (
            <>
              <div
                className='fixed inset-0 z-10'
                aria-hidden
                onClick={() => setStatementEndOpen(false)}
              />
              <div className='absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[180px]'>
                <button
                  type='button'
                  onClick={() => setStatementEndOpen(false)}
                  className='w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50'
                >
                  Apr 28, 2024
                </button>
                <button
                  type='button'
                  onClick={() => setStatementEndOpen(false)}
                  className='w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50'
                >
                  Mar 28, 2024
                </button>
              </div>
            </>
          )}
        </div>
        <span className='inline-flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 rounded-xl border border-gray-200 bg-white'>
          <Calendar className='h-4 w-4 text-gray-400' />
          {dateRangeLabel}
        </span>
        <div className='flex rounded-lg border border-gray-200 p-0.5 bg-gray-50'>
          {(['all', 'payments', 'deposits'] as const).map(f => (
            <button
              key={f}
              type='button'
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <button
          type='button'
          className='p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg'
          aria-label='Print'
        >
          <Printer className='h-5 w-5' />
        </button>
      </div>

      {/* Table */}
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
            id: 'clearedDate',
            header: 'Cleared Date' as const,
            cell: row => row.clearedDate,
          },
          { id: 'type', header: 'Type' as const, cell: row => row.type },
          {
            id: 'customer',
            header: 'Customer' as const,
            cell: row => row.customer,
          },
          { id: 'refNo', header: 'Ref No.' as const, cell: row => row.refNo },
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
            id: 'outstanding',
            header: 'Outstanding' as const,
            headerClassName: 'text-right',
            cell: row => (
              <span className='text-right tabular-nums block'>
                {row.outstanding}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ReconciliationStarted;
