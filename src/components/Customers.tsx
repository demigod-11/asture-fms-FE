import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ListPage from '@/components/ListPage';
import RowActions from '@/components/RowActions';
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
import { displayPublicId } from '@/utils/displayId';
import { getApiErrorMessage } from '@/utils/apiError';

interface CustomerRow {
  id: string;
  publicId: string;
  name: string;
  contact: string;
  billingAddress: string;
}

function customerToRow(c: CustomerResponse): CustomerRow {
  return {
    id: c.id,
    publicId: displayPublicId(c.public_id),
    name: displayPublicId(c.name),
    contact: [c.email, c.phone].filter(Boolean).join(' / ') || '—',
    billingAddress: c.billing_address ?? '—',
  };
}

const CUSTOMER_COLUMNS = [
  { id: 'id', header: 'ID' as const, cell: (row: CustomerRow) => row.publicId },
  { id: 'name', header: 'Name' as const, cell: (row: CustomerRow) => row.name },
  {
    id: 'contact',
    header: 'Contact' as const,
    cell: (row: CustomerRow) => row.contact,
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
  const [pageSize, setPageSize] = useState(20);
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
    ['customers', organisationId, page, pageSize, search],
    () =>
      listCustomers(organisationId, {
        page,
        page_size: pageSize,
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
          ? (aVal as number) - (bVal as number)
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
      <ListPage<CustomerRow>
        search={{
          value: search,
          onChange: v => {
            setSearch(v);
            setPage(1);
          },
        }}
        primaryAction={{
          label: 'New customer',
          onClick: () => setAddCustomerOpen(true),
        }}
        data={sortedData}
        getRowId={row => row.id}
        columns={CUSTOMER_COLUMNS}
        selectionLabel='customers'
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
            onEdit={() => setEditingCustomer(row)}
            onDelete={() => deleteMutation.mutate(row.id)}
            confirmMessage={`Delete customer "${row.name}"?`}
            editLabel='Edit customer'
            deleteLabel='Delete customer'
          />
        )}
        onRowClick={row => setEditingCustomer(row)}
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
          error ? getApiErrorMessage(error, 'Failed to load customers') : null
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
                name: editingCustomer.name === '—' ? '' : editingCustomer.name,
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
            ? getApiErrorMessage(
                createMutation.error ?? updateMutation.error,
                'Failed to save customer'
              )
            : undefined
        }
      />
    </>
  );
};

export default Customers;
