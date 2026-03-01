import React, { useState, useMemo } from 'react';
import ReportToolbar, { getDefaultReportToolbarState } from './ReportToolbar';
import SelectableDataTable from '@/components/SelectableDataTable';

const formatNgn = (n: number) =>
  `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

const SAMPLE_AR_AGING: ARAgingRow[] = [
  {
    id: '1',
    customer: 'Michael Brown',
    current: 120000,
    days1_30: 0,
    days31_60: 45000,
    days61_90: 0,
    over90: 0,
    total: 165000,
  },
  {
    id: '2',
    customer: 'Jane Smith',
    current: 0,
    days1_30: 80000,
    days31_60: 0,
    days61_90: 20000,
    over90: 0,
    total: 100000,
  },
  {
    id: '3',
    customer: 'Chidi Okeke',
    current: 55000,
    days1_30: 0,
    days31_60: 0,
    days61_90: 0,
    over90: 15000,
    total: 70000,
  },
];

const NUM_HEADER = 'text-right';
const NUM_CELL = 'text-right tabular-nums';
const NUM_TOTAL = 'text-right tabular-nums font-semibold text-gray-900';

const ReportARAgingSummary: React.FC = () => {
  const [toolbarState, setToolbarState] = useState(
    getDefaultReportToolbarState
  );
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_AR_AGING;
    return [...SAMPLE_AR_AGING].sort((a, b) => {
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
  }, [sortKey, sortDir]);

  const columns: import('@/components/SelectableDataTable').SelectableDataTableColumn<ARAgingRow>[] =
    [
      {
        id: 'customer',
        header: 'Customer',
        cell: r => r.customer,
        sortable: true,
      },
      {
        id: 'current',
        header: 'Current',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_CELL}>{formatNgn(r.current)}</span>,
        sortable: true,
      },
      {
        id: 'days1_30',
        header: '1-30 days',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_CELL}>{formatNgn(r.days1_30)}</span>,
        sortable: true,
      },
      {
        id: 'days31_60',
        header: '31-60 days',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_CELL}>{formatNgn(r.days31_60)}</span>,
        sortable: true,
      },
      {
        id: 'days61_90',
        header: '61-90 days',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_CELL}>{formatNgn(r.days61_90)}</span>,
        sortable: true,
      },
      {
        id: 'over90',
        header: 'Over 90',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_CELL}>{formatNgn(r.over90)}</span>,
        sortable: true,
      },
      {
        id: 'total',
        header: 'Total',
        headerClassName: NUM_HEADER,
        cellClassName: 'text-right tabular-nums',
        cell: r => <span className={NUM_TOTAL}>{formatNgn(r.total)}</span>,
        sortable: true,
      },
    ];

  const footerCells: React.ReactNode[] = [
    'Total',
    <span key='f1' className={NUM_TOTAL}>
      {formatNgn(175000)}
    </span>,
    <span key='f2' className={NUM_TOTAL}>
      {formatNgn(80000)}
    </span>,
    <span key='f3' className={NUM_TOTAL}>
      {formatNgn(45000)}
    </span>,
    <span key='f4' className={NUM_TOTAL}>
      {formatNgn(20000)}
    </span>,
    <span key='f5' className={NUM_TOTAL}>
      {formatNgn(15000)}
    </span>,
    <span key='f6' className={NUM_TOTAL}>
      {formatNgn(335000)}
    </span>,
  ];

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

      <SelectableDataTable<ARAgingRow>
        data={sortedData}
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
        emptyMessage='No A/R aging data.'
      />
    </div>
  );
};

export default ReportARAgingSummary;
