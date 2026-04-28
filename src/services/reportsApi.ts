/**
 * Reports API. All requests require X-Organisation-Id.
 *
 * These types are defined locally to avoid depending on regenerated OpenAPI schemas.
 */
import { apiClient } from './apiClient';

export interface ReceivableSummary {
  total: number | string;
  overdue_count: number;
  overdue_amount: number | string;
}

export interface PayableSummary {
  total: number | string;
  overdue_count: number;
  overdue_amount: number | string;
}

export interface ArApSummaryResponse {
  receivables: ReceivableSummary;
  payables: PayableSummary;
}

export interface BankAccountBalanceSummary {
  id: string;
  name: string;
  currency: string;
  balance: number | string;
}

export interface BankBalancesSummaryResponse {
  accounts: BankAccountBalanceSummary[];
}

export interface ActivityChartPoint {
  label: string;
  income: number | string;
  expense: number | string;
  invoice: number | string;
}

export interface ActivityChartResponse {
  periods: ActivityChartPoint[];
}

export interface ProfitLossSnapshotResponse {
  from_date: string;
  to_date: string;
  revenue: number | string;
  expenses: number | string;
  net: number | string;
}

export interface BreakdownItem {
  name: string;
  count: number;
  amount: number | string;
}

export interface InvoiceStatusBreakdownResponse {
  from_date: string | null;
  to_date: string | null;
  buckets: BreakdownItem[];
}

export interface RevenueByCategoryResponse {
  from_date: string | null;
  to_date: string | null;
  buckets: BreakdownItem[];
}

export interface ExpensesByCategoryResponse {
  from_date: string | null;
  to_date: string | null;
  buckets: BreakdownItem[];
}

export interface ArAgingRow {
  customer_id: string;
  customer_name: string;
  current: number | string;
  days_1_30: number | string;
  days_31_60: number | string;
  days_61_90: number | string;
  days_over_90: number | string;
  total: number | string;
}

export interface ArAgingReportResponse {
  as_of: string;
  rows: ArAgingRow[];
  total_current: number | string;
  total_1_30: number | string;
  total_31_60: number | string;
  total_61_90: number | string;
  total_over_90: number | string;
  total_overall: number | string;
}

export interface ApAgingRow {
  vendor_id: string;
  vendor_name: string;
  current: number | string;
  days_1_30: number | string;
  days_31_60: number | string;
  days_61_90: number | string;
  days_over_90: number | string;
  total: number | string;
}

export interface ApAgingReportResponse {
  as_of: string;
  rows: ApAgingRow[];
  total_current: number | string;
  total_1_30: number | string;
  total_31_60: number | string;
  total_61_90: number | string;
  total_over_90: number | string;
  total_overall: number | string;
}

const REPORTS_BASE = '/reports';

export async function getArApSummary(
  organisationId: string
): Promise<ArApSummaryResponse> {
  const { data } = await apiClient.get<{ data?: ArApSummaryResponse | null }>(
    `${REPORTS_BASE}/summary/ar-ap`,
    {
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  if (!data?.data) {
    throw new Error('AR/AP summary not available');
  }
  return data.data;
}

export async function getBankBalancesSummary(
  organisationId: string
): Promise<BankBalancesSummaryResponse> {
  const { data } = await apiClient.get<{
    data?: BankBalancesSummaryResponse | null;
  }>(`${REPORTS_BASE}/summary/bank-balances`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (!data?.data) {
    throw new Error('Bank balances summary not available');
  }
  return data.data;
}

export interface ActivityChartParams {
  from_date: string; // ISO date (YYYY-MM-DD)
  to_date: string; // ISO date
}

export async function getActivityChart(
  organisationId: string,
  params: ActivityChartParams
): Promise<ActivityChartResponse> {
  const { data } = await apiClient.get<{ data?: ActivityChartResponse | null }>(
    `${REPORTS_BASE}/summary/activity-chart`,
    {
      params,
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  if (!data?.data) {
    throw new Error('Activity chart not available');
  }
  return data.data;
}

export interface ProfitLossSnapshotParams {
  from_date: string; // ISO date
  to_date: string; // ISO date
}

export async function getProfitLossSnapshot(
  organisationId: string,
  params: ProfitLossSnapshotParams
): Promise<ProfitLossSnapshotResponse> {
  const { data } = await apiClient.get<{
    data?: ProfitLossSnapshotResponse | null;
  }>(`${REPORTS_BASE}/summary/profit-loss-snapshot`, {
    params,
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (!data?.data) {
    throw new Error('Profit & loss snapshot not available');
  }
  return data.data;
}

export interface BreakdownParams {
  from_date?: string;
  to_date?: string;
}

export async function getInvoiceStatusBreakdown(
  organisationId: string,
  params: BreakdownParams = {}
): Promise<InvoiceStatusBreakdownResponse> {
  const { data } = await apiClient.get<{
    data?: InvoiceStatusBreakdownResponse | null;
  }>(`${REPORTS_BASE}/summary/invoice-status-breakdown`, {
    params: params.from_date && params.to_date ? params : undefined,
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (!data?.data) {
    throw new Error('Invoice status breakdown not available');
  }
  return data.data;
}

export async function getRevenueByCategory(
  organisationId: string,
  params: BreakdownParams = {}
): Promise<RevenueByCategoryResponse> {
  const { data } = await apiClient.get<{
    data?: RevenueByCategoryResponse | null;
  }>(`${REPORTS_BASE}/summary/revenue-by-category`, {
    params: params.from_date && params.to_date ? params : undefined,
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (!data?.data) {
    throw new Error('Revenue by category not available');
  }
  return data.data;
}

export async function getExpensesByCategory(
  organisationId: string,
  params: BreakdownParams = {}
): Promise<ExpensesByCategoryResponse> {
  const { data } = await apiClient.get<{
    data?: ExpensesByCategoryResponse | null;
  }>(`${REPORTS_BASE}/summary/expenses-by-category`, {
    params: params.from_date && params.to_date ? params : undefined,
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (!data?.data) {
    throw new Error('Expenses by category not available');
  }
  return data.data;
}

export interface ArAgingParams {
  as_of?: string; // ISO date
}

export async function getArAgingReport(
  organisationId: string,
  params: ArAgingParams = {}
): Promise<ArAgingReportResponse> {
  const { data } = await apiClient.get<{ data?: ArAgingReportResponse | null }>(
    `${REPORTS_BASE}/ar-aging`,
    {
      params: params.as_of ? { as_of: params.as_of } : undefined,
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  if (!data?.data) {
    throw new Error('A/R aging report not available');
  }
  return data.data;
}

export interface ApAgingParams {
  as_of?: string; // ISO date
}

export async function getApAgingReport(
  organisationId: string,
  params: ApAgingParams = {}
): Promise<ApAgingReportResponse> {
  const { data } = await apiClient.get<{ data?: ApAgingReportResponse | null }>(
    `${REPORTS_BASE}/ap-aging`,
    {
      params: params.as_of ? { as_of: params.as_of } : undefined,
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  if (!data?.data) {
    throw new Error('A/P aging report not available');
  }
  return data.data;
}
