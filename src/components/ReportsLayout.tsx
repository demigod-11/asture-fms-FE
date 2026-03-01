import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const REPORT_TABS = [
  { label: 'Profit & loss', path: '/reports/profit-loss' },
  { label: 'Balance sheet', path: '/reports/balance-sheet' },
  { label: 'A/R aging summary', path: '/reports/ar-aging' },
  { label: 'A/P aging summary', path: '/reports/ap-aging' },
];

const ReportsLayout: React.FC = () => {
  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
        Reports
      </h1>
      <nav
        className='flex gap-0.5 border-b border-gray-200/90'
        aria-label='Report types'
      >
        {REPORT_TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px rounded-t-lg ${
                isActive
                  ? 'border-primary-600 text-primary-600 bg-primary-50/30'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export default ReportsLayout;
