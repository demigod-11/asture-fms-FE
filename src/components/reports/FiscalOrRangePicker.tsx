import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

const FISCAL_OPTIONS = [
  { value: 'last-year', label: 'Last fiscal year' },
  { value: 'this-year', label: 'This fiscal year' },
  { value: 'last-quarter', label: 'Last quarter' },
  { value: 'custom', label: 'Custom' },
];

function formatRangeDisplay(from: string, to: string): string {
  if (!from || !to) return 'Select dates';
  const f = new Date(from);
  const t = new Date(to);
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return `${f.toLocaleDateString('en-GB', opts)} – ${t.toLocaleDateString('en-GB', opts)}`;
}

interface FiscalOrRangePickerProps {
  fiscalPeriod: string;
  customFrom: string;
  customTo: string;
  onFiscalChange: (value: string) => void;
  onRangeChange: (from: string, to: string) => void;
  className?: string;
}

/**
 * One box: shows preset label or, when Custom and dates selected, the date range.
 * Click: open dropdown (presets) or when Custom open popover with presets + calendar.
 */
const FiscalOrRangePicker: React.FC<FiscalOrRangePickerProps> = ({
  fiscalPeriod,
  customFrom,
  customTo,
  onFiscalChange,
  onRangeChange,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isCustom = fiscalPeriod === 'custom';
  const hasRange = isCustom && customFrom && customTo;
  const displayLabel =
    isCustom && hasRange
      ? formatRangeDisplay(customFrom, customTo)
      : (FISCAL_OPTIONS.find(o => o.value === fiscalPeriod)?.label ??
        'Select period');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        className='input-field py-2.5 pl-3 pr-10 text-sm rounded-xl border border-gray-200 min-w-[220px] bg-white text-left flex items-center gap-2'
        aria-label='Fiscal period or date range'
        aria-expanded={open}
      >
        <Calendar className='h-4 w-4 text-gray-400 shrink-0' />
        <span className={hasRange ? 'text-gray-900' : 'text-gray-500'}>
          {displayLabel}
        </span>
        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
      </button>

      {open && (
        <div className='absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[220px]'>
          <div className='p-2 border-b border-gray-100'>
            {FISCAL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type='button'
                onClick={() => {
                  onFiscalChange(opt.value);
                  if (opt.value !== 'custom') setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${fiscalPeriod === opt.value ? 'bg-primary-50 text-[#073E60] font-medium' : 'text-gray-700'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {isCustom && (
            <div className='p-2'>
              <DateRangePicker
                from={customFrom}
                to={customTo}
                onChange={(from, to) => {
                  onRangeChange(from, to);
                  setOpen(false);
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

export default FiscalOrRangePicker;
