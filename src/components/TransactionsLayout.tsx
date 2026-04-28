import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ModuleTabs from '@/components/ModuleTabs';

const TRANSACTION_TABS = [
  {
    label: 'Bank transactions',
    path: '/transactions/bank-transactions',
    end: true,
  },
  {
    label: 'Bank reconciliation',
    path: '/transactions/bank-reconciliation',
    end: false,
  },
  {
    label: 'Chart of accounts',
    path: '/transactions/chart-of-accounts',
    end: true,
  },
];

const TransactionsLayout: React.FC = () => {
  const location = useLocation();
  const getIsActive = (path: string) => {
    if (path === '/transactions/bank-reconciliation') {
      return (
        location.pathname === '/transactions/bank-reconciliation' ||
        location.pathname === '/transactions/reconcile'
      );
    }
    return location.pathname === path;
  };

  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='heading-1'>Transactions</h1>
      <ModuleTabs
        variant='router'
        tabs={TRANSACTION_TABS}
        ariaLabel='Transaction sections'
        getIsActive={getIsActive}
      />
      <Outlet />
    </div>
  );
};

export default TransactionsLayout;
