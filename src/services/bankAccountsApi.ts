/**
 * Bank accounts API. All requests require X-Organisation-Id.
 */
import { apiClient } from './apiClient';

export interface BankAccountResponse {
  id: string;
  organisation_id: string;
  name: string;
  bank_name: string | null;
  account_number: string | null;
  currency: string;
  opening_balance: string | number;
  current_balance: string | number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  is_deleted?: boolean;
}

export interface BankAccountListResponse {
  items: BankAccountResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

const BANK_ACCOUNTS = '/bank-accounts';

export async function listBankAccounts(
  organisationId: string,
  params?: { page?: number; page_size?: number; is_active?: boolean }
): Promise<BankAccountListResponse> {
  const { data } = await apiClient.get<BankAccountListResponse>(BANK_ACCOUNTS, {
    params: {
      page: params?.page ?? 1,
      page_size: params?.page_size ?? 100,
      is_active: params?.is_active ?? undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}
