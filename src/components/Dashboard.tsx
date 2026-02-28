import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Wallet,
  FileText,
  FileWarning,
  TrendingUp,
  AlertTriangle,
  Search,
  MoreHorizontal,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Alert from '@/components/Alert';

const SUMMARY_CARDS = [
  {
    title: 'Total Revenue (YTD)',
    value: '₩120,000',
    change: '+8.5%',
    changeLabel: 'from last month',
    trend: 'up',
    icon: Building2,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  {
    title: 'Total Expenses (YTD)',
    value: '₩70,000',
    change: '+8.5%',
    changeLabel: '+10% from last year',
    trend: 'up',
    icon: Wallet,
    iconBg: 'bg-secondary-200',
    iconColor: 'text-secondary-700',
  },
  {
    title: 'Pending Invoices',
    value: '₩25,000',
    status: 'Urgent Attention Needed',
    statusVariant: 'error' as const,
    icon: FileText,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
  },
  {
    title: 'Overdue Payments',
    value: '₩8,500',
    status: 'Follow-Up Required',
    statusVariant: 'warning' as const,
    icon: FileWarning,
    iconBg: 'bg-error-100',
    iconColor: 'text-error-600',
  },
];

const BAR_DATA = [
  { month: 'Jan', revenue: 8, expenses: 6, invoice: 10 },
  { month: 'Feb', revenue: 12, expenses: 8, invoice: 14 },
  { month: 'Mar', revenue: 10, expenses: 9, invoice: 12 },
  { month: 'Apr', revenue: 15, expenses: 11, invoice: 18 },
  { month: 'May', revenue: 18, expenses: 14, invoice: 20 },
  { month: 'Jun', revenue: 22, expenses: 16, invoice: 24 },
  { month: 'Jul', revenue: 20, expenses: 15, invoice: 22 },
  { month: 'Aug', revenue: 25, expenses: 18, invoice: 28 },
  { month: 'Sep', revenue: 28, expenses: 20, invoice: 30 },
  { month: 'Oct', revenue: 30, expenses: 22, invoice: 32 },
  { month: 'Nov', revenue: 32, expenses: 24, invoice: 35 },
  { month: 'Dec', revenue: 35, expenses: 26, invoice: 38 },
];

const PAID_UNPAID_DATA = [
  { name: 'Paid', value: 45, color: '#22c55e' },
  { name: 'Pending', value: 20, color: '#f59e0b' },
  { name: 'Over due', value: 12, color: '#ef4444' },
  { name: 'Other', value: 23, color: '#073E60' },
];

const REVENUE_BY_CATEGORY = [
  { name: 'Tuition fee', value: 50, color: '#073E60' },
  { name: 'Services', value: 20, color: '#f97316' },
  { name: 'Donation', value: 15, color: '#eab308' },
  { name: 'Others', value: 8, color: '#ef4444' },
  { name: 'Other', value: 7, color: '#94a3b8' },
];

const EXPENSES_BY_CATEGORY = [
  { name: 'Salaries', value: 45, color: '#22c55e' },
  { name: 'Materials', value: 20, color: '#073E60' },
  { name: 'Maintenance', value: 12, color: '#a855f7' },
  { name: 'Others', value: 8, color: '#4c1d95' },
  { name: 'Other', value: 15, color: '#94a3b8' },
];

type InvoiceStatus = 'Paid' | 'Overdue' | 'Pending' | 'Partially Paid';

const INVOICE_ROWS = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    amount: '$1200.00',
    paymentReceived: '$1200.00',
    created: 'Mar 20, 2025 4:59 PM',
    due: 'Due Mar 28, 2025',
    student: 'Michael Brown',
    email: 'guardianemailaddress@hotmail.com',
    status: 'Paid' as InvoiceStatus,
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-001',
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
    id: '4',
    invoiceNumber: 'INV-2023-001',
    amount: '$1200.00',
    paymentReceived: '$1200.00',
    created: 'Mar 20, 2025 4:59 PM',
    due: 'Due Mar 28, 2025',
    student: 'Michael Brown',
    email: 'guardianemailaddress@hotmail.com',
    status: 'Paid' as InvoiceStatus,
  },
  {
    id: '5',
    invoiceNumber: 'INV-2023-001',
    amount: '$1200.00',
    paymentReceived: '$600.00',
    created: 'Mar 20, 2025 4:59 PM',
    due: 'Due Mar 28, 2025',
    student: 'Michael Brown',
    email: 'guardianemailaddress@hotmail.com',
    status: 'Partially Paid' as InvoiceStatus,
  },
];

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, string> = {
    Paid: 'badge badge-success',
    Overdue: 'badge badge-error',
    Pending: 'badge badge-warning',
    'Partially Paid': 'badge badge-info',
  };
  return <span className={map[status]}>{status}</span>;
}

