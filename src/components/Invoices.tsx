import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useQuery } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import DateFilterDropdown, {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listInvoices,
  type InvoiceResponse,
  type InvoiceStatus,
} from '@/services/invoicesApi';

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
    publicId: invoice.public_id ?? invoice.invoice_number,
    customerId: invoice.customer_id,
    amount: Number(invoice.total ?? 0),
    created: createdDisplay,
    due: dueDisplay,
    // Customer name/email are not yet exposed on the invoice response;
    // these can be filled in later when the backend projects them.
    customerName: 'Customer',
    email: '',
    status: (invoice.status || 'draft') as InvoiceStatus,
  };
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, string> = {
    paid: 'badge-success',
    overdue: 'badge-error',
    sent: 'badge-warning',
    partially_paid: 'badge-info',
    draft: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  return (
    <span
      className={`badge inline-flex items-center gap-1 ${map[status] ?? ''}`}
    >
      {(status === 'sent' || status === 'overdue') && (
        <Clock className='h-3 w-3 shrink-0' />
      )}
      {status.replace('_', ' ')}
    </span>
  );
}

const getInvoiceColumns = (formatCurrency: (n: number) => string) => [
  {
    id: 'id',
    header: 'ID' as const,
    cell: (row: InvoiceRow) => (
      <Link
        to={`/sales/invoice/${row.id}`}
        className='text-[#073E60] dark:text-primary-400 hover:underline'
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
          className='block text-[#073E60] dark:text-primary-400 hover:underline'
        >
          {row.customerName}
        </Link>
        <a
          href={`mailto:${row.email}`}
          className='text-xs text-[#073E60] dark:text-primary-400 hover:underline dark:hover:text-primary-300'
        >
          {row.email}
        </a>
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
    cell: (row: InvoiceRow) => <StatusBadge status={row.status} />,
  },
];

const Invoices: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const [searchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get('customer_id') ?? undefined;
  const organisationId = profiles[0]?.organisation_id ?? '';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const columns = useMemo(
    () => getInvoiceColumns(formatCurrency),
    [formatCurrency]
  );

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    ['invoices', organisationId, page, search, dateFilter, customerIdFromUrl],
    () =>
      listInvoices(organisationId, {
        page,
        page_size: 20,
        from_date: dateFilter.customFrom,
        to_date: dateFilter.customTo,
        customer_id: customerIdFromUrl ?? null,
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
    <div className='space-y-4'>
      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel='All invoices'
        rightSlot={
          <DateFilterDropdown
            state={dateFilter}
            onStateChange={setDateFilter}
          />
        }
        primaryLabel='Create invoice'
        primaryTo='/sales/invoice/new'
      />
      {error != null && (
        <p className='text-sm text-red-600 dark:text-red-400'>
          {error instanceof Error ? error.message : 'Failed to load invoices'}
        </p>
      )}
      <SelectableDataTable<InvoiceRow>
        data={sortedData}
        getRowId={row => row.id}
        columns={columns}
        selectionLabel='invoices'
        tableMinWidth='640px'
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
        emptyMessage={isLoading ? 'Loading invoices…' : 'No invoices found.'}
      />
    </div>
  );
};

export default Invoices;
