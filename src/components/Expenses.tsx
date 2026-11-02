import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import ListPage from '@/components/ListPage';
import StatusBadge from '@/components/StatusBadge';
import RowActions from '@/components/RowActions';
import AddExpenseDrawer, {
  type AddExpensePayload,
} from '@/components/AddExpenseDrawer';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  type ExpenseResponse,
} from '@/services/expensesApi';
import {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';
import { displayPublicId } from '@/utils/displayId';
import { getApiErrorMessage } from '@/utils/apiError';

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
  {
    id: 'id',
    header: 'ID' as const,
    cell: (row: ExpenseRow) => row.publicId,
  },
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
      <StatusBadge status={row.status} family='expense' />
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
  const [pageSize, setPageSize] = useState(20);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseResponse | null>(
    null
  );
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const columns = useMemo(
    () => getExpenseColumns(formatCurrency),
    [formatCurrency]
  );

  const { date_from, date_to } = getDateRangeForPreset(
    dateFilter.preset,
    dateFilter.customFrom,
    dateFilter.customTo
  );

  const { data, isLoading, error } = useQuery(
    ['expenses', organisationId, page, pageSize, date_from, date_to],
    () =>
      listExpenses(organisationId, {
        page,
        page_size: pageSize,
        from_date: date_from,
        to_date: date_to,
      }),
    { enabled: Boolean(organisationId) }
  );

  const totalPages = data?.total_pages ?? 0;
  const rows: ExpenseRow[] = useMemo(
    () =>
      (data?.items ?? []).map((e: ExpenseResponse) => ({
        id: e.id,
        publicId: displayPublicId(e.public_id),
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

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(
      r =>
        r.publicId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
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
  }, [filteredRows, sortKey, sortDir]);

  const expenseBody = (payload: AddExpensePayload) => ({
    description: payload.description,
    amount: Number(payload.amount || '0'),
    expense_date: payload.expense_date || null,
    currency: 'NGN',
    payment_status: payload.payment_status,
    vendor_id: undefined,
    coa_id: payload.coa_id || undefined,
    reference: null,
  });

  const createMutation = useMutation(
    (payload: AddExpensePayload) =>
      createExpense(organisationId, expenseBody(payload)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['expenses', organisationId]);
        setAddExpenseOpen(false);
        setEditingExpense(null);
      },
    }
  );

  const updateMutation = useMutation(
    (payload: AddExpensePayload) =>
      updateExpense(organisationId, editingExpense!.id, expenseBody(payload)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['expenses', organisationId]);
        setAddExpenseOpen(false);
        setEditingExpense(null);
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
      <ListPage<ExpenseRow>
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search expenses...',
        }}
        dateFilter={{ state: dateFilter, onChange: setDateFilter }}
        primaryAction={{
          label: 'New expense',
          onClick: () => {
            setEditingExpense(null);
            setAddExpenseOpen(true);
          },
        }}
        data={sortedData}
        getRowId={row => row.id}
        columns={columns}
        selectionLabel='expenses'
        tableMinWidth='640px'
        sort={{
          key: sortKey,
          dir: sortDir,
          onSort: (key, dir) => {
            setSortKey(key);
            setSortDir(dir);
          },
        }}
        onRowClick={row => {
          const match = (data?.items ?? []).find(item => item.id === row.id);
          if (!match) return;
          setEditingExpense(match);
          setAddExpenseOpen(true);
        }}
        onBulkDelete={ids => {
          void Promise.all(
            ids.map(id => deleteExpense(organisationId, id))
          ).then(() =>
            queryClient.invalidateQueries(['expenses', organisationId])
          );
        }}
        bulkDeleteConfirmMessage='Delete the selected expenses?'
        rowActions={row => (
          <RowActions
            onEdit={() => {
              const match = (data?.items ?? []).find(
                item => item.id === row.id
              );
              if (!match) return;
              setEditingExpense(match);
              setAddExpenseOpen(true);
            }}
            onDelete={() => deleteMutation.mutate(row.id)}
            confirmMessage={`Delete expense "${row.description || row.publicId}"?`}
            deleteLabel='Delete expense'
          />
        )}
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
          error ? getApiErrorMessage(error, 'Failed to load expenses') : null
        }
        emptyMessage='No expenses found.'
      />
      <AddExpenseDrawer
        open={addExpenseOpen}
        onClose={() => {
          setAddExpenseOpen(false);
          setEditingExpense(null);
        }}
        initial={
          editingExpense
            ? {
                description: editingExpense.description ?? '',
                amount: String(editingExpense.amount ?? ''),
                expense_date: editingExpense.expense_date ?? '',
                payment_status: editingExpense.payment_status ?? 'unpaid',
                coa_id: editingExpense.coa_id ?? undefined,
              }
            : null
        }
        onSaved={payload =>
          editingExpense
            ? updateMutation.mutate(payload)
            : createMutation.mutate(payload)
        }
        isSaving={createMutation.isLoading || updateMutation.isLoading}
        saveError={
          createMutation.error || updateMutation.error
            ? getApiErrorMessage(
                createMutation.error || updateMutation.error,
                'Failed to save expense'
              )
            : undefined
        }
      />
    </>
  );
};

export default Expenses;
