import React, { useState, useMemo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import ListPageToolbar from '@/components/ListPageToolbar';
import SelectableDataTable from '@/components/SelectableDataTable';
import PaginationFooter from '@/components/PaginationFooter';
import AddChartOfAccountDrawer from '@/components/AddChartOfAccountDrawer';

/** Flat row for Chart of Accounts table (Figma design data). */
interface ChartAccountRow {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  description: string;
}

const FIGMA_ROWS: Omit<ChartAccountRow, 'id'>[] = [
  {
    accountNumber: '1000',
    accountName: 'Cash & Bank Accounts',
    accountType: 'Assets',
    description: 'Checking account balance for the school',
  },
  {
    accountNumber: '1100',
    accountName: 'Accounts Receivable',
    accountType: 'Assets',
    description: 'Fees and other receivables owed to the school',
  },
  {
    accountNumber: '1200',
    accountName: 'Tuition Receivables',
    accountType: 'Assets',
    description: "Money in school's bank accounts",
  },
  {
    accountNumber: '1300',
    accountName: 'Fee Receivables',
    accountType: 'Assets',
    description: 'Receivables from additional fees',
  },
  {
    accountNumber: '2000',
    accountName: 'Accounts Payable',
    accountType: 'Liability',
    description: 'Amounts owed to external vendors and suppliers',
  },
  {
    accountNumber: '1400',
    accountName: 'Accrued Expenses',
    accountType: 'Liability',
    description: 'Expenses that have been incurred but not yet paid',
  },
  {
    accountNumber: '1400',
    accountName: 'Tuition Received in Advance',
    accountType: 'Liability',
    description: 'Advance payments for tuition',
  },
];

/** Build full dataset: repeat Figma rows to fill pagination (Page 1 of 6, 5/page => 30 items). */
function buildChartAccounts(): ChartAccountRow[] {
  const rows: ChartAccountRow[] = [];
  const perSet = FIGMA_ROWS.length;
  for (let i = 0; i < 30; i++) {
    const base = FIGMA_ROWS[i % perSet]!;
    rows.push({
      id: String(i + 1),
      accountNumber: base.accountNumber,
      accountName: base.accountName,
      accountType: base.accountType,
      description: base.description,
    });
  }
  return rows;
}

const ALL_ACCOUNTS = buildChartAccounts();

const ChartOfAccounts: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterAll] = useState('All');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_ACCOUNTS;
    const q = search.trim().toLowerCase();
    return ALL_ACCOUNTS.filter(
      r =>
        r.accountNumber.toLowerCase().includes(q) ||
        r.accountName.toLowerCase().includes(q) ||
        r.accountType.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, safePage, perPage]);

  const handleSort = (key: string, dir: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDir(dir);
  };

  const columns: import('@/components/SelectableDataTable').SelectableDataTableColumn<ChartAccountRow>[] =
    [
      {
        id: 'accountNumber',
        header: 'Account Number',
        cell: r => r.accountNumber,
        sortable: true,
      },
      {
        id: 'accountName',
        header: 'Account Name',
        cell: r => r.accountName,
        sortable: true,
      },
      {
        id: 'accountType',
        header: 'Account Type',
        cell: r => r.accountType,
        sortable: true,
      },
      {
        id: 'description',
        header: 'Description',
        cell: r => r.description,
        sortable: false,
      },
    ];

  return (
    <div className='space-y-4'>
      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search'
        filterLabel={filterAll}
        primaryLabel='New account'
        onPrimaryClick={() => setAddDrawerOpen(true)}
      />
      <SelectableDataTable<ChartAccountRow>
        data={paginated}
        getRowId={r => r.id}
        columns={columns}
        selectionLabel='accounts'
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        renderRowActions={() => (
          <button
            type='button'
            className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg'
            aria-label='Row actions'
          >
            <MoreHorizontal className='h-4 w-4' />
          </button>
        )}
        tableMinWidth='640px'
        emptyMessage='No accounts found.'
        footer={
          <PaginationFooter
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
            defaultPerPage={5}
          />
        }
      />
      <AddChartOfAccountDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        onSaved={() => setAddDrawerOpen(false)}
      />
    </div>
  );
};

export default ChartOfAccounts;
