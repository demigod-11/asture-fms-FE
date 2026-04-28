/**
 * Bank transactions API. All requests require X-Organisation-Id.
 */
import { apiClient } from './apiClient';

export interface BankTransactionResponse {
  id: string;
  organisation_id: string;
  bank_account_id: string;
  coa_id: string | null;
  txn_date: string;
  description: string;
  reference: string | null;
  amount: string | number;
  balance_after: string | number | null;
  is_reconciled: boolean;
  reconciliation_id: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  is_deleted?: boolean;
}

export interface BankTransactionListResponse {
  items: BankTransactionResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ListBankTransactionsParams {
  page?: number;
  page_size?: number;
  bank_account_id?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  is_reconciled?: boolean | null;
}

const BANK_TRANSACTIONS = '/bank-transactions';

export async function listBankTransactions(
  organisationId: string,
  params: ListBankTransactionsParams = {}
): Promise<BankTransactionListResponse> {
  const { data } = await apiClient.get<BankTransactionListResponse>(
    BANK_TRANSACTIONS,
    {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
        bank_account_id: params.bank_account_id ?? undefined,
        from_date: params.from_date ?? undefined,
        to_date: params.to_date ?? undefined,
        is_reconciled: params.is_reconciled ?? undefined,
      },
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  return data;
}

export async function updateBankTransaction(
  organisationId: string,
  transactionId: string,
  body: {
    reconciliation_id?: string | null;
    is_reconciled?: boolean;
    description?: string | null;
    reference?: string | null;
    amount?: string | number | null;
    txn_date?: string | null;
  }
): Promise<BankTransactionResponse> {
  const { data } = await apiClient.patch<{ data?: BankTransactionResponse }>(
    `${BANK_TRANSACTIONS}/${transactionId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update failed');
  return data.data;
}
