/**
 * Reconciliations API. All requests require X-Organisation-Id.
 */
import { apiClient } from './apiClient';

export interface ReconciliationMatchResponse {
  id: string;
  reconciliation_id: string;
  bank_transaction_id: string;
  statement_line_ref: string | null;
  amount: string | number;
  matched_at: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface ReconciliationResponse {
  id: string;
  organisation_id: string;
  bank_account_id: string;
  statement_ending_date: string;
  statement_ending_balance: string | number;
  status: string;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
  matches: ReconciliationMatchResponse[];
}

export interface ReconciliationListResponse {
  items: ReconciliationResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

const RECONCILIATIONS = '/reconciliations';

export async function startReconciliation(
  organisationId: string,
  body: {
    bank_account_id: string;
    statement_ending_date: string;
    statement_ending_balance: string | number;
  }
): Promise<ReconciliationResponse> {
  const { data } = await apiClient.post<{ data?: ReconciliationResponse }>(
    RECONCILIATIONS,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Start reconciliation failed');
  return data.data;
}

export async function listReconciliations(
  organisationId: string,
  params?: {
    page?: number;
    page_size?: number;
    bank_account_id?: string | null;
    status?: string | null;
  }
): Promise<ReconciliationListResponse> {
  const { data } = await apiClient.get<ReconciliationListResponse>(
    RECONCILIATIONS,
    {
      params: {
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 20,
        bank_account_id: params?.bank_account_id ?? undefined,
        status: params?.status ?? undefined,
      },
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  return data;
}

export async function getReconciliation(
  organisationId: string,
  reconciliationId: string
): Promise<ReconciliationResponse> {
  const { data } = await apiClient.get<{ data?: ReconciliationResponse }>(
    `${RECONCILIATIONS}/${reconciliationId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Reconciliation not found');
  return data.data;
}

export async function addReconciliationMatch(
  organisationId: string,
  reconciliationId: string,
  body: {
    bank_transaction_id: string;
    statement_line_ref?: string | null;
    amount: string | number;
    matched_at: string;
  }
): Promise<ReconciliationResponse> {
  const { data } = await apiClient.post<{ data?: ReconciliationResponse }>(
    `${RECONCILIATIONS}/${reconciliationId}/matches`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Add match failed');
  return data.data;
}

export async function removeReconciliationMatch(
  organisationId: string,
  reconciliationId: string,
  bankTransactionId: string
): Promise<ReconciliationResponse> {
  const { data } = await apiClient.delete<{ data?: ReconciliationResponse }>(
    `${RECONCILIATIONS}/${reconciliationId}/matches/${bankTransactionId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Remove match failed');
  return data.data;
}

export async function updateReconciliation(
  organisationId: string,
  reconciliationId: string,
  body: { status?: string }
): Promise<ReconciliationResponse> {
  const { data } = await apiClient.patch<{ data?: ReconciliationResponse }>(
    `${RECONCILIATIONS}/${reconciliationId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update reconciliation failed');
  return data.data;
}
