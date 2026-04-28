import React from 'react';
import ListPageToolbar from '@/components/ListPageToolbar';
import SelectableDataTable, {
  type SelectableDataTableColumn,
} from '@/components/SelectableDataTable';
import PaginationFooter from '@/components/PaginationFooter';

export interface ListPageWithPaginationProps<RowT> {
  // Toolbar
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterLabel?: string;
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  filterSlot?: React.ReactNode;

  // Table
  data: RowT[];
  getRowId: (row: RowT) => string;
  columns: SelectableDataTableColumn<RowT>[];
  selectionLabel: string;
  tableMinWidth?: string;
  sortKey: string;
  sortDir: 'asc' | 'desc';
  onSort: (key: string, dir: 'asc' | 'desc') => void;
  renderRowActions?: (row: RowT) => React.ReactNode;
  onRowClick?: (row: RowT) => void;

  // Pagination
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  // Status
  isLoading?: boolean;
  errorMessage?: string | null;
  loadingMessage?: string;
  emptyMessage?: string;
}

function ListPageWithPagination<RowT>({
  searchValue,
  onSearchChange,
  filterLabel,
  primaryLabel,
  onPrimaryClick,
  filterSlot,
  data,
  getRowId,
  columns,
  selectionLabel,
  tableMinWidth,
  sortKey,
  sortDir,
  onSort,
  renderRowActions,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  isLoading,
  errorMessage,
  loadingMessage = 'Loading…',
  emptyMessage,
}: ListPageWithPaginationProps<RowT>): React.JSX.Element {
  const effectiveEmptyMessage =
    emptyMessage ?? (isLoading ? loadingMessage : `No ${selectionLabel}.`);

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        filterLabel={filterLabel}
        primaryLabel={primaryLabel}
        onPrimaryClick={onPrimaryClick}
        filterSlot={filterSlot}
      />
      {errorMessage ? (
        <p className='text-sm text-red-600 dark:text-red-400'>{errorMessage}</p>
      ) : null}
      <SelectableDataTable<RowT>
        data={isLoading ? [] : data}
        getRowId={getRowId}
        columns={columns}
        selectionLabel={selectionLabel}
        tableMinWidth={tableMinWidth}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        renderRowActions={renderRowActions}
        onRowClick={onRowClick}
        emptyMessage={effectiveEmptyMessage}
        footer={
          <PaginationFooter
            page={page}
            totalPages={totalPages || 1}
            onPageChange={onPageChange}
          />
        }
      />
      {isLoading && (
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          {loadingMessage}
        </p>
      )}
    </div>
  );
}

export default ListPageWithPagination;
