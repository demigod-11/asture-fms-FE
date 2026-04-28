import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import NoOrganisationNotice from '@/components/NoOrganisationNotice';
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Alert from '@/components/Alert';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProfile } from '@/contexts/ProfileContext';
import DateFilterDropdown, {
  getDefaultDateFilterState,
  type DateFilterState,
} from '@/components/reports/DateFilterDropdown';
import { getDateRangeForPreset } from '@/lib/dateFilters';
import {
  getArApSummary,
  getActivityChart,
  getExpensesByCategory,
  getInvoiceStatusBreakdown,
  getRevenueByCategory,
  type ActivityChartResponse,
  type BreakdownItem,
  type ExpensesByCategoryResponse,
  type InvoiceStatusBreakdownResponse,
  type RevenueByCategoryResponse,
} from '@/services/reportsApi';
import {
  listInvoices,
  type InvoiceResponse,
  type InvoiceStatus,
} from '@/services/invoicesApi';

const SUMMARY_CARDS = [
  {
    key: 'revenue' as const,
    title: 'Total Revenue (period)',
    icon: Building2,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  {
    key: 'expenses' as const,
    title: 'Total Expenses (period)',
    icon: Wallet,
    iconBg: 'bg-secondary-200',
    iconColor: 'text-secondary-700',
  },
  {
    key: 'receivables' as const,
    title: 'Pending Invoices',
    icon: FileText,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
  },
  {
    key: 'payables' as const,
    title: 'Overdue Payments',
    icon: FileWarning,
    iconBg: 'bg-error-100',
    iconColor: 'text-error-600',
  },
] as const;

const PIE_COLORS = [
  '#073E60',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#94a3b8',
  '#a855f7',
];

function toNumber(value: number | string | undefined | null): number {
  if (value == null) return 0;
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) ? n : 0;
}

