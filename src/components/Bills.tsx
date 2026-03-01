import React, { useState, useMemo } from 'react';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import ListPageRowActions from '@/components/ListPageRowActions';
import AddBillDrawer from '@/components/AddBillDrawer';

interface BillRow {
  id: string;
  vendor: string;
  amount: string;
  dueDate: string;
  status: 'Pending' | 'Paid';
}

const SAMPLE_BILLS: BillRow[] = [
  {
    id: 'BIL-0001',
    vendor: 'ABC Supplies',
    amount: '₦45,000',
    dueDate: '15 Mar 2025',
    status: 'Pending',
  },
  {
    id: 'BIL-0002',
    vendor: 'XYZ Services',
    amount: '₦120,000',
    dueDate: '20 Mar 2025',
    status: 'Paid',
  },
];

const BILL_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: BillRow) => row.id },
  {
    id: 'vendor',
    header: 'Vendor' as const,
    cell: (row: BillRow) => row.vendor,
  },
  {
    id: 'amount',
    header: 'Amount' as const,
    cell: (row: BillRow) => row.amount,
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
        className={`badge ${row.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}
      >
        {row.status}
      </span>
    ),
  },
];

const Bills: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_BILLS;
    return [...SAMPLE_BILLS].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  return (
    <>
      <div className='space-y-4'>
        <ListPageToolbar
          searchValue={search}
          onSearchChange={setSearch}
          filterLabel='All statuses'
          primaryLabel='New bill'
          onPrimaryClick={() => setAddBillOpen(true)}
        />
        <SelectableDataTable<BillRow>
          data={sortedData}
          getRowId={row => row.id}
          columns={BILL_COLUMNS}
          selectionLabel='bills'
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
      <AddBillDrawer
        open={addBillOpen}
        onClose={() => setAddBillOpen(false)}
        onSaved={() => setAddBillOpen(false)}
      />
    </>
  );
};

export default Bills;
