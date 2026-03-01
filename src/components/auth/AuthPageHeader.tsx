import React from 'react';
import logo from '@/assets/logo.svg';

interface AuthPageHeaderProps {
  title: string;
  subtitle?: string;
  variant: 'logo' | 'icon';
  icon?: React.ReactNode;
}

const AuthPageHeader: React.FC<AuthPageHeaderProps> = ({
  title,
  subtitle,
  variant,
  icon,
}) => (
  <>
    <div className='flex justify-center'>
      {variant === 'logo' ? (
        <img src={logo} alt='Asture FMS' className='w-16 h-16' />
      ) : (
        <span className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50'>
          {icon}
        </span>
      )}
    </div>
    <div className='text-center space-y-2'>
      <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
        {title}
      </h1>
      {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
    </div>
  </>
);

export default AuthPageHeader;
