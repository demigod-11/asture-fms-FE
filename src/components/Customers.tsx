import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ListPageWithPagination from '@/components/ListPageWithPagination';
import AddCustomerDrawer, {
  type AddCustomerPayload,
} from '@/components/AddCustomerDrawer';
import { useProfile } from '@/contexts/ProfileContext';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type CustomerResponse,
} from '@/services/customersApi';

interface CustomerRow {
  id: string;
  publicId: string;
  name: string;
  primaryContact: string;
  contact: string;
  segment: string;
  billingAddress: string;
}

function customerToRow(c: CustomerResponse): CustomerRow {
  return {
    id: c.id,
    publicId: c.public_id,
    name: c.name,
    primaryContact: c.name,
    contact: [c.email, c.phone].filter(Boolean).join(' / ') || '—',
    segment: '—',
    billingAddress: c.billing_address ?? '—',
  };
}

const CUSTOMER_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: CustomerRow) => row.publicId },
  { id: 'name', header: 'Name' as const, cell: (row: CustomerRow) => row.name },
  {
    id: 'primaryContact',
    header: 'Primary Contact' as const,
    cell: (row: CustomerRow) => row.primaryContact,
  },
  {
    id: 'contact',
    header: 'Contact' as const,
    cell: (row: CustomerRow) => row.contact,
  },
  {
    id: 'segment',
    header: 'Segment' as const,
    cell: (row: CustomerRow) => row.segment,
  },
  {
    id: 'billingAddress',
    header: 'Billing Address' as const,
    cell: (row: CustomerRow) => row.billingAddress || '—',
  },
];

const Customers: React.FC = () => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const [searchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get('customer_id') ?? null;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(
    null
  );
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const createMutation = useMutation(
    (payload: AddCustomerPayload) =>
      createCustomer(organisationId, {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        billing_address: payload.billing_address ?? null,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customers', organisationId]);
        setAddCustomerOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    (customerId: string) => deleteCustomer(organisationId, customerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customers', organisationId]);
      },
    }
  );

  const updateMutation = useMutation(
    ({
      customerId,
      payload,
    }: {
      customerId: string;
      payload: AddCustomerPayload;
    }) =>
      updateCustomer(organisationId, customerId, {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        billing_address: payload.billing_address ?? null,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customers', organisationId]);
        setEditingCustomer(null);
      },
    }
  );

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    ['customers', organisationId, page, search],
    () =>
      listCustomers(organisationId, {
        page,
        page_size: 20,
        search: search || undefined,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: deepLinkedCustomer } = useQuery(
    ['customer', organisationId, customerIdFromUrl],
    () => getCustomer(organisationId, customerIdFromUrl!),
    { enabled: Boolean(organisationId && customerIdFromUrl) }
  );

  useEffect(() => {
    if (!deepLinkedCustomer) return;
    setEditingCustomer(customerToRow(deepLinkedCustomer));
  }, [deepLinkedCustomer]);

  const totalPages = listData?.total_pages ?? 0;
  const rowData = useMemo(
    () => (listData?.items ?? []).map(customerToRow),
    [listData]
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
        No organisation in context. Complete onboarding to manage customers.
      </NoOrganisationNotice>
    );
  }

  return (
    <>
      <ListPageWithPagination<CustomerRow>
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel='All Types'
        primaryLabel='New customer'
        onPrimaryClick={() => setAddCustomerOpen(true)}
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
        renderRowActions={row => (
          <div className='flex items-center gap-1'>
            <button
              type='button'
              onClick={() => setEditingCustomer(row)}
              className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
              aria-label='Edit customer'
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
                if (window.confirm(`Delete customer "${row.name}"?`)) {
                  deleteMutation.mutate(row.id);
                }
              }}
              className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
              aria-label='Delete customer'
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
        onRowClick={row => setEditingCustomer(row)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
        errorMessage={
          error instanceof Error
            ? error.message
            : error
              ? 'Failed to load customers'
              : null
        }
        emptyMessage='No customers found.'
      />

      <AddCustomerDrawer
        open={addCustomerOpen || Boolean(editingCustomer)}
        onClose={() => {
          setAddCustomerOpen(false);
          setEditingCustomer(null);
        }}
        initialCustomer={
          editingCustomer
            ? {
                name: editingCustomer.name,
                email: editingCustomer.contact.includes('@')
                  ? (editingCustomer.contact.split('/')[0] ?? '').trim()
                  : '',
                phone: editingCustomer.contact.includes('/')
                  ? editingCustomer.contact.split('/')[1]?.trim() || ''
                  : editingCustomer.contact === '—'
                    ? ''
                    : editingCustomer.contact,
                billing_address:
                  editingCustomer.billingAddress === '—'
                    ? undefined
                    : editingCustomer.billingAddress,
              }
            : null
        }
        onSaved={payload => {
          if (editingCustomer) {
            updateMutation.mutate({ customerId: editingCustomer.id, payload });
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

export default Customers;
