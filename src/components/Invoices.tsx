import React, { useState } from 'react';
import { Search, Upload, Plus, MoreHorizontal, Clock } from 'lucide-react';

type InvoiceStatus = 'Paid' | 'Overdue' | 'Pending' | 'Partially Paid' | 'Draft';

const INVOICE_TABS = ['All Invoice', 'Draft', 'Outstanding', 'Overdue', 'Paid'];

const SAMPLE_ROWS = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    amount: '$1200.00',
    paymentReceived: '$0',
    created: 'Mar 20, 2025 4:59 PM',
    due: 'Due Mar 28, 2025',
    student: 'Michael Brown',
    email: 'guardianemailaddress@hotmail.com',
    status: 'Pending' as InvoiceStatus,
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    amount: '$1200.00',
    paymentReceived: '$0',
    created: 'Mar 20, 2025 4:59 PM',
    due: 'Due Mar 28, 2025',
    student: 'Michael Brown',
    email: 'guardianemailaddress@hotmail.com',
    status: 'Overdue' as InvoiceStatus,
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    amount: '$1200.00',
    paymentReceived: '$1200.00',
    created: 'Mar 18, 2025 2:30 PM',
    due: 'Due Mar 25, 2025',
    student: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Paid' as InvoiceStatus,
  },
];

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const base = 'badge inline-flex items-center gap-1';
  const map: Record<InvoiceStatus, string> = {
    Paid: 'badge-success',
    Overdue: 'badge-error',
    Pending: 'badge-warning',
    'Partially Paid': 'badge-info',
    Draft: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`${base} ${map[status]}`}>
      {status === 'Pending' && <Clock className='h-3 w-3 shrink-0' />}
      {status}
    </span>
  );
}

const Invoices: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Outstanding');
  const [search, setSearch] = useState('');

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h1 className='text-2xl font-bold text-gray-900'>Invoices</h1>
        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-[#073E60] hover:bg-gray-50 transition-colors'
          >
            <Upload className='h-4 w-4' />
            Export
          </button>
          <button
            type='button'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-[#073E60] hover:bg-gray-50 transition-colors'
          >
            <Plus className='h-4 w-4' />
            New invoice
          </button>
        </div>
      </div>

      <div className='card p-0 overflow-hidden'>
        <div className='flex flex-wrap gap-2 p-4 border-b border-gray-200'>
          {INVOICE_TABS.map((tab) => (
            <button
              key={tab}
              type='button'
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                tab === activeTab
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className='p-4 border-b border-gray-200'>
          <div className='relative max-w-xs'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='search'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='input-field pl-9 py-2 text-sm'
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[700px] text-sm' role='grid'>
            <thead>
              <tr className='bg-gray-50 text-left text-gray-600 font-medium'>
                <th className='py-3 px-4'>Invoice Number</th>
                <th className='py-3 px-4'>Amount</th>
                <th className='py-3 px-4'>Payment Received</th>
                <th className='py-3 px-4'>Created</th>
                <th className='py-3 px-4'>Student</th>
                <th className='py-3 px-4'>Status</th>
                <th className='py-3 w-10' aria-label='Actions' />
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.map((row) => (
                <tr
                  key={row.id}
                  className='border-b border-gray-100 hover:bg-gray-50/50 transition-colors'
                >
                  <td className='py-3 px-4 font-medium text-gray-900'>{row.invoiceNumber}</td>
                  <td className='py-3 px-4 text-gray-700'>{row.amount}</td>
                  <td className='py-3 px-4 text-gray-700'>{row.paymentReceived}</td>
                  <td className='py-3 px-4 text-gray-700'>
                    <span className='block'>{row.created}</span>
                    <span className='text-xs text-gray-500 flex items-center gap-1'>
                      <span aria-hidden>↳</span>
                      {row.due}
                    </span>
                  </td>
                  <td className='py-3 px-4'>
                    <span className='block font-medium text-gray-900'>{row.student}</span>
                    <a
                      href={`mailto:${row.email}`}
                      className='text-xs text-[#073E60] hover:underline'
                    >
                      {row.email}
                    </a>
                  </td>
                  <td className='py-3 px-4'>
                    <StatusBadge status={row.status} />
                  </td>
                  <td className='py-3 px-4'>
                    <button
                      type='button'
                      className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded'
                      aria-label='More options'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
