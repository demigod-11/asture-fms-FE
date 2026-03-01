import React, { useState, useMemo } from 'react';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import ListPageRowActions from '@/components/ListPageRowActions';
import AddVendorDrawer from '@/components/AddVendorDrawer';

interface VendorRow {
  id: string;
  name: string;
  email: string;
  contact: string;
}

const SAMPLE_VENDORS: VendorRow[] = [
  {
    id: 'VEN-0001',
    name: 'ABC Supplies Ltd',
    email: 'accounts@abc.com',
    contact: '0801 234 5678',
  },
  {
    id: 'VEN-0002',
    name: 'XYZ Services',
    email: 'billing@xyz.com',
    contact: '0802 345 6789',
  },
];

const VENDOR_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: VendorRow) => row.id },
  { id: 'name', header: 'Name' as const, cell: (row: VendorRow) => row.name },
  {
    id: 'email',
    header: 'Email' as const,
    cell: (row: VendorRow) => row.email,
  },
  {
    id: 'contact',
    header: 'Contact' as const,
    cell: (row: VendorRow) => row.contact,
  },
];

const Vendors: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_VENDORS;
    return [...SAMPLE_VENDORS].sort((a, b) => {
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
          primaryLabel='New vendor'
          onPrimaryClick={() => setAddVendorOpen(true)}
        />
        <SelectableDataTable<VendorRow>
          data={sortedData}
          getRowId={row => row.id}
          columns={VENDOR_COLUMNS}
          selectionLabel='vendors'
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
      <AddVendorDrawer
        open={addVendorOpen}
        onClose={() => setAddVendorOpen(false)}
        onSaved={() => setAddVendorOpen(false)}
      />
    </>
  );
};

export default Vendors;
