import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleReportSectionProps {
  title: string;
  total: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  level?: 0 | 1 | 2 | 3;
}

const CollapsibleReportSection: React.FC<CollapsibleReportSectionProps> = ({
  title,
  total,
  children,
  defaultOpen = true,
  level = 0,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const paddingLeft = level === 0 ? 0 : level === 1 ? 4 : level === 2 ? 8 : 12;

  return (
    <div className='border-b border-gray-100 last:border-b-0'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between py-2.5 text-left hover:bg-gray-50/50 transition-colors'
        style={{ paddingLeft: `${paddingLeft * 0.25}rem` }}
      >
        <span className='flex items-center gap-1.5'>
          {open ? (
            <ChevronDown className='h-4 w-4 text-gray-500 shrink-0' />
          ) : (
            <ChevronRight className='h-4 w-4 text-gray-500 shrink-0' />
          )}
          <span
            className={`font-medium text-gray-900 ${level === 0 ? 'text-sm' : 'text-sm'}`}
          >
            {title}
          </span>
        </span>
        <span className='font-semibold text-gray-900 tabular-nums'>
          {total}
        </span>
      </button>
      {open && <div className='pb-1'>{children}</div>}
    </div>
  );
};

export default CollapsibleReportSection;
