import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

export interface SelectableDataTableContext {
  /** True when row selection checkboxes are visible (after user has selected at least one row). */
  showCheckboxes: boolean;
}

export interface SelectableDataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  /** Second arg is optional context (e.g. showCheckboxes) so cells can hide until selection is active. */
  cell: (row: T, context?: SelectableDataTableContext) => React.ReactNode;
  headerClassName?: string;
  /** Optional class for the body cell (e.g. text-right for numeric columns). */
  cellClassName?: string;
  /** Set false to hide sort arrow for this column. Default true when onSort is provided. */
  sortable?: boolean;
}

export interface SelectableDataTableProps<T> {
  /** Table data */
  data: T[];
  /** Get unique id for each row */
  getRowId: (row: T) => string;
  /** Column definitions (order matches display) */
  columns: SelectableDataTableColumn<T>[];
  /** Label for selection (e.g. "invoices", "customers") - used for aria-labels */
  selectionLabel: string;
  /** Optional: render actions cell (e.g. row menu). Shown as last column. */
  renderRowActions?: (row: T) => React.ReactNode;
  /** Optional: table min width for horizontal scroll */
  tableMinWidth?: string;
  /** Optional: footer content (e.g. pagination) */
  footer?: React.ReactNode;
  /** Optional: callback when selection changes */
  onSelectionChange?: (selectedIds: Set<string>) => void;
  /** Optional: message when data is empty (renders one row with colspan) */
  emptyMessage?: string;
  /** Current sort column id. When set with onSort, column headers show sort arrows. */
  sortKey?: string;
  /** Current sort direction. */
  sortDir?: 'asc' | 'desc';
  /** Called when user clicks a column header to sort. */
  onSort?: (key: string, dir: 'asc' | 'desc') => void;
  /** Optional footer row: one cell per column (same order as columns). Renders as <tfoot> for alignment with data. */
  footerCells?: React.ReactNode[];
}

/**
 * Reusable data table with row selection.
 * Checkbox column is hidden until at least one row is selected (via row double-click).
 * Once visible: header checkbox = select all, row checkboxes = toggle individual.
 */
function SelectableDataTable<T>({
  data,
  getRowId,
  columns,
  selectionLabel,
  renderRowActions,
  tableMinWidth = '640px',
  footer,
  onSelectionChange,
  emptyMessage,
  sortKey,
  sortDir = 'asc',
  onSort,
  footerCells,
}: SelectableDataTableProps<T>) {
  const handleHeaderClick = (colId: string, sortable?: boolean) => {
    if (!onSort || sortable === false) return;
    const nextDir = sortKey === colId && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(colId, nextDir);
  };
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allIds = new Set(data.map(row => getRowId(row)));
  const allSelected = data.length > 0 && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0;
  const showCheckboxes = someSelected;

  useEffect(() => {
    const el = selectAllRef.current;
    if (el && showCheckboxes) el.indeterminate = someSelected && !allSelected;
  }, [showCheckboxes, someSelected, allSelected]);

  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRowClick = (id: string) => {
    if (!showCheckboxes) {
      setSelectedIds(new Set([id]));
      return;
    }
    toggleSelectOne(id);
  };

  return (
    <div className='bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-card'>
      <div className='overflow-x-auto'>
        <table
          className='w-full text-sm'
          style={{ minWidth: tableMinWidth }}
          role='grid'
          aria-label={selectionLabel}
        >
          <thead>
            <tr className='bg-gray-50/80 text-left'>
              {showCheckboxes && (
                <th className='py-3 px-4 w-10'>
                  <input
                    ref={selectAllRef}
                    type='checkbox'
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className='rounded border-gray-300 accent-[#073E60] text-[#073E60] focus:ring-2 focus:ring-[#073E60] focus:ring-offset-0'
                    aria-label={`Select all ${selectionLabel}`}
                  />
                </th>
              )}
              {columns.map(col => {
                const sortable = col.sortable !== false && onSort != null;
                const isSorted = sortKey === col.id;
                const isRightAligned =
                  col.headerClassName?.includes('text-right');
                return (
                  <th
                    key={col.id}
                    className={`table-header-cell py-3 px-4 ${col.headerClassName ?? ''}`}
                  >
                    {sortable ? (
                      <button
                        type='button'
                        onClick={() => handleHeaderClick(col.id, col.sortable)}
                        className={`inline-flex items-center gap-1.5 w-full hover:text-gray-900 ${isRightAligned ? 'justify-end text-right' : 'text-left'}`}
                      >
                        {col.header}
                        {isSorted ? (
                          sortDir === 'asc' ? (
                            <ChevronUp
                              className='h-4 w-4 shrink-0'
                              aria-hidden
                            />
                          ) : (
                            <ChevronDown
                              className='h-4 w-4 shrink-0'
                              aria-hidden
                            />
                          )
                        ) : (
                          <ArrowUpDown
                            className='h-4 w-4 shrink-0 text-gray-400'
                            aria-hidden
                          />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
              {renderRowActions && (
                <th className='py-3 w-10' aria-label='Actions' />
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && emptyMessage != null ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showCheckboxes ? 1 : 0) +
                    (renderRowActions ? 1 : 0)
                  }
                  className='py-12 text-center text-gray-500'
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(row => {
                const id = getRowId(row);
                const selected = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    onDoubleClick={() => handleRowClick(id)}
                    className={`border-b border-gray-100 last:border-0 transition-colors cursor-pointer ${
                      selected ? 'bg-primary-50/80' : 'hover:bg-gray-50/60'
                    }`}
                  >
                    {showCheckboxes && (
                      <td
                        className='py-3 px-4'
                        onClick={e => e.stopPropagation()}
                      >
                        <input
                          type='checkbox'
                          checked={selected}
                          onChange={() => toggleSelectOne(id)}
                          className='rounded border-gray-300 accent-[#073E60] text-[#073E60] focus:ring-2 focus:ring-[#073E60] focus:ring-offset-0'
                          aria-label={`Select ${selectionLabel} ${id}`}
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td
                        key={col.id}
                        className={`py-3 px-4 ${col.id === 'id' ? 'table-cell-id' : 'table-cell-body'} ${col.cellClassName ?? ''}`}
                      >
                        {col.cell(row, { showCheckboxes })}
                      </td>
                    ))}
                    {renderRowActions && (
                      <td
                        className='py-3 px-4'
                        onClick={e => e.stopPropagation()}
                      >
                        {renderRowActions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
          {footerCells != null && footerCells.length === columns.length && (
            <tfoot>
              <tr className='border-t border-gray-200/80 bg-gray-50/80 font-semibold text-gray-900'>
                {showCheckboxes && <td className='py-3 px-4' />}
                {footerCells.map((cell, i) => (
                  <td
                    key={i}
                    className={`py-3 px-4 ${columns[i]?.cellClassName ?? ''}`}
                  >
                    {cell}
                  </td>
                ))}
                {renderRowActions && <td className='py-3 px-4' />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {footer && (
        <div className='border-t border-gray-200/80 bg-gray-50/50'>
          {footer}
        </div>
      )}
    </div>
  );
}

export default SelectableDataTable;
