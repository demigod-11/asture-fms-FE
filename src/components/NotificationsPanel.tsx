import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, MailOpen } from 'lucide-react';
import PaginationFooter from '@/components/PaginationFooter';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const PER_PAGE = 5;

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  open,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAsUnread,
}) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(notifications.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return notifications.slice(start, start + PER_PAGE);
  }, [notifications, safePage]);

  if (!open) return null;

  const content = (
    <>
      <div
        className='fixed inset-0 z-[100] bg-black/50 transition-opacity'
        onClick={onClose}
        aria-hidden
      />
      <div
        className='fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col overflow-hidden border-l border-gray-200 dark:border-gray-700'
        role='dialog'
        aria-modal='true'
        aria-labelledby='notifications-panel-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <h2
            id='notifications-panel-title'
            className='text-lg font-semibold text-gray-900 dark:text-gray-100'
          >
            Notifications
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto min-h-0 flex flex-col'>
          {notifications.length === 0 ? (
            <div className='p-6 text-center text-sm text-gray-500 dark:text-gray-400'>
              No notifications yet.
            </div>
          ) : (
            <>
              <ul
                className='divide-y divide-gray-100 dark:divide-gray-700 flex-1 min-h-0'
                role='list'
              >
                {paginated.map(n => (
                  <li
                    key={n.id}
                    className='px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/80'
                  >
                    <div className='flex gap-3'>
                      <span
                        className='shrink-0 mt-0.5 text-gray-400 dark:text-gray-500'
                        aria-hidden
                      >
                        {n.read ? (
                          <MailOpen className='h-4 w-4' />
                        ) : (
                          <Mail className='h-4 w-4' />
                        )}
                      </span>
                      <div className='min-w-0 flex-1'>
                        <p
                          className={`text-sm font-medium ${n.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}
                        >
                          {n.title}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2'>
                          {n.body}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                          {n.createdAt}
                        </p>
                        <button
                          type='button'
                          onClick={() =>
                            n.read ? onMarkAsUnread(n.id) : onMarkAsRead(n.id)
                          }
                          className='mt-2 text-xs font-medium text-[#073E60] dark:text-primary-400 hover:text-[#052d47] dark:hover:text-primary-300 hover:underline'
                        >
                          {n.read ? 'Mark as unread' : 'Mark as read'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className='border-t border-gray-200 dark:border-gray-700 shrink-0'>
                <PaginationFooter
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  defaultPerPage={PER_PAGE}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default NotificationsPanel;