const INVOICE_TABS = ['All invoices', 'Draft', 'Outstanding', 'Overdue', 'Paid'];

const Dashboard: React.FC = () => {
  const [invoiceTab, setInvoiceTab] = useState(INVOICE_TABS[0]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(true);

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Success prompt (Figma 1036-13071) - dismissible */}
      {showSuccessAlert && (
        <Alert
          variant='success'
          message="You're signed in. Welcome to your dashboard."
          actionLabel='View profile'
          onAction={() => setShowSuccessAlert(false)}
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {/* Summary cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4'>
        {SUMMARY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className='card flex flex-col gap-3'>
              <div className='flex items-start justify-between'>
                <div
                  className={`p-2 rounded-lg ${card.iconBg} ${card.iconColor}`}
                  aria-hidden
                >
                  <Icon className='h-5 w-5' />
                </div>
                {'change' in card && card.trend === 'up' && (
                  <span className='flex items-center gap-0.5 text-sm font-medium text-success-600'>
                    <TrendingUp className='h-4 w-4' />
                    {card.change}
                  </span>
                )}
                {'status' in card && (
                  <span
                    className={`flex items-center gap-1 text-xs ${
                      card.statusVariant === 'error'
                        ? 'text-error-600'
                        : 'text-warning-600'
                    }`}
                  >
                    <AlertTriangle className='h-3.5 w-3.5' />
                    {card.status}
                  </span>
                )}
              </div>
              <p className='text-sm font-medium text-gray-500'>{card.title}</p>
              <p className='text-xl font-semibold text-gray-900'>{card.value}</p>
              {'changeLabel' in card && (
                <p className='text-xs text-gray-500'>{card.changeLabel}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Finance overview */}
      <div className='card overflow-hidden'>
        <div className='flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Finance overview</h2>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-3 text-sm'>
              <span className='flex items-center gap-1.5'>
                <span className='w-2.5 h-2.5 rounded-full bg-primary-600' aria-hidden />
                Revenue
              </span>
              <span className='flex items-center gap-1.5'>
                <span className='w-2.5 h-2.5 rounded-full bg-error-400' aria-hidden />
                Expenses
              </span>
              <span className='flex items-center gap-1.5'>
                <span className='w-2.5 h-2.5 rounded-full bg-success-500' aria-hidden />
                Invoice
              </span>
            </div>
            <select className='input-field w-auto py-1.5 text-sm' defaultValue='this-year'>
              <option value='this-year'>This year</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='p-3 bg-gray-50 rounded-lg'>
            <p className='text-xs font-medium text-gray-500 uppercase'>Total Revenue</p>
            <p className='text-lg font-semibold text-gray-900'>₩10,000</p>
            <p className='text-sm text-success-600'>+8.5%</p>
          </div>
          <div className='p-3 bg-gray-50 rounded-lg'>
            <p className='text-xs font-medium text-gray-500 uppercase'>Total Expenses</p>
            <p className='text-lg font-semibold text-gray-900'>₩10,000</p>
            <p className='text-sm text-success-600'>+8.5%</p>
          </div>
          <div className='p-3 bg-gray-50 rounded-lg'>
            <p className='text-xs font-medium text-gray-500 uppercase'>Total Invoice</p>
            <p className='text-lg font-semibold text-gray-900'>₩10,000</p>
            <p className='text-sm text-success-600'>+8.5%</p>
          </div>
        </div>
        <div className='h-56 sm:h-64 min-w-0'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={BAR_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-gray-200' />
              <XAxis dataKey='month' tick={{ fontSize: 12 }} stroke='#9ca3af' />
              <YAxis tick={{ fontSize: 12 }} stroke='#9ca3af' tickFormatter={(v) => `$${v}k`} />
              <Tooltip
                formatter={(value: number | undefined) => (value != null ? [`$${value}k`, ''] : ['', ''])}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey='revenue' name='Revenue' fill='#073E60' radius={[2, 2, 0, 0]} />
              <Bar dataKey='expenses' name='Expenses' fill='#f87171' radius={[2, 2, 0, 0]} />
              <Bar dataKey='invoice' name='Invoice' fill='#22c55e' radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Three donut sections */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
        <div className='card'>
          <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Paid vs Unpaid</h2>
            <select className='input-field w-auto py-1.5 text-sm' defaultValue='last-6'>
              <option value='last-6'>Last 6 months</option>
            </select>
          </div>
          <p className='text-2xl font-semibold text-gray-900 mb-1'>₩280,932</p>
          <p className='text-sm text-gray-500 mb-4'>Total Invoices</p>
          <div className='flex flex-col items-center'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={PAID_UNPAID_DATA}
                  cx='50%'
                  cy='50%'
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey='value'
                >
                  {PAID_UNPAID_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => (value != null ? [`${value}%`, ''] : ['', ''])} />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600'>
              {PAID_UNPAID_DATA.map((d) => (
                <span key={d.name} className='flex items-center gap-1.5'>
                  <span
                    className='w-2.5 h-2.5 rounded-full shrink-0'
                    style={{ backgroundColor: d.color }}
                    aria-hidden
                  />
                  {d.name}: {d.value}%
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Revenue by category</h2>
            <select className='input-field w-auto py-1.5 text-sm' defaultValue='last-6'>
              <option value='last-6'>Last 6 months</option>
            </select>
          </div>
          <p className='text-2xl font-semibold text-gray-900 mb-1'>₩180,932</p>
          <p className='text-sm text-gray-500 mb-4'>Total Revenue</p>
          <div className='flex flex-col items-center'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={REVENUE_BY_CATEGORY}
                  cx='50%'
                  cy='50%'
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey='value'
                >
                  {REVENUE_BY_CATEGORY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => (value != null ? [`${value}%`, ''] : ['', ''])} />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-600'>
              {REVENUE_BY_CATEGORY.map((d) => (
                <span key={d.name} className='flex items-center gap-1.5'>
                  <span
                    className='w-2.5 h-2.5 rounded-full shrink-0'
                    style={{ backgroundColor: d.color }}
                    aria-hidden
                  />
                  {d.name}: {d.value}%
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Expenses by category</h2>
            <select className='input-field w-auto py-1.5 text-sm' defaultValue='last-6'>
              <option value='last-6'>Last 6 months</option>
            </select>
          </div>
          <p className='text-2xl font-semibold text-gray-900 mb-1'>₩80,932</p>
          <p className='text-sm text-gray-500 mb-4'>Total Expense</p>
          <div className='flex flex-col items-center'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={EXPENSES_BY_CATEGORY}
                  cx='50%'
                  cy='50%'
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey='value'
                >
                  {EXPENSES_BY_CATEGORY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => (value != null ? [`${value}%`, ''] : ['', ''])} />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-600'>
              {EXPENSES_BY_CATEGORY.map((d) => (
                <span key={d.name} className='flex items-center gap-1.5'>
                  <span
                    className='w-2.5 h-2.5 rounded-full shrink-0'
                    style={{ backgroundColor: d.color }}
                    aria-hidden
                  />
                  {d.name}: {d.value}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent invoice */}
      <div className='card'>
        <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Recent invoice</h2>
          <Link to='/sales/invoice' className='text-sm font-medium text-[#073E60] hover:underline'>
            Go to invoice &gt;
          </Link>
        </div>
        <div className='flex flex-wrap gap-2 mb-4 border-b border-gray-200'>
          {INVOICE_TABS.map((tab) => (
            <button
              key={tab}
              type='button'
              onClick={() => setInvoiceTab(tab)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === invoiceTab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className='overflow-x-auto'>
          <div className='flex items-center gap-2 mb-3 min-w-[600px]'>
            <div className='relative flex-1 max-w-xs'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='search'
                placeholder='Search...'
                className='input-field pl-8 py-1.5 text-sm'
              />
            </div>
          </div>
          <table className='w-full min-w-[700px] text-sm' role='grid'>
            <thead>
              <tr className='border-b border-gray-200 text-left text-gray-500 font-medium'>
                <th className='py-3 pr-4'>Invoice Number</th>
                <th className='py-3 pr-4'>Amount</th>
                <th className='py-3 pr-4'>Payment Received</th>
                <th className='py-3 pr-4'>Created</th>
                <th className='py-3 pr-4'>Student</th>
                <th className='py-3 pr-4'>Status</th>
                <th className='py-3 w-8' aria-label='Actions' />
              </tr>
            </thead>
            <tbody>
              {INVOICE_ROWS.map((row) => (
                <tr
                  key={row.id}
                  className='border-b border-gray-100 hover:bg-gray-50/50 transition-colors'
                >
                  <td className='py-3 pr-4 font-medium text-gray-900'>{row.invoiceNumber}</td>
                  <td className='py-3 pr-4 text-gray-700'>{row.amount}</td>
                  <td className='py-3 pr-4 text-gray-700'>{row.paymentReceived}</td>
                  <td className='py-3 pr-4 text-gray-700'>
                    <span className='block'>{row.created}</span>
                    <span className='text-xs text-gray-500'>{row.due}</span>
                  </td>
                  <td className='py-3 pr-4 text-gray-700'>
                    <span className='block font-medium text-gray-900'>{row.student}</span>
                    <span className='text-xs text-gray-500'>{row.email}</span>
                  </td>
                  <td className='py-3 pr-4'>
                    <StatusBadge status={row.status} />
                  </td>
                  <td className='py-3'>
                    <button
                      type='button'
                      className='p-1 text-gray-400 hover:text-gray-600 rounded'
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

export default Dashboard;
