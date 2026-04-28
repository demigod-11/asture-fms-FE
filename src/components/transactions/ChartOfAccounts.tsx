import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Pencil, Trash2, BarChart3 } from 'lucide-react';
import ListPageToolbar from '@/components/ListPageToolbar';
import SelectableDataTable from '@/components/SelectableDataTable';
import PaginationFooter from '@/components/PaginationFooter';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import AddChartOfAccountDrawer, {
  type AddChartOfAccountPayload,
} from '@/components/AddChartOfAccountDrawer';
import { useProfile } from '@/contexts/ProfileContext';
import {
  listCoas,
  createCoa,
  updateCoa,
  deactivateCoa,
  getCoaUsage,
  type ChartOfAccountResponse,
} from '@/services/coaApi';
import {
  getCategoryTree,
  type COACategoryResponse,
} from '@/services/coaCategoriesApi';

interface ChartAccountRow {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  description: string;
  status: string;
}

const PAGE_SIZE = 20;

function coaToRow(
  coa: ChartOfAccountResponse,
  categoryMap: Map<string, string>
): ChartAccountRow {
  return {
    id: coa.id,
    accountNumber: coa.code,
    accountName: coa.name,
    accountType: categoryMap.get(coa.category_id) ?? coa.category_id,
    description: coa.description ?? '',
    status: coa.status,
  };
}

function flattenCategories(
  categories: COACategoryResponse[]
): Map<string, string> {
  const map = new Map<string, string>();
  function visit(list: COACategoryResponse[]) {
    for (const c of list) {
      map.set(c.id, c.name);
    }
  }
  visit(categories);
  return map;
}

