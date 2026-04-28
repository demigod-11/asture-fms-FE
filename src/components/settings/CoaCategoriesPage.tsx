import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import SelectableDataTable from '@/components/SelectableDataTable';
import ListPageToolbar from '@/components/ListPageToolbar';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import { useProfile } from '@/contexts/ProfileContext';
import {
  getCategoryTree,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type COACategoryResponse,
} from '@/services/coaCategoriesApi';

interface CategoryRow {
  id: string;
  name: string;
  parentName: string;
  displayOrder: number;
  isSystem: boolean;
}

function toRow(
  c: COACategoryResponse,
  parentMap: Map<string, string>
): CategoryRow {
  return {
    id: c.id,
    name: c.name,
    parentName: parentMap.get(c.parent_category_id ?? '') ?? '—',
    displayOrder: c.display_order ?? 0,
    isSystem: c.is_system_category ?? false,
  };
}

const CoaCategoriesPage: React.FC = () => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<COACategoryResponse | null>(null);
  const [formName, setFormName] = useState('');
  const [formParentId, setFormParentId] = useState<string | null>(null);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: treeData } = useQuery(
    ['coa-categories-tree', organisationId],
    () => getCategoryTree(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const { data: listData = [] } = useQuery(
    ['coa-categories-list', organisationId],
    () => listCategories(organisationId, { include_system: true }),
    { enabled: Boolean(organisationId) }
  );

  const createMutation = useMutation(
    () =>
      createCategory(organisationId, {
        name: formName.trim(),
        parent_category_id: formParentId || null,
        display_order: formDisplayOrder,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coa-categories-tree', organisationId]);
        queryClient.invalidateQueries(['coa-categories-list', organisationId]);
        setAddOpen(false);
        setFormName('');
        setFormParentId(null);
        setFormDisplayOrder(0);
        setSaveError(null);
      },
      onError: (e: Error) => setSaveError(e.message),
    }
  );

  const updateMutation = useMutation(
    () =>
      updateCategory(organisationId, editingCategory!.id, {
        name: formName.trim(),
        parent_category_id: formParentId,
        display_order: formDisplayOrder,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coa-categories-tree', organisationId]);
        queryClient.invalidateQueries(['coa-categories-list', organisationId]);
        setEditingCategory(null);
        setSaveError(null);
      },
      onError: (e: Error) => setSaveError(e.message),
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deleteCategory(organisationId, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coa-categories-tree', organisationId]);
        queryClient.invalidateQueries(['coa-categories-list', organisationId]);
      },
    }
  );

  const categories = treeData?.categories ?? listData;
  const parentMap = new Map<string, string>();
  categories.forEach((c: COACategoryResponse) => parentMap.set(c.id, c.name));

  const flatList =
    Array.isArray(listData) && listData.length > 0 ? listData : categories;
  const filtered = search
    ? flatList.filter((c: COACategoryResponse) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : flatList;
  const rowData: CategoryRow[] = filtered.map((c: COACategoryResponse) =>
    toRow(c, parentMap)
  );

  React.useEffect(() => {
    if (editingCategory) {
      setFormName(editingCategory.name);
      setFormParentId(editingCategory.parent_category_id ?? null);
      setFormDisplayOrder(editingCategory.display_order ?? 0);
    }
  }, [editingCategory]);

  if (!organisationId) {
    return (
      <NoOrganisationNotice>No organisation in context.</NoOrganisationNotice>
    );
  }

  const columns: import('@/components/SelectableDataTable').SelectableDataTableColumn<CategoryRow>[] =
    [
      { id: 'name', header: 'Name', cell: r => r.name, sortable: true },
      {
        id: 'parentName',
        header: 'Parent',
        cell: r => r.parentName,
        sortable: false,
      },
      {
        id: 'displayOrder',
        header: 'Order',
        cell: r => String(r.displayOrder),
        sortable: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: r => (
          <div className='flex items-center gap-1'>
            <button
              type='button'
              onClick={() => {
                const cat = flatList.find(
                  (c: COACategoryResponse) => c.id === r.id
                );
                if (cat) setEditingCategory(cat);
              }}
              className='p-1.5 text-gray-400 hover:text-[#073E60] hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
              aria-label='Edit category'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </button>
            {!r.isSystem && (
              <button
                type='button'
                onClick={() => {
                  if (window.confirm(`Delete category "${r.name}"?`)) {
                    deleteMutation.mutate(r.id);
                  }
                }}
                className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
                aria-label='Delete category'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>
            )}
          </div>
        ),
        sortable: false,
      },
    ];

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel='All'
        primaryLabel='New category'
        onPrimaryClick={() => {
          setAddOpen(true);
          setFormName('');
          setFormParentId(null);
          setFormDisplayOrder(0);
          setSaveError(null);
        }}
      />
      <SelectableDataTable<CategoryRow>
        data={rowData}
        getRowId={r => r.id}
        columns={columns}
        selectionLabel='categories'
        tableMinWidth='640px'
        emptyMessage='No categories found.'
      />

      {(addOpen || editingCategory) && (
        <>
          <div
            className='fixed inset-0 z-[100] bg-black/50'
            onClick={() => {
              setAddOpen(false);
              setEditingCategory(null);
            }}
            aria-hidden
          />
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              {editingCategory ? 'Edit category' : 'New category'}
            </h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                setSaveError(null);
                if (editingCategory) {
                  updateMutation.mutate();
                } else {
                  createMutation.mutate();
                }
              }}
              className='space-y-4'
            >
              <div>
                <label className='form-label text-gray-900 dark:text-gray-100'>
                  Name <span className='text-error-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder='e.g. Revenue'
                  className='input-field w-full pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600'
                  required
                />
              </div>
              <div>
                <label className='form-label text-gray-900 dark:text-gray-100'>
                  Parent category
                </label>
                <select
                  value={formParentId ?? ''}
                  onChange={e => setFormParentId(e.target.value || null)}
                  className='input-field w-full pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600'
                >
                  <option value=''>None (top-level)</option>
                  {flatList
                    .filter(
                      (c: COACategoryResponse) =>
                        !editingCategory || c.id !== editingCategory.id
                    )
                    .map((c: COACategoryResponse) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className='form-label text-gray-900 dark:text-gray-100'>
                  Display order
                </label>
                <input
                  type='number'
                  min={0}
                  value={formDisplayOrder}
                  onChange={e =>
                    setFormDisplayOrder(parseInt(e.target.value, 10) || 0)
                  }
                  className='input-field w-full pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600'
                />
              </div>
              {saveError && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {saveError}
                </p>
              )}
              <div className='flex justify-end gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => {
                    setAddOpen(false);
                    setEditingCategory(null);
                  }}
                  className='px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-xl'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                  className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] rounded-xl disabled:opacity-50'
                >
                  {editingCategory
                    ? updateMutation.isLoading
                      ? 'Saving…'
                      : 'Save changes'
                    : createMutation.isLoading
                      ? 'Saving…'
                      : 'Create category'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default CoaCategoriesPage;
