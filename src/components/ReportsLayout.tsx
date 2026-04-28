import React from 'react';
import { Outlet } from 'react-router-dom';
import ModuleTabs from '@/components/ModuleTabs';

const REPORT_TABS = [
  { label: 'Profit & loss', path: '/reports/profit-loss', end: true },
  { label: 'Balance sheet', path: '/reports/balance-sheet', end: true },
  { label: 'A/R aging summary', path: '/reports/ar-aging', end: true },
  { label: 'A/P aging summary', path: '/reports/ap-aging', end: true },
];

const ReportsLayout: React.FC = () => {
  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='heading-1'>Reports</h1>
      <ModuleTabs
        variant='router'
        tabs={REPORT_TABS}
        ariaLabel='Report types'
      />
      <Outlet />
    </div>
  );
};

export default ReportsLayout;
