import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import {
  ALL_PERMISSIONS,
  GROUP_LABELS,
  type PermissionId,
} from '@/lib/rolesAndPermissions';

interface EditRoleDrawerProps {
  open: boolean;
  onClose: () => void;
  roleLabel: string;
  isDefault: boolean;
  initialPermissions: PermissionId[];
  fullAccess?: boolean;
  onSave: (permissions: PermissionId[]) => void;
  onDelete?: () => void;
}

const byGroup = ALL_PERMISSIONS.reduce<Record<string, typeof ALL_PERMISSIONS>>(
  (acc, p) => {
    const g = p.group;
    if (!acc[g]) acc[g] = [];
    acc[g].push(p);
    return acc;
  },
  {}
);

const ALL_IDS = ALL_PERMISSIONS.map(p => p.id) as PermissionId[];

const EditRoleDrawer: React.FC<EditRoleDrawerProps> = ({
  open,
  onClose,
  roleLabel,
  isDefault,
  initialPermissions,
  fullAccess,
  onSave,
  onDelete,
}) => {
  const [permissions, setPermissions] =
    useState<PermissionId[]>(initialPermissions);
  const [allSelected, setAllSelected] = useState(!!fullAccess);

  useEffect(() => {
    setPermissions(initialPermissions);
    setAllSelected(!!fullAccess);
  }, [open, initialPermissions, fullAccess]);

  const togglePermission = (id: PermissionId) => {
    setPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setAllSelected(false);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setPermissions([]);
      setAllSelected(false);
    } else {
      setPermissions(ALL_IDS);
      setAllSelected(true);
    }
  };

  const handleSave = () => {
    onSave(allSelected ? ALL_IDS : permissions);
    onClose();
  };

  if (!open) return null;

  const content = (
    <>
      <div
        className='fixed inset-0 z-[100] bg-black/50 transition-opacity'
        onClick={onClose}
        aria-hidden
      />
      <div
        className='fixed top-0 right-0 bottom-0 z-[101] w-full max-w-lg bg-white shadow-xl flex flex-col overflow-hidden'
        role='dialog'
        aria-modal='true'
        aria-labelledby='edit-role-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0'>
          <h2
            id='edit-role-title'
            className='text-lg font-semibold text-gray-900'
          >
            Edit role: {roleLabel}
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4'>
          {isDefault && (
            <p className='text-sm text-gray-500'>
              Default roles can have their permissions adjusted but cannot be
              deleted.
            </p>
          )}

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='edit-role-select-all'
              checked={allSelected}
              onChange={handleSelectAll}
              className='rounded border-gray-300 accent-[#073E60]'
            />
            <label
              htmlFor='edit-role-select-all'
              className='text-sm font-medium text-gray-900'
            >
              All permissions
            </label>
          </div>

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
                          id={`edit-${p.id}`}
                          checked={permissions.includes(p.id)}
                          onChange={() => togglePermission(p.id)}
                          className='mt-1 rounded border-gray-300 accent-[#073E60]'
                        />
                        <label
                          htmlFor={`edit-${p.id}`}
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

        <div className='px-4 py-3 border-t border-gray-200 flex justify-between gap-3 shrink-0 bg-white'>
          <div>
            {!isDefault && onDelete && (
              <button
                type='button'
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className='px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl'
              >
                Delete role
              </button>
            )}
          </div>
          <div className='flex gap-3 ml-auto'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSave}
              className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl'
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default EditRoleDrawer;
