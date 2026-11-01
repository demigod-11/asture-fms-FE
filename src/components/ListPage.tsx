import React from 'react';
import ListPageToolbar from '@/components/ListPageToolbar';
import SelectableDataTable, {
  type SelectableDataTableColumn,
} from '@/components/SelectableDataTable';
import PaginationFooter from '@/components/PaginationFooter';
import DateFilterDropdown, {
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';

export type ListPageProps<T> = {
  data: T[];
  getRowId: (row: T) => string;
  columns: SelectableDataTableColumn<T>[];
  selectionLabel: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
  search: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  };
  dateFilter?: {
    state: DateFilterState;
    onChange: (s: DateFilterState) => void;
  };
  filterSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  primaryAction?: { label: string; to?: string; onClick?: () => void };
  showImportExport?: boolean;
  sort?: {
    key: string;
    dir: 'asc' | 'desc';
    onSort: (k: string, d: 'asc' | 'desc') => void;
  };
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  footerCells?: React.ReactNode[];
  tableMinWidth?: string;
  pagination?: {
    page: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (p: number) => void;
    onPageSizeChange: (n: number) => void;
  };
};

function ListPage<T>({
  data,
  getRowId,
  columns,
  selectionLabel,
  isLoading = false,
  errorMessage,
  emptyMessage,
  search,
  dateFilter,
  filterSlot,
  leftSlot,
  primaryAction,
  showImportExport = false,
  sort,
  onRowClick,
  rowActions,
  footerCells,
  tableMinWidth,
  pagination,
}: ListPageProps<T>): React.JSX.Element {
  const effectiveEmptyMessage = emptyMessage ?? `No ${selectionLabel}.`;

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        searchValue={search.value}
        onSearchChange={search.onChange}
        searchPlaceholder={search.placeholder}
        filterSlot={filterSlot}
        leftSlot={leftSlot}
        rightSlot={
          dateFilter ? (
            <DateFilterDropdown
              state={dateFilter.state}
              onStateChange={dateFilter.onChange}
            />
          ) : undefined
        }
        primaryLabel={primaryAction?.label}
        primaryTo={primaryAction?.to}
        onPrimaryClick={primaryAction?.onClick}
        showImportExport={showImportExport}
      />
      {errorMessage ? (
        <p className='text-sm text-red-600 dark:text-red-400'>{errorMessage}</p>
      ) : null}
      <SelectableDataTable<T>
        data={isLoading ? [] : data}
        isLoading={isLoading}
        getRowId={getRowId}
        columns={columns}
        selectionLabel={selectionLabel}
        tableMinWidth={tableMinWidth}
        sortKey={sort?.key}
        sortDir={sort?.dir}
        onSort={sort?.onSort}
        renderRowActions={rowActions}
        onRowClick={onRowClick}
        emptyMessage={effectiveEmptyMessage}
        footerCells={footerCells}
        footer={
          pagination ? (
            <PaginationFooter
              page={pagination.page}
              totalPages={pagination.totalPages || 1}
              onPageChange={pagination.onPageChange}
              pageSize={pagination.pageSize}
              onPageSizeChange={pagination.onPageSizeChange}
              showPerPageSelect
            />
          ) : undefined
        }
      />
    </div>
  );
}

export default ListPage;
export { ListPage };
