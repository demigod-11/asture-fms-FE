import React, { useState, useMemo } from 'react';
import ReportToolbar, { getDefaultReportToolbarState } from './ReportToolbar';
import SelectableDataTable from '@/components/SelectableDataTable';

const formatNgn = (n: number) =>
  `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface APAgingRow {
  id: string;
  vendor: string;
  current: number;
  days1_30: number;
  days31_60: number;
  days61_90: number;
  over90: number;
  total: number;
}

const SAMPLE_AP_AGING: APAgingRow[] = [
  {
    id: '1',
    vendor: 'ABC Supplies Ltd',
    current: 85000,
    days1_30: 20000,
    days31_60: 0,
    days61_90: 15000,
    over90: 0,
    total: 120000,
  },
  {
    id: '2',
    vendor: 'XYZ Services',
    current: 40000,
    days1_30: 0,
    days31_60: 35000,
    days61_90: 0,
    over90: 5000,
    total: 80000,
  },
  {
    id: '3',
    vendor: 'Office World',
    current: 0,
    days1_30: 45000,
    days31_60: 0,
    days61_90: 0,
    over90: 0,
    total: 45000,
  },
];

const NUM_HEADER = 'text-right';
const NUM_CELL = 'text-right tabular-nums';
const NUM_TOTAL = 'text-right tabular-nums font-semibold text-gray-900';

const ReportAPAgingSummary: React.FC = () => {
  const [toolbarState, setToolbarState] = useState(
    getDefaultReportToolbarState
  );
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return SAMPLE_AP_AGING;
    return [...SAMPLE_AP_AGING].sort((a, b) => {
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

  const columns: import('@/components/SelectableDataTable').SelectableDataTableColumn<APAgingRow>[] =
    [
      { id: 'vendor', header: 'Vendor', cell: r => r.vendor, sortable: true },
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
      {formatNgn(125000)}
    </span>,
    <span key='f2' className={NUM_TOTAL}>
      {formatNgn(65000)}
    </span>,
    <span key='f3' className={NUM_TOTAL}>
      {formatNgn(35000)}
    </span>,
    <span key='f4' className={NUM_TOTAL}>
      {formatNgn(15000)}
    </span>,
    <span key='f5' className={NUM_TOTAL}>
      {formatNgn(5000)}
    </span>,
    <span key='f6' className={NUM_TOTAL}>
      {formatNgn(245000)}
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

      <SelectableDataTable<APAgingRow>
        data={sortedData}
        getRowId={r => r.id}
        columns={columns}
        selectionLabel='A/P aging rows'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
        tableMinWidth='640px'
        footerCells={footerCells}
        emptyMessage='No A/P aging data.'
      />
    </div>
  );
};

export default ReportAPAgingSummary;
