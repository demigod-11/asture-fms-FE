import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export interface RowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  extra?: React.ReactNode;
  confirmMessage?: string;
  editLabel?: string;
  deleteLabel?: string;
}

const RowActions: React.FC<RowActionsProps> = ({
  onEdit,
  onDelete,
  extra,
  confirmMessage = 'Delete this item?',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}) => {
  return (
    <div className='flex items-center gap-1'>
      {extra}
      {onEdit ? (
        <button
          type='button'
          onClick={onEdit}
          className='p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
          aria-label={editLabel}
        >
          <Pencil className='h-4 w-4' />
        </button>
      ) : null}
      {onDelete ? (
        <button
          type='button'
          onClick={() => {
            if (window.confirm(confirmMessage)) onDelete();
          }}
          className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded'
          aria-label={deleteLabel}
        >
          <Trash2 className='h-4 w-4' />
        </button>
      ) : null}
    </div>
  );
};

export default RowActions;
