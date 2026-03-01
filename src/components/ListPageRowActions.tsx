import React from 'react';
import { MoreHorizontal } from 'lucide-react';

/** Same row-actions button used across list pages (Products, Bills, Vendors, etc.). */
const ListPageRowActions: React.FC<{ onClick?: () => void }> = ({
  onClick,
}) => (
  <button
    type='button'
    onClick={onClick}
    className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded'
    aria-label='More options'
  >
    <MoreHorizontal className='h-4 w-4' />
  </button>
);

export default ListPageRowActions;
