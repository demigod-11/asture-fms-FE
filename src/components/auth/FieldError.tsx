import React from 'react';
import errorIcon from '@/assets/error-icon.svg';

interface FieldErrorProps {
  message: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ message }) => (
  <p className='text-sm text-error-500 flex items-center gap-1'>
    <img src={errorIcon} alt='' className='h-4 w-4' />
    {message}
  </p>
);

export default FieldError;
