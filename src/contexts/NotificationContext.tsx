import React, { createContext, useCallback, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { Check, AlertCircle, Info } from 'lucide-react';

export type NotificationVariant = 'success' | 'error' | 'info';

interface NotificationOptions {
  variant: NotificationVariant;
  message: string;
  title?: string;
}

interface NotificationContextValue {
  notify: (options: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

const variantStyles: Record<
  NotificationVariant,
  { bg: string; icon: React.ElementType; iconBg: string }
> = {
  success: {
    bg: 'bg-success-600',
    icon: Check,
    iconBg: 'bg-white/20',
  },
  error: {
    bg: 'bg-error-600',
    icon: AlertCircle,
    iconBg: 'bg-white/20',
  },
  info: {
    bg: 'bg-primary-600',
    icon: Info,
    iconBg: 'bg-white/20',
  },
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<NotificationOptions | null>(null);

  const notify = useCallback((options: NotificationOptions) => {
    setToast(options);
    setOpen(true);
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) setToast(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      <Toast.Provider duration={5000} swipeDirection='right'>
        {children}
        {toast && (
          <Toast.Root
            open={open}
            onOpenChange={onOpenChange}
            className={`flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-white text-sm shadow-lg ${variantStyles[toast.variant].bg}`}
          >
            <span
              className={`flex shrink-0 w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full ${variantStyles[toast.variant].iconBg}`}
            >
              {React.createElement(variantStyles[toast.variant].icon, {
                className: 'h-3.5 w-3.5 sm:h-4 sm:w-4',
                'aria-hidden': true,
              })}
            </span>
            <div className='flex-1 min-w-0'>
              {toast.title && (
                <Toast.Title className='font-semibold'>
                  {toast.title}
                </Toast.Title>
              )}
              <Toast.Description
                className={toast.title ? 'text-white/90 text-xs mt-0.5' : ''}
              >
                {toast.message}
              </Toast.Description>
            </div>
          </Toast.Root>
        )}
        <Toast.Viewport className='fixed top-4 right-4 z-[100] flex max-w-[360px] flex-col gap-2 outline-none' />
      </Toast.Provider>
    </NotificationContext.Provider>
  );
};

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
}
