import React, { useState, useMemo } from 'react';
import ListPageToolbar from '@/components/ListPageToolbar';
import SelectableDataTable from '@/components/SelectableDataTable';
import InviteTeamMemberDrawer from '@/components/InviteTeamMemberDrawer';
import EditRoleDrawer from '@/components/EditRoleDrawer';
import {
  DEFAULT_ROLES,
  getRolePermissions,
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

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@company.com',
    role: 'admin',
    roleLabel: 'Admin',
    joinedAt: 'Jan 15, 2025',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'user',
    roleLabel: 'User',
    joinedAt: 'Feb 1, 2025',
  },
];

const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: 'inv1',
    email: 'new@company.com',
    roleId: 'user',
    roleLabel: 'User',
    status: 'pending',
    sentAt: 'Mar 20, 2025',
    expiresAt: '2025-04-20',
  },
  {
    id: 'inv2',
    email: 'declined@company.com',
    roleId: 'user',
    roleLabel: 'User',
    status: 'declined',
    sentAt: 'Mar 18, 2025',
  },
  {
    id: 'inv3',
    email: 'expired@company.com',
    roleId: 'admin',
    roleLabel: 'Admin',
    status: 'expired',
    sentAt: 'Mar 1, 2025',
    expiresAt: '2025-03-15',
  },
];

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
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('members');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [invitations, setInvitations] =
    useState<Invitation[]>(INITIAL_INVITATIONS);
  const [customRoles, setCustomRoles] = useState<RoleDef[]>([]);
  const [roleOverrides, setRoleOverrides] = useState<
    Record<string, PermissionId[]>
  >({});
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

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
    const roleLabel =
      [...DEFAULT_ROLES, ...customRoles].find(r => r.id === roleId)?.label ??
      roleId;
    setInvitations(prev => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        email,
        roleId,
        roleLabel,
        status: 'pending' as const,
        sentAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        ...(expiresAt ? { expiresAt } : {}),
      },
    ]);
  };

  const handleAddCustomRole = (role: RoleDef) => {
    setCustomRoles(prev => [...prev, role]);
  };

  const handleResend = (id: string) => {
    setInvitations(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'pending' as const } : i))
    );
  };

  const handleCancel = (id: string) => {
    setInvitations(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'cancelled' as const } : i))
    );
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
    const defaults: RoleRow[] = DEFAULT_ROLES.map(r => ({
      id: r.id,
      label: r.label,
      description: r.description,
      type: 'default',
      isDefault: true,
    }));
    const customs: RoleRow[] = customRoles.map(r => ({
      id: r.id,
      label: r.label,
      description: r.description || 'Custom role',
      type: 'custom',
      isDefault: false,
    }));
    return [...defaults, ...customs];
  }, [customRoles]);

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

  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
        Users
      </h1>

      <div className='flex border-b border-gray-200/90'>
        {(['members', 'invitations', 'roles'] as const).map(t => (
          <button
            key={t}
            type='button'
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-[#073E60] text-[#073E60]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {t === 'members' && 'Team members'}
            {t === 'invitations' && 'Invitations'}
            {t === 'roles' && 'Roles'}
          </button>
        ))}
      </div>

      <ListPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search by name or email...'
        filterLabel='All'
        primaryLabel='Invite team member'
        onPrimaryClick={() => setInviteOpen(true)}
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
          renderRowActions={role => (
            <button
              type='button'
              onClick={() => openEditRole(role)}
              className='text-sm font-medium text-[#073E60] hover:underline'
            >
              Edit permissions
            </button>
          )}
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
