import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import AddBillDrawer, { type AddBillPayload } from '@/components/AddBillDrawer';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listBills,
  createBill,
  deleteBill,
  type BillResponse,
} from '@/services/billsApi';
import DateFilterDropdown, {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';

interface BillRow {
  id: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: string;
}

const getBillColumns = (formatCurrency: (n: number) => string) => [
  {
    id: 'id',
    header: 'ID' as const,
    cell: (row: BillRow) => (
      <Link
        to={`/purchase/bills/${row.id}`}
        className='text-[#073E60] dark:text-primary-400 hover:underline'
      >
        {row.id}
      </Link>
    ),
  },
  {
    id: 'vendor',
    header: 'Vendor' as const,
    cell: (row: BillRow) => row.vendor,
  },
  {
    id: 'amount',
    header: 'Amount' as const,
    cell: (row: BillRow) => formatCurrency(row.amount),
  },
  {
    id: 'dueDate',
    header: 'Due Date' as const,
    cell: (row: BillRow) => row.dueDate,
  },
  {
    id: 'status',
    header: 'Status' as const,
    cell: (row: BillRow) => (
      <span
        className={`badge ${
          row.status === 'paid'
            ? 'badge-success'
            : row.status === 'overdue'
              ? 'badge-error'
              : 'badge-warning'
        }`}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    ),
  },
];

const Bills: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const columns = useMemo(
    () => getBillColumns(formatCurrency),
    [formatCurrency]
  );

  const { data, isLoading, error } = useQuery(
    ['bills', organisationId, page, dateFilter],
    () => {
      const { date_from, date_to } = getDateRangeForPreset(
        dateFilter.preset,
        dateFilter.customFrom,
        dateFilter.customTo
      );
      return listBills(organisationId, {
        page,
        page_size: 20,
        from_date: date_from,
        to_date: date_to,
      });
    },
    { enabled: Boolean(organisationId) }
  );

  const totalPages = data?.total_pages ?? 0;

  const rows: BillRow[] = useMemo(
    () =>
      (data?.items ?? []).map((b: BillResponse) => ({
        id: b.id,
        vendor: b.vendor_id,
        amount: Number(b.total ?? 0),
        dueDate: b.due_date ? new Date(b.due_date).toLocaleDateString() : '',
        status: b.status ?? 'draft',
      })),
    [data]
  );

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(
      r => r.id.toLowerCase().includes(q) || r.vendor.toLowerCase().includes(q)
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

  const createMutation = useMutation(
    (payload: AddBillPayload) =>
      createBill(organisationId, {
        vendor_id: payload.vendor_id,
        bill_number: payload.bill_number ?? null,
        bill_date: payload.bill_date ?? null,
        due_date: payload.due_date ?? null,
        status: 'draft' as never,
        currency: undefined,
        terms: payload.terms ?? null,
        notes: payload.notes ?? null,
        discount_total: '0' as never,
        line_items: payload.line_items.map((li, index) => {
          const total = parseFloat(li.total || '0');
          const quantity = 1;
          const unit = Number.isFinite(total) ? total : 0;
          return {
            product_id: undefined,
            coa_id: undefined,
            description: li.description || null,
            quantity: quantity.toString(),
            unit_price: unit.toString(),
            amount: unit.toString(),
            tax: '0',
            sort_order: index,
          };
        }),
      } as never),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bills', organisationId]);
        setAddBillOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    (billId: string) => deleteBill(organisationId, billId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bills', organisationId]);
      },
    }
  );

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to manage bills.
      </NoOrganisationNotice>
    );
  }

  return (
    <>
      <div className='space-y-4'>
        <ListPageToolbar
          searchValue={search}
          onSearchChange={setSearch}
          filterLabel='All statuses'
          primaryLabel='New bill'
          onPrimaryClick={() => setAddBillOpen(true)}
          rightSlot={
            <DateFilterDropdown
              state={dateFilter}
              onStateChange={setDateFilter}
            />
          }
        />
        {error ? (
          <p className='text-sm text-red-600 dark:text-red-400'>
            {error instanceof Error ? error.message : 'Failed to load bills'}
          </p>
        ) : null}
        <SelectableDataTable<BillRow>
          data={sortedData}
          getRowId={row => row.id}
          columns={columns}
          selectionLabel='bills'
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
                  if (window.confirm(`Delete bill "${row.id}"?`)) {
                    deleteMutation.mutate(row.id);
                  }
                }}
                className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
                aria-label='Delete bill'
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
          emptyMessage={isLoading ? 'Loading bills…' : 'No bills found.'}
        />
      </div>
      <AddBillDrawer
        open={addBillOpen}
        onClose={() => setAddBillOpen(false)}
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

export default Bills;
