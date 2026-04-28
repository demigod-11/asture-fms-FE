import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useProfile } from '@/contexts/ProfileContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import ReportToolbar, { getDefaultReportToolbarState } from './ReportToolbar';
import SelectableDataTable from '@/components/SelectableDataTable';
import {
  getArAgingReport,
  type ArAgingReportResponse,
} from '@/services/reportsApi';

interface ARAgingRow {
  id: string;
  customer: string;
  current: number;
  days1_30: number;
  days31_60: number;
  days61_90: number;
  over90: number;
  total: number;
}

const NUM_HEADER = 'text-right';
const NUM_CELL = 'text-right tabular-nums';
const NUM_TOTAL =
  'text-right tabular-nums font-semibold text-gray-900 dark:text-gray-100';

const ReportARAgingSummary: React.FC = () => {
  const { profiles } = useProfile();
  const { formatCurrency } = useCurrency();
  const [toolbarState, setToolbarState] = useState(
    getDefaultReportToolbarState
  );
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const organisationId = profiles[0]?.organisation_id ?? '';

  const {
    data: report,
    isLoading,
    error,
  } = useQuery<ArAgingReportResponse>(
    ['reports', 'ar-aging', organisationId],
    () => getArAgingReport(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const rows: ARAgingRow[] = useMemo(
    () =>
      report?.rows.map(r => ({
        id: r.customer_id,
        customer: r.customer_name,
        current: Number(r.current ?? 0),
        days1_30: Number(r.days_1_30 ?? 0),
        days31_60: Number(r.days_31_60 ?? 0),
        days61_90: Number(r.days_61_90 ?? 0),
        over90: Number(r.days_over_90 ?? 0),
        total: Number(r.total ?? 0),
      })) ?? [],
    [report]
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
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
  }, [rows, sortKey, sortDir]);

  const columns: import('@/components/SelectableDataTable').SelectableDataTableColumn<ARAgingRow>[] =
    [
      {
        id: 'customer',
        header: 'Customer',
        cell: r => (
          <Link
            to={`/sales/invoice?customer_id=${encodeURIComponent(r.id)}`}
            className='text-[#073E60] dark:text-primary-400 hover:underline'
          >
            {r.customer}
          </Link>
        ),
        sortable: true,
      },
      {
        id: 'current',
        header: 'Current',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => (
          <span className={NUM_CELL}>{formatCurrency(r.current)}</span>
        ),
        sortable: true,
      },
      {
        id: 'days1_30',
        header: '1-30 days',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => (
          <span className={NUM_CELL}>{formatCurrency(r.days1_30)}</span>
        ),
        sortable: true,
      },
      {
        id: 'days31_60',
        header: '31-60 days',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => (
          <span className={NUM_CELL}>{formatCurrency(r.days31_60)}</span>
        ),
        sortable: true,
      },
      {
        id: 'days61_90',
        header: '61-90 days',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => (
          <span className={NUM_CELL}>{formatCurrency(r.days61_90)}</span>
        ),
        sortable: true,
      },
      {
        id: 'over90',
        header: 'Over 90',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_CELL}>{formatCurrency(r.over90)}</span>,
        sortable: true,
      },
      {
        id: 'total',
        header: 'Total',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_TOTAL}>{formatCurrency(r.total)}</span>,
        sortable: true,
      },
    ];

  const totalRow = report
    ? {
        current: Number(report.total_current ?? 0),
        days1_30: Number(report.total_1_30 ?? 0),
        days31_60: Number(report.total_31_60 ?? 0),
        days61_90: Number(report.total_61_90 ?? 0),
        over90: Number(report.total_over_90 ?? 0),
        total: Number(report.total_overall ?? 0),
      }
    : null;
  const footerCells: React.ReactNode[] = totalRow
    ? [
        'Total',
        <span key='f1' className={NUM_TOTAL}>
          {formatCurrency(totalRow.current)}
        </span>,
        <span key='f2' className={NUM_TOTAL}>
          {formatCurrency(totalRow.days1_30)}
        </span>,
        <span key='f3' className={NUM_TOTAL}>
          {formatCurrency(totalRow.days31_60)}
        </span>,
        <span key='f4' className={NUM_TOTAL}>
          {formatCurrency(totalRow.days61_90)}
        </span>,
        <span key='f5' className={NUM_TOTAL}>
          {formatCurrency(totalRow.over90)}
        </span>,
        <span key='f6' className={NUM_TOTAL}>
          {formatCurrency(totalRow.total)}
        </span>,
      ]
    : ['Total', '', '', '', '', '', ''];

  return (
    <div className='space-y-4'>
      <ReportToolbar
        state={toolbarState}
        onStateChange={setToolbarState}
        showDateFilter={false}
        showComparative={false}
        showRunReport={false}
        showSearch
      />

      {error ? (
        <p className='text-sm text-red-600 dark:text-red-400'>
          {error instanceof Error
            ? error.message
            : 'Failed to load A/R aging summary'}
        </p>
      ) : null}
      <SelectableDataTable<ARAgingRow>
        data={isLoading ? [] : sortedData}
        getRowId={r => r.id}
        columns={columns}
        selectionLabel='A/R aging rows'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
        tableMinWidth='640px'
        footerCells={footerCells}
        emptyMessage={isLoading ? 'Loading A/R aging…' : 'No A/R aging data.'}
      />
    </div>
  );
};

export default ReportARAgingSummary;
