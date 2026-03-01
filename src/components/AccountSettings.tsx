import React from 'react';
import { User, Briefcase, CreditCard, Plug, Sliders } from 'lucide-react';

const settingsCards = [
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Personal details, password, and your active sessions.',
    icon: User,
  },
  {
    id: 'company',
    title: 'Company Details',
    description:
      'Company info, company type, address, public info, custom domain and more.',
    icon: Briefcase,
  },
  {
    id: 'billing',
    title: 'Subscription & Billing',
    description: 'Subscriptions, invoices, quotes and customer portal.',
    icon: CreditCard,
  },
  {
    id: 'connect',
    title: 'Connect',
    description: 'Manage your platform and connected accounts.',
    icon: Plug,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description:
      'Accounting, charts of account, categories, automation, language.',
    icon: Sliders,
  },
];

const AccountSettings: React.FC = () => {
  return (
    <div className='max-w-5xl'>
      <h1 className='text-2xl font-semibold text-[#1a1a1a] leading-8 mb-8'>
        Account and settings
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {settingsCards.map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              type='button'
              className='card card-hover flex gap-3 p-4 text-left border border-gray-200/80 hover:border-gray-300/80 transition-all duration-200'
            >
              <div className='flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50/80 shrink-0'>
                <Icon className='h-6 w-6 text-primary-600' />
              </div>
              <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                <p className='text-base font-semibold text-gray-900 leading-6 tracking-[-0.01em]'>
                  {card.title}
                </p>
                <p className='text-sm text-gray-500 leading-5 tracking-[-0.01em]'>
                  {card.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccountSettings;
