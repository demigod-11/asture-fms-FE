import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import ReportToolbar, { getDefaultReportToolbarState } from './ReportToolbar';
import CollapsibleReportSection from './CollapsibleReportSection';
import { getArApSummary, getBankBalancesSummary } from '@/services/reportsApi';

const ReportBalanceSheet: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const [toolbarState, setToolbarState] = useState(
    getDefaultReportToolbarState
  );

  const { data: bankSummary, isLoading: bankLoading } = useQuery(
    ['reports', 'bank-balances', organisationId],
    () => getBankBalancesSummary(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const { data: arApSummary, isLoading: arApLoading } = useQuery(
    ['reports', 'ar-ap-summary', organisationId],
    () => getArApSummary(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const bankAccounts = bankSummary?.accounts ?? [];
  const bankTotal = bankAccounts.reduce(
    (sum, a) => sum + Number(a.balance ?? 0),
    0
  );

  const receivablesTotal = Number(arApSummary?.receivables.total ?? 0);
  const payablesTotal = Number(arApSummary?.payables.total ?? 0);

  const assetsTotal = bankTotal + receivablesTotal;
  const liabilitiesTotal = payablesTotal;
  const equityTotal = assetsTotal - liabilitiesTotal;

  return (
    <div className='space-y-4'>
      <ReportToolbar state={toolbarState} onStateChange={setToolbarState} />

      <div className='card'>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4'>
          Balance sheet (computed from bank balances + AR/AP)
        </h3>

        {bankLoading && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>Loading…</p>
        )}
        {arApLoading && !bankLoading && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>Loading…</p>
        )}
        {!bankLoading && !arApLoading && (
          <div className='space-y-0'>
            <CollapsibleReportSection
              title='ASSETS'
              total={formatCurrency(assetsTotal)}
              defaultOpen
            >
              <CollapsibleReportSection
                title='Current Assets'
                total={formatCurrency(assetsTotal)}
                level={1}
              >
                <CollapsibleReportSection
                  title='Bank Accounts'
                  total={formatCurrency(bankTotal)}
                  level={2}
                >
                  <div className='pl-8 space-y-1 text-sm'>
                    {bankAccounts.length === 0 && (
                      <div className='py-2 text-gray-500 dark:text-gray-400'>
                        No bank accounts
                      </div>
                    )}
                    {bankAccounts.map(acc => (
                      <div key={acc.id} className='flex justify-between py-1'>
                        <span className='text-gray-700 dark:text-gray-300'>
                          {acc.name} ({acc.currency})
                        </span>
                        <span className='tabular-nums text-gray-900 dark:text-gray-100'>
                          {formatCurrency(Number(acc.balance ?? 0))}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleReportSection>
                <CollapsibleReportSection
                  title='Accounts Receivable'
                  total={formatCurrency(receivablesTotal)}
                  level={2}
                >
                  <div className='pl-8 space-y-1 text-sm'>
                    <div className='flex justify-between py-1'>
                      <span className='text-gray-700 dark:text-gray-300'>
                        Outstanding invoices
                      </span>
                      <span className='tabular-nums text-gray-900 dark:text-gray-100'>
                        {formatCurrency(receivablesTotal)}
                      </span>
                    </div>
                  </div>
                </CollapsibleReportSection>
              </CollapsibleReportSection>
            </CollapsibleReportSection>

            <CollapsibleReportSection
              title='LIABILITIES'
              total={formatCurrency(liabilitiesTotal)}
              defaultOpen
            >
              <CollapsibleReportSection
                title='Current Liabilities'
                total={formatCurrency(liabilitiesTotal)}
                level={1}
              >
                <div className='pl-6 space-y-1 text-sm'>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Accounts Payable
                    </span>
                    <span className='tabular-nums text-gray-900 dark:text-gray-100'>
                      {formatCurrency(liabilitiesTotal)}
                    </span>
                  </div>
                </div>
              </CollapsibleReportSection>
            </CollapsibleReportSection>

            <CollapsibleReportSection
              title='EQUITY'
              total={formatCurrency(equityTotal)}
              defaultOpen
            >
              <div className='pl-6 space-y-1 text-sm'>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700 dark:text-gray-300'>
                    Net assets (Assets - Liabilities)
                  </span>
                  <span className='tabular-nums text-gray-900 dark:text-gray-100'>
                    {formatCurrency(equityTotal)}
                  </span>
                </div>
              </div>
            </CollapsibleReportSection>

            <div className='flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-700 mt-2'>
              <span className='font-semibold text-gray-900 dark:text-gray-100'>
                Liabilities + Equity
              </span>
              <span className='font-semibold text-gray-900 dark:text-gray-100 tabular-nums'>
                {formatCurrency(liabilitiesTotal + equityTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportBalanceSheet;
