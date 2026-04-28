import React from 'react';
import { Outlet } from 'react-router-dom';
import ModuleTabs from '@/components/ModuleTabs';

const ADVANCED_TABS = [
  { label: 'Tags', path: '/settings/advanced/tags', end: false },
  {
    label: 'COA categories',
    path: '/settings/advanced/coa-categories',
    end: true,
  },
];

const AdvancedSettingsLayout: React.FC = () => {
  return (
    <div className='space-y-5 sm:space-y-6'>
      <h1 className='heading-1'>Advanced</h1>
      <ModuleTabs
        variant='router'
        tabs={ADVANCED_TABS}
        ariaLabel='Advanced settings sections'
      />
      <Outlet />
    </div>
  );
};

export default AdvancedSettingsLayout;