function percentChange(current: number, previous: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function formatPct(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

function toPercentItems(
  buckets: BreakdownItem[],
  fixedColors?: Record<string, string>
): Array<{ name: string; value: number; color: string }> {
  const total = buckets.reduce((sum, b) => sum + toNumber(b.amount), 0);
  return buckets.map((b, idx) => {
    const pct = total > 0 ? Math.round((toNumber(b.amount) / total) * 100) : 0;
    const color =
      fixedColors?.[b.name] ??
      (PIE_COLORS[idx % PIE_COLORS.length] || '#073E60');
    return { name: b.name, value: pct, color };
  });
}

function topNWithOther(buckets: BreakdownItem[], n: number): BreakdownItem[] {
  const sorted = [...buckets].sort(
    (a, b) => toNumber(b.amount) - toNumber(a.amount)
  );
  const head = sorted.slice(0, n);
  const tail = sorted.slice(n);
  if (tail.length === 0) return head;
  const otherAmount = tail.reduce((sum, b) => sum + toNumber(b.amount), 0);
  const otherCount = tail.reduce((sum, b) => sum + (b.count ?? 0), 0);
  return [...head, { name: 'Other', amount: otherAmount, count: otherCount }];
}

interface DashboardInvoiceRow {
  id: string;
  publicId: string;
  amount: number;
  paymentReceived: number;
  created: string;
  due: string;
  customer: string;
  email: string;
  status: InvoiceStatus;
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const classMap: Record<InvoiceStatus, string> = {
    paid: 'badge badge-success',
    overdue: 'badge badge-error',
    sent: 'badge badge-warning',
    partially_paid: 'badge badge-info',
    draft: 'badge bg-gray-100 text-gray-700',
    cancelled: 'badge bg-gray-100 text-gray-500',
  };
  const labelMap: Record<InvoiceStatus, string> = {
    paid: 'Paid',
    overdue: 'Overdue',
    sent: 'Pending',
    partially_paid: 'Partially Paid',
    draft: 'Draft',
    cancelled: 'Cancelled',
  };
  return <span className={classMap[status]}>{labelMap[status]}</span>;
}

const INVOICE_TABS = [
  'All invoices',
  'Draft',
  'Outstanding',
  'Overdue',
  'Paid',
];

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { formatCurrency } = useCurrency();
  const { profiles } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const fromLogin =
    (location.state as { fromLogin?: boolean } | null)?.fromLogin === true;
  const [invoiceTab, setInvoiceTab] = useState(INVOICE_TABS[0]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(fromLogin);
  // Each section controls its own date range (changing one shouldn't change all).
  const [overviewDateFilter, setOverviewDateFilter] = useState<DateFilterState>(
    getDefaultDateFilterState()
  );
  const [paidUnpaidDateFilter, setPaidUnpaidDateFilter] =
    useState<DateFilterState>(getDefaultDateFilterState());
  const [revenueByCategoryDateFilter, setRevenueByCategoryDateFilter] =
    useState<DateFilterState>(getDefaultDateFilterState());
  const [expensesByCategoryDateFilter, setExpensesByCategoryDateFilter] =
    useState<DateFilterState>(getDefaultDateFilterState());

  useEffect(() => {
    if (fromLogin) setShowSuccessAlert(true);
  }, [fromLogin]);

  const dismissWelcomeBanner = () => {
    setShowSuccessAlert(false);
    if (fromLogin) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  };

  const organisationId = profiles[0]?.organisation_id ?? '';

  const { date_from: fromDateStr, date_to: toDateStr } = useMemo(
    () =>
      getDateRangeForPreset(
        overviewDateFilter.preset,
        overviewDateFilter.customFrom,
        overviewDateFilter.customTo
      ),
    [overviewDateFilter]
  );

  const { date_from: paidFromStr, date_to: paidToStr } = useMemo(
    () =>
      getDateRangeForPreset(
        paidUnpaidDateFilter.preset,
        paidUnpaidDateFilter.customFrom,
        paidUnpaidDateFilter.customTo
      ),
    [paidUnpaidDateFilter]
  );
  const { date_from: revCatFromStr, date_to: revCatToStr } = useMemo(
    () =>
      getDateRangeForPreset(
        revenueByCategoryDateFilter.preset,
        revenueByCategoryDateFilter.customFrom,
        revenueByCategoryDateFilter.customTo
      ),
    [revenueByCategoryDateFilter]
  );
  const { date_from: expCatFromStr, date_to: expCatToStr } = useMemo(
    () =>
      getDateRangeForPreset(
        expensesByCategoryDateFilter.preset,
        expensesByCategoryDateFilter.customFrom,
        expensesByCategoryDateFilter.customTo
      ),
    [expensesByCategoryDateFilter]
  );

  const { data: arApSummary } = useQuery(
    ['reports', 'ar-ap', organisationId],
    () => getArApSummary(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const { data: activityChart } = useQuery<ActivityChartResponse | undefined>(
    ['reports', 'activity-chart', organisationId, fromDateStr, toDateStr],
    () =>
      getActivityChart(organisationId, {
        from_date: fromDateStr,
        to_date: toDateStr,
      }),
    { enabled: Boolean(organisationId) }
  );

  // Invoice totals per period for the overview bar chart (client-side aggregation).
  // Invoice totals are included in the backend activity chart buckets (field: invoice).

  // Previous period (same length) for % deltas in Finance overview cards
  const { prevFromStr, prevToStr } = useMemo(() => {
    const from = new Date(fromDateStr);
    const to = new Date(toDateStr);
    const oneDayMs = 24 * 60 * 60 * 1000;
    const spanDays =
      Math.max(0, Math.round((to.getTime() - from.getTime()) / oneDayMs)) + 1;

    const prevTo = new Date(from);
    prevTo.setDate(prevTo.getDate() - 1);
    const prevFrom = new Date(prevTo);
    prevFrom.setDate(prevFrom.getDate() - (spanDays - 1));

    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { prevFromStr: fmt(prevFrom), prevToStr: fmt(prevTo) };
  }, [fromDateStr, toDateStr]);

  const { data: prevActivityChart } = useQuery<
    ActivityChartResponse | undefined
  >(
    ['reports', 'activity-chart', organisationId, prevFromStr, prevToStr],
    () =>
      getActivityChart(organisationId, {
        from_date: prevFromStr,
        to_date: prevToStr,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: invoiceStatusBreakdown } = useQuery<
    InvoiceStatusBreakdownResponse | undefined
  >(
    [
      'reports',
      'invoice-status-breakdown',
      organisationId,
      paidFromStr,
      paidToStr,
    ],
    () =>
      getInvoiceStatusBreakdown(organisationId, {
        from_date: paidFromStr,
        to_date: paidToStr,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: prevInvoiceStatusBreakdown } = useQuery<
    InvoiceStatusBreakdownResponse | undefined
  >(
    [
      'reports',
      'invoice-status-breakdown',
      organisationId,
      prevFromStr,
      prevToStr,
    ],
    () =>
      getInvoiceStatusBreakdown(organisationId, {
        from_date: prevFromStr,
        to_date: prevToStr,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: revenueByCategory } = useQuery<
    RevenueByCategoryResponse | undefined
  >(
    [
      'reports',
      'revenue-by-category',
      organisationId,
      revCatFromStr,
      revCatToStr,
    ],
    () =>
      getRevenueByCategory(organisationId, {
        from_date: revCatFromStr,
        to_date: revCatToStr,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: expensesByCategory } = useQuery<
    ExpensesByCategoryResponse | undefined
  >(
    [
      'reports',
      'expenses-by-category',
      organisationId,
      expCatFromStr,
      expCatToStr,
    ],
    () =>
      getExpensesByCategory(organisationId, {
        from_date: expCatFromStr,
        to_date: expCatToStr,
      }),
    { enabled: Boolean(organisationId) }
  );

  const isDark = theme === 'dark';
  const chartTickFill = isDark ? '#d1d5db' : '#374151';
  const chartStroke = isDark ? '#4b5563' : '#9ca3af';

  const revenueTotal = activityChart
    ? activityChart.periods.reduce(
        (sum: number, p: ActivityChartResponse['periods'][number]) =>
          sum + Number(p.income ?? 0),
        0
      )
    : 0;
  const expensesTotal = activityChart
    ? activityChart.periods.reduce(
        (sum: number, p: ActivityChartResponse['periods'][number]) =>
          sum + Number(p.expense ?? 0),
        0
      )
    : 0;
  const invoiceTotal = arApSummary
    ? Number(arApSummary.receivables.total ?? 0)
    : 0;

  const barChartData =
    activityChart && activityChart.periods.length > 0
      ? activityChart.periods.map(
          (p: ActivityChartResponse['periods'][number]) => ({
            month: p.label,
            revenue: Number(p.income ?? 0),
            expenses: Number(p.expense ?? 0),
          })
        )
      : [];

  const paidUnpaidData = useMemo(() => {
    const buckets = invoiceStatusBreakdown?.buckets ?? [];
    // Align with existing UI labels/colors
    const normalized = buckets.map((b: BreakdownItem) => ({
      ...b,
      name: b.name === 'Overdue' ? 'Over due' : b.name,
    }));
    return toPercentItems(normalized as unknown as BreakdownItem[], {
      Paid: '#22c55e',
      Pending: '#f59e0b',
      'Over due': '#ef4444',
      Other: '#073E60',
    });
  }, [invoiceStatusBreakdown]);

  const revenueByCategoryData = useMemo(() => {
    const buckets = topNWithOther(revenueByCategory?.buckets ?? [], 4);
    return toPercentItems(buckets);
  }, [revenueByCategory]);

  const expensesByCategoryData = useMemo(() => {
    const buckets = topNWithOther(expensesByCategory?.buckets ?? [], 4);
    return toPercentItems(buckets);
  }, [expensesByCategory]);

  const invoiceTotalAmount = useMemo(() => {
    const buckets = invoiceStatusBreakdown?.buckets ?? [];
    return buckets.reduce(
      (sum: number, b: BreakdownItem) => sum + toNumber(b.amount),
      0
    );
  }, [invoiceStatusBreakdown]);

  const prevRevenueTotal = useMemo(() => {
    return prevActivityChart
      ? prevActivityChart.periods.reduce(
          (sum: number, p: ActivityChartResponse['periods'][number]) =>
            sum + Number(p.income ?? 0),
          0
        )
      : 0;
  }, [prevActivityChart]);

  const prevExpensesTotal = useMemo(() => {
    return prevActivityChart
      ? prevActivityChart.periods.reduce(
          (sum: number, p: ActivityChartResponse['periods'][number]) =>
            sum + Number(p.expense ?? 0),
          0
        )
      : 0;
  }, [prevActivityChart]);

  const prevInvoiceTotalAmount = useMemo(() => {
    const buckets = prevInvoiceStatusBreakdown?.buckets ?? [];
    return buckets.reduce(
      (sum: number, b: BreakdownItem) => sum + toNumber(b.amount),
      0
    );
  }, [prevInvoiceStatusBreakdown]);

  const revenueDeltaPct = useMemo(
    () => percentChange(revenueTotal, prevRevenueTotal),
    [revenueTotal, prevRevenueTotal]
  );
  const expensesDeltaPct = useMemo(
    () => percentChange(expensesTotal, prevExpensesTotal),
    [expensesTotal, prevExpensesTotal]
  );
  const invoiceDeltaPct = useMemo(
    () => percentChange(invoiceTotal, prevInvoiceTotalAmount),
    [invoiceTotal, prevInvoiceTotalAmount]
  );

  const revenueTotalAmount = useMemo(() => {
    const buckets = revenueByCategory?.buckets ?? [];
    return buckets.reduce(
      (sum: number, b: BreakdownItem) => sum + toNumber(b.amount),
      0
    );
  }, [revenueByCategory]);

  const expensesTotalAmount = useMemo(() => {
    const buckets = expensesByCategory?.buckets ?? [];
    return buckets.reduce(
      (sum: number, b: BreakdownItem) => sum + toNumber(b.amount),
      0
    );
  }, [expensesByCategory]);

  const { data: recentInvoicesData, isLoading: isRecentInvoicesLoading } =
    useQuery(
      ['dashboard', 'recent-invoices', organisationId],
      () =>
        listInvoices(organisationId, {
          page: 1,
          page_size: 5,
        }),
      { enabled: Boolean(organisationId) }
    );

  const recentInvoiceRows: DashboardInvoiceRow[] = useMemo(() => {
    if (!recentInvoicesData) return [];
    const items = recentInvoicesData.items ?? [];

    const filtered = items.filter((inv: InvoiceResponse) => {
      if (invoiceTab === 'Draft') return inv.status === 'draft';
      if (invoiceTab === 'Overdue') return inv.status === 'overdue';
      if (invoiceTab === 'Paid') return inv.status === 'paid';
      if (invoiceTab === 'Outstanding') {
        return inv.status === 'sent' || inv.status === 'partially_paid';
      }
      return true;
    });

    return filtered.slice(0, 5).map((inv: InvoiceResponse) => {
      const created = inv.created_at || inv.issue_date;
      const createdDisplay = created
        ? new Date(created).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        : '';
      const dueDisplay = inv.due_date
        ? `Due ${new Date(inv.due_date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}`
        : '';

      return {
        id: inv.id,
        publicId: inv.public_id ?? inv.invoice_number,
        amount: Number(inv.total ?? 0),
        paymentReceived: 0,
        created: createdDisplay,
        due: dueDisplay,
        customer: 'Customer',
        email: '',
        status: inv.status,
      };
    });
  }, [recentInvoicesData, invoiceTab]);

  if (!organisationId) {
    return (
      <NoOrganisationNotice>
        No organisation in context. Complete onboarding to view dashboard
        insights.
      </NoOrganisationNotice>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Welcome banner: only after login (verify-otp → /home), not on every overview visit */}
      {showSuccessAlert && (
        <Alert
          variant='success'
          message="You're signed in. Welcome to your dashboard."
          actionLabel='View profile'
          onAction={dismissWelcomeBanner}
          onClose={dismissWelcomeBanner}
        />
      )}

      {/* Summary cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5'>
        {SUMMARY_CARDS.map(card => {
          const Icon = card.icon;
          let value = 0;
          let secondary: string | null = null;

          if (card.key === 'revenue') {
            value = revenueTotal;
          } else if (card.key === 'expenses') {
            value = expensesTotal;
          } else if (card.key === 'receivables' && arApSummary) {
            value = Number(arApSummary.receivables.total ?? 0);
            secondary =
              arApSummary.receivables.overdue_count > 0
                ? `${arApSummary.receivables.overdue_count} overdue`
                : null;
          } else if (card.key === 'payables' && arApSummary) {
            value = Number(arApSummary.payables.total ?? 0);
            secondary =
              arApSummary.payables.overdue_count > 0
                ? `${arApSummary.payables.overdue_count} overdue`
                : null;
          }
          return (
            <div key={card.key} className='card card-hover flex flex-col gap-3'>
              <div className='flex items-start justify-between'>
                <div
                  className={`p-2 rounded-lg ${card.iconBg} ${card.iconColor}`}
                  aria-hidden
                >
                  <Icon className='h-5 w-5' />
                </div>
                {(card.key === 'revenue' || card.key === 'expenses') && (
                  <span className='flex items-center gap-0.5 text-sm font-medium text-success-600'>
                    <TrendingUp className='h-4 w-4' />
                  </span>
                )}
                {(card.key === 'receivables' || card.key === 'payables') &&
                  secondary && (
                    <span className='flex items-center gap-1 text-xs text-warning-600'>
                      <AlertTriangle className='h-3.5 w-3.5' />
                      {secondary}
                    </span>
                  )}
              </div>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                {card.title}
              </p>
              <p className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                {formatCurrency(value)}
              </p>
              {card.key === 'revenue' && (
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Based on bank activity
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Finance overview */}
      <div className='card card-hover overflow-hidden'>
        <div className='flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Finance overview
          </h2>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
              <span className='flex items-center gap-1.5'>
                <span
                  className='w-2.5 h-2.5 rounded-full bg-green-600'
                  aria-hidden
                />
                Revenue
              </span>
              <span className='flex items-center gap-1.5'>
                <span
                  className='w-2.5 h-2.5 rounded-full bg-red-500'
                  aria-hidden
                />
                Expenses
              </span>
              <span className='flex items-center gap-1.5'>
                <span
                  className='w-2.5 h-2.5 rounded-full bg-[#073E60]'
                  aria-hidden
                />
                Invoice
              </span>
            </div>
            <DateFilterDropdown
              state={overviewDateFilter}
              onStateChange={setOverviewDateFilter}
            />
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='p-4 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl border border-gray-200/60 dark:border-gray-600'>
            <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Total Revenue
            </p>
            <p className='text-lg font-semibold text-gray-900 dark:text-gray-100 mt-0.5'>
              {formatCurrency(revenueTotal)}
            </p>
            <p
              className={`text-sm font-medium mt-0.5 ${
                revenueDeltaPct != null && revenueDeltaPct < 0
                  ? 'text-error-600 dark:text-error-400'
                  : 'text-success-600 dark:text-success-400'
              }`}
            >
              {formatPct(revenueDeltaPct)}
            </p>
          </div>
          <div className='p-4 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl border border-gray-200/60 dark:border-gray-600'>
            <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Total Expenses
            </p>
            <p className='text-lg font-semibold text-gray-900 dark:text-gray-100 mt-0.5'>
              {formatCurrency(expensesTotal)}
            </p>
            <p
              className={`text-sm font-medium mt-0.5 ${
                expensesDeltaPct != null && expensesDeltaPct < 0
                  ? 'text-error-600 dark:text-error-400'
                  : 'text-success-600 dark:text-success-400'
              }`}
            >
              {formatPct(expensesDeltaPct)}
            </p>
          </div>
          <div className='p-4 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl border border-gray-200/60 dark:border-gray-600'>
            <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Total Invoice
            </p>
            <p className='text-lg font-semibold text-gray-900 dark:text-gray-100 mt-0.5'>
              {formatCurrency(invoiceTotal)}
            </p>
            <p
              className={`text-sm font-medium mt-0.5 ${
                invoiceDeltaPct != null && invoiceDeltaPct < 0
                  ? 'text-error-600 dark:text-error-400'
                  : 'text-success-600 dark:text-success-400'
              }`}
            >
              {formatPct(invoiceDeltaPct)}
            </p>
          </div>
        </div>
        <div className='h-56 sm:h-64 min-w-0'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={barChartData}
              // Extra padding so axis labels + top ticks don't get clipped.
              margin={{ top: 16, right: 12, left: 24, bottom: 8 }}
              barCategoryGap='12%'
            >
              <CartesianGrid strokeDasharray='3 3' stroke={chartStroke} />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 12, fill: chartTickFill }}
                stroke={chartStroke}
                tickMargin={8}
              />
              <YAxis
                tick={{ fontSize: 12, fill: chartTickFill }}
                stroke={chartStroke}
                tickFormatter={(v: number | string) =>
                  formatCurrency(Number(v ?? 0))
                }
                width={90}
                tickMargin={10}
              />
              <Tooltip
                formatter={(value: number | undefined) =>
                  value != null ? [formatCurrency(value), ''] : ['', '']
                }
                contentStyle={{
                  fontSize: 12,
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: 8,
                  color: isDark ? '#e5e7eb' : '#111827',
                }}
                labelStyle={{ color: isDark ? '#e5e7eb' : '#111827' }}
                itemStyle={{ color: isDark ? '#e5e7eb' : '#111827' }}
                cursor={{
                  fill: isDark
                    ? 'rgba(55, 65, 81, 0.5)'
                    : 'rgba(0, 0, 0, 0.06)',
                  stroke: isDark ? '#4b5563' : '#e5e7eb',
                }}
              />
              {/* Order here sets bar order left-to-right: Revenue (green), Expenses (red) */}
              <Bar
                dataKey='revenue'
                name='Revenue'
                fill='#16a34a'
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey='expenses'
                name='Expenses'
                fill='#ef4444'
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700'>
          <span className='flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300'>
            <span
              className='w-3 h-3 rounded-full bg-green-600 shrink-0'
              aria-hidden
            />
            Revenue
          </span>
          <span className='flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300'>
            <span
              className='w-3 h-3 rounded-full bg-red-500 shrink-0'
              aria-hidden
            />
            Expenses
          </span>
        </div>
      </div>

      {/* Three donut sections */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
        <div className='card card-hover'>
          <div className='flex flex-nowrap items-center justify-between gap-2 mb-4 min-w-0'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-0 truncate'>
              Paid vs Unpaid
            </h2>
            <DateFilterDropdown
              state={paidUnpaidDateFilter}
              onStateChange={setPaidUnpaidDateFilter}
            />
          </div>
          <p className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1'>
            {formatCurrency(invoiceTotalAmount)}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Total Invoices
          </p>
          <div className='flex flex-col items-center'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={paidUnpaidData}
                  cx='50%'
                  cy='50%'
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey='value'
                >
                  {paidUnpaidData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value != null ? [`${value}%`, ''] : ['', '']
                  }
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#fff',
                    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300'>
              {paidUnpaidData.map(d => (
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

        <div className='card card-hover'>
          <div className='flex flex-nowrap items-center justify-between gap-2 mb-4 min-w-0'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-0 truncate'>
              Revenue by category
            </h2>
            <DateFilterDropdown
              state={revenueByCategoryDateFilter}
              onStateChange={setRevenueByCategoryDateFilter}
            />
          </div>
          <p className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1'>
            {formatCurrency(revenueTotalAmount)}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Total Revenue
          </p>
          <div className='flex flex-col items-center'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={revenueByCategoryData}
                  cx='50%'
                  cy='50%'
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey='value'
                >
                  {revenueByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value != null ? [`${value}%`, ''] : ['', '']
                  }
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#fff',
                    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-300'>
              {revenueByCategoryData.map(d => (
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

        <div className='card card-hover'>
          <div className='flex flex-nowrap items-center justify-between gap-2 mb-4 min-w-0'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-0 truncate'>
              Expenses by category
            </h2>
            <DateFilterDropdown
              state={expensesByCategoryDateFilter}
              onStateChange={setExpensesByCategoryDateFilter}
            />
          </div>
          <p className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1'>
            {formatCurrency(expensesTotalAmount)}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Total Expense
          </p>
          <div className='flex flex-col items-center'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={expensesByCategoryData}
                  cx='50%'
                  cy='50%'
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey='value'
                >
                  {expensesByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value != null ? [`${value}%`, ''] : ['', '']
                  }
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#fff',
                    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-300'>
              {expensesByCategoryData.map(d => (
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
      <div className='card card-hover'>
        <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Recent invoice
          </h2>
          <Link
            to='/sales/invoice'
            className='text-sm font-medium text-[#073E60] dark:text-primary-400 hover:underline'
          >
            Go to invoice &gt;
          </Link>
        </div>
        <div className='flex flex-wrap gap-2 mb-4 border-b border-gray-200 dark:border-gray-700'>
          {INVOICE_TABS.map(tab => (
            <button
              key={tab}
              type='button'
              onClick={() => setInvoiceTab(tab)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === invoiceTab
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className='overflow-x-auto'>
          <div className='flex items-center gap-2 mb-3 min-w-[600px]'>
            <div className='relative flex-1 max-w-xs'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
              <input
                type='search'
                placeholder='Search...'
                className='input-field pl-8 py-1.5 text-sm'
              />
            </div>
          </div>
          <table className='w-full min-w-[700px] text-sm' role='grid'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 font-medium'>
                <th className='py-3 pr-4'>Invoice ID</th>
                <th className='py-3 pr-4'>Amount</th>
                <th className='py-3 pr-4'>Payment Received</th>
                <th className='py-3 pr-4'>Created</th>
                <th className='py-3 pr-4'>Customer</th>
                <th className='py-3 pr-4'>Status</th>
                <th className='py-3 w-8' aria-label='Actions' />
              </tr>
            </thead>
            <tbody>
              {isRecentInvoicesLoading && recentInvoiceRows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className='py-4 pr-4 text-sm text-gray-500 dark:text-gray-400'
                  >
                    Loading recent invoices…
                  </td>
                </tr>
              )}
              {!isRecentInvoicesLoading &&
                recentInvoiceRows.map(row => (
                  <tr
                    key={row.id}
                    className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors'
                  >
                    <td className='py-3 pr-4 font-medium text-gray-900 dark:text-gray-100'>
                      <Link
                        to={`/sales/invoice/${row.id}`}
                        className='text-[#073E60] dark:text-primary-400 hover:underline'
                      >
                        {row.publicId}
                      </Link>
                    </td>
                    <td className='py-3 pr-4 text-gray-700 dark:text-gray-300'>
                      {formatCurrency(row.amount)}
                    </td>
                    <td className='py-3 pr-4 text-gray-700 dark:text-gray-300'>
                      {formatCurrency(row.paymentReceived)}
                    </td>
                    <td className='py-3 pr-4 text-gray-700 dark:text-gray-300'>
                      <span className='block'>{row.created}</span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {row.due}
                      </span>
                    </td>
                    <td className='py-3 pr-4 text-gray-700 dark:text-gray-300'>
                      <span className='block font-medium text-gray-900 dark:text-gray-100'>
                        {row.customer}
                      </span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {row.email}
                      </span>
                    </td>
                    <td className='py-3 pr-4'>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className='py-3'>
                      <button
                        type='button'
                        className='p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded'
                        aria-label='More options'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </button>
                    </td>
                  </tr>
                ))}
              {!isRecentInvoicesLoading && recentInvoiceRows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className='py-4 pr-4 text-sm text-gray-500 dark:text-gray-400'
                  >
                    No recent invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
