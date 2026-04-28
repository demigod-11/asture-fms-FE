import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import PaginationFooter from '@/components/PaginationFooter';
import AddVendorDrawer, {
  type AddVendorPayload,
} from '@/components/AddVendorDrawer';
import { useProfile } from '@/contexts/ProfileContext';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  type VendorResponse,
} from '@/services/vendorsApi';

interface VendorRow {
  id: string;
  publicId: string;
  name: string;
  email: string;
  contact: string;
}

function vendorToRow(v: VendorResponse): VendorRow {
  return {
    id: v.id,
    publicId: v.public_id,
    name: v.name,
    email: v.email ?? '—',
    contact: v.phone ?? '—',
  };
}

const VENDOR_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: VendorRow) => row.publicId },
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
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorRow | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    ['vendors', organisationId, page, search],
    () =>
      listVendors(organisationId, {
        page,
        page_size: 20,
        search: search || undefined,
      }),
    { enabled: Boolean(organisationId) }
  );

  const totalPages = listData?.total_pages ?? 0;
  const rowData = useMemo(
    () => (listData?.items ?? []).map(vendorToRow),
    [listData]
  );

  const createMutation = useMutation(
    (payload: AddVendorPayload) =>
      createVendor(organisationId, {
        name: payload.name,
        email: payload.email || undefined,
        phone: payload.phone || undefined,
        address: payload.address,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendors', organisationId]);
        setAddVendorOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    (vendorId: string) => deleteVendor(organisationId, vendorId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendors', organisationId]);
      },
    }
  );

  const updateMutation = useMutation(
    ({ vendorId, payload }: { vendorId: string; payload: AddVendorPayload }) =>
      updateVendor(organisationId, vendorId, {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        address: payload.address ?? null,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendors', organisationId]);
        setEditingVendor(null);
      },
    }
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rowData;
    return [...rowData].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string | undefined>)[
        sortKey
      ];
      const bVal = (b as unknown as Record<string, string | undefined>)[
        sortKey
      ];
      const cmp = String(aVal ?? '').localeCompare(
        String(bVal ?? ''),
        undefined,
        {
          numeric: true,
        }
      );
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rowData, sortKey, sortDir]);

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to manage vendors.
      </NoOrganisationNotice>
    );
  }

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
          renderRowActions={row => (
            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={() => setEditingVendor(row)}
                className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                aria-label='Edit vendor'
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
                  if (window.confirm(`Delete vendor "${row.name}"?`)) {
                    deleteMutation.mutate(row.id);
                  }
                }}
                className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
                aria-label='Delete vendor'
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
          onRowClick={row => setEditingVendor(row)}
          footer={
            <PaginationFooter
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
          emptyMessage={isLoading ? 'Loading…' : 'No vendors found.'}
        />
        {error ? (
          <p className='text-sm text-red-600 dark:text-red-400'>
            {error instanceof Error ? error.message : 'Failed to load vendors'}
          </p>
        ) : null}
      </div>
      <AddVendorDrawer
        open={addVendorOpen || Boolean(editingVendor)}
        onClose={() => {
          setAddVendorOpen(false);
          setEditingVendor(null);
        }}
        initialVendor={
          editingVendor
            ? {
                name: editingVendor.name,
                email: editingVendor.email === '—' ? '' : editingVendor.email,
                phone:
                  editingVendor.contact === '—' ? '' : editingVendor.contact,
                address: undefined,
              }
            : null
        }
        onSaved={payload => {
          if (editingVendor) {
            updateMutation.mutate({ vendorId: editingVendor.id, payload });
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

export default Vendors;
