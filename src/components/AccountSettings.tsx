import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Briefcase,
  CreditCard,
  Plug,
  Sliders,
  FileText,
} from 'lucide-react';

const settingsCards = [
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Personal details, password, and your active sessions.',
    icon: User,
    path: '/settings/personal',
  },
  {
    id: 'company',
    title: 'Company Details',
    description:
      'Company info, company type, address, public info, custom domain and more.',
    icon: Briefcase,
    path: '/settings/company',
  },
  {
    id: 'audit-log',
    title: 'Audit Log',
    description: 'View organisation activity and audit trail.',
    icon: FileText,
    path: '/settings/audit-log',
  },
  {
    id: 'billing',
    title: 'Subscription & Billing',
    description: 'Subscriptions, invoices, quotes and customer portal.',
    icon: CreditCard,
    path: null,
  },
  {
    id: 'connect',
    title: 'Connect',
    description: 'Manage your platform and connected accounts.',
    icon: Plug,
    path: null,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description:
      'Accounting, charts of account, categories, automation, language.',
    icon: Sliders,
    path: '/settings/advanced',
  },
];

const AccountSettings: React.FC = () => {
  return (
    <div className='max-w-5xl'>
      <h1 className='heading-1 mb-8'>Account and settings</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {settingsCards.map(card => {
          const Icon = card.icon;
          const cardClass =
            'card card-hover flex gap-3 p-4 text-left border border-gray-200/80 dark:border-gray-600 hover:border-gray-300/80 dark:hover:border-gray-500 transition-all duration-200';
          const content = (
            <>
              <div className='flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50/80 dark:bg-primary-900/40 shrink-0'>
                <Icon className='h-6 w-6 text-primary-600 dark:text-primary-400' />
              </div>
              <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                <p className='heading-3 leading-6 tracking-[-0.01em]'>
                  {card.title}
                </p>
                <p className='body-muted leading-5 tracking-[-0.01em]'>
                  {card.description}
                </p>
              </div>
            </>
          );
          if (card.path) {
            return (
              <Link key={card.id} to={card.path} className={cardClass}>
                {content}
              </Link>
            );
          }
          return (
            <button key={card.id} type='button' className={cardClass} disabled>
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccountSettings;
