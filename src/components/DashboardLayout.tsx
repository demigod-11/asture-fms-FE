import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  FileText,
  Receipt,
  Settings,
  Users,
  Cog,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  MessageCircle,
  Plus,
  LogOut,
  Menu,
  X,
  FileSpreadsheet,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const salesLedgerChildren = [
  { label: 'Invoice', path: '/sales/invoice', icon: FileSpreadsheet },
  { label: 'Customers', path: '/sales/customers', icon: UserCircle },
];

const mainNav = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Sales ledger', path: '/sales', icon: BookOpen, hasDropdown: true, children: salesLedgerChildren },
  { label: 'Purchase ledger', path: '/purchase', icon: ShoppingCart, hasDropdown: true },
  { label: 'Reports', path: '/reports', icon: FileText, hasDropdown: true },
  { label: 'Transactions', path: '/transactions', icon: Receipt },
  { label: 'Configuration', path: '/configuration', icon: Settings },
];

const managementNav = [
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Integration', path: '/integration', icon: Cog },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Trash', path: '/trash', icon: Trash2 },
];

const NavContent: React.FC<{
  location: ReturnType<typeof useLocation>;
  onNavClick?: () => void;
  salesLedgerExpanded: boolean;
  onSalesLedgerToggle: () => void;
}> = ({ location, onNavClick, salesLedgerExpanded, onSalesLedgerToggle }) => {
  const salesExpanded = salesLedgerExpanded || location.pathname.startsWith('/sales');
  return (
    <>
      <p className='px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
        Main
      </p>
      {mainNav.map((item) => {
        const hasChildren = 'children' in item && item.children?.length;
        const isParentActive = hasChildren && item.children?.some((c: { path: string }) => location.pathname === c.path);
        const isActive = !hasChildren && (location.pathname === item.path || (item.path === '/' && location.pathname === '/home'));
        const Icon = item.icon;
        if (hasChildren && item.children?.length) {
          return (
            <div key={item.path}>
              <button
                type='button'
                onClick={onSalesLedgerToggle}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isParentActive ? 'text-gray-900' : 'text-gray-700 hover:bg-gray-200/70'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <Icon className='h-5 w-5 shrink-0 text-gray-500' />
                  {item.label}
                </span>
                {salesExpanded ? (
                  <ChevronUp className='h-4 w-4 text-gray-400 shrink-0' />
                ) : (
                  <ChevronDown className='h-4 w-4 text-gray-400 shrink-0' />
                )}
              </button>
              {salesExpanded && (
                <div className='ml-4 mt-0.5 space-y-0.5 border-l border-gray-200 pl-2'>
                  {item.children.map((child: { label: string; path: string; icon: React.ElementType }) => {
                    const ChildIcon = child.icon;
                    const childActive = location.pathname === child.path;
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={onNavClick}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                          childActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200/70'
                        }`}
                      >
                        <ChildIcon className='h-4 w-4 shrink-0 text-gray-500' />
                        {child.label}
                      </Link>
                    );
                  })}
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
            className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200/70'
            }`}
          >
            <span className='flex items-center gap-2'>
              <Icon className='h-5 w-5 shrink-0 text-gray-500' />
              {item.label}
            </span>
            {item.hasDropdown && <ChevronDown className='h-4 w-4 text-gray-400 shrink-0' />}
          </Link>
        );
      })}
    <p className='px-3 py-2 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
      Management
    </p>
    {managementNav.map((item) => {
      const Icon = item.icon;
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={onNavClick}
          className='flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200/70 transition-colors'
        >
          <Icon className='h-5 w-5 shrink-0 text-gray-500' />
          {item.label}
        </Link>
      );
    })}
  </>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salesLedgerExpanded, setSalesLedgerExpanded] = useState(() => location.pathname.startsWith('/sales'));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type='button'
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 z-20 bg-black/50 lg:hidden'
          aria-label='Close menu'
        />
      )}

      {/* Sidebar - drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-56 bg-gray-100 border-r border-gray-200 flex flex-col shrink-0 transition-transform duration-200 ease-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between p-3 border-b border-gray-200 lg:hidden'>
          <span className='font-semibold text-gray-900'>Menu</span>
          <button
            type='button'
            onClick={() => setSidebarOpen(false)}
            className='p-2 rounded-lg hover:bg-gray-200'
            aria-label='Close menu'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        <nav className='p-3 space-y-1 flex-1 overflow-y-auto'>
          <NavContent
            location={location}
            onNavClick={() => setSidebarOpen(false)}
            salesLedgerExpanded={salesLedgerExpanded}
            onSalesLedgerToggle={() => setSalesLedgerExpanded((v) => !v)}
          />
        </nav>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Header - responsive: on large screens icons at end */}
        <header className='sticky top-0 z-10 bg-white border-b border-gray-200 px-3 py-3 sm:px-4 md:px-6 flex flex-wrap items-center gap-2 sm:gap-4'>
          <button
            type='button'
            onClick={() => setSidebarOpen(true)}
            className='p-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden'
            aria-label='Open menu'
          >
            <Menu className='h-5 w-5' />
          </button>
          <div className='flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0'>
            <span className='text-sm font-semibold text-gray-900 truncate'>Business name</span>
            <span className='text-xs text-gray-500 truncate hidden sm:inline'>email@example</span>
            <ChevronDown className='h-4 w-4 text-gray-400 shrink-0 hidden sm:block' aria-hidden />
          </div>
          <div className='flex-1 min-w-0 w-full sm:w-auto sm:max-w-xs md:max-w-md order-last sm:order-none lg:flex-none lg:max-w-sm'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='search'
                placeholder='Search...'
                className='input-field pl-9 py-2 text-sm w-full'
              />
            </div>
          </div>
          <div className='hidden lg:block flex-1 min-w-0' aria-hidden />
          <div className='flex items-center gap-0 sm:gap-2'>
            <button
              type='button'
              title='Notifications'
              className='p-2 text-[#073E60] hover:bg-primary-50 rounded-md transition-colors'
              aria-label='Notifications'
            >
              <Bell className='h-5 w-5' />
            </button>
            <button
              type='button'
              title='Messages'
              className='p-2 text-[#073E60] hover:bg-primary-50 rounded-md hidden sm:block transition-colors'
              aria-label='Messages'
            >
              <MessageCircle className='h-5 w-5' />
            </button>
            <button
              type='button'
              title='Create'
              className='btn-primary hidden sm:flex items-center gap-1.5 text-sm'
              aria-label='Create'
            >
              <Plus className='h-4 w-4' />
              <span className='hidden md:inline'>Create</span>
            </button>
            <button
              type='button'
              onClick={handleLogout}
              title='Log out'
              className='p-2 text-[#073E60] hover:bg-primary-50 rounded-md transition-colors'
              aria-label='Log out'
            >
              <LogOut className='h-5 w-5' />
            </button>
          </div>
        </header>

        <main className='flex-1 p-4 sm:p-6 overflow-auto'>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
