import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import ReportToolbar, { getDefaultReportToolbarState } from './ReportToolbar';
import CollapsibleReportSection from './CollapsibleReportSection';
import {
  getExpensesByCategory,
  getProfitLossSnapshot,
  getRevenueByCategory,
} from '@/services/reportsApi';

const ReportProfitLoss: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const [toolbarState, setToolbarState] = useState(
    getDefaultReportToolbarState
  );
  const comparative = toolbarState.compareEnabled;

  const { data: snapshot, isLoading: snapshotLoading } = useQuery(
    [
      'reports',
      'profit-loss',
      organisationId,
      toolbarState.customFrom,
      toolbarState.customTo,
    ],
    () =>
      getProfitLossSnapshot(organisationId, {
        from_date: toolbarState.customFrom,
        to_date: toolbarState.customTo,
      }),
    {
      enabled: Boolean(
        organisationId && toolbarState.customFrom && toolbarState.customTo
      ),
    }
  );

  const { data: revenueBuckets, isLoading: revenueLoading } = useQuery(
    [
      'reports',
      'revenue-by-category',
      organisationId,
      toolbarState.customFrom,
      toolbarState.customTo,
    ],
    () =>
      getRevenueByCategory(organisationId, {
        from_date: toolbarState.customFrom,
        to_date: toolbarState.customTo,
      }),
    {
      enabled: Boolean(
        organisationId && toolbarState.customFrom && toolbarState.customTo
      ),
    }
  );

  const { data: expenseBuckets, isLoading: expenseLoading } = useQuery(
    [
      'reports',
      'expenses-by-category',
      organisationId,
      toolbarState.customFrom,
      toolbarState.customTo,
    ],
    () =>
      getExpensesByCategory(organisationId, {
        from_date: toolbarState.customFrom,
        to_date: toolbarState.customTo,
      }),
    {
      enabled: Boolean(
        organisationId && toolbarState.customFrom && toolbarState.customTo
      ),
    }
  );

  const fromLabel = snapshot?.from_date
    ? new Date(snapshot.from_date).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : '';
  const toLabel = snapshot?.to_date
    ? new Date(snapshot.to_date).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : '';
  const periodLabel =
    fromLabel && toLabel ? `${fromLabel} to ${toLabel}` : 'Select period';

  return (
    <div className='space-y-4'>
      <ReportToolbar state={toolbarState} onStateChange={setToolbarState} />

      <div className='card'>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4'>
          Profit & Loss for {periodLabel}
        </h3>

        {snapshotLoading && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>Loading…</p>
        )}
        {!snapshotLoading && snapshot && (
          <div className='space-y-4 mb-6'>
            <div className='flex flex-wrap gap-6 text-sm'>
              <div>
                <span className='text-gray-500 dark:text-gray-400 block'>
                  Revenue
                </span>
                <span className='font-semibold text-gray-900 dark:text-gray-100 tabular-nums'>
                  {formatCurrency(Number(snapshot.revenue ?? 0))}
                </span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400 block'>
                  Expenses
                </span>
                <span className='font-semibold text-gray-900 dark:text-gray-100 tabular-nums'>
                  {formatCurrency(Number(snapshot.expenses ?? 0))}
                </span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400 block'>
                  Net income
                </span>
                <span className='font-semibold text-gray-900 dark:text-gray-100 tabular-nums'>
                  {formatCurrency(Number(snapshot.net ?? 0))}
                </span>
              </div>
            </div>
          </div>
        )}

        {!comparative ? (
          <div className='space-y-0'>
            <CollapsibleReportSection
              title='REVENUE/INCOME'
              total={formatCurrency(Number(snapshot?.revenue ?? 0))}
              defaultOpen
            >
              <div className='pl-6 space-y-1 text-sm'>
                {revenueLoading ? (
                  <div className='py-2 text-gray-500 dark:text-gray-400'>
                    Loading revenue breakdown…
                  </div>
                ) : (revenueBuckets?.buckets ?? []).length === 0 ? (
                  <div className='py-2 text-gray-500 dark:text-gray-400'>
                    No revenue transactions in this period.
                  </div>
                ) : (
                  (revenueBuckets?.buckets ?? []).map(b => (
                    <div
                      key={b.name}
                      className='flex justify-between py-1 gap-4'
                    >
                      <span className='text-gray-700 dark:text-gray-300'>
                        {b.name}
                      </span>
                      <span className='tabular-nums text-gray-900 dark:text-gray-100'>
                        {formatCurrency(Number(b.amount ?? 0))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CollapsibleReportSection>
            <CollapsibleReportSection
              title='EXPENSES'
              total={formatCurrency(Number(snapshot?.expenses ?? 0))}
              defaultOpen
            >
              <div className='pl-6 space-y-1 text-sm'>
                {expenseLoading ? (
                  <div className='py-2 text-gray-500 dark:text-gray-400'>
                    Loading expense breakdown…
                  </div>
                ) : (expenseBuckets?.buckets ?? []).length === 0 ? (
                  <div className='py-2 text-gray-500 dark:text-gray-400'>
                    No expense transactions in this period.
                  </div>
                ) : (
                  (expenseBuckets?.buckets ?? []).map(b => (
                    <div
                      key={b.name}
                      className='flex justify-between py-1 gap-4'
                    >
                      <span className='text-gray-700 dark:text-gray-300'>
                        {b.name}
                      </span>
                      <span className='tabular-nums text-gray-900 dark:text-gray-100'>
                        {formatCurrency(Number(b.amount ?? 0))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CollapsibleReportSection>
            <div className='flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700'>
              <span className='font-semibold text-gray-900 dark:text-gray-100'>
                Net income
              </span>
              <span className='font-semibold text-gray-900 dark:text-gray-100 tabular-nums'>
                {formatCurrency(Number(snapshot?.net ?? 0))}
              </span>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400 -mt-2'>
              Revenue - Expenses
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[500px] text-sm'>
              <thead>
                <tr className='text-left text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700'>
                  <th className='py-2 pr-4'>Category</th>
                  <th className='py-2 px-2 text-right'>Current period</th>
                  <th className='py-2 pl-2 text-right'>Count</th>
                </tr>
              </thead>
              <tbody className='text-gray-700 dark:text-gray-300'>
                {(revenueBuckets?.buckets ?? []).map(b => (
                  <tr
                    key={`rev-${b.name}`}
                    className='border-b border-gray-100 dark:border-gray-700'
                  >
                    <td className='py-2 pr-4'>{b.name}</td>
                    <td className='py-2 px-2 text-right tabular-nums'>
                      {formatCurrency(Number(b.amount ?? 0))}
                    </td>
                    <td className='py-2 pl-2 text-right tabular-nums'>
                      {b.count ?? 0}
                    </td>
                  </tr>
                ))}
                {(expenseBuckets?.buckets ?? []).map(b => (
                  <tr
                    key={`exp-${b.name}`}
                    className='border-b border-gray-100 dark:border-gray-700'
                  >
                    <td className='py-2 pr-4'>{b.name}</td>
                    <td className='py-2 px-2 text-right tabular-nums'>
                      {formatCurrency(Number(b.amount ?? 0))}
                    </td>
                    <td className='py-2 pl-2 text-right tabular-nums'>
                      {b.count ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportProfitLoss;
