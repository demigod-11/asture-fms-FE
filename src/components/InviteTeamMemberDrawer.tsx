import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLES,
  GROUP_LABELS,
  type RoleDef,
  type PermissionId,
} from '@/lib/rolesAndPermissions';

interface InviteTeamMemberDrawerProps {
  open: boolean;
  onClose: () => void;
  onInvite: (
    email: string,
    roleId: string,
    customRole?: RoleDef,
    expiresAt?: string
  ) => void;
  customRoles: RoleDef[];
  onAddCustomRole?: (role: RoleDef) => void;
}

const ROLE_OPTIONS = DEFAULT_ROLES.map(r => ({ value: r.id, label: r.label }));

const isValidEmail = (s: string): boolean => {
  const t = s.trim();
  return t.length > 0 && t.includes('@');
};

/** Parse comma-separated emails: trim and keep only strings that look like email (contain @). */
const parseEmails = (value: string): string[] => {
  return value
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.includes('@'));
};

const InviteTeamMemberDrawer: React.FC<InviteTeamMemberDrawerProps> = ({
  open,
  onClose,
  onInvite,
  customRoles,
  onAddCustomRole,
}) => {
  const [committedEmails, setCommittedEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [roleId, setRoleId] = useState<string>('user');
  const [roleOpen, setRoleOpen] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');
  const [customPerms, setCustomPerms] = useState<PermissionId[]>([]);
  const [expiresAt, setExpiresAt] = useState('');
  const [showCustomPerms, setShowCustomPerms] = useState(false);

  const isCustom = roleId === 'custom';
  const selectedRoleLabel =
    ROLE_OPTIONS.find(r => r.value === roleId)?.label ??
    customRoles.find(r => r.id === roleId)?.label ??
    (isCustom ? customRoleName.trim() || 'Create custom role' : 'User');
  const roleOptionsForDropdown = [
    ...ROLE_OPTIONS,
    ...customRoles.map(r => ({ value: r.id, label: r.label })),
    { value: 'custom', label: '+ Create custom role' },
  ];

  const handleRoleSelect = (id: string) => {
    setRoleId(id);
    setRoleOpen(false);
    if (id === 'custom') setShowCustomPerms(true);
    else setShowCustomPerms(false);
  };

  const togglePermission = (id: PermissionId) => {
    setCustomPerms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  /** When input changes: lock in any complete valid email (before last comma) as chips; keep rest in input. */
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parts = raw.split(',');
    const trimmed = parts.map(p => p.trim());
    const toCommit: string[] = [];
    for (let i = 0; i < parts.length - 1; i++) {
      const part = trimmed[i];
      if (part && isValidEmail(part)) toCommit.push(part);
    }
    const last = trimmed[trimmed.length - 1] ?? '';
    if (toCommit.length > 0) {
      setCommittedEmails(prev => {
        const next = [...prev];
        toCommit.forEach(addr => {
          if (!next.includes(addr)) next.push(addr);
        });
        return next;
      });
      setInputValue(last);
    } else {
      setInputValue(raw);
    }
  };

  const removeCommittedEmail = (addr: string) => {
    setCommittedEmails(prev => prev.filter(e => e !== addr));
  };

  const emailsToInvite = [...committedEmails, ...parseEmails(inputValue)];
  const canSubmit =
    emailsToInvite.length > 0 && (!isCustom || !!customRoleName.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailsToInvite.length === 0) return;
    const expires = expiresAt.trim() || undefined;
    if (isCustom && customRoleName.trim() && onAddCustomRole) {
      const newRole: RoleDef = {
        id: `custom-${Date.now()}`,
        label: customRoleName.trim(),
        description: 'Custom role',
        permissions: customPerms,
      };
      onAddCustomRole(newRole);
      emailsToInvite.forEach(addr =>
        onInvite(addr, newRole.id, newRole, expires ?? '')
      );
    } else {
      emailsToInvite.forEach(addr =>
        onInvite(addr, roleId, undefined, expires ?? '')
      );
    }
    setCommittedEmails([]);
    setInputValue('');
    setRoleId('user');
    setCustomRoleName('');
    setCustomPerms([]);
    setExpiresAt('');
    setShowCustomPerms(false);
    onClose();
  };

  const resetEmailState = () => {
    setCommittedEmails([]);
    setInputValue('');
  };

  const handleClose = () => {
    resetEmailState();
    onClose();
  };

  if (!open) return null;

  const byGroup = ALL_PERMISSIONS.reduce<
    Record<string, typeof ALL_PERMISSIONS>
  >((acc, p) => {
    const g = p.group;
    if (!acc[g]) acc[g] = [];
    acc[g].push(p);
    return acc;
  }, {});

  const content = (
    <>
      <div
        className='fixed inset-0 z-[100] bg-black/50 transition-opacity'
        onClick={handleClose}
        aria-hidden
      />
      <div
        className='fixed top-0 right-0 bottom-0 z-[101] w-full max-w-lg bg-white shadow-xl flex flex-col overflow-hidden'
        role='dialog'
        aria-modal='true'
        aria-labelledby='invite-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0'>
          <h2 id='invite-title' className='text-lg font-semibold text-gray-900'>
            Invite team member
          </h2>
          <button
            type='button'
            onClick={handleClose}
            className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-5'
        >
          <div>
            <label htmlFor='invite-email' className='form-label text-gray-900'>
              Email <span className='text-red-500'>*</span>
            </label>
            <div
              id='invite-email'
              className='input-field min-h-[48px] flex flex-wrap items-center gap-2 py-2 pl-3 pr-3 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500/25 focus-within:border-primary-500'
            >
              {committedEmails.map(addr => (
                <span
                  key={addr}
                  className='inline-flex items-center gap-1.5 rounded-lg bg-primary-50 border border-primary-200 px-2.5 py-1.5 text-sm font-medium text-primary-800'
                >
                  {addr}
                  <button
                    type='button'
                    onClick={() => removeCommittedEmail(addr)}
                    className='p-0.5 rounded hover:bg-primary-100 text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50'
                    aria-label={`Remove ${addr}`}
                  >
                    <X className='h-3.5 w-3.5' />
                  </button>
                </span>
              ))}
              <input
                type='text'
                inputMode='email'
                autoComplete='email'
                value={inputValue}
                onChange={handleEmailInputChange}
                placeholder={
                  committedEmails.length === 0
                    ? 'colleague@company.com, other@company.com'
                    : 'Add another email...'
                }
                className='flex-1 min-w-[140px] py-1.5 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-sm'
              />
            </div>
            <p className='mt-1.5 text-xs text-gray-500'>
              Type an email and add a comma to lock it in. All get the same
              role.
            </p>
          </div>

          <div>
            <label className='form-label text-gray-900'>Role</label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => setRoleOpen(!roleOpen)}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 flex items-center justify-between text-left'
              >
                <span
                  className={
                    selectedRoleLabel.startsWith('+')
                      ? 'text-[#073E60]'
                      : 'text-gray-900'
                  }
                >
                  {selectedRoleLabel}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2' />
              </button>
              {roleOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto'>
                  {roleOptionsForDropdown.map(r => (
                    <button
                      key={r.value}
                      type='button'
                      onClick={() => handleRoleSelect(r.value)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        r.label.startsWith('+')
                          ? 'text-[#073E60] font-medium'
                          : 'text-gray-900'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showCustomPerms && (
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='custom-role-name'
                  className='form-label text-gray-900'
                >
                  Custom role name
                </label>
                <input
                  id='custom-role-name'
                  type='text'
                  value={customRoleName}
                  onChange={e => setCustomRoleName(e.target.value)}
                  placeholder='e.g. Accountant'
                  className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
                />
              </div>
              <p className='text-sm font-medium text-gray-700'>Permissions</p>
              <div className='space-y-4'>
                {(
                  Object.keys(GROUP_LABELS) as Array<keyof typeof GROUP_LABELS>
                ).map(groupKey => {
                  const perms = byGroup[groupKey];
                  if (!perms?.length) return null;
                  return (
                    <div
                      key={groupKey}
                      className='rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden'
                    >
                      <div className='px-3 py-2 bg-white border-b border-gray-200'>
                        <span className='text-sm font-semibold text-gray-900'>
                          {GROUP_LABELS[groupKey]}
                        </span>
                      </div>
                      <ul className='divide-y divide-gray-100'>
                        {perms.map(p => (
                          <li
                            key={p.id}
                            className='flex items-start gap-3 px-3 py-2.5 hover:bg-white/60'
                          >
                            <input
                              type='checkbox'
                              id={`perm-${p.id}`}
                              checked={customPerms.includes(p.id)}
                              onChange={() => togglePermission(p.id)}
                              className='mt-1 rounded border-gray-300 accent-[#073E60]'
                            />
                            <label
                              htmlFor={`perm-${p.id}`}
                              className='flex-1 min-w-0 cursor-pointer'
                            >
                              <span className='text-sm font-medium text-gray-900'>
                                {p.label}
                              </span>
                              <p className='text-xs text-gray-500 mt-0.5'>
                                {p.description}
                              </p>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor='invite-expires'
              className='form-label text-gray-900'
            >
              Expiration date (optional)
            </label>
            <input
              id='invite-expires'
              type='date'
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
            />
          </div>
        </form>

        <div className='px-4 py-3 border-t border-gray-200 flex justify-end gap-3 shrink-0 bg-white'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl'
          >
            Cancel
          </button>
          <button
            type='submit'
            onClick={handleSubmit}
            disabled={!canSubmit}
            className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {emailsToInvite.length > 1
              ? `Send ${emailsToInvite.length} invites`
              : 'Send invite'}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default InviteTeamMemberDrawer;
