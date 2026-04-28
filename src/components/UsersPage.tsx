import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ListPageToolbar from '@/components/ListPageToolbar';
import ModuleTabs from '@/components/ModuleTabs';
import SelectableDataTable from '@/components/SelectableDataTable';
import InviteTeamMemberDrawer from '@/components/InviteTeamMemberDrawer';
import EditRoleDrawer, {
  type ApiPermission,
} from '@/components/EditRoleDrawer';
import { useProfile } from '@/contexts/ProfileContext';
import { listOrgMembers } from '@/services/authApi';
import {
  listInvitations,
  createInvitation,
  resendInvitation,
  cancelInvitation,
} from '@/services/invitationsApi';
import { listRoles, updateRole, deleteRole } from '@/services/rolesApi';
import {
  DEFAULT_ROLES,
  getRolePermissions,
  hasPermission,
  type RoleDef,
  type PermissionId,
} from '@/lib/rolesAndPermissions';

export type InvitationStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'cancelled';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  roleId: string;
  roleLabel: string;
  status: InvitationStatus;
  sentAt: string;
  expiresAt?: string;
}

const STATUS_LABELS: Record<InvitationStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

const statusClass: Record<InvitationStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-500',
};

type Tab = 'members' | 'invitations' | 'roles';

interface RoleRow {
  id: string;
  label: string;
  description: string;
  type: 'default' | 'custom';
  isDefault: boolean;
}

