import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const TRANSACTION_TABS = [
  { label: 'Bank transactions', path: '/transactions/bank-transactions' },
  { label: 'Bank reconciliation', path: '/transactions/bank-reconciliation' },
  { label: 'Chart of accounts', path: '/transactions/chart-of-accounts' },
];

const TransactionsLayout: React.FC = () => {
  const location = useLocation();
  const isReconcileActive =
    location.pathname === '/transactions/bank-reconciliation' ||
    location.pathname === '/transactions/reconcile';

  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
        Transactions
      </h1>
      <nav
        className='flex gap-0.5 border-b border-gray-200/90'
        aria-label='Transaction sections'
      >
        {TRANSACTION_TABS.map(tab => {
          const resolveActive = ({ isActive }: { isActive: boolean }) => {
            const active =
              tab.path === '/transactions/bank-reconciliation'
                ? isReconcileActive
                : isActive;
            return `px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px rounded-t-lg ${
              active
                ? 'border-primary-600 text-primary-600 bg-primary-50/30'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
            }`;
          };
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path !== '/transactions/bank-reconciliation'}
              className={resolveActive}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
};

export default TransactionsLayout;
