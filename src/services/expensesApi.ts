/**
 * Expenses API. All requests require X-Organisation-Id.
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type ExpenseListResponse = components['schemas']['ExpenseListResponse'];
type ExpenseResponse = components['schemas']['ExpenseResponse'];
type ExpenseCreateRequest = components['schemas']['ExpenseCreateRequest'];
type ExpenseUpdateRequest = components['schemas']['ExpenseUpdateRequest'];

const EXPENSES = '/expenses';

export type {
  ExpenseResponse,
  ExpenseListResponse,
  ExpenseCreateRequest,
  ExpenseUpdateRequest,
};

export interface ListExpensesParams {
  page?: number;
  page_size?: number;
  vendor_id?: string | null | undefined;
  coa_id?: string | null | undefined;
  from_date?: string | null | undefined;
  to_date?: string | null | undefined;
  payment_status?: string | null | undefined;
}

export async function listExpenses(
  organisationId: string,
  params: ListExpensesParams = {}
): Promise<ExpenseListResponse> {
  const { data } = await apiClient.get<ExpenseListResponse>(EXPENSES, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      vendor_id: params.vendor_id ?? undefined,
      coa_id: params.coa_id ?? undefined,
      from_date: params.from_date ?? undefined,
      to_date: params.to_date ?? undefined,
      payment_status: params.payment_status ?? undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function createExpense(
  organisationId: string,
  body: ExpenseCreateRequest
): Promise<ExpenseResponse> {
  const { data } = await apiClient.post<{ data?: ExpenseResponse | null }>(
    EXPENSES,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create expense failed');
  return data.data;
}

export async function updateExpense(
  organisationId: string,
  expenseId: string,
  body: ExpenseUpdateRequest
): Promise<ExpenseResponse> {
  const { data } = await apiClient.patch<{ data?: ExpenseResponse | null }>(
    `${EXPENSES}/${expenseId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update expense failed');
  return data.data;
}

export async function deleteExpense(
  organisationId: string,
  expenseId: string
): Promise<void> {
  await apiClient.delete(`${EXPENSES}/${expenseId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}
