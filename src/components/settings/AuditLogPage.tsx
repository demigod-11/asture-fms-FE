import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Filter } from 'lucide-react';
import ListPageToolbar from '@/components/ListPageToolbar';
import SelectableDataTable from '@/components/SelectableDataTable';
import PaginationFooter from '@/components/PaginationFooter';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
import { useProfile } from '@/contexts/ProfileContext';
import { listAuditLogs, type AuditActionType } from '@/services/auditLogsApi';
import DateFilterDropdown, {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';

const PAGE_SIZE = 20;

interface AuditLogRow {
  id: string;
  actor: string;
  action_type: string;
  target: string;
  target_type: string;
  created_at: string;
}

const AuditLogPage: React.FC = () => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditActionType | ''>('');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );

  const { data, isLoading, error } = useQuery(
    ['audit-logs', organisationId, page, actionFilter, dateFilter],
    () => {
      const { date_from, date_to } = getDateRangeForPreset(
        dateFilter.preset,
        dateFilter.customFrom,
        dateFilter.customTo
      );
      return listAuditLogs(organisationId, {
        page,
        page_size: PAGE_SIZE,
        action_type: actionFilter || undefined,
        date_from,
        date_to,
      });
    },
    { enabled: Boolean(organisationId) }
  );

  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 0;

  const rows: AuditLogRow[] = items.map(entry => ({
    id: entry.id,
    actor: entry.actor,
    action_type: entry.action_type,
    target: entry.target,
    target_type: entry.target_type ?? '',
    created_at: entry.timestamp
      ? new Date(entry.timestamp).toLocaleString()
      : '',
  }));

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(
      r =>
        r.actor.toLowerCase().includes(q) ||
        r.action_type.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q) ||
        r.target_type.toLowerCase().includes(q)
    );
  }, [rows, search]);

  if (!organisationId) {
    return (
      <NoOrganisationNotice>No organisation in context.</NoOrganisationNotice>
    );
  }

  const columns = [
    {
      id: 'created_at' as const,
      header: 'Date' as const,
      cell: (r: AuditLogRow) => r.created_at,
    },
    {
      id: 'actor' as const,
      header: 'Actor' as const,
      cell: (r: AuditLogRow) => r.actor,
    },
    {
      id: 'action_type' as const,
      header: 'Action' as const,
      cell: (r: AuditLogRow) => r.action_type.replace(/_/g, ' '),
    },
    {
      id: 'target_type' as const,
      header: 'Resource' as const,
      cell: (r: AuditLogRow) => r.target_type || '—',
    },
    {
      id: 'target' as const,
      header: 'Target' as const,
      cell: (r: AuditLogRow) => r.target,
    },
  ];

  const actionFilterControl = (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-input'>
        <Filter
          className='h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0 ml-2.5'
          aria-hidden
        />
        <select
          value={actionFilter}
          onChange={e =>
            setActionFilter(e.target.value as AuditActionType | '')
          }
          className='input-field py-2.5 pl-1 pr-8 rounded-xl border-0 bg-transparent text-sm min-w-[140px]'
          aria-label='Filter by action type'
        >
          <option value=''>All actions</option>
          <option value='invite_user'>Invite user</option>
          <option value='create_role'>Create role</option>
          <option value='update_role'>Update role</option>
          <option value='delete_role'>Delete role</option>
          <option value='create_organisation'>Create organisation</option>
          <option value='update_organisation'>Update organisation</option>
          <option value='create_coa'>Create COA</option>
          <option value='update_coa'>Update COA</option>
          <option value='deactivate_coa'>Deactivate COA</option>
        </select>
      </div>
      <DateFilterDropdown state={dateFilter} onStateChange={setDateFilter} />
    </div>
  );

  return (
    <div className='space-y-4'>
      <h1 className='heading-1'>Audit log</h1>
      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search...'
        filterSlot={actionFilterControl}
      />
      {error ? (
        <p className='text-sm text-red-600 dark:text-red-400'>
          {error instanceof Error ? error.message : 'Failed to load audit log'}
        </p>
      ) : null}
      <SelectableDataTable<AuditLogRow>
        data={filteredRows}
        getRowId={r => r.id}
        columns={columns}
        selectionLabel='entries'
        tableMinWidth='800px'
        emptyMessage='No audit log entries.'
        footer={
          <PaginationFooter
            page={page}
            totalPages={totalPages || 1}
            onPageChange={setPage}
          />
        }
      />
      {isLoading && (
        <p className='text-sm text-gray-500 dark:text-gray-400'>Loading…</p>
      )}
    </div>
  );
};

export default AuditLogPage;
