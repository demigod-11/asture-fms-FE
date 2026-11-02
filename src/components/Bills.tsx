import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import ListPage from '@/components/ListPage';
import StatusBadge from '@/components/StatusBadge';
import RowActions from '@/components/RowActions';
import AddBillDrawer, {
  type AddBillPayload,
  type EditBillInitial,
} from '@/components/AddBillDrawer';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listBills,
  createBill,
  updateBill,
  deleteBill,
  type BillResponse,
} from '@/services/billsApi';
import {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';
import { displayPublicId } from '@/utils/displayId';
import { getApiErrorMessage } from '@/utils/apiError';

interface BillRow {
  id: string;
  publicId: string;
  vendorId: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: string;
  raw: BillResponse;
}

const toLinePayload = (payload: AddBillPayload) =>
  payload.line_items.map((li, index) => {
    const total = parseFloat(li.total || '0');
    const unit = Number.isFinite(total) ? total : 0;
    return {
      product_id: undefined,
      coa_id: li.coa_id || undefined,
      description: li.description || null,
      quantity: '1',
      unit_price: unit.toString(),
      amount: unit.toString(),
      tax: '0',
      sort_order: index,
    };
  });

const Bills: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vendorIdFromUrl = searchParams.get('vendor_id') ?? null;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<EditBillInitial | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'ID' as const,
        cell: (row: BillRow) => (
          <Link
            to={`/purchase/bills/${row.id}`}
            className='text-primary-600 dark:text-primary-400 hover:underline'
            onClick={e => e.stopPropagation()}
          >
            {row.publicId}
          </Link>
        ),
      },
      {
        id: 'vendor',
        header: 'Vendor' as const,
        cell: (row: BillRow) => (
          <Link
            to={`/purchase/vendor?vendor_id=${encodeURIComponent(row.vendorId)}`}
            className='text-primary-600 dark:text-primary-400 hover:underline'
            onClick={e => e.stopPropagation()}
          >
            {row.vendor}
          </Link>
        ),
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
          <StatusBadge status={row.status} family='bill' />
        ),
      },
    ],
    [formatCurrency]
  );

  const { date_from, date_to } = getDateRangeForPreset(
    dateFilter.preset,
    dateFilter.customFrom,
    dateFilter.customTo
  );

  const { data, isLoading, error } = useQuery(
    [
      'bills',
      organisationId,
      page,
      pageSize,
      search,
      date_from,
      date_to,
      vendorIdFromUrl,
    ],
    () =>
      listBills(organisationId, {
        page,
        page_size: pageSize,
        from_date: date_from,
        to_date: date_to,
        search: search || undefined,
        vendor_id: vendorIdFromUrl,
      }),
    { enabled: Boolean(organisationId) }
  );

  const totalPages = data?.total_pages ?? 0;

  const rows: BillRow[] = useMemo(
    () =>
      (data?.items ?? []).map((b: BillResponse) => ({
        id: b.id,
        publicId: displayPublicId(b.public_id ?? b.bill_number),
        vendorId: b.vendor_id,
        vendor: displayPublicId(b.vendor_name),
        amount: Number(b.total ?? 0),
        dueDate: b.due_date ? new Date(b.due_date).toLocaleDateString() : '',
        status: b.status ?? 'draft',
        raw: b,
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

  const toEditInitial = (b: BillResponse): EditBillInitial => ({
    id: b.id,
    vendor_id: b.vendor_id,
    vendor_name: b.vendor_name,
    vendor_email: b.vendor_email,
    bill_number: b.bill_number,
    bill_date: b.bill_date,
    due_date: b.due_date,
    terms: b.terms,
    notes: b.notes,
    line_items: (b.line_items ?? []).map(li => ({
      description: li.description ?? '',
      total: String(li.amount ?? '0'),
      coa_id: li.coa_id ?? undefined,
    })),
  });

  const createMutation = useMutation(
    (payload: AddBillPayload) =>
      createBill(organisationId, {
        vendor_id: payload.vendor_id,
        bill_number: payload.bill_number ?? null,
        bill_date: payload.bill_date ?? null,
        due_date: payload.due_date ?? null,
        status: 'draft' as never,
        currency: 'NGN',
        terms: payload.terms ?? null,
        notes: payload.notes ?? null,
        discount_total: '0' as never,
        line_items: toLinePayload(payload),
      } as never),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bills', organisationId]);
        setAddBillOpen(false);
        setEditingBill(null);
      },
    }
  );

  const updateMutation = useMutation(
    (payload: AddBillPayload) =>
      updateBill(organisationId, editingBill!.id, {
        vendor_id: payload.vendor_id,
        bill_number: payload.bill_number ?? null,
        bill_date: payload.bill_date ?? null,
        due_date: payload.due_date ?? null,
        terms: payload.terms ?? null,
        notes: payload.notes ?? null,
        line_items: toLinePayload(payload),
      } as never),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bills', organisationId]);
        setAddBillOpen(false);
        setEditingBill(null);
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

  const statusMutation = useMutation(
    ({ billId, status }: { billId: string; status: string }) =>
      updateBill(organisationId, billId, { status } as never),
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
      <ListPage<BillRow>
        search={{
          value: search,
          onChange: v => {
            setSearch(v);
            setPage(1);
          },
        }}
        dateFilter={{ state: dateFilter, onChange: setDateFilter }}
        primaryAction={{
          label: 'New bill',
          onClick: () => {
            setEditingBill(null);
            setAddBillOpen(true);
          },
        }}
        data={sortedData}
        getRowId={row => row.id}
        columns={columns}
        selectionLabel='bills'
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
          if (row.status === 'draft') {
            setEditingBill(toEditInitial(row.raw));
            setAddBillOpen(true);
            return;
          }
          navigate(`/purchase/bills/${row.id}`);
        }}
        onBulkDelete={ids => {
          void Promise.all(ids.map(id => deleteBill(organisationId, id))).then(
            () => queryClient.invalidateQueries(['bills', organisationId])
          );
        }}
        bulkDeleteConfirmMessage='Delete the selected bills?'
        rowActions={row => (
          <RowActions
            onEdit={
              row.status === 'draft'
                ? () => {
                    setEditingBill(toEditInitial(row.raw));
                    setAddBillOpen(true);
                  }
                : undefined
            }
            extra={
              row.status === 'draft' ? (
                <button
                  type='button'
                  className='px-2 py-1 text-xs text-primary-600 hover:underline'
                  onClick={() =>
                    statusMutation.mutate({
                      billId: row.id,
                      status: 'open',
                    })
                  }
                >
                  Approve
                </button>
              ) : row.status !== 'paid' ? (
                <button
                  type='button'
                  className='px-2 py-1 text-xs text-primary-600 hover:underline'
                  onClick={() =>
                    statusMutation.mutate({
                      billId: row.id,
                      status: 'paid',
                    })
                  }
                >
                  Mark paid
                </button>
              ) : null
            }
            onDelete={
              row.status === 'draft'
                ? () => deleteMutation.mutate(row.id)
                : undefined
            }
            confirmMessage={`Delete bill "${row.publicId}"?`}
            deleteLabel='Delete bill'
            editLabel='Edit bill'
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
          error ? getApiErrorMessage(error, 'Failed to load bills') : null
        }
        emptyMessage='No bills found.'
      />
      <AddBillDrawer
        open={addBillOpen}
        onClose={() => {
          setAddBillOpen(false);
          setEditingBill(null);
        }}
        initial={editingBill}
        onSaved={payload =>
          editingBill
            ? updateMutation.mutate(payload)
            : createMutation.mutate(payload)
        }
        isSaving={createMutation.isLoading || updateMutation.isLoading}
        saveError={
          createMutation.error || updateMutation.error
            ? getApiErrorMessage(
                createMutation.error || updateMutation.error,
                'Failed to save bill'
              )
            : undefined
        }
      />
    </>
  );
};

export default Bills;
