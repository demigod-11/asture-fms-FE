import React, { useState } from 'react';
import ReportToolbar, { getDefaultReportToolbarState } from './ReportToolbar';
import CollapsibleReportSection from './CollapsibleReportSection';

const formatNgn = (n: number) =>
  `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ReportBalanceSheet: React.FC = () => {
  const [toolbarState, setToolbarState] = useState(
    getDefaultReportToolbarState
  );
  return (
    <div className='space-y-4'>
      <ReportToolbar state={toolbarState} onStateChange={setToolbarState} />

      <div className='card'>
        <h3 className='text-sm font-semibold text-gray-700 mb-4'>
          Balance sheet for May 2024 to April 2025
        </h3>

        <div className='space-y-0'>
          <CollapsibleReportSection
            title='ASSETS'
            total={formatNgn(5200)}
            defaultOpen
          >
            <CollapsibleReportSection
              title='Current Assets'
              total={formatNgn(5200)}
              level={1}
            >
              <CollapsibleReportSection
                title='Bank Accounts'
                total={formatNgn(1600)}
                level={2}
              >
                <div className='pl-8 space-y-1 text-sm'>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-700'>Bank Account 1 0000</span>
                    <span className='tabular-nums text-gray-900'>
                      {formatNgn(800)}
                    </span>
                  </div>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-700'>Bank Account 2 0000</span>
                    <span className='tabular-nums text-gray-900'>
                      {formatNgn(400)}
                    </span>
                  </div>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-700'>Petty Cash 0000</span>
                    <span className='tabular-nums text-gray-900'>
                      {formatNgn(400)}
                    </span>
                  </div>
                </div>
              </CollapsibleReportSection>
              <CollapsibleReportSection
                title='Account Receivable'
                total={formatNgn(800)}
                level={2}
              >
                <div className='pl-8 space-y-1 text-sm'>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-700'>
                      Account Receivable 0000
                    </span>
                    <span className='tabular-nums text-gray-900'>
                      {formatNgn(800)}
                    </span>
                  </div>
                </div>
              </CollapsibleReportSection>
              <CollapsibleReportSection
                title='Other Current Assets'
                total={formatNgn(1600)}
                level={2}
              >
                <div className='pl-8 space-y-1 text-sm'>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-700'>Inventory Assets 0000</span>
                    <span className='tabular-nums text-gray-900'>
                      {formatNgn(800)}
                    </span>
                  </div>
                  <CollapsibleReportSection
                    title='Prepaid Expenses'
                    total={formatNgn(800)}
                    level={3}
                    defaultOpen
                  >
                    <div className='pl-8 space-y-1 text-sm'>
                      <div className='flex justify-between py-1'>
                        <span className='text-gray-700'>
                          Prepaid Taxes 0000
                        </span>
                        <span className='tabular-nums text-gray-900'>
                          {formatNgn(800)}
                        </span>
                      </div>
                    </div>
                  </CollapsibleReportSection>
                </div>
              </CollapsibleReportSection>
            </CollapsibleReportSection>
          </CollapsibleReportSection>

          <CollapsibleReportSection
            title='LIABILITIES'
            total={formatNgn(3200)}
            defaultOpen
          >
            <CollapsibleReportSection
              title='Current Liabilities'
              total={formatNgn(2400)}
              level={1}
            >
              <div className='pl-6 space-y-1 text-sm'>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Accounts Payable 0000</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(800)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Accrued Expenses 0000</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(800)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Deferred Revenue 0000</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(800)}
                  </span>
                </div>
              </div>
            </CollapsibleReportSection>
            <CollapsibleReportSection
              title='Other Current Liabilities'
              total={formatNgn(800)}
              level={1}
            >
              <div className='pl-6 space-y-1 text-sm'>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Long-Term Debt 0000</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(800)}
                  </span>
                </div>
              </div>
            </CollapsibleReportSection>
          </CollapsibleReportSection>

          <CollapsibleReportSection
            title='EQUITY'
            total={formatNgn(800)}
            defaultOpen
          >
            <div className='pl-6 space-y-1 text-sm'>
              <div className='flex justify-between py-1'>
                <span className='text-gray-700'>Contributed Capital 0000</span>
                <span className='tabular-nums text-gray-900'>
                  {formatNgn(800)}
                </span>
              </div>
              <div className='flex justify-between py-1'>
                <span className='text-gray-700'>
                  Retained Earnings (Opening) 0000
                </span>
                <span className='tabular-nums text-gray-900'>
                  {formatNgn(800)}
                </span>
              </div>
              <div className='flex justify-between py-1'>
                <span className='text-gray-700'>
                  Net Income for April 2025 0000
                </span>
                <span className='tabular-nums text-gray-900'>
                  {formatNgn(800)}
                </span>
              </div>
              <div className='flex justify-between py-1'>
                <span className='text-gray-700'>
                  Retained Earnings (Closing) 0000
                </span>
                <span className='tabular-nums text-gray-900'>
                  {formatNgn(800)}
                </span>
              </div>
            </div>
          </CollapsibleReportSection>

          <div className='flex justify-between items-center py-3 border-t-2 border-gray-200 mt-2'>
            <span className='font-semibold text-gray-900'>
              Liabilities + Equity
            </span>
            <span className='font-semibold text-gray-900 tabular-nums'>
              {formatNgn(5200)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBalanceSheet;
