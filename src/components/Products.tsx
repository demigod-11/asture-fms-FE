import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ListPage from '@/components/ListPage';
import RowActions from '@/components/RowActions';
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
import { displayPublicId } from '@/utils/displayId';
import { getApiErrorMessage } from '@/utils/apiError';

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
    publicId: displayPublicId(
      (p as ProductResponse & { public_id?: string }).public_id
    ),
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

const Products: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
    ['products', organisationId, page, pageSize, search],
    () =>
      listProducts(organisationId, {
        page,
        page_size: pageSize,
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
      <ListPage<ProductRow>
        search={{
          value: search,
          onChange: v => {
            setSearch(v);
            setPage(1);
          },
        }}
        primaryAction={{
          label: 'New product',
          onClick: () => setAddProductOpen(true),
        }}
        data={sortedData}
        getRowId={row => row.id}
        columns={columns}
        selectionLabel='products'
        tableMinWidth='640px'
        sort={{
          key: sortKey,
          dir: sortDir,
          onSort: (key, dir) => {
            setSortKey(key);
            setSortDir(dir);
          },
        }}
        rowActions={row => (
          <RowActions
            onEdit={() =>
              setEditingProduct({
                id: row.id,
                name: row.name,
                code: row.code,
                description: row.description,
                price: row.price,
                status: row.status as 'active' | 'inactive',
              })
            }
            onDelete={() => deleteMutation.mutate(row.id)}
            confirmMessage={`Delete product "${row.name}"?`}
            editLabel='Edit product'
            deleteLabel='Delete product'
          />
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
          error ? getApiErrorMessage(error, 'Failed to load products') : null
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
            ? getApiErrorMessage(
                createMutation.error ?? updateMutation.error,
                'Failed to save product'
              )
            : undefined
        }
      />
    </>
  );
};

export default Products;
