import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  FileText,
  Receipt,
  Settings,
  Users,
  Cog,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  FileSpreadsheet,
  UserCircle,
  Package,
  Briefcase,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import NotificationsPanel, {
  type NotificationItem,
} from '@/components/NotificationsPanel';
import KnowledgeBasePanel from '@/components/KnowledgeBasePanel';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const salesLedgerChildren = [
  { label: 'Invoice', path: '/sales/invoice', icon: FileSpreadsheet },
  { label: 'Customers', path: '/sales/customers', icon: UserCircle },
  { label: 'Products', path: '/sales/products', icon: Package },
];

const purchaseLedgerChildren = [
  { label: 'Bills', path: '/purchase/bills', icon: FileSpreadsheet },
  { label: 'Vendor', path: '/purchase/vendor', icon: UserCircle },
  { label: 'Expense', path: '/purchase/expense', icon: Receipt },
];

const reportsChildren = [
  { label: 'Profit & loss', path: '/reports/profit-loss', icon: FileText },
  { label: 'Balance sheet', path: '/reports/balance-sheet', icon: FileText },
  { label: 'A/R aging summary', path: '/reports/ar-aging', icon: FileText },
  { label: 'A/P aging summary', path: '/reports/ap-aging', icon: FileText },
];

const mainNav = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  {
    label: 'Sales ledger',
    path: '/sales',
    icon: BookOpen,
    hasDropdown: true,
    children: salesLedgerChildren,
  },
  {
    label: 'Purchase ledger',
    path: '/purchase',
    icon: ShoppingCart,
    hasDropdown: true,
    children: purchaseLedgerChildren,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: FileText,
    hasDropdown: true,
    children: reportsChildren,
  },
  { label: 'Transactions', path: '/transactions', icon: Receipt },
];

const managementNav = [
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Integration', path: '/integration', icon: Cog },
  { label: 'Settings', path: '/settings', icon: Settings },
];

function profileInitials(
  firstName: string,
  lastName: string,
  email: string
): string {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return '?';
}