const ChartOfAccounts: React.FC = () => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editingCoa, setEditingCoa] = useState<ChartOfAccountResponse | null>(
    null
  );
  const [usageCoaId, setUsageCoaId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    ['coa', organisationId, page, search],
    () =>
      listCoas(organisationId, {
        page,
        page_size: PAGE_SIZE,
        name: search || undefined,
        code: search || undefined,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: treeData } = useQuery(
    ['coa-categories-tree', organisationId],
    () => getCategoryTree(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const createMutation = useMutation(
    (body: AddChartOfAccountPayload) =>
      createCoa(organisationId, {
        name: body.name,
        code: body.code,
        category_id: body.category_id,
        description: body.description ?? null,
        status: body.status ?? 'active',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coa', organisationId]);
        setAddDrawerOpen(false);
      },
    }
  );

  const updateMutation = useMutation(
    ({ coaId, body }: { coaId: string; body: AddChartOfAccountPayload }) =>
      updateCoa(organisationId, coaId, {
        name: body.name,
        code: body.code,
        category_id: body.category_id,
        description: body.description ?? null,
        status: body.status ?? 'active',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coa', organisationId]);
        setEditingCoa(null);
      },
    }
  );

  const deactivateMutation = useMutation(
    (coaId: string) => deactivateCoa(organisationId, coaId),
    {
      onSuccess: () => queryClient.invalidateQueries(['coa', organisationId]),
    }
  );

  const { data: usageData } = useQuery(
    ['coa-usage', organisationId, usageCoaId],
    () => getCoaUsage(organisationId, usageCoaId!),
    { enabled: Boolean(organisationId && usageCoaId) }
  );

  const categoryMap = useMemo(() => {
    return flattenCategories(treeData?.categories ?? []);
  }, [treeData]);

  const totalPages = listData?.total_pages ?? 0;
  const items = listData?.items ?? [];
  const rowData = useMemo(
    () => items.map(coa => coaToRow(coa, categoryMap)),
    [items, categoryMap]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rowData;
    return [...rowData].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rowData, sortKey, sortDir]);

  const columns: import('@/components/SelectableDataTable').SelectableDataTableColumn<ChartAccountRow>[] =
    [
      {
        id: 'accountNumber',
        header: 'Account Number',
        cell: r => r.accountNumber,
        sortable: true,
      },
      {
        id: 'accountName',
        header: 'Account Name',
        cell: r => r.accountName,
        sortable: true,
      },
      {
        id: 'accountType',
        header: 'Account Type',
        cell: r => r.accountType,
        sortable: true,
      },
      {
        id: 'description',
        header: 'Description',
        cell: r => r.description || '—',
        sortable: false,
      },
      {
        id: 'status',
        header: 'Status',
        cell: r => (
          <span
            className={
              r.status === 'active'
                ? 'badge badge-success'
                : 'badge bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }
          >
            {r.status}
          </span>
        ),
        sortable: true,
      },
    ];

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to manage chart of
        accounts.
      </NoOrganisationNotice>
    );
  }

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search'
        filterLabel='All'
        primaryLabel='New account'
        onPrimaryClick={() => setAddDrawerOpen(true)}
      />
      {error ? (
        <p className='text-sm text-red-600 dark:text-red-400'>
          {error instanceof Error
            ? error.message
            : 'Failed to load chart of accounts'}
        </p>
      ) : null}
      <SelectableDataTable<ChartAccountRow>
        data={sortedData}
        getRowId={r => r.id}
        columns={columns}
        selectionLabel='accounts'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
        renderRowActions={row => {
          const coa = items.find(c => c.id === row.id);
          return (
            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={() => coa && setEditingCoa(coa)}
                className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                aria-label='Edit account'
              >
                <Pencil className='h-4 w-4' />
              </button>
              <button
                type='button'
                onClick={() => setUsageCoaId(row.id)}
                className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                aria-label='View usage'
              >
                <BarChart3 className='h-4 w-4' />
              </button>
              {coa?.status === 'active' && (
                <button
                  type='button'
                  onClick={() => {
                    if (
                      window.confirm(`Deactivate account "${row.accountName}"?`)
                    ) {
                      deactivateMutation.mutate(row.id);
                    }
                  }}
                  className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
                  aria-label='Deactivate account'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              )}
            </div>
          );
        }}
        tableMinWidth='640px'
        emptyMessage='No accounts found.'
        footer={
          <PaginationFooter
            page={page}
            totalPages={totalPages || 1}
            onPageChange={setPage}
          />
        }
      />
      {isLoading && (
        <p className='text-sm text-gray-500 dark:text-gray-400'>Loading…</p>
      )}
      <AddChartOfAccountDrawer
        open={addDrawerOpen || Boolean(editingCoa)}
        onClose={() => {
          setAddDrawerOpen(false);
          setEditingCoa(null);
        }}
        initialCoa={
          editingCoa
            ? {
                id: editingCoa.id,
                name: editingCoa.name,
                code: editingCoa.code,
                category_id: editingCoa.category_id,
                description: editingCoa.description ?? '',
                status: editingCoa.status as 'active' | 'inactive',
              }
            : null
        }
        onSaved={(payload, editId) => {
          if (editId) {
            updateMutation.mutate({ coaId: editId, body: payload });
          } else {
            createMutation.mutate(payload);
          }
        }}
        categories={treeData?.categories ?? []}
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

      {usageCoaId && (
        <>
          <div
            className='fixed inset-0 z-[100] bg-black/50'
            onClick={() => setUsageCoaId(null)}
            aria-hidden
          />
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              Account usage
            </h3>
            {usageData ? (
              <ul className='space-y-1 text-sm text-gray-700 dark:text-gray-300'>
                <li>Products: {usageData.products}</li>
                <li>Invoices: {usageData.invoices}</li>
                <li>Expenses: {usageData.expenses}</li>
                <li>
                  Purchase ledger entries: {usageData.purchase_ledger_entries}
                </li>
                <li className='font-medium pt-2'>Total: {usageData.total}</li>
              </ul>
            ) : (
              <p className='text-sm text-gray-500'>Loading…</p>
            )}
            <div className='mt-4 flex justify-end'>
              <button
                type='button'
                onClick={() => setUsageCoaId(null)}
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-xl'
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartOfAccounts;
