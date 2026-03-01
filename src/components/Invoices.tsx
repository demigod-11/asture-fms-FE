import React, { useState, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import ListPageRowActions from '@/components/ListPageRowActions';

type InvoiceStatus =
  | 'Paid'
  | 'Overdue'
  | 'Pending'
  | 'Partially Paid'
  | 'Draft';

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  amount: number;
  created: string;
  due: string;
  customerName: string;
  email: string;
  status: InvoiceStatus;
}

const SAMPLE_ROWS: InvoiceRow[] = [
  {
    id: 'INV-0001',
    invoiceNumber: 'INV-2023-001',
    amount: 120000,
    created: 'Mar 20, 2025 4:59 PM',
    due: 'Due Mar 28, 2025',
    customerName: 'Michael Brown',
    email: 'guardianemailaddress@hotmail.com',
    status: 'Pending',
  },
  {
    id: 'INV-0002',
    invoiceNumber: 'INV-2023-002',
    amount: 120000,
    created: 'Mar 20, 2025 4:59 PM',
    due: 'Due Mar 28, 2025',
    customerName: 'Michael Brown',
    email: 'guardianemailaddress@hotmail.com',
    status: 'Overdue',
  },
  {
    id: 'INV-0003',
    invoiceNumber: 'INV-2023-003',
    amount: 120000,
    created: 'Mar 18, 2025 2:30 PM',
    due: 'Due Mar 25, 2025',
    customerName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Paid',
  },
  {
    id: 'INV-0004',
    invoiceNumber: 'INV-2023-004',
    amount: 85000,
    created: 'Mar 15, 2025 10:00 AM',
    due: 'Due Mar 22, 2025',
    customerName: 'Chidi Okeke',
    email: 'chidi@example.com',
    status: 'Partially Paid',
  },
  {
    id: 'INV-0005',
    invoiceNumber: 'INV-2023-005',
    amount: 200000,
    created: 'Mar 10, 2025 3:45 PM',
    due: 'Due Mar 17, 2025',
    customerName: 'Amara Nwosu',
    email: 'amara@example.com',
    status: 'Paid',
  },
];

function formatAmount(n: number): string {
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, string> = {
    Paid: 'badge-success',
    Overdue: 'badge-error',
    Pending: 'badge-warning',
    'Partially Paid': 'badge-info',
    Draft: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`badge inline-flex items-center gap-1 ${map[status]}`}>
      {status === 'Pending' && <Clock className='h-3 w-3 shrink-0' />}
      {status}
    </span>
  );
}

const INVOICE_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: InvoiceRow) => row.id },
  {
    id: 'customer',
    header: 'Customer' as const,
    cell: (row: InvoiceRow) => (
      <>
        <span className='block'>{row.customerName}</span>
        <a
          href={`mailto:${row.email}`}
          className='text-xs text-[#073E60] hover:underline'
        >
          {row.email}
        </a>
      </>
    ),
  },
  {
    id: 'amount',
    header: 'Amount' as const,
    cell: (row: InvoiceRow) => formatAmount(row.amount),
  },
  {
    id: 'created',
    header: 'Created' as const,
    cell: (row: InvoiceRow) => (
      <>
        <span className='block'>{row.created}</span>
        <span className='text-xs text-gray-500'>{row.due}</span>
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_ROWS;
    return [...SAMPLE_ROWS].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortKey];
      const bVal = (b as unknown as Record<string, unknown>)[sortKey];
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
              numeric: true,
            });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel='All invoices'
        rightSlot={
          <button
            type='button'
            className='btn-secondary inline-flex items-center gap-2'
          >
            <Calendar className='h-4 w-4' /> Last 90 days
          </button>
        }
        primaryLabel='Create invoice'
        primaryTo='/sales/invoice/new'
      />
      <SelectableDataTable<InvoiceRow>
        data={sortedData}
        getRowId={row => row.id}
        columns={INVOICE_COLUMNS}
        selectionLabel='invoices'
        tableMinWidth='640px'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
        renderRowActions={() => <ListPageRowActions />}
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

export default Invoices;