const UsersPage: React.FC = () => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('members');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invPage] = useState(1);
  const [customRoles, setCustomRoles] = useState<RoleDef[]>([]);

  const { data: orgMembersData } = useQuery(
    ['org-members', organisationId],
    () => listOrgMembers(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const members: TeamMember[] = useMemo(() => {
    const list = orgMembersData ?? [];
    return list.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role_id,
      roleLabel: m.role_name,
      joinedAt: m.joined_at
        ? new Date(m.joined_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '',
    }));
  }, [orgMembersData]);
  const [roleOverrides, setRoleOverrides] = useState<
    Record<string, PermissionId[]>
  >({});
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const { data: invitationsData } = useQuery(
    ['invitations', organisationId, invPage],
    () => listInvitations(organisationId, { page: invPage, page_size: 50 }),
    { enabled: Boolean(organisationId) }
  );

  const { data: apiRoles = [] } = useQuery(
    ['roles', organisationId],
    () => listRoles(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const allApiPermissions = useMemo((): ApiPermission[] => {
    const seen = new Set<string>();
    const out: ApiPermission[] = [];
    apiRoles.forEach(r => {
      r.permissions?.forEach((p: { id: string; name: string }) => {
        if (p?.id && !seen.has(p.id)) {
          seen.add(p.id);
          out.push({ id: p.id, name: p.name ?? p.id });
        }
      });
    });
    return out;
  }, [apiRoles]);

  const updateRoleMutation = useMutation(
    ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      updateRole(organisationId, roleId, { permission_ids: permissionIds }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['roles', organisationId]);
        setEditRoleOpen(false);
        setEditingRole(null);
      },
    }
  );

  const deleteRoleMutation = useMutation(
    (roleId: string) => deleteRole(organisationId, roleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['roles', organisationId]);
        setEditRoleOpen(false);
        setEditingRole(null);
      },
    }
  );

  const createInvMutation = useMutation(
    (body: { email: string; role_id: string; expires_in_days?: number }) =>
      createInvitation(organisationId, {
        email: body.email,
        role_id: body.role_id,
        expires_in_days: body.expires_in_days ?? 7,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invitations', organisationId]);
        setInviteOpen(false);
      },
    }
  );

  const resendInvMutation = useMutation(
    (invitationId: string) => resendInvitation(organisationId, invitationId),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['invitations', organisationId]),
    }
  );

  const cancelInvMutation = useMutation(
    (invitationId: string) => cancelInvitation(organisationId, invitationId),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['invitations', organisationId]),
    }
  );

  const rolesMap = useMemo(() => {
    const m = new Map<string, string>();
    apiRoles.forEach(r => m.set(r.id, r.display_name));
    return m;
  }, [apiRoles]);

  /** Custom roles from API (non-default) for permission resolution. */
  const customRolesFromApi: RoleDef[] = useMemo(
    () =>
      apiRoles
        .filter(r => !r.is_default_role)
        .map(r => ({
          id: r.id,
          label: r.display_name ?? r.name,
          description: r.description ?? '',
          permissions: (r.permissions?.map(p => p.name) ??
            []) as PermissionId[],
        })),
    [apiRoles]
  );

  const currentUserRoleId = profiles[0]?.role_id ?? '';
  const canManageTeam = hasPermission(
    currentUserRoleId,
    'team:manage',
    customRolesFromApi
  );

  const invitations: Invitation[] = useMemo(() => {
    const items = invitationsData?.items ?? [];
    return items.map(inv => {
      const base = {
        id: inv.id,
        email: inv.email,
        roleId: inv.role_id,
        roleLabel: rolesMap.get(inv.role_id) ?? inv.role_id,
        status: inv.status as InvitationStatus,
        sentAt: inv.invited_at
          ? new Date(inv.invited_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '',
      };
      return inv.expires_at
        ? { ...base, expiresAt: inv.expires_at.slice(0, 10) }
        : base;
    });
  }, [invitationsData?.items, rolesMap]);

  const handleSort = (key: string, dir: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDir(dir);
  };

  const handleInvite = (
    email: string,
    roleId: string,
    _customRole?: RoleDef,
    expiresAt?: string
  ) => {
    const expires_in_days = expiresAt
      ? Math.max(
          1,
          Math.min(
            30,
            Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
          )
        )
      : 7;
    createInvMutation.mutate({
      email,
      role_id: roleId,
      expires_in_days: Number.isNaN(expires_in_days) ? 7 : expires_in_days,
    });
  };

  const handleAddCustomRole = (role: RoleDef) => {
    setCustomRoles(prev => [...prev, role]);
  };

  const handleResend = (id: string) => {
    resendInvMutation.mutate(id);
  };

  const handleCancel = (id: string) => {
    cancelInvMutation.mutate(id);
  };

  const filteredMembers = useMemo(() => {
    const list = search.trim()
      ? members.filter(
          m =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase())
        )
      : members;
    if (!sortKey) return list;
    return [...list].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [members, search, sortKey, sortDir]);

  const filteredInvitations = useMemo(() => {
    const list = search.trim()
      ? invitations.filter(e =>
          e.email.toLowerCase().includes(search.toLowerCase())
        )
      : invitations;
    if (!sortKey) return list;
    return [...list].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [invitations, search, sortKey, sortDir]);

  const invitationsWithExpired = useMemo(() => {
    const now = new Date();
    return filteredInvitations.map(inv => {
      if (
        inv.status === 'pending' &&
        inv.expiresAt &&
        new Date(inv.expiresAt) < now
      ) {
        return { ...inv, status: 'expired' as const };
      }
      return inv;
    });
  }, [filteredInvitations]);

  const rolesList: RoleRow[] = useMemo(() => {
    return apiRoles.map(r => ({
      id: r.id,
      label: r.display_name,
      description: r.description ?? '',
      type: r.is_system_role ? 'default' : 'custom',
      isDefault: r.is_default_role,
    }));
  }, [apiRoles]);

  const sortedRolesList = useMemo(() => {
    if (!sortKey) return rolesList;
    return [...rolesList].sort((a, b) => {
      const aVal = (a as unknown as Record<string, string>)[sortKey] ?? '';
      const bVal = (b as unknown as Record<string, string>)[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rolesList, sortKey, sortDir]);

  const getEffectivePermissions = (roleId: string): PermissionId[] => {
    const override = roleOverrides[roleId];
    if (override) return override;
    return getRolePermissions(roleId, customRoles);
  };

  const handleSaveRole = (
    roleId: string,
    isDefault: boolean,
    permissions: PermissionId[]
  ) => {
    if (isDefault) {
      setRoleOverrides(prev => ({ ...prev, [roleId]: permissions }));
    } else {
      setCustomRoles(prev =>
        prev.map(r =>
          r.id === roleId
            ? {
                id: r.id,
                label: r.label,
                description: r.description,
                permissions,
              }
            : r
        )
      );
    }
    setEditRoleOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    if (apiRoles.length > 0) {
      deleteRoleMutation.mutate(roleId);
      return;
    }
    setCustomRoles(prev => prev.filter(r => r.id !== roleId));
    setEditRoleOpen(false);
    setEditingRole(null);
  };

  const openEditRole = (role: RoleRow) => {
    setEditingRole(role);
    setEditRoleOpen(true);
  };

  const memberColumns: import('@/components/SelectableDataTable').SelectableDataTableColumn<TeamMember>[] =
    [
      { id: 'name', header: 'Name', cell: r => r.name, sortable: true },
      { id: 'email', header: 'Email', cell: r => r.email, sortable: true },
      {
        id: 'roleLabel',
        header: 'Role',
        cell: r => (
          <span className='inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700'>
            {r.roleLabel}
          </span>
        ),
        sortable: true,
      },
      {
        id: 'joinedAt',
        header: 'Joined',
        cell: r => r.joinedAt,
        sortable: true,
      },
    ];

  /** Format Expires column: same font/size as other columns (text-sm), same style as Sent. */
  const formatExpiresCell = (inv: Invitation) => {
    if (inv.status === 'expired') {
      return (
        <span className='inline-flex items-center rounded-lg px-2.5 py-0.5 text-sm font-medium bg-gray-100 text-gray-600'>
          Expired
        </span>
      );
    }
    if (!inv.expiresAt) return <span className='text-sm text-gray-500'>—</span>;
    const raw = inv.expiresAt;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
    let formatted: string;
    if (match) {
      const y = match[1];
      const m = match[2];
      const d = match[3];
      if (y === undefined || m === undefined || d === undefined) {
        return <span className='text-sm text-gray-500'>{raw}</span>;
      }
      const monthIndex = parseInt(m, 10) - 1;
      const day = parseInt(d, 10);
      const year = parseInt(y, 10);
      const dObj = new Date(year, monthIndex, day);
      formatted = dObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } else {
      try {
        formatted = new Date(raw).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        return <span className='text-sm text-gray-500'>{raw}</span>;
      }
    }
    return <span className='text-sm text-gray-600'>{formatted}</span>;
  };

  const invitationColumns: import('@/components/SelectableDataTable').SelectableDataTableColumn<Invitation>[] =
    [
      { id: 'email', header: 'Email', cell: r => r.email, sortable: true },
      {
        id: 'roleLabel',
        header: 'Role',
        cell: r => r.roleLabel,
        sortable: true,
      },
      {
        id: 'status',
        header: 'Status',
        cell: r => (
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${statusClass[r.status]}`}
          >
            {STATUS_LABELS[r.status]}
          </span>
        ),
        sortable: true,
      },
      { id: 'sentAt', header: 'Sent', cell: r => r.sentAt, sortable: true },
      {
        id: 'expiresAt',
        header: 'Expires',
        cell: r => formatExpiresCell(r),
        sortable: true,
      },
    ];

  const roleColumns: import('@/components/SelectableDataTable').SelectableDataTableColumn<RoleRow>[] =
    [
      { id: 'label', header: 'Name', cell: r => r.label, sortable: true },
      {
        id: 'description',
        header: 'Description',
        cell: r => r.description,
        sortable: true,
      },
      {
        id: 'type',
        header: 'Type',
        cell: r => (
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${r.type === 'default' ? 'bg-gray-100 text-gray-700' : 'bg-primary-100 text-primary-800'}`}
          >
            {r.type === 'default' ? 'Default' : 'Custom'}
          </span>
        ),
        sortable: true,
      },
    ];

  const userTabs = [
    { id: 'members' as const, label: 'Team members' },
    { id: 'invitations' as const, label: 'Invitations' },
    { id: 'roles' as const, label: 'Roles' },
  ];

  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='heading-1'>Users</h1>

      <ModuleTabs
        variant='state'
        tabs={userTabs}
        activeId={tab}
        onTabChange={id => setTab(id as Tab)}
        ariaLabel='Users sections'
      />

      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search by name or email...'
        filterLabel='All'
        primaryLabel={canManageTeam ? 'Invite team member' : undefined}
        onPrimaryClick={canManageTeam ? () => setInviteOpen(true) : undefined}
      />

      {tab === 'members' && (
        <SelectableDataTable<TeamMember>
          data={filteredMembers}
          getRowId={r => r.id}
          columns={memberColumns}
          selectionLabel='team members'
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          tableMinWidth='640px'
          emptyMessage='No team members found.'
        />
      )}

      {tab === 'invitations' && (
        <SelectableDataTable<Invitation>
          data={invitationsWithExpired}
          getRowId={r => r.id}
          columns={invitationColumns}
          selectionLabel='invitations'
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          renderRowActions={inv =>
            inv.status === 'pending' ? (
              <div className='flex items-center gap-1'>
                <button
                  type='button'
                  onClick={() => handleResend(inv.id)}
                  className='text-xs font-medium text-[#073E60] hover:underline'
                >
                  Resend
                </button>
                <span className='text-gray-300'>|</span>
                <button
                  type='button'
                  onClick={() => handleCancel(inv.id)}
                  className='text-xs font-medium text-red-600 hover:underline'
                >
                  Cancel
                </button>
              </div>
            ) : null
          }
          tableMinWidth='640px'
          emptyMessage='No invitations found.'
        />
      )}

      {tab === 'roles' && (
        <SelectableDataTable<RoleRow>
          data={sortedRolesList}
          getRowId={r => r.id}
          columns={roleColumns}
          selectionLabel='roles'
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          renderRowActions={
            canManageTeam
              ? role => (
                  <button
                    type='button'
                    onClick={() => openEditRole(role)}
                    className='text-sm font-medium text-[#073E60] dark:text-primary-400 hover:underline dark:hover:text-primary-300'
                  >
                    Edit permissions
                  </button>
                )
              : undefined
          }
          tableMinWidth='640px'
          emptyMessage='No roles found.'
        />
      )}

      <InviteTeamMemberDrawer
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
        customRoles={customRoles}
        onAddCustomRole={handleAddCustomRole}
        apiRoles={apiRoles}
      />

      {editingRole && (
        <EditRoleDrawer
          open={editRoleOpen}
          onClose={() => {
            setEditRoleOpen(false);
            setEditingRole(null);
          }}
          roleLabel={editingRole.label}
          isDefault={editingRole.isDefault}
          initialPermissions={getEffectivePermissions(editingRole.id)}
          apiPermissions={
            allApiPermissions.length > 0 ? allApiPermissions : undefined
          }
          apiSelectedIds={
            allApiPermissions.length > 0 && editingRole
              ? (apiRoles
                  .find(r => r.id === editingRole.id)
                  ?.permissions?.map((p: { id: string }) => p.id) ?? [])
              : undefined
          }
          onSaveApi={
            allApiPermissions.length > 0 && editingRole
              ? (permissionIds: string[]) =>
                  updateRoleMutation.mutate({
                    roleId: editingRole.id,
                    permissionIds,
                  })
              : undefined
          }
          fullAccess={Boolean(
            DEFAULT_ROLES.find(r => r.id === editingRole.id)?.fullAccess &&
              !roleOverrides[editingRole.id]
          )}
          onSave={perms =>
            handleSaveRole(editingRole.id, editingRole.isDefault, perms)
          }
          {...(!editingRole.isDefault
            ? { onDelete: () => handleDeleteRole(editingRole.id) }
            : {})}
        />
      )}
    </div>
  );
};

export default UsersPage;
