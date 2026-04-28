import React from 'react';

export interface PaginationFooterProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPerPageSelect?: boolean;
  /** Default selected value for per-page dropdown (e.g. 5, 7, 10, 25). */
  defaultPerPage?: number;
}

const PER_PAGE_OPTIONS = [5, 7, 10, 25];

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  page,
  totalPages,
  onPageChange,
  showPerPageSelect = true,
  defaultPerPage = 7,
}) => {
  const showEllipsis = totalPages > 4;
  const leftPages = [1, 2, 3].filter(n => n <= totalPages);
  const rightPages =
    totalPages > 4 ? [totalPages - 1, totalPages].filter(n => n > 3) : [];

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4'>
      <p className='text-sm text-gray-600 dark:text-gray-400'>
        Page{' '}
        <span className='font-medium text-gray-900 dark:text-gray-100'>
          {page}
        </span>{' '}
        of{' '}
        <span className='font-medium text-gray-900 dark:text-gray-100'>
          {totalPages}
        </span>
      </p>
      <div className='flex items-center gap-1.5'>
        <button
          type='button'
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className='p-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors min-w-[36px]'
        >
          ‹
        </button>
        {leftPages.map(n => (
          <button
            key={n}
            type='button'
            onClick={() => onPageChange(n)}
            className={`min-w-[36px] py-2 rounded-xl text-sm font-medium transition-colors ${
              page === n
                ? 'bg-primary-600 text-white shadow-button-primary'
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {n}
          </button>
        ))}
        {showEllipsis && (
          <span className='px-2 text-gray-400 dark:text-gray-500 text-sm'>
            ...
          </span>
        )}
        {rightPages.map(n => (
          <button
            key={n}
            type='button'
            onClick={() => onPageChange(n)}
            className={`min-w-[36px] py-2 rounded-xl text-sm font-medium transition-colors ${
              page === n
                ? 'bg-primary-600 text-white shadow-button-primary'
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type='button'
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className='p-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors min-w-[36px]'
        >
          ›
        </button>
        {showPerPageSelect && (
          <select
            className='ml-3 py-2 pl-3 pr-8 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500'
            aria-label='Items per page'
            defaultValue={
              PER_PAGE_OPTIONS.includes(defaultPerPage) ? defaultPerPage : 7
            }
          >
            {PER_PAGE_OPTIONS.map(n => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default PaginationFooter;
