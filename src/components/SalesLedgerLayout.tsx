import React from 'react';
import { Outlet } from 'react-router-dom';
import ModuleTabs from '@/components/ModuleTabs';

const SALES_TABS = [
  { label: 'Invoice', path: '/sales/invoice', end: false },
  { label: 'Customers', path: '/sales/customers', end: false },
  { label: 'Products', path: '/sales/products', end: true },
];

const SalesLedgerLayout: React.FC = () => {
  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='heading-1'>Sales Ledger</h1>
      <ModuleTabs
        variant='router'
        tabs={SALES_TABS}
        ariaLabel='Sales ledger sections'
      />
      <Outlet />
    </div>
  );
};

export default SalesLedgerLayout;
