import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface FormAlertProps {
  message: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Form-level alert banner for auth flows. Matches Figma: light error background,
 * icon, message, optional action and dismiss. Renders below the form column.
 */
const FormAlert: React.FC<FormAlertProps> = ({
  message,
  onClose,
  actionLabel,
  onAction,
  className = '',
}) => (
  <div
    role='alert'
    className={`flex items-center gap-2 rounded-lg bg-error-50 px-2.5 py-2.5 text-left shadow-[0_16px_32px_0_rgba(7,7,8,0.08)] ${className}`}
  >
    <span
      className='flex h-6 w-6 shrink-0 items-center justify-center text-error-500'
      aria-hidden
    >
      <AlertCircle className='h-5 w-5' strokeWidth={2} />
    </span>
    <p className='min-w-0 flex-1 text-sm leading-5 text-gray-900'>{message}</p>
    {actionLabel && onAction && (
      <button
        type='button'
        onClick={onAction}
        className='shrink-0 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-button-primary transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      >
        {actionLabel}
      </button>
    )}
    {onClose && (
      <button
        type='button'
        onClick={onClose}
        className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-error-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        aria-label='Dismiss'
      >
        <X className='h-5 w-5' />
      </button>
    )}
  </div>
);

export default FormAlert;
