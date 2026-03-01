import React, { useState, useMemo } from 'react';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import ListPageRowActions from '@/components/ListPageRowActions';
import AddProductDrawer from '@/components/AddProductDrawer';

interface ProductRow {
  id: string;
  name: string;
  productType: string;
  description: string;
  basePriceUsd: number;
}

const SAMPLE_PRODUCTS: ProductRow[] = [
  {
    id: 'PRD-0001',
    name: 'Consulting Fee',
    productType: 'Recurring Fee',
    description: 'Monthly consulting retainer',
    basePriceUsd: 500,
  },
  {
    id: 'PRD-0002',
    name: 'Advisory Package',
    productType: 'Recurring Fee',
    description: 'Quarterly advisory and strategy package',
    basePriceUsd: 1200,
  },
  {
    id: 'PRD-0003',
    name: 'Transaction Fee',
    productType: 'One-Off Fee',
    description: 'Per-transaction processing fee',
    basePriceUsd: 25,
  },
  {
    id: 'PRD-0004',
    name: 'Platform Subscription',
    productType: 'Recurring Fee',
    description: 'Annual platform access and support',
    basePriceUsd: 700,
  },
  {
    id: 'PRD-0005',
    name: 'Compliance Review',
    productType: 'One-Off Fee',
    description: 'One-time compliance review and report',
    basePriceUsd: 450,
  },
  {
    id: 'PRD-0006',
    name: 'Audit Support',
    productType: 'One-Off Fee',
    description: 'Audit preparation and documentation support',
    basePriceUsd: 850,
  },
  {
    id: 'PRD-0007',
    name: 'Miscellaneous Service',
    productType: 'One-Off Fee',
    description: 'Other professional services as agreed',
    basePriceUsd: 150,
  },
];

function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PRODUCT_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: ProductRow) => row.id },
  { id: 'name', header: 'Name' as const, cell: (row: ProductRow) => row.name },
  {
    id: 'productType',
    header: 'Product Type' as const,
    cell: (row: ProductRow) => row.productType,
  },
  {
    id: 'description',
    header: 'Product Description' as const,
    cell: (row: ProductRow) => row.description,
  },
  {
    id: 'basePrice',
    header: 'Base Price (₦)' as const,
    cell: (row: ProductRow) => formatPrice(row.basePriceUsd),
  },
];

const Products: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_PRODUCTS;
    return [...SAMPLE_PRODUCTS].sort((a, b) => {
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
    <>
      <div className='space-y-4'>
        <ListPageToolbar
          searchValue={search}
          onSearchChange={setSearch}
          filterLabel='All Types'
          primaryLabel='New product'
          onPrimaryClick={() => setAddProductOpen(true)}
        />
        <SelectableDataTable<ProductRow>
          data={sortedData}
          getRowId={row => row.id}
          columns={PRODUCT_COLUMNS}
          selectionLabel='products'
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
      <AddProductDrawer
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onSaved={() => setAddProductOpen(false)}
      />
    </>
  );
};

export default Products;
