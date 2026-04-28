import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import {
  DATE_FILTER_PRESETS,
  formatCustomRangeDisplay,
  getDefaultCustomRange,
  type DateFilterPresetKey,
} from '@/lib/dateFilters';

export interface DateFilterState {
  preset: DateFilterPresetKey;
  customFrom: string;
  customTo: string;
}

export function getDefaultDateFilterState(): DateFilterState {
  const { from, to } = getDefaultCustomRange();
  return {
    preset: 'last-90',
    customFrom: from,
    customTo: to,
  };
}

interface DateFilterDropdownProps {
  state: DateFilterState;
  onStateChange: (state: DateFilterState) => void;
  className?: string;
}

/**
 * Unified date filter: Last 7 / 30 / 90 days + Custom.
 * When Custom is selected, displays range as "May 1 – May 2, 2026".
 */
const DateFilterDropdown: React.FC<DateFilterDropdownProps> = ({
  state,
  onStateChange,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isCustom = state.preset === 'custom';
  const hasRange = isCustom && state.customFrom && state.customTo;
  const displayLabel =
    isCustom && hasRange
      ? formatCustomRangeDisplay(state.customFrom, state.customTo)
      : (DATE_FILTER_PRESETS.find(p => p.value === state.preset)?.label ??
        'Select period');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const update = (patch: Partial<DateFilterState>) => {
    onStateChange({ ...state, ...patch });
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        className='input-field py-2.5 pl-3 pr-10 text-sm rounded-xl border border-gray-200 dark:border-gray-600 min-w-[200px] bg-white dark:bg-gray-800 text-left flex items-center gap-2 text-gray-900 dark:text-gray-100'
        aria-label='Date range filter'
        aria-expanded={open}
      >
        <Calendar className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
        <span
          className={
            hasRange
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {displayLabel}
        </span>
        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none' />
      </button>

      {open && (
        <div className='absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden min-w-[200px]'>
          <div className='p-2 border-b border-gray-100 dark:border-gray-700'>
            {DATE_FILTER_PRESETS.map(opt => (
              <button
                key={opt.value}
                type='button'
                onClick={() => {
                  update({ preset: opt.value });
                  if (opt.value !== 'custom') setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${state.preset === opt.value ? 'bg-primary-50 dark:bg-primary-900/40 text-[#073E60] dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {isCustom && (
            <div className='p-2'>
              <DateRangePicker
                from={state.customFrom}
                to={state.customTo}
                onChange={(customFrom, customTo) => {
                  update({ customFrom, customTo });
                }}
                inline
                onClose={() => setOpen(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateFilterDropdown;
