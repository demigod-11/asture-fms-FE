import React from 'react';
import { AlertCircle, Info, AlertTriangle, X, Check } from 'lucide-react';

export type AlertVariant = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  variant: AlertVariant;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { bg: string; icon: React.ElementType; iconBg: string }
> = {
  error: {
    bg: 'bg-error-600',
    icon: AlertCircle,
    iconBg: 'bg-white/20',
  },
  warning: {
    bg: 'bg-warning-500',
    icon: AlertTriangle,
    iconBg: 'bg-white/20',
  },
  info: {
    bg: 'bg-primary-600',
    icon: Info,
    iconBg: 'bg-white/20',
  },
  success: {
    bg: 'bg-success-600',
    icon: Check,
    iconBg: 'bg-white/20',
  },
};

const Alert: React.FC<AlertProps> = ({
  variant,
  message,
  actionLabel,
  onAction,
  onClose,
  className = '',
}) => {
  const { bg, icon: Icon, iconBg } = variantStyles[variant];

  return (
    <div
      role='alert'
      className={`flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-white text-sm ${bg} ${className}`}
    >
      <span className={`flex shrink-0 w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className='h-3.5 w-3.5 sm:h-4 sm:w-4' aria-hidden />
      </span>
      <p className='flex-1 min-w-0'>{message}</p>
      {actionLabel && onAction && (
        <button
          type='button'
          onClick={onAction}
          className='shrink-0 font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded'
        >
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button
          type='button'
          onClick={onClose}
          className='shrink-0 p-1 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50'
          aria-label='Dismiss'
        >
          <X className='h-4 w-4' />
        </button>
      )}
    </div>
  );
};

export default Alert;
