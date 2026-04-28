import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ListPageWithPagination from '@/components/ListPageWithPagination';
import AddProductDrawer from '@/components/AddProductDrawer';
import type { EditProductInitial } from '@/components/AddProductDrawer';
import { useProfile } from '@/contexts/ProfileContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductResponse,
} from '@/services/productsApi';
import type { AddProductPayload } from '@/components/AddProductDrawer';

interface ProductRow {
  id: string;
  publicId: string;
  name: string;
  code: string;
  description: string;
  price: string;
  status: string;
  tag_codes: string[];
}

function productToRow(
  p: ProductResponse & { tag_codes?: string[] }
): ProductRow {
  return {
    id: p.id,
    publicId: (p as ProductResponse & { public_id?: string }).public_id ?? p.id,
    name: p.name,
    code: p.code ?? '',
    description: p.description ?? '',
    price: String(
      (p as ProductResponse & { price?: string | number }).price ?? '0'
    ),
    status: p.status,
    tag_codes: p.tag_codes ?? [],
  };
}

const PAGE_SIZE = 20;

const Products: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<EditProductInitial | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    ['products', organisationId, page, search],
    () =>
      listProducts(organisationId, {
        page,
        page_size: PAGE_SIZE,
        name: search || undefined,
      }),
    { enabled: Boolean(organisationId) }
  );

  const createMutation = useMutation(
    (body: AddProductPayload) =>
      createProduct(organisationId, {
        name: body.name,
        code: body.code ?? null,
        description: body.description ?? null,
        price: body.price ?? '0',
        status: body.status ?? 'active',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products', organisationId]);
        setAddProductOpen(false);
      },
    }
  );

  const updateMutation = useMutation(
    ({ productId, body }: { productId: string; body: AddProductPayload }) =>
      updateProduct(organisationId, productId, {
        name: body.name,
        code: body.code ?? null,
        description: body.description ?? null,
        price: body.price ?? '0',
        status: body.status ?? 'active',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products', organisationId]);
        setEditingProduct(null);
      },
    }
  );

  const deleteMutation = useMutation(
    (productId: string) => deleteProduct(organisationId, productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products', organisationId]);
      },
    }
  );

  const totalPages = listData?.total_pages ?? 0;
  const rowData = useMemo(
    () => (listData?.items ?? []).map(productToRow),
    [listData]
  );
  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'ID' as const,
        cell: (row: ProductRow) => row.publicId,
      },
      {
        id: 'name',
        header: 'Name' as const,
        cell: (row: ProductRow) => row.name,
      },
      {
        id: 'code',
        header: 'Code' as const,
        cell: (row: ProductRow) => row.code || '—',
      },
      {
        id: 'description',
        header: 'Description' as const,
        cell: (row: ProductRow) => row.description || '—',
      },
      {
        id: 'price',
        header: 'Price' as const,
        cell: (row: ProductRow) =>
          formatCurrency(parseFloat(row.price || '0') || 0),
      },
      {
        id: 'tags',
        header: 'Tags' as const,
        cell: (row: ProductRow) =>
          row.tag_codes.length > 0 ? (
            <span className='inline-flex flex-wrap gap-1'>
              {row.tag_codes.map(code => (
                <span
                  key={code}
                  className='badge bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                >
                  {code}
                </span>
              ))}
            </span>
          ) : (
            '—'
          ),
      },
    ],
    [formatCurrency]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rowData;
    return [...rowData].sort((a, b) => {
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
  }, [rowData, sortKey, sortDir]);

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to manage products.
      </NoOrganisationNotice>
    );
  }

  return (
    <>
      <ListPageWithPagination<ProductRow>
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel='All Types'
        primaryLabel='New product'
        onPrimaryClick={() => setAddProductOpen(true)}
        data={sortedData}
        getRowId={row => row.id}
        columns={columns}
        selectionLabel='products'
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
              onClick={() =>
                setEditingProduct({
                  id: row.id,
                  name: row.name,
                  code: row.code,
                  description: row.description,
                  price: row.price,
                  status: row.status as 'active' | 'inactive',
                })
              }
              className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
              aria-label='Edit product'
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
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </button>
            <button
              type='button'
              onClick={() => {
                if (window.confirm(`Delete product "${row.name}"?`)) {
                  deleteMutation.mutate(row.id);
                }
              }}
              className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
              aria-label='Delete product'
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
        onRowClick={row =>
          setEditingProduct({
            id: row.id,
            name: row.name,
            code: row.code,
            description: row.description,
            price: row.price,
            status: row.status as 'active' | 'inactive',
          })
        }
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
        errorMessage={
          error instanceof Error
            ? error.message
            : error
              ? 'Failed to load products'
              : null
        }
        emptyMessage='No products found.'
      />
      <AddProductDrawer
        open={addProductOpen || Boolean(editingProduct)}
        onClose={() => {
          setAddProductOpen(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        onSaved={(payload, editId) => {
          if (editId) {
            updateMutation.mutate({ productId: editId, body: payload });
          } else {
            createMutation.mutate(payload);
          }
        }}
        isSaving={createMutation.isLoading || updateMutation.isLoading}
        saveError={
          createMutation.error != null || updateMutation.error != null
            ? String(
                (createMutation.error as { message?: unknown } | null)
                  ?.message ??
                  (updateMutation.error as { message?: unknown } | null)
                    ?.message ??
                  createMutation.error ??
                  updateMutation.error
              )
            : undefined
        }
      />
    </>
  );
};

export default Products;
