import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Upload, Plus } from 'lucide-react';
import TooltipButton from '@/components/TooltipButton';

export interface ListPageToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** If set, shows Filter button with this label (label hidden on small screens). */
  filterLabel?: string;
  /** Optional node before Import/Export (e.g. "Last 90 days" button). */
  rightSlot?: React.ReactNode;
  /** If set, primary is a Link; otherwise use onPrimaryClick. */
  primaryTo?: string;
  onPrimaryClick?: () => void;
  /** Optional node at start of toolbar row (e.g. account dropdown). */
  leftSlot?: React.ReactNode;
  /** Primary CTA label; omit to hide (e.g. Bank transactions has no New button). */
  primaryLabel?: string;
}

const ListPageToolbar: React.FC<ListPageToolbarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterLabel,
  rightSlot,
  primaryLabel,
  primaryTo,
  onPrimaryClick,
  leftSlot,
}) => {
  const showPrimary =
    primaryLabel != null && (primaryTo != null || onPrimaryClick != null);
  const actions = (
    <div className='flex flex-wrap items-center gap-2'>
      {filterLabel != null && (
        <button
          type='button'
          className='btn-secondary inline-flex items-center gap-2'
        >
          <Filter className='h-4 w-4' />
          <span className='hidden sm:inline'>{filterLabel}</span>
        </button>
      )}
      {rightSlot}
      <span className='inline-flex items-center gap-0.5 px-2 py-2 rounded-xl border border-gray-200/90 bg-white shadow-input'>
        <TooltipButton
          title='Import'
          ariaLabel='Import'
          className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <Upload className='h-4 w-4 text-gray-600' />
        </TooltipButton>
        <TooltipButton
          title='Export'
          ariaLabel='Export'
          className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <Download className='h-4 w-4 text-gray-600' />
        </TooltipButton>
      </span>
      {showPrimary &&
        (primaryTo ? (
          <Link
            to={primaryTo}
            className='btn-primary inline-flex items-center gap-2'
          >
            <Plus className='h-4 w-4' /> {primaryLabel}
          </Link>
        ) : (
          <button
            type='button'
            onClick={onPrimaryClick}
            className='btn-primary inline-flex items-center gap-2'
          >
            <Plus className='h-4 w-4' /> {primaryLabel}
          </button>
        ))}
    </div>
  );

  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
      {leftSlot}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${leftSlot ? 'flex-1 min-w-0' : 'flex-1'}`}
      >
        <div className='relative flex-1 max-w-xs'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
          <input
            type='search'
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className='input-field pl-10 w-full'
          />
        </div>
        {actions}
      </div>
    </div>
  );
};

export default ListPageToolbar;
