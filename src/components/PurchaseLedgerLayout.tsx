import React from 'react';
import { Outlet } from 'react-router-dom';
import ModuleTabs from '@/components/ModuleTabs';

const PURCHASE_TABS = [
  { label: 'Bills', path: '/purchase/bills', end: true },
  { label: 'Vendor', path: '/purchase/vendor', end: true },
  { label: 'Expense', path: '/purchase/expense', end: true },
];

const PurchaseLedgerLayout: React.FC = () => {
  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='heading-1'>Purchase Ledger</h1>
      <ModuleTabs
        variant='router'
        tabs={PURCHASE_TABS}
        ariaLabel='Purchase ledger sections'
      />
      <Outlet />
    </div>
  );
};

export default PurchaseLedgerLayout;
