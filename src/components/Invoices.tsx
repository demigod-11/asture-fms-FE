import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import ListPage from '@/components/ListPage';
import StatusBadge from '@/components/StatusBadge';
import RowActions from '@/components/RowActions';
import {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listInvoices,
  deleteInvoice,
  updateInvoice,
  type InvoiceResponse,
  type InvoiceStatus,
} from '@/services/invoicesApi';
import { getDateRangeForPreset } from '@/lib/dateFilters';
import { displayPublicId } from '@/utils/displayId';
import { getApiErrorMessage } from '@/utils/apiError';

interface InvoiceRow {
  id: string;
  publicId: string;
  customerId: string;
  amount: number;
  created: string;
  due: string;
  customerName: string;
  email: string;
  status: InvoiceStatus;
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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

function invoiceToRow(invoice: InvoiceResponse): InvoiceRow {
  const createdDisplay = formatDateTime(
    invoice.created_at ?? invoice.issue_date
  );
  const dueDisplay = invoice.due_date
    ? `Due ${formatDate(invoice.due_date)}`
    : '';

  return {
    id: invoice.id,
    publicId: displayPublicId(invoice.public_id ?? invoice.invoice_number),
    customerId: invoice.customer_id,
    amount: Number(invoice.total ?? 0),
    created: createdDisplay,
    due: dueDisplay,
    customerName: displayPublicId(invoice.customer_name),
    email: invoice.customer_email ?? '',
    status: (invoice.status || 'draft') as InvoiceStatus,
  };
}

const getInvoiceColumns = (formatCurrency: (n: number) => string) => [
  {
    id: 'id',
    header: 'ID' as const,
    cell: (row: InvoiceRow) => (
      <Link
        to={`/sales/invoice/${row.id}`}
        className='text-primary-600 dark:text-primary-400 hover:underline'
      >
        {row.publicId}
      </Link>
    ),
  },
  {
    id: 'customer',
    header: 'Customer' as const,
    cell: (row: InvoiceRow) => (
      <>
        <Link
          to={`/sales/customers?customer_id=${encodeURIComponent(row.customerId)}`}
          className='block text-primary-600 dark:text-primary-400 hover:underline'
        >
          {row.customerName}
        </Link>
        {row.email ? (
          <a
            href={`mailto:${row.email}`}
            className='text-xs text-primary-600 dark:text-primary-400 hover:underline dark:hover:text-primary-300'
          >
            {row.email}
          </a>
        ) : null}
      </>
    ),
  },
  {
    id: 'amount',
    header: 'Amount' as const,
    cell: (row: InvoiceRow) => formatCurrency(row.amount),
  },
  {
    id: 'created',
    header: 'Created' as const,
    cell: (row: InvoiceRow) => (
      <>
        <span className='block'>{row.created}</span>
        <span className='text-xs text-gray-500 dark:text-gray-400'>
          {row.due}
        </span>
      </>
    ),
  },
  {
    id: 'status',
    header: 'Status' as const,
    cell: (row: InvoiceRow) => (
      <StatusBadge status={row.status} family='invoice' />
    ),
  },
];

const Invoices: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get('customer_id') ?? undefined;
  const organisationId = profiles[0]?.organisation_id ?? '';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const deleteMutation = useMutation(
    (invoiceId: string) => deleteInvoice(organisationId, invoiceId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices', organisationId]);
      },
    }
  );

  const voidMutation = useMutation(
    (invoiceId: string) =>
      updateInvoice(organisationId, invoiceId, {
        status: 'cancelled',
      } as never),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices', organisationId]);
      },
    }
  );

  const columns = useMemo(
    () => getInvoiceColumns(formatCurrency),
    [formatCurrency]
  );

  const { date_from, date_to } = getDateRangeForPreset(
    dateFilter.preset,
    dateFilter.customFrom,
    dateFilter.customTo
  );

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    [
      'invoices',
      organisationId,
      page,
      pageSize,
      search,
      date_from,
      date_to,
      customerIdFromUrl,
    ],
    () =>
      listInvoices(organisationId, {
        page,
        page_size: pageSize,
        from_date: date_from,
        to_date: date_to,
        customer_id: customerIdFromUrl ?? null,
        search: search || undefined,
      }),
    { enabled: Boolean(organisationId) }
  );

  const totalPages = listData?.total_pages ?? 0;
  const rows = useMemo(
    () => (listData?.items ?? []).map(invoiceToRow),
    [listData]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortKey];
      const bVal = (b as unknown as Record<string, unknown>)[sortKey];
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? (aVal as number) - (bVal as number)
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
              numeric: true,
            });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to manage invoices.
      </NoOrganisationNotice>
    );
  }

  return (
    <ListPage<InvoiceRow>
      search={{
        value: search,
        onChange: v => {
          setSearch(v);
          setPage(1);
        },
      }}
      dateFilter={{ state: dateFilter, onChange: setDateFilter }}
      primaryAction={{ label: 'Create invoice', to: '/sales/invoice/new' }}
      data={sortedData}
      getRowId={row => row.id}
      columns={columns}
      selectionLabel='invoices'
      tableMinWidth='640px'
      sort={{
        key: sortKey,
        dir: sortDir,
        onSort: (key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        },
      }}
      onRowClick={row => navigate(`/sales/invoice/${row.id}`)}
      onBulkDelete={ids => {
        const deletable = sortedData.filter(
          r => ids.includes(r.id) && r.status === 'draft'
        );
        void Promise.all(
          deletable.map(r => deleteInvoice(organisationId, r.id))
        ).then(() =>
          queryClient.invalidateQueries(['invoices', organisationId])
        );
      }}
      bulkDeleteConfirmMessage='Delete selected draft invoices? (Non-draft rows are skipped.)'
      rowActions={row => (
        <RowActions
          onDelete={
            row.status === 'draft'
              ? () => deleteMutation.mutate(row.id)
              : undefined
          }
          confirmMessage={`Delete invoice "${row.publicId}"?`}
          deleteLabel='Delete invoice'
          extra={
            row.status !== 'draft' &&
            row.status !== 'paid' &&
            row.status !== 'cancelled' ? (
              <button
                type='button'
                className='px-2 py-1 text-xs text-red-600 hover:underline'
                onClick={() => {
                  if (
                    window.confirm(
                      `Void invoice "${row.publicId}"? This cannot be undone.`
                    )
                  ) {
                    voidMutation.mutate(row.id);
                  }
                }}
              >
                Void
              </button>
            ) : null
          }
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
        error ? getApiErrorMessage(error, 'Failed to load invoices') : null
      }
      emptyMessage='No invoices found.'
    />
  );
};

export default Invoices;
