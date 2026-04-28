import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Check } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthPageHeader from '@/components/auth/AuthPageHeader';

const TRIAL_FEATURES = [
  'Unlimited invoices and bills',
  'Sales & purchase ledger',
  'Reports and analytics',
  'Bank transactions & reconciliation',
  'Team collaboration',
];

const StartFreeTrial: React.FC = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/home', { replace: true });
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <AuthPageHeader
          title='Start your free trial'
          subtitle='Get full access to Asture FMS. No credit card required.'
          variant='icon'
          icon={<Rocket className='h-8 w-8 text-primary-600' />}
        />
        <ul className='space-y-3'>
          {TRIAL_FEATURES.map(feature => (
            <li
              key={feature}
              className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200'
            >
              <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'>
                <Check className='h-3 w-3' />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <button
          type='button'
          onClick={handleStartTrial}
          className='w-full btn-primary py-3 px-4 rounded-xl'
        >
          Start free trial
        </button>
        <p className='text-center text-xs text-gray-500 dark:text-gray-300'>
          You can cancel anytime. We’ll remind you before your trial ends.
        </p>
      </div>
    </AuthLayout>
  );
};

export default StartFreeTrial;
