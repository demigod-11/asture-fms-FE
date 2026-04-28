import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import AddExpenseDrawer, {
  type AddExpensePayload,
} from '@/components/AddExpenseDrawer';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listExpenses,
  createExpense,
  deleteExpense,
  type ExpenseResponse,
} from '@/services/expensesApi';
import DateFilterDropdown, {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';

interface ExpenseRow {
  id: string;
  publicId: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: string;
}

const getExpenseColumns = (formatCurrency: (n: number) => string) => [
  { id: 'id', header: 'ID' as const, cell: (row: ExpenseRow) => row.publicId },
  {
    id: 'description',
    header: 'Description' as const,
    cell: (row: ExpenseRow) => row.description,
  },
  {
    id: 'category',
    header: 'Category' as const,
    cell: (row: ExpenseRow) => row.category,
  },
  {
    id: 'amount',
    header: 'Amount' as const,
    cell: (row: ExpenseRow) => formatCurrency(row.amount),
  },
  { id: 'date', header: 'Date' as const, cell: (row: ExpenseRow) => row.date },
  {
    id: 'status',
    header: 'Status' as const,
    cell: (row: ExpenseRow) => (
      <span
        className={`badge ${
          row.status === 'paid'
            ? 'badge-success'
            : row.status === 'reimbursed'
              ? 'badge-info'
              : 'badge-warning'
        }`}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    ),
  },
];

const Expenses: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const columns = useMemo(
    () => getExpenseColumns(formatCurrency),
    [formatCurrency]
  );

  const { data, isLoading, error } = useQuery(
    ['expenses', organisationId, page, dateFilter],
    () => {
      const { date_from, date_to } = getDateRangeForPreset(
        dateFilter.preset,
        dateFilter.customFrom,
        dateFilter.customTo
      );
      return listExpenses(organisationId, {
        page,
        page_size: 20,
        from_date: date_from,
        to_date: date_to,
      });
    },
    { enabled: Boolean(organisationId) }
  );

  const totalPages = data?.total_pages ?? 0;
  const rows: ExpenseRow[] = useMemo(
    () =>
      (data?.items ?? []).map((e: ExpenseResponse) => ({
        id: e.id,
        publicId:
          (e as ExpenseResponse & { public_id?: string }).public_id ?? e.id,
        description: e.description ?? '',
        category: e.coa_id ? 'Linked to account' : '—',
        amount: Number(e.amount ?? 0),
        date: e.expense_date
          ? new Date(e.expense_date).toLocaleDateString()
          : '',
        status: e.payment_status ?? 'unpaid',
      })),
    [data]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const aVal =
        (a as unknown as Record<string, string | number>)[sortKey] ?? '';
      const bVal =
        (b as unknown as Record<string, string | number>)[sortKey] ?? '';
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal), undefined, {
              numeric: true,
            });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  const createMutation = useMutation(
    (payload: AddExpensePayload) =>
      createExpense(organisationId, {
        description: payload.description,
        amount: Number(payload.amount || '0'),
        expense_date: payload.expense_date || null,
        currency: 'NGN',
        payment_status: payload.payment_status,
        vendor_id: undefined,
        coa_id: undefined,
        reference: null,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['expenses', organisationId]);
        setAddExpenseOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    (expenseId: string) => deleteExpense(organisationId, expenseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['expenses', organisationId]);
      },
    }
  );

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to manage expenses.
      </NoOrganisationNotice>
    );
  }

  return (
    <>
      <div className='space-y-4'>
        <ListPageToolbar
          searchValue={search}
          onSearchChange={setSearch}
          filterLabel='All categories'
          primaryLabel='New expense'
          onPrimaryClick={() => setAddExpenseOpen(true)}
          rightSlot={
            <DateFilterDropdown
              state={dateFilter}
              onStateChange={setDateFilter}
            />
          }
        />
        {error ? (
          <p className='text-sm text-red-600 dark:text-red-400'>
            {error instanceof Error ? error.message : 'Failed to load expenses'}
          </p>
        ) : null}
        <SelectableDataTable<ExpenseRow>
          data={sortedData}
          getRowId={row => row.id}
          columns={columns}
          selectionLabel='expenses'
          tableMinWidth='640px'
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={(key, dir) => {
            setSortKey(key);
            setSortDir(dir);
          }}
          renderRowActions={row => (
            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={() => {
                  if (window.confirm(`Delete expense "${row.description}"?`)) {
                    deleteMutation.mutate(row.id);
                  }
                }}
                className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
                aria-label='Delete expense'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
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
          emptyMessage={isLoading ? 'Loading expenses…' : 'No expenses found.'}
        />
      </div>
      <AddExpenseDrawer
        open={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        onSaved={payload => createMutation.mutate(payload)}
        isSaving={createMutation.isLoading}
        saveError={
          createMutation.error instanceof Error
            ? createMutation.error.message
            : undefined
        }
      />
    </>
  );
};

export default Expenses;
