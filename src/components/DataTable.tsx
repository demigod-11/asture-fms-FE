import React from 'react';

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  headerClassName?: string;
  cell: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  getRowId: (row: T) => string;
  columns: DataTableColumn<T>[];
  /** Optional min width for horizontal scroll */
  tableMinWidth?: string;
  /** Optional message when data is empty */
  emptyMessage?: string;
  /** Optional footer row: array of cell content (first cell left-aligned, rest right-aligned with tabular-nums) */
  footerCells?: React.ReactNode[];
  /** Accessible label for the table */
  ariaLabel?: string;
}

/**
 * Reusable data table with consistent styling (card, header, rows).
 * Use for read-only tables (e.g. reports). For selectable/sortable lists use SelectableDataTable.
 */
function DataTable<T>({
  data,
  getRowId,
  columns,
  tableMinWidth = '640px',
  emptyMessage,
  footerCells,
  ariaLabel = 'Data table',
}: DataTableProps<T>) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 overflow-hidden shadow-card'>
      <div className='overflow-x-auto'>
        <table
          className='w-full text-sm'
          style={{ minWidth: tableMinWidth }}
          role='grid'
          aria-label={ariaLabel}
        >
          <thead>
            <tr className='bg-gray-50/80 dark:bg-gray-700/80 text-left text-gray-600 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider'>
              {columns.map(col => (
                <th
                  key={col.id}
                  className={`py-3 px-4 ${col.headerClassName ?? ''}`}
                >
                  <span className='inline-flex items-center font-medium text-gray-600 dark:text-gray-400'>
                    {col.header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && emptyMessage != null ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='py-12 text-center text-gray-500 dark:text-gray-400'
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(row => (
                <tr
                  key={getRowId(row)}
                  className='border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-700/60'
                >
                  {columns.map(col => (
                    <td key={col.id} className='py-3 px-4'>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {footerCells != null && footerCells.length > 0 && (
            <tfoot>
              <tr className='border-t border-gray-200/80 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-700/80 font-semibold text-gray-900 dark:text-gray-100'>
                {footerCells.map((cell, i) => (
                  <td
                    key={i}
                    className={`py-3 px-4 ${i === 0 ? '' : 'text-right tabular-nums'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default DataTable;
