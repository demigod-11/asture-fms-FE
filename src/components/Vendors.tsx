import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ListPage from '@/components/ListPage';
import RowActions from '@/components/RowActions';
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
import { displayPublicId } from '@/utils/displayId';
import { getApiErrorMessage } from '@/utils/apiError';

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
    publicId: displayPublicId(v.public_id),
    name: displayPublicId(v.name),
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
  const [searchParams] = useSearchParams();
  const vendorIdFromUrl = searchParams.get('vendor_id') ?? null;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorRow | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    ['vendors', organisationId, page, pageSize, search],
    () =>
      listVendors(organisationId, {
        page,
        page_size: pageSize,
        search: search || undefined,
      }),
    { enabled: Boolean(organisationId) }
  );

  useEffect(() => {
    if (!vendorIdFromUrl || !listData?.items) return;
    const match = listData.items.find(v => v.id === vendorIdFromUrl);
    if (match) setEditingVendor(vendorToRow(match));
  }, [vendorIdFromUrl, listData]);

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
      <ListPage<VendorRow>
        search={{
          value: search,
          onChange: v => {
            setSearch(v);
            setPage(1);
          },
        }}
        primaryAction={{
          label: 'New vendor',
          onClick: () => setAddVendorOpen(true),
        }}
        data={sortedData}
        getRowId={row => row.id}
        columns={VENDOR_COLUMNS}
        selectionLabel='vendors'
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
            onEdit={() => setEditingVendor(row)}
            onDelete={() => deleteMutation.mutate(row.id)}
            confirmMessage={`Delete vendor "${row.name}"?`}
            editLabel='Edit vendor'
            deleteLabel='Delete vendor'
          />
        )}
        onRowClick={row => setEditingVendor(row)}
        onBulkDelete={ids => {
          void Promise.all(
            ids.map(id => deleteVendor(organisationId, id))
          ).then(() =>
            queryClient.invalidateQueries(['vendors', organisationId])
          );
        }}
        bulkDeleteConfirmMessage='Delete the selected vendors?'
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
          error ? getApiErrorMessage(error, 'Failed to load vendors') : null
        }
        emptyMessage='No vendors found.'
      />
      <AddVendorDrawer
        open={addVendorOpen || Boolean(editingVendor)}
        onClose={() => {
          setAddVendorOpen(false);
          setEditingVendor(null);
        }}
        initialVendor={
          editingVendor
            ? {
                name: editingVendor.name === '—' ? '' : editingVendor.name,
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
            ? getApiErrorMessage(
                createMutation.error ?? updateMutation.error,
                'Failed to save vendor'
              )
            : undefined
        }
      />
    </>
  );
};

export default Vendors;
