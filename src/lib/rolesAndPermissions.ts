/**
 * Permission keys used for role-based access.
 * Grouped by area for modern UI (read/write where applicable).
 */
export type PermissionId =
  | 'invoice:read'
  | 'invoice:write'
  | 'customer:read'
  | 'customer:write'
  | 'product:read'
  | 'product:write'
  | 'bills:read'
  | 'bills:write'
  | 'vendor:read'
  | 'vendor:write'
  | 'expense:read'
  | 'expense:write'
  | 'report:read'
  | 'transactions:read'
  | 'team:manage'
  | 'organisation:manage';

export interface PermissionDef {
  id: PermissionId;
  label: string;
  description: string;
  group: 'sales' | 'purchase' | 'reports' | 'transactions' | 'management';
}

export const ALL_PERMISSIONS: PermissionDef[] = [
  {
    id: 'invoice:read',
    label: 'Invoice (read)',
    description: 'View invoices',
    group: 'sales',
  },
  {
    id: 'invoice:write',
    label: 'Invoice (write)',
    description: 'Create and edit invoices',
    group: 'sales',
  },
  {
    id: 'customer:read',
    label: 'Customer (read)',
    description: 'View customers',
    group: 'sales',
  },
  {
    id: 'customer:write',
    label: 'Customer (write)',
    description: 'Create and edit customers',
    group: 'sales',
  },
  {
    id: 'product:read',
    label: 'Product (read)',
    description: 'View products',
    group: 'sales',
  },
  {
    id: 'product:write',
    label: 'Product (write)',
    description: 'Create and edit products',
    group: 'sales',
  },
  {
    id: 'bills:read',
    label: 'Bills (read)',
    description: 'View bills',
    group: 'purchase',
  },
  {
    id: 'bills:write',
    label: 'Bills (write)',
    description: 'Create and edit bills',
    group: 'purchase',
  },
  {
    id: 'vendor:read',
    label: 'Vendor (read)',
    description: 'View vendors',
    group: 'purchase',
  },
  {
    id: 'vendor:write',
    label: 'Vendor (write)',
    description: 'Create and edit vendors',
    group: 'purchase',
  },
  {
    id: 'expense:read',
    label: 'Expense (read)',
    description: 'View expenses',
    group: 'purchase',
  },
  {
    id: 'expense:write',
    label: 'Expense (write)',
    description: 'Create and edit expenses',
    group: 'purchase',
  },
  {
    id: 'report:read',
    label: 'Report (read)',
    description: 'View reports',
    group: 'reports',
  },
  {
    id: 'transactions:read',
    label: 'Transactions (read)',
    description: 'View transactions',
    group: 'transactions',
  },
  {
    id: 'team:manage',
    label: 'Manage team members',
    description: 'Invite, remove, and manage team',
    group: 'management',
  },
  {
    id: 'organisation:manage',
    label: 'Manage organisation',
    description: 'Organisation settings and billing',
    group: 'management',
  },
];

const ALL_PERMISSION_IDS = ALL_PERMISSIONS.map(p => p.id) as PermissionId[];

export type RoleId = 'owner' | 'admin' | 'user' | string;

export interface RoleDef {
  id: RoleId;
  label: string;
  description: string;
  /** If true, this role has every permission (Admin, Owner). */
  fullAccess?: boolean;
  /** Explicit permission IDs for User or custom roles. */
  permissions?: PermissionId[];
}

export const DEFAULT_ROLES: RoleDef[] = [
  {
    id: 'owner',
    label: 'Owner',
    description: 'Full access to everything',
    fullAccess: true,
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Full access; can manage team and settings',
    fullAccess: true,
  },
  {
    id: 'user',
    label: 'User',
    description: 'Standard access to sales, purchase, and reports',
    permissions: [
      'invoice:read',
      'invoice:write',
      'customer:read',
      'customer:write',
      'product:read',
      'product:write',
      'bills:read',
      'bills:write',
      'vendor:read',
      'vendor:write',
      'expense:read',
      'expense:write',
      'report:read',
      'transactions:read',
    ],
  },
];

export function getRolePermissions(
  roleId: RoleId,
  customRoles: RoleDef[]
): PermissionId[] {
  const role = [...DEFAULT_ROLES, ...customRoles].find(r => r.id === roleId);
  if (!role) return [];
  if (role.fullAccess) return ALL_PERMISSION_IDS;
  return role.permissions ?? [];
}

export function hasPermission(
  roleId: RoleId,
  permissionId: PermissionId,
  customRoles: RoleDef[]
): boolean {
  const perms = getRolePermissions(roleId, customRoles);
  return perms.includes(permissionId);
}

export const GROUP_LABELS: Record<PermissionDef['group'], string> = {
  sales: 'Sales',
  purchase: 'Purchase',
  reports: 'Reports',
  transactions: 'Transactions',
  management: 'Management',
};