const NavContent: React.FC<{
  location: ReturnType<typeof useLocation>;
  onNavClick?: () => void;
  expandedSections: Record<string, boolean>;
  onSectionToggle: (path: string) => void;
}> = ({ location, onNavClick, expandedSections, onSectionToggle }) => {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <p className='px-1 py-1 text-xs font-medium text-[#a3a3a3] dark:text-gray-500 uppercase tracking-wider'>
          Main
        </p>
        <div className='flex flex-col gap-1'>
          {mainNav.map(item => {
            const hasChildren = 'children' in item && item.children?.length;
            const isParentActive =
              hasChildren &&
              item.children?.some(
                (c: { path: string }) => location.pathname === c.path
              );
            const isActive =
              !hasChildren &&
              (location.pathname === item.path ||
                (item.path === '/' && location.pathname === '/home'));
            const isExpanded =
              hasChildren &&
              (expandedSections[item.path] ??
                location.pathname.startsWith(item.path));
            const Icon = item.icon;
            if (hasChildren && item.children?.length) {
              return (
                <div key={item.path}>
                  <button
                    type='button'
                    onClick={() => onSectionToggle(item.path)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      isParentActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-900/40'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className='flex items-center gap-2'>
                      <Icon className='h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400' />
                      {item.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
                    ) : (
                      <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
                    )}
                  </button>
                  {isExpanded && (
                    <div className='ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-200/80 dark:border-gray-600 pl-2.5'>
                      {item.children.map(
                        (child: {
                          label: string;
                          path: string;
                          icon: React.ElementType;
                        }) => {
                          const ChildIcon = child.icon;
                          const childActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={onNavClick}
                              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                childActive
                                  ? 'bg-primary-50/80 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <ChildIcon className='h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400' />
                              {child.label}
                            </Link>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50/80 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <Icon className='h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400' />
                  {item.label}
                </span>
                {item.hasDropdown && (
                  <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      {/* Small space between Main and Management - per Figma */}
      <div className='pt-12 pb-4'>
        <p className='px-1 py-1 text-xs font-medium text-[#a3a3a3] dark:text-gray-500 uppercase tracking-wider'>
          Management
        </p>
        <div className='flex flex-col gap-1'>
          {managementNav.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50/80 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className='h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400' />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Invoice paid',
    body: 'INV-2023-001 was paid by Michael Brown.',
    read: false,
    createdAt: '2 min ago',
  },
  {
    id: '2',
    title: 'New customer',
    body: 'Jane Smith was added to your customers.',
    read: false,
    createdAt: '1 hour ago',
  },
  {
    id: '3',
    title: 'Bill overdue',
    body: 'Bill #B-104 is overdue. Please follow up.',
    read: true,
    createdAt: 'Yesterday',
  },
  {
    id: '4',
    title: 'Report ready',
    body: 'Your Profit & Loss report for Q1 is ready.',
    read: true,
    createdAt: 'Mar 15',
  },
  {
    id: '5',
    title: 'Payment received',
    body: '__CUR_45000__ received for INV-2023-002 from Chidi Okeke.',
    read: false,
    createdAt: '2 hours ago',
  },
  {
    id: '6',
    title: 'Expense approved',
    body: 'Expense #EXP-089 has been approved for reimbursement.',
    read: true,
    createdAt: 'Mar 14',
  },
  {
    id: '7',
    title: 'Vendor invoice',
    body: 'New bill from Acme Supplies for __CUR_120000__ is pending.',
    read: false,
    createdAt: 'Mar 14',
  },
  {
    id: '8',
    title: 'Balance sheet ready',
    body: 'Your Balance sheet report for February is ready to view.',
    read: true,
    createdAt: 'Mar 13',
  },
  {
    id: '9',
    title: 'Customer reminder',
    body: 'Reminder: Invoice INV-2023-005 is due in 3 days.',
    read: false,
    createdAt: 'Mar 12',
  },
  {
    id: '10',
    title: 'Subscription renewal',
    body: 'Your Asture FMS subscription will renew on Apr 1, 2025.',
    read: true,
    createdAt: 'Mar 10',
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    user,
    profiles,
    loading,
    ensureLoaded,
    clear: clearProfile,
  } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const { formatCurrency } = useCurrency();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const notificationsWithCurrency = React.useMemo(
    () =>
      notifications.map(n => ({
        ...n,
        body: n.body
          .replace('__CUR_45000__', formatCurrency(45000))
          .replace('__CUR_120000__', formatCurrency(120000)),
      })),
    [notifications, formatCurrency]
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => ({
    '/sales': location.pathname.startsWith('/sales'),
    '/purchase': location.pathname.startsWith('/purchase'),
    '/reports': location.pathname.startsWith('/reports'),
  }));

  const onSectionToggle = (path: string) => {
    setExpandedSections(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    clearProfile();
    logout();
    navigate('/login', { replace: true });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Load profile once and keep in context; redirect to onboarding if no organisation profile.
  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  useEffect(() => {
    if (loading) return;
    if (profiles.length === 0) {
      navigate('/onboarding/business', { replace: true });
    }
  }, [loading, profiles.length, navigate]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: false } : n))
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileOpen]);

  return (
    <div className='min-h-screen bg-gray-50/80 dark:bg-gray-900 flex'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type='button'
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity'
          aria-label='Close menu'
        />
      )}

      {/* Sidebar - drawer on mobile, fixed on desktop; full height to bottom of viewport */}
      <aside
        className={`fixed top-0 left-0 z-30 min-h-screen h-full w-[272px] bg-white dark:bg-gray-800 border-r border-gray-200/90 dark:border-gray-700 flex flex-col shrink-0 transition-transform duration-200 ease-out lg:relative lg:translate-x-0 lg:shadow-sidebar ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between p-3 border-b border-gray-200/80 dark:border-gray-700 lg:hidden'>
          <span className='font-semibold text-gray-900 dark:text-gray-100'>
            Menu
          </span>
          <button
            type='button'
            onClick={() => setSidebarOpen(false)}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            aria-label='Close menu'
          >
            <X className='h-5 w-5 text-gray-700 dark:text-gray-300' />
          </button>
        </div>
        {/* Business name & email block – only logo and name link to company settings */}
        <div className='flex items-center gap-3 px-4 py-4 border-b border-gray-200/80 dark:border-gray-700 shrink-0 bg-gray-50/50 dark:bg-gray-800/80'>
          <div className='flex gap-2 items-center min-w-0 flex-1'>
            <Link
              to='/settings/company'
              className='flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 shrink-0 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors'
              aria-label='Edit company information'
            >
              <Briefcase className='h-5 w-5 text-primary-600 dark:text-primary-400' />
            </Link>
            <div className='flex flex-col justify-center min-w-0'>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100 leading-5 truncate flex items-center gap-1.5 flex-wrap'>
                <Link
                  to='/settings/company'
                  className='truncate hover:underline focus:underline outline-none'
                  aria-label='Edit company information'
                >
                  {profiles[0]?.organisation_name ?? 'Business name'}
                </Link>
                {profiles[0]?.role_name && (
                  <>
                    <span
                      className='text-gray-400 dark:text-gray-500 shrink-0'
                      aria-hidden
                    >
                      ·
                    </span>
                    <span className='text-xs font-normal text-gray-500 dark:text-gray-400 shrink-0 capitalize'>
                      {profiles[0].role_name}
                    </span>
                  </>
                )}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 leading-4 truncate'>
                {user?.email ?? '—'}
              </p>
            </div>
          </div>
          <div
            className='flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shrink-0 shadow-input'
            aria-hidden
          >
            <ChevronDown className='h-3.5 w-3.5 text-gray-500 dark:text-gray-400' />
          </div>
        </div>
        <nav className='p-4 flex-1 overflow-y-auto flex flex-col gap-2'>
          <NavContent
            location={location}
            onNavClick={() => setSidebarOpen(false)}
            expandedSections={expandedSections}
            onSectionToggle={onSectionToggle}
          />
        </nav>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Header */}
        <header className='sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-700 px-4 py-3 sm:px-5 md:px-6 flex flex-wrap items-center gap-2 sm:gap-4 shadow-header'>
          <button
            type='button'
            onClick={() => setSidebarOpen(true)}
            className='p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl lg:hidden transition-colors'
            aria-label='Open menu'
          >
            <Menu className='h-5 w-5' />
          </button>
          <div className='flex-1 min-w-0 w-full sm:w-auto order-last sm:order-none sm:max-w-md md:max-w-lg lg:max-w-xl'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500 pointer-events-none' />
              <input
                type='search'
                placeholder='Search...'
                className='input-field pl-9 py-2.5 text-sm w-full bg-gray-50/80 dark:bg-gray-700/80 border-gray-200/90 dark:border-gray-600'
              />
            </div>
          </div>
          <div className='hidden lg:block flex-1 min-w-0' aria-hidden />
          <div className='flex items-center gap-1 sm:gap-2'>
            <button
              type='button'
              onClick={toggleTheme}
              className='p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors'
              aria-label={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? (
                <Sun className='h-5 w-5' />
              ) : (
                <Moon className='h-5 w-5' />
              )}
            </button>
            <button
              type='button'
              onClick={() => setShowNotificationsPanel(true)}
              className='relative p-2.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-colors'
              aria-label={
                unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : 'Notifications'
              }
            >
              <Bell className='h-5 w-5' />
              {unreadCount > 0 && (
                <span className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-semibold text-white bg-red-500 rounded-full'>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            <button
              type='button'
              onClick={() => setShowKnowledgePanel(true)}
              className='p-2.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-colors'
              aria-label='Knowledge base'
            >
              <HelpCircle className='h-5 w-5' />
            </button>
            <div className='relative' ref={profileRef}>
              <button
                type='button'
                onClick={() => setProfileOpen(v => !v)}
                className='flex shrink-0 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary-200 transition-shadow w-9 h-9 bg-gray-200 dark:bg-gray-700 flex items-center justify-center'
                aria-label='Profile'
                aria-expanded={profileOpen}
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=''
                    className='w-full h-full object-cover'
                    width={36}
                    height={36}
                  />
                ) : (
                  <span
                    className='text-xs font-semibold text-gray-600 dark:text-gray-300'
                    aria-hidden
                  >
                    {user
                      ? profileInitials(
                          user.first_name ?? '',
                          user.last_name ?? '',
                          user.email ?? ''
                        )
                      : '?'}
                  </span>
                )}
              </button>
              {profileOpen && (
                <div className='absolute right-0 top-full mt-2 w-72 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-50'>
                  <div className='flex gap-3 px-4 py-3'>
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=''
                        className='w-12 h-12 rounded-full object-cover shrink-0'
                      />
                    ) : (
                      <div className='w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 text-sm font-semibold text-gray-600 dark:text-gray-300'>
                        {user
                          ? profileInitials(
                              user.first_name ?? '',
                              user.last_name ?? '',
                              user.email ?? ''
                            )
                          : '?'}
                      </div>
                    )}
                    <div className='min-w-0'>
                      <p className='font-semibold text-gray-900 dark:text-gray-100 truncate'>
                        {user
                          ? `${user.first_name} ${user.last_name}`.trim() ||
                            user.email
                          : '—'}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                        {user?.email ?? '—'}
                      </p>
                    </div>
                  </div>
                  <div className='border-t border-gray-100 dark:border-gray-700'>
                    <Link
                      to='/settings/personal'
                      onClick={() => setProfileOpen(false)}
                      className='flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      <UserCircle className='h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0' />
                      View profile
                    </Link>
                    <Link
                      to='/settings'
                      onClick={() => setProfileOpen(false)}
                      className='flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      <Cog className='h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0' />
                      Account settings
                    </Link>
                  </div>
                  <div className='border-t border-gray-100 dark:border-gray-700'>
                    <button
                      type='button'
                      onClick={() => {
                        setProfileOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className='flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      <LogOut className='h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0' />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className='flex-1 p-4 sm:p-6 md:p-8 overflow-auto'>
          <Outlet />
        </main>
      </div>

      <NotificationsPanel
        open={showNotificationsPanel}
        onClose={() => setShowNotificationsPanel(false)}
        notifications={notificationsWithCurrency}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
      />

      <KnowledgeBasePanel
        open={showKnowledgePanel}
        onClose={() => setShowKnowledgePanel(false)}
      />

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <>
          <div
            className='fixed inset-0 z-50 bg-black/50'
            onClick={() => setShowLogoutConfirm(false)}
            aria-hidden
          />
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='logout-dialog-title'
            className='fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-600'
          >
            <h2
              id='logout-dialog-title'
              className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'
            >
              Log out?
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-300 mb-6'>
              Are you sure you want to log out of your account?
            </p>
            <div className='flex justify-end gap-3'>
              <button
                type='button'
                onClick={() => setShowLogoutConfirm(false)}
                className='px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleLogout}
                className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors'
              >
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
