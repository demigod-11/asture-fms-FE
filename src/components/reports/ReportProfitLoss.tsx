import React, { useState } from 'react';
import ReportToolbar, { getDefaultReportToolbarState } from './ReportToolbar';
import CollapsibleReportSection from './CollapsibleReportSection';

const formatNgn = (n: number) =>
  `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ReportProfitLoss: React.FC = () => {
  const [toolbarState, setToolbarState] = useState(
    getDefaultReportToolbarState
  );
  const comparative = toolbarState.compareEnabled;

  return (
    <div className='space-y-4'>
      <ReportToolbar state={toolbarState} onStateChange={setToolbarState} />

      <div className='card'>
        <h3 className='text-sm font-semibold text-gray-700 mb-4'>
          Profit & Loss for May 2024 to April 2025
        </h3>

        {!comparative ? (
          <div className='space-y-0'>
            <CollapsibleReportSection
              title='REVENUE/INCOME'
              total={formatNgn(9510)}
              defaultOpen
            >
              <div className='pl-6 space-y-1 text-sm'>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Tuition & Fees 1100</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(5610)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Library & Lab Fees 1200</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(1200)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>
                    Sports & Extracurricular 1300
                  </span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(800)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Miscellaneous Fees 1400</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(400)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Donations & Grants 1500</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(1500)}
                  </span>
                </div>
              </div>
            </CollapsibleReportSection>
            <CollapsibleReportSection
              title='COST OF SERVICES'
              total={formatNgn(500)}
              defaultOpen
            >
              <div className='pl-6 space-y-1 text-sm'>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Direct Materials 2100</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(350)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Event Costs 2200</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(150)}
                  </span>
                </div>
              </div>
            </CollapsibleReportSection>
            <div className='flex justify-between items-center py-3 border-t border-gray-200'>
              <span className='font-semibold text-gray-900'>Gross Profit</span>
              <span className='font-semibold text-gray-900 tabular-nums'>
                {formatNgn(9010)}
              </span>
            </div>
            <p className='text-xs text-gray-500 -mt-2'>
              Total Revenue - Cost of Services
            </p>
            <CollapsibleReportSection
              title='OPERATING EXPENSES'
              total={formatNgn(8500)}
              defaultOpen
            >
              <div className='pl-6 space-y-1 text-sm'>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Salaries & Wages 3100</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(5500)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Employee Benefits 3200</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(1200)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>Utilities 3300</span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(250)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>
                    Maintenance & Repairs 3400
                  </span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(300)}
                  </span>
                </div>
                <div className='flex justify-between py-1'>
                  <span className='text-gray-700'>
                    Supplies & Stationery 3500
                  </span>
                  <span className='tabular-nums text-gray-900'>
                    {formatNgn(150)}
                  </span>
                </div>
              </div>
            </CollapsibleReportSection>
            <div className='flex justify-between items-center py-3 border-t border-gray-200'>
              <span className='font-semibold text-gray-900'>
                Operating Income
              </span>
              <span className='font-semibold text-gray-900 tabular-nums'>
                {formatNgn(510)}
              </span>
            </div>
            <p className='text-xs text-gray-500 -mt-2'>
              Gross Profit - Op. Expenses
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[500px] text-sm'>
              <thead>
                <tr className='text-left text-gray-600 font-medium border-b border-gray-200'>
                  <th className='py-2 pr-4'>Category</th>
                  <th className='py-2 px-2 text-right'>Apr 2025</th>
                  <th className='py-2 px-2 text-right'>Apr 2024</th>
                  <th className='py-2 pl-2 text-right'>% of Income</th>
                </tr>
              </thead>
              <tbody className='text-gray-700'>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4 font-medium text-gray-900'>
                    Tuition & Fees (1100)
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(5610)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(5200)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>59.03%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Library & Lab Fees (1200)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(1200)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(1100)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>12.62%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Sports & Extracurricular (1300)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(800)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(750)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>8.42%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Miscellaneous Fees (1400)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(400)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(350)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>4.21%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Donations & Grants (1500)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(1500)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(1200)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>15.79%</td>
                </tr>
                <tr className='border-b-2 border-gray-200 bg-gray-50/50'>
                  <td className='py-2 pr-4 font-semibold text-gray-900'>
                    Total Revenue/Income
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(9510)}
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(8600)}
                  </td>
                  <td className='py-2 pl-2 text-right font-semibold tabular-nums'>
                    100.00%
                  </td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Direct Materials (2100)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(350)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(350)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>3.68%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Event Cost (2200)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(150)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(150)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>1.58%</td>
                </tr>
                <tr className='border-b-2 border-gray-200 bg-gray-50/50'>
                  <td className='py-2 pr-4 font-semibold text-gray-900'>
                    Total Cost Of Services
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(500)}
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(430)}
                  </td>
                  <td className='py-2 pl-2 text-right font-semibold tabular-nums'>
                    5.26%
                  </td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4 font-semibold text-gray-900'>
                    Gross Profit
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(9010)}
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(8170)}
                  </td>
                  <td className='py-2 pl-2 text-right font-semibold tabular-nums'>
                    94.74%
                  </td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Salaries & Wages (3100)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(5500)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(5500)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>57.85%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Employee Benefits (3200)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(1200)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(1200)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>12.62%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Utilities (3300)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(250)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(250)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>2.63%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Maintenance & Repairs (3400)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(300)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(300)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>3.16%</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-2 pr-4'>Supplies & Stationery (3500)</td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(150)}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums'>
                    {formatNgn(150)}
                  </td>
                  <td className='py-2 pl-2 text-right tabular-nums'>1.58%</td>
                </tr>
                <tr className='border-b-2 border-gray-200 bg-gray-50/50'>
                  <td className='py-2 pr-4 font-semibold text-gray-900'>
                    Total Operating Expenses
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(8500)}
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(7500)}
                  </td>
                  <td className='py-2 pl-2 text-right font-semibold tabular-nums'>
                    83.26%
                  </td>
                </tr>
                <tr>
                  <td className='py-2 pr-4 font-semibold text-gray-900'>
                    Operating Income
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(510)}
                  </td>
                  <td className='py-2 px-2 text-right font-semibold tabular-nums'>
                    {formatNgn(510)}
                  </td>
                  <td className='py-2 pl-2 text-right font-semibold tabular-nums'>
                    10.19%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportProfitLoss;
