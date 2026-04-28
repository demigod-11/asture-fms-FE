import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const TAB_BASE =
  'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px rounded-t-lg';
const TAB_ACTIVE =
  'border-primary-600 text-primary-600 dark:text-primary-400 bg-primary-50/30 dark:bg-primary-900/30';
const TAB_INACTIVE =
  'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-gray-700/50';

function getTabClassName(active: boolean): string {
  return `${TAB_BASE} ${active ? TAB_ACTIVE : TAB_INACTIVE}`;
}

/** Router-based tab: navigates to path */
export interface ModuleTabRoute {
  path: string;
  label: string;
  /** NavLink end. Default false for nested routes. */
  end?: boolean;
}

/** State-based tab: controlled by parent */
export interface ModuleTabState {
  id: string;
  label: string;
}

export type ModuleTabsProps =
  | {
      variant: 'router';
      tabs: ModuleTabRoute[];
      ariaLabel: string;
      /** Optional: custom active state (e.g. when path matches multiple routes). */
      getIsActive?: (path: string) => boolean;
    }
  | {
      variant: 'state';
      tabs: ModuleTabState[];
      activeId: string;
      onTabChange: (id: string) => void;
      ariaLabel: string;
    };

/**
 * Reusable module tabs: same look and dark mode across Sales, Purchase, Reports, Transactions, Users.
 * Use variant="router" for path-based tabs (NavLink), variant="state" for controlled tabs (button).
 */
const ModuleTabs: React.FC<ModuleTabsProps> = props => {
  const { ariaLabel } = props;
  const navClassName =
    'flex gap-0.5 border-b border-gray-200/90 dark:border-gray-700';

  if (props.variant === 'router') {
    const { tabs, getIsActive } = props;
    return (
      <nav className={navClassName} aria-label={ariaLabel}>
        {getIsActive
          ? tabs.map(tab => {
              const active = getIsActive(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={getTabClassName(active)}
                >
                  {tab.label}
                </Link>
              );
            })
          : tabs.map(tab => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end ?? false}
                className={({ isActive }) => getTabClassName(isActive)}
              >
                {tab.label}
              </NavLink>
            ))}
      </nav>
    );
  }

  const { tabs, activeId, onTabChange } = props;
  return (
    <nav className={navClassName} aria-label={ariaLabel} role='tablist'>
      {tabs.map(tab => (
        <button
          key={tab.id}
          type='button'
          role='tab'
          aria-selected={activeId === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={getTabClassName(activeId === tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default ModuleTabs;
