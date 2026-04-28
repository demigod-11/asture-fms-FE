import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

function formatDisplay(from: string, to: string): string {
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

function getMonthYear(date: Date) {
  return { year: date.getFullYear(), month: date.getMonth() };
}

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  const startDay = first.getDay();
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  className?: string;
  /** When true, only render the calendar (no trigger button). Parent controls visibility. */
  inline?: boolean;
  onClose?: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  from,
  to,
  onChange,
  className = '',
  inline = false,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<'from' | 'to'>('from');
  const [view, setView] = useState(() => {
    const d = from ? new Date(from) : new Date();
    return getMonthYear(d);
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && !inline) return;
    if (inline) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, inline]);

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  const handleDayClick = (year: number, month: number, day: number) => {
    const d = toYMD(new Date(year, month, day));
    if (selecting === 'from') {
      // When picking a new start date, reset end date to the same day.
      // This avoids "sticky" end dates (often today's date) and keeps the range valid.
      onChange(d, d);
      setSelecting('to');
    } else {
      const fromVal = from || d;
      if (d < fromVal) onChange(d, fromVal);
      else onChange(fromVal, d);
      setSelecting('from');
      setOpen(false);
      onClose?.();
    }
  };

  const days = getDaysInMonth(view.year, view.month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isInRange = (year: number, month: number, day: number) => {
    if (!fromDate || !toDate) return false;
    const t = new Date(year, month, day).getTime();
    return t >= fromDate.getTime() && t <= toDate.getTime();
  };
  const isStart = (year: number, _month: number, day: number) =>
    fromDate &&
    year === fromDate.getFullYear() &&
    view.month === fromDate.getMonth() &&
    day === fromDate.getDate();
  const isEnd = (year: number, _month: number, day: number) =>
    toDate &&
    year === toDate.getFullYear() &&
    view.month === toDate.getMonth() &&
    day === toDate.getDate();

  const calendarContent = (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-4 min-w-[280px] ${inline ? '' : 'absolute top-full left-0 mt-1 z-50'}`}
    >
      <div className='flex items-center justify-between mb-3'>
        <button
          type='button'
          onClick={() =>
            setView(v =>
              v.month === 0
                ? { year: v.year - 1, month: 11 }
                : { year: v.year, month: v.month - 1 }
            )
          }
          className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
          aria-label='Previous month'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
          {new Date(view.year, view.month).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button
          type='button'
          onClick={() =>
            setView(v =>
              v.month === 11
                ? { year: v.year + 1, month: 0 }
                : { year: v.year, month: v.month + 1 }
            )
          }
          className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
          aria-label='Next month'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-0.5 text-center'>
        {weekDays.map(w => (
          <div
            key={w}
            className='text-xs font-medium text-gray-500 dark:text-gray-400 py-1'
          >
            {w}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const inRange = isInRange(view.year, view.month, day);
          const start = isStart(view.year, view.month, day);
          const end = isEnd(view.year, view.month, day);
          return (
            <button
              key={day}
              type='button'
              onClick={() => handleDayClick(view.year, view.month, day)}
              className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                start || end
                  ? 'bg-[#073E60] text-white font-medium'
                  : inRange
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-gray-900 dark:text-gray-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
        {selecting === 'from' ? 'Select start date' : 'Select end date'}
      </p>
    </div>
  );

  if (inline) return <div className={className}>{calendarContent}</div>;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        className='input-field py-2.5 pl-3 pr-10 text-sm rounded-xl border border-gray-200 dark:border-gray-600 min-w-[240px] bg-white dark:bg-gray-800 text-left flex items-center gap-2 text-gray-900 dark:text-gray-100'
        aria-label='Select date range'
        aria-expanded={open}
      >
        <Calendar className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
        <span
          className={
            from && to
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {formatDisplay(from, to)}
        </span>
      </button>
      {open && calendarContent}
    </div>
  );
};

export default DateRangePicker;
