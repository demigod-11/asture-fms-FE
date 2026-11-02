import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ListPage from '@/components/ListPage';
import RowActions from '@/components/RowActions';
import { useProfile } from '@/contexts/ProfileContext';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import {
  listTags,
  createTag,
  updateTag,
  deleteTag,
  type TagResponse,
} from '@/services/tagsApi';

interface TagRow {
  id: string;
  code: string;
  name: string;
  description: string;
}

function tagToRow(t: TagResponse): TagRow {
  return {
    id: t.id,
    code: t.code,
    name: t.name,
    description: t.description ?? '',
  };
}

const TagsPage: React.FC = () => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [addOpen, setAddOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagRow | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery(
    ['tags', organisationId, page, pageSize, search],
    () =>
      listTags(organisationId, {
        page,
        page_size: pageSize,
        code: search || undefined,
        name: search || undefined,
      }),
    { enabled: Boolean(organisationId) }
  );

  const createMutation = useMutation(
    (body: { code: string; name: string; description?: string | null }) =>
      createTag(organisationId, {
        code: body.code,
        name: body.name,
        description: body.description ?? null,
        is_system_tag: false as const,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tags', organisationId]);
        setAddOpen(false);
        setNewCode('');
        setNewName('');
        setNewDescription('');
        setSaveError(null);
      },
      onError: (err: Error) => setSaveError(err.message),
    }
  );

  const updateMutation = useMutation(
    ({
      tagId,
      body,
    }: {
      tagId: string;
      body: { name: string; description?: string | null };
    }) =>
      updateTag(organisationId, tagId, {
        name: body.name,
        description: body.description ?? null,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tags', organisationId]);
        setEditingTag(null);
      },
      onError: (err: Error) => setSaveError(err.message),
    }
  );

  const deleteMutation = useMutation(
    (tagId: string) => deleteTag(organisationId, tagId),
    {
      onSuccess: () => queryClient.invalidateQueries(['tags', organisationId]),
    }
  );

  const totalPages = listData?.total_pages ?? 0;
  const rowData = useMemo(
    () => (listData?.items ?? []).map(tagToRow),
    [listData]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rowData;
    return [...rowData].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortKey];
      const bVal = (b as unknown as Record<string, unknown>)[sortKey];
      const cmp = String(aVal ?? '').localeCompare(
        String(bVal ?? ''),
        undefined,
        { numeric: true }
      );
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rowData, sortKey, sortDir]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    createMutation.mutate({
      code: newCode.trim(),
      name: newName.trim(),
      description: newDescription.trim() ? newDescription.trim() : null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    setSaveError(null);
    updateMutation.mutate({
      tagId: editingTag.id,
      body: {
        name: newName.trim(),
        description: newDescription.trim() ? newDescription.trim() : null,
      },
    });
  };

  React.useEffect(() => {
    if (editingTag) {
      setNewName(editingTag.name);
      setNewDescription(editingTag.description);
    }
  }, [editingTag]);

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to manage tags.
      </NoOrganisationNotice>
    );
  }

  const columns = [
    {
      id: 'code' as const,
      header: 'Code' as const,
      cell: (row: TagRow) => row.code,
    },
    {
      id: 'name' as const,
      header: 'Name' as const,
      cell: (row: TagRow) => row.name,
    },
    {
      id: 'description' as const,
      header: 'Description' as const,
      cell: (row: TagRow) => row.description || '—',
    },
  ];

  return (
    <div className='space-y-4'>
      <ListPage<TagRow>
        search={{
          value: search,
          onChange: v => {
            setSearch(v);
            setPage(1);
          },
        }}
        primaryAction={{
          label: 'New tag',
          onClick: () => setAddOpen(true),
        }}
        data={sortedData}
        getRowId={row => row.id}
        columns={columns}
        selectionLabel='tags'
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
            onEdit={() => setEditingTag(row)}
            onDelete={() => deleteMutation.mutate(row.id)}
            confirmMessage={`Delete tag "${row.name}"?`}
            editLabel='Edit tag'
            deleteLabel='Delete tag'
          />
        )}
        onRowClick={row => setEditingTag(row)}
        onBulkDelete={ids => {
          void Promise.all(ids.map(id => deleteTag(organisationId, id))).then(
            () => queryClient.invalidateQueries(['tags', organisationId])
          );
        }}
        bulkDeleteConfirmMessage='Delete the selected tags?'
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
          error instanceof Error
            ? error.message
            : error
              ? 'Failed to load tags'
              : null
        }
        emptyMessage='No tags found.'
      />

      {(addOpen || editingTag) && (
        <>
          <div
            className='fixed inset-0 z-[100] bg-black/50'
            onClick={() => {
              setAddOpen(false);
              setEditingTag(null);
            }}
            aria-hidden
          />
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              {editingTag ? 'Edit tag' : 'New tag'}
            </h2>
            <form
              onSubmit={editingTag ? handleEditSubmit : handleAddSubmit}
              className='space-y-4'
            >
              <div>
                <label className='form-label text-gray-900 dark:text-gray-100'>
                  Code <span className='text-error-500'>*</span>
                </label>
                <input
                  type='text'
                  value={editingTag ? editingTag.code : newCode}
                  onChange={e => !editingTag && setNewCode(e.target.value)}
                  placeholder='e.g. FEE'
                  className='input-field w-full pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600'
                  required
                  readOnly={Boolean(editingTag)}
                />
              </div>
              <div>
                <label className='form-label text-gray-900 dark:text-gray-100'>
                  Name <span className='text-error-500'>*</span>
                </label>
                <input
                  type='text'
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder='e.g. Fee'
                  className='input-field w-full pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600'
                  required
                />
              </div>
              <div>
                <label className='form-label text-gray-900 dark:text-gray-100'>
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder='Optional'
                  rows={2}
                  className='input-field w-full pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 resize-none'
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
                    setEditingTag(null);
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
                  {editingTag
                    ? updateMutation.isLoading
                      ? 'Saving…'
                      : 'Save changes'
                    : createMutation.isLoading
                      ? 'Saving…'
                      : 'Create tag'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsPage;
