import React, { useState, useMemo } from 'react';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import ListPageRowActions from '@/components/ListPageRowActions';
import AddCustomerDrawer from '@/components/AddCustomerDrawer';

interface CustomerRow {
  id: string;
  name: string;
  guardianName: string;
  contact: string;
  class: string;
  terms: string;
}

const SAMPLE_CUSTOMERS: CustomerRow[] = [
  {
    id: 'CUS-0001',
    name: 'John Doe',
    guardianName: 'Mrs. Mary Doe',
    contact: 'mary.doe@example.com / 0801 234 5678',
    class: 'JSS 1',
    terms: '1st Term',
  },
  {
    id: 'CUS-0002',
    name: 'Jane Smith',
    guardianName: 'Mr. John Smith',
    contact: 'john.smith@example.com / 0802 345 6789',
    class: 'JSS 2',
    terms: '2nd Term',
  },
  {
    id: 'CUS-0003',
    name: 'Chidi Okeke',
    guardianName: 'Mrs. Ngozi Okeke',
    contact: 'ngozi@example.com / 0803 456 7890',
    class: 'SS 1',
    terms: '1st Term',
  },
];

const CUSTOMER_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: CustomerRow) => row.id },
  { id: 'name', header: 'Name' as const, cell: (row: CustomerRow) => row.name },
  {
    id: 'guardian',
    header: 'Primary Contact' as const,
    cell: (row: CustomerRow) => row.guardianName,
  },
  {
    id: 'contact',
    header: 'Contact' as const,
    cell: (row: CustomerRow) => row.contact,
  },
  {
    id: 'class',
    header: 'Segment' as const,
    cell: (row: CustomerRow) => row.class,
  },
  {
    id: 'terms',
    header: 'Payment Terms' as const,
    cell: (row: CustomerRow) => row.terms,
  },
];

const Customers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_CUSTOMERS;
    return [...SAMPLE_CUSTOMERS].sort((a, b) => {
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
          filterLabel='All Types'
          primaryLabel='New customer'
          onPrimaryClick={() => setAddCustomerOpen(true)}
        />
        <SelectableDataTable<CustomerRow>
          data={sortedData}
          getRowId={row => row.id}
          columns={CUSTOMER_COLUMNS}
          selectionLabel='customers'
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

      <AddCustomerDrawer
        open={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        onSaved={() => setAddCustomerOpen(false)}
      />
    </>
  );
};

export default Customers;
