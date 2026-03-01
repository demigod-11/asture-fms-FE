import React from 'react';
import { Printer, Search } from 'lucide-react';
import TooltipButton from '@/components/TooltipButton';
import FiscalOrRangePicker from './FiscalOrRangePicker';
import DateRangePicker from './DateRangePicker';

export interface ReportToolbarState {
  fiscalPeriod: string;
  customFrom: string;
  customTo: string;
  compareEnabled: boolean;
  compareFrom: string;
  compareTo: string;
  searchQuery: string;
}

function getDefaultDates() {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, '0');
  const d = String(t.getDate()).padStart(2, '0');
  const today = `${y}-${m}-${d}`;
  const startOfYear = `${y}-01-01`;
  return { today, startOfYear };
}

export function getDefaultReportToolbarState(): ReportToolbarState {
  const { today, startOfYear } = getDefaultDates();
  return {
    fiscalPeriod: 'last-year',
    customFrom: startOfYear,
    customTo: today,
    compareEnabled: false,
    compareFrom: startOfYear,
    compareTo: today,
    searchQuery: '',
  };
}

interface ReportToolbarProps {
  state: ReportToolbarState;
  onStateChange: (state: ReportToolbarState) => void;
  onRunReport?: () => void;
  showDateFilter?: boolean;
  showComparative?: boolean;
  /** Show Run report button. Default true. Set false for AR/AP aging. */
  showRunReport?: boolean;
  /** Show search (icon + input) instead of date filters. For AR/AP aging. */
  showSearch?: boolean;
}

const ReportToolbar: React.FC<ReportToolbarProps> = ({
  state,
  onStateChange,
  onRunReport,
  showDateFilter = true,
  showComparative = true,
  showRunReport = true,
  showSearch = false,
}) => {
  const update = (patch: Partial<ReportToolbarState>) => {
    onStateChange({ ...state, ...patch });
  };

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {showSearch && (
        <div className='relative flex-1 min-w-[200px] max-w-xs'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <input
            type='search'
            placeholder='Search...'
            value={state.searchQuery}
            onChange={e => update({ searchQuery: e.target.value })}
            className='input-field py-2.5 pl-9 pr-3 text-sm rounded-xl border border-gray-200 w-full'
            aria-label='Search'
          />
        </div>
      )}

      {showDateFilter && (
        <>
          <FiscalOrRangePicker
            fiscalPeriod={state.fiscalPeriod}
            customFrom={state.customFrom}
            customTo={state.customTo}
            onFiscalChange={fiscalPeriod => update({ fiscalPeriod })}
            onRangeChange={(customFrom, customTo) =>
              update({ customFrom, customTo })
            }
          />

          {showComparative && (
            <>
              <label className='flex items-center gap-2 cursor-pointer select-none shrink-0'>
                <input
                  type='checkbox'
                  checked={state.compareEnabled}
                  onChange={e => update({ compareEnabled: e.target.checked })}
                  className='rounded border-gray-300 accent-[#073E60] text-[#073E60] focus:ring-2 focus:ring-[#073E60]'
                />
                <span className='text-sm font-medium text-gray-700'>
                  Compare with another period
                </span>
              </label>

              {state.compareEnabled && (
                <DateRangePicker
                  from={state.compareFrom}
                  to={state.compareTo}
                  onChange={(compareFrom, compareTo) =>
                    update({ compareFrom, compareTo })
                  }
                />
              )}
            </>
          )}
        </>
      )}

      {showRunReport && (
        <button
          type='button'
          onClick={onRunReport}
          className='px-4 py-2.5 text-sm font-medium rounded-xl bg-[#073E60] text-white hover:bg-[#052d47] transition-colors shrink-0'
        >
          Run report
        </button>
      )}

      <div className='flex-1 min-w-0' aria-hidden />

      <TooltipButton
        title='Print'
        ariaLabel='Print'
        className='p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0'
      >
        <Printer className='h-5 w-5' />
      </TooltipButton>
    </div>
  );
};

export default ReportToolbar;
