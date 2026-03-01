import React, { useState, useMemo } from 'react';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import ListPageRowActions from '@/components/ListPageRowActions';
import AddExpenseDrawer from '@/components/AddExpenseDrawer';

interface ExpenseRow {
  id: string;
  description: string;
  category: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Paid' | 'Reimbursed';
}

const SAMPLE_EXPENSES: ExpenseRow[] = [
  {
    id: 'EXP-0001',
    description: 'Office supplies',
    category: 'Supplies',
    amount: '₦25,000',
    date: '20 Mar 2025',
    status: 'Paid',
  },
  {
    id: 'EXP-0002',
    description: 'Travel - Lagos trip',
    category: 'Travel',
    amount: '₦85,000',
    date: '18 Mar 2025',
    status: 'Pending',
  },
  {
    id: 'EXP-0003',
    description: 'Software subscription',
    category: 'Software',
    amount: '₦45,000',
    date: '15 Mar 2025',
    status: 'Reimbursed',
  },
];

const EXPENSE_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: ExpenseRow) => row.id },
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
    cell: (row: ExpenseRow) => row.amount,
  },
  { id: 'date', header: 'Date' as const, cell: (row: ExpenseRow) => row.date },
  {
    id: 'status',
    header: 'Status' as const,
    cell: (row: ExpenseRow) => (
      <span
        className={`badge ${
          row.status === 'Paid'
            ? 'badge-success'
            : row.status === 'Reimbursed'
              ? 'badge-info'
              : 'badge-warning'
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

const Expenses: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_EXPENSES;
    return [...SAMPLE_EXPENSES].sort((a, b) => {
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
          filterLabel='All categories'
          primaryLabel='New expense'
          onPrimaryClick={() => setAddExpenseOpen(true)}
        />
        <SelectableDataTable<ExpenseRow>
          data={sortedData}
          getRowId={row => row.id}
          columns={EXPENSE_COLUMNS}
          selectionLabel='expenses'
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
      <AddExpenseDrawer
        open={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        onSaved={() => setAddExpenseOpen(false)}
      />
    </>
  );
};

export default Expenses;
